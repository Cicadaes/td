package td.enterprise.wanalytics.etl.task.tag;


import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.*;
import org.apache.commons.lang.StringUtils;

import td.enterprise.wanalytics.etl.bean.Crowd;
import td.enterprise.wanalytics.etl.bean.CrowdScheduleConfig;
import td.enterprise.wanalytics.etl.common.error.BusinessException;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.jdbc.DbBitmapConn;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;

import td.enterprise.wanalytics.etl.util.*;

import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;

import java.sql.*;
import java.util.*;

/**
 * 根据人群和画像 计算出具体值
 */
@Slf4j
public class GroupTagCountTask {

    private static String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";


    public static void main(String[] args) {
        try {
            Options options = new Options();
            options.addOption("tenantId", "tenantId", true, "租户ID");
            options.addOption("date", "date", true, "运行时间");
            options.addOption("startDate", "startDate", true, "开始日期");
            options.addOption("endDate", "endDate", true, "结束日期");
            options.addOption("projectIds", "projectIds", true, "项目id,逗号分割");

            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String tenantId = line.getOptionValue("tenantId");
            String date = line.getOptionValue("date");
            String startDate = line.getOptionValue("startDate");
            String endDate = line.getOptionValue("endDate");
            String projectIds = line.getOptionValue("projectIds");
            log.info("tenantId is " + tenantId);
            log.info("date is " + date);
            log.info("projectIds is " + projectIds);

            execute(tenantId, projectIds, date,null, null,null,startDate,endDate);

        } catch (Exception e) {
            log.error("GroupTagCountTask： ", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_CONTINUE);
        }
        System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
    }

    /**
     * 待优化，待改为批量提交
     * @param tenantId
     * @param projectIds
     * @param date
     * @param customCrowdId
     * @param projectId
     * @throws SQLException
     */
    public static void execute(String tenantId, String projectIds, String date, Integer customCrowdId,String projectId,Integer execId ,String tStartDate,String tEndDate) throws SQLException {
        List<Crowd> crowdList = queryData(date, tenantId, projectIds,  customCrowdId,projectId,tStartDate,tEndDate);
        if (crowdList == null || crowdList.size() == 0) {
            log.info("人群为空，就不计算了");
            return;
        }

        log.info("查找到人群: size=" + crowdList.size() + ", tenantId =" + tenantId);

        Map<String, String> tagIndexs = new HashMap();
        Connection bitmapConn = null;
        Connection wifiConn = null;
        Statement sql_statement = null;
        ResultSet result = null;
        String query = "select tag_code, tag_value from atomic_cube";

        //维度和人群计算，算出结果计入count表
        try{
            bitmapConn = DbBitmapConn.getConnection();
            wifiConn = DbWifianalyticsConn.getConnection();

            //获取维度
            try {
                sql_statement = bitmapConn.createStatement();
                result = sql_statement.executeQuery(query);

                while (result.next()) {
                    String tagCode = result.getString("tag_code");
                    String tagValue = result.getString("tag_value");
                    tagIndexs.put(tagCode + ":" + tagValue, tagValue);
                }
            }catch (Exception e){
                e.printStackTrace();
            }finally {
                DbCloseUtil.closeAll(result,sql_statement);
            }

            for (Crowd tpc : crowdList) {

                String crowdType = tpc.getCrowdType();
                String startDate = tpc.getStartDate();
                String endDate = tpc.getEndDate();

                //判断人群在指定期间是否有值，如果没有值，进行忽略
                int users =  CubeUtils.queryProjectUserCount(tpc.getProjectId(),crowdType,startDate,endDate,customCrowdId);

                if(users == 0) {
                    log.info("projectId=" + tpc.getProjectId() + " crowdId=" + tpc.getCrowdId() + " startDate=" + startDate + " endDate=" + endDate + " 期间没有客流，忽略计算指标");
                    continue;
                }

                Iterator iter = tagIndexs.entrySet().iterator();

                while (iter.hasNext()) {

                    Map.Entry entry = (Map.Entry) iter.next();
                    String key = (String)entry.getKey();
                    String tagCode = key.split(":")[0];
                    String tagValue = (String)entry.getValue();

                    log.info("开始计算: crowdId=" + tpc.getCrowdId() + ", date=" + date + ", tagCode=" + tagCode + ", tagValue=" + tagValue);

                    Integer count = queryOffsetList(tenantId, tpc.getProjectId(), crowdType, startDate, endDate, tagCode, tagValue,customCrowdId);

                    try {

                        //插入tag_表中，device和tag是两个表 先删后加
                        if(tagCode.equalsIgnoreCase("price") || tagCode.equalsIgnoreCase("standardBrand")){

                        int type;
                        if(tagCode.equalsIgnoreCase("price")){
                            type = 1;
                        }else{
                            type = 2;
                        }
                            sql_statement = wifiConn.createStatement();
                        //TODO  人群构建和普通画像待合并
                        if(customCrowdId != null ){
                            String sql1 = "DELETE from TD_BEHAVIOR_CROWD_RESULT_DEVICE where   project_id=" + tpc.getProjectId() +  " AND exec_id=" + execId + " AND device_attr_type='" + type + "' AND device_attr_name='" + tagValue + "' ;";
                            log.info("删除人群构建sql = " + sql1);
                            String sql = "insert into TD_BEHAVIOR_CROWD_RESULT_DEVICE (tenant_id, project_id, run_date, device_attr_type, device_attr_name, metric_value,exec_id) values(?,?,?,?,?,?,?)";

                            PreparedStatement pstmt = null ;
                            try {
                                sql_statement.execute(sql1);
                                pstmt = wifiConn.prepareStatement(sql);
                                pstmt.setString(1, tenantId);
                                pstmt.setInt(2, tpc.getProjectId());
                                pstmt.setString(3, date);
                                pstmt.setInt(4, type);
                                pstmt.setString(5, tagValue);
                                pstmt.setInt(6, count);
                                pstmt.setInt(7, execId);
                                pstmt.executeUpdate();
                                pstmt.close();
                            } catch (SQLException e) {
                                e.printStackTrace();
                            }finally {
                                DbCloseUtil.closeAll(pstmt);
                            }
                        }else {

                            String sql1 = "DELETE from TD_TENANT_DEVICE_COUNT where tenant_id=" + tenantId + " AND project_id=" + tpc.getProjectId() +  " AND crowd_id=" + tpc.getCrowdId() + " AND device_attr_type='" + type + "' AND device_attr_name='" + tagValue + "' AND run_date='" + date + "';";

                            log.info("删除sql = " + sql1);

                            String sql = "insert into TD_TENANT_DEVICE_COUNT (tenant_id, project_id, crowd_id, run_date, device_attr_type, device_attr_name, metric_value, cycle_statistics, start_date, end_date) values(?,?,?,?,?,?,?,?,?,?)";

                            PreparedStatement pstmt = null ;
                            try {
                                sql_statement.execute(sql1);
                                pstmt = wifiConn.prepareStatement(sql);
                                pstmt.setString(1, tenantId);
                                pstmt.setInt(2, tpc.getProjectId());
                                pstmt.setInt(3, Integer.parseInt(tpc.getCrowdId()));
                                pstmt.setString(4, date);
                                pstmt.setInt(5, type);
                                pstmt.setString(6, tagValue);
                                pstmt.setInt(7, count);
                                pstmt.setInt(8, tpc.getCycleStatistics());
                                pstmt.setString(9, startDate);
                                pstmt.setString(10, endDate);
                                pstmt.executeUpdate();
                            } catch (SQLException e) {
                                e.printStackTrace();
                            }finally {
                                DbCloseUtil.closeAll(pstmt);
                            }
                        }


                    }else{
                        sql_statement = wifiConn.createStatement();
                        //TODO  人群构建和普通画像待合并
                        if(customCrowdId != null ){
                            String sql1 = "DELETE from TD_BEHAVIOR_CROWD_RESULT where tenant_id=" + tenantId + " AND project_id=" + tpc.getProjectId() +  " AND exec_id=" + execId + " AND tag_code='" + tagValue + "' AND tag_name='" + tagCode + "' ;";
                            log.info("删除sql = " + sql1);

                            String sql = "insert into TD_BEHAVIOR_CROWD_RESULT (tenant_id, project_id, run_date, tag_code, tag_name, metric_value, exec_id) values(?,?,?,?,?,?,?)";

                            PreparedStatement pstmt = null;
                            try {
                                sql_statement.execute(sql1);
                                pstmt = wifiConn.prepareStatement(sql);
                                pstmt.setString(1, tenantId);
                                pstmt.setInt(2, tpc.getProjectId());
                                pstmt.setString(3, date);
                                pstmt.setString(4, tagValue);
                                pstmt.setString(5, tagCode);
                                pstmt.setInt(6, count);
                                pstmt.setInt(7, execId);
                                pstmt.executeUpdate();
                                pstmt.close();
                            } catch (SQLException e) {
                                e.printStackTrace();
                            }finally {
                                DbCloseUtil.closeAll(pstmt);
                            }

                        }else{
                            String sql1 = "DELETE from TD_TENANT_TAGS_COUNT where tenant_id=" + tenantId + " AND project_id=" + tpc.getProjectId() +  " AND crowd_id=" + tpc.getCrowdId() + " AND tag_code='" + tagValue + "' AND tag_name='" + tagCode + "' AND run_date='" + date + "';";
                            log.info("删除sql = " + sql1);


                            String sql = "insert into TD_TENANT_TAGS_COUNT (tenant_id, project_id, crowd_id, run_date, tag_code, tag_name, metric_value, cycle_statistics, start_date, end_date) values(?,?,?,?,?,?,?,?,?,?)";

                            PreparedStatement pstmt;
                            try {
                                sql_statement.execute(sql1);
                                pstmt = wifiConn.prepareStatement(sql);
                                pstmt.setString(1, tenantId);
                                pstmt.setInt(2, tpc.getProjectId());
                                pstmt.setInt(3, Integer.parseInt(tpc.getCrowdId()));
                                pstmt.setString(4, date);
                                pstmt.setString(5, tagValue);
                                pstmt.setString(6, tagCode);
                                pstmt.setInt(7, count);
                                pstmt.setInt(8, tpc.getCycleStatistics());
                                pstmt.setString(9, startDate);
                                pstmt.setString(10, endDate);
                                pstmt.executeUpdate();
                                pstmt.close();
                            } catch (SQLException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                    }catch (SQLException e){
                        e.printStackTrace();
                    }finally {
                        DbCloseUtil.closeAll(sql_statement);
                    }
                }
          }
        }catch (SQLException e){
            e.printStackTrace();
        }finally {
            DbCloseUtil.closeAll(bitmapConn,wifiConn);
        }
    }

    /**
     * 此方法和人群构建共用
     * @param runDate
     * @param tenantId
     * @param projectIds
     * @param customCrowdId
     * @return
     */
    public static List<Crowd> queryData(String runDate, String tenantId, String projectIds,Integer customCrowdId, String projectId,String startDate,String endDate) {

        List<Crowd> crowds = new ArrayList<>();

        //人群构建直接返回
        if(null != customCrowdId){
            Crowd crowd = new Crowd();
            crowd.setCrowdType("GU"); //人群构建人群类型
            crowd.setTenantId(tenantId);
            crowd.setProjectId(Integer.parseInt(projectId) );
            crowd.setCrowdId(customCrowdId + "");
            crowds.add(crowd);
            return crowds;
        }

        log.info("Enter queryData, param: runDate=" + runDate + ", tenantId=" + tenantId + ", projectIds=" + projectIds);

        String projectSql = "";

        if(!(projectIds==null || projectIds.equals("null") || projectIds.equals("-1"))){
            projectSql= " and t0.id in (" + projectIds + ") ";
        }

        //如果项目id
        String sql = "select distinct t0.tenant_id,t0.id as project_id ,t1.id as crowd_id,t1.type as crowd_type  from TD_PROJECT t0 ,TD_CROWD t1 where t0.tenant_id = t1.tenant_id  and t0.id = t1.attr1  and t0.tenant_id=" + tenantId + ( projectSql.equals("") ? " and t0.status=1" :  projectSql);

        log.info("查询sql=" + sql);

        List<Map<String, Object>> resultList = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
        for (Map<String, Object> result: resultList) {


            Crowd crowd = new Crowd();
            crowd.setTenantId((String) result.get("tenant_id"));
            Integer project_id = Integer.parseInt(result.get("project_id") + "");
            crowd.setProjectId(project_id);
            crowd.setCrowdId( result.get("crowd_id") + "");
            crowd.setCrowdType((String) result.get("crowd_type"));

            log.info("查找到人群: " + crowd.toString());

            crowds.add(crowd);
        }

        //不是单个任务，需要跑竞品
//        sql = "select distinct t0.tenant_id,t0.id as project_id ,t1.id as crowd_id,t1.type as crowd_type  from TD_PROJECT t0 ,TD_CROWD t1 where t0.tenant_id = t1.tenant_id  and t0.id = t1.attr1  and t0.status = -1 and t0.project_type = -1 and t0.tenant_id=" + tenantId + ;
//        log.info("竞品sql" + sql);
//        resultList = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
//        for (Map<String, Object> result: resultList) {
//
//            Crowd crowd = new Crowd();
//            crowd.setTenantId(result.get("tenant_id") + "");
//            Integer project_id = Integer.parseInt(result.get("project_id") + "");
//            crowd.setProjectId(project_id);
//            crowd.setCrowdId(result.get("crowd_id") + "");
//            crowd.setCrowdType(result.get("crowd_type") + "");
//
//            log.info("查找到竞品人群: " + crowd.toString());
//
//            crowds.add(crowd);
//        }

        String ignoreProjects = HttpUtil.getParamFromConfigServer("azkaban.ignore.projects");

        Map<String, String> ignoreMap = new HashMap<>();
        if (null != ignoreProjects) {
            if (StringUtils.isNotBlank(ignoreProjects)) {
                for (String s : ignoreProjects.split(",")) {
                    if (StringUtils.isNotBlank(s)) {
                        ignoreMap.put(s, s);
                    }
                }
            }
        }

        List<Crowd> crowdList = new ArrayList<>();

        //上个月的时间
        String date = DateUtil.format(DateUtil.addMonth2Date(-1, DateUtil.format(runDate, DateUtil.PATTERN_DATE)), DateUtil.PATTERN_DATE);


       if(StringUtils.isNotBlank(startDate) && StringUtils.isNotBlank(endDate)
            && "-1".equals(startDate) && "-1".equals(endDate)
               ){
           //开始日期
           startDate = DateUtil.getFirstDay(date); //上个月开始日期
           //结束日期
           endDate = DateUtil.getLastDay(date);    //上个月结束日期
       }else{
            //用实际日期进行跑
       }

        for (Crowd tpc : crowds) {
            if (ignoreMap.get(tpc.getProjectId() + "") != null) {
                continue;
            }
            Crowd temp = new Crowd();
            temp.setTenantId(tpc.getTenantId());
            temp.setProjectId(tpc.getProjectId());
            temp.setCrowdId(tpc.getCrowdId());
            temp.setCrowdType(tpc.getCrowdType());
            temp.setCycleStatistics(30);
            temp.setRunDate(runDate);
            temp.setStartDate(startDate);
            temp.setEndDate(endDate);
            crowdList.add(temp);
        }

        return crowdList;
    }

    private static Map<String, CrowdScheduleConfig> queryRule(String tenantId) {

        Map<String, CrowdScheduleConfig> configMap = new HashMap<>();
        Connection conn = null;
        Statement sql_statement = null;
        ResultSet result = null;
        String sql = "select id,tenant_id,project_id,crowd_id,cycle_statistics,cycle,next_exec_time from TD_CROWD_SCHEDULE_CONFIG where tenant_id=" + tenantId;
        try {
            conn = DbWifianalyticsConn.getConnection();
            sql_statement = conn.createStatement();

            log.info("查询sql=" + sql);

            result = sql_statement.executeQuery(sql);
            while (result.next()) {

                CrowdScheduleConfig crowdScheduleConfig = new CrowdScheduleConfig();
                crowdScheduleConfig.setId(result.getInt(("id")));
                crowdScheduleConfig.setTenantId(result.getString("tenant_id"));
                crowdScheduleConfig.setProjectId(result.getString("project_id"));
                crowdScheduleConfig.setCrowdId(result.getString("crowd_id"));
                crowdScheduleConfig.setCycleStatistics(result.getString("cycle_statistics"));
                crowdScheduleConfig.setCycle(result.getString("cycle"));
                crowdScheduleConfig.setNextExecTime(result.getString("next_exec_time"));

                log.info("查找到人群配置信息: " + crowdScheduleConfig.toString());

                configMap.put(result.getString("crowd_id"), crowdScheduleConfig);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            DbCloseUtil.closeAll(result,sql_statement,conn);
        }

        return configMap;
    }

    /**
     * 查询对应标签的结果值
     * @param tenantId
     * @param projectId
     * @param crowdType
     * @param startDate
     * @param endDate
     * @param tagCode
     * @param tagValue
     * @return
     */
    private static Integer queryOffsetList(String tenantId, int projectId, String crowdType, String startDate, String endDate, String tagCode, String tagValue,Integer customCrowdId) {

        String crowdCubeName;

        switch (crowdType){
            case "AU":
                crowdCubeName =  "active_user_day_cube";
                break;
            case "TU":
                crowdCubeName =  "active_user_day_cube";
                break;
            case "OU":
                crowdCubeName = "old_user_day_cube";
                break;
            case "NU":
                crowdCubeName = "new_user_day_cube";
                break;
            case "CU":
                crowdCubeName = "tenant_import_user_cube";
                break;
            case "GU":
                crowdCubeName = "project_custom_group_cube"; //人群构建
                break;
            default:
                crowdCubeName = "";
                break;
        }

        if(StringUtils.isNotEmpty(crowdCubeName)){
            String script = null;
            if("GU".equals(crowdType)){
                script = "r030102=select * from bitmap." + crowdCubeName + " where custom_crowd_id=" + customCrowdId + " and project_id=" + projectId + ";" +
                        "r0721=select * from bitmap.atomic_cube where tenant_id=" + tenantId + " and tag_value='" + tagValue + "' and tag_code='" + tagCode + "';" +
                        "t30157=unite(r030102,r0721);" +
                        "t30157.subkey(0);";
            }else{
                script = "r030102=select * from bitmap." + crowdCubeName + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between '" + startDate + "' and '" + endDate + "';" +
                        "r0721=select * from bitmap.atomic_cube where tenant_id=" + tenantId + " and tag_value='" + tagValue + "' and tag_code='" + tagCode + "';" +
                        "t30157=unite(r030102,r0721);" +
                        "t30157.subkey(0);";
            }

            QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
            Integer result = QueryEngineResultUtil.getDefaultValue(qer);
            return result;
        }else {
            throw new BusinessException("未知人群，crowdType = " + crowdType);
        }

    }

}
