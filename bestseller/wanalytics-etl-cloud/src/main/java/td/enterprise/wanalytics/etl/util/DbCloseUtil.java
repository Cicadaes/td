package td.enterprise.wanalytics.etl.util;

import org.apache.log4j.Logger;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Created by Administrator on 2017/6/13.
 * 提供原生jdbc资源释放通用工具
 */
public class DbCloseUtil {
    private static final Logger log = Logger.getLogger(DbCloseUtil.class);
    /**
     * 关闭所有可关闭的JDBC资源，不论先后顺序，总能以正确的顺序执行
     *
     * @param objs 可关闭的资源对象有Connection、Statement、ResultSet，别的类型资源自动忽略
     */
    public static void closeAll(Object... objs) {
        for (Object obj : objs){
            if (obj instanceof ResultSet) close((ResultSet) obj);
            if (obj instanceof Statement) close((Statement) obj);
            if (obj instanceof Connection) close((Connection) obj);
        }
    }

    private static void close(Connection conn) {
        if (conn != null)
            try {
                conn.close();
            } catch (SQLException e) {
                log.error("关闭数据库连接发生异常！");
            }
    }

    private static void close(ResultSet rs) {
        if (rs != null)
            try {
                rs.close();
            } catch (SQLException e) {
                log.error("关闭结果集发生异常！");
            }
    }

    private static void close(Statement stmt) {
        if (stmt != null)
            try {
                stmt.close();
            } catch (SQLException e) {
                log.error("关闭SQL语句发生异常！");
            }
    }
}
