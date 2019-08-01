package td.enterprise.wanalytics.processor.utils;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import org.apache.storm.shade.org.joda.time.LocalDate;
import org.apache.storm.shade.org.joda.time.LocalDateTime;
import org.apache.storm.shade.org.joda.time.format.DateTimeFormatter;
import org.apache.storm.shade.org.joda.time.format.DateTimeFormatterBuilder;
import org.apache.storm.tuple.Values;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import td.enterprise.dmp.common.util.DateUtil;
import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.wanalytics.processor.bean.Project;
import td.enterprise.wanalytics.processor.cache.CacheFactory;

public class BitmapCubeDataUtils_V2 {

    public static final Logger  logger                       = LoggerFactory.getLogger(BitmapCubeDataUtils_V2.class);

    private static final String ACTIVE_USER_SENSOR_HOUR_CUBE = "active_user_sensor_hour_cube";
    private static final String OLD_USER_SENSOR_DAY_CUBE     = "old_user_sensor_day_cube";
    private static final String OLD_USER_DAY_CUBE            = "old_user_day_cube";
    private static final String NEW_USER_SENSOR_DAY_CUBE     = "new_user_sensor_day_cube";
    private static final String NEW_USER_DAY_CUBE            = "new_user_day_cube";
    private static final String ACTIVE_USER_HOUR_CUBE        = "active_user_hour_cube";
    private static final String ACTIVE_USER_DAY_CUBE         = "active_user_day_cube";
    //项目停留
    private static final String STAY_USER_DAY_CUBE           = "stay_user_day_cube";

    //停留老客
    private static final String STAY_OLD_USER_CUBE           = "stay_old_user_day_cube";

    //停留新客
    private static final String STAY_NEW_USER_CUBE           = "stay_new_user_day_cube";

    //停留小时客流
    private static final String STAY_USER_HOUR_CUBE          = "stay_user_hour_cube";

    //店外小时客流
    private static final String FRONT_USER_HOUR_CUBE         = "front_user_hour_cube";

    //店外客流
    private static final String FRONT_USER_CUBE              = "front_user_cube";

    //高活跃入店客流
    private static final String HIGH_ACIVE_USER_CUBE         = "high_acive_user_cube";
    //高活跃停留客流
    private static final String HIGH_STAY_USER_CUBE          = "high_stay_user_cube";
    //低活跃入店客流
    private static final String LOW_ACIVE_USER_CUBE          = "low_acive_user_cube";
    //低活跃停留客流
    private static final String LOW_STAY_USER_CUBE           = "low_stay_user_cube";
    //中活跃入店客流
    private static final String MEDIUM_ACIVE_USER_CUBE       = "medium_acive_user_cube";
    //中活跃停留客流
    private static final String MEDIUM_STAY_USER_CUBE        = "medium_stay_user_cube";
    //沉睡入店客流
    private static final String SLEEP_ACIVE_USER_CUBE        = "sleep_acive_user_cube";
    //沉睡停留客流
    private static final String SLEEP_STAY_USER_CUBE         = "sleep_stay_user_cube";

    private static Cache        pmdCache                     = CacheFactory.getProjectMacDateCache();
    private static final String PROJECT_MAC_DATE_PREFIX      = "projectmacdate_";
    private static final String PROJECT_MAC_DATE_PATTERN     = "yyyyMMdd";

    private static final String ACTIVE_HIGH                  = "ah";

    private static final String ACTIVE_MEDIUM                = "am";

    private static final String ACTIVE_LOW                   = "al";

    private static final String ACTIVE_SLEEP                 = "as";

    private static final String STAY_HIGH                    = "sh";

    private static final String STAY_MEDIUM                  = "sm";

    private static final String STAY_LOW                     = "sl";

    private static final String STAY_SLEEP                   = "ss";

    public static Map<String, KafkaCubeData> createBitmapCubeData(Line line) {
        Map<String, KafkaCubeData> returnMap = new HashMap<String, KafkaCubeData>();
        KafkaCubeData cubeData = createActiveUserDayCube(line);
        if (cubeData != null) {
            cubeData.setCubeName(ACTIVE_USER_DAY_CUBE);
            returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }
        cubeData = createActiveUserHourCube(line);
        if (cubeData != null) {
            cubeData.setCubeName(ACTIVE_USER_HOUR_CUBE);
            returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }
        cubeData = createNewUserDayCube(line);
        if (cubeData != null) {
            cubeData.setCubeName(NEW_USER_DAY_CUBE);
            returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }
        cubeData = createNewUserSensorDayCube(line);
        if (cubeData != null) {
            cubeData.setCubeName(NEW_USER_SENSOR_DAY_CUBE);
            returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }
        cubeData = createOldUserDayCube(line);
        if (cubeData != null) {
            cubeData.setCubeName(OLD_USER_DAY_CUBE);
            returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }
        cubeData = createOldUserSensorDayCube(line);
        if (cubeData != null) {
            cubeData.setCubeName(OLD_USER_SENSOR_DAY_CUBE);
            returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }

        cubeData = createActiveUserSensorHourCube(line);
        if (cubeData != null) {
            cubeData.setCubeName(ACTIVE_USER_SENSOR_HOUR_CUBE);
            returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }

        //项目停留
        cubeData = createStayUserDayCube(line);
        if (cubeData != null) {
            cubeData.setCubeName(STAY_USER_DAY_CUBE);
            returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }

        //停留老客
        cubeData = createStayOldUserDayCube(line);
        if (cubeData != null) {
            cubeData.setCubeName(STAY_OLD_USER_CUBE);
            returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }

        //停留新客
        cubeData = createStayNewUserDayCube(line);
        if (cubeData != null) {
            cubeData.setCubeName(STAY_NEW_USER_CUBE);
            returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }

        //停留小时客流
        cubeData = createStayUserHourCube(line);
        if (cubeData != null) {
            cubeData.setCubeName(STAY_USER_HOUR_CUBE);
            returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }

        /*//店前客流
        cubeData = createFrontUserHourCube(line);
        if (cubeData != null) {
        	cubeData.setCubeName(FRONT_USER_HOUR_CUBE);
        	returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }
        
        //店前客流
        cubeData = createFrontUserCube(line);
        if (cubeData != null) {
        	cubeData.setCubeName(FRONT_USER_CUBE);
        	returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }*/

        // 从缓存获取项目信息
        String projectid = String.valueOf(line.get(LineKeyConstants.projectid));
        Cache cache = CacheFactory.getProjectCache();
        Element e = cache.get(Long.valueOf(projectid + ""));
        Project project = (Project) e.getObjectValue();
        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        String mac = (String) line.get(LineKeyConstants.mac);
        long tsreceive = Long.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        //获取mac最大时间间隔
        int days = getDays(projectid, tenantid, mac, tsreceive);

        if (days != 0) {
            //高活跃入店客流
            cubeData = createHighActiveUserCube(line, project, days);
            if (cubeData != null) {
                cubeData.setCubeName(HIGH_ACIVE_USER_CUBE);
                returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
            }
            //高活跃停留客流
            cubeData = createHighStayUserCube(line, project, days);
            if (cubeData != null) {
                cubeData.setCubeName(HIGH_STAY_USER_CUBE);
                returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
            }
            //中活跃入店客流
            cubeData = createMediumActiveUserCube(line, project, days);
            if (cubeData != null) {
                cubeData.setCubeName(MEDIUM_ACIVE_USER_CUBE);
                returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
            }
            //中活跃停留客流
            cubeData = createMediumStayUserCube(line, project, days);
            if (cubeData != null) {
                cubeData.setCubeName(MEDIUM_STAY_USER_CUBE);
                returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
            }
            //低活跃入店客流
            cubeData = createLowActiveUserCube(line, project, days);
            if (cubeData != null) {
                cubeData.setCubeName(LOW_ACIVE_USER_CUBE);
                returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
            }
            //低活跃停留客流
            cubeData = createLowStayUserCube(line, project, days);
            if (cubeData != null) {
                cubeData.setCubeName(LOW_STAY_USER_CUBE);
                returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
            }
            //沉睡入店客流
            cubeData = createSleepActiveUserCube(line, project, days);
            if (cubeData != null) {
                cubeData.setCubeName(SLEEP_ACIVE_USER_CUBE);
                returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
            }
            //沉睡停留客流
            cubeData = createSleepStayUserCube(line, project, days);
            if (cubeData != null) {
                cubeData.setCubeName(SLEEP_STAY_USER_CUBE);
                returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
            }
        }

        return returnMap;
    }

    /**
     * 店前客流
     * @param line
     * @return
     */
    public static Map<String, KafkaCubeData> createFrontBitmapCubeData(Line line) {
        Map<String, KafkaCubeData> returnMap = new HashMap<String, KafkaCubeData>();
        //店前客流
        KafkaCubeData cubeData = createFrontUserCube(line);
        if (cubeData != null) {
            cubeData.setCubeName(FRONT_USER_CUBE);
            returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }
        //店前小时客流
        cubeData = createFrontUserHourCube(line);
        if (cubeData != null) {
            cubeData.setCubeName(FRONT_USER_HOUR_CUBE);
            returnMap.put(cubeData.getCubeName() + "_" + cubeData.getDimension(), cubeData);
        }
        return returnMap;
    }

    /**
     * 当日活跃用户
     * 当日有效用户，进行时间限制
     * @param line
     * @return
     */
    private static KafkaCubeData createActiveUserDayCube(Line line) {
        long offset = (long) line.get(LineKeyConstants.tenantoffset);

        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 当日小时活跃用户
     * 
     * @param line
     * @return
     */
    private static KafkaCubeData createActiveUserHourCube(Line line) {

        long offset = (long) line.get(LineKeyConstants.tenantoffset);

        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = (String) String.valueOf(line.get(LineKeyConstants.tsreceive));

        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        int hour = DateTimeUtil.getHours(calendar.getTime());
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date + "_" + hour, new Values(tenantid, projectid, date, hour, offset));
    }

    /**
     * 当日新增用户
     * 
     * @param line
     * @return
     */
    private static KafkaCubeData createNewUserDayCube(Line line) {

        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (!newUser) { // TODO 不是新用户
            return null;
        }
        long offset = (long) line.get(LineKeyConstants.tenantoffset);
        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = (String) String.valueOf(line.get(LineKeyConstants.tsreceive));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 当日探针新增用户
     * 
     * @param line
     * @return
     */
    private static KafkaCubeData createNewUserSensorDayCube(Line line) {

        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (!newUser) { // TODO 不是新用户
            return null;
        }
        long offset = (long) line.get(LineKeyConstants.tenantoffset);

        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        int placeid = line.get(LineKeyConstants.projectplaceid) == null ? -1 : line.getIntValue(LineKeyConstants.projectplaceid);
        int sensorid = ((Long) line.get(LineKeyConstants.sensorid)).intValue();
        String tsreceive = (String) String.valueOf(line.get(LineKeyConstants.tsreceive));

        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + placeid + "_" + sensorid + "_" + date, new Values(tenantid, projectid, placeid,
                sensorid, date, offset));
    }

    /**
     * 当日老客
     * 
     * @param line
     * @return
     */
    private static KafkaCubeData createOldUserDayCube(Line line) {
        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (newUser) { // TODO 不是老用户
            return null;
        }
        long offset = (long) line.get(LineKeyConstants.tenantoffset);
        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = (String) String.valueOf(line.get(LineKeyConstants.tsreceive));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 当日探针老客
     * 
     * @param line
     * @return
     */
    private static KafkaCubeData createActiveUserSensorHourCube(Line line) {
        long offset = (long) line.get(LineKeyConstants.tenantoffset);
        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        int placeid = line.get(LineKeyConstants.projectplaceid) == null ? -1 : line.getIntValue(LineKeyConstants.projectplaceid);
        int sensorid = ((Long) line.get(LineKeyConstants.sensorid)).intValue();
        String tsreceive = (String) String.valueOf(line.get(LineKeyConstants.tsreceive));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        String hour = calendar.get(Calendar.HOUR_OF_DAY) + "";
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + placeid + "_" + sensorid + "_" + date, new Values(tenantid, projectid, placeid,
                sensorid, date, hour, offset));
    }

    /**
     * 当日探针老客
     * 
     * @param line
     * @return
     */
    private static KafkaCubeData createOldUserSensorDayCube(Line line) {

        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (newUser) { // TODO 不是老用户
            return null;
        }
        long offset = (long) line.get(LineKeyConstants.tenantoffset);

        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        int placeid = line.get(LineKeyConstants.projectplaceid) == null ? -1 : line.getIntValue(LineKeyConstants.projectplaceid);
        int sensorid = ((Long) line.get(LineKeyConstants.sensorid)).intValue();
        String tsreceive = (String) String.valueOf(line.get(LineKeyConstants.tsreceive));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + placeid + "_" + sensorid + "_" + date, new Values(tenantid, projectid, placeid,
                sensorid, date, offset));
    }

    /**
     * 停留时长限制
     * 当日有效用户，进行时间限制
     * @param line
     * @return
     */
    private static KafkaCubeData createStayUserDayCube(Line line) {
        Integer stayMinutes = line.getIntValue(LineKeyConstants.stayMinutes);
        Integer projectDuration = line.getIntValue(LineKeyConstants.sessionDuration);
        boolean isStayUser = (null != stayMinutes && projectDuration != null && projectDuration >= stayMinutes);
        if (!isStayUser) {
            return null;
        }
        long offset = (long) line.get(LineKeyConstants.tenantoffset);

        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 
     * 停留新客
     * @param line
     * @return
     */
    private static KafkaCubeData createStayNewUserDayCube(Line line) {
        //有效客流进行时间限制
        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (!newUser) {
            return null;
        }

        //有效客流进行时间限制
        Integer stayMinutes = line.getIntValue(LineKeyConstants.stayMinutes);
        Integer projectDuration = line.getIntValue(LineKeyConstants.sessionDuration);
        boolean isStayUser = (null != stayMinutes && projectDuration != null && projectDuration >= stayMinutes);
        if (!isStayUser) {
            return null;
        }
        long offset = (long) line.get(LineKeyConstants.tenantoffset);

        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 
     * 停留老客
     * @param line
     * @return
     */
    private static KafkaCubeData createStayOldUserDayCube(Line line) {
        //有效客流进行时间限制
        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (newUser) {
            return null;
        }

        Integer stayMinutes = line.getIntValue(LineKeyConstants.stayMinutes);
        Integer projectDuration = line.getIntValue(LineKeyConstants.sessionDuration);
        boolean isStayUser = (null != stayMinutes && projectDuration != null && projectDuration >= stayMinutes);
        if (!isStayUser) {
            return null;
        }
        long offset = (long) line.get(LineKeyConstants.tenantoffset);

        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     *
     * 停留小时客流
     * @param line
     * @return
     */
    private static KafkaCubeData createStayUserHourCube(Line line) {
        //停留小时客流限制
        Integer stayMinutes = line.getIntValue(LineKeyConstants.stayMinutes);
        Integer projectDuration = line.getIntValue(LineKeyConstants.sessionDuration);
        boolean isStayUser = (null != stayMinutes && projectDuration != null && projectDuration >= stayMinutes);
        if (!isStayUser) {
            return null;
        }
        long offset = (long) line.get(LineKeyConstants.tenantoffset);

        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        int hour = DateTimeUtil.getHours(calendar.getTime());
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date + "_" + hour, new Values(tenantid, projectid, date, hour, offset));
    }

    /**
     *
     * 店前小时客流
     * @param line
     * @return
     */
    private static KafkaCubeData createFrontUserHourCube(Line line) {
        boolean isFrontUser = line.getBoolValue(LineKeyConstants.isFrontUser);
        if (!isFrontUser) {
            return null;
        }
        long offset = (long) line.get(LineKeyConstants.frontoffset);

        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        int hour = DateTimeUtil.getHours(calendar.getTime());
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date + "_" + hour, new Values(tenantid, projectid, date, hour, offset));
    }

    /**
     *
     * 店前客流 
     * @param line
     * @return
     */
    private static KafkaCubeData createFrontUserCube(Line line) {
        boolean isFrontUser = line.getBoolValue(LineKeyConstants.isFrontUser);
        if (!isFrontUser) {
            return null;
        }
        long offset = (long) line.get(LineKeyConstants.frontoffset);
        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 高活跃入店客流  HIGH_ACIVE_USER_CUBE
     * @param line
     * @return
     */
    private static KafkaCubeData createHighActiveUserCube(Line line, Project project, int days) {

        //有效客流进行时间限制
        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (newUser) {
            return null;
        }

        Integer activeHighBegin = project.getActiveHighBegin();
        Integer activeHighEnd = project.getActiveHighEnd();

        if (days > activeHighEnd || days < activeHighBegin) {
            return null;
        }

        long offset = (long) line.get(LineKeyConstants.tenantoffset);
        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        putActiveLine(line, ACTIVE_HIGH, days);
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 
     * 高活跃停留客流  HIGH_STAY_USER_CUBE
     * @param line
     * @return
     */
    private static KafkaCubeData createHighStayUserCube(Line line, Project project, int days) {
        //有效客流进行时间限制
        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (newUser) {
            return null;
        }

        //有效客流进行时间限制
        Integer stayMinutes = line.getIntValue(LineKeyConstants.stayMinutes);
        Integer projectDuration = line.getIntValue(LineKeyConstants.sessionDuration);
        boolean isStayUser = (null != stayMinutes && projectDuration != null && projectDuration >= stayMinutes);
        if (!isStayUser) {
            return null;
        }

        Integer activeHighBegin = project.getActiveHighBegin();
        Integer activeHighEnd = project.getActiveHighEnd();

        if (days > activeHighEnd || days < activeHighBegin) {
            return null;
        }

        long offset = (long) line.get(LineKeyConstants.tenantoffset);

        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        putStayLine(line, STAY_HIGH, days);
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 中活跃入店客流  MEDIUM_ACIVE_USER_CUBE
     * @param line
     * @return
     */
    private static KafkaCubeData createMediumActiveUserCube(Line line, Project project, int days) {

        //有效客流进行时间限制
        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (newUser) {
            return null;
        }

        Integer activeMediumBegin = project.getActiveMediumBegin();
        Integer activeMediumEnd = project.getActiveMediumEnd();

        if (days > activeMediumEnd || days < activeMediumBegin) {
            return null;
        }

        long offset = (long) line.get(LineKeyConstants.tenantoffset);
        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        putActiveLine(line, ACTIVE_MEDIUM, days);
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 
     * 中活跃停留客流  MEDIUM_STAY_USER_CUBE
     * @param line
     * @return
     */
    private static KafkaCubeData createMediumStayUserCube(Line line, Project project, int days) {
        //有效客流进行时间限制
        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (newUser) {
            return null;
        }

        //有效客流进行时间限制
        Integer stayMinutes = line.getIntValue(LineKeyConstants.stayMinutes);
        Integer projectDuration = line.getIntValue(LineKeyConstants.sessionDuration);
        boolean isStayUser = (null != stayMinutes && projectDuration != null && projectDuration >= stayMinutes);
        if (!isStayUser) {
            return null;
        }

        Integer activeMediumBegin = project.getActiveMediumBegin();
        Integer activeMediumEnd = project.getActiveMediumEnd();

        if (days > activeMediumEnd || days < activeMediumBegin) {
            return null;
        }

        long offset = (long) line.get(LineKeyConstants.tenantoffset);

        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        putStayLine(line, STAY_MEDIUM, days);
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 低活跃入店客流  LOW_ACIVE_USER_CUBE
     * @param line
     * @return
     */
    private static KafkaCubeData createLowActiveUserCube(Line line, Project project, int days) {

        //有效客流进行时间限制
        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (newUser) {
            return null;
        }

        Integer activeLowBegin = project.getActiveLowBegin();
        Integer activeLowEnd = project.getActiveLowEnd();

        if (days > activeLowEnd || days < activeLowBegin) {
            return null;
        }

        long offset = (long) line.get(LineKeyConstants.tenantoffset);
        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        putActiveLine(line, ACTIVE_LOW, days);
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 
     * 低活跃停留客流  LOW_STAY_USER_CUBE
     * @param line
     * @return
     */
    private static KafkaCubeData createLowStayUserCube(Line line, Project project, int days) {
        //有效客流进行时间限制
        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (newUser) {
            return null;
        }

        //有效客流进行时间限制
        Integer stayMinutes = line.getIntValue(LineKeyConstants.stayMinutes);
        Integer projectDuration = line.getIntValue(LineKeyConstants.sessionDuration);
        boolean isStayUser = (null != stayMinutes && projectDuration != null && projectDuration >= stayMinutes);
        if (!isStayUser) {
            return null;
        }

        Integer activeLowBegin = project.getActiveLowBegin();
        Integer activeLowEnd = project.getActiveLowEnd();

        if (days > activeLowEnd || days < activeLowBegin) {
            return null;
        }

        long offset = (long) line.get(LineKeyConstants.tenantoffset);

        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        putStayLine(line, STAY_LOW, days);
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 沉睡入店客流  SLEEP_ACIVE_USER_CUBE
     * @param line
     * @return
     */
    private static KafkaCubeData createSleepActiveUserCube(Line line, Project project, int days) {

        //有效客流进行时间限制
        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (newUser) {
            return null;
        }

        Integer activeSleep = project.getActiveSleep();

        if (days < activeSleep) {
            return null;
        }

        long offset = (long) line.get(LineKeyConstants.tenantoffset);
        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        putActiveLine(line, ACTIVE_SLEEP, days);
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 
     * 沉睡停留客流  SLEEP_STAY_USER_CUBE
     * @param line
     * @return
     */
    private static KafkaCubeData createSleepStayUserCube(Line line, Project project, int days) {
        //有效客流进行时间限制
        boolean newUser = (boolean) line.get(LineKeyConstants.projectnewflag);
        if (newUser) {
            return null;
        }

        //有效客流进行时间限制
        Integer stayMinutes = line.getIntValue(LineKeyConstants.stayMinutes);
        Integer projectDuration = line.getIntValue(LineKeyConstants.sessionDuration);
        boolean isStayUser = (null != stayMinutes && projectDuration != null && projectDuration >= stayMinutes);
        if (!isStayUser) {
            return null;
        }

        Integer activeSleep = project.getActiveSleep();

        if (days < activeSleep) {
            return null;
        }

        long offset = (long) line.get(LineKeyConstants.tenantoffset);

        String tenantid = (String) line.get(LineKeyConstants.tenantid);
        int projectid = ((Long) line.get(LineKeyConstants.projectid)).intValue();
        String tsreceive = String.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
        Calendar calendar = DateTimeUtil.toCalendar(tsreceive);
        String date = DateTimeUtil.formatDate(calendar.getTime());
        putStayLine(line, STAY_SLEEP, days);
        return new KafkaCubeData(tenantid + "_" + projectid + "_" + date, new Values(tenantid, projectid, date, offset));
    }

    /**
     * 获取当前mac最后入店时间间隔 
     * @param projectid
     * @param tenantid
     * @param mac
     * @param tsreceive
     * @return
     */
    private static int getDays(String projectid, String tenantid, String mac, long tsreceive) {
        int days = 0;
        String dateLongStr = null;
        LocalDate now = new LocalDate(tsreceive);
        String dateStr = now.minusDays(1).toString(PROJECT_MAC_DATE_PATTERN);

        String redisKey = PROJECT_MAC_DATE_PREFIX + projectid + "_" + tenantid + "_" + dateStr;

        String ehKey = redisKey + mac;
        Element pmdElement = pmdCache.get(ehKey);

        if (null != pmdElement) {
            dateLongStr = (String) pmdElement.getValue();
        } else {
            dateLongStr = RedisClient.hget(redisKey, mac, RedisClient.DB_INDEX_ACTIVE_USER_CROWD);
            if (null != dateLongStr) {
                Element e = new Element(ehKey, dateLongStr);
                pmdCache.put(e);
            }
        }
        if (!StringUtils.isEmpty(dateLongStr)) {
            Date maxDate = DateUtil.format(dateLongStr, PROJECT_MAC_DATE_PATTERN);
            // 计算和当前时间相差天
            days = DateUtil.getDiffDays(maxDate, new Date(tsreceive));
        }
        return days;
    }

    /**
    * <p>Description: 将活跃客流标记放入line</p>
    * @param line
    * @param value
     */
    private static void putActiveLine(Line line, String sign, int days) {
        line.put(LineKeyConstants.activeSign, sign);
        line.put(LineKeyConstants.visitInterval, days);
    }

    /**
    * <p>Description: 将停留客流标记放入line</p>
    * @param line
    * @param value
     */
    private static void putStayLine(Line line, String sign, int days) {
        line.put(LineKeyConstants.staySign, sign);
        line.put(LineKeyConstants.visitInterval, days);
    }

}
