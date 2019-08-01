package td.enterprise.wanalytics.etl.task;

import com.tenddata.bitmap.Bitmap;
import com.tenddata.bitmap.impl.ConciseBitmapImpl;
import com.tenddata.bitmap.util.BitmapUtil;
import it.uniroma3.mat.extendedset.rev157.intset.ConciseSet;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.jdbc.DbBitmapConn;
import td.enterprise.wanalytics.etl.util.CubeUtils;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.DbCloseUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.sql.*;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 迁移Bitmap中对应offset
 */
public class MigrateCubeTask {

    private static final Logger logger = Logger.getLogger(MigrateCubeTask.class);

    public static void main(String[] args)  {
        try {
            Options options = new Options();
            options.addOption("startDate", "startDate", true, "开始日期");
            options.addOption("endDate", "endDate", true, "结束日期");
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String startDate = line.getOptionValue("startDate");
            String endDate = line.getOptionValue("endDate");
            logger.info("startDate=" + startDate + " endDate=" + endDate );
            long begin = System.currentTimeMillis();
            execute(startDate,endDate);

            long end = System.currentTimeMillis();
            logger.info("----MigrateCubeTask Task is over. Used Time :" + (end - begin) / 1000 + " seconds.");
        }catch (Exception e){
            logger.error("迁移Offset：",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    /**
     * 迁移
     * @param startDate
     * @param endDate
     */
    public static void execute(String startDate,String endDate){
        //查询每个项目
        String sql = "select TABLE_NAME from information_schema.`TABLES` t0 where t0.TABLE_SCHEMA='wifianalytics_user' and TABLE_NAME like 'project_%'";
        List<Map<String,Object>> projectUserTableList = QueryUtils.query(sql,QueryUtils.USER_DB);
        int size = projectUserTableList.size();
        logger.info("User表个数是：" + size);
        for(String tempDate=startDate;tempDate.compareTo(endDate) <= 0; ){
           logger.info("开始迁移日期：" + tempDate);
           long start = System.currentTimeMillis();
           int count = 0;
            for(Map<String,Object> map:projectUserTableList){
                String tableName = map.get("TABLE_NAME") + "";
                rebuildBitmap(tableName,tempDate);
                count ++;
                logger.info("=====================================progress==" + count + "/" + size  + "  date=" + tempDate);
            }
           long end = System.currentTimeMillis();
           logger.info("结束迁移日期：" + tempDate);
           Date date = DateUtil.format(tempDate,DateUtil.PATTERN_DATE);
           Date nextDate=  DateUtil.getCalculateDay(date,1);
           tempDate = DateUtil.format(nextDate, DateUtil.PATTERN_DATE);
        }
    }

    /**
     *active_user_day_cube,
     *old_user_day_cube
     *new_user_day_cube
//     *tenant_import_user_cube
     * @param projectName
     */
    private static void rebuildBitmap(String projectName,String date){
        String [] keys = projectName.split("_");
        String projectId = keys[2];
        String tenantId = keys [1];
        String  crowdType ="AU";
        String  cubeName = "active_user_day_cube";
        rebuildBitmap(tenantId,projectId,date,crowdType,cubeName);

         crowdType ="NU";
        cubeName = "new_user_day_cube";
        rebuildBitmap(tenantId,projectId,date,crowdType,cubeName);

        crowdType ="OU";
        cubeName = "old_user_day_cube";
        rebuildBitmap(tenantId,projectId,date,crowdType,cubeName);
    }

    private static void rebuildBitmap(String tenantId,String projectId,String date,String crowdType,String cubeName){
        List<Integer> projectOffsetList = CubeUtils.queryOffsetList(projectId,crowdType,date,date);
        if(null == projectOffsetList || projectOffsetList.isEmpty()){
            return;
        }
        List<String>  projectMacList = CubeUtils.getMacFromProjectOffset(tenantId,projectId,projectOffsetList);
        List<Integer> tenantOffsetList = CubeUtils.getOffsetFromMac(tenantId,projectMacList);
        Connection conn =  null;
        try{
            conn = DbBitmapConn.getConnection();
            Bitmap btimap = new ConciseBitmapImpl(new ConciseSet().convert(tenantOffsetList));
            Statement sql_statement = null;
            sql_statement = conn.createStatement();
            String deleteSql = "delete from " + cubeName + " where tenant_id='" + tenantId + "' AND project_id=" + projectId + " AND `date`='" + date + "' ";
            logger.info("删除sql: " + deleteSql);
            String sql = "insert into " + cubeName + " (tenant_id, project_id, date, bitmap, update_time) values(?,?,?,?,?)";
            PreparedStatement pstmt = null;
            try {
                sql_statement.execute(deleteSql);
                pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, tenantId + "");
                pstmt.setString(2, projectId);
                pstmt.setString(3, date);
                pstmt.setBytes(4, BitmapUtil.bitmapRequestToByteArray(btimap));
                pstmt.setTimestamp(5, new Timestamp(System.currentTimeMillis()));
                pstmt.executeUpdate();
                pstmt.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }finally {
                DbCloseUtil.closeAll(sql_statement,pstmt);
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            try{
                if(null != conn){
                    conn.close();
                }
            }catch (Exception e){}
        }
    }


}
