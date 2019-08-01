package td.enterprise.wanalytics.etl.task;


import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.springframework.util.CollectionUtils;
import td.enterprise.dao.SensorDao;
import td.enterprise.dao.SensorInfoDao;
import td.enterprise.wanalytics.etl.bean.Sensor;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;
import td.olap.query.WiFiAnalyticsQuerService;

import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 根据人群和画像 计算出具体值
 */
@Slf4j
public class SensorIndexOldTask {

    private static String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url");

    private static final String DEFAULT_OPEN_TIME = "07";
    private static final String DEFAULT_CLOSE_TIME = "19";
    private static final int HOURS = 3;
    private static final long HOUR_MS = 60 * 60 * 1000;//一小时的毫秒
    private static final int DAYS = 7;//7天数据


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
            log.info("tenantId is " + tenantId);
            log.info("date is " + date);
            log.info("hour is " + hour);

            // tenantId = "2";
            // date = "2017-06-21";
            // hour = "15";

            long begin = System.currentTimeMillis();
            execute(tenantId, date, hour);
            long end = System.currentTimeMillis();
            log.info("SensorIndexOldTask Used times :" + (end - begin) / 1000 + " seconds");

        } catch (Exception e) {
            log.error("SensorIndexOldTask： ", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_CONTINUE);
        }
        System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
    }

    public static void execute(String tenantId, String dateStr, String hourStr) throws SQLException {

        log.info("Enter queryData, param: date=" + dateStr + ", tenantId=" + tenantId + " , hour=" + hourStr);


        SqlSession sqlSession = MyBatisUtil.getSqlSessionFactory().openSession(true);
        SensorInfoDao dao = sqlSession.getMapper(SensorInfoDao.class);
        List<Sensor> sensors = null;
        if (!Objects.equals(tenantId, "-1")) {
            sensors = dao.selectAllSensorByTenantId(tenantId);
        } else {
            sensors = dao.selectAllSensor();
        }

        log.info("sensor总数：" + sensors.size() + ", 第一个sensor是：" + JSON.toJSONString(sensors.get(0)));

        int count = 0;    //计数器
        List<Map> mapList = new ArrayList<>();

        for (Sensor s : sensors) {

            Integer normal = 0; // 0异常，1正常 , 2停用
            Double noLogDuration = 0.0; //无日志时长
            String openingTime = s.getOpeningTime();
            String closingTime = s.getClosingTime();
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

            Calendar ca = Calendar.getInstance();
            ca.setTime(date);
            ca.add(Calendar.HOUR_OF_DAY, openHour);
            long openTime = ca.getTime().getTime();
            ca.setTime(date);
            ca.add(Calendar.HOUR_OF_DAY, closeHour);
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

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            //三小时
            StringBuffer nowStrs = new StringBuffer();
            for (int i = 0; i < hourList.size(); i++) {
                String formatStr = sdf.format(hourList.get(i));
                String formatDate = formatStr.substring(0, 10);
                Integer formatHour = Integer.parseInt(formatStr.substring(11, 13));
                if (i == 0) {
                    nowStrs.append(" ( ");
                }
                nowStrs.append(" ( date = '" + formatDate + "'");
                nowStrs.append(" and hour = '" + formatHour + "' ) ");
                if (i == hourList.size() - 1) {
                    nowStrs.append(" )");
                } else {
                    nowStrs.append(" or ");
                }
            }

            //TODO 指标1：近无7日 无日志时长
            if (openHour < closeHour) {

                noLogDuration = (double) anyNoDataTimes(s, openingHour, closingHour, date, hourStr, DAYS);
            } else {
                log.error("错误数据  探针id= " + s.getId() + " 项目id=" + s.getProjectId() + " 营业开始时间：" + openHour + " 营业结束时间：" + closeHour + " 计算开始时间：" + openTime + " 计算结束时间：" + closeTime);
            }

            //TODO 指标2：判断sensor状态
            normal = (int) noOneDataTimes(s, openingHour, closingHour, date, hourStr);
            //判断 探针是否停用
            //24小时有数据
            if (normal == 0) {
                normal = 1;// 正常
            } else if ((closeHour - openHour) == normal) {
                normal = 2;// 停用
            } else {
                normal = 0;// 异常
            }

            //TODO 指标3：3小时日志数
            //3小时日志数
            Long logHours = WiFiAnalyticsQuerService.getInstance(queryUrl).queryAllLogByHour(s.getSensorMac().replace(":", ""), nowStrs.toString(), true);

            //使用连接池操作数据库

            Map<String, Object> map = new ConcurrentHashMap<>();
            map.put("normal", normal.toString());
            map.put("noLogDuration", noLogDuration.toString());
            map.put("logHours", logHours.toString());
            map.put("id", s.getId());
            //sensorDao.updateSensor(map);

            mapList.add(map);
            count = count + 1;

            log.info("count 大小：" + count);
            if (count % 500 == 0) {
                batchUpdate(mapList, dao);
            }

        }

        //处理最后list中的sensor
        batchUpdate(mapList, dao);

        sqlSession.close();

    }

    public static void batchUpdate(List<Map> mapList, SensorInfoDao dao) {
        if (!CollectionUtils.isEmpty(mapList)) {
            log.info("入库之前list大小：" + mapList.size());

            dao.batchUpdate(mapList);

            log.info(JSON.toJSONString(mapList));

            mapList.clear();

            log.info("检查list是否清空,list的大小：" + mapList.size());
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

    public static Integer noDataSensor(Sensor sensors, String date, String hour, String dateStr, String hourStr) {
        String sb = "";
        sb = sensors.getSensorMac().replace(":", "");

        Map<String, Integer> map = WiFiAnalyticsQuerService.getInstance(queryUrl).queryNoDataForHourSensor(sb, date, hour, dateStr, hourStr);
        int noDataMac = 0;
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            if (entry.getValue() == 0) {
                noDataMac += 0;
            } else {
                noDataMac++;
            }
        }

        return noDataMac;
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
