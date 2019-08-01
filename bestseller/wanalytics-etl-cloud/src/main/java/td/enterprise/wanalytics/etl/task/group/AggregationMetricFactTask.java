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

import td.enterprise.entity.MetricFact;
import td.enterprise.entity.Project;
import td.enterprise.entity.ProjectRelation;
import td.enterprise.service.MetricFactService;
import td.enterprise.service.ProjectService;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

@Slf4j
public class AggregationMetricFactTask {
    private static SqlSession            sqlSession;
    private static List<ProjectRelation> projectRelations;
    private static Map<String, String>   parentProjectIdMapper;
    private static Map<String, String>   childProjectIdMapper;
    private static String                date;
    private static String                currentDate;
    private static int                   hour;
    private static int                   currentHour;
    private static int                   parentProjectId;
    private static int                   limit = 1;
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
            hour = queryMaxHour(date);
            while (hour < 0) {
                date = LocalDate.parse(date, DateTimeFormatter.ofPattern(DateUtil.PATTERN_DATE)).minusDays(1L)
                        .format(DateTimeFormatter.ofPattern(DateUtil.PATTERN_DATE));
                hour = queryMaxHour(date);
            }
        }
        int temLimit = limit;
        while (temLimit > 0) {
            initRunTimeParams(date, hour, temLimit - 1);
            temLimit--;
            process(rootProjectIdList);
            log.info("insert data size:{}", count);
            clear();
            log.info("Ending to process. currentDate:{}, currentHour:{}, tempLimit:{}", currentDate, currentHour, temLimit);
        }
    }

    private static void clear() {
        childProjectIdMapper.clear();
        parentProjectIdMapper.clear();
        count = 0;
    }

    private static void initRunTimeParams(String date, int hour, int offset) {
        LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ofPattern(DateUtil.PATTERN_DATE));
        LocalDateTime currentDateTime = LocalDateTime.of(localDate.getYear(), localDate.getMonth(), localDate.getDayOfMonth(), hour, 0).minusHours(
                offset);
        currentDate = currentDateTime.toLocalDate().format(DateTimeFormatter.ofPattern(DateUtil.PATTERN_DATE));
        currentHour = currentDateTime.getHour();
    }

    private static int queryMaxHour(String date) {
        String sql = "select max(hour) as hour from TD_METRIC_FACT where date=?";
        List<Object> valuesList = new ArrayList<>();
        valuesList.add(date);
        Map<String, Object> hourMap = QueryUtils.querySingle(sql, QueryUtils.WIFIANALYTICS_DB, valuesList);
        if (null == hourMap || hourMap.isEmpty()) {
            return -1;
        } else {
            Object obj = hourMap.get("hour");
            return obj == null ? -1 : (int) obj;
        }
    }

    private static void process(List<String> rootProjectIdList) {
        for (String rootId : rootProjectIdList) {
            findChildrenProjectListAndCollectByRecursion(rootId, projectRelations);
        }
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
            process(parentId, childrenList);
        }
        childProjectIdMapper.put(parentId, parentId);
    }

    private static void process(String parentId, List<ProjectRelation> childrenList) {
        try {
            long start = System.currentTimeMillis();
            List<Integer> intIdList = new ArrayList<>();
            childrenList.forEach(e -> intIdList.add(Integer.valueOf(e.getProjectId())));
            List<MetricFact> metricFacts = MetricFactService.queryByProjectIdListAndDate(sqlSession, intIdList, currentDate, currentHour);
            Project project = ProjectService.selectByPrimaryKey(sqlSession, parentId);
            MetricFact sumResult = getComputeResult(metricFacts, project);
            MetricFactService.insert(sqlSession, sumResult);
            //log.debug("insert data:{}", sumResult);
            count++;
            long end = System.currentTimeMillis();
            //log.debug("insert data to db cost:{}, parentId:{}, date:{} ", (end - start), parentId, currentDate);
        } catch (Exception e) {
            log.error("insert data error. parent_project_id:{}, date:{}", parentId, currentDate, e);
        }
    }

    private static MetricFact getComputeResult(List<MetricFact> metricFactList, Project project) {
        MetricFact result = new MetricFact();
        if (!CollectionUtils.isEmpty(metricFactList)) {
            for (MetricFact metricFact : metricFactList) {
                result.setHourUsers(result.getHourUsers() + metricFact.getHourUsers());
                result.setEndHourUsers(result.getEndHourUsers() + metricFact.getEndHourUsers());
            }
        }
        result.setRegion(project.getRegion());
        result.setCity(project.getCity());
        result.setProvince(project.getProvince());
        result.setChannel(project.getChannel());
        result.setMall(project.getMall());
        result.setProjectName(project.getProjectName());
        result.setProjectType(project.getProjectType());
        result.setBrand(project.getBrand());
        result.setProjectNum(project.getProjectNum());
        result.setLogicalCity(project.getLogicalCity());
        result.setProjectId(project.getId());
        result.setDate(currentDate);
        result.setHour(currentHour);
        result.setTenantId(project.getTenantId());
        return result;
    }

    private static int count = 0;

    public static void main(String[] args) throws SQLException {
        long start = System.currentTimeMillis();
        Options options = new Options();
        options.addOption("r", "date", true, "需要统计的日期"); // 默认前一天
        options.addOption("h", "hour", true, "小时");
        options.addOption("p", "parentProjectId", true, "需要统计的父节点id"); // 2, 6, 8, 9, 10
        options.addOption("l", "limit", true, "小时limit");
        options.addOption("u", "reRun", true, "reRun");

        CommandLineParser parser = new DefaultParser();
        CommandLine line;
        try {
            line = parser.parse(options, args);
            date = line.getOptionValue("date");
            reRun = Boolean.parseBoolean(line.getOptionValue("reRun"));
            hour = Integer.parseInt(line.getOptionValue("hour"));
            limit = Integer.parseInt(line.getOptionValue("limit"));
            parentProjectId = Integer.parseInt(line.getOptionValue("parentProjectId"));
            log.info("Entering to main. params. date:{}, hour:{}, limit:{}, reRun:{}, parentProjectId:{}", date, hour, limit, reRun, parentProjectId);
            execute();
        } catch (Exception e) {
            log.error("AggregationMetricFactTaskError:", e);
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
