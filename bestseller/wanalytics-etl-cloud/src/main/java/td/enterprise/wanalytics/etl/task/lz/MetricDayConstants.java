package td.enterprise.wanalytics.etl.task.lz;

public class MetricDayConstants {

    /**
     * 进店新客
     */
    public static String script2New     = "r030102 = select * from bitmap.new_user_day_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";
    //查询进店老客
    public static String script2Old     = "r030102 = select * from bitmap.old_user_day_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";
    //查询停留老客
    public static String script2NStay   = "r030102 = select * from bitmap.stay_new_user_day_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";
    //查询停留老客
    public static String script2OStay   = "r030102 = select * from bitmap.stay_old_user_day_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";
    //查询周边客流
    public static String script2Front   = "r030102 = select * from bitmap.front_user_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";
    //查询跳出人數
    public static String script2Jump    = "r030102 = select * from bitmap.jump_user_day_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";
    //查询高度活跃
    public static String script2HActive = "r030102 = select * from bitmap.high_acive_user_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";
    //查询中度活跃
    public static String script2MActive = "r030102 = select * from bitmap.medium_acive_user_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";
    //查询低活跃
    public static String script2LActive = "r030102 = select * from bitmap.low_acive_user_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";
    //查询沉睡活跃人数
    public static String script2SActive = "r030102 = select * from bitmap.sleep_acive_user_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";

    //查询高度活跃停留人数
    public static String script2HStay   = "r030102 = select * from bitmap.high_stay_user_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";
    //查询中度活跃停留人数
    public static String script2MStay   = "r030102 = select * from bitmap.medium_stay_user_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";
    //查询低活跃停留人数
    public static String script2LStay   = "r030102 = select * from bitmap.low_stay_user_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";
    //查询沉睡停留人数
    public static String script2SStay   = "r030102 = select * from bitmap.sleep_stay_user_cube where date=%s" // 
                                                + " group by project_id; r030102.subkey(0);";

}
