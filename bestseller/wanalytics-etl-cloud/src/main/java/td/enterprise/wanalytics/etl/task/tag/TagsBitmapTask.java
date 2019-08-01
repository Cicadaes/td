package td.enterprise.wanalytics.etl.task.tag;

import com.tenddata.bitmap.util.BitmapUtil;
import it.uniroma3.mat.extendedset.rev157.intset.ConciseSet;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.*;
import com.tenddata.bitmap.Bitmap;
import com.tenddata.bitmap.impl.ConciseBitmapImpl;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.jdbc.DbBitmapConn;
import td.enterprise.wanalytics.etl.util.DbCloseUtil;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

import java.io.*;
import java.sql.*;
import java.util.*;

/**
 * Created by Yan on 2017/4/18.
 */
@Slf4j
public class TagsBitmapTask {

    public static void main(String[] args) {
        try{

            Options options = new Options();
            options.addOption("t", "tenantId", true, "租户id");
            options.addOption("date", true, "时间");
            options.addOption("inputFile", "inputFile", true, "输入文件位置");
            options.addOption("s", "schedulerTaskLogId", true, "定时任务执行id");

            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            int tenantId = Integer.parseInt(line.getOptionValue("tenantId"));
            String date = line.getOptionValue("date");
            String inputFile = line.getOptionValue("inputFile");

            execute(tenantId, date, inputFile);
        }catch (Exception e){
            log.error("",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }



    public static void execute(int tenantId, String date, String inputFile) throws SQLException {

        List<String> tagIndexList = SysConfigUtil.getTagIndex();

        File file = new File(inputFile);
        BufferedReader reader = null;
        FileReader fr = null;
        Connection conn = null;
        try {

            conn = DbBitmapConn.getConnection();
            int i = 0;
            for (String tagIndex: tagIndexList) {
                Statement sql_statement = null;
                //遍历一遍，做一列的所有维度的bitmap
                try {
                    fr = new FileReader(file);
                    reader = new BufferedReader(fr);
                    String tempString = null;
                    Map<String, List<Integer>> tagBitmapInteger = new HashMap<>();

                    while ((tempString = reader.readLine()) != null) {

                        String[] tags = tempString.split(WifipixTaskConstant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
                        if(tags.length != 32) { //tenant_tag_table 用户标签表12列
                            log.error(tempString + "这行数据有问题");
                            break;
                        }

                        //tag表指标从第五列开始
                        String indexValue = tags[i + 4];

                        //应用兴趣爱好，不需要统计没有的
                        if(!(tagIndex.startsWith("0201") && indexValue.equals("-1"))){
                            tagBitmapInteger.putIfAbsent(indexValue, new ArrayList<>());
                            tagBitmapInteger.get(indexValue).add(Integer.parseInt(tags[1])); // tag[1] 是offset所在列
                        }
                    }

                    Iterator iter = tagBitmapInteger.entrySet().iterator();

                    while (iter.hasNext()) {
                        Map.Entry entry = (Map.Entry) iter.next();
                        String k = (String) entry.getKey();
                        List<Integer> v = (List) entry.getValue();

                        log.info("准备写入bitmap: tenantId=" + tenantId + ", tag_code=" + k );

                        Bitmap b = new ConciseBitmapImpl(new ConciseSet().convert(v));


                        //删除后，再写入
                        sql_statement = conn.createStatement();
                        String query = "DELETE from atomic_cube where tenant_id=" + tenantId + " AND tag_code='" + tagIndex + "' AND tag_value='" + k + "'";
                        log.info("删除sql: " + query);


                        String sql = "insert into atomic_cube (tenant_id, tag_code, tag_value, bitmap, update_time) values(?,?,?,?,?)";
                        PreparedStatement pstmt = null;
                        try {
                            sql_statement.execute(query);
                            pstmt = conn.prepareStatement(sql);
                            pstmt.setString(1, tenantId + "");
                            pstmt.setString(2, tagIndex);
                            pstmt.setString(3, k);
                            pstmt.setBytes(4, BitmapUtil.bitmapRequestToByteArray(b));
                            pstmt.setTimestamp(5, new Timestamp(System.currentTimeMillis()));
                            pstmt.executeUpdate();
                            pstmt.close();
                        } catch (SQLException e) {
                            e.printStackTrace();
                        }finally {
                            DbCloseUtil.closeAll(sql_statement,pstmt);
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    FileUtil.close(fr,reader);
                }
                i += 1;
            }
        }catch (Exception e) {
            e.printStackTrace();
        }finally {
            DbCloseUtil.closeAll(conn);
            FileUtil.close(fr,reader);
        }

    }
}
