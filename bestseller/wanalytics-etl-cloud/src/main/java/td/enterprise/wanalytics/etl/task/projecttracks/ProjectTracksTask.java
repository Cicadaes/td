package td.enterprise.wanalytics.etl.task.projecttracks;

import org.apache.commons.cli.*;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.bean.EsLogBean;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by pc on 2017/7/20.
 */
public class ProjectTracksTask {

    public static Logger logger = Logger.getLogger(ProjectTracksTask.class);

    public static void main(String[] args) throws ParseException {
        Options options = new Options();
        options.addOption("inputFile", "inputFile", true, "输入文件");
        options.addOption("analysissId", "analysissId", true, "创建的分析任务ID");
        CommandLineParser parser = new PosixParser();
        CommandLine line = parser.parse(options, args);
        String inputFile = line.getOptionValue("inputFile");
        String analysissId = line.getOptionValue("analysissId");
        execute(analysissId,inputFile);
        logger.info("ProjectTracksTask...顺序生成用户轨迹文件成功");
    }

    public static Boolean execute(String analysissId,String inputFile) {

        //得到需要计算上下游的店铺ID
        Map<String,Integer> projectIdMap = getProjectIdMap(analysissId);
        List<EsLogBean> list = getListByFile(inputFile+"/000000_0");
        //将最终结果放MAP中
        Map<String,Long> map = new HashMap<String,Long>();
        for (int i = 0; i < list.size() - 1; i++) {
            EsLogBean bean = list.get(i);
            EsLogBean nextBean = list.get(i + 1);
            if (projectIdMap.containsKey(bean.getProjectId()) && projectIdMap.containsKey(nextBean.getProjectId()) && bean.getTenantId().equals(nextBean.getTenantId()) && bean.getTenantOffset().equals(nextBean.getTenantOffset()) && bean.getTsReceive().equals(nextBean.getTsReceive())) {
                //将一个用户在一个店铺多次停留过滤掉
                if(!bean.getProjectId().equals(nextBean.getProjectId())){
                    String key=bean.getTenantId()+","+bean.getProjectId()+","+nextBean.getProjectId()+","+bean.getTsReceive();
                    if(map.get(key)==null){
                        map.put(key,1L);
                    }else{
                        map.put(key,map.get(key)+1);
                    }
                }
            }
        }
        insertData(analysissId,map);
        updateStatus(analysissId);
        return true;
    }

    private static Map<String,Integer> getProjectIdMap(String id){
        Map<String,Integer> map = new HashMap<String,Integer>();
        String sql  = "select analysiss_project_ids from TD_RELEVANCY_ANALYSISS where id = '"+id+"'" ;
        Map<String,Object> result = QueryUtils.querySingle(sql.toString(), QueryUtils.WIFIANALYTICS_DB);
        String projectIds = (String)result.get("analysiss_project_ids");
        String [] projectIdArr = projectIds.split(",");
        for(String projectId : projectIdArr){
            map.put(projectId,1);
        }
        return map;
    }

    public static List<EsLogBean> getListByFile(String inputFile){
        BufferedReader br = null;
        //将文件内容读取到List
        List<EsLogBean> list = new ArrayList<EsLogBean>();
        try {
            br = new BufferedReader(new FileReader(inputFile));
            String line = br.readLine();
            while (null != line) {
                String[] strs = line.split(",");
                EsLogBean bean = new EsLogBean();
                bean.setTenantId(strs[0]);
                bean.setProjectId(strs[1]);
                bean.setTenantOffset(strs[2]);
                bean.setTsReceive(strs[3]);
                bean.setSessionId(Long.parseLong(strs[4]));
                list.add(bean);
                line = br.readLine();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            try {
                br.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return list;
    }

    private static void insertData(String analysissId, Map<String,Long> map) {
        StringBuilder sql = new StringBuilder();
        sql.append("insert ignore into offline_stay_user_project_tracks_counter(analysiss_id,tenant_id,up_project_id,down_project_id,date,metric_value) values");
        for(String key : map.keySet()){
            String[] strArr = key.split(",");
            sql.append("("+analysissId).append(",").append(strArr[0]).append(",").append(strArr[1]).append(",").append(strArr[2]).append(",'").append(strArr[3]).append("',").append(map.get(key)+"),");
        }
        if(map.size()>0){
            String sqlStr = sql.substring(0,sql.length()-1);
            QueryUtils.execute(sqlStr, QueryUtils.COUNTER_DB);
        }
    }

    private static void updateStatus(String analysissId){
        String sql = "update TD_RELEVANCY_ANALYSISS set status=2 where id = '"+analysissId+"'" ;
        QueryUtils.execute(sql, QueryUtils.WIFIANALYTICS_DB);
    }
}
