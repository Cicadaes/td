package td.enterprise.wanalytics.etl.task.group;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.elasticsearch.common.Strings;
import org.springframework.util.CollectionUtils;

import td.enterprise.entity.MetricDay;
import td.enterprise.entity.Project;
import td.enterprise.entity.ProjectRelation;
import td.enterprise.service.MetricDayService;
import td.enterprise.service.ProjectService;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

@Slf4j
public class AggregationDataByDayTask {
    private static SqlSession            sqlSession;
    private static List<ProjectRelation> projectRelations;
    private static Map<String, String>   parentProjectIdMapper;
    private static Map<String, String>   childProjectIdMapper;
    private static String                date;
    private static int                   parentProjectId = -1;
    private static int                   count;
    private static String                type            = "day"; // 分钟类型 min, 天类型 day, default type is day

    static {
        parentProjectIdMapper = new HashMap<>();
        childProjectIdMapper = new HashMap<>();
        SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
        sqlSession = sqlSessionFactory.openSession();
    }

    public static void execute() throws SQLException {
        projectRelations = ProjectRelationUtils.getAllProjectRelations();

        List<String> rootProjectIdList = ProjectRelationUtils.getRootProjectIdList(parentProjectId);

        process(rootProjectIdList);

        log.info("Leaving execute. insert data size:{}", count);
    }
    
	public static void execute(int mParentProjectId, String mDate, String mType) {
		parentProjectId = mParentProjectId;
		date = mDate;
		type = mType;
		try {
			execute();
		} catch (SQLException e) {
            log.error("AggregationDataByDayTaskError:", e);
		} finally {
			close();
		}
	}

    private static void process(List<String> rootProjectIdList) {
        for (String rootId : rootProjectIdList) {
            findChildrenProjectListAndInsertByRecursion(rootId, projectRelations);
        }
    }

    private static void findChildrenProjectListAndInsertByRecursion(String parentId, List<ProjectRelation> relationList) {
        List<ProjectRelation> childrenList = new ArrayList<>();
        //获取parentId的子节点
        for (ProjectRelation relation : relationList) {
            if (relation.getProjectParentId().equals(parentId)) {
                childrenList.add(relation);
            }
        }

        for (ProjectRelation childProjectRelation : childrenList) {
            for (ProjectRelation relation : relationList) {
                String childProjectId = childProjectRelation.getProjectId();
                if (relation.getProjectParentId().equals(childProjectRelation.getProjectId())) {
                    String isParentProject = parentProjectIdMapper.get(childProjectRelation.getProjectId());
                    if (Strings.isNullOrEmpty(isParentProject)) {
                        parentProjectIdMapper.put(childProjectRelation.getProjectId(), childProjectId);
                        findChildrenProjectListAndInsertByRecursion(childProjectId, relationList);
                    }
                }
            }
        }
        String hasContain = childProjectIdMapper.get(parentId);
        if (Strings.isNullOrEmpty(hasContain) && childrenList.size() > 0) {
            doTask(parentId, childrenList);
        }
        childProjectIdMapper.put(parentId, parentId);
    }

    private static void doTask(String parentId, List<ProjectRelation> childrenList) {
        MetricDay sumResult = null;
        try {
            List<Integer> intIdList = getIdListFromRelationList(childrenList);
            List<MetricDay> metricDays = MetricDayService.queryByProjectIdListAndDate(sqlSession, intIdList, date);
            Project project = ProjectService.selectByPrimaryKey(sqlSession, parentId);
            if (project == null) {
                log.info("project is null. project_id:{}", parentId);
            } else {
                sumResult = insertToDB(metricDays, project);
            }
        } catch (Exception e) {
            log.error("insert data error. parent_project_id:{}, date:{}, data:{}", parentId, date, sumResult, e);
        }
    }

    private static MetricDay insertToDB(List<MetricDay> metricDays, Project project) {
        MetricDay sumResult = null;
        if ("min".equals(type)) {
            sumResult = getSum(metricDays, project);
            MetricDayService.insertOrUpdateUserMetrics(sqlSession, sumResult);
        } else if ("day".equals(type)) {
            sumResult = getComputeResult(metricDays, project);
            MetricDayService.insert(sqlSession, sumResult);
        }
        count++;
        return sumResult;
    }

    private static List<Integer> getIdListFromRelationList(List<ProjectRelation> childrenList) {
        List<Integer> intIdList = new ArrayList<>();
        childrenList.forEach(e -> intIdList.add(Integer.valueOf(e.getProjectId())));
        return intIdList;
    }

    private static void computeSum(MetricDay result, int size) {
        result.setAverageOrderNums(result.getAverageOrderNums() / size);
    }

    private static MetricDay getComputeResult(List<MetricDay> metricDayList, Project project) {
        MetricDay result = new MetricDay();
        Date format = DateUtil.format(date, DateUtil.PATTERN_DATE);
        result.setWeekOfYear(getWeekOfYear(format) + "");
        result.setMonth(getMonth(format) + "");
        if (!CollectionUtils.isEmpty(metricDayList)) {
            for (MetricDay metricDay : metricDayList) {
                result.setActiveNewUsers(result.getActiveNewUsers() + metricDay.getActiveNewUsers());
                result.setActiveOldUsers(result.getActiveOldUsers() + metricDay.getActiveOldUsers());
                result.setActiveUsers(result.getActiveUsers() + metricDay.getActiveUsers());
                result.setStayNewUsers(result.getStayNewUsers() + metricDay.getStayNewUsers());
                result.setStayOldUsers(result.getStayOldUsers() + metricDay.getStayOldUsers());
                result.setStayUsers(result.getStayUsers() + metricDay.getStayUsers());
                result.setFrontUsers(result.getFrontUsers() + metricDay.getFrontUsers());
                result.setJumpUsers(result.getJumpUsers() + metricDay.getJumpUsers());
                result.setHighActiveUsers(result.getHighActiveUsers() + metricDay.getHighActiveUsers());
                result.setMiddleActiveUsers(result.getMiddleActiveUsers() + metricDay.getMiddleActiveUsers());
                result.setLowActiveUsers(result.getLowActiveUsers() + metricDay.getLowActiveUsers());
                result.setSleepActiveUsers(result.getSleepActiveUsers() + metricDay.getSleepActiveUsers());
                result.setHighStayUsers(result.getHighStayUsers() + metricDay.getHighStayUsers());
                result.setMiddleStayUsers(result.getMiddleStayUsers() + metricDay.getMiddleStayUsers());
                result.setLowStayUsers(result.getLowStayUsers() + metricDay.getLowStayUsers());
                result.setSleepStayUsers(result.getSleepStayUsers() + metricDay.getSleepStayUsers());
                result.setActiveDuration(result.getActiveDuration() + metricDay.getActiveDuration());
                result.setActiveTimes(result.getActiveTimes() + metricDay.getActiveTimes());
                result.setStayDuration(result.getStayDuration() + metricDay.getStayDuration());
                result.setStayTimes(result.getStayTimes() + metricDay.getStayTimes());
                result.setInterval2(result.getInterval2() + metricDay.getInterval2());
                result.setInterval5(result.getInterval5() + metricDay.getInterval5());
                result.setInterval10(result.getInterval10() + metricDay.getInterval10());
                result.setInterval15(result.getInterval15() + metricDay.getInterval15());
                result.setVisitCycle(result.getVisitCycle() + metricDay.getVisitCycle());
                result.setSalesAmount(result.getSalesAmount() + metricDay.getSalesAmount());
                result.setOrderCount(result.getOrderCount() + metricDay.getOrderCount());
                result.setMemberCount(result.getMemberCount() + metricDay.getMemberCount());
                result.setPotentialCount(result.getPotentialCount() + metricDay.getPotentialCount());
                result.setAverageOrderNums(result.getAverageOrderNums() + metricDay.getAverageOrderNums());
                result.setNewActiveDuration(result.getNewActiveDuration() + metricDay.getNewActiveDuration());
                result.setNewActiveTime(result.getNewActiveTime() + metricDay.getNewActiveTime());
                result.setOldActiveDuration(result.getOldActiveDuration() + metricDay.getOldActiveDuration());
                result.setOldActiveTime(result.getOldActiveTime() + metricDay.getOldActiveTime());
                result.setSalesCount(result.getSalesCount() + metricDay.getSalesCount());
                result.setOrderCountGt1(result.getOrderCountGt1() + metricDay.getOrderCountGt1());
                result.setVipSalesAmount(result.getVipSalesAmount() + metricDay.getVipSalesAmount());
                result.setVipOrderCount(result.getVipOrderCount() + metricDay.getVipOrderCount());
                result.setVipSalesCount(result.getVipSalesCount() + metricDay.getVipSalesCount());
                result.setVipOrderCountGt1(result.getVipOrderCountGt1() + metricDay.getVipOrderCountGt1());
                result.setNonVipSalesAmount(result.getNonVipSalesAmount() + metricDay.getNonVipSalesAmount());
                result.setNonVipOrderCount(result.getNonVipOrderCount() + metricDay.getNonVipOrderCount());
                result.setNonVipSalesCount(result.getNonVipSalesCount() + metricDay.getNonVipSalesCount());
                result.setNonVipOrderCountGt1(result.getNonVipOrderCountGt1() + metricDay.getNonVipOrderCountGt1());
                result.setWeekOfYear(metricDay.getWeekOfYear());
                result.setMonth(metricDay.getMonth());
            }
            computeSum(result, metricDayList.size());
        }
        result.setRegion(project.getRegion());
        result.setCity(project.getCity());
        result.setCityLevel(project.getCityLevel());
        result.setProvince(project.getProvince());
        result.setChannel(project.getChannel());
        result.setMall(project.getMall());
        result.setProjectName(project.getProjectName());
        result.setProjectType(project.getProjectType());
        result.setBrand(project.getBrand());
        result.setProjectNum(project.getProjectNum());
        result.setLogicalCity(project.getLogicalCity());
        result.setProjectId(project.getId());
        result.setDate(date);
        result.setBrand(project.getBrand());
        result.setLogicalCity(project.getLogicalCity());
        result.setTenantId(project.getTenantId());

        //log.debug("result. project_id:{}, project_type:{}, ", result.getProjectId(), result.getProjectType());
        return result;
    }

    private static MetricDay getSum(List<MetricDay> metricDayList, Project project) {
        MetricDay result = new MetricDay();
        Date format = DateUtil.format(date, DateUtil.PATTERN_DATE);
        result.setWeekOfYear(getWeekOfYear(format) + "");
        result.setMonth(getMonth(format) + "");
        if (!CollectionUtils.isEmpty(metricDayList)) {
            for (MetricDay metricDay : metricDayList) {
                result.setActiveNewUsers(result.getActiveNewUsers() + metricDay.getActiveNewUsers());
                result.setActiveOldUsers(result.getActiveOldUsers() + metricDay.getActiveOldUsers());
                result.setActiveUsers(result.getActiveUsers() + metricDay.getActiveUsers());
                result.setStayNewUsers(result.getStayNewUsers() + metricDay.getStayNewUsers());
                result.setStayOldUsers(result.getStayOldUsers() + metricDay.getStayOldUsers());
                result.setStayUsers(result.getStayUsers() + metricDay.getStayUsers());
                result.setFrontUsers(result.getFrontUsers() + metricDay.getFrontUsers());
                result.setWeekOfYear(metricDay.getWeekOfYear());
                result.setMonth(metricDay.getMonth());
            }
        }
        result.setRegion(project.getRegion());
        result.setCity(project.getCity());
        result.setCityLevel(project.getCityLevel());
        result.setProvince(project.getProvince());
        result.setChannel(project.getChannel());
        result.setMall(project.getMall());
        result.setProjectName(project.getProjectName());
        result.setProjectType(project.getProjectType());
        result.setBrand(project.getBrand());
        result.setProjectNum(project.getProjectNum());
        result.setLogicalCity(project.getLogicalCity());
        result.setProjectId(project.getId());
        result.setDate(date);
        result.setBrand(project.getBrand());
        result.setLogicalCity(project.getLogicalCity());
        result.setTenantId(project.getTenantId());

        //log.debug("result. projectId:{}, projectType:{}, ", result.getProjectId(), result.getProjectType());
        return result;
    }

    private static int getWeekOfYear(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setFirstDayOfWeek(Calendar.MONDAY);
        calendar.setTime(date);
        int week = calendar.get(Calendar.WEEK_OF_YEAR);
        int month = calendar.get(Calendar.MONTH);
        if (month >= 11 && week <= 1) {
            week += 52;
        }
        return week;
    }

    public static int getMonth(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.MONTH) + 1;
    }

    public static void main(String[] args) throws SQLException {
        long start = System.currentTimeMillis();
        Options options = new Options();
        options.addOption("r", "date", true, "运行日期");
        options.addOption("p", "parentProjectId", true, "需要统计的父节点id");
        options.addOption("t", "type", true, "运算类型");

        CommandLineParser parser = new DefaultParser();
        CommandLine line;
        try {
            line = parser.parse(options, args);
            date = line.getOptionValue("date");
            parentProjectId = Integer.parseInt(line.getOptionValue("parentProjectId"));
            type = line.getOptionValue("type");
            log.info("Entering to main. date:{}, parentProjectId:{}， type:{}", date, parentProjectId, type);
            execute();
        } catch (ParseException e) {
            log.error("AggregationDataByDayTaskError:", e);
        } finally {
            close();
        }
        long end = System.currentTimeMillis();
        log.info("AggregationMetricHourRealTimeTask:{}", (end - start) + " Minlls");
    }
    
    private static void close() {
        sqlSession.close();
    }
}
