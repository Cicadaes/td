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
public class MigrateCustomerCubeTask {

    private static final Logger logger = Logger.getLogger(MigrateCustomerCubeTask.class);

    public static void main(String[] args)  {
        try {
            long begin = System.currentTimeMillis();
            rebuildCustomerGroup();
            long end = System.currentTimeMillis();
            logger.info("----MigrateCubeTask Task is over. Used Time :" + (end - begin) / 1000 + " seconds.");
        }catch (Exception e){
            logger.error("迁移Offset：",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    /**
     *
     */
    private static void rebuildCustomerGroup(){
        String sql = "select tenant_id ,project_id,crowd_id,date from tenant_import_user_cube ";
        List<Map<String,Object>> mapList = QueryUtils.query(sql,QueryUtils.BITMPA_DB);
        for(Map<String,Object> map : mapList){
            String tenantId = map.get("tenant_id") + "";
            String projectId = map.get("project_id") + "";
            String crowdId = map.get("crowd_id") + "";
            String date = map.get("date") + "";
            List<Integer> projectOffsetList = CubeUtils.queryCustomerOffsetList(projectId,crowdId,date,date);
            List<String>  projectMacList = CubeUtils.getMacFromOffset(tenantId,projectOffsetList);
            List<Integer> tenantOffsetList = CubeUtils.getOffsetFromMac(tenantId,projectMacList);
            Connection conn =  null;
            try{
                conn = DbBitmapConn.getConnection();
                Bitmap btimap = new ConciseBitmapImpl(new ConciseSet().convert(tenantOffsetList));
                Statement sql_statement = null;
                sql_statement = conn.createStatement();
                String deleteSql = "DELETE from tenant_import_user_cube where tenant_id='" + tenantId + "' AND project_id='" + projectId + "' AND `date`='"+ date  + "' and crowd_id=" + crowdId;
                logger.info("删除sql: " + deleteSql);
                String bitmapSql = "insert into tenant_import_user_cube (tenant_id, project_id, date,crowd_id, bitmap, update_time) values(?,?,?,?,?,?)";
                PreparedStatement pstmt = null;
                try {
                    sql_statement.execute(deleteSql);
                    pstmt = conn.prepareStatement(bitmapSql);
                    pstmt.setString(1, tenantId + "");
                    pstmt.setString(2, projectId);
                    pstmt.setString(3, date);
                    pstmt.setString(4, crowdId);
                    pstmt.setBytes(5, BitmapUtil.bitmapRequestToByteArray(btimap));
                    pstmt.setTimestamp(6, new Timestamp(System.currentTimeMillis()));
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
}
