package td.enterprise.wanalytics.etl.jdbc;

import lombok.extern.slf4j.Slf4j;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Created by Yan on 2017/4/13.
 */

@Slf4j
public class DbBitmapConn {

    private static Connection connection;

    private DbBitmapConn()  {

    }

    public static Connection getConnection() throws SQLException {

        if(connection == null || connection.isClosed()){
            log.info("创建数据库: " + SysConfigUtil.getValue("bitmapdb.connection.driver_class") + ";" + SysConfigUtil.getValue("bitmapdb.connection.url"));
            try {
                Class.forName(SysConfigUtil.getValue("bitmapdb.connection.driver_class")).newInstance();
            } catch (InstantiationException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
            String dburl = SysConfigUtil.getValue("bitmapdb.connection.url");
            String dbuser = SysConfigUtil.getValue("bitmapdb.connection.username");
            String dbpassword = SysConfigUtil.getValue("bitmapdb.connection.password");
            if (dburl == null) {
                dburl = "jdbc:mysql://localhost/test";
                dbuser = "root";
                dbpassword = "";
            }

            try {
                connection = DriverManager.getConnection(dburl, dbuser, dbpassword);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return connection;

    }

    public static void close(){
        try {
            if(connection != null){
                connection.close();
                connection = null;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }


}
