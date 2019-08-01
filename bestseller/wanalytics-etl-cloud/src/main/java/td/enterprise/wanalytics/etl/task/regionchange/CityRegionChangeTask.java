package td.enterprise.wanalytics.etl.task.regionchange;

import org.apache.commons.cli.*;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.bean.CityRegion;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.util.DbCloseUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

/**
 * Created by pc on 2017/6/30.
 */
public class CityRegionChangeTask {

    private static final Logger logger = Logger.getLogger(CityRegionChangeTask.class);
    private static Connection conn = null;

    public static void main(String[] args) {
        List<CityRegion> returnList = new ArrayList<CityRegion>();
        Options options = new Options();
        options.addOption("o", "oid", true, "订阅ID");
        options.addOption("k", "key", true, "订阅KEY");
        options.addOption("c", "city", true, "城市名称");
        options.addOption("n", "num", true, "线程数");
        CommandLineParser parser = new PosixParser();
        CommandLine line=null;
        try {
            line = parser.parse(options, args);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        String oid = line.getOptionValue("o");
        String key = line.getOptionValue("k");
        String cityName = line.getOptionValue("c");
        String threadNum = line.getOptionValue("n");

        //线程数，默认为5，如果有传入，则取传入线程参数
        int num = 5;

        if(StringUtils.isNotEmpty(threadNum)){
            num = Integer.parseInt(threadNum);
        }

        //得到需要转换的城市坐标数据
        List<CityRegion> regionList = queryCityRegion(cityName);

        //如果需要转换的数据条数小于2000，则将线程数设置为1
        if(regionList.size()<2000){
            num = 1;
        }

        //多线程将百度坐标转换为谷歌坐标
        ExecutorService pool = Executors.newFixedThreadPool(num);
        // 创建多个有返回值的任务
        List<Future<List<CityRegion>>> futureList = new ArrayList<Future<List<CityRegion>>>();

        //每个list大小
        int size = regionList.size()/num+1;
        int n = 0;
        List<CityRegion> list = new ArrayList<CityRegion>();
        for(int i=0;i<regionList.size();i++){
            if(size == n || i == regionList.size()-1){
                n = 0;
                list.add(regionList.get(i));
                Callable c = new CityRegionChangeThread(oid,key,list);
                Future f = pool.submit(c);
                futureList.add(f);
                list = new ArrayList<CityRegion>();
            }else{
                list.add(regionList.get(i));
                n++;
            }
        }

        // 关闭线程池
        pool.shutdown();
        for( Future<List<CityRegion>> future : futureList){
            try {
                List<CityRegion> threadList = future.get();
                returnList.addAll(threadList);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                e.printStackTrace();
            }
        }

        if(returnList.size()>0){
            updateCityRegion(returnList);
            insertCityRegion(cityName);

        }
    }

    public static List<CityRegion> queryCityRegion(String cityName) {
        List<CityRegion> regionList = new ArrayList<CityRegion>();
        Statement statement = null;
        ResultSet result = null;
        try {
            conn = DbWifianalyticsConn.getConnection();
            statement = conn.createStatement();
            String sql = "select id,longitude_bd,latitude_bd from TD_CITY_REGION_TMP where city_name ='"+cityName+"' and (longitude_google is null or latitude_google is null)" ;
            result = statement.executeQuery(sql);
            while (result.next()) {
                CityRegion vo = new CityRegion();
                vo.setId(result.getInt("id"));
                vo.setLongitudeBd(result.getString("longitude_bd"));
                vo.setLatitudeBd(result.getString("latitude_bd"));
                regionList.add(vo);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            DbCloseUtil.closeAll(result,statement,conn);
        }
        return regionList;
    }

    public static void updateCityRegion(List<CityRegion> cityRegionList){
        Statement statement = null;
        ResultSet result = null;
        try {
            conn = DbWifianalyticsConn.getConnection();
            statement = conn.createStatement();
            for(int i=0;i<cityRegionList.size();i++){
                CityRegion vo = cityRegionList.get(i);
                String sql = "update TD_CITY_REGION_TMP set latitude_google='"+vo.getLatitudeGoogle()+"',longitude_google='"+vo.getLongitudeGoogle()+"' where id="+vo.getId();
                statement.addBatch(sql);
            }
           statement.executeBatch();

        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            DbCloseUtil.closeAll(result,statement,conn);
        }
    }

    public static void insertCityRegion(String cityName){
        PreparedStatement pstmt = null;
        try {
            conn = DbWifianalyticsConn.getConnection();
            String sql = "insert into TD_CITY_REGION(city_name,region_name,region_type,longitude_bd,latitude_bd,order_no) select city_name,region_name,region_type,longitude_google,latitude_google,order_no from TD_CITY_REGION_TMP where city_name ='"+cityName+"'";
            pstmt = conn.prepareStatement(sql);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            DbCloseUtil.closeAll(pstmt,conn);
        }
    }
}
