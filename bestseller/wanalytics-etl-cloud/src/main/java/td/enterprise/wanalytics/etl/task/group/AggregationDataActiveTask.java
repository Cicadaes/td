package td.enterprise.wanalytics.etl.task.group;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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

import td.enterprise.entity.MetricDayActive;
import td.enterprise.entity.Project;
import td.enterprise.entity.ProjectRelation;
import td.enterprise.service.MetricDayActiveService;
import td.enterprise.service.ProjectService;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

@Slf4j
public class AggregationDataActiveTask {
    private static SqlSession            sqlSession;
    private static List<ProjectRelation> projectRelations;
    private static Map<String, String>   parentProjectIdMapper;
    private static Map<String, String>   childProjectIdMapper;
    private static String                date;
    private static int                   parentProjectId    = -1;
    private static int                   insertCount        = 0;
    private static int                   updateCount        = 0;
    private static Set<Integer>          allMetricDayActive = new HashSet<>();

    static {
        parentProjectIdMapper = new HashMap<>();
        childProjectIdMapper = new HashMap<>();
        SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
        sqlSession = sqlSessionFactory.openSession();
    }

    public static void execute() throws SQLException {
        projectRelations = ProjectRelationUtils.getAllProjectRelations();

        queryMetricDayActive();

        List<String> rootProjectIdList = ProjectRelationUtils.getRootProjectIdList(parentProjectId);

        process(rootProjectIdList);

        log.info("Leaving execute. insert:{},update:{}", insertCount, updateCount);
    }

    /**
     * 获取project来判断是insert还是update
     * @throws SQLException
     *
     */
    private static void queryMetricDayActive() throws SQLException {
        List<MetricDayActive> metricDayActive = MetricDayActiveService.queryByProjectIdListAndDate(sqlSession, null, date);
        for (MetricDayActive mda : metricDayActive) {
            allMetricDayActive.add(mda.getProjectId());
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
        MetricDayActive sumResult = null;
        try {
            long start = System.currentTimeMillis();
            List<Integer> intIdList = getIdListFromRelationList(childrenList);
            List<MetricDayActive> metricDayActive = MetricDayActiveService.queryByProjectIdListAndDate(sqlSession, intIdList, date);
            Project project = ProjectService.selectByPrimaryKey(sqlSession, parentId);
            if (project == null) {
                log.info("project is null. project_id:{}", parentId);
            } else {
                sumResult = insertToDB(metricDayActive, project);
                long end = System.currentTimeMillis();
            }
        } catch (Exception e) {
            log.error("insert data error. parent_project_id:{}, date:{}, data:{}", parentId, date, sumResult, e);
        }
    }

    private static MetricDayActive insertToDB(List<MetricDayActive> metricDays, Project project) {
        MetricDayActive sumResult = getComputeResult(metricDays, project);
        if (allMetricDayActive.contains(sumResult.getProjectId())) {
            MetricDayActiveService.update(sqlSession, sumResult);
            updateCount++;
        } else {
            MetricDayActiveService.insert(sqlSession, sumResult);
            insertCount++;
        }
        return sumResult;
    }

    private static List<Integer> getIdListFromRelationList(List<ProjectRelation> childrenList) {
        List<Integer> intIdList = new ArrayList<>();
        childrenList.forEach(e -> intIdList.add(Integer.valueOf(e.getProjectId())));
        return intIdList;
    }

    private static MetricDayActive getComputeResult(List<MetricDayActive> metricDayList, Project project) {
        MetricDayActive result = new MetricDayActive();
        if (!CollectionUtils.isEmpty(metricDayList)) {
            for (MetricDayActive metricDayActive : metricDayList) {
                result.setActiveNewUsers(result.getActiveNewUsers() + metricDayActive.getActiveNewUsers());
                result.setActiveOldUsers(result.getActiveOldUsers() + metricDayActive.getActiveOldUsers());
                result.setActiveUsers(result.getActiveUsers() + metricDayActive.getActiveUsers());
                result.setStayNewUsers(result.getStayNewUsers() + metricDayActive.getStayNewUsers());
                result.setStayOldUsers(result.getStayOldUsers() + metricDayActive.getStayOldUsers());
                result.setStayUsers(result.getStayUsers() + metricDayActive.getStayUsers());
                result.setFrontUsers(result.getFrontUsers() + metricDayActive.getFrontUsers());
                result.setJumpUsers(result.getJumpUsers() + metricDayActive.getJumpUsers());
                result.setHighActiveUsers(result.getHighActiveUsers() + metricDayActive.getHighActiveUsers());
                result.setMiddleActiveUsers(result.getMiddleActiveUsers() + metricDayActive.getMiddleActiveUsers());
                result.setLowActiveUsers(result.getLowActiveUsers() + metricDayActive.getLowActiveUsers());
                result.setSleepActiveUsers(result.getSleepActiveUsers() + metricDayActive.getSleepActiveUsers());
                result.setHighStayUsers(result.getHighStayUsers() + metricDayActive.getHighStayUsers());
                result.setMiddleStayUsers(result.getMiddleStayUsers() + metricDayActive.getMiddleStayUsers());
                result.setLowStayUsers(result.getLowStayUsers() + metricDayActive.getLowStayUsers());
                result.setSleepStayUsers(result.getSleepStayUsers() + metricDayActive.getSleepStayUsers());
                result.setActiveDuration(result.getActiveDuration() + metricDayActive.getActiveDuration());
                result.setActiveTimes(result.getActiveTimes() + metricDayActive.getActiveTimes());
                result.setStayDuration(result.getStayDuration() + metricDayActive.getStayDuration());
                result.setStayTimes(result.getStayTimes() + metricDayActive.getStayTimes());
                //
                result.setInterval2(result.getInterval2() + metricDayActive.getInterval2());
                result.setInterval5(result.getInterval5() + metricDayActive.getInterval5());
                result.setInterval10(result.getInterval10() + metricDayActive.getInterval10());
                result.setInterval15(result.getInterval15() + metricDayActive.getInterval15());
                //
                result.setDurationNew5(result.getDurationNew5() + metricDayActive.getDurationNew5());
                result.setDurationNew15(result.getDurationNew15() + metricDayActive.getDurationNew15());
                result.setDurationNew30(result.getDurationNew60() + metricDayActive.getDurationNew60());
                result.setDurationNew60(result.getDurationNew60() + metricDayActive.getDurationNew60());

                result.setDurationOld5(result.getDurationOld5() + metricDayActive.getDurationOld5());
                result.setDurationOld15(result.getDurationOld15() + metricDayActive.getDurationOld15());
                result.setDurationOld30(result.getDurationOld30() + metricDayActive.getDurationOld30());
                result.setDurationOld60(result.getDurationOld60() + metricDayActive.getDurationOld60());

                result.setHighActive5(result.getHighActive5() + metricDayActive.getHighActive5());
                result.setHighActive15(result.getHighActive15() + metricDayActive.getHighActive15());
                result.setHighActive30(result.getHighActive30() + metricDayActive.getHighActive30());
                result.setHighActive60(result.getHighActive60() + metricDayActive.getHighActive60());

                result.setLowActive5(result.getLowActive5() + metricDayActive.getLowActive5());
                result.setLowActive15(result.getLowActive15() + metricDayActive.getLowActive15());
                result.setLowActive30(result.getLowActive30() + metricDayActive.getLowActive30());
                result.setLowActive60(result.getLowActive60() + metricDayActive.getLowActive60());

                result.setSleepActive5(result.getSleepActive5() + metricDayActive.getSleepActive5());
                result.setSleepActive15(result.getSleepActive15() + metricDayActive.getSleepActive15());
                result.setSleepActive30(result.getSleepActive30() + metricDayActive.getSleepActive30());
                result.setSleepActive60(result.getSleepActive60() + metricDayActive.getSleepActive60());

                //
                result.setVisitCycle(result.getVisitCycle() + metricDayActive.getVisitCycle());
                result.setNewActiveDuration(result.getNewActiveDuration() + metricDayActive.getNewActiveDuration());
                result.setNewActiveTime(result.getNewActiveTime() + metricDayActive.getNewActiveTime());
                result.setOldActiveDuration(result.getOldActiveDuration() + metricDayActive.getOldActiveDuration());
                result.setOldActiveTime(result.getOldActiveTime() + metricDayActive.getOldActiveTime());

                result.setWeekOfYear(metricDayActive.getWeekOfYear());
                result.setMonth(metricDayActive.getMonth());
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

        //log.debug("result. project_id:{}, project_type:{}, ", result.getProjectId(), result.getProjectType());
        return result;
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
            log.info("Entering to main. date:{}, parentProjectId:{}", date, parentProjectId);
            execute();
        } catch (ParseException e) {
            log.error("AggregationDataActiveTaskError:", e);
        } finally {
            close();
        }
        long end = System.currentTimeMillis();
        log.info("AggregationDataActiveTask:{}", (end - start) + " Minlls");
    }

    private static void close() {
        sqlSession.close();
    }
}
