package td.enterprise.wanalytics.etl.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import lombok.extern.slf4j.Slf4j;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

/**
 * <p>Description：UM Connection</p>
 * <p><b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.</b></p>
 * @author liyinglei
 * @version 1.0
 * @date 2017年12月12日下午2:02:01 
 * @since jdk1.7
 */
@Slf4j
public class DbUmConn {

    private static Connection connection;

    private DbUmConn()  {

    }

    public static Connection getConnection() {

        try {
            if(connection == null || connection.isClosed()){
                log.info("创建数据库: " + SysConfigUtil.getValue("um.connection.driver_class") + ";" + SysConfigUtil.getValue("um.connection.url"));
                Class.forName(SysConfigUtil.getValue("um.connection.driver_class")).newInstance();
                String dburl = SysConfigUtil.getValue("um.connection.url");
                String dbuser = SysConfigUtil.getValue("um.connection.username");
                String dbpassword = SysConfigUtil.getValue("um.connection.password");
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

    public static void main(String[] args) {
		System.out.println(DbUmConn.getConnection());
	}

}
