package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.RunDateUtil;
import td.enterprise.dao.ProjectDao;
import td.enterprise.dao.TenantTagsCountDao;
import td.enterprise.entity.CityAppIntrestCount;
import td.enterprise.entity.Project;
import td.enterprise.entity.TenantTagsCount;
import td.enterprise.page.CityAppIntrestCountPage;
import td.enterprise.page.TenantTagsCountPage;

import java.text.DecimalFormat;
import java.util.*;

/**
 * <br>
 * <b>功能：</b>人群设备 TenantTagsCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-08-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tenantTagsCountService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantTagsCountService extends BaseService<TenantTagsCount> {
    public final static Logger logger = Logger.getLogger(TenantTagsCountService.class);
    public final static String pattern = "yyyy-MM-dd";
    @Autowired
    private TenantTagsCountDao dao;
    @Autowired
    private CityAppIntrestCountService cityAppIntrestCountService;
    @Autowired
    private ProjectDao projectDao;
    @Autowired
    private CrowdService crowdService;

    public TenantTagsCountDao getDao() {
        return dao;
    }

    /**
     * @param params
     * @return
     */
    public List<TenantTagsCount> selectForRadar(Map params) {
        params.put("startDate", null);
        params.put("endDate", null);
        List<TenantTagsCount> result = getDao().selectForRadar(params);
        int peopleNum = crowdService.getAllCount(params);
        if (result.size() == 0) {
            TenantTagsCountPage page = new TenantTagsCountPage();
            page.setProjectId((Integer) params.get("projectId"));
            page.setCrowdId((Integer) params.get("crowdId"));
            // page.setCycleStatistics((Integer) params.get("cycleStatistics"));
            page.setRunDate((String) params.get("runDate"));
            page = filter(page);

            // params.put("cycleStatistics", page.getCycleStatistics());
            params.put("runDate", page.getRunDate());
            result = getDao().selectForRadar(params);

            //顺推，拿到总人群数
            peopleNum = crowdService.getAllCount(params);
        }
        if (result.size() != 0) {
            TenantTagsCount peopleTag = new TenantTagsCount();
            peopleTag.setTagName("人群总数");
            peopleTag.setTagCode("000000");
            peopleTag.setMetricValue(peopleNum);
            result.add(peopleTag);
        }

        return result;
    }

    /**
     * 城市app提升度
     *
     * @param params
     * @return
     */
    public List<TenantTagsCount> selectAppPreference(Map params) {
        String runDate = (String) params.get("runDate");
        List<TenantTagsCount> result = selectForRadar(params);
        Integer projectId = (Integer) params.get("projectId");
        Project project = projectDao.selectByPrimaryKey(projectId);
        String cityName = project.getCity();
        CityAppIntrestCountPage cityAppIntrestCountPage = new CityAppIntrestCountPage();
        cityAppIntrestCountPage.setCityName(cityName);
        cityAppIntrestCountPage.setPageEnabled(false);
        cityAppIntrestCountPage.setRunDate(runDate);
        List<TenantTagsCount> tenantTagsCountList = new ArrayList<>();
        List<CityAppIntrestCount> cityAppIntrestCountsList = cityAppIntrestCountService.queryListByPage(cityAppIntrestCountPage);
        Map<String, CityAppIntrestCount> cityTagDataMap = new HashMap<>();
        for (CityAppIntrestCount cityAppIntrestCount : cityAppIntrestCountsList) {
            cityTagDataMap.put(cityAppIntrestCount.getTagName(), cityAppIntrestCount);
        }

        TenantTagsCount peopleTag = new TenantTagsCount();
        Double peopleTagMetricValue = 0.0d;
        for (TenantTagsCount count : result) {
            if ("人群总数".equalsIgnoreCase(count.getTagName()) &&
                    "000000".equalsIgnoreCase(count.getTagCode())) {
                peopleTag = count;
                peopleTagMetricValue = Double.valueOf(count.getMetricValue());
            }
        }

        TenantTagsCount tenantTagsCount = null;
        DecimalFormat decimalFormat = new DecimalFormat("#.##");
        for (TenantTagsCount tenantTagsCountObj : result) {
            if (!"000000".equalsIgnoreCase(tenantTagsCountObj.getTagCode())) {
                tenantTagsCount = tenantTagsCountObj;
                Double tagCountMetricValue = Double.valueOf(tenantTagsCountObj.getMetricValue());
                Double tagCountValue = peopleTagMetricValue == 0 ? 0.0d : (tagCountMetricValue / peopleTagMetricValue);
                if (cityTagDataMap.containsKey(tenantTagsCountObj.getTagName())) {
                    CityAppIntrestCount cityAppIntrestCount = cityTagDataMap.get(tenantTagsCountObj.getTagName());
                    int cityAppInMetricValue = cityAppIntrestCount.getMetricValue();
                    Double dvalue = 0.0d;
                    if (cityAppInMetricValue != 0) {
                        logger.info(((tagCountValue * 100) / cityAppInMetricValue) + "  , " + (((tagCountValue * 100) / cityAppInMetricValue) - 1));
                        dvalue = ((tagCountValue * 100) / cityAppInMetricValue) - 1.0d;
                    }
                    tenantTagsCount.setCityPreValue(decimalFormat.format(dvalue * 100));
                } else {
                    //没有匹配到，默认提升度为0
                    tenantTagsCount.setCityPreValue("0.0");
                }
                tenantTagsCountList.add(tenantTagsCount);
            }
        }
        return tenantTagsCountList;
    }

    public List<TenantTagsCount> selectByCodesIn(Map params) {
        return getDao().selectByCodesIn(params);
    }

    public int deleteByParams(TenantTagsCount tenantTagsCount) {
        return getDao().deleteByParams(tenantTagsCount);
    }

    //去数据库中检索有数据的有效日期区间
    private TenantTagsCountPage filter(TenantTagsCountPage page) {
        try {
            Map<String, String> map = new HashMap<>();
            //runDate 是endDate的前一天
            Date runDate = DateUtil.format(page.getRunDate(), pattern);
            map = getValiableRunDate(runDate, page.getCycleStatistics(), page.getTenantId(), page.getProjectId(), page.getCrowdId());
            if (map.size() > 0) {
                //page.setStartDate(map.get("startDate"));
                //page.setEndDate(map.get("endDate"));
                page.setRunDate(map.get("runDate"));
                // if (map.containsKey("cycleStatistics")) {
                //     page.setCycleStatistics(Integer.valueOf(map.get("cycleStatistics")));
                // }
                logger.info(" ####### filter之后 runDate=" + map.get("runDate") + " #######");
            }
        } catch (Exception e) {
            logger.error("getValiableRunDate方法异常, ");
        }

        return page;
    }

    @SuppressWarnings("finally")
    public Map<String, String> getValiableRunDate(Date runDate, Integer cycleStatistics, String tenantId, int projectId, int crowdId) {
        TenantTagsCountPage page = new TenantTagsCountPage();
        Map<String, String> map = new HashMap<>();
        //map.put("startDate", sdf.format(startDate));
        //map.put("endDate", sdf.format(endDate));
        try {
            int dateLength = cycleStatistics;
            if (dateLength != 30 &&
                    dateLength != 60 &&
                    dateLength != 90 &&
                    dateLength != 180) {
                dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
                // map.put("cycleStatistics", String.valueOf(dateLength));
            }
            TenantTagsCountPage tenantJobHousingCountPage = new TenantTagsCountPage();
            tenantJobHousingCountPage.setRunDate(DateUtil.format(runDate, pattern));
            tenantJobHousingCountPage.setCycleStatistics(dateLength);
            tenantJobHousingCountPage.setCrowdId(crowdId);
            tenantJobHousingCountPage.setProjectId(projectId);
            tenantJobHousingCountPage.setTenantId(tenantId);
            //查找同等计算周期下，计算日期在当前参数run_date之前记录
            TenantTagsCount count = dao.queryLatestRow(tenantJobHousingCountPage);
            if (count != null) {
                //map.put("startDate", count.getStartDate());
                //map.put("endDate",  count.getEndDate());
                map.put("runDate", count.getRunDate());
                // map.put("cycleStatistics", String.valueOf(dateLength));
            }
        } catch (Exception e) {
            throw new BusinessException(e);
        } finally {
            return map;
        }
    }

    public void queryAndInsertSum(String parentProjectId, String runDate) {
        TenantTagsCountPage page = new TenantTagsCountPage();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setRunDate(runDate);
        List<TenantTagsCount> list = dao.queryChildrenSum(page);
        dao.batchDeleteByProjectAndDate(page);

        if (null != list && list.size() > 0) {
            int pointsDataLimit = 1000;//限制条数
            int size = list.size();
            if (pointsDataLimit < size) {
                int part = size / pointsDataLimit;//分批数
                for (int i = 0; i < part; i++) {
                    //1000条
                    List<TenantTagsCount> listTmp = list.subList(0, pointsDataLimit);
                    batchInsert(listTmp, parentProjectId, runDate);
                    //移除
                    list.subList(0, pointsDataLimit).clear();
                }
                if (!list.isEmpty()) {
                    batchInsert(list, parentProjectId, runDate);
                }
            } else {
                batchInsert(list, parentProjectId, runDate);
            }
        }
    }

    private void batchInsert(List<TenantTagsCount> list, String parentProjectId, String runDate) {
        for (TenantTagsCount tenantTagsCount : list) {
            tenantTagsCount.setProjectId(Integer.parseInt(parentProjectId));
            tenantTagsCount.setRunDate(runDate);
        }
        dao.batchInsert(list);
    }

    public void batchSelectAndInsert(String parentProjectId, String runDate) {
        TenantTagsCountPage page = new TenantTagsCountPage();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setRunDate(runDate);
        try {
            dao.batchDeleteByProjectAndDate(page);
            dao.batchSelectAndInsert(page);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
