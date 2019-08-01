package td.enterprise.wanalytics.etl.task.group;

import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.elasticsearch.common.Strings;
import org.springframework.util.CollectionUtils;

import td.enterprise.entity.MetricHourRealTime;
import td.enterprise.entity.Project;
import td.enterprise.entity.ProjectRelation;
import td.enterprise.service.MetricHourRealTimeService;
import td.enterprise.service.ProjectService;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

@Slf4j
public class AggregationMetricHourRealTimeTask {
    private static SqlSession            sqlSession;
    private static List<ProjectRelation> projectRelations;
    private static Map<String, String>   parentProjectIdMapper;
    private static Map<String, String>   childProjectIdMapper;
    private static String                date;
    private static int                   parentProjectId;
    private static String                hour;
    private static int                   currentHour;
    private static int                   limit = 1;
    private static String                currentDate;
    private static boolean               reRun = false;

    static {
        parentProjectIdMapper = new HashMap<>();
        childProjectIdMapper = new HashMap<>();
        SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
        sqlSession = sqlSessionFactory.openSession();
        parentProjectId = -1;
    }

    public static void execute() throws SQLException {
        projectRelations = ProjectRelationUtils.getAllProjectRelations();
        List<String> rootProjectIdList = ProjectRelationUtils.getRootProjectIdList(parentProjectId);

        if (reRun) {
            //limit = 1;
        } else {
            int hourInt = queryMaxHour(date);
            while (hourInt < 0) {
                date = LocalDate.parse(date, DateTimeFormatter.ofPattern(DateUtil.PATTERN_DATE)).minusDays(1L)
                        .format(DateTimeFormatter.ofPattern(DateUtil.PATTERN_DATE));
                hourInt = queryMaxHour(date);
            }
            hour = String.valueOf(hourInt);
        }
        int temLimit = limit;
        while (temLimit > 0) {
            long start = System.currentTimeMillis();
            initRuntimeParams(date, Integer.parseInt(hour), temLimit - 1);
            temLimit--;
            process(rootProjectIdList);
            long end = System.currentTimeMillis();
            log.info("insert data size:{},runTimes:{}", count, (end - start) + " Minlls");
            clear();
            log.info("End to process. currentDate:{}, currentHour:{}, tempLimit:{}", currentDate, currentHour, temLimit);
        }
    }

    private static void clear() {
        childProjectIdMapper.clear();
        parentProjectIdMapper.clear();
        count = 0;
    }

    private static int queryMaxHour(String date) {
        String sql = "select MAX(CAST(hour as UNSIGNED INTEGER)) as hour from TD_METRIC_HOUR_REAL_TIME where date=?";
        List<Object> valuesList = new ArrayList<>();
        valuesList.add(date);
        Map<String, Object> hourMap = QueryUtils.querySingle(sql, QueryUtils.WIFIANALYTICS_DB, valuesList);
        if (null == hourMap || hourMap.isEmpty()) {
            return -1;
        } else {
            Object obj = hourMap.get("hour");
            return obj == null ? -1 : Integer.parseInt(obj.toString());
        }
    }

    private static void process(List<String> rootProjectIdList) {
        for (String rootId : rootProjectIdList) {
            findChildrenProjectListAndCollectByRecursion(rootId, projectRelations);
        }
    }

    private static void initRuntimeParams(String date, int hour, int offset) {
        LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ofPattern(DateUtil.PATTERN_DATE));
        LocalDateTime currentDateTime = LocalDateTime.of(localDate.getYear(), localDate.getMonth(), localDate.getDayOfMonth(), hour, 0).minusHours(
                offset);
        currentDate = currentDateTime.toLocalDate().format(DateTimeFormatter.ofPattern(DateUtil.PATTERN_DATE));
        currentHour = currentDateTime.getHour();
    }

    private static void findChildrenProjectListAndCollectByRecursion(String parentId, List<ProjectRelation> relationList) {
        List<ProjectRelation> childrenList = new ArrayList<>();
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
                        findChildrenProjectListAndCollectByRecursion(childProjectId, relationList);
                    }
                }
            }
        }

        String hasContain = childProjectIdMapper.get(parentId);
        if (Strings.isNullOrEmpty(hasContain) && childrenList.size() > 0) {
            insertToDB(parentId, childrenList);
        }
        childProjectIdMapper.put(parentId, parentId);
    }

    private static void insertToDB(String parentId, List<ProjectRelation> childrenList) {
        try {
            long start = System.currentTimeMillis();
            List<Integer> intIdList = new ArrayList<>();
            childrenList.forEach(e -> intIdList.add(Integer.valueOf(e.getProjectId())));
            List<MetricHourRealTime> metricHourRealTimes = MetricHourRealTimeService.queryByProjectIdListAndDate(sqlSession, intIdList, currentDate,
                    currentHour + "");
            Project project = ProjectService.selectByPrimaryKey(sqlSession, parentId);
            MetricHourRealTime sumResult = getComputeResult(metricHourRealTimes, project);
            MetricHourRealTimeService.insert(sqlSession, sumResult);
            //log.debug("insert data:{}", sumResult);
            count++;
            long end = System.currentTimeMillis();
            //log.debug("insert data to db cost:{}, parentId:{}, date:{} ", (end - start), parentId, date);
        } catch (Exception e) {
            log.error("insert data error. parent_project_id:{}, date:{}", parentId, date, e);
        }
    }

    private static MetricHourRealTime getComputeResult(List<MetricHourRealTime> metricHourRealTimeList, Project project) {
        MetricHourRealTime result = new MetricHourRealTime();
        if (!CollectionUtils.isEmpty(metricHourRealTimeList)) {
            for (MetricHourRealTime metricHourRealTime : metricHourRealTimeList) {
                result.setActiveHourUsers(result.getActiveHourUsers() + metricHourRealTime.getActiveHourUsers());
                result.setFrontHourUsers(result.getFrontHourUsers() + metricHourRealTime.getFrontHourUsers());
                result.setStayHourUsers(result.getStayHourUsers() + metricHourRealTime.getStayHourUsers());
            }
        }
        result.setProjectName(project.getProjectName());
        result.setProjectType(project.getProjectType());
        result.setProjectNum(project.getProjectNum());
        result.setLogicalCity(project.getLogicalCity());
        result.setProjectId(project.getId());
        result.setDate(currentDate);
        result.setHour(String.valueOf(currentHour));
        return result;
    }

    private static int count = 0;

    public static void main(String[] args) throws SQLException {
        long start = System.currentTimeMillis();
        Options options = new Options();
        options.addOption("r", "date", true, "需要统计的日期"); // 默认前一天
        options.addOption("h", "hour", true, "小时"); // 2, 6, 8, 9, 10
        options.addOption("p", "parentProjectId", true, "需要统计的父节点id"); // 2, 6, 8, 9, 10
        options.addOption("l", "limit", true, "小时limit");
        options.addOption("u", "reRun", true, "reRun");

        CommandLineParser parser = new DefaultParser();
        CommandLine line;
        try {
            line = parser.parse(options, args);
            date = line.getOptionValue("date");
            reRun = Boolean.parseBoolean(line.getOptionValue("reRun"));
            hour = line.getOptionValue("hour");
            limit = Integer.parseInt(line.getOptionValue("limit"));
            parentProjectId = Integer.parseInt(line.getOptionValue("parentProjectId"));
            log.info("Entering to main. date:{}, hour:{}, limit:{}, reRun:{}, parentProjectId:{}", date, hour, limit, reRun, parentProjectId);
            execute();
        } catch (Exception e) {
            log.error("AggregationMetricHourRealTimeTask:", e);
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
