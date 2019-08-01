package td.enterprise.wanalytics.etl.task;


import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.SensorInfoDao;
import td.enterprise.wanalytics.etl.bean.Sensor;
import td.enterprise.wanalytics.etl.bean.SensorHeartLog;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.jdbc.DbCounterConn;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;
import td.olap.query.WiFiAnalyticsQuerService;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * created by jingdong.cao
 * <p>
 * 根据人群和画像 计算出具体值
 */
@Slf4j
public class SensorIndexTask {

    private static final String DEFAULT_OPEN_TIME = "07";           //默认营业开始时间（若店铺未设置营业时间）
    private static final String DEFAULT_CLOSE_TIME = "19";          //默认营业结束时间（若店铺未设置营业时间）
    private static final int HOURS = 3;                             //3小时数据
    private static final long HOUR_MS = 60 * 60 * 1000;             //一小时的毫秒
    private static final int DAYS = 7;                              //7天数据
    private static final Integer systemOpeningHour = 0;             //系统默认营业开始时间（ETL默认计算时间）
    private static final Integer systemClosingHour = 24;            //系统默认营业结束时间（ETL默认计算时间）
    private static final String systemOpengingTime = "00:00";       //系统默认营业结束时间（数据库默认营业开始时间）
    private static final String systemClosingTime = "23:59";        //系统默认营业结束时间（数据库默认营业开始时间）
    private static Map<String, Integer> sevenLogDataCountMap;       //近七天有日志时长
    private static Map<String, Integer> currentLogDataCountMap;     //当天有日志时长（近24小时有日志时长）
    private static Map<String, Integer> threeHourLogDataCountMap;   //3小时日志数
    private static Integer systemTotalLogCountHours;                //系统总有效日志时长（ETL任务默认所有Sensor总有效时长）
    private static String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url"); //queryEngine url

    public static void main(String[] args) {
        try {
            Options options = new Options();
            options.addOption("tenantId", "tenantId", true, "租户ID");
            options.addOption("date", "date", true, "运行时间");
            options.addOption("hour", "hour", true, "时间");
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String tenantId = line.getOptionValue("tenantId");
            String date = line.getOptionValue("date");
            String hour = line.getOptionValue("hour");
            log.info("tenantId is " + tenantId + " , date is " + date + " , hour is " + hour);

            // tenantId = "2";
            // date = "2017-06-21";
            // hour = "15";

            long begin = System.currentTimeMillis();
            execute(tenantId, date, hour);
            long end = System.currentTimeMillis();

            log.info("SensorIndexTask Used times :" + (end - begin) / 1000 + " seconds");

        } catch (Exception e) {
            log.error("SensorIndexTask： ", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_CONTINUE);
        }
        System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
    }

    public static void execute(String tenantId, String dateStr, String hourStr) throws SQLException {

        log.info("---------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>---------------");

        log.info("Enter queryData, params are: date=" + dateStr + ", tenantId=" + tenantId + " , hour=" + hourStr);

        try (SqlSession sqlSession = MyBatisUtil.getSqlSessionFactory().openSession(true);
             //创建connection加载数据
             Connection connection = DbCounterConn.getConnection()) {
            //1.查询所有Sensor信息

            SensorInfoDao dao = sqlSession.getMapper(SensorInfoDao.class);


            List<Sensor> sensors = null;
            if (!Objects.equals(tenantId, "-1")) {
                sensors = dao.selectAllSensorByTenantId(tenantId);
            } else {
                sensors = dao.selectAllSensor();
            }

            log.info("查询到所有的sensor信息，sensor总数：" + sensors.size());

            //2.判断传入的时间是否合理，并赋值
            if (hourStr.equals("00")) {
                hourStr = String.valueOf(new Date().getHours());
            }
            int hour = Integer.parseInt(hourStr);

            Date date;
            if (dateStr.equals("0000-00-00")) {
                date = new Date();
            } else {
                date = DateUtil.format(dateStr, "yyyy-MM-dd");
            }

            log.info("执行时间为：date:" + date.toString() + " , hour: " + hour);


            //3.获取近3小时时间段
            List<Long> durationThreeHoursRange = getDurationThreeHoursRange(date, hour, systemOpeningHour, systemClosingHour);

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            //查询日期及时间
            String queryDate = sdf.format(durationThreeHoursRange.get(0)).substring(0, 10);

            List<Integer> queryHours = durationThreeHoursRange.stream()
                    .map(d -> Integer.parseInt(sdf.format(d).substring(11, 13)))
                    .collect(Collectors.toList());

            log.info("------------------3小时日志数-------------------");
            log.info("执行的日期为：" + queryDate);
            log.info("执行的时间为：" + hourStr);
            log.info("3h之前分别为：" + JSON.toJSONString(queryHours));

            //4.将所有sensor近3小时的日志数加载到内存中(计算指标1：3小时日志数（当前时间之前3个小时）)

            log.info("----------------初始化加载所有Sensor近3小时日志数-------------------");
            initThreeHourLogDataMap(connection, queryDate, queryHours);


            //5.将所有sensor近七日有效日志数加载到内存中
            log.info("----------------初始化加载所有sensor近七日有效日志数-------------------");
            initSevenLogDataMap(connection, date, hour, systemOpeningHour, systemClosingHour);

            //6.加载所有sensor近24小时有效日志数，判断sensor状态
            log.info("----------------加载所有sensor近24小时有效日志数，判断sensor状态-------------------");
            initCurrentLogDataMap(connection, date, hour, systemOpeningHour, systemClosingHour);

            //7.处理所有Sensor
            String finalHourStr = hourStr;
            List<Map> collect = sensors.stream().map(sensor -> {

                Map<String, Object> map = new ConcurrentHashMap<>();
                map.put("id", sensor.getId());

                String mac = sensor.getSensorMac().replaceAll(":", "").toLowerCase(); //探针的mac地址(去掉冒号转成小写)

                Integer normal = 0;   //0:异常    1：正常    2：停用
                Double noLogDuration = 0.0;   //无日志时长

                String openingTime = sensor.getOpeningTime();
                String closingTime = sensor.getClosingTime();

                String openingHour = DEFAULT_OPEN_TIME;
                String closingHour = DEFAULT_CLOSE_TIME;
                if (StringUtils.isNotBlank(openingTime) && !openingTime.isEmpty() && openingTime.split(":").length == 2 && openingTime.indexOf("undefined") == -1) {
                    openingHour = openingTime.split(":")[0];
                }
                if (StringUtils.isNotBlank(openingTime) && !closingTime.isEmpty() && closingTime.split(":").length == 2 && closingTime.indexOf("undefined") == -1) {
                    closingHour = closingTime.split(":")[0];
                    if (!"00".equals(closingTime.split(":")[1])) {
                        closingHour = (Integer.parseInt(closingHour) + 1) + "";
                    }
                }
                int openHour = Integer.parseInt(openingHour);
                int closeHour = Integer.parseInt(closingHour);

                if (!systemOpeningHour.equals(openHour) || !systemClosingHour.equals(closeHour)) {  //说明用户更改过系统默认店铺的营业时间

                    //获取近3个小时时间段
                    List<Long> threeHoursRange = getDurationThreeHoursRange(date, hour, openHour, closeHour);

                    //三小时
                    StringBuffer nowStrs = new StringBuffer();
                    for (int i = 0; i < threeHoursRange.size(); i++) {
                        String formatStr = sdf.format(threeHoursRange.get(i));
                        String formatDate = formatStr.substring(0, 10);
                        Integer formatHour = Integer.parseInt(formatStr.substring(11, 13));
                        if (i == 0) {
                            nowStrs.append(" ( ");
                        }
                        nowStrs.append(" ( date = '" + formatDate + "'");
                        nowStrs.append(" and hour = '" + formatHour + "' ) ");
                        if (i == threeHoursRange.size() - 1) {
                            nowStrs.append(" )");
                        } else {
                            nowStrs.append(" or ");
                        }
                    }

                    //指标1：近7日无日志时长
                    if (openHour < closeHour) {

                        noLogDuration = (double) anyNoDataTimes(sensor, openingHour, closingHour, date, finalHourStr, DAYS);
                    } else {
                        log.error("错误数据  探针id= " + sensor.getId() + " 项目id=" + sensor.getProjectId() + " 营业开始时间：" + openHour + " 营业结束时间：" + closeHour + " 计算开始时间：" + openingTime + " 计算结束时间：" + closingTime);
                    }

                    map.put("noLogDuration", noLogDuration);

                    //指标2：探针状态
                    normal = (int) noOneDataTimes(sensor, openingHour, closingHour, date, finalHourStr);
                    if (normal == 0) {
                        normal = 1;// 正常
                    } else if ((closeHour - openHour) == normal) {
                        normal = 2;// 停用
                    } else {
                        normal = 0;// 异常
                    }

                    map.put("normal", normal);

                    //指标3：近3小时日志数
                    Long logHours = WiFiAnalyticsQuerService.getInstance(queryUrl).queryAllLogByHour(sensor.getSensorMac().replace(":", ""), nowStrs.toString(), true);

                    map.put("logHours", logHours);
                } else {

                    //指标1：3小时日志数
                    if (threeHourLogDataCountMap.containsKey(mac)) {

                        map.put("logHours", threeHourLogDataCountMap.get(mac));
                    } else {
                        map.put("logHours", 0);
                    }

                    //指标2：近7日无日志时长
                    if (sevenLogDataCountMap.containsKey(mac)) {

                        map.put("noLogDuration", systemTotalLogCountHours - sevenLogDataCountMap.get(mac) + 1); //近七日有效日志数不包括当前小时
                    } else {
                        map.put("noLogDuration", systemTotalLogCountHours);
                    }

                    //指标3：探针状态
                    if (currentLogDataCountMap.containsKey(mac)) {
                        map.put("normal", 0);

                        if (currentLogDataCountMap.get(mac) > systemClosingHour - systemOpeningHour - 1) {
                            map.put("normal", 1);
                        }

                    } else {
                        map.put("normal", 2);
                    }

                }

                return map;

            }).collect(Collectors.toList());

            //8.数据批量入库
            dao.batchUpdate(collect);

            log.info("--------------------------->>>>>>>>>>>>>>>>>>>--------------------------------");
        }
    }

    /**
     * 初始化加载所有Sensor近3小时日志数
     *
     * @param date  当前查询时间：天
     * @param hours 当前查询时间：近3小时
     */

    public static void initThreeHourLogDataMap(Connection connection, String date, List<Integer> hours) throws SQLException {

        log.info("query args : date = " + date + " hours = " + JSON.toJSONString(hours));

        StringBuffer sqlBuffer = new StringBuffer("SELECT sensor_mac,`hour`,metric_value FROM offline_sensor_heart_hour_counter WHERE `date` = ? AND `hour` in ");
        sqlBuffer.append("(");
        for (int i = 0; i < hours.size(); i++) {
            sqlBuffer.append(hours.get(i));
            if (i != hours.size() - 1) {
                sqlBuffer.append(",");
            }
        }
        sqlBuffer.append(")").append(" AND sensor_mac IS NOT NULL AND sensor_mac <> ''");

        String sql = sqlBuffer.toString();

        log.info("查询的sql是：" + sql);

        PreparedStatement pst = connection.prepareStatement(sql);
        pst.setString(1, date);

        ResultSet rs = pst.executeQuery();

        List<SensorHeartLog> list = new ArrayList<>();

        while (rs.next()) {
            SensorHeartLog log = new SensorHeartLog();

            log.setSensorMac(rs.getString(1));
            log.setHour(rs.getInt(2));
            log.setMetricValue(rs.getInt(3));
            list.add(log);
        }

        log.info("-------------->>>>>>>>>>>---------------------");
        log.info("从数据库查询的数据大小为：" + list.size());

        threeHourLogDataCountMap = list.stream()
                .peek(sensorHeartLog -> sensorHeartLog.setSensorMac(sensorHeartLog.getSensorMac().toLowerCase()))
                .collect(Collectors.toMap(SensorHeartLog::getSensorMac, SensorHeartLog::getMetricValue, (a, b) -> a + b));

        log.info("-------------->>>>>>>>>>>---------------------");
    }

    /**
     * 获取近3个小时时间段
     *
     * @param date        调用该方法的日期
     * @param hour        调用该方法的当前小时
     * @param openHour    营业时间开始时间
     * @param closingHour 营业时间结束时间
     */
    public static List<Long> getDurationThreeHoursRange(Date date, int hour, Integer openHour, Integer closingHour) {
        Calendar ca = Calendar.getInstance();
        ca.setTime(date);
        ca.add(Calendar.HOUR_OF_DAY, openHour);
        long openTime = ca.getTime().getTime();
        ca.setTime(date);
        ca.add(Calendar.HOUR_OF_DAY, closingHour);
        long closeTime = ca.getTime().getTime();
        ca.setTime(date);
        ca.add(Calendar.HOUR_OF_DAY, hour);
        long currentTime = ca.getTime().getTime();

        List<Long> hourList = new ArrayList<>();
        if (openTime < closeTime) {
            if (currentTime <= openTime) {//还没到营业开始时间
                //取前一天，营业结束时间前3小时
                closeTime -= 24 * HOUR_MS;
                for (int i = 1; i <= HOURS; i++) {
                    hourList.add(closeTime - i * HOUR_MS);
                }
            } else if (currentTime <= (openTime + HOURS * HOUR_MS) && currentTime > openTime) {//到营业开始时间，但还不足3小时
                //取营业开始时间-查询时间（直接取后3小时即可）
                for (; currentTime > openTime; ) {
                    hourList.add(currentTime -= HOUR_MS);
                }
            } else if (currentTime <= closeTime && (currentTime >= (openTime + HOURS * HOUR_MS))) {//到营业开始时间，足三小时，且还没到营业结束时间
                //取hour之前的3小时
                for (int i = 1; i <= HOURS; i++) {
                    hourList.add(currentTime - i * HOUR_MS);
                }
            } else if (currentTime > closeTime) {//超过营业结束时间
                //取营业结束时间前3小时
                for (int i = 1; i <= HOURS; i++) {
                    hourList.add(closeTime - i * HOUR_MS);
                }
            }
        } else {
            //营业时间不合理，则直接取hour之前的3小时
            for (int i = 1; i <= HOURS; i++) {
                hourList.add(currentTime - i * HOUR_MS);
            }
        }

        return hourList;
    }


    /**
     * 初始化加载所有Sensor近7日有效日志数
     *
     * @param date        调用该方法的日期
     * @param hour        调用该方法的当前小时
     * @param openHour    营业时间开始时间
     * @param closingHour 营业时间结束时间
     */
    public static void initSevenLogDataMap(Connection connection, Date date, int hour, Integer openHour, Integer closingHour) throws SQLException {

        log.info("query args : date = " + date + " , hour = " + hour + " , openHour = " + openHour + " , closingHour = " + closingHour);

        systemTotalLogCountHours = (closingHour - openHour) * DAYS;

        if (hour < openHour) {  //1.当前执行时间小于营业开始时间

            Date date1 = DateUtil.addDay2Date(-1, date);

            Date sevenDay = DateUtil.addDay2Date(-(DAYS - 2), date1);
            Calendar cal = Calendar.getInstance();
            cal.setTime(sevenDay);
            String sevenDaysAgoTime = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            cal.setTime(date1);
            String nowDate = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            //6天总日志时长
            systemTotalLogCountHours = (closingHour - openHour) * (DAYS - 1);

            //6天有效日志数(初始化到map)
            List<SensorHeartLog> sensorHeartLogs = assemblyData(connection, sevenDaysAgoTime, openHour, nowDate, closingHour);

            sevenLogDataCountMap = sensorHeartLogs.stream()
                    .collect(Collectors.toMap(SensorHeartLog::getSensorMac, SensorHeartLog::getCounter));

        } else if (hour > closingHour) {    //2.当前执行时间大于营业结束时间
            Date sevenDay = DateUtil.addDay2Date(-(DAYS - 1), date);
            Calendar cal = Calendar.getInstance();
            cal.setTime(sevenDay);
            String sevenDaysAgoTime = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            cal.setTime(date);
            String nowDate = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());

            //7天总日志时长
            systemTotalLogCountHours = (closingHour - openHour) * DAYS;
            //7天有效日志数（库里有多少条数据）

            List<SensorHeartLog> sensorHeartLogs = assemblyData(connection, sevenDaysAgoTime, openHour, nowDate, closingHour);

            sevenLogDataCountMap = sensorHeartLogs.stream()
                    .collect(Collectors.toMap(SensorHeartLog::getSensorMac, SensorHeartLog::getCounter));

        } else {    //3.当前执行时间介于营业时间范围内

            Date date1 = DateUtil.addDay2Date(-1, date);
            Date sevenDay = DateUtil.addDay2Date(-(DAYS - 2), date1);
            Calendar cal = Calendar.getInstance();
            cal.setTime(sevenDay);
            String sevenDaysAgoTime = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            cal.setTime(date1);
            //String date2 = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            cal.setTime(date);
            String nowDate = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            //6天总日志时长+当前营业时长
            systemTotalLogCountHours = (closingHour - openHour) * (DAYS - 1) + (hour - openHour);

           /* //6天有效日志数
            List<SensorHeartLog> sixDaysSensorHeartLogs = assemblyData(sevenDaysAgoTime, openHour, date2, closingHour);
            //当天有效日志数
            List<SensorHeartLog> currentSensorHeartLogs = assemblyData(nowDate, openHour, nowDate, closingHour);

            sixDaysSensorHeartLogs.addAll(currentSensorHeartLogs);*/

            List<SensorHeartLog> sevenDaysSensorHeartLogs = assemblyData(connection, sevenDaysAgoTime, openHour, nowDate, closingHour);
            sevenLogDataCountMap = sevenDaysSensorHeartLogs.stream()
                    .collect(Collectors.toMap(SensorHeartLog::getSensorMac, SensorHeartLog::getCounter));

        }

        log.info("7天总日志时长：" + systemTotalLogCountHours);

    }


    /**
     * 装配数据
     */
    public static List<SensorHeartLog> assemblyData(Connection connection, String beginDate, Integer openingHour, String endDate, Integer closingHour) throws SQLException {

        log.info("query args: beginDate = " + beginDate + " , openingHour = " + openingHour + " , endDate = " + endDate + " , closingHour = " + closingHour);

        String sql = "SELECT sensor_mac,count(1) counter FROM offline_sensor_heart_hour_counter WHERE `date` >= ? AND `date` <= ? AND `hour`>=? AND `hour`<? AND sensor_mac IS NOT NULL AND sensor_mac <> '' AND metric_value>0 GROUP BY sensor_mac";
        log.info("查询的sql是：" + sql);

        PreparedStatement pst = connection.prepareStatement(sql);
        pst.setString(1, beginDate);
        pst.setString(2, endDate);
        pst.setInt(3, openingHour);
        pst.setInt(4, closingHour);

        ResultSet rs = pst.executeQuery();

        List<SensorHeartLog> list = new ArrayList<>();

        while (rs.next()) {
            SensorHeartLog log = new SensorHeartLog();

            log.setSensorMac(rs.getString(1));
            log.setCounter(rs.getInt(2));

            list.add(log);
        }

        log.info("从数据库查询到的数据大小为：" + list.size());
        return list.stream()
                .peek(sensorHeartLog -> sensorHeartLog.setSensorMac(sensorHeartLog.getSensorMac().toLowerCase()))
                .collect(Collectors.toList());

    }


    /**
     * 初始化加载所有Sensor近24h有效日志数
     *
     * @param date        调用该方法的日期
     * @param hour        调用该方法的当前小时
     * @param openHour    营业时间开始时间
     * @param closingHour 营业时间结束时间
     */
    public static void initCurrentLogDataMap(Connection connection, Date date, int hour, Integer openHour, Integer closingHour) throws SQLException {

        log.info("query args: date = " + date + " , hour = " + hour + " , openHour = " + openHour + " , closingHour = " + closingHour);

        //最近有日志的日期
        //先查出最新有数据日期（不支持日期、小时同时倒序查询）
        if (hour < openHour) {  //1.当前执行时间小于营业开始时间

            Date date1 = DateUtil.addDay2Date(-1, date);
            Calendar cal = Calendar.getInstance();
            cal.setTime(date1);
            String nowDate = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());

            //近24小时有效日志数
            List<SensorHeartLog> sensorHeartLogs = assemblyData(connection, nowDate, openHour, nowDate, closingHour);

            currentLogDataCountMap = sensorHeartLogs.stream()
                    .collect(Collectors.toMap(SensorHeartLog::getSensorMac, SensorHeartLog::getCounter));


        } else if (hour > closingHour) {    //2.当前执行时间大于营业结束时间

            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            String nowDate = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());

            List<SensorHeartLog> sensorHeartLogs = assemblyData(connection, nowDate, openHour, nowDate, closingHour);

            currentLogDataCountMap = sensorHeartLogs.stream()
                    .collect(Collectors.toMap(SensorHeartLog::getSensorMac, SensorHeartLog::getCounter));

        } else {    //3.当前执行时间介于营业时间

            Date date1 = DateUtil.addDay2Date(-1, date);
            Calendar cal = Calendar.getInstance();
            cal.setTime(date1);
            String date2 = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            cal.setTime(date);
            String nowDate = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());

            List<SensorHeartLog> newLogs = assemblyData(connection, date2, hour, date2, closingHour);
            List<SensorHeartLog> oldLogs = assemblyData(connection, nowDate, openHour, nowDate, hour);

            newLogs.addAll(oldLogs);

            currentLogDataCountMap = newLogs.stream()
                    .collect(Collectors.toMap(SensorHeartLog::getSensorMac, SensorHeartLog::getCounter, (a, b) -> a + b));

        }

    }


    /**
     * 无日志时长
     *
     * @param sensor      探针
     * @param openingTime 营业开始时间
     * @param closingTime 营业结束时间
     * @param date        当前日期
     * @param hourStr     当前时间
     * @param day         天数(天数必须大于2)
     * @return
     */
    public static long anyNoDataTimes(Sensor sensor, String openingTime, String closingTime, Date date, String hourStr, int day) {
        long totalNoDataHours = 0;
        String mac = sensor.getSensorMac().replace(":", "");
        //最近有日志的日期
        //先查出最新有数据日期（不支持日期、小时同时倒序查询）
        int openHour = Integer.parseInt(openingTime);
        int closeHour = Integer.parseInt(closingTime);
        int hour = Integer.parseInt(hourStr);
        //7天有效日志数
        int daysAnyHour = 0;
        int allAnyHour = (closeHour - openHour) * day;
        if (hour < openHour) {
            // 是否健康度 按营业时间计算
            Date date1 = DateUtil.addDay2Date(-1, date);
            Date sevenDay = DateUtil.addDay2Date(-(day - 2), date1);
            Calendar cal = Calendar.getInstance();
            cal.setTime(sevenDay);
            String sevenDaysAgoTime = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            cal.setTime(date1);
            String nowDate = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            //6天总日志时长
            allAnyHour = (closeHour - openHour) * (day - 1);
            //6天有效日志数
            daysAnyHour = WiFiAnalyticsQuerService.getInstance(queryUrl).querySevenDaysData(sevenDaysAgoTime, openingTime, closingTime, mac, nowDate);
        } else if (hour > closeHour) {
            Date sevenDay = DateUtil.addDay2Date(-(day - 1), date);
            Calendar cal = Calendar.getInstance();
            cal.setTime(sevenDay);
            String sevenDaysAgoTime = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            cal.setTime(date);
            String nowDate = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());

            //7天总日志时长
            allAnyHour = (closeHour - openHour) * day;
            //TODO （从map中取数） 7天有效日志数（库里有多少条数据）
            daysAnyHour = WiFiAnalyticsQuerService.getInstance(queryUrl).querySevenDaysData(sevenDaysAgoTime, openingTime, closingTime, mac, nowDate);

        } else {
            // 是否健康度 按营业时间计算
            Date date1 = DateUtil.addDay2Date(-1, date);
            Date sevenDay = DateUtil.addDay2Date(-(day - 2), date1);
            Calendar cal = Calendar.getInstance();
            cal.setTime(sevenDay);
            String sevenDaysAgoTime = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            cal.setTime(date1);
            String date2 = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            cal.setTime(date);
            String nowDate = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            //6天总日志时长+当前营业时长
            allAnyHour = (closeHour - openHour) * (day - 1) + (hour - openHour);
            //6天有效日志数
            daysAnyHour = WiFiAnalyticsQuerService.getInstance(queryUrl).querySevenDaysData(sevenDaysAgoTime, openingTime, closingTime, mac, date2);
            //当天有效日志数
            int daysNow = WiFiAnalyticsQuerService.getInstance(queryUrl).querySevenDaysData(nowDate, openingTime, hourStr, mac, nowDate);
            daysAnyHour = daysAnyHour + daysNow;
        }

        totalNoDataHours = allAnyHour - daysAnyHour;
        log.info("营业开始时间：" + openingTime + " 营业结束时间：" + closingTime + " mac：" + mac + " 7天总日志时长：" + allAnyHour + " 7天有效日志数：" + daysAnyHour + " 当前时间：" + hourStr);
        return totalNoDataHours;
    }

    /**
     * 1天无日志时长
     *
     * @param sensor      探针
     * @param openingTime 营业开始时间
     * @param closingTime 营业结束时间
     * @param date        当前日期
     * @param hourStr     当前时间
     * @return
     */
    public static long noOneDataTimes(Sensor sensor, String openingTime, String closingTime, Date date, String hourStr) {
        long totalNoDataHours = 0;
        String mac = sensor.getSensorMac().replace(":", "");
        //最近有日志的日期
        //先查出最新有数据日期（不支持日期、小时同时倒序查询）
        int openHour = Integer.parseInt(openingTime);
        int closeHour = Integer.parseInt(closingTime);
        int hour = Integer.parseInt(hourStr);
        //7天有效日志数
        int daysAnyHour = 0;
        int allAnyHour = 0;
        if (hour < openHour) {
            // 是否健康度 按营业时间计算
            Date date1 = DateUtil.addDay2Date(-1, date);
            Calendar cal = Calendar.getInstance();
            cal.setTime(date1);
            String nowDate = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            //6天总日志时长
            allAnyHour = closeHour - openHour;
            //6天有效日志数
            daysAnyHour = WiFiAnalyticsQuerService.getInstance(queryUrl).querySevenDaysData(nowDate, openingTime, closingTime, mac, nowDate);
        } else if (hour > closeHour) {
            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            String nowDate = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());

            //7天总日志时长
            allAnyHour = closeHour - openHour;
            //7天有效日志数
            daysAnyHour = WiFiAnalyticsQuerService.getInstance(queryUrl).querySevenDaysData(nowDate, openingTime, closingTime, mac, nowDate);

        } else {
            // 是否健康度 按营业时间计算
            Date date1 = DateUtil.addDay2Date(-1, date);
            Calendar cal = Calendar.getInstance();
            cal.setTime(date1);
            String date2 = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            cal.setTime(date);
            String nowDate = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            //6天总日志时长+当前营业时长
            allAnyHour = closeHour - openHour;
            //6天有效日志数
            daysAnyHour = WiFiAnalyticsQuerService.getInstance(queryUrl).querySevenDaysData(date2, hourStr, closingTime, mac, date2);
            //当天有效日志数
            int daysNow = WiFiAnalyticsQuerService.getInstance(queryUrl).querySevenDaysData(nowDate, openingTime, hourStr, mac, nowDate);
            daysAnyHour = daysAnyHour + daysNow;
        }

        totalNoDataHours = allAnyHour - daysAnyHour;
        log.info("营业开始时间：" + openingTime + " 营业结束时间：" + closingTime + " mac：" + mac + " 1天总日志时长：" + allAnyHour + " 1天有效日志数：" + daysAnyHour + " 当前时间：" + hourStr);
        return totalNoDataHours;
    }

}
