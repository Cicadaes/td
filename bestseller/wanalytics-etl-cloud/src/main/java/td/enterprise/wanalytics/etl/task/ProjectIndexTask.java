package td.enterprise.wanalytics.etl.task;

import com.alibaba.fastjson.JSON;
import com.tendcloud.enterprise.um.umic.entity.Tenant;
import com.tendcloud.enterprise.um.umic.rmi.SecurityService;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import org.elasticsearch.common.collect.Tuple;
import org.springframework.util.CollectionUtils;
import td.enterprise.dao.ProjectIndexDao;
import td.enterprise.entity.ProjectAttribute;
import td.enterprise.entity.WarningConfig;
import td.enterprise.service.ProjectAttributeService;
import td.enterprise.service.WarningConfigService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.jdbc.DbCounterConn;
import td.enterprise.wanalytics.etl.util.*;
import td.olap.query.WiFiAnalyticsQuerService;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.utils.QueryServiceUtils;

import java.math.BigDecimal;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 计算项目指标【绫致优化】
 * 1. 去掉无用字段 4.7h - 1.7h
 * 2. 调整代码 1.7h - 35min
 * 3. 批量更新，查询使用Dao 35min - 28min
 * 4. 批量查询，内存计算 3min
 *
 * @author bowen.sun
 */
public class ProjectIndexTask {

    private static String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url");

    public static Logger logger = Logger.getLogger(ProjectIndexTask.class);

    private static SqlSession sqlSession = null;

    /**
     * 绫致 默认开始营业时间和结束营业时间
     */
    private static final String DEFAULT_OPEN_TIME = "00";
    private static final String DEFAULT_CLOSE_TIME = "24";

    private static final int HOURS = 3;

    /**
     * 一小时的毫秒数
     */
    private static final long HOUR_MS = 60 * 60 * 1000;

    private static final String DATE_FULL_FORMAT = "yyyy-MM-dd HH:mm:ss";
    private static final String DATE_SIMPLE_FORMAT = "yyyy-MM-dd";

    private static SecurityService securityService;

    public static void main(String[] args) {

        try {
            // 解析参数
            Options options = new Options();
            options.addOption("d", "date", true, "日期");
            options.addOption("hour", "hour", true, "时间");
            CommandLineParser parser = new DefaultParser();
            CommandLine line = parser.parse(options, args);
            String date = line.getOptionValue("date");
            String hour = line.getOptionValue("hour");
            logger.info("args: date=" + date + ", hour=" + hour);

            long begin = System.currentTimeMillis();

            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
            sqlSession = sqlSessionFactory.openSession(true);
            Connection connection = sqlSession.getConnection();

//            securityService = UmRmiServiceFactory.getSecurityService();

            execute(date, hour, connection);

            long end = System.currentTimeMillis();
            logger.info("ProjectIndexTask Used times :" + (end - begin) / 1000 + " seconds");
        } catch (Exception e) {
            logger.error("更新项目指标失败：", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        } finally {
            sqlSession.close();
        }
    }

    /**
     * 处理逻辑
     *
     * @param dateStr 当前日期字符串
     * @param hourStr 当前小时字符串
     */
    public static void execute(String dateStr, String hourStr, Connection connection) {
        ProjectIndexDao projectIndexDao = sqlSession.getMapper(ProjectIndexDao.class);

        int curHour = "00".equals(hourStr) ? Calendar.getInstance().get(Calendar.HOUR_OF_DAY) : Integer.parseInt(hourStr);
        Date curDate = "0000-00-00".equals(dateStr) ? new Date() : DateUtil.format(dateStr, "yyyy-MM-dd");

        // 获取全部租户
        List<Map<String, Object>> tenantList = QueryUtils.query(Constants.QUERY_TENANT, QueryUtils.WIFIANALYTICS_DB);

        // 获取健康探针
//        List<String> healthySensor = queryHealthySensor(curDate, curHour);
        List<String> healthySensor = queryHealthySensorBySQL(curDate, curHour);
        logger.info("Health Sensor: " + Arrays.toString(healthySensor.toArray()));

        // 获取近7天日志时长
        Map<String, Integer> sensorLogDuration7 = querySevenDaysData(DEFAULT_OPEN_TIME, DEFAULT_CLOSE_TIME, curDate, hourStr, 7);

        // 获取近30天日志时长
        Map<String, Integer> sensorLogDuration30 = querySevenDaysData(DEFAULT_OPEN_TIME, DEFAULT_CLOSE_TIME, curDate, hourStr, 30);

        for (Map<String, Object> tenant : tenantList) {
            String tenantId = tenant.get("tenant_id") + "";
            logger.info("execute tenantId : " + tenantId);

            // 预警通知接收设置
            boolean needCheck = false;
            WarningConfig warningConfig = getWarningConfig(tenantId);
            if (warningConfig.getSendTenantAdmin() != 0 || warningConfig.getSendPrincipal() != 0) {
                if (warningConfig.getSendMail() != 0 || warningConfig.getSendSms() != 0) {
                    needCheck = true;
                }
            }
            Tenant umTenant = null;
            if (warningConfig.getSendTenantAdmin() == 1) {
                try {
                    umTenant = securityService.getTenantByRId(Integer.parseInt(tenantId));
                } catch (Exception e) {
                    logger.error("getTenantByRId with exception: " + e.getMessage());
                }
            }

            // 查询租户下启用店铺
            Map<String, ProjectInfo> projectInfoMap = queryActiveProject(tenantId, connection);

            // 初始化ProjectIndex
            initProjectIndexRecords(tenantId, connection);

            // 获取所有的店铺和探针
            Map<String, List<String>> projectWithSensorList = querySensorByProject(tenantId, connection);

            List<Map> mapList = new ArrayList<>();
            int idx = 0;
            for (Map.Entry entry : projectInfoMap.entrySet()) {
                String projectId = entry.getKey().toString();
                ProjectInfo projectInfo = (ProjectInfo) entry.getValue();

                StringBuffer content = new StringBuffer();
                String mailTitle = projectInfo.getProjectName() + "项目探针数据报警通知";

                // 探针数
                List<String> sensorMac = projectWithSensorList.getOrDefault(projectId, new ArrayList<>());
                projectInfo.setSensorNum(sensorMac.size());

                if (sensorMac.size() > 0) {
                    long heathCount;
                    long totalNoDataHours7 = 0;
                    long totalNoDataHours30 = 0;

                    if (projectInfo.getCloseHour().equals(DEFAULT_CLOSE_TIME) && projectInfo.getOpenHour().equals(DEFAULT_OPEN_TIME)) {
                        // 如果是默认的营业时间

                        heathCount = sensorMac.stream().filter(x -> healthySensor.contains(x.toUpperCase())).count();
                        logger.debug(projectId + " health count: " + heathCount + " mac:" + Arrays.toString(sensorMac.toArray()));

                        // 近七日无日志时长
                        for (String mac : sensorMac) {
                            long duration = sensorLogDuration7.getOrDefault(mac.toUpperCase(), 6 * 24);
                            totalNoDataHours7 += duration;

                            checkSingleSensor(needCheck, warningConfig, content, totalNoDataHours7);
                        }

                        // 近30日无日志时长
                        for (String mac : sensorMac) {
                            long duration = sensorLogDuration30.getOrDefault(mac.toUpperCase(), 29 * 24);
                            totalNoDataHours30 += duration;
                        }

                    } else {
                        logger.error("非营业时间：" + projectInfo.getProjectName());
                        // 非默认营业时间
                        List<Long> hourList = getLastHourList(curDate, curHour, projectInfo.getOpenHour(), projectInfo.getCloseHour());

                        StringBuilder nowStrCondition = new StringBuilder();
                        String formatStr = new SimpleDateFormat(DATE_FULL_FORMAT).format(hourList.get(0));
                        nowStrCondition.append(" ( ");
                        nowStrCondition.append(" ( date = '").append(formatStr.substring(0, 10)).append("'");
                        nowStrCondition.append(" and hour = '").append(Integer.parseInt(formatStr.substring(11, 13))).append("' ) ");
                        nowStrCondition.append(" )");

                        List<String> haveDataList = new ArrayList<>();
                        for (String mac : sensorMac) {
                            // 查询上小时原始数据量，如果上小时内有数据正常
                            Long rawDataQuantity = WiFiAnalyticsQuerService.getInstance(queryUrl).querySensorOneHourDateNum(mac, nowStrCondition.toString(), true);
                            if (rawDataQuantity > 0) {
                                logger.error("haveDataList add!");

                                haveDataList.add(mac);
                            }
                        }
                        heathCount = haveDataList.size();

                        totalNoDataHours7 = noDataTimes(sensorMac, projectInfo.getOpenHour(), projectInfo.getCloseHour(), curDate, hourStr, 7, needCheck, warningConfig, content);

                        totalNoDataHours30 = noDataTimes(sensorMac, projectInfo.getOpenHour(), projectInfo.getCloseHour(), curDate, hourStr, 30, needCheck, warningConfig, content);
                    }

                    // 健康度
                    double healthRate = heathCount * 100.0 / (sensorMac.size() * 1.0);
                    BigDecimal healthRateBG = new BigDecimal(healthRate);
                    healthRate = healthRateBG.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
                    projectInfo.setHealthRate(healthRate);

                    // 近7日平均无日志时长
                    double noLogDuration = (totalNoDataHours7 * 1.0) / (sensorMac.size() * 1.0);
                    BigDecimal noLogDurationBG = new BigDecimal(noLogDuration);
                    noLogDuration = noLogDurationBG.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
                    projectInfo.setNoLogDuration(noLogDuration);

                    // 近7日平均无日志时长
                    double noLogDuration30 = (totalNoDataHours30 * 1.0) / (sensorMac.size() * 1.0);
                    BigDecimal noLogDurationBG30 = new BigDecimal(noLogDuration30);
                    noLogDuration30 = noLogDurationBG30.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
                    projectInfo.setThirtyNoLogDuration(noLogDuration30);

                    // 预警消息
                    if (needCheck) {
                        Integer healthRateThreshold = Integer.parseInt(warningConfig.getHealthRate());
                        if (healthRate < healthRateThreshold) {
                            content.append("探针健康度：低于预警阀值 ").append(healthRateThreshold).append("%， 实际值为 ").append(healthRate).append("%\n");
                        }

                        Integer noLogThreshold = Integer.parseInt(warningConfig.getSensorsNolog());
                        if (noLogDuration > noLogThreshold) {
                            content.append("探针平均无日志时长：超过预警阀值 ").append(noLogThreshold).append("小时， 实际值为 ").append(noLogDuration).append("小时\n");
                        }

                        sendWarnEmail(umTenant, projectId, mailTitle, content, warningConfig);
                    }

                }

                // 更新值
                Map<String, Object> map = new ConcurrentHashMap<>(7);
                map.put("sensorNum", projectInfo.getSensorNum());
                map.put("healthRate", projectInfo.getHealthRate());
                map.put("noLogDuration", projectInfo.getNoLogDuration());
                map.put("thirtyNoLogDuration", projectInfo.getThirtyNoLogDuration());
                map.put("updateBy", ProjectIndexTask.class.getSimpleName());
                map.put("updater", ProjectIndexTask.class.getSimpleName());
                map.put("updateTime", new SimpleDateFormat(DATE_FULL_FORMAT).format(new Date()));
                map.put("projectId", projectInfo.getId());
                mapList.add(map);
                idx++;

                if (idx % 500 == 0) {
                    batchUpdate(mapList, projectIndexDao);
                }
            }

            batchUpdate(mapList, projectIndexDao);
        }
    }

    /**
     * 查询租户下启用店铺
     *
     * @param tenantId   租户ID
     * @param connection SQL连接
     * @return 店铺列表
     */
    private static Map<String, ProjectInfo> queryActiveProject(String tenantId, Connection connection) {
        Map<String, ProjectInfo> result = new HashMap<>();

        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            ps = connection.prepareStatement(Constants.QUERY_ACTIVE_PROJECT);
            ps.setString(1, tenantId);
            rs = ps.executeQuery();

            while (rs.next()) {
                String openingHour = parseHourStr(rs.getString(2), DEFAULT_OPEN_TIME, false);
                String closingHour = parseHourStr(rs.getString(3), DEFAULT_CLOSE_TIME, true);

                ProjectInfo project = new ProjectIndexTask().new ProjectInfo(rs.getInt(1), openingHour, closingHour, rs.getString(4));

                result.put(String.valueOf(project.getId()), project);
            }
        } catch (SQLException e) {
            logger.error("queryActiveProject with exception: " + e.getMessage());
            e.printStackTrace();
        } finally {
            releaseConnection(ps, rs, null);
        }

        return result;
    }

    /**
     * 初始化ProjectIndex记录
     *
     * @param tenantId   租户ID
     * @param connection SQL连接
     */
    private static void initProjectIndexRecords(String tenantId, Connection connection) {
        String sql = Constants.QUERY_ACTIVE_PROJECT_SIMPLE + " AND id NOT IN (SELECT DISTINCT project_id FROM TD_PROJECT_INDEX ) ";

        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            ps = connection.prepareStatement(sql);
            ps.setString(1, tenantId);
            rs = ps.executeQuery();

            while (rs.next()) {
                String projectId = rs.getString(1);
                String sqlStr = "INSERT INTO TD_PROJECT_INDEX(project_id,project_name,project_type,project_num,status,create_by,creator,tenant_id)"
                        + " SELECT t1.id, t1.project_name, t1.project_type, t1.project_num, t1.status, t2.create_by, t2.creator," + tenantId
                        + " FROM TD_PROJECT t1, "
                        + " (SELECT '" + ProjectIndexTask.class.getSimpleName() + "' AS create_by, '" + ProjectIndexTask.class.getSimpleName() + "' AS creator FROM DUAL) t2"
                        + " WHERE id = " + projectId;
                logger.debug("sqlStr : " + sqlStr);

                connection.prepareStatement(sqlStr).execute();
            }
        } catch (SQLException e) {
            logger.error("initProjectIndexRecords with exception: " + e.getMessage());
            e.printStackTrace();
        } finally {
            releaseConnection(ps, rs, null);
        }
    }

    /**
     * 查询项目下所有探针
     *
     * @param tenantId   租户ID
     * @param connection SQL连接
     */
    private static Map<String, List<String>> querySensorByProject(String tenantId, Connection connection) {
        String sql = "SELECT DISTINCT sensor_mac, project_id FROM TD_SENSOR WHERE status = 1 AND project_id IN ( " + Constants.QUERY_ACTIVE_PROJECT_SIMPLE + ")";

        Map<String, List<String>> projectWithSensorList = new HashMap<>();

        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            ps = connection.prepareStatement(sql);
            ps.setString(1, tenantId);
            rs = ps.executeQuery();

            while (rs.next()) {
                String projectId = rs.getString(2);
                String sensorMac = rs.getString(1).replace(":", "");

                if (!projectWithSensorList.containsKey(projectId)) {
                    projectWithSensorList.put(projectId, new ArrayList<>());
                }

                projectWithSensorList.get(projectId).add(sensorMac);
            }
        } catch (SQLException e) {
            logger.error("querySensorByProject with exception: " + e.getMessage());
            e.printStackTrace();
        } finally {
            releaseConnection(ps, rs, null);
        }

        return projectWithSensorList;
    }

    private static List<String> queryHealthySensorBySQL(Date curDate, int curHour) {
        List<Long> hourList = getLastHourList(curDate, curHour, DEFAULT_OPEN_TIME, DEFAULT_CLOSE_TIME);

        StringBuilder nowStrCondition = new StringBuilder();
        String formatStr = new SimpleDateFormat(DATE_FULL_FORMAT).format(hourList.get(0));
        nowStrCondition.append(" date = '").append(formatStr.substring(0, 10)).append("'");
        nowStrCondition.append(" and hour = '").append(Integer.parseInt(formatStr.substring(11, 13))).append("' ");

        String sql = "select sensor_mac from offline_sensor_heart_hour_counter where " + nowStrCondition.toString() + " ;";
        logger.info("queryHealthySensorBySQL: " + sql);

        Connection connection = null;
        DbCounterConn.getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;
        List<String> healthyMac = new ArrayList<>();

        try {
            connection = DbCounterConn.getConnection();
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()) {
                String sensorMac = rs.getString(1).toUpperCase();
                healthyMac.add(sensorMac.toUpperCase());
            }
        } catch (SQLException e) {
            logger.error("queryHealthySensorBySQL with exception: " + e.getMessage());
            e.printStackTrace();
        } finally {
            releaseConnection(ps, rs, connection);
        }

        return healthyMac;
    }

    /**
     * 查询最近一小时有日志的探针mac
     *
     * @return List
     */
    private static List<String> queryHealthySensor(Date curDate, int curHour) {
        List<Long> hourList = getLastHourList(curDate, curHour, DEFAULT_OPEN_TIME, DEFAULT_CLOSE_TIME);

        StringBuilder nowStrCondition = new StringBuilder();
        String formatStr = new SimpleDateFormat(DATE_FULL_FORMAT).format(hourList.get(0));
        nowStrCondition.append(" date = '").append(formatStr.substring(0, 10)).append("'");
        nowStrCondition.append(" and hour = '").append(Integer.parseInt(formatStr.substring(11, 13))).append("' ");

        String tql = "r0452=select * from enterprise.offline_sensor_heart_hour_counter where " + nowStrCondition.toString() + " group by sensor_mac;";
        QueryEngineResult result = QueryServiceUtils.invoke("post", queryUrl + "/api/query", tql);
        List<String> sensorMac = new ArrayList<>();
        if (result != null) {
            List<ResultBean> results = result.getResults();
            Iterator iter = results.iterator();

            while (iter.hasNext()) {
                ResultBean resultBean = (ResultBean) iter.next();
                if (resultBean.getValue() != null) {
                    sensorMac.add(resultBean.getKey().toUpperCase());
                }
            }
        }

        return sensorMac;
    }

    /**
     * 查询探针近7天日志
     */
    private static Map<String, Integer> querySevenDaysData(String openingTime, String closingTime, Date curDate, String hourStr, int day) {
        logger.info("querySevenDaysData, " + openingTime + " - " + closingTime + " " + curDate + " " + hourStr + " " + day);
        int openHour = Integer.parseInt(openingTime);
        int closeHour = Integer.parseInt(closingTime);
        int curHour = Integer.parseInt(hourStr);

        Tuple<Tuple<String, String>, Integer> dateRange = parseSevenDayRange(openHour, closeHour, curDate, curHour, day);

        Calendar cal = Calendar.getInstance();
        cal.setTime(curDate);
        String curDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());

        String dateCondition1 = " (date >= '" + dateRange.v1().v1() + "' and date <= '" + dateRange.v1().v2() + "' ) and ( hour >= " + openHour + "  and hour < " + closeHour + " )";
        String dateCondition2 = " (date >= '" + curDateStr + "' and date <= '" + curDateStr + "' ) and ( hour >= " + openHour + "  and hour < " + curHour + " )";

        String sql = "SELECT sensor_mac, count(*) FROM ( " +
                " SELECT sensor_mac,hour,date FROM offline_sensor_heart_hour_counter " +
                " WHERE ?" +
//                " AND metric_value > 0 " +
                " GROUP BY sensor_mac,hour,date " +
                " ) t1 GROUP BY sensor_mac";
        String sql1 = sql.replace("?", dateCondition1);
        String sql2 = sql.replace("?", dateCondition2);
        logger.info("querySevenDaysData sql1: " + sql1);
        logger.info("querySevenDaysData sql2: " + sql2);

        Map<String, Integer> sensorNoLogDuration = new HashMap<>();

        Connection connection = null;
        DbCounterConn.getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            connection = DbCounterConn.getConnection();
            ps = connection.prepareStatement(sql1);
            rs = ps.executeQuery();

            Integer logDuration = 0;
            while (rs.next()) {
                String sensorMac = rs.getString(1).toUpperCase();
                logDuration = rs.getInt(2);

                sensorNoLogDuration.put(sensorMac, logDuration);
            }

            ps = connection.prepareStatement(sql2);
            rs = ps.executeQuery();
            while (rs.next()) {
                String sensorMac = rs.getString(1).toUpperCase();
                logDuration = rs.getInt(2);

                int noLogDuration = dateRange.v2() - sensorNoLogDuration.getOrDefault(sensorMac, 0) - logDuration;

                sensorNoLogDuration.put(sensorMac, noLogDuration);
            }

        } catch (SQLException e) {
            logger.error("querySevenDaysData with exception: " + e.getMessage());
            e.printStackTrace();
        } finally {
            releaseConnection(ps, rs, connection);
        }

        return sensorNoLogDuration;
    }

    /**
     * 解析近7天时间范围
     *
     * @param openHour  营业开始时间
     * @param closeHour 营业结束时间
     * @param curDate   当前日期
     * @param curHour   当前小时
     * @return <<开始时间, 结束时间>, 总时间>
     */
    private static Tuple<Tuple<String, String>, Integer> parseSevenDayRange(int openHour, int closeHour, Date curDate, int curHour, int day) {
        int allAnyHour;
        String startDateStr;
        String endDateStr;
        if (curHour < openHour) {
            // 未到营业时间，不算当天
            Date yesterday = DateUtil.addDay2Date(-1, curDate);
            Date startDate = DateUtil.addDay2Date(-(day - 2), yesterday);
            Calendar cal = Calendar.getInstance();
            cal.setTime(startDate);
            startDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());
            cal.setTime(yesterday);
            endDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());

            allAnyHour = (closeHour - openHour) * (day - 1);
        } else if (curHour > closeHour) {
            // 超过营业时间，计算全天
            Date startDate = DateUtil.addDay2Date(-(day - 1), curDate);
            Calendar cal = Calendar.getInstance();
            cal.setTime(startDate);
            startDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());
            cal.setTime(curDate);
            endDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());

            allAnyHour = (closeHour - openHour) * day;
        } else {
            // 在营业时间内
            Date yesterday = DateUtil.addDay2Date(-1, curDate);
            Date startDate = DateUtil.addDay2Date(-(day - 2), yesterday);
            Calendar cal = Calendar.getInstance();
            cal.setTime(startDate);
            startDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());
            cal.setTime(yesterday);
            endDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());
            cal.setTime(curDate);
            String curDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());

            // 6天总日志时长+当前营业时长
            allAnyHour = (closeHour - openHour) * (day - 1) + (curHour - openHour);
        }

        return new Tuple<>(new Tuple<>(startDateStr, endDateStr), allAnyHour);


    }

    /**
     * 批量更新
     *
     * @param mapList map
     * @param dao     DAO
     */
    private static void batchUpdate(List<Map> mapList, ProjectIndexDao dao) {
        if (!CollectionUtils.isEmpty(mapList)) {
            logger.info("batchUpdate：" + mapList.size());

            dao.batchUpdate(mapList);

            logger.debug(JSON.toJSONString(mapList));

            mapList.clear();
        }
    }

    /**
     * 预警处理
     *
     * @param tenant        租户
     * @param projectId     店铺ID
     * @param mailTitle     预警标题
     * @param content       预警内容
     * @param warningConfig 预警设置
     */
    private static void sendWarnEmail(Tenant tenant, String projectId, String mailTitle, StringBuffer content, WarningConfig warningConfig) {
        if (StringUtils.isEmpty(content.toString()) || tenant == null) {
            return;
        }

        // 租户管理员员
        if (warningConfig.getSendTenantAdmin() == 1) {
            if (warningConfig.getSendMail() == 1 && StringUtils.isNotEmpty(tenant.getAdminEmail())) {
                String[] emails = {tenant.getAdminEmail()};
                sendMail(mailTitle, content.toString(), emails);
            }
        }

        // 店铺负责人
        if (warningConfig.getSendPrincipal() != null && warningConfig.getSendPrincipal() == 1) {
            ProjectAttribute projectAttributePage = new ProjectAttribute();
            projectAttributePage.setProjectId(Integer.parseInt(projectId));
            ProjectAttribute projectAttribute = null;
            try {
                projectAttribute = ProjectAttributeService.queryBySingle(sqlSession, projectAttributePage);
            } catch (Exception e) {
                logger.error("ProjectAttributeService.queryBySingle with exception: " + e.getMessage());
            }

            if (warningConfig.getSendMail() == 1 && projectAttribute != null && StringUtils.isNotEmpty(projectAttribute.getEmail())) {
                String[] emails = {projectAttribute.getEmail()};
                sendMail(mailTitle, content.toString(), emails);
            }
        }
    }

    /**
     * 取最近三小时
     *
     * @param curDate     当前日期
     * @param curHour     当前小时
     * @param openingHour 开始营业时间
     * @param closingHour 结束营业时间
     * @return 最近3小时营业时间
     */
    private static List<Long> getLastHourList(Date curDate, int curHour, String openingHour, String closingHour) {
        int openHour = Integer.parseInt(openingHour);
        int closeHour = Integer.parseInt(closingHour);

        Calendar cal = Calendar.getInstance();
        cal.setTime(curDate);
        cal.add(Calendar.HOUR_OF_DAY, openHour);
        long openTime = cal.getTime().getTime();
        cal.setTime(curDate);
        cal.add(Calendar.HOUR_OF_DAY, closeHour);
        long closeTime = cal.getTime().getTime();
        cal.setTime(curDate);
        cal.add(Calendar.HOUR_OF_DAY, curHour);
        long currentTime = cal.getTime().getTime();

        List<Long> hourList = new ArrayList<>();
        if (openTime < closeTime) {
            if (currentTime <= openTime) {
                // 还没到营业开始时间
                // 取前一天，营业结束时间前3小时
                closeTime -= 24 * HOUR_MS;
                for (int i = 1; i <= HOURS; i++) {
                    hourList.add(closeTime - i * HOUR_MS);
                }
            } else if (currentTime > openTime && currentTime <= (openTime + HOURS * HOUR_MS)) {
                // 到营业开始时间，但还不足3小时
                // 取营业开始时间-查询时间（直接取后3小时即可）
                for (; currentTime > openTime; ) {
                    hourList.add(currentTime -= HOUR_MS);
                }
            } else if (currentTime >= (openTime + HOURS * HOUR_MS) && currentTime <= closeTime) {
                // 到营业开始时间，足三小时，且还没到营业结束时间
                // 取hour之前的3小时
                for (int i = 1; i <= HOURS; i++) {
                    hourList.add(currentTime - i * HOUR_MS);
                }
            } else if (currentTime > closeTime) {
                // 超过营业结束时间
                // 取营业结束时间前3小时
                for (int i = 1; i <= HOURS; i++) {
                    hourList.add(closeTime - i * HOUR_MS);
                }
            }
        } else {
            // 营业时间不合理，则直接取hour之前的3小时
            for (int i = 1; i <= HOURS; i++) {
                hourList.add(currentTime - i * HOUR_MS);
            }
        }

        return hourList;
    }

    /**
     * 无日志时长
     *
     * @param sensorList    探针列表
     * @param openingHour   开始营业时间
     * @param closingHour   结束营业时间
     * @param curDate       当前时间
     * @param hourStr       当前小时字符串
     * @param day           最近无日志时间范围
     * @param needCheck     是否需要预警
     * @param warningConfig 预警设置
     * @param content       预警内容
     * @return 平均无日志时长
     */
    private static long noDataTimes(List<String> sensorList, String openingHour, String closingHour, Date curDate, String hourStr, int day, boolean needCheck, WarningConfig warningConfig, StringBuffer content) {
        long totalNoDataHours = 0;

        if (null == sensorList || sensorList.isEmpty()) {
            return totalNoDataHours;
        }

        for (String sensor : sensorList) {
            long anyHour = anyNoDataTimes(sensor, openingHour, closingHour, curDate, hourStr, day);

            totalNoDataHours += anyHour;

            checkSingleSensor(needCheck, warningConfig, content, totalNoDataHours);
        }

        return totalNoDataHours;
    }

    /**
     * 无日志时长
     *
     * @param openingTime 营业开始时间
     * @param closingTime 营业结束时间
     * @param curDate     当前日期
     * @param hourStr     当前时间
     * @param day         天数(天数必须大于2)
     * @return 无日志时长
     */
    private static long anyNoDataTimes(String mac, String openingTime, String closingTime, Date curDate, String hourStr, int day) {
        long totalNoDataHours;
        // 最近有日志的日期，先查出最新有数据日期（不支持日期、小时同时倒序查询）
        int openHour = Integer.parseInt(openingTime);
        int closeHour = Integer.parseInt(closingTime);
        int hour = Integer.parseInt(hourStr);
        // 有日志时间
        int daysAnyHour;
        // 总日志时间
        int allAnyHour;
        if (hour < openHour) {
            // 未到营业时间，不算当天
            Date yesterday = DateUtil.addDay2Date(-1, curDate);
            Date startDate = DateUtil.addDay2Date(-(day - 2), yesterday);
            Calendar cal = Calendar.getInstance();
            cal.setTime(startDate);
            String startDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());
            cal.setTime(yesterday);
            String endDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());

            allAnyHour = (closeHour - openHour) * (day - 1);
            daysAnyHour = WiFiAnalyticsQuerService.getInstance(queryUrl).querySevenDaysData(startDateStr, openingTime, closingTime, mac, endDateStr);
        } else if (hour > closeHour) {
            // 超过营业时间，计算全天
            Date startDate = DateUtil.addDay2Date(-(day - 1), curDate);
            Calendar cal = Calendar.getInstance();
            cal.setTime(startDate);
            String startDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());
            cal.setTime(curDate);
            String endDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());

            allAnyHour = (closeHour - openHour) * day;
            daysAnyHour = WiFiAnalyticsQuerService.getInstance(queryUrl).querySevenDaysData(startDateStr, openingTime, closingTime, mac, endDateStr);
        } else {
            // 在营业时间内
            Date yesterday = DateUtil.addDay2Date(-1, curDate);
            Date startDate = DateUtil.addDay2Date(-(day - 2), yesterday);
            Calendar cal = Calendar.getInstance();
            cal.setTime(startDate);
            String startDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());
            cal.setTime(yesterday);
            String endDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());
            cal.setTime(curDate);
            String curDateStr = new SimpleDateFormat(DATE_SIMPLE_FORMAT).format(cal.getTime());

            // 6天总日志时长+当前营业时长
            allAnyHour = (closeHour - openHour) * (day - 1) + (hour - openHour);
            // 6天有效日志数
            daysAnyHour = WiFiAnalyticsQuerService.getInstance(queryUrl).querySevenDaysData(startDateStr, openingTime, closingTime, mac, endDateStr);
            // 当天有效日志数
            int daysNow = WiFiAnalyticsQuerService.getInstance(queryUrl).querySevenDaysData(curDateStr, openingTime, hourStr, mac, curDateStr);
            daysAnyHour = daysAnyHour + daysNow;
        }

        totalNoDataHours = allAnyHour - daysAnyHour;
        logger.info("营业开始时间：" + openingTime + " 营业结束时间：" + closingTime + " mac：" + mac + " 总日志时长：" + allAnyHour + " 有效日志时长：" + daysAnyHour + " 当前时间：" + hourStr);
        return totalNoDataHours;
    }

    /**
     * 发送预警邮件
     *
     * @param mailTitle    预警标题
     * @param content      预警内容
     * @param recipientArr 接受人
     */
    private static void sendMail(String mailTitle, String content, String[] recipientArr) {
        if (recipientArr == null || recipientArr.length == 0) {
            return;
        }

        try {
            MailUtil.sendMail(mailTitle, content, recipientArr);
        } catch (Exception e) {
            logger.error("sendMail with exception: " + e.getMessage());
        }
        logger.info(Arrays.toString(recipientArr) + mailTitle + content);
    }

    /**
     * 获取租户预警设置
     *
     * @param tenantId 租户ID
     * @return 预警设置
     */
    private static WarningConfig getWarningConfig(String tenantId) {
        WarningConfig warningConfigPage = new WarningConfig();
        warningConfigPage.setTenantId(tenantId);
        WarningConfig warningConfig = null;
        try {
            warningConfig = WarningConfigService.queryBySingle(sqlSession, warningConfigPage);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (null != warningConfig) {
            return warningConfig;
        } else {
            WarningConfig config = new WarningConfig();
            config.setSendTenantAdmin(0);
            config.setSendPrincipal(0);
            config.setSendMail(0);
            config.setSendSms(0);
            return config;
        }

    }

    /**
     * 解析小时字符串
     *
     * @param timeStr     时间字符串
     * @param defaultStr  默认小时
     * @param isCloseTime 是否结束营业时间
     * @return 小时字符串
     */
    private static String parseHourStr(String timeStr, String defaultStr, boolean isCloseTime) {
        String hourStr = defaultStr;
        String splitStr = ":";
        String undefinedStr = "undefined";
        String zeroHour = "00";
        int defaultSize = 2;
        if (StringUtils.isNotBlank(timeStr) && !timeStr.isEmpty() && timeStr.split(splitStr).length == defaultSize && !timeStr.contains(undefinedStr)) {
            hourStr = timeStr.split(splitStr)[0];
            if (isCloseTime && !zeroHour.equals(timeStr.split(splitStr)[1])) {
                hourStr = (Integer.parseInt(hourStr) + 1) + "";
            }
        }

        return hourStr;
    }

    /**
     * 检查单探针无日志时长
     *
     * @param needCheck        是否检查
     * @param warningConfig    预警设置
     * @param content          预警内容
     * @param totalNoDataHours 无日志时长
     */
    private static void checkSingleSensor(boolean needCheck, WarningConfig warningConfig, StringBuffer content, long totalNoDataHours) {
        if (needCheck) {
            String noLogThreshold = warningConfig.getSensorNolog();
            if (null != noLogThreshold && !noLogThreshold.isEmpty()) {
                Integer sensorNoLog = Integer.parseInt(noLogThreshold);
                if (totalNoDataHours >= sensorNoLog) {
                    content.append("单探针无日志时长：超过预警阀值 ").append(sensorNoLog).append("小时， 实际值为 ").append(totalNoDataHours).append("小时\n");
                }
            }
        }
    }

    @Getter
    @Setter
    @ToString
    class ProjectInfo {
        int id;
        String openHour;
        String closeHour;
        String projectName;

        int sensorNum;
        double healthRate;
        double noLogDuration;
        double thirtyNoLogDuration;

        ProjectInfo(int id, String openHour, String closeHour, String projectName) {
            this.id = id;
            this.openHour = openHour;
            this.closeHour = closeHour;
            this.projectName = projectName;
        }
    }

    interface Constants {
        String QUERY_TENANT = " SELECT distinct tenant_id FROM TD_PROJECT WHERE status = 1 ";

        String QUERY_ACTIVE_PROJECT = " SELECT id,opening_time,closing_time,project_name FROM TD_PROJECT WHERE tenant_id = ? AND status = 1 AND project_type=1 ";

        String QUERY_ACTIVE_PROJECT_SIMPLE = "SELECT id FROM TD_PROJECT WHERE tenant_id = ? AND status = 1 AND project_type=1 ";
    }

    /**
     * 释放连接
     */
    private static void releaseConnection(PreparedStatement ps, ResultSet rs, Connection conn) {
        try {
            if (null != conn) {
                conn.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            if (null != ps) {
                ps.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            if (null != rs) {
                rs.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
