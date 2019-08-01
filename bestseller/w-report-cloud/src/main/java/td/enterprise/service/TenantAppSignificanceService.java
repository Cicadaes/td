package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.PassengerDateUtil;
import td.enterprise.dao.AppInfoDao;
import td.enterprise.dao.TenantAppSignificanceDao;
import td.enterprise.dao.TenantUseAppRoutineDao;
import td.enterprise.entity.AppInfo;
import td.enterprise.entity.TenantAppSignificance;
import td.enterprise.entity.TenantUseAppRoutine;
import td.enterprise.page.TenantAppSignificancePage;
import td.enterprise.page.TenantUseAppRoutinePage;
import td.enterprise.service.DTO.Tag;

import java.util.*;


/**
 * <br>
 * <b>功能：</b>App显著性计算 TenantAppSignificanceService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
@Service("tenantAppSignificanceService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TenantAppSignificanceService extends BaseService<TenantAppSignificance> {
    public final static Logger logger = Logger.getLogger(TenantAppSignificanceService.class);
    private static final String partten = "yyyy-MM-dd";

    @Autowired
    private TenantAppSignificanceDao dao;
    @Autowired
    private TenantUseAppRoutineDao appRoutineDao;

    @Autowired
    private AppInfoDao appInfoDao;

    public TenantAppSignificanceDao getDao() {
        return dao;
    }

    public List<Tag> queryAppUseByList(Map<String, Object> map) {
        TenantUseAppRoutinePage page = new TenantUseAppRoutinePage();
        if (map.containsKey("projectId")) {
            page.setProjectId(Integer.valueOf(String.valueOf(map.get("projectId"))));
        }
        if (map.containsKey("crowdId")) {
            page.setCrowdId(Integer.valueOf(String.valueOf(map.get("crowdId"))));
        }
        // if (map.containsKey("cycleStatistics")) {
        //     page.setCycleStatistics(Integer.valueOf(String.valueOf(map.get("cycleStatistics"))));
        // }
        if (map.containsKey("startDate")) {
            page.setStartDate(String.valueOf(map.get("startDate")));
        }
        if (map.containsKey("endDate")) {
            page.setEndDate(String.valueOf(map.get("endDate")));
        }

        List<TenantUseAppRoutine> result = appRoutineDao.queryByList(page);
        if (result.size() == 0) {

            map = filter(map, true, page.getProjectId(), page.getCrowdId(), null);
            page.setStartDate(String.valueOf(map.get("startDate")));
            page.setEndDate(String.valueOf(map.get("endDate")));
            result = appRoutineDao.queryByList(page);
        }
        List<Tag> tags = new ArrayList<Tag>();
        tags = convertAppUse(result);
        return tags;
    }

    public List<Tag> queryAppTagByList(Map<String, Object> map) {
        logger.info("############# queryAppTagByList map=" + map.toString() + " #############");

        List<TenantAppSignificance> appSignificances = dao.queryAppByList(map);
        if (appSignificances.size() == 0) {
            int projectId = Integer.valueOf(String.valueOf(map.get("projectId")));
            int crowdId = Integer.valueOf(String.valueOf(map.get("crowdId")));
            Object appType = map.get("appType");
            map = filter(map, false, projectId, crowdId, appType);
            appSignificances = dao.queryAppByList(map);
        }
        List<Tag> tags = new ArrayList<Tag>();
        tags = convertAppName(appSignificances);
        return tags;
    }

    public List<Tag> queryAppTagByList2(Map<String, Object> map) {
        logger.info("############# queryAppTagByList map=" + map.toString() + " #############");

        List<TenantAppSignificance> appSignificances = dao.queryAppByList2(map);
        if (appSignificances.size() == 0) {
            int projectId = Integer.valueOf(String.valueOf(map.get("projectId")));
            int crowdId = Integer.valueOf(String.valueOf(map.get("crowdId")));
            Object appType = map.get("appType");
            map = filter(map, false, projectId, crowdId, appType);
            appSignificances = dao.queryAppByList2(map);
        }
        List<Tag> tags = new ArrayList<Tag>();
        tags = convertAppName(appSignificances);
        return tags;
    }

    //去数据库中检索有数据的有效日期区间
    private Map<String, Object> filter(Map<String, Object> params, boolean isAppUseTime, int projectId, int crowdId, Object appType) {
        try {
            long count = 0l;
//			count = dao.queryByCount(null);
            if (params.containsKey("startDate") && params.containsKey("endDate")) {
                Map<String, String> map = new HashMap<>();
                String startDate = String.valueOf(params.get("startDate"));
                String endDate = String.valueOf(params.get("endDate"));
                //runDate 是endDate的前一天
                Date runDate = DateUtil.addDay2Date(0, DateUtil.format(endDate, partten));
                map = getValiableRunDate(runDate, startDate, endDate, isAppUseTime, projectId, crowdId, appType);
                if (map.size() > 0) {
                    params.put("startDate", map.get("startDate"));
                    params.put("endDate", map.get("endDate"));
                    // if (map.containsKey("cycleStatistics"))
                    //     params.put("cycleStatistics", map.get("cycleStatistics"));
                }
            }
        } catch (Exception e) {
            logger.error("getValiableRunDate方法异常, ");
        }
        return params;
    }

    /**
     * 去数据库中检索有数据的有效日期区间。
     * <p>
     * 前端如果当天数据没有找到，需要减一天重新取数，直到取到为止
     *
     * @param runDate
     * @param startDate
     * @param endDate
     * @return
     */
    public Map<String, String> getValiableRunDate(Date runDate, String startDate, String endDate, boolean isAppUseTime, int projectId,
                                                  int crowdId, Object appType) {
        Map<String, String> map = new HashMap<>();
        map.put("startDate", startDate);
        map.put("endDate", endDate);
        try {
            int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
            if (dateLength != 30 &&
                    dateLength != 60 &&
                    dateLength != 90 &&
                    dateLength != 180) {
                dateLength = 30;
                // map.put("cycleStatistics", String.valueOf(dateLength));
            }
            Map<String, Object> filter = new HashMap<>();
            if (!isAppUseTime) {
//				TenantAppSignificancePage page = new TenantAppSignificancePage();
//				page.setCycleStatistics(dateLength);  //计算周期
//				page.setRunDate(DateUtil.format(runDate,partten));	//计算日期
//				page.setTenantId(tenantId);
//				page.setProjectId(projectId);
//				page.setCrowdId(crowdId);
//				page.setAppType(appType);
//                 filter.put("cycleStatistics", dateLength);
                filter.put("runDate", DateUtil.format(runDate, partten));
                filter.put("projectId", projectId);
                filter.put("crowdId", crowdId);
                filter.put("appType", appType);
                //查找同等计算周期下，计算日期在当前参数run_date之前记录
                TenantAppSignificance appSignificance = dao.queryLatestRow(filter);
                if (appSignificance != null) {
                    map.put("startDate", appSignificance.getStartDate());
                    map.put("endDate", appSignificance.getEndDate());
                } else {
                    map.put("startDate", startDate);
                    map.put("endDate", endDate);
                }
            } else {
                TenantUseAppRoutinePage page = new TenantUseAppRoutinePage();
                page.setCycleStatistics(dateLength);  //计算周期
                page.setRunDate(DateUtil.format(runDate, partten));    //计算日期
                page.setProjectId(projectId);
                page.setCrowdId(crowdId);

                TenantUseAppRoutine useAppRoutine = appRoutineDao.queryLatestRow(page);
                if (useAppRoutine != null) {
                    map.put("startDate", useAppRoutine.getStartDate());
                    map.put("endDate", useAppRoutine.getEndDate());
                } else {
                    map.put("startDate", startDate);
                    map.put("endDate", endDate);
                }
            }
        } catch (Exception e) {
            logger.error("" + e.getMessage());
            throw new Exception(e);
        } finally {
            return map;
        }
    }

    private List<Tag> convertAppUse(List<TenantUseAppRoutine> list) {
        List<Tag> tags = new ArrayList<Tag>();
        Tag tag = null;
        for (TenantUseAppRoutine appRoutine : list) {
            tag = new Tag();
            tag.setTag_name(String.valueOf(appRoutine.getHour()));
            tag.setSta_value(String.valueOf(appRoutine.getMetricValue()));
            tags.add(tag);
        }
        return tags;
    }

    private List<Tag> convertAppName(List<TenantAppSignificance> apps) {
        List<Tag> tagList = new ArrayList<>();
        String platform = "";
        for (TenantAppSignificance appSignificance : apps) {
            Tag tag = new Tag();
//			if ("ANDROID".equals(appSignificance.getPlatform())) {
//				platform = "2";
//			}
            if (!appSignificance.getPlatform().isEmpty()) {
                platform = appSignificance.getPlatform();
            }
            try {
//				getAppInfo(appSignificance.getAppHash(), platform, tagList);
                tag.setTag_name(appSignificance.getAppName());
                tag.setSta_value(appSignificance.getAppIcon());
                tagList.add(tag);
            } catch (Exception e) {
                // 查询异常，跳出当前for循环。
                logger.error("查询APP信息service接口异常，" + e.getMessage());
                break;
            }
            if (tagList.size() > 50) {
                break;
            }
        }
        return tagList;

    }

    /**
     * 查询app 名称
     * TODO 待优化，可以一块查询，提升效率
     *
     * @param hashcode
     * @param platform
     * @param tagList
     */
    private void getAppInfo(String hashcode, String platform, List<Tag> tagList) {
        Tag tag = new Tag();
        String tagName = "";
        String staValue = "";
        String iconurl = "";
        try {

            List<String> filters = new ArrayList<String>();
            filters.add("Samsung Updates");
            filters.add("OPPO桌面");
            String appName = "";
            String iconUrl = "";
            AppInfo app = new AppInfo();
            app.setAppHash(hashcode);
            app.setPlatform(platform);
            AppInfo appInfo = appInfoDao.queryAppInfo(app);
            if (null != appInfo) {
                appName = appInfo.getAppName();
                iconUrl = appInfo.getAppIcon();
            }
            tagName = appName;
            iconurl = iconUrl;
            if (iconurl != null &&
                    !iconurl.contains("hiphotos.bdimg")) {
                staValue = iconurl;
            } else {
                staValue = "";
            }

            if (tagName != null &&
                    !tagName.isEmpty() &&
                    !staValue.isEmpty() &&
                    !filters.contains(tagName)) {
                tag.setTag_name(tagName);
                tag.setSta_value(staValue);
                tagList.add(tag);
            } else {
//        		logger.error("###### "+appInfo.getId()+","+appInfo.getAppName()+" #####");
            }
        } catch (Exception e) {
            logger.error("转换App应用名称接口出错", e);
        }
    }


    public List<TenantAppSignificance> queryToSyncAppInfo() {
        return dao.queryToSyncAppInfo();
    }

    public void queryAndInsertSum(String parentProjectId, String runDate) {
        TenantAppSignificancePage page = new TenantAppSignificancePage();
        page.setProjectId(Integer.parseInt(parentProjectId));
        page.setRunDate(runDate);
        List<TenantAppSignificance> list = dao.queryChildrenSum(page);
        dao.batchDeleteByProjectAndDate(page);

        if (null != list && list.size() > 0) {
            int pointsDataLimit = 1000;//限制条数
            int size = list.size();
            if (pointsDataLimit < size) {
                int part = size / pointsDataLimit;//分批数
                for (int i = 0; i < part; i++) {
                    //1000条
                    List<TenantAppSignificance> listTmp = list.subList(0, pointsDataLimit);
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

    private void batchInsert(List<TenantAppSignificance> list, String parentProjectId, String runDate) {
        for (TenantAppSignificance tenantAppSignificance : list) {
            tenantAppSignificance.setProjectId(Integer.parseInt(parentProjectId));
            tenantAppSignificance.setRunDate(runDate);
        }
        dao.batchInsert(list);
    }

    public void batchSelectAndInsert(String parentProjectId, String runDate) {
        TenantAppSignificancePage page = new TenantAppSignificancePage();
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
