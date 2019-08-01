package td.enterprise.wanalytics.etl.task.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;

import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.jdbc.DbBitmapConn;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;


/**
 * 自动创建分区
 * mysql 分区表支持最大分区个数是：8192
 * 自动创建指定年份分区
 * @author junmin.li
 *
 */
public class AutoPartitionTask {
	
	public static Logger logger = Logger.getLogger(AutoPartitionTask.class);
	
	private static final int MAX_PARTITIONS= 8192;
	
	private int defaultYear = 1 ; //默认往前添加每年的分区，1代表往前自动添加1年所有表的分区，2代表往前自动添加2年所有分区
	
	private static final String querySql = "select " + 
     " partition_name part,   partition_expression expr,   partition_description descr,    table_rows  " + 
     " from information_schema.partitions  where   table_schema = '_table_schema_'    and table_name='_table_name_'";
	
	 private static Connection conn2Wifianalytics;
	 private static Connection conn2WifianalyticsBitmap;
	 static {
		 try{
			 conn2Wifianalytics = DbWifianalyticsConn.getConnection();
			 conn2WifianalyticsBitmap = DbBitmapConn.getConnection();
		 }catch(Exception e){
			 logger.error("初始化连接失败：", e);
		 }
		 
	 }
	
	//wifianalytics 所有按天分区表
	private static final  String [] WIFIANALYTICS_TABLES  = {"TD_METRIC_FACT"};
	
	//wifianalytics_bitmap 所有按天分区表
	private static final  String [] WIFIANALYTICS_BITMAP_TABLES  = {
		"active_user_day_cube",
		"active_user_hour_cube",
		"active_user_sensor_hour_cube",
		"front_user_cube",
		"front_user_hour_cube",
		"high_acive_user_cube",
		"high_stay_user_cube",
		"jump_user_day_cube",
		"low_acive_user_cube",
		"low_stay_user_cube",
		"medium_acive_user_cube",
		"medium_stay_user_cube",
		"new_user_day_cube",
		"new_user_sensor_day_cube",
		"old_user_day_cube",
		"old_user_sensor_day_cube",
		"sleep_acive_user_cube",
		"sleep_stay_user_cube",
		"stay_new_user_day_cube",
		"stay_old_user_day_cube",
		"stay_user_day_cube",
		"stay_user_hour_cube"
		};

	public static void main(String[] args) {
		 try{
	            Options options = new Options();
	            options.addOption("year", "year", true, "年份");//yyyy
	            options.addOption("interval", "interval", true, "年份间隔");
	            CommandLineParser parser = new PosixParser();
	            CommandLine line = parser.parse(options, args);
	            int year = Integer.parseInt(line.getOptionValue("year"));
	            int interval = Integer.parseInt(line.getOptionValue("interval"));//条件不能为空，如果为空，进行报错，不处理
	            logger.info("year=" + year + " interval=" + interval);
	            long begin = System.currentTimeMillis();
	            execute(year,interval);
	            long end = System.currentTimeMillis();
	            logger.info("----AutoPartitionTask Task is over. Used Time :" + (end - begin) / 1000 + " seconds.");
	        }catch (Exception e){
	            logger.error("运行异常：",e);
	            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
	        }finally{
	        	if (null != conn2Wifianalytics) {
	                try {
	                	conn2Wifianalytics.close();
	                } catch (SQLException e) {
	                    e.printStackTrace();
	                }
	            }
	        	
	        	if (null != conn2WifianalyticsBitmap) {
	                try {
	                	conn2WifianalyticsBitmap.close();
	                } catch (SQLException e) {
	                    e.printStackTrace();
	                }
	            }
	        }
	}
	
	 /**
     * 根据指定条件，清理数据库表数据
     * @param code
	 * @throws SQLException 
     */
    public static void execute(int year,int interval) throws SQLException {
    	for (String tableName : WIFIANALYTICS_TABLES ){
    		addPartition(year,interval,"wifianalytics",tableName,conn2Wifianalytics);
    	}
    	for (String tableName : WIFIANALYTICS_BITMAP_TABLES ){
    		addPartition(year,interval,"wifianalytics_bitmap",tableName,conn2WifianalyticsBitmap);
    	}
    }
    /**
     * 给指定schema 和 表添加索引
     * @param year
     * @param interval
     * @param schema
     * @param table
     * @throws SQLException 
     */
    private static void addPartition(int year,int interval, String schema,String tableName,Connection conn) throws SQLException{
    	long t0 = System.currentTimeMillis();
    	//保留所有partition set集合  
    	Set<String> partitionSet = new HashSet<String> ();
    	String sql = querySql.replaceAll("_table_schema_", schema).replaceAll("_table_name_", tableName);
    	List<Map<String,Object>> list = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB,false);
    	if(list != null){
    		for(Map<String,Object> map : list){
    			partitionSet.add(map.get("part") + "");
    		}
    	}
    	logger.info("schema=" + schema + " tableName=" + tableName  +  " 已经存在分区是：" + partitionSet);
    	Date firstDate = DateUtil.getYearFirst(year + interval);
    	Date lastDate = DateUtil.getYearLast(year + interval);
    	logger.info("firstDate=" + firstDate + " lastDate=" + lastDate );
    	Date tmpDate = DateUtil.getYearFirst(year + interval);
    	boolean isChange = false;
        StringBuffer alterSql = new StringBuffer("ALTER TABLE " + tableName  + "  ADD PARTITION (" )   ;
    	while(tmpDate.compareTo(lastDate) <= 0){
    		String partitionName = "p" + DateUtil.format(tmpDate, DateUtil.FACT_DATE1);
    		if(!partitionSet.contains(partitionName)){
    			isChange = true;
    			String dateString = DateUtil.format(tmpDate, DateUtil.PATTERN_DATE);
    			alterSql.append(" PARTITION " + partitionName + "  VALUES LESS THAN ('" + dateString + "') ENGINE = InnoDB,");
    		}else{
    			logger.info("表:" + tableName + "分区已经存在：" + partitionName);
    		}
    	    tmpDate = DateUtil.addDay2Date(1, tmpDate);
    	} 
    	alterSql.deleteCharAt(alterSql.length() - 1);
    	alterSql.append(" )");
    	PreparedStatement alterTab = conn.prepareStatement(alterSql.toString());
    	if(isChange){
    		alterTab.execute(alterSql.toString());
    	}
    	alterSql.delete(0, alterSql.length());
    	long t1 = System.currentTimeMillis();
    	logger.info("表添加分区完毕：tableName=" + tableName +  " 用时：" + (t1-t0)/1000);
    }
	
}
