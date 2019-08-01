package td.enterprise.wanalytics.etl.task.projecttracks;

import org.apache.commons.cli.*;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;
import td.olap.query.utils.QueryServiceUtils;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.List;
import java.util.Map;

/**
 * Created by pc on 2017/7/21.
 */
public class ProjectTracksOffset {

    public static Logger logger = Logger.getLogger(ProjectTracksTask.class);

    public static void main(String[] args) throws ParseException {
        Options options = new Options();
        options.addOption("analysissId", "analysissId", true, "创建的分析任务ID");
        options.addOption("outputFile", "outputFile", true, "输出文件路径");
        CommandLineParser parser = new PosixParser();
        CommandLine line = parser.parse(options, args);
        String inputFile = line.getOptionValue("outputFile");
        String analysissId = line.getOptionValue("analysissId");
        execute(analysissId,inputFile);
    }

    public static Boolean execute(String analysissId,String outputFile) {
        //通过关联分析任务拿到选中的人群ID
        String crowdId = getCrowdId(analysissId);
        //通过人群ID拿到offset
        String script = "r30223=select * from bitmap.project_custom_group_cube  where custom_crowd_id ="
                + crowdId + "; r30223.results[0].value.toArray();";
        String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
        List<Integer> offsetList = QueryServiceUtils.invokeForOffset("post", queryUrl, script);
        //将offset写入到文件，供后续创建hive表使用
        writeToFile(outputFile,offsetList);
        return true;
    }

    /**
     * 写入到文件中
     * @param offsetList
     */
    public static void writeToFile(String outputFile,List<Integer> offsetList){
        BufferedWriter bw = null;
        FileWriter fw = null;
        try {
            fw = new FileWriter(outputFile);
            bw = new BufferedWriter(fw);
            int i = 0;
            if(null != offsetList){
                for(Integer offset : offsetList){
                    bw.append(offset+"");
                    bw.append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
                    i ++ ;
                    if(i % 1000 ==0 ){
                        bw.flush();
                    }
                }
            }
            bw.flush();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            FileUtil.close(bw,fw);
        }
    }

    public static String getCrowdId(String analysissId){
        String sql = "select analysiss_crowd_id from TD_RELEVANCY_ANALYSISS where id = '"+analysissId+"'" ;
        Map<String,Object> result = QueryUtils.querySingle(sql.toString(), QueryUtils.WIFIANALYTICS_DB);
        return String.valueOf(result.get("analysiss_crowd_id"));
    }
}
