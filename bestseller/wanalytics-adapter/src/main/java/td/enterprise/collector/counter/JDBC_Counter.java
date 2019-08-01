package td.enterprise.collector.counter;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import lombok.extern.slf4j.Slf4j;
import td.enterprise.common.util.LogUtils;

@Slf4j
public class JDBC_Counter {

    private JDBC_Counter() {
    }

    public static synchronized int savecount(String key, Integer value) {
        int update = -1;
        Connection connection = null;
        Statement jt = null;
        try {
            String makesql = makesql(key, value);
            connection = C3P0JDBC.getInstance().getConnection();
            jt = connection.createStatement();
            update = jt.executeUpdate(makesql);
            LogUtils.log4Mysql.info("makesql:{},updateCount:{}", makesql, update);
        } catch (Exception e) {
            log.error("插入数据库失败", e);
        } finally {
            try {
                if (jt != null) {
                    jt.close();
                }
            } catch (SQLException e) {
                log.error("关闭数据库失败", e);
            }
            try {
                if (connection != null) {
                    connection.close();
                }
            } catch (SQLException e) {
                log.error("关闭数据库失败", e);
            }
        }
        return update;
    }

    private static String makesql(String key, Integer value) {
        String[] split = key.split(",");
        String gettime = split[1];
        String gethour = split[2];
        SqlMaker sqlMaker = new SqlMaker();
        sqlMaker.setTablename("offline_sensor_heart_hour_counter");
        sqlMaker.setWherekey(new String[] { "sensor_mac", "date", "hour" });
        sqlMaker.setWherevalue(new String[] { split[0], gettime, gethour });
        sqlMaker.setCount(value);
        String getwnsql = sqlMaker.getwnsql();
        return getwnsql;
    }

}
