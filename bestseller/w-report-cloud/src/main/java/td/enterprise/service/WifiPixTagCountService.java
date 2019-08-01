package td.enterprise.service;

import org.apache.commons.lang.math.NumberUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.PassengerDateUtil;
import td.enterprise.common.util.RunDateUtil;
import td.enterprise.dao.WifiPixTagCountDao;
import td.enterprise.entity.WifiPixTagCount;
import td.enterprise.page.WifiPixTagCountPage;
import td.enterprise.service.DTO.Tag;

import java.util.*;

/**
 * <br>
 * <b>功能：</b>wifiPix标签统计 WifiPixTagCountService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("wifiPixTagCountService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class WifiPixTagCountService extends BaseService<WifiPixTagCount> {
    public final static Logger logger = Logger.getLogger(WifiPixTagCountService.class);
    public final static String pattern = "yyyy-MM-dd";

    @Autowired
    private WifiPixTagCountDao dao;

    public WifiPixTagCountDao getDao() {
        return dao;
    }

    public List<WifiPixTagCount> queryExists(WifiPixTagCount wifiPixTagCount) {
        return dao.queryExists(wifiPixTagCount);
    }

    public Boolean insertBatch(List<WifiPixTagCount> list) {
        for (WifiPixTagCount wifiPixTagCount : list) {
            dao.insert(wifiPixTagCount);
        }
        return true;
    }

    /**
     * @param map
     * @return
     */
    public List<Tag> queryOften2Go(Map<String, Object> map) {
        List<Tag> list = new ArrayList<>();
        list = convert2Tag(dao.queryOften2Go(map));
        if (list.size() == 0) {
//			map = new RunDateUtil().filter(map, ReportConstants.DateUtilType.WifiPixTagCount);
            map = filter(map);
            list = convert2Tag(dao.queryOften2Go(map));
        }
        return list;
    }

    //	//去数据库中检索有数据的有效日期区间
    private Map<String, Object> filter(Map<String, Object> params) {
        try {
            if (params.containsKey("startDate") && params.containsKey("endDate")) {
                Map<String, String> map = new HashMap<>();
                String startDate = String.valueOf(params.get("startDate"));
                String endDate = String.valueOf(params.get("endDate"));
                logger.info(" ####### filter之前    startDate=" + startDate + ",endDate=" + endDate + " #######");
                //runDate 是endDate的前一天
                Date runDate = DateUtil.addDay2Date(0, DateUtil.format(endDate, pattern));
                int projectId = Integer.valueOf(String.valueOf(params.get("projectId")));
                int crowdId = (int) params.get("crowdId");
                int type = (int) params.get("type");  //增加type参数，精确到每个type类型数据
                map = getValiableRunDate(runDate, startDate, endDate, projectId, crowdId, type);
                if (map.size() > 0) {
                    params.put("startDate", map.get("startDate"));
                    params.put("endDate", map.get("endDate"));
                    // if (map.containsKey("cycleStatistics"))
                    //     params.put("cycleStatistics", map.get("cycleStatistics"));
                    logger.info(" ####### filter之后    startDate=" + map.get("startDate") + ",endDate=" + map.get("endDate") + " #######");
                } else {

                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("getValiableRunDate方法异常, ");
        }
        return params;
    }

    //
//	/**
//	 * 去数据库中检索有数据的有效日期区间。
//	 *
//	 * 前端如果当天数据没有找到，需要减一天重新取数，直到取到为止
//	 *
//	 * @param runDate
//	 * @param startDate
//	 * @param endDate
//	 * @return
//	 */
    @SuppressWarnings("finally")
    public Map<String, String> getValiableRunDate(Date runDate, String startDate, String endDate, int projectId, int crowdId, int type) {
        WifiPixTagCountPage page = new WifiPixTagCountPage();
        Map<String, String> map = new HashMap<>();
        map.put("startDate", startDate);
        map.put("endDate", endDate);
        try {
            int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
            if (dateLength != 30 &&
                    dateLength != 60 &&
                    dateLength != 90 &&
                    dateLength != 180) {
                dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
                // map.put("cycleStatistics", String.valueOf(dateLength));
            }
            WifiPixTagCountPage wifiPixTagCountPage = new WifiPixTagCountPage();
            wifiPixTagCountPage.setRunDate(DateUtil.format(runDate, pattern));
            wifiPixTagCountPage.setCycleStatistics(dateLength);
            wifiPixTagCountPage.setProjectId(projectId);
            wifiPixTagCountPage.setCorwdId(crowdId);
            wifiPixTagCountPage.setType(type);
            //查找同等计算周期下，计算日期在当前参数run_date之前记录
            WifiPixTagCount count = dao.queryLatestRow(wifiPixTagCountPage);
            if (count != null) {
                map.put("startDate", count.getStartDate());
                map.put("endDate", count.getEndDate());
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e);
        } finally {
            return map;
        }
    }

    private List<Tag> convert2Tag(List<WifiPixTagCount> counts) {
        List<Tag> tagList = new ArrayList<>();
        Tag tag = null;
        for (WifiPixTagCount count : counts) {
            tag = new Tag();
            tag.setTag_name(count.getBusinessName());
            tag.setSta_value(String.valueOf(count.getMetricValue()));
            tagList.add(tag);
        }
        return convertProportion(tagList);
    }

    /**
     * 转化比例
     *
     * @param result
     * @return
     */
    private List<Tag> convertProportion(List<Tag> result) {
        float _total = 0;
        for (Tag tag : result) {
            if (NumberUtils.isNumber(tag.getSta_value())) {
                _total += Float.valueOf(tag.getSta_value());
            }
        }
        float value = 0;
        for (Tag tag : result) {
            if (_total == 0) {

            } else if (NumberUtils.isNumber(tag.getSta_value())) {
                value = Float.valueOf(tag.getSta_value()) / _total * 100;
                tag.setSta_value(String.valueOf(value));
            } else {
                tag.setSta_value(String.valueOf((float) 0.0));
            }
        }
        return result;
    }

    public void queryAndInsertSum(String parentProjectId, String runDate) {
        WifiPixTagCountPage page = new WifiPixTagCountPage();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setRunDate(runDate);
        List<WifiPixTagCount> list = dao.queryChildrenSum(page);
        dao.batchDeleteByProjectAndDate(page);

        if (null != list && list.size() > 0) {
            int pointsDataLimit = 1000;//限制条数
            int size = list.size();
            if (pointsDataLimit < size) {
                int part = size / pointsDataLimit;//分批数
                for (int i = 0; i < part; i++) {
                    //1000条
                    List<WifiPixTagCount> listTmp = list.subList(0, pointsDataLimit);
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

    private void batchInsert(List<WifiPixTagCount> list, String parentProjectId, String runDate) {
        for (WifiPixTagCount wifiPixTagCount : list) {
            wifiPixTagCount.setProjectId(Integer.parseInt(parentProjectId));
            wifiPixTagCount.setRunDate(runDate);
        }
        dao.batchInsert(list);
    }

    public void batchSelectAndInsert(String parentProjectId, String runDate) {
        WifiPixTagCountPage page = new WifiPixTagCountPage();
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