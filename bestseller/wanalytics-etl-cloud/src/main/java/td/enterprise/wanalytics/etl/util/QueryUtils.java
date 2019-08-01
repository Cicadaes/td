package td.enterprise.wanalytics.etl.util;


import td.enterprise.wanalytics.etl.jdbc.*;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 查询封装，省去连接管理
 */
public class QueryUtils {

    public static final int BITMPA_DB = 1;

    public static final int WIFIANALYTICS_DB = 2;

    public static final int USER_DB = 3;

    public static final int COUNTER_DB = 4;

    public static final int AZKABAN_DB = 5;

    public static final int HIVE_DB = 6;

    public static final String WIFIANALYTICS_DB_PREFIX = " wifianalytics.";

    public static List <Map <String, Object>> query(String sql, int dbType) {
        return query(sql, dbType, null,true);
    }
    
    public static List <Map <String, Object>> query(String sql, int dbType,boolean closeConnection) {
        return query(sql, dbType, null,closeConnection);
    }

    /**
     * 带有参数值查询，如果有特殊字符，可以通过此方法
     *
     * @param sql
     * @param dbType
     * @param valuesList
     * @return
     */
    public static List <Map <String, Object>> query(String sql, int dbType, List <Object> valuesList, boolean closeConnection) {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        List <Map <String, Object>> list = null;
        try {
            if (BITMPA_DB == dbType) {
                conn = DbBitmapConn.getConnection();
            } else if (WIFIANALYTICS_DB == dbType) {
                conn = DbWifianalyticsConn.getConnection();
            } else if (USER_DB == dbType) {
                conn = DbUserConn.getConnection();
            } else if (COUNTER_DB == dbType) {
                conn = DbCounterConn.getConnection();
            } else if (AZKABAN_DB == dbType) {
                conn = DbAzkabanConn.getConnection();
            }else if (HIVE_DB == dbType) {
                conn = DbHiveConn.getConnection();
            } else {
                throw new RuntimeException("没找到对应数据库类型:" + dbType);
            }

            ps = conn.prepareStatement(sql);
            //设置参数
            if (null != valuesList) {
                for (int i = 1; i < valuesList.size() + 1; i++) {
                    ps.setObject(i, valuesList.get(i - 1));
                }
            }
            rs = ps.executeQuery();

            ResultSetMetaData rsmd = rs.getMetaData();//元数据信息
            int count = rsmd.getColumnCount();//字段数量
            String[] colNames = new String[count];

            for (int i = 1; i <= count; i++) {
                colNames[i - 1] = rsmd.getColumnLabel(i);//字段名称
            }

            list = new ArrayList <Map <String, Object>>();
            while (rs.next()) {
                Map <String, Object> item = new HashMap <String, Object>();
                for (int i = 1; i <= count; i++) {
                    item.put(colNames[i - 1], rs.getObject(colNames[i - 1]));
                }
                list.add(item);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
        	if(closeConnection){
        		try {
                    if (null != conn) {
                        conn.close();
                    }
                } catch (Exception e) {
                }
        	}
            try {
                if (null != ps) {
                    ps.close();
                }
            } catch (Exception e) {
            }

            try {
                if (null != rs) {
                    rs.close();
                }
            } catch (Exception e) {
            }
        }
        return list;
    }

    public static Map <String, Object> querySingle(String sql, int dbType) {
        return querySingle(sql, dbType, null);
    }

    public static Map <String, Object> querySingle(String sql, int dbType, List <Object> valuesList) {
        List <Map <String, Object>> list = query(sql, dbType, valuesList,true);
        if (null != list && !list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public static void execute(String sql, int dbType) {
        execute(sql, dbType, null);
    }

    public static void execute(String sql, int dbType, List <Object> valuesList) {
        Connection conn = null;
        PreparedStatement ps = null;
        try {
            if (BITMPA_DB == dbType) {
                conn = DbBitmapConn.getConnection();
            } else if (WIFIANALYTICS_DB == dbType) {
                conn = DbWifianalyticsConn.getConnection();
            } else if (USER_DB == dbType) {
                conn = DbUserConn.getConnection();
            } else if (COUNTER_DB == dbType) {
                conn = DbCounterConn.getConnection();
            } else if (AZKABAN_DB == dbType) {
                conn = DbAzkabanConn.getConnection();
            }else {
                throw new RuntimeException("没找到对应数据库类型:" + dbType);
            }
            ps = conn.prepareStatement(sql);
            //设置参数
            if (null != valuesList) {
                for (int i = 1; i < valuesList.size() + 1; i++) {
                    ps.setObject(i, valuesList.get(i - 1));
                }
            }
            conn.setAutoCommit(false);
            boolean r = ps.execute(sql, dbType);
            conn.commit();
        } catch (Exception e) {
            e.printStackTrace();
            try {
                if (conn != null)
                conn.rollback();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        } finally {
            try {
                if (null != conn) {
                    conn.close();
                }
            } catch (Exception e) {
            }
            try {
                if (null != ps) {
                    ps.close();
                }
            } catch (Exception e) {
            }

        }
    }

    /**
     * 获取自动增长ID
     *
     * @return
     */
    public static int getInsertId(String sql, int dbType) {
        //-1 表示获取失败
        int id = -1;
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            if (BITMPA_DB == dbType) {
                conn = DbBitmapConn.getConnection();
            } else if (WIFIANALYTICS_DB == dbType) {
                conn = DbWifianalyticsConn.getConnection();
            } else if (USER_DB == dbType) {
                conn = DbUserConn.getConnection();
            } else if (COUNTER_DB == dbType) {
                conn = DbCounterConn.getConnection();
            } else if (AZKABAN_DB == dbType) {
                conn = DbAzkabanConn.getConnection();
            } else {
                throw new RuntimeException("没找到对应数据库类型:" + dbType);
            }
            conn.setAutoCommit(false);
            ps = conn.prepareStatement(sql);
            //执行插入
            boolean r = ps.execute(sql, dbType);

            String queryIDSql = "select LAST_INSERT_ID() as id";
            //执行成功后，获取插入ID
            ps = conn.prepareStatement(queryIDSql);
            rs = ps.executeQuery();

            while (rs.next()) {
                id = Integer.parseInt(rs.getObject("id") + "");
            }
            conn.commit();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (null != rs) {
                    rs.close();
                }
            } catch (Exception e) {
            }
            try {
                if (null != ps) {
                    ps.close();
                }
            } catch (Exception e) {
            }
            try {
                if (null != conn) {
                    conn.close();
                }
            } catch (Exception e) {
            }

        }
        return id;
    }


}
