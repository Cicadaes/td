package com.talkingdata.datacloud.adapter.util;

import com.talkingdata.datacloud.adapter.common.JdbcBean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;

import java.sql.Connection;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by tcq.
 */
public class DataBaseUtil {

    private static final Logger logger = LoggerFactory.getLogger(DataBaseUtil.class);

    public static List<String> showTables(JdbcBean jdbcBean) {
        String driverName = jdbcBean.getDriverClassName();
        String sql="select table_name from information_schema.tables where table_schema='"+jdbcBean.getDatabase()+"' and table_type='base table'";
        if (driverName.contains("db2")) {
            sql = "select tabname from syscat.tables where tabschema=current schema";
        }else if (driverName.contains("oracle")) {
            sql = "select tname from tab";
        }else if (driverName.contains("sqlserver")) {
            sql = "select name from SysObjects where XType='U'";
        }
        return queryForList(jdbcBean,sql, String.class);
    }

    /**
     * xinlei.bai
     * 获取 DB中的视图信息
     * @param jdbcBean
     * @return  视图列表
     */
    public static List<String> showView(JdbcBean jdbcBean) {
        String driverName = jdbcBean.getDriverClassName();
        String sql = "select TABLE_NAME as TABLE_NAME from information_schema.VIEWS where TABLE_SCHEMA = '"+jdbcBean.getDatabase()+"'";
        if (driverName.contains("sqlserver")) {
            sql = "select name from SysObjects where XType='U'";
        } else if (driverName.contains("oracle")) {
            sql = "select tname from tab";
        }
        return queryForList(jdbcBean,sql, String.class);
    }

    private static <T> List<T> queryForList(JdbcBean jdbcBean,String sql,Class<T> elementType) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate();
        List<T> rows = null;
        try {
            jdbcTemplate.setDataSource(JdbcUtil.getDataSource(jdbcBean));
            rows = jdbcTemplate.queryForList(sql,elementType);
        } catch (Exception e) {
            logger.error("queryForList exception:", e);
        }
        if (null == rows) {
            rows = new ArrayList<>();
        }
        return rows;
    }

    public static List<Map<String, Object>> queryForList(JdbcBean jdbcBean, String sql) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate();
        List<Map<String, Object>> rows = null;
        try {
            jdbcTemplate.setDataSource(JdbcUtil.getDataSource(jdbcBean));
            rows = jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            logger.error("queryForList exception:", e);
        }
        if (null == rows) {
            rows = new ArrayList<>();
        }
        return rows;
    }

    public static Map<String, Object> queryForMap(JdbcBean jdbcBean, String sql) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate();
        Map<String, Object> rows = null;
        try {
            jdbcTemplate.setDataSource(JdbcUtil.getDataSource(jdbcBean));
            rows = jdbcTemplate.queryForMap(sql);
        } catch (Exception e) {
            logger.error("queryForList exception:", e);
        }
        if (null == rows) {
            rows = new HashMap();
        }
        return rows;
    }

    public static SqlRowSet queryForRowSet(JdbcBean jdbcBean, String sql) {
        JdbcTemplate jdbcTemplate;
        SqlRowSet rowSet=null;
        try {
            jdbcTemplate = new JdbcTemplate();
            jdbcTemplate.setDataSource(JdbcUtil.getDataSource(jdbcBean));
            rowSet = jdbcTemplate.queryForRowSet(sql);
        } catch (Exception e) {
            logger.error("queryForList exception:", e);
        }

        return rowSet;
    }

    public static List<Map<String, Object>> queryAllMetaData(JdbcBean jdbcBean, String sql) {
        List<Map<String, Object>> rows=new ArrayList<>();
        SqlRowSet rowSet=queryForRowSet(jdbcBean,sql);
        if(rowSet==null){
            return rows;
        }
        SqlRowSetMetaData metaData = rowSet.getMetaData();
        int columnCount = metaData.getColumnCount();
        for (int i = 1; i <= columnCount; i++) {
            Map<String,Object> fieldMap = new HashMap<>();
            int columnType=metaData.getColumnType(i);
            fieldMap.put("ColumnName", metaData.getColumnName(i));
            if(columnType== Types.VARCHAR||columnType==Types.CHAR||columnType==Types.LONGNVARCHAR){
                fieldMap.put("ColumnType", metaData.getColumnTypeName(i)+"("+metaData.getPrecision(i)+")");
            }else{
                fieldMap.put("ColumnType", metaData.getColumnTypeName(i));
            }
            rows.add(fieldMap);
        }
        return rows;
    }

    //获取某些类型的字段
    public static List<String> querySomeMetaData(JdbcBean jdbcBean, String sql,List<Integer> columnTypeList,boolean isContain) {
        List<String> rows=new ArrayList<>();
        SqlRowSet rowSet=queryForRowSet(jdbcBean,sql);
        if(rowSet==null){
            return rows;
        }
        SqlRowSetMetaData metaData = rowSet.getMetaData();
        int columnCount = metaData.getColumnCount();
        for (int i = 1; i <= columnCount; i++) {
            int columnType=metaData.getColumnType(i);
            if(columnTypeList==null||columnTypeList.size()==0){
                rows.add(metaData.getColumnName(i));
                continue;
            }
            boolean qualified=true;
            for(Integer selectColumnType:columnTypeList){
                if(selectColumnType==columnType){
                    if(isContain){
                        rows.add(metaData.getColumnName(i));
                        continue;
                    }else{
                        qualified=false;
                    }
                }
            }
            if(!isContain&&qualified){
                rows.add(metaData.getColumnName(i));
            }
        }
        return rows;
    }

    public static List<Map<String, Object>> queryForListThrowException(JdbcBean jdbcBean, String sql)throws Exception {
        JdbcTemplate jdbcTemplate = new JdbcTemplate();
        jdbcTemplate.setDataSource(JdbcUtil.getDataSource(jdbcBean));
        return jdbcTemplate.queryForList(sql);
    }

    public static boolean testConnection(JdbcBean jdbcBean) {
        Connection connection=null;
        try {
            connection=JdbcUtil.getConnection(jdbcBean);
            if(connection!=null){
                return true;
            }
        }catch (Exception e){
            logger.error("测试连接失败",e);
        }finally {
            if(connection!=null){
                try {
                    connection.close();
                }catch (Exception e){
                    logger.error("connection关闭异常:"+e.getMessage());
                }
            }
        }
        return false;
    }

//
//    private static void executeSql(JdbcBean jdbcBean,String sql){
//        try {
//            JdbcTemplate jdbcTemplate = new JdbcTemplate();
//            jdbcTemplate.setDataSource(JdbcUtil.getDataSource(jdbcBean));
//            jdbcTemplate.execute(sql);
//        } catch (Exception e) {
//            logger.error("executeSql exception:", e + "\n sql:" + sql);
//        }
//    }
//    public static List<NodeField> getSqlFields(DBConnectionInfo dbConnectionInfo, String sql) {
//        DriverManagerDataSource dataSource = null;
//        JdbcTemplate jdbcTemplate = null;
//        SqlRowSet rows = null;
//        List<NodeField> nodeFields = new ArrayList<>();
//        try {
//            dataSource = initDataSource(dbConnectionInfo);
//            jdbcTemplate = new JdbcTemplate();
//            jdbcTemplate.setDataSource(dataSource);
//
//            rows = jdbcTemplate.queryForRowSet(sql);
//            SqlRowSetMetaData metaData = rows.getMetaData();
//            for (int i = 1; i <= metaData.getColumnCount(); i++) {
//                NodeField nodeField = new NodeField();
//                nodeField.setCode(metaData.getColumnName(i));
//                nodeField.setDataType(SupportedDataType.convert(metaData.getColumnTypeName(i)));
//                nodeFields.add(nodeField);
//            }
//
//        } catch (Exception e) {
//            logger.error("queryForRowSet exception:", e);
//        } finally {
//            try {
//                if (dataSource != null) {
//                    dataSource.getConnection().close();
//                }
//            } catch (Exception e) {
//                logger.error("close queryForRowSet dataSource exception:", e);
//            }
//        }
//        return nodeFields;
//
//    }
//
//    public static List<NodeField> getSqlFieldsByJdbc(DBConnectionInfo connectInfo, String sql) {
//        Connection connection = null;
//        List<NodeField> nodeFields = new ArrayList<>();
//        try {
//            connection = DriverManager.getConnection(connectInfo.getJdbcUrl(), connectInfo.getJdbcUserName(), connectInfo.getJdbcPassword());
//            PreparedStatement stmt = connection.prepareStatement(sql);
//            ResultSetMetaData metaData = stmt.executeQuery().getMetaData();
//            for (int i = 1; i <= metaData.getColumnCount(); i++) {
//                NodeField nodeField = new NodeField();
//                nodeField.setCode(metaData.getColumnName(i));
//                nodeField.setLength(metaData.getColumnDisplaySize(i));
//                nodeField.setIsNullable(metaData.isNullable(i) == ResultSetMetaData.columnNoNulls ? "false" : "true");
//                nodeField.setDataType(SupportedDataType.convert(metaData.getColumnTypeName(i)));
//                nodeFields.add(nodeField);
//            }
//        } catch (SQLException e) {
//            logger.error("getSqlFieldsByJdbc exception:", e);
//        } finally {
//            try {
//                if (connection != null) {
//                    connection.close();
//                }
//            } catch (Exception e) {
//                logger.error("getSqlFieldsByJdbc close connection exception:", e);
//            }
//        }
//        return nodeFields;
//    }
//
//    public static List<Map<String, Object>> queryForList(DBConnectionInfo dbConnectionInfo, String sql) {
//        DriverManagerDataSource dataSource = null;
//        JdbcTemplate jdbcTemplate = null;
//        List<Map<String, Object>> rows = null;
//        try {
//            dataSource = initDataSource(dbConnectionInfo);
//            jdbcTemplate = new JdbcTemplate();
//            jdbcTemplate.setDataSource(dataSource);
//            rows = jdbcTemplate.queryForList(sql);
//
//        } catch (Exception e) {
//            logger.error("queryForList exception:", e + "\n sql:" + sql);
//        } finally {
//            try {
//                if (dataSource != null) {
//                    dataSource.getConnection().close();
//                }
//            } catch (Exception e) {
//                logger.error("close queryForList dataSource exception:", e);
//            }
//        }
//        if (null == rows) {
//            rows = new ArrayList<>();
//        }
//        return rows;
//    }
//
//    public static String queryForString(DBConnectionInfo dbConnectionInfo, String sql) throws IOException {
//        List<Map<String, Object>> maps = queryForList(dbConnectionInfo, sql);
//        ObjectMapper mapper = new ObjectMapper();
//        String s = mapper.writeValueAsString(maps);
//        return s;
//    }
//
//    public static DBConnectionInfo createMysqlConnectionInfo(String ip, String port, String username, String password, String database) {
//        DBConnectionInfo dbConnectionInfo = new DBConnectionInfo();
//        dbConnectionInfo.setDriverClassName("com.mysql.jdbc.Driver");
//        dbConnectionInfo.setJdbcUrl(
//                "jdbc:mysql://" + ip + ":" + port + "/" + database + "?useUnicode=true&characterEncoding=utf-8");
//        dbConnectionInfo.setJdbcUserName(username);
//        dbConnectionInfo.setJdbcPassword(password);
//        dbConnectionInfo.setDatabase(database);
//        return dbConnectionInfo;
//    }
//
//    public static DBConnectionInfo createWherehowsDB() {
//        String ip = SystemConfig.wherehowsDB_host;
//        String port = SystemConfig.wherehowsDB_port;
//        String username = SystemConfig.wherehowsDB_user;
//        String password = SystemConfig.wherehowsDB_password;
//        String database = SystemConfig.wherehowsDB_database;
//        DBConnectionInfo dbConnectionInfo = new DBConnectionInfo();
//        dbConnectionInfo.setDriverClassName("com.mysql.jdbc.Driver");
//        dbConnectionInfo.setJdbcUrl(
//                "jdbc:mysql://" + ip + ":" + port + "/" + database + "?useUnicode=true&characterEncoding=utf-8");
//        dbConnectionInfo.setJdbcUserName(username);
//        dbConnectionInfo.setJdbcPassword(password);
//        dbConnectionInfo.setDatabase(database);
//        return dbConnectionInfo;
//    }
//
//    public static DBConnectionInfo createHiveConnectionInfo(String ip, String port, String username, String password, String database) {
//        DBConnectionInfo dbConnectionInfo = new DBConnectionInfo();
//        String driverName = "org.apache.hive.jdbc.HiveDriver";
//        dbConnectionInfo.setDriverClassName(driverName);
//        dbConnectionInfo.setJdbcUrl(
//                "jdbc:hive2://" + ip + ":" + port + "/" + database + "?useUnicode=true&characterEncoding=utf-8");
//        dbConnectionInfo.setJdbcUserName(username);
//        dbConnectionInfo.setJdbcPassword(password);
//        dbConnectionInfo.setDatabase(database);
//        return dbConnectionInfo;
//    }
//
//    public static String jdbcInputQuery(String tableName, String sql, String timeColumn, String startTime, String endTime){
//        StringBuilder sb = new StringBuilder();
//        if (StringUtils.isEmpty(sql)) {
//            sb.append("select * from ").append(tableName);
//            if (StringUtils.isNotEmpty(timeColumn) && (StringUtils.isNotEmpty(startTime) || StringUtils.isNotEmpty(endTime))) {
//                sb.append(" where ");
//                if (StringUtils.isNotEmpty(startTime)) {
//                    sb.append(timeColumn).append(" >= '").append(millisecondToString(startTime, "00:00:00")).append("'");
//                }
//                if (StringUtils.isNotEmpty(startTime) && StringUtils.isNotEmpty(endTime)) {
//                    sb.append(" and ");
//                }
//                if (StringUtils.isNotEmpty(endTime)) {
//                    sb.append(timeColumn).append(" <= '").append(millisecondToString(endTime,"23:59:59")).append("'");
//                }
//            }
//            sql = sb.toString();
//        }
//        return sql.trim();
//    }
//
//    public static String millisecondToString(String  millisecond, String hms) {
//        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        Date date = new Date();
//        try {
//            date.setTime(Long.parseLong(millisecond));
//            if (StringUtils.isNotEmpty(hms)) {
//                return df.format(date).split(" ")[0] + " " + hms;
//            } else {
//                return df.format(date);
//            }
//        } catch (NumberFormatException e) {
//            logger.error(millisecond + ", 转日期失败. ", e);
//            return millisecond;
//        }
//    }

//    /**
//     * 获取指定数据库和用户的所有表名
//     * @return
//     */
//    public static List getAllTableNames(JdbcBean jdbcBean,String type) {
//        List tableNames = new ArrayList();
//        Connection conn;
//        DatabaseMetaData dbmd;
//        DataSource dataSource;
//        try {
//            dataSource=JdbcUtil.getDataSource(jdbcBean);
//            conn=dataSource.getConnection();
//            dbmd= conn.getMetaData();
//            // 表名列表
//            ResultSet rest = dbmd.getTables(jdbcBean.getDatabase(), null, "%", new String[] { type });
//            // 输出 table_name
//            while (rest.next()) {
//                tableNames.add(rest.getString("TABLE_NAME"));
//            }
//            rest.close();
//            DataSourceUtils.releaseConnection(conn, dataSource);
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//        return tableNames;
//    }

//    private static  List<String> execute(JdbcBean jdbcBean, String sql){
//        JdbcTemplate jdbcTemplate = new JdbcTemplate();
//        try {
//            jdbcTemplate.setDataSource(JdbcUtil.getDataSource(jdbcBean));
//            class ExecuteStatementCallback implements StatementCallback<List<String>>, SqlProvider {
//                ExecuteStatementCallback() {
//                }
//                public List<String> doInStatement(Statement stmt) throws SQLException {
//                    List<String> resultList=new ArrayList<>();
//                    ResultSet rs=stmt.executeQuery(sql);
//                    while(rs.next())
//                    {
//                        resultList.add(rs.getString(1));
//                    }
//                    rs.close();
//                    stmt.close();
//                    return resultList;
//                }
//                public String getSql() {
//                    return sql;
//                }
//            }
//            return jdbcTemplate.execute(new ExecuteStatementCallback());
//        }catch (Exception e){
//            logger.error(e.getMessage());
//        }
//        return null;
//    }


}
