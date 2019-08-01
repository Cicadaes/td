package com.talkingdata.datacloud.adapter.common;

import com.talkingdata.datacloud.visual.util.JSONUtils;

/**
 * Created by hadoop on 2017/4/12.
 */
public class JdbcBean {
    private String host;
    private String port;
    private String user;
    private String password;
    private String database;
    private String tableName;
    private String driverClassName;

    public static JdbcBean getJdbcBean(String dataSourceConnectionInfo){
        return getJdbcBean(dataSourceConnectionInfo,JdbcBean.class);
    }

    public static  JdbcBean getJdbcBean(String dataSourceConnectionInfo,String dataSourceName ,String driverClassName){
        JdbcBean jdbcBean = getJdbcBean(dataSourceConnectionInfo,driverClassName);
        jdbcBean.setTableName(dataSourceName);
        return jdbcBean;
    }

    public static  JdbcBean getJdbcBean(String dataSourceConnectionInfo,String driverClassName){
        JdbcBean jdbcBean = getJdbcBean(dataSourceConnectionInfo,JdbcBean.class);
        jdbcBean.setDriverClassName(driverClassName);
        return jdbcBean;
    }

    public static  <T extends JdbcBean> T getJdbcBean(String dataSourceConnectionInfo,Class<T> clazz){
        try {
            T jdbcBean= JSONUtils.readValueToBean(dataSourceConnectionInfo,clazz);
            return jdbcBean;
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    public String getUrl(){
        if(driverClassName.toLowerCase().contains("db2")){
            return String.format("jdbc:db2://%s:%s/%s",getHost(),getPort(),getDatabase());
        }
        if(driverClassName.toLowerCase().contains("mysql")){
            return String.format("jdbc:mysql://%s:%s/%s",getHost(),getPort(),getDatabase());
        }
        if(driverClassName.toLowerCase().contains("sqlserver")){
            return String.format("jdbc:sqlserver://%s:%s;databasename=%s",getHost(),getPort(),getDatabase());
        }
        if(driverClassName.toLowerCase().contains("oracle")){
            return String.format("jdbc:oracle:thin:@%s:%s:%s",getHost(),getPort(),getDatabase());
        }
        if(driverClassName.toLowerCase().contains("kylin")){
            return String.format("jdbc:kylin://%s:%s/%s",getHost(),getPort(),getDatabase());
        }
        if(driverClassName.toLowerCase().contains("queryengine")){
            return String.format("jdbc:queryEngine://%s:%s/%s",getHost(),getPort(),getDatabase());
        }
        throw new IllegalArgumentException(String.format("获取连接信息错误 jdbc:%s,host:%s,port:%s,database:%s"
                ,getDriverClassName(),getHost(),getPort(),getPassword(),getDatabase()));

    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    //当tableName中存在空格，说明是sql语句
    public String getTableName() {
        if(tableName.contains(" ")){
            return "("+tableName+")";
        }
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getDriverClassName() {
        return driverClassName;
    }

    public void setDriverClassName(String driverClassName) {
        this.driverClassName = driverClassName;
    }
}