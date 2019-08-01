package com.talkingdata.analytics.wifi.collector.counter;

import java.beans.PropertyVetoException;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mchange.v2.c3p0.ComboPooledDataSource;

public class C3P0JDBC {
	
	private static final Logger errorLogger = LoggerFactory.getLogger("error");
	
	private static C3P0JDBC instance;

	private static ComboPooledDataSource cpds; 
	
	static String url ;
	static String user ;
	static String pass ;
	static String driver ;
	
	public static void init() throws FileNotFoundException, IOException {
		Properties properties = new Properties();
		properties.load(new FileReader(new File("/nfs/config/wifianalytics/sysConfig.properties")));
		url = properties.getProperty("meta.counter.connection.url");
		user = properties.getProperty("meta.counter.connection.username");
		pass = properties.getProperty("meta.counter.connection.password");
		driver = properties.getProperty("meta.counter.connection.driver_class");
	}
	
	private C3P0JDBC() throws PropertyVetoException, FileNotFoundException, IOException {
		init();
		cpds = new ComboPooledDataSource();
		cpds.setJdbcUrl(url);  
		cpds.setUser(user);  
		cpds.setPassword(pass);
		cpds.setDriverClass(driver);  
		cpds.setMinPoolSize(2);  
		cpds.setAcquireIncrement(5);  
		cpds.setMaxPoolSize(20);  
		cpds.setMaxStatements(180); 
		cpds.setAutomaticTestTable("select 1");
        cpds.setTestConnectionOnCheckin(true);
        cpds.setTestConnectionOnCheckout(true);
	}
	
    public static final C3P0JDBC getInstance() {
        if (instance == null) {
            try {
                instance = new C3P0JDBC();
            } catch (Exception e) {
            	errorLogger.error("c3p0初始化失败",e);
            }
        }
        return instance;
    }
	
	 public synchronized final Connection getConnection() {
	        Connection conn = null;
	        try {
	            conn = cpds.getConnection();
	        } catch (SQLException e) {
	           errorLogger.error("获得数据库链接失败",e);
	        }
	        return conn;
	    }
}
