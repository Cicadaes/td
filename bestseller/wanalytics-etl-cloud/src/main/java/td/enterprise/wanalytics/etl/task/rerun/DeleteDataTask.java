package td.enterprise.wanalytics.etl.task.rerun;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.task.BlacklistSync;
import td.enterprise.wanalytics.etl.util.QueryUtils;
import td.enterprise.wanalytics.etl.util.RedisClient;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 清理指定日期的数据
 */
public class DeleteDataTask {

    private static final Logger logger = Logger.getLogger(DeleteDataTask.class);

    private static Set<String> COUNTER_SET =  new HashSet<>();
    private static Set<String> BITMAP_SET =  new HashSet<>();

    static {
        COUNTER_SET.add("offline_active_user_sensor_hour_counter");
        COUNTER_SET.add("offline_new_user_sensor_day_counter");
        COUNTER_SET.add("offline_old_user_sensor_day_counter");
        COUNTER_SET.add("offline_sensor_effective_hour_counter");
        COUNTER_SET.add("offline_sensor_heart_hour_counter");
        COUNTER_SET.add("offline_sensor_effective_hour_counter");

        BITMAP_SET.add("active_user_day_cube");
        BITMAP_SET.add("active_user_hour_cube");
        BITMAP_SET.add("active_user_sensor_hour_cube");
        
        BITMAP_SET.add("front_user_cube");
        BITMAP_SET.add("front_user_hour_cube");
        
        BITMAP_SET.add("high_acive_user_cube");
        BITMAP_SET.add("medium_acive_user_cube");
        BITMAP_SET.add("low_acive_user_cube");
        
        BITMAP_SET.add("high_stay_user_cube");
        BITMAP_SET.add("medium_stay_user_cube");
        BITMAP_SET.add("low_stay_user_cube");

        BITMAP_SET.add("jump_user_day_cube");
        BITMAP_SET.add("offline_active_user_cube");
        BITMAP_SET.add("offline_new_user_cube");
        BITMAP_SET.add("offline_old_user_cube");
        BITMAP_SET.add("old_user_day_cube");
        BITMAP_SET.add("old_user_sensor_day_cube");
        
        BITMAP_SET.add("sleep_acive_user_cube");
        BITMAP_SET.add("sleep_stay_user_cube");
        
        BITMAP_SET.add("new_user_day_cube");
        BITMAP_SET.add("new_user_sensor_day_cube");
        BITMAP_SET.add("old_user_day_cube");
        BITMAP_SET.add("old_user_sensor_day_cube");
        BITMAP_SET.add("stay_new_user_day_cube");
        BITMAP_SET.add("stay_old_user_day_cube");
        BITMAP_SET.add("stay_user_day_cube");
        BITMAP_SET.add("stay_user_hour_cube");

    }

    public static void main(String[] args) {
        try{
            long t0 = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("date", "date", true, "指定日期");
            options.addOption("projectIds", "projectIds", true, "指定项目，用逗号分割，-1 表示全部");
            CommandLineParser parser = new PosixParser();
            CommandLine line  = parser.parse(options, args);
            String date = line.getOptionValue("date");
            String projectIds = line.getOptionValue("projectIds");
            logger.info("=======================date=" + date + "  projectIds=" + projectIds);
            execute(date,projectIds);
            long t1 = System.currentTimeMillis();
            logger.info("DeleteDataTask 结束，用时：" + (t1 - t0)/1000  + " 秒");

        }catch (Exception e){
            logger.error("",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    public static void execute(String date,String projectIds){
        deleteCounterDataByDate(date,projectIds);
        logger.info("=======================清理counter库成功=======");
        deleteBitmapDataByDate(date,projectIds);
        logger.info("=======================清理bitmap库成功=======");
        deleteWifiAnalyticsByDate(date,projectIds);
        logger.info("=======================清理Wifianalytics库成功=======");
        //deleteUserByDate(date,projectIds);
        //logger.info("=======================清理Wifianalytics_user库成功=======");

    }

    /**
     * 删除Counter表中每天数据
     * @param date
     * @param projectIds
     */
    public static void deleteCounterDataByDate(String date,String projectIds){
         for(String tableName : COUNTER_SET){
             deleteBySql(tableName,date,projectIds,QueryUtils.COUNTER_DB);
         }
    }

    /**
     * 删除Bitmap表中每天数据
     * @param date
     * @param projectIds
     */
    public static void deleteBitmapDataByDate(String date,String projectIds){
        for(String tableName : BITMAP_SET){
            deleteBySql(tableName,date,projectIds,QueryUtils.BITMPA_DB);
        }
    }

    /**
     * 删除wifianalytics库中按照日期产生数据，如黑名单
     * @param date
     * @param projectIds
     */
    public static void deleteWifiAnalyticsByDate(String date,String projectIds){
        String sql = "delete FROM  TD_CROWD_BLACK_LIST WHERE  source IN (4, 5, 6) and  DATE_FORMAT(create_time,'%Y-%m-%d') = '" + date + "' ";
        if(!"-1".equals(projectIds)){
            sql += " and project_id in (" + projectIds  + " ) ";
        }
        QueryUtils.execute(sql,QueryUtils.WIFIANALYTICS_DB);
        // TD_METRIC_FACT
        sql="update TD_METRIC_FACT set hour_users=0,end_hour_users=0 where date='" + date + "' ";
        if(!"-1".equals(projectIds)){
            sql += " and project_id in (" + projectIds  + " ) ";
        }
        QueryUtils.execute(sql,QueryUtils.WIFIANALYTICS_DB);
        
        // TD_METRIC_HOUR_REAL_TIME
        sql="update TD_METRIC_HOUR_REAL_TIME set active_hour_users=0,front_hour_users=0,stay_hour_users=0 where date='" + date + "' ";
        if(!"-1".equals(projectIds)){
            sql += " and project_id in (" + projectIds  + " ) ";
        }
        QueryUtils.execute(sql,QueryUtils.WIFIANALYTICS_DB);
        
        // TD_METRIC_DAY
        sql="update TD_METRIC_DAY set active_new_users=0,active_old_users=0,active_users=0,stay_new_users=0,stay_old_users=0,"//
                + "stay_users=0,front_users=0,jump_users=0," //
                + "high_active_users=0,middle_active_users=0,low_active_users=0,sleep_active_users=0," //
                + "high_stay_users=0,middle_stay_users=0,low_stay_users=0,sleep_stay_users=0," //
                + "active_duration=0,active_times=0,stay_duration=0,stay_times=0," //
                + "interval_2=0,interval_5=0,interval_10=0,interval_15=0," //
                + "visit_cycle=0,new_active_duration=0,new_active_time=0,old_active_duration=0,old_active_time=0 where date='" + date + "' ";
        if(!"-1".equals(projectIds)){
            sql += " and project_id in (" + projectIds  + " ) ";
        }
        QueryUtils.execute(sql,QueryUtils.WIFIANALYTICS_DB);
        
        // TD_METRIC_DAY_ACTIVE
        sql="update TD_METRIC_DAY_ACTIVE set active_new_users=0,active_old_users=0,active_users=0,stay_new_users=0,stay_old_users=0,"//
                + "stay_users=0,front_users=0,jump_users=0," //
                + "high_active_users=0,middle_active_users=0,low_active_users=0,sleep_active_users=0," //
                + "high_stay_users=0,middle_stay_users=0,low_stay_users=0,sleep_stay_users=0," //
                + "active_duration=0,active_times=0," //
                + "stay_duration=0,stay_times=0," //
                + "interval_2=0,interval_5=0,interval_10=0,interval_15=0,interval_30=0," //
                + "duration_new_5=0,duration_new_15=0,duration_new_30=0,duration_new_60=0," //
                + "duration_old_5=0,duration_old_15=0,duration_old_30=0,duration_old_60=0," //
                + "high_active_5=0,high_active_15=0,high_active_30=0,high_active_60=0," //
                + "middle_active_5=0,middle_active_15=0,middle_active_30=0,middle_active_60=0," //
                + "low_active_5=0,low_active_15=0,low_active_30=0,low_active_60=0," //
                + "sleep_active_5=0,sleep_active_15=0,sleep_active_30=0,sleep_active_60=0," //
                + "time_old_1=0,time_old_2=0,time_old_3=0,time_old_5=0," //
                + "old_interval=0,visit_cycle=0,new_active_duration=0,new_active_time=0,old_active_duration=0,old_active_time=0 where date='" + date + "' ";
        if(!"-1".equals(projectIds)){
            sql += " and project_id in (" + projectIds  + " ) ";
        }
        QueryUtils.execute(sql,QueryUtils.WIFIANALYTICS_DB);
       
        try{
            RedisClient.flushDB(Constant.DB_INDEX_BLACK_CROWD);
            BlacklistSync.initBacklistFromDB();
        }catch(Exception e){
            e.printStackTrace();
        }

    }

    /**
     * 删除wifianalytics_user库中当天新增用户
     * @param date
     * @param projectIds
     */
    public static void deleteUserByDate(String date,String projectIds){
       String sql = "select TABLE_NAME from information_schema.`TABLES` t0 where t0.TABLE_SCHEMA='wifianalytics_user' and TABLE_NAME like 'project_%'";
       List<Map<String,Object>> projectUserTableList = QueryUtils.query(sql,QueryUtils.USER_DB);
       for(Map<String,Object> map : projectUserTableList){
           Set<String> projectIdSet = new HashSet<> ();
           if(StringUtils.isNotBlank(projectIds)){
               String [] projectIdsArry = projectIds.split(",");
               for(String tmp : projectIdsArry){
                   projectIdSet.add(tmp);
               }
           }
           String tableName = map.get("TABLE_NAME").toString();
           if(StringUtils.isNotBlank(tableName)){
               String projectId = tableName.split("_")[2];//获取项目ID
               if(projectIdSet.contains(projectId) == false){
                    sql = "delete from " + tableName  + " where DATE_FORMAT(time,'%Y-%m-%d') = '" + date + "'";
                    QueryUtils.execute(sql,QueryUtils.USER_DB);
               }
           }
       }

    }


    /**
     * 删除指定数据
     * @param tableName
     * @param date
     * @param projectIds
     * @param dbType
     */
    private static void deleteBySql(String tableName,String date,String projectIds,int dbType){
          String sql = "delete from " + tableName + " where date='" + date + "'";
          if(!"-1".equals(projectIds) && StringUtils.isNotBlank(projectIds)){
              sql = sql  + " and project_id in (" + projectIds + " )";
          }
        QueryUtils.execute(sql,dbType);
    }

    private static void deleteByMonthSql(String tableName,String month,String projectIds,int dbType){
        String sql = "delete from " + tableName + " where month='" + month + "'";
        if(!"-1".equals(projectIds) && StringUtils.isNotBlank(projectIds)){
            sql = sql  + " and project_id in (" + projectIds + " )";
        }
        QueryUtils.execute(sql,dbType);
    }
}
