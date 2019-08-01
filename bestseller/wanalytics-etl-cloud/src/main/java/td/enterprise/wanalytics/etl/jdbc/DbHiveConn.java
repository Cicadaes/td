package td.enterprise.wanalytics.etl.jdbc;

import lombok.extern.slf4j.Slf4j;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * junmin.li
 */

@Slf4j
public class DbHiveConn {

    private static Connection connection;

    private DbHiveConn()  {

    }

    public static Connection getConnection() {

        try {

            if(connection == null || connection.isClosed()){
                log.info("创建数据库: " + SysConfigUtil.getValue("hive.connection.driver_class") + ";" + SysConfigUtil.getValue("hive.connection.url"));
                Class.forName(SysConfigUtil.getValue("hive.connection.driver_class")).newInstance();
                String dbUrl = SysConfigUtil.getValue("hive.connection.url");
                String dbUser = SysConfigUtil.getValue("hive.connection.username");
                String dbPassword = SysConfigUtil.getValue("hive.connection.password");
                if (dbUrl == null) {
                    dbUrl = "jdbc:mysql://localhost/test";
                    dbUser = "root";
                }
                connection = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
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
