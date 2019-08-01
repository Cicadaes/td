package com.talkingdata.wifianalytics.offline.compute.dbsource;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import org.apache.log4j.Logger;
/**
 * Created by xiaolong on 2015/9/17.
 */
public class MysqlSourceFactory {
    private static SqlSessionFactory sqlSessionFactory = null;
    private static Logger logger = Logger.getLogger(MysqlSourceFactory.class);

    static {
        InputStream inputStream = null;
        try {
            //判断线上配置文件是否存在，如果不存在，调用本项目中的配置文件
            Properties prop = new Properties();
            if (new File("/nfs/config/wifianalytics/sysConfig.properties").exists()) {
				 prop.load(new FileInputStream("/nfs/config/wifianalytics/sysConfig.properties"));
			}else {
				prop.load(MysqlSourceFactory.class.getClassLoader().getResourceAsStream("sysConfig.properties"));  
			}
            logger.info("offlinecomputer.driver is "+ prop.getProperty("offlinecomputer.driver"));
            logger.info("offlinecomputer.url is "+ prop.getProperty("offlinecomputer.url"));
            logger.info("offlinecomputer.username is "+ prop.getProperty("offlinecomputer.username"));
            logger.info("offlinecomputer.password is "+ prop.getProperty("offlinecomputer.password"));
            logger.info("offlinecomputer.poolMaximumActiveConnections is "+ prop.getProperty("offlinecomputer.poolMaximumActiveConnections"));
            System.out.println("offlinecomputer.driver is "+ prop.getProperty("offlinecomputer.driver"));
            System.out.println("offlinecomputer.url is "+ prop.getProperty("offlinecomputer.url"));
            System.out.println("offlinecomputer.username is "+ prop.getProperty("offlinecomputer.username"));
            System.out.println("offlinecomputer.password is "+ prop.getProperty("offlinecomputer.password"));
            System.out.println("offlinecomputer.poolMaximumActiveConnections is "+ prop.getProperty("offlinecomputer.poolMaximumActiveConnections"));
			
            inputStream = Resources.getResourceAsStream("offline-compute-mybatis-config.xml");
            
            SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
            sqlSessionFactory = sqlSessionFactoryBuilder.build(inputStream, prop);
            
        } catch (IOException e) {
            logger.error("build sql session factory error : " + e.getMessage());
        } finally {
            try {
                assert inputStream != null;
                inputStream.close();
            } catch (IOException e) {
                logger.error("build sql session factory error : " + e.getMessage());
            }
        }
    }

    public static SqlSessionFactory getSqlSessionFactory() {
        return sqlSessionFactory;
    }

}
