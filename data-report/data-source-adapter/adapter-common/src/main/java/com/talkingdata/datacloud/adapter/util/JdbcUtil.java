package com.talkingdata.datacloud.adapter.util;

import com.talkingdata.datacloud.adapter.common.JdbcBean;
import org.apache.commons.dbcp.BasicDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by yangruobin on 2017/6/30.
 */
public class JdbcUtil {
    private static final Logger logger = LoggerFactory.getLogger(JdbcUtil.class);
    private static Map<String,BasicDataSource> basicDataSourceMap=new HashMap<>();

    public static Connection getConnection(JdbcBean jdbcBean)throws Exception{
        DataSource dataSource = getDataSource(jdbcBean.getUrl(),jdbcBean.getUser(),jdbcBean.getPassword(),jdbcBean.getDriverClassName());
        logger.info("getConnection目前活跃数："+((BasicDataSource)dataSource).getNumActive());
        return dataSource.getConnection();
    }

    public static DataSource getDataSource(JdbcBean jdbcBean){
        return getDataSource(jdbcBean.getUrl(),jdbcBean.getUser(),jdbcBean.getPassword(),jdbcBean.getDriverClassName());
    }

    private static DataSource getDataSource(String url, String username, String password, String driverClassName){
        BasicDataSource basicDataSource;
        if(basicDataSourceMap.containsKey(url)){
            basicDataSource=basicDataSourceMap.get(url);
        }else {
            basicDataSource=initBasicDataSource(url,username,password,driverClassName);
            basicDataSourceMap.put(url,basicDataSource);
        }
        return basicDataSource;
    }
    private static BasicDataSource initBasicDataSource(String url,String username,String password,String driverClassName){
        BasicDataSource basicDataSource=new BasicDataSource();
        basicDataSource.setUrl(url);
        basicDataSource.setUsername(username);
        basicDataSource.setPassword(password);
        basicDataSource.setDriverClassName(driverClassName);
        //初始化连接
        basicDataSource.setInitialSize(1);
        //最小空闲连接
        basicDataSource.setMinIdle(1);
        //最大空闲连接
        basicDataSource.setMaxIdle(5);
        //最大连接数据库连接数，设置为0时，表示没有限制；
        basicDataSource.setMaxActive(50);
        //最大等待秒数，单位为毫秒， 超过时间会报出错误信息
        basicDataSource.setMaxWait(10000);
        //配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
        basicDataSource.setTimeBetweenEvictionRunsMillis(3000);
        //配置一个连接在池中最小生存的时间，单位是毫秒
        basicDataSource.setMinEvictableIdleTimeMillis(30000);
        //进行检测一个连接是有效的SQL语句，比如oracle是select 1 from dual 而 mysql是 select 1
        basicDataSource.setValidationQuery("SELECT 'x'");

//        basicDataSource.setTimeBetweenEvictionRunsMillis(10000);
//        basicDataSource.setRemoveAbandoned(true);
//        basicDataSource.setLogAbandoned(true);
        //是否要进行检测
        basicDataSource.setTestWhileIdle(true);
        basicDataSource.setTestOnBorrow(true);
        basicDataSource.setTestOnReturn(true);
        //打开PSCache，并且指定每个连接上PSCache的大小
        basicDataSource.setPoolPreparedStatements(true);
        basicDataSource.setMaxOpenPreparedStatements(20);
        return basicDataSource;
    }

//    public static DataSource getDriverManagerDataSource(JdbcBean jdbcBean) {
//        return initDriverManagerDataSource(jdbcBean.getUrl(),jdbcBean.getUser(),jdbcBean.getPassword(),jdbcBean.getDriverClassName());
//    }
//
//    private static DriverManagerDataSource initDriverManagerDataSource(String url,String username,String password,String driverClassName) {
//        DriverManagerDataSource dataSource = new DriverManagerDataSource();
//        dataSource.setDriverClassName(driverClassName);
//        dataSource.setUrl(url);
//        dataSource.setUsername(username);
//        dataSource.setPassword(password);
//        return dataSource;
//    }
}
