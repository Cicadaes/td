package com.talkingdata.analytics.wifi.collector.counter;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JDBC_Counter {
	
	private static final Logger errorLogger = LoggerFactory.getLogger("error");
	
	private JDBC_Counter(){}

	public static synchronized int savecount(String key,Integer value){
		int update = -1;
		Connection connection =null;
		Statement jt=null;
		try{
			String makesql = makesql(key,value);
			connection = C3P0JDBC.getInstance().getConnection();
			jt =connection.createStatement();
			update = jt.executeUpdate(makesql);
		}catch(Exception e){
			errorLogger.error("插入数据库失败",e);
		}finally{
			try {
				if (jt!=null) {
					jt.close();
				}
			} catch (SQLException e) {
				errorLogger.error("关闭数据库失败",e);
			}
			try {
				if (connection!=null) {
					connection.close();
				}
			} catch (SQLException e) {
				errorLogger.error("关闭数据库失败",e);
			}
		}
		return update;
	}

	private static String makesql(String key, Integer value) {
		String[] split = key.split(",");
		String gettime =split[1];
		String gethour = split[2];
		SqlMaker sqlMaker = new SqlMaker();
		sqlMaker.setTablename("offline_sensor_heart_hour_counter");
		sqlMaker.setWherekey(new String[]{"sensor_mac","date","hour"});
		sqlMaker.setWherevalue(new String[]{split[0],gettime,gethour});
		sqlMaker.setCount(value);
		String getwnsql = sqlMaker.getwnsql();
		return getwnsql;
	}
	
}
