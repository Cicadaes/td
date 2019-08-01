package td.enterprise.wanalytics.etl.task.custom;

import com.tenddata.bitmap.Bitmap;
import com.tenddata.bitmap.util.BitmapUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.cli.*;
import org.apache.log4j.Logger;
import td.enterprise.entity.ProjectTypeEnum;
import td.enterprise.wanalytics.etl.jdbc.DbBitmapConn;
import td.enterprise.wanalytics.etl.task.tag.GroupTagCountTask;
import td.enterprise.wanalytics.etl.util.*;
import td.olap.query.WiFiAnalyticsESQuerService;
import td.olap.query.runscript.bean.EsQueryBean;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CustomGroup {
    public static Logger logger = Logger.getLogger(CustomGroup.class);

   public static  String clusterName = HttpUtil.getParamFromConfigServer("es.cluster.name");
   public static String hosts = HttpUtil.getParamFromConfigServer("es.hosts");

   public  static WiFiAnalyticsESQuerService esQueryService =  null ;

   static {
       try {
           esQueryService = WiFiAnalyticsESQuerService.getInstance(clusterName, hosts);
       }catch(Exception e){
           e.printStackTrace();
       }
   }

    public static void main(String[] args)  throws  Exception{
        int taskId = 0;
        int execId = 0;
        Options options = new Options();
        options.addOption("taskId", "taskId", true, "taskId");
        options.addOption("execId", "execId", true, "execId");
        CommandLineParser parser = new PosixParser();
        CommandLine lines = null;
        try {
            lines = parser.parse(options, args);
            taskId = Integer.parseInt(lines.getOptionValue("taskId"));
            execId = Integer.parseInt(lines.getOptionValue("execId"));
        } catch (ParseException e1) {
            logger.error("参数异常 ");
            System.exit(1);
        }
        long start = System.currentTimeMillis();
        logger.info("人群构建开始....");
        execute(taskId,execId);
        long end = System.currentTimeMillis();
        logger.info("人群构建结束....用时：" + (end - start) / 1000 + " 秒");
    }


    public static void execute(int taskId,int execId)  throws  Exception{
        String sql = "select * from TD_BEHAVIOR_CROWD where id='" + taskId + "'";
        List<Map<String, Object>> queryForList = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
        if (queryForList.isEmpty()) {
            logger.error("<TD_BEHAVIOR_CROWD> SQL=" + sql + "; is Empty");
            System.exit(1);
        }

        Map<String, Object> map = queryForList.get(0);
        String paramJson = (String) map.get("param_json");
        Integer projectId = (Integer) map.get("project_id") ;
        String tenant_id = (String) map.get("tenant_id");

        logger.info("===============param_json=" + paramJson);

        if (paramJson == null || projectId == null || tenant_id == null) {
            logger.error("从数据库TD_BEHAVIOR_CROWD 中读取 id=" + taskId + "取出的字段为空。tenant_id=" + tenant_id + ";projectid=" + projectId + ";param_json=" + paramJson);
            System.exit(1);
        }

        JSONArray fromObject = JSONArray.fromObject(paramJson);

        Bitmap customCrowdBitmap = null;

        //更新人群构建开始日期，结束日期
        String startEndDate = getStartEndDate(fromObject);
        String updateCustomCrowdSql = "update TD_CUSTOM_CROWD set start_date ='" + startEndDate.split("_")[0] + "' ,end_date='" + startEndDate.split("_")[1] + "' where crowd_record_id=" + taskId ;
        logger.info("=========================updateCustomCrowdSql=" + updateCustomCrowdSql);
        QueryUtils.execute(updateCustomCrowdSql,QueryUtils.WIFIANALYTICS_DB);

        //计算出来结果人群
        customCrowdBitmap = getCustomCrowdBitmap(fromObject, projectId, tenant_id);

        logger.info("计算bitmap 结束：计算后bitmap大小是：" + (customCrowdBitmap == null ? 0 :  customCrowdBitmap.cardinary() ));

        logger.info("===========开始计算画像");

        Map customGroupMap = getCustomGroupDataByTaskId(execId);

        int customCrowdId = Integer.parseInt(customGroupMap.get("id").toString());
        String customCrowdName = customGroupMap.get("crowd_name").toString();

        //计算画像，使用bitmap 和 总bitmap 进行运算获取
        saveToDB(customCrowdId,projectId,customCrowdBitmap,customCrowdName);

        GroupTagCountTask.execute(tenant_id ,null,null,customCrowdId, projectId + "",execId,"-1","-1");

//        //更新任务ID
//        sql = "update TD_CUSTOM_CROWD set exec_id=" + execId + " where crowd_record_id=" + taskId;
//
//        QueryUtils.execute(sql,QueryUtils.WIFIANALYTICS_DB);

        //deleteFromDB(execId,projectId);

        logger.info("===========结束计算画像");

    }

     public static void saveToDB(int customCrowdId,int projectId, Bitmap bitmap ,String customCrowdName) throws Exception{
         Connection conn = null;
         Statement sql_statement = null;
         try {

             //删除后，再写入
             conn = DbBitmapConn.getConnection();
             sql_statement = conn.createStatement();
             String deleteSql = "DELETE from project_custom_group_cube where custom_crowd_id=" + customCrowdId  + " and project_id=" + projectId ;
             logger.info("删除sql: " + deleteSql);

             sql_statement.execute(deleteSql);

             String sql = "insert into project_custom_group_cube ( project_id, custom_crowd_id,custom_crowd_name,bitmap,update_time) values(?,?,?,?,?)";
             PreparedStatement pstmt = null;
             try{
                 pstmt = conn.prepareStatement(sql);
                 pstmt.setString(1, projectId + "");
                 pstmt.setString(2, customCrowdId + "");
                 pstmt.setString(3, customCrowdName );
                 pstmt.setBytes(4, BitmapUtil.bitmapRequestToByteArray(bitmap));
                 pstmt.setTimestamp(5, new Timestamp(System.currentTimeMillis()));
                 pstmt.executeUpdate();
             }catch (SQLException e){
                 e.printStackTrace();
             }finally {
                 if (pstmt != null)
                 pstmt.close();
             }
         } catch (SQLException e) {
             e.printStackTrace();
         }finally{
            DbCloseUtil.closeAll(sql_statement,conn);
         }
     }

    /**
     * taskId 代表TD_BEHAVIOR_CROWD id
     * 代表TD_CUSTOM_CROWD crowd_record_id
     * @param execId
     * @return
     */
     public static Map<String,Object> getCustomGroupDataByTaskId(int execId){
           Map<String,Object> map = null;
           String sql = "select crowd_name, project_id, id from TD_CUSTOM_CROWD where exec_id=" + execId ;
           map = QueryUtils.querySingle(sql,QueryUtils.WIFIANALYTICS_DB);
           return map;
     }

    /**
     * 递归计算结果
     *
     * @param jsonArray
     * @param project_id
     * @param tenant_id
     * @return
     */
    private static Bitmap getCustomCrowdBitmap(JSONArray jsonArray, Integer project_id, String tenant_id) {
        int size = jsonArray.size();
        TempBitmap [] tempBitmapArry = new TempBitmap [ size] ;//申请这么多个临时空间bitmap ，来做运算

        //获取每一层计算结果，然后再交集或者并集，最终把结果返回临时Bitmap
        for (int i = 0; i< size; i ++  ) {

            JSONObject jsonObject =  jsonArray.getJSONObject(i);
            JSONObject rule = JSONObject.fromObject(jsonObject);

            //group/data
            if (rule.get("group") != null) {
                Object group = rule.get("group");
                JSONArray fromGroup = JSONArray.fromObject(group);
                //递归
                Bitmap tempBitmap = getCustomCrowdBitmap(fromGroup, project_id, tenant_id);
                String operator = rule.getString("operator");
                TempBitmap temp = new TempBitmap();
                temp.setBitmap(tempBitmap);
                temp.setOperator(operator);
                tempBitmapArry[i] = temp; //设置临时bitmap

            } else if (rule.get("data") != null) {

                String ruleType = (String) rule.get("ruleType");

                Object data = rule.get("data");
                String type = (String) rule.get("operator");
                JSONObject dataobj = JSONObject.fromObject(data);

                if (ruleType.equals("firstActiveDate")) {
                    String startDate = (String) dataobj.get("startDate");
                    String endDate = (String) dataobj.get("endDate");
                    //查询这段时间内的到访人数
                    Bitmap activeUserBitmap = getActiveBitmap(project_id,startDate,endDate);
                    String operator = rule.getString("operator");
                    if (activeUserBitmap == null || activeUserBitmap.cardinary() == 0) {
                        logger.warn("计算结果为空,直接退出");
                        System.exit(2);
                    }else {
                        logger.warn("到访客流大小是：" + activeUserBitmap.cardinary());
                    }
                    TempBitmap temp = new TempBitmap();
                    temp.setBitmap(activeUserBitmap);
                    temp.setOperator(operator);
                    tempBitmapArry[i] = temp; //设置临时bitmap

                } else {
                    String roomEnterType = (String) dataobj.get("roomEnterType");//enter,stay
                    String operator = rule.getString("operator");
                    String projectId = (String) dataobj.get("roomId");
                    String compareType = (String) dataobj.get("compareType");
                    String projectType = (String) dataobj.get("projectType");
                    String times = (String) dataobj.get("times");// 次数或者停留
                    String startDate = (String) dataobj.get("startDate");
                    String endDate = (String) dataobj.get("endDate");
                    Bitmap tempBitmap = queryBitmap(projectId, startDate, endDate, roomEnterType, Integer.parseInt(times), compareType, Integer.parseInt(projectType));
                    TempBitmap temp = new TempBitmap();
                    temp.setBitmap(tempBitmap);
                    temp.setOperator(operator);
                    tempBitmapArry[i] = temp; //设置临时bitmap

                }
            }
        }

        Bitmap bitmap = null;
        if(size > 0){
            bitmap =  tempBitmapArry[0].getBitmap();
        }
        //对数组和下一个进行And or 运算
        for (int i = 1; i< size; i ++  ) {
                Bitmap tempBitmap = tempBitmapArry[i].getBitmap();
                String operator = tempBitmapArry[i].getOperator();
                if(null != tempBitmap && null != bitmap){
                     if("AND".equals(operator)){
                         bitmap = bitmap.and(tempBitmap);
                     }else  if("OR".equals(operator)){
                         bitmap = bitmap.or(tempBitmap);
                     }
                }
        }
        return bitmap;
    }

    /**
     * 查询到访用户
     * @param projectId
     * @param startDate
     * @param endDate
     * @return
     */
    public  static Bitmap getActiveBitmap(int projectId,String startDate,String endDate){
        EsQueryBean query = new EsQueryBean();
        //TODO 改动ES配置，改为
        query.setDbName("wifianalytics");
        query.setTypeName("log_es");
        query.setIndex("tenant_offset");
        query.setProjectId(projectId + "");
        long startLong = DateUtil.format(startDate,DateUtil.PATTERN_DATE).getTime();
        long endLong = DateUtil.format(endDate,DateUtil.PATTERN_DATE).getTime();
        query.setStartDate(startLong + "");
        query.setEndDate(endLong + "");
        String redisHosts = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_SENTINELS_KEY);
        String masterName = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_MASTER);
        byte[] bytes = esQueryService.queryBitmap(query,redisHosts,masterName);
        if(bytes == null){
            logger.info("查询到bitmap为空！");
        }
        Bitmap bitmap = BitmapUtil.byteArrayToBitmapRequest(bytes);
        return bitmap;
    }

    /**
     * 查询到访次数，和停留时长Bitmap，包括店组的
     * @param projectId
     * @param startDate
     * @param endDate
     * @return
     */
    public  static Bitmap queryBitmap(String projectId,String startDate,String endDate,String enterType,int times,String compareType,int projectType){
        EsQueryBean query = new EsQueryBean();
        query.setDbName("wifianalytics");
        query.setTypeName("log_es");
        query.setIndex("tenant_offset");
        //如果是店组，用店组下子店铺进行计算
        //TODO 判断店组是否单独计算了客流
        if(projectType == ProjectTypeEnum.PROJECT_GROUP.getCode()){
            List<String> list = new ArrayList<String>();
            list = queryChildrenByParam( projectId,list);
            query.setProjectIds(list);
        }else{
            query.setProjectId(projectId );
        }

        if(enterType.equals("enter")){ //进店次数
            query.setEventCount(times + "");
            if("大于".equals(compareType)){
                query.setRelatetionship("gt");
            } else if("等于".equals(compareType)){
                query.setRelatetionship("eq");
            } else  if("小于".equals(compareType)){
                query.setRelatetionship("lt");
            }else {
                throw new RuntimeException( "不兼容的比较符");
            }
        }else  if(enterType.equals("stay")){ //停留时间
            if("大于".equals(compareType)){
               query.setMinDuration(times + "");
               query.setHasMin(false);
            } else if("等于".equals(compareType)){
                query.setMinDuration(times + "");
                query.setMaxDuration(times + "");
                query.setHasMin(true);
                query.setHasMax(true);
            } else  if("小于".equals(compareType)){
                query.setMaxDuration(times + "");
                query.setHasMax(false);
            }else {
                throw new RuntimeException( "不兼容的比较符");
            }
        }
        long startLong = DateUtil.format(startDate,DateUtil.PATTERN_DATE).getTime();
        long endLong = DateUtil.format(endDate,DateUtil.PATTERN_DATE).getTime();
        query.setStartDate(startLong + "");
        query.setEndDate(endLong + "");
        String redisHosts = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_SENTINELS_KEY);
        String masterName = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_MASTER);
        byte[] bytes = esQueryService.queryBitmap(query,redisHosts,masterName);
        Bitmap bitmap = BitmapUtil.byteArrayToBitmapRequest(bytes);
        return bitmap;
    }


    /**
     * 查询店组下的店铺
     * @param projectId
     * @return
     */

    public static  List<String> queryChildrenByParam(String projectId, List<String> list) {
        String sql = " SELECT  id    FROM TD_PROJECT   where    id IN (SELECT project_id FROM TD_PROJECT_RELATION WHERE project_parent_id = " + projectId +") and status = 1 and project_type=2";
        List<Map<String,Object>>  listMap = QueryUtils.query(sql,QueryUtils.WIFIANALYTICS_DB);
        if (listMap != null && listMap.size() > 0) {
            for (Map<String,Object> map : listMap) {
                if (!  list.contains(map.get("id") + "")) {
                    list.add(map.get("id") + "");
                    queryChildrenByParam(map.get("id") + "", list);
                }
            }
        }
        return list;
    }

    /**
     * 获取开始结束日期 中间用下划线分割
     * @param jsonArray
     * @return
     */
    public static String getStartEndDate(JSONArray jsonArray){
        int size = jsonArray.size();

        //获取每一层计算结果，然后再交集或者并集，最终把结果返回临时Bitmap
        for (int i = 0; i< size; i ++  ) {

            JSONObject jsonObject =  jsonArray.getJSONObject(i);
            JSONObject rule = JSONObject.fromObject(jsonObject);

            if (rule.get("data") != null) {
                String ruleType = (String) rule.get("ruleType");
                Object data = rule.get("data");
                JSONObject dataobj = JSONObject.fromObject(data);
                if (ruleType.equals("firstActiveDate")) {
                    String startDate = (String) dataobj.get("startDate");
                    String endDate = (String) dataobj.get("endDate");
                    return startDate  + "_" + endDate ;
                }
            }
        }

        return null;
    }

}
