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
public class DbCounterConn {

    private static Connection connection;

    private DbCounterConn()  {

    }

    public static Connection getConnection() {

        try {
            if(connection == null || connection.isClosed()){
                log.info("创建数据库: " + SysConfigUtil.getValue("counter.connection.driver_class") + ";" + SysConfigUtil.getValue("counter.connection.url"));
                Class.forName(SysConfigUtil.getValue("counter.connection.driver_class")).newInstance();
                String dburl = SysConfigUtil.getValue("counter.connection.url");
                String dbuser = SysConfigUtil.getValue("counter.connection.username");
                String dbpassword = SysConfigUtil.getValue("counter.connection.password");
                if (dburl == null) {
                    dburl = "jdbc:mysql://localhost/test";
                    dbuser = "root";
                    dbpassword = "";
                }

                connection = DriverManager.getConnection(dburl, dbuser, dbpassword);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
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
