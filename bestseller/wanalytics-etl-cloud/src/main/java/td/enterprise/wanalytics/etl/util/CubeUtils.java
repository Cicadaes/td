package td.enterprise.wanalytics.etl.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;

import td.enterprise.wanalytics.etl.bean.MacOffset;
import td.olap.query.WiFiAnalyticsQuerService;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;

import java.util.*;

/**
 * Bitmap 查询公共类
 */
@Slf4j
public class CubeUtils {

    /**
     * 查询项目人群offset
     * @param projectIds
     * @param crowdType
     * @param startDate
     * @param endDate
     * @return
     */
    public static List<Integer> queryOffsetList( String projectIds, String crowdType, String startDate, String endDate) {
        String cube = "";
        switch (crowdType.toUpperCase()) {
            case "AU":
                cube = "active_user_day_cube";
                break;
            case "OU":
                cube = "old_user_day_cube";
                break;
            case "NU":
                cube = "new_user_day_cube";
                break;
            case "CU":
                cube = "tenant_import_user_cube";
                break;
            case "TU":
                cube = "active_user_day_cube";
                break;
            default:
                log.error("projectId=" + projectIds + " 有人群类型是空的数据，忽略执行!");
                break;
        }
        String script = null;
        script = "r30223=select * from bitmap." + cube + " where project_id in ("
                    + projectIds + ") and date between " + startDate + " and " + endDate + "; r30223.results[0].value.toArray();";
        String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
        List<Integer>  list = QueryServiceUtils.invokeForOffset("post", queryUrl, script);
        if(null != list){
            log.info("queryEngine-result:" + Arrays.toString(list.toArray()));
        }
        return list ;
    }


    /**
     * 查询项目人群offset
     * @param projectIds
     * @param startDate
     * @param endDate
     * @return
     */
    public static List<Integer> queryCustomerOffsetList( String projectIds,String crowdId, String startDate, String endDate) {
        String script = null;
        script = "r30223=select * from bitmap.tenant_import_user_cube where project_id in ("
                + projectIds + ") and date between " + startDate + " and " + endDate + " and crowd_id= " + crowdId + " ; r30223.results[0].value.toArray();";
        String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
        List<Integer>  list = QueryServiceUtils.invokeForOffset("post", queryUrl, script);
        if(null != list){
            log.info("queryEngine-result:" + Arrays.toString(list.toArray()));
        }
        return list ;
    }

    /**
     * 查询有值的项目列表
     * @param start
     * @param end
     * @return
     */
    public static Map<String,Integer> queryProjectUserMap( String start, String end,String projectIds) {
        String script = "r30223=select * from bitmap.active_user_day_cube where   date between " + start + " and " + end
                + "  group by project_id;";
        if(StringUtils.isNotBlank(projectIds) && !"-1".equals(projectIds) ){
            script = "r30223=select * from bitmap.active_user_day_cube where   date between " + start + " and " + end  + " and project_id in (" + projectIds +")"
                    + "  group by project_id;";
        }
        String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
        QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
        Map<String, Integer> resultList = getMapValue1(qer, script);
       return resultList ;
    }

    private static Map<String, Integer> getMapValue1(QueryEngineResult qer, String sql) {
        Map<String, Integer> resultMap = new LinkedHashMap<>();
        if (qer != null) {
            List<ResultBean> results = qer.getResults();
            if(null != results){
                for (ResultBean resultBean : results) {
                    resultMap.put(resultBean.getKey(),resultBean.getValue() != null ? Integer.valueOf(resultBean.getValue().toString()) : 0);
                }
            }
        }
        String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
        log.info("queryEngine-params: " + queryUrl + " sql: " + sql);
        log.info("queryEngine-result:" + resultMap);
        return resultMap;
    }

    /**
     * 查询项目到访人数
     * @param projectId
     * @param startDate
     * @param endDate
     * @return
     */
    public static Integer queryProjectUsers(int projectId,String startDate,String endDate){
        String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
        String script = "r030102=select * from bitmap.active_user_day_cube where project_id="  + projectId + "   and date between '" + startDate + "' and '" + endDate + "';" +
                "r030102.subkey(0);";
        QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
        Integer result = QueryEngineResultUtil.getDefaultValue(qer);
        return result;
    }
    
    /**
     * 查询项目到访人数
     * @param projectId
     * @param startDate
     * @param endDate
     * @return
     */
    public static Map<String,Integer> queryProjectUsersBatch(List<String> list,String startDate,String endDate){
    	int pageSize = 1000;
    	Map<String,Integer> result = new HashMap<String,Integer>();
    	List<List<String>> splitList = ListUtils.splitList(list, pageSize);
    	for (List<String> plist : splitList) {
    		String[] projectIds = (String[]) plist.toArray(new String[1]);
    		String projectIdIn = StringUtils.join(projectIds, ',');
	        String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
	        String script = "r030102=select * from bitmap.active_user_day_cube where project_id in ("  + projectIdIn + ") and date between '" + startDate + "' and '" + endDate + "' group by project_id;" +
	                "r030102.subkey(0);";
	        QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
	        Map<String,Integer> map = QueryEngineResultUtil.getKeysValues(qer);
			result.putAll(map);
		}
	    return result;
    }


    /**
     * 查询项目到访人数
     * @param projectId
     * @param startDate
     * @param endDate
     * @return
     */
    public static Integer queryProjectUserCount(int projectId,String crowdType,String startDate,String endDate,Integer customCrowdId ){
        String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
        String crowdCubeName ="";

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
        String script = "r030102=select * from bitmap." + crowdCubeName + " where project_id="  + projectId + "   and date between '" + startDate + "' and '" + endDate + "';" +
                "r030102.subkey(0);";
        if("GU".equals(crowdType)){
            script = "r030102=select * from bitmap." + crowdCubeName + " where custom_crowd_id="  + customCrowdId + ";" +
                    "r030102.subkey(0);";
        }
        QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
        Integer result = QueryEngineResultUtil.getDefaultValue(qer);
        return result;
    }

    /**
     * 获取最近有数据的日期
     * @param projectId
     * @return
     */
    public static String findLastDataDate(int projectId){
        String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") ;
        WiFiAnalyticsQuerService queryService = WiFiAnalyticsQuerService.getInstance(queryUrl);
        String date =  WiFiAnalyticsQuerService.findLastData(projectId);
        return date;
    }


    /**
     * 根据offset 获取mac地址
     * @param tenantId
     * @param offsetList
     * @return
     */
    public static List<String>  getMacFromProjectOffset(String tenantId,String projectId,List<Integer> offsetList ){
        if(null == offsetList){
            return new ArrayList<String>();
        }
        List<String> resultList = new ArrayList<String> ();
        //进行分小list 分组查询
        List<List<Integer>> smallList=   ListUtils.splitList(offsetList, 500);
        for(List<Integer> list : smallList){
            resultList.addAll(queryProjectMacList(tenantId,Integer.parseInt(projectId),list));
        }
        return resultList;
    }

    /**
     * 根据offset 获取mac地址
     * @param tenantId
     * @param offsetList
     * @return
     */
    public static List<String>  getMacFromOffset(String tenantId,List<Integer> offsetList ){
        if(null == offsetList){
            return new ArrayList<String>();
        }
        List<String> resultList = new ArrayList<String> ();
        //进行分小list 分组查询
        List<List<Integer>> smallList=   ListUtils.splitList(offsetList, 500);
        for(List<Integer> list : smallList){
            resultList.addAll(queryMacList(tenantId,list));
        }
        return resultList;
    }

    /**
     * 根据mac获取offset
     * @param tenantId
     * @param macList
     * @return
     */
    public static List<Integer>  getOffsetFromMac(String tenantId,List<String> macList ){
        if(null == macList){
            return new ArrayList<Integer>();
        }
        List<Integer> resultList = new ArrayList<Integer> ();
        //进行分小list 分组查询
        List<List<String>> smallList=   ListUtils.splitList(macList, 500);
        for(List<String> list : smallList){
            resultList.addAll(queryOffsetList(tenantId,list));
        }
        return resultList;
    }

    public static List<Integer> queryOffsetList(String tenantId,List<String> offsetList){
        if(null == offsetList){
            return null;
        }
        StringBuffer  macStr = new StringBuffer("");
        int size = offsetList.size();
        for(int i =0;i<size;i ++){
            if(i == 0) {
                macStr.append("'" ).append(offsetList.get(i)).append("'");
            }else {
                macStr.append(",'" ).append(offsetList.get(i)).append("'");
            }
        }

        String sql = "select `offset` from tenant_" + tenantId  + " where `value` in (" + macStr + ")" ;

        List<Map<String,Object>>  queryList = QueryUtils.query(sql,QueryUtils.USER_DB);

        List<Integer>  list =  new ArrayList<Integer> ();
        if(null != queryList){
            for(Map<String,Object> map : queryList){
                list.add(Integer.parseInt(map.get("offset") + "" ));
            }
        }
        return list;
    }


    public static List<String> queryMacList(String tenantId,List<Integer> offsetList){
        if(null == offsetList){
            return null;
        }
        String  offsets = Arrays.toString(offsetList.toArray(new Integer[0]));
        if( null != offsets ){
            offsets = offsets.replaceAll("\\[", "").replaceAll("\\]","");
        }
        if(StringUtils.isEmpty(offsets)){
            return new ArrayList<String> ();
        }
        String sql = "select `value` from tenant_" + tenantId  + " where `offset` in (" + offsets + ")" ;

        List<Map<String,Object>>  queryList = QueryUtils.query(sql,QueryUtils.USER_DB);

        List<String>  list =  new ArrayList<String> ();
        if(null != queryList){
            for(Map<String,Object> map : queryList){
                list.add(map.get("value").toString());
            }
        }
        return list;
    }

    public static List<String> queryProjectMacList(String tenantId,int projectId,List<Integer> offsetList){
        if(null == offsetList){
            return null;
        }
        String  offsets = Arrays.toString(offsetList.toArray(new Integer[0]));
        if( null != offsets ){
            offsets = offsets.replaceAll("\\[", "").replaceAll("\\]","");
        }
        if(StringUtils.isEmpty(offsets)){
            return new ArrayList<String> ();
        }
        String sql = "select `value` from project_" + tenantId  + "_"  + projectId +" where `offset` in (" + offsets + ")" ;

        List<Map<String,Object>>  queryList = QueryUtils.query(sql,QueryUtils.USER_DB);

        List<String>  list =  new ArrayList<String> ();
        if(null != queryList){
            for(Map<String,Object> map : queryList){
                list.add(map.get("value").toString());
            }
        }
        return list;
    }



    /**
     * 返回offset，mac匹配对
     * @param tenantId
     * @param offsetList
     * @return
     */
    public static List<MacOffset> queryMacOffsetList(String tenantId, List<Integer> offsetList){
        if(null == offsetList){
            return null;
        }
        String  offsets = Arrays.toString(offsetList.toArray(new Integer[0]));
        if( null != offsets ){
            offsets = offsets.replaceAll("\\[", "").replaceAll("\\]","");
        }
        if(StringUtils.isEmpty(offsets)){
            return new ArrayList<MacOffset> ();
        }
        String sql = "select `value`,`offset` from tenant_" + tenantId  + " where `offset` in (" + offsets + ")" ;

        List<Map<String,Object>>  queryList = QueryUtils.query(sql,QueryUtils.USER_DB);

        List<MacOffset>  list =  new ArrayList<MacOffset> ();
        if(null != queryList){
            for(Map<String,Object> map : queryList){
                MacOffset tmp = new MacOffset();
                tmp.setMac(map.get("value") == null ? null : map.get("value").toString());
                tmp.setOffset(map.get("offset") == null ? null : Integer.parseInt(map.get("offset") + ""));
                list.add(tmp);
            }
        }
        offsetList = null;
        return list;
    }


    /**
     * 查询租户下offset
     * @param tenantId
     * @param startDate
     * @param endDate
     * @return
     */
    public static List<Integer> queryTenantOffsetList( String tenantId, String startDate, String endDate,String projectIds) {
        String cube = "active_user_day_cube";
        String script = null;
        script = "r30223=select * from bitmap." + cube + " where tenant_id =" + tenantId + " and date between " + startDate + " and " + endDate + "; r30223.results[0].value.toArray();";
        if(StringUtils.isNotBlank(projectIds) && !"-1".equals(projectIds)){
            script = "r30223=select * from bitmap." + cube + " where tenant_id =" + tenantId + " and project_id in (" + projectIds + ") and date between " + startDate + " and " + endDate + "; r30223.results[0].value.toArray();";
        }
        log.info("script=" + script);
        String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
        List<Integer>  list = QueryServiceUtils.invokeForOffset("post", queryUrl, script);
        if(null != list){
            // log.info("queryEngine-result:" + Arrays.toString(list.toArray()));
        }
        return list ;
    }

    /**
     * 查找租户下mac集合
     * @param tenantId
     * @param startDate
     * @param endDate
     * @return
     */
    public static List<MacOffset> queryTenantMacList(String tenantId,String startDate,String endDate,String projectIds){
        List<Integer>  offsetList = queryTenantOffsetList(tenantId,startDate,endDate,projectIds);
        log.info("OffsetList size="  + (offsetList == null ? 0 : offsetList.size())) ;
        List<MacOffset> macOffsetList = queryMacOffsetList(tenantId,offsetList);
        log.info("MacList size="  + (macOffsetList == null ? 0 : macOffsetList.size())) ;
        return macOffsetList;
    }

}
