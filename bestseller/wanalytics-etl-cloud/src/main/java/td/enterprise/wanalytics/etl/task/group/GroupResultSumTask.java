package td.enterprise.wanalytics.etl.task.group;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.*;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.entity.ProjectRelation;
import td.enterprise.service.*;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.text.SimpleDateFormat;
import java.util.*;
@Slf4j
public class GroupResultSumTask {

    public static Logger logger = Logger.getLogger(GroupResultSumTask.class);
    public static final String PASSENGER_SIGN = "passenger";
    public static final String PORTRAYAL_SIGN = "portrayal";
    public static final String MONTH_SIGN = "month";

    private static String type = null;
    public static Integer projectId = null;
    public static String runDate = null;

    static Map <String, String> childrenMap = new HashMap <String, String>();
    static Map <String, String> parentsMap = new HashMap <String, String>();
    static Map <String, String> isParentMap = new HashMap <String, String>();
    static Map <String, String> isChildMap = new HashMap <String, String>();

    //需要单独计算单独客流的店组
    static Map <String, Boolean> needGroupComputeMap = null;

    static SqlSession sqlSession = null;

    static {
        String sql = "select distinct group_id from TD_PROJECT_GROUP_COMPUTE where compute_type=2 "; //需要单独计算客流的店组，在合并客流的时候，要排除掉
        List <Map <String, Object>> list = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
        needGroupComputeMap = new HashMap <>();
        if (null != list) {
            for (Map <String, Object> map : list) {
                needGroupComputeMap.put(map.get("group_id") + "", true);
            }
        }
    }


    public static void main(String[] args) {

        SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
        sqlSession = sqlSessionFactory.openSession();
        try {
            Options options = new Options();
            options.addOption("r", "runDate", true, "执行日期");
            options.addOption("t", "type", true, "汇总类型");
            options.addOption("p", "projectId", true, "子项目编号");

            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            runDate = line.getOptionValue("runDate");
            type = line.getOptionValue("type");

            projectId = -1;
            if (line.getOptionValue("projectId") != null) {
                projectId = Integer.parseInt(line.getOptionValue("projectId"));
            } else {
                projectId = -1;
            }

            execute();

            logger.info("合并组客流完成！ ");
            System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);


        } catch (Exception e) {
            logger.error("合并组客流失败： ", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        } finally {
            sqlSession.commit();
            sqlSession.close();
        }
    }

    public static void execute() {
        List <ProjectRelation> projectRelations = getAllProjectRelations();
        List <String> parentProjectIds;

        if (type.equals(PASSENGER_SIGN)) {
            // 客流 （Storm）
            parentProjectIds = getAllTopParentProjectIds();//找到顶级父类
            for (String parentProjectId : parentProjectIds) {
                getChildrenList(projectRelations, parentProjectId);
            }

        } else if (type.equals(PORTRAYAL_SIGN)) {
            // 画像
            if (projectId == -1) {
                parentProjectIds = getAllTopParentProjectIds();//找到顶级父类
                for (String parentProjectId : parentProjectIds) {
                    getChildrenList(projectRelations, parentProjectId);
                }
            } else {
                getParentsList(projectRelations, projectId + "");
            }
        } else if (type.equals(MONTH_SIGN)) {
            parentProjectIds = getAllTopParentProjectIds();//找到顶级父类
            for (String parentProjectId : parentProjectIds) {
                getChildrenList(projectRelations, parentProjectId);
            }
        }

    }

    //找子节点
    public static void getChildrenList(List <ProjectRelation> list, String parentProjectId) {
        //先递归找子节点
        List <ProjectRelation> directChildrenList = new ArrayList <>();
        for (ProjectRelation pr : list) {
            if (pr.getProjectParentId().equals(parentProjectId)) {
                directChildrenList.add(pr);
            }
        }
        for (ProjectRelation pr : directChildrenList) {
            String projectId = pr.getProjectId();
            //判断是否有子节点
            for (ProjectRelation pr2 : list) {
                //如果没有子节点，则不再找；如果有子节点，再继续找
                if (pr2.getProjectParentId().equals(projectId)) {
                    String isParentId = isParentMap.get(projectId);
                    if (isParentId == null) {
                        isParentMap.put(projectId, projectId);
                        getChildrenList(list, projectId);
                    }
                }
            }
        }

        //再汇总
        String projectIdMap = childrenMap.get(parentProjectId);
        if (projectIdMap == null) {
            if (type.equals(PASSENGER_SIGN)) {
                groupPassengerFlowSum(parentProjectId, runDate);
            } else if (type.equals(PORTRAYAL_SIGN)) {
                groupPortraitSum(parentProjectId, runDate);
            }
            childrenMap.put(parentProjectId, parentProjectId);
            log.info(parentProjectId);
        }
    }

    //找父节点
    public static void getParentsList(List <ProjectRelation> list, String projectId) {
        //先汇总
        String parentProjectIdMap = parentsMap.get(projectId);
        if (parentProjectIdMap == null) {
            boolean isParent = false;
            for (ProjectRelation pr2 : list) {
                //先判断如果是父节点，才合并
                if (pr2.getProjectParentId().equals(projectId)) {
                    isParent = true;
                }
            }
            if (isParent) {
                if (type.equals(PASSENGER_SIGN)) {
                    groupPassengerFlowSum(projectId, runDate);
                } else if (type.equals(PORTRAYAL_SIGN)) {
                    groupPortraitSum(projectId, runDate);
                }
                parentsMap.put(projectId, projectId);
                log.info(projectId);
            }
        }

        //再递归找父节点
        List <ProjectRelation> directParentList = new ArrayList <ProjectRelation>();
        for (ProjectRelation pr : list) {
            if (pr.getProjectId().equals(projectId)) {
                directParentList.add(pr);
            }
        }
        for (ProjectRelation pr : directParentList) {
            String parentProjectId = pr.getProjectParentId();
            //判断是否为顶级父节点
//			for(ProjectRelation pr2: list){
//				boolean isTop = true;
//				//如果为顶级父节点，则不再找；如果不是顶级父节点，再继续找
//        		if(pr2.getProjectId().equals(parentProjectId)){
//        			isTop = false;
//        		}
//        		if(!isTop){
            String isChild = isChildMap.get(parentProjectId);
            if (isChild == null && parentProjectId != null && !parentProjectId.equals("")) {
                isChildMap.put(parentProjectId, parentProjectId);
                getParentsList(list, parentProjectId);
            }
//        		}
//        	}
        }
    }

    private static List <String> getAllTopParentProjectIds() {
        List <String> parentProjectIds = ProjectRelationService.getAllTopParentProjectIds(sqlSession, new ProjectRelation());
        return parentProjectIds;
    }

    private static List <ProjectRelation> getAllProjectRelations() {
        List <ProjectRelation> projectRelations = ProjectRelationService.getAllProjectRelations(sqlSession, new ProjectRelation());
        return projectRelations;
    }

    private static Boolean groupPassengerFlowSum(String parentProjectId, String runDate) {

        logger.info("合并店组客流：项目id=" + parentProjectId);

        //添加如果店组是需要排重的，则进行不汇总
        if (needGroupComputeMap.get(parentProjectId) != null) {
            logger.info("--------------parentProjectId=" + parentProjectId + " 需要单独计算客流，不用合并客流！");
            return true;
        }

        logger.info("合并客流项目Id=" + parentProjectId + " runDate=" + runDate);
        // offline_active_user_day_counter
        CounterTableBatchInsert.ordinaryTableBatchInsert("offline_active_user_day_counter", parentProjectId, runDate);

        // offline_active_user_duration_day_counter
        CounterTableBatchInsert.ordinaryTableBatchInsert("offline_active_user_duration_day_counter", parentProjectId, runDate);

        // offline_active_user_hour_counter
        CounterTableBatchInsert.hourTableBatchInsert("offline_active_user_hour_counter", parentProjectId, runDate);

        // offline_enter_user_degree_duration_counter
        CounterTableBatchInsert.roomTypeTableBatchInsert("offline_enter_user_degree_duration_counter", parentProjectId, runDate);

        // offline_enter_user_degree_times_counter
        CounterTableBatchInsert.roomTypeTableBatchInsert("offline_enter_user_degree_times_counter", parentProjectId, runDate);

        // offline_new_user_day_counter
        CounterTableBatchInsert.ordinaryTableBatchInsert("offline_new_user_day_counter", parentProjectId, runDate);

        // offline_old_user_day_counter
        CounterTableBatchInsert.ordinaryTableBatchInsert("offline_old_user_day_counter", parentProjectId, runDate);

        // offline_stay_user_day_counter
        CounterTableBatchInsert.ordinaryTableBatchInsert("offline_stay_user_day_counter", parentProjectId, runDate);

        //offline_stay_user_duration_day_counter
        CounterTableBatchInsert.ordinaryTableBatchInsert("offline_stay_user_duration_day_counter", parentProjectId, runDate);

        //offline_stay_user_duration_day_counter
        CounterTableBatchInsert.ordinaryTableBatchInsert("offline_stay_user_times_day_counter", parentProjectId, runDate);

        // offline_project_enter_duration_distribute_counter
        CounterTableBatchInsert.durationTableBatchInsert("offline_project_enter_duration_distribute_counter", parentProjectId, runDate);

        //offline_active_user_sensor_hour_counter
        CounterTableBatchInsert.sensorHourTableBatchInsert("offline_active_user_sensor_hour_counter", parentProjectId, runDate);

        //offline_new_user_sensor_day_counter
        CounterTableBatchInsert.sensorTableBatchInsert("offline_new_user_sensor_day_counter", parentProjectId, runDate);

        //offline_old_user_sensor_day_counter
        CounterTableBatchInsert.sensorTableBatchInsert("offline_old_user_sensor_day_counter", parentProjectId, runDate);

        //offline_stay_new_user_day_counter
        CounterTableBatchInsert.ordinaryTableBatchInsert("offline_stay_new_user_day_counter", parentProjectId, runDate);

        //offline_stay_old_user_day_counter
        CounterTableBatchInsert.ordinaryTableBatchInsert("offline_stay_old_user_day_counter", parentProjectId, runDate);

        //TD_TENANT_STAY_DURATION
        TenantStayDurationService.batchSelectAndInsert(parentProjectId, runDate);

        return true;
    }

    private static Boolean groupPortraitSum(String parentProjectId, String runDate) {
        //添加如果店组是需要排重的，则进行不汇总
        if (needGroupComputeMap.get(parentProjectId) != null) {
            logger.info("--------------parentProjectId=" + parentProjectId + " 需要单独计算客流，不用合并客流！");
            return true;
        }

        //TD_WIFI_PIX_TAG_COUNT
//		WifiPixTagCountService wifiPixTagCountService = ApplicationContextManager.getBean(WifiPixTagCountService.class);
//		wifiPixTagCountService.queryAndInsertSum(parentProjectId, runDate);
//		wifiPixTagCountService.batchSelectAndInsert(parentProjectId, runDate);

        //TD_TENANT_TAGS_COUNT
//		TenantTagsCountService.queryAndInsertSum(parentProjectId, runDate);
        TenantTagsCountService.batchSelectAndInsert(parentProjectId, runDate);

        //TD_TENANT_DEVICE_COUNT
//		TenantDeviceCountService tenantDeviceCountService = ApplicationContextManager.getBean(TenantDeviceCountService.class);
//		tenantDeviceCountService.queryAndInsertSum(parentProjectId, runDate);
        TenantDeviceCountService.batchSelectAndInsert(parentProjectId, runDate);

        //TD_TENANT_HOUSING_COVERAGE_COUNT
//		TenantHousingCoverageCountService tenantHousingCoverageCountService = ApplicationContextManager.getBean(TenantHousingCoverageCountService.class);
//		tenantHousingCoverageCountService.queryAndInsertSum(parentProjectId, runDate);
        TenantHousingCoverageCountService.batchSelectAndInsert(parentProjectId, runDate);

        //TD_TENANT_JOB_HOUSING_COUNT
//		TenantJobHousingCountService tenantJobHousingCountService = ApplicationContextManager.getBean(TenantJobHousingCountService.class);
        TenantJobHousingCountService.batchSelectAndInsert(parentProjectId, runDate);

        //TD_TENANT_REGION_COUNT
//		TenantRegionCountService tenantRegionCountService = ApplicationContextManager.getBean(TenantRegionCountService.class);
        TenantRegionCountService.batchSelectAndInsert(parentProjectId, runDate);

        //TD_TENANT_TOP_AREA_COUNT
//		TenantTopAreaCountService tenantTopAreaCountService = ApplicationContextManager.getBean(TenantTopAreaCountService.class);
        TenantTopAreaCountService.batchSelectAndInsert(parentProjectId, runDate);

        return true;
    }

    private static String getLastMonth(String month) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        Date date = null;
        try {
            date = sdf.parse(month);
        } catch (java.text.ParseException e) {
            e.printStackTrace();
        }

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM");
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.MONTH, -1);
        String last = format.format(c.getTime());
        logger.info(month + "---last:" + last);
        return last;
    }
}
