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
public class DbUserConn {

    private static Connection connection;

    private DbUserConn()  {

    }

    public static Connection getConnection() throws ClassNotFoundException, IllegalAccessException, InstantiationException, SQLException {

        if(connection == null || connection.isClosed()){
            log.info("创建数据库: " + SysConfigUtil.getValue("idMappingdb.connection.driver_class") + ";" + SysConfigUtil.getValue("idMappingdb.connection.url"));
            Class.forName(SysConfigUtil.getValue("idMappingdb.connection.driver_class")).newInstance();
            String dburl = SysConfigUtil.getValue("idMappingdb.connection.url");
            String dbuser = SysConfigUtil.getValue("idMappingdb.connection.username");
            String dbpassword = SysConfigUtil.getValue("idMappingdb.connection.password");
            if (dburl == null) {
                dburl = "jdbc:mysql://localhost/test";
                dbuser = "root";
                dbpassword = "";
            }

            connection = DriverManager.getConnection(dburl, dbuser, dbpassword);
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
