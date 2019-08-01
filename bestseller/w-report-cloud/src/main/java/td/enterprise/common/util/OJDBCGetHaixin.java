package td.enterprise.common.util;

import lombok.extern.slf4j.Slf4j;

import java.sql.*;
@Slf4j
public class OJDBCGetHaixin {

    private static Connection conn = null;
    private static Statement statm = null;
    private static String url = "10.19.32.240:1521:cis";
    private static String username = "CIS_READONLY_O2O";
    private static String password = "Hxo2o_2017";
//	private static String tablename = "FOR_O2O_CIP_SHOP";

    public OJDBCGetHaixin() throws Exception {
        Class.forName("oracle.jdbc.driver.OracleDriver");
        conn = DriverManager.getConnection("jdbc:oracle:thin:@" + url, username, password);
        log.info("连接成功！");//暂时不使用log4j
        statm = conn.createStatement();
    }

    public ResultSet selectsql(String sql) throws SQLException {
        ResultSet executeQuery = statm.executeQuery(sql);
        return executeQuery;
    }

    /**
     * 返回13个字段，逗号分隔
     *
     * @param code
     * @return
     * @throws SQLException
     */
    public String selectprojectbyshopcode(String code) throws SQLException {
        String sql = "select SHOP_CODE,SHOP_SHORT_NAME,SHOP_MARKET_LEVEL,CUST_FULL_NAME,SHOP_PROVINCE,SHOP_CITY,SHOP_COUNTY,SHOP_TOWN,MARKET_CENTER,FRIDGE_ORG,AC_ORG,TV_ORG,PHONE_ORG from FOR_O2O_CIP_SHOP where SHOP_CODE='" + code + "'";
        ResultSet executeQuery = statm.executeQuery(sql);
        executeQuery.next();
        String re = "";
        for (int i = 1; i <= 13; i++) {
            String object = (String) executeQuery.getObject(i);
            re += object;
            if (i != 13) {
                re += ",";
            }
        }
        log.info(re);//暂时不使用log4j
        return re;
    }

    public void close() throws SQLException {
        conn.close();
        statm.close();
        log.info("连接关闭！");
    }
}
