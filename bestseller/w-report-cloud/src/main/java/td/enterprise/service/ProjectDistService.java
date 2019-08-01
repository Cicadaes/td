package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.PassengerDateUtil;
import td.enterprise.entity.Project;
import td.enterprise.entity.type.ProjectTypeEnum;
import td.enterprise.page.ProjectPage;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.ProjectDensityVM;
import td.enterprise.web.vm.ProjectTopRateVM;
import td.enterprise.web.vm.ProjectTopVM;
import td.enterprise.web.vm.TopRoomVM;
import td.olap.query.WiFiAnalyticsQuerService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.*;

/**
 * <br>
 * <b>功能：</b>房间相关指标数据Service<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
@Service("projectDistService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectDistService {
    public final static Logger logger = Logger.getLogger(ProjectDistService.class);

    private static String sdf = "yyyy-MM-dd";

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectExtendService projectExtendService;

    @Autowired
    private ProjectRelationService projectRelationService;

    @Autowired
    private ParamService paramService;

    /**
     * TODO 待删除
     *
     * @param tenantId
     * @param projectId
     * @param startDate
     * @param endDate
     * @param chartType
     * @return
     */
    public List<Map<String, Object>> getRoomTopEffectData(String tenantId, int projectId, String startDate, String endDate, String chartType) {

        Long dateLength = 1L;
        try {
            dateLength = PassengerDateUtil.getDiffDaysStr(startDate, endDate);
        } catch (Exception e) {
            e.printStackTrace();
        }

        List<String> projectIds = new ArrayList<String>();
        ProjectPage page = new ProjectPage();
        page.setId(projectId);
        page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
        List<Project> childrenProjectByParam = projectService.getDirectChildrenByParam(page);
        for (Project project : childrenProjectByParam) {
            projectIds.add(project.getId()+"");
        }
        if (null == childrenProjectByParam || childrenProjectByParam.size() == 0) {
            projectIds.add(projectId + "");
        }

        List<Map<String, Object>> listNew = new ArrayList<>();

        for (String pId : projectIds) {
            //查询汇总的counter
            Map<String, Integer> resultMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(pId, startDate, endDate, chartType);
            int pre = 0;
            if (null != resultMap && resultMap.size() > 0) {
                pre = resultMap.get(pId);
            }

            //面积
            ProjectPage childPage = new ProjectPage();
            childPage.setId(Integer.parseInt(pId));
            childPage.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
            Map<String, Project> projects = projectService.queryAllChildrenByParam(childPage, new HashMap());
            List<String> pIds = new ArrayList();
            for (String key : projects.keySet()) {
                pIds.add(key);
            }

            if (null == pIds || pIds.size() == 0) {
                pIds.add(pId);
            }
            double area = projectService.querySumAreaByProjectIds(pIds);

            //计算
            Double value = 0d;
            if (area > 0) {
                value = pre / area / dateLength;
            }

            String name = "";
            try {
                name = projectService.selectByPrimaryKey(Integer.parseInt(pId)).getProjectName();
            } catch (Exception e) {
                e.printStackTrace();
            }

            //结果
            Map<String, Object> map = new HashMap<>();
            map.put("key", name);
            BigDecimal bg = new BigDecimal(value);
            Double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            map.put("value", f1);
            listNew.add(map);
        }

        //排序
        Map<String, Object> tmpMap = null;
        for (int i = listNew.size() - 1; i > 0; --i) {
            for (int j = 0; j < i; ++j) {
                if ((Double) listNew.get(j + 1).get("value") > (Double) listNew.get(j).get("value")) {
                    tmpMap = listNew.get(j);
                    listNew.set(j, listNew.get(j + 1));
                    listNew.set(j + 1, tmpMap);
                }
            }
        }

        if (listNew.size() > 10) {
            listNew = listNew.subList(0, 10);
        }
        return listNew;
    }

    /**
     * 查询前10
     *
     * @param startDate
     * @param endDate
     * @param childIds
     * @param chartType
     * @return
     */
    private Map<String, Integer> sumTotalTop10(String startDate, String endDate, String childIds, String chartType, String chartCatagory) {
        if (StringUtils.isBlank(childIds)) {
            return new HashMap<String, Integer>();
        }
        if ("total".equals(chartCatagory)) {//总值
            if ("stayRate".equals(chartType)) {//停留率
                //先查询总停留人数，再查询出来总进店人数，然后计算出来Top10
                Map<String, Integer> enterMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(childIds, startDate, endDate, "active", false);
                Map<String, Integer> stayMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(childIds, startDate, endDate, "stay", false);
                //计算出来top10
                //计算进店率
                return MapUtils.sortByRateTop10(stayMap, enterMap);
            } else if ("duration".equals(chartType)) {//客均停留时长
                //总停留时间，总停留人数，然后计算出来Top10
                Map<String, Integer> stayTimesMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(childIds, startDate, endDate, "stay_times", false);
                Map<String, Integer> durationMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(childIds, startDate, endDate, "duration", false);
                return MapUtils.sortByRateTop10(durationMap, stayTimesMap);
            }
            return WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(childIds, startDate, endDate, chartType, true);
        } else if ("avarage".equals(chartCatagory)) { // 均值 二级项目下 有多少直接子项目 进行排序，取top10
            if ("stayRate".equals(chartType)) {//停留率
                //先查询总停留人数，再查询出来总进店人数，然后计算出来Top10
                Map<String, Integer> enterMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(childIds, startDate, endDate, "active", false);
                Map<String, Integer> stayMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(childIds, startDate, endDate, "stay", false);
                Map<String, Double> rateMap = MapUtils.avarageDouble(stayMap, enterMap);
                Map<String, Integer> childCountMap = new HashMap<String, Integer>();
                //放置默认值
                for (String projectId : childIds.split(",")) {
                    childCountMap.put(projectId, 1);
                }
                //查询每个项目子项目个数
                for (String projectId : childIds.split(",")) {
                    ProjectPage page = new ProjectPage();
                    page.setId(Integer.parseInt(projectId));
                    page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
                    List<Project> childrenProjectByParam = projectService.getDirectChildrenByParam(page);
                    if (null != childrenProjectByParam && !childrenProjectByParam.isEmpty()) {
                        childCountMap.put(projectId, childrenProjectByParam.size());
                    }
                }
                return MapUtils.sortDoubleByRateTop10(rateMap, childCountMap);

            } else if ("duration".equals(chartType)) {//客均停留时长
                //总停留时间，总停留人数，然后计算出来Top10
                Map<String, Integer> stayTimesMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(childIds, startDate, endDate, "stay_times", false);
                Map<String, Integer> durationMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(childIds, startDate, endDate, "duration", false);

                Map<String, Integer> avarageMap = MapUtils.avarage(durationMap, stayTimesMap);

                Map<String, Integer> childCountMap = new HashMap<String, Integer>();
                //放置默认值
                for (String projectId : childIds.split(",")) {
                    childCountMap.put(projectId, 1);
                }
                //查询每个项目子项目个数
                for (String projectId : childIds.split(",")) {
                    ProjectPage page = new ProjectPage();
                    page.setId(Integer.parseInt(projectId));
                    page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
                    List<Project> childrenProjectByParam = projectService.getDirectChildrenByParam(page);
                    if (null != childrenProjectByParam && !childrenProjectByParam.isEmpty()) {
                        childCountMap.put(projectId, childrenProjectByParam.size());
                    }
                }
                //获取TOP10
                return MapUtils.sortByRateTop10(avarageMap, childCountMap);

            } else {
                Map<String, Integer> map = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(childIds, startDate, endDate, chartType, false);
                Map<String, Integer> childCountMap = new HashMap<String, Integer>();
                //放置默认值
                for (String projectId : childIds.split(",")) {
                    childCountMap.put(projectId, 1);
                }
                //查询每个项目子项目个数
                for (String projectId : childIds.split(",")) {
                    ProjectPage page = new ProjectPage();
                    page.setId(Integer.parseInt(projectId));
                    page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
                    List<Project> childrenProjectByParam = projectService.getDirectChildrenByParam(page);
                    if (null != childrenProjectByParam && !childrenProjectByParam.isEmpty()) {
                        childCountMap.put(projectId, childrenProjectByParam.size());
                    }
                }
                //获取TOP10
                return MapUtils.sortByRateTop10(map, childCountMap);
            }
        }
        return new HashMap<String, Integer>();
    }

    /**
     * @return
     */
    private Map<String, Integer> getDayCounter(String startDate, String endDate, String childIds, String chartType) {
        if ("duration".equals(chartType)) {//客均停留时长
            if (StringUtils.isNotBlank(childIds)) {
                //总停留时间，总停留人数，然后计算出来Top10
                Map<String, Integer> stayTimesMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterDayMap(childIds, startDate, endDate, "stay_times");
                Map<String, Integer> durationMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterDayMap(childIds, startDate, endDate, "duration");
                return MapUtils.avarage(durationMap, stayTimesMap);
            }
        }
        return WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterDayMap(childIds, startDate, endDate, chartType);
    }

    /**
     * 总值停留率进行查询
     *
     * @param startDate
     * @param endDate
     * @param projectId
     * @param chartType
     * @return
     */
    public List<ProjectTopRateVM> getChainTopRateFlowData(String startDate, String endDate, int projectId, String chartType, String chartCatagory) {
        // 从counter中获取数据获取每天的值
        String childIds = projectExtendService.getDirectChildProjectIds(projectId + "");
        //查询出来前10个 项目
        Map<String, Integer> counterMap = sumTotalTop10(startDate, endDate, childIds, "stayRate", chartCatagory);

        Long startLong = DateUtil.format(startDate, "yyyy-MM-dd").getTime();
        Long dateLength = PassengerDateUtil.getDiffDaysStr(startDate, endDate);

        Map<String, Integer> enterMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterDayMap(childIds, startDate, endDate, "active");
        Map<String, Integer> stayMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterDayMap(childIds, startDate, endDate, "stay");

        Map<String, String[]> result = new LinkedHashMap<>();
        for (String childProjectId : counterMap.keySet()) {
            result.put(childProjectId, new String[dateLength.intValue()]);
        }
        DecimalFormat df = new DecimalFormat("#0.0");// 格式化小数，不足的补0
        df.setRoundingMode(RoundingMode.HALF_UP);
        int j = 0;
        for (long i = 0; i < dateLength; i++, j++) {
            String date = DateUtil.format(new Date(startLong + i * 86400000), sdf);
            for (String childProjectId : counterMap.keySet()) {
                String rate = "0.0";
                String key = date + "," + childProjectId;
                Object enterCount = enterMap.get(key);
                Object stayCount = stayMap.get(key);
                if (enterCount == null || stayCount == null) {
                    rate = "0";
                } else {
                    rate = df.format(Integer.parseInt(stayCount + "") * 100 / Double.parseDouble(enterCount + ""));
                }
                result.get(childProjectId)[j] = rate;// 进行赋值
            }
        }

        //添加项目名称
        ProjectPage childPage = new ProjectPage();
        childPage.setId(projectId);
        childPage.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
        Map<String, Project> projectMap = projectService.queryAllChildrenByParam(childPage, new HashMap());

        //名称转化
        List<ProjectTopRateVM> resultList = new ArrayList<ProjectTopRateVM>();
        for (String key : result.keySet()) {
            String name = key;
            Project project = projectMap.get(key);
            ProjectTopRateVM rateVM = new ProjectTopRateVM();
            if (project != null) {
                name = project.getProjectName();
                rateVM.setProjectName(name);
                rateVM.setProjectId(project.getId());
                rateVM.setValueList(Arrays.asList(result.get(key)));
            } else {
                name = "项目" + name;
                rateVM.setProjectName(name);
                rateVM.setValueList(Arrays.asList(result.get(key)));
            }
            resultList.add(rateVM);
        }
        return resultList;
    }


    /**
     * 房店指标，top10店铺
     *
     * @param startDate
     * @param endDate
     * @param projectId
     * @param chartType
     * @param chartCatagory
     * @return
     */
    public List<ProjectTopVM> getRoomTopFlowDataForChain(String startDate, String endDate, int projectId, String chartType, String chartCatagory) {
        long timestamp = new Date().getTime();
        logger.info("================getRoomTopFlowData timestamp: " + timestamp + "================");
        //连锁类型查询，先查询直接子项目，排好序后，取出来top10后，再组个查询每天的结果

        // 获取日期维度
        Long startLong = DateUtil.format(startDate, "yyyy-MM-dd").getTime();
        Long dateLength = PassengerDateUtil.getDiffDaysStr(startDate, endDate);
        Map<String, Integer> dateArrayMap = new HashMap<>();
        for (Long i = 0L; i < dateLength; i++) {
            dateArrayMap.put(DateUtil.format(new Date(startLong + i * 86400000), sdf), i.intValue());
        }
        logger.debug("================roomsNew 01 dateLength: " + timestamp + "================");
        String childIds = projectExtendService.getDirectChildProjectIds(projectId + "");

        // 获取top10项目map 带顺序
        Map<String, Integer> sumMap = sumTotalTop10(startDate, endDate, childIds, chartType, chartCatagory);

        Map<String, Integer[]> resultMap = new LinkedHashMap<>();
        for (String childProjectId : sumMap.keySet()) {
            Integer[] tmpArray = new Integer[dateLength.intValue()];
            for (int j = 0; j < tmpArray.length; j++) {
                tmpArray[j] = 0;
            }
            resultMap.put(childProjectId, tmpArray);
        }
        // 从counter中获取数据获取每天的值
        Map<String, Integer> counterMap_1 = getDayCounter(startDate, endDate, childIds, chartType);
        for (String key : counterMap_1.keySet()) {
            String[] keys = key.split(",");
            String childProjectId = keys[1];

            if (resultMap.get(childProjectId) != null) {
                if ("avarage".equals(chartCatagory)) {
                    String averageChildIds = projectExtendService.getDirectChildProjectIds(childProjectId);
                    int avgChildCount = averageChildIds.split(",").length;
                    if (avgChildCount == 0) {
                        avgChildCount = 1;
                    }
                    resultMap.get(childProjectId)[dateArrayMap.get(keys[0])] = counterMap_1.get(key) / avgChildCount;
                } else {
                    resultMap.get(childProjectId)[dateArrayMap.get(keys[0])] = counterMap_1.get(key);
                }
            }
        }
        logger.debug("================roomsNew 04 cubeMap_1: " + timestamp + "================");
        User user = UserInfoUtil.getUser();
        // 获取子项目信息Map
        Map<String, Project> projectMap = new HashMap<>();
        ProjectPage page = new ProjectPage();
        page.setId(projectId);
        page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
        List<Project> listChild = projectService.getDirectChildrenByParam(page);
        for (Project p : listChild) {
            projectMap.put(p.getId() + "", p);
        }
        logger.debug("================roomsNew 05 roomMap: " + timestamp + "================");
        // 翻译项目名称

        List<ProjectTopVM> list = new ArrayList<ProjectTopVM>();
        for (String key : resultMap.keySet()) {
            ProjectTopVM projectTopVM = new ProjectTopVM();
            String projectName = key;
            if (projectMap.get(key) != null) {
                projectName = projectMap.get(key).getProjectName();
                projectTopVM.setProjectName(projectName);
                projectTopVM.setProjectId(projectMap.get(key).getId());
                projectTopVM.setValueList(Arrays.asList(resultMap.get(key)));
            } else {
                projectTopVM.setProjectName("项目" + projectName);
                projectTopVM.setValueList(Arrays.asList(resultMap.get(key)));
            }
            list.add(projectTopVM);
        }
        logger.debug("================roomsNew 06 finalMap: " + timestamp + "================");

        return list;
    }

    // 用于竞品概览图表2
    public List<TopRoomVM> getRoomTopFlowData2(String startDate, String endDate, int projectId) throws Exception {
        Long startLong = DateUtil.format(startDate, "yyyy-MM-dd").getTime();
        Long dateLength = PassengerDateUtil.getDiffDaysStr(startDate, endDate);
        Map<String, Integer> dateArrayMap = new HashMap<>();
        for (Long i = 0L; i < dateLength; i++) {
            dateArrayMap.put(DateUtil.format(new Date(startLong + i * 86400000), sdf), i.intValue());
        }

        /**
         * 竞品房间类型状态是-1
         */
        ProjectPage page = new ProjectPage();
        page.setId(projectId);
        Project project = projectService.queryBySingle(page);
        if(null != project.getProjectType() && project.getProjectType() == ProjectTypeEnum.PROJECT_ERROR.getCode()) {
            page.setProjectType(ProjectTypeEnum.PROJECT_ERROR.getCode());
        }else {
            page.setStatus(1);
        }
        List <Project> childrenProjectByParam = projectService.getDirectChildrenByParam(page);

        StringBuffer buffer = new StringBuffer();
        if (null != childrenProjectByParam) {
            for (Project pr : childrenProjectByParam) {
                buffer.append(pr.getId()).append(",");
            }
            if (buffer.length() > 0) {
                buffer.deleteCharAt(buffer.length() - 1);
            }
        }

        String childProjectIds = buffer.toString();


        Map<String, Integer> roomList = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(childProjectIds, startDate, endDate, "active", true);
        if (roomList.size() == 0) {
            String dataEndDate = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).findLastData(projectId);
            if(StringUtils.isNotBlank(dataEndDate)) {
                String monthStart = DateUtil.getMonthStartDay(dataEndDate);
                String monthEnd = DateUtil.getMonthEndDay(dataEndDate);
                roomList = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(childProjectIds, monthStart, monthEnd, "active", true);
            }
        }

        List<TopRoomVM> roomNameList = new ArrayList<TopRoomVM>();
        for (String roomId : roomList.keySet()) {
            TopRoomVM roomVM = new TopRoomVM();
            roomVM.setRoomId(roomId);
            roomNameList.add(roomVM);

        }
        /**
         * 补充完10个房间
         */
        if (roomList.size() < 10) {
            for (int i = 0; i < 10 - roomList.size(); i++) {
                TopRoomVM roomVM = new TopRoomVM();
                roomVM.setRoomId("0");
                roomNameList.add(roomVM);
            }
        }
        return roomNameList;
    }


    /**
     * 坪效指标
     *
     * @param projectId
     * @param startDate
     * @param endDate
     * @param chartType
     * @return
     */
    public List <ProjectDensityVM> getProjectDensityData(int projectId, String startDate, String endDate, String chartType) {

        Long dateLength = PassengerDateUtil.getDiffDaysStr(startDate, endDate);

        List <String> projectIds = new ArrayList <String>();
        ProjectPage page = new ProjectPage();
        page.setId(projectId);
        page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
        List <Project> childrenProjectByParam = projectService.getDirectChildrenByParam(page);
        for (Project projectRelation : childrenProjectByParam) {
            projectIds.add(projectRelation.getId() + "");
        }
        if (null == childrenProjectByParam || childrenProjectByParam.size() == 0) {
            projectIds.add(projectId + "");
        }

        List <ProjectDensityVM> resultList = new ArrayList <ProjectDensityVM>();

        for (String pId : projectIds) {
            //查询汇总的counter
            Map <String, Integer> resultMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(pId, startDate, endDate, chartType);
            int pre = 0;
            if (null != resultMap && resultMap.size() > 0) {
                pre = resultMap.get(pId);
            }

            //面积
            ProjectPage childPage = new ProjectPage();
            childPage.setId(Integer.parseInt(pId));
            childPage.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
            Map <String, Project> projects = projectService.queryAllChildrenByParam(childPage, new HashMap());
            List <String> pIds = new ArrayList();
            for (String key : projects.keySet()) {
                pIds.add(key);
            }

            if (null == pIds || pIds.size() == 0) {
                pIds.add(pId);
            }
            double area = projectService.querySumAreaByProjectIds(pIds);

            //计算
            Double value = 0d;
            if (area > 0) {
                value = pre / area / dateLength;
            }

            Project project = null;
            try {
                project = projectService.selectByPrimaryKey(Integer.parseInt(pId));
            } catch (Exception e) {
                e.printStackTrace();
            }

            ProjectDensityVM densityVM = new ProjectDensityVM();
            BigDecimal bg = new BigDecimal(value);
            Double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();

            densityVM.setProjectName(project == null ? "项目" + pId : project.getProjectName());
            densityVM.setValue(f1);
            densityVM.setProjectId(project == null ? Integer.parseInt(pId) : project.getId());

            resultList.add(densityVM);
        }

        //排序
        Collections.sort(resultList);

        if (resultList.size() > 10) {
            resultList = resultList.subList(0, 10);
        }

        return resultList;
    }

}
