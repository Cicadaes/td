package com.talkingdata.datacloud.adapter;

import com.talkingdata.datacloud.adapter.common.AbstractMysqlAdapter;
import com.talkingdata.datacloud.adapter.common.JdbcBean;
import com.talkingdata.datacloud.adapter.entity.Filter;
import com.talkingdata.datacloud.adapter.entity.Metric;
import com.talkingdata.datacloud.adapter.entity.QueryParameter;
import com.talkingdata.datacloud.adapter.util.DataBaseUtil;
import org.apache.commons.collections.map.HashedMap;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.talkingdata.datacloud.adapter.util.DataBaseUtil.queryForList;
import static com.talkingdata.datacloud.adapter.util.DataBaseUtil.queryForMap;
import static java.lang.Math.abs;

/**
 * @author  yangruobin on 2017/9/19.
 */
public class BestsellerDataSourceAdapter extends AbstractMysqlAdapter {
    private static final Logger logger = LoggerFactory.getLogger(BestsellerDataSourceAdapter.class);
    @Override
    public Object findData(QueryParameter queryParameter){
        String dataSourceConnectionInfo = queryParameter.getDataSourceConnectionInfo();
        JdbcBean jdbcBean = JdbcBean.getJdbcBean(dataSourceConnectionInfo, DIRVERCLASSNAME);
        try {
            if ("sales_radar".equals(queryParameter.getDataSourceName())) {
                return salesRadar(jdbcBean, queryParameter);
            }else if ("bestseller_overview".equals(queryParameter.getDataSourceName())) {
                return queryOverview(jdbcBean, queryParameter, 1);
            } else if ("overview_noPercentage".equals(queryParameter.getDataSourceName())) {
                return queryOverview(jdbcBean, queryParameter, 0);
            } else if ("metric_overview".equals(queryParameter.getDataSourceName())) {
                return getMetricOverview(jdbcBean, queryParameter);
            } else if ("bestseller_sales_tree".equals(queryParameter.getDataSourceName())) {
                return getSalesTree(jdbcBean, queryParameter);
            } else if ("target_assessment".equals(queryParameter.getDataSourceName())) {
                return getTargetAssessment(jdbcBean, queryParameter);
            } else if ("trend_detail".equals(queryParameter.getDataSourceName())) {
                return getTrendDetail(jdbcBean, queryParameter);
            } else if ("order_detail".equals(queryParameter.getDataSourceName())) {
                return getOrderDetail(jdbcBean, queryParameter);
            } else if ("source_analysis".equals(queryParameter.getDataSourceName())) {
                return getSourceSnalysis(jdbcBean, queryParameter);
            } else if ("conversion_detail".equals(queryParameter.getDataSourceName())) {
                return getConversionDetail(jdbcBean, queryParameter);
            } else if ("city_level".equals(queryParameter.getDataSourceName())) {
                return getCityLevel(jdbcBean, queryParameter);
            } else if ("visit_number_detail".equals(queryParameter.getDataSourceName())) {
                return getVisitNumberDetail(jdbcBean, queryParameter);
            } else if ("active_duration_detail".equals(queryParameter.getDataSourceName())) {
                return getActiveDurationDetail(jdbcBean, queryParameter);
            } else if ("passenger_hour_dynamics".equals(queryParameter.getDataSourceName())) {
                return getPassengerHourDynamics(jdbcBean, queryParameter);
            }  else if ("passenger_flow_distribution".equals(queryParameter.getDataSourceName())) {
                return getPassengerFlowDistribution(jdbcBean, queryParameter);
            }else if ("same_city_shop".equals(queryParameter.getDataSourceName())) {
                return getSameCityShop(jdbcBean, queryParameter);
            }else if ("same_logic_city_shop".equals(queryParameter.getDataSourceName())) {
                return getSameLogicCityShop(jdbcBean, queryParameter);
            }else if ("same_county_city_shop".equals(queryParameter.getDataSourceName())) {
                return getSameCountyShop(jdbcBean, queryParameter);
            }else if ("same_mall_city_shop".equals(queryParameter.getDataSourceName())) {
                return getSameMallShop(jdbcBean, queryParameter);
            }else if ("same_region_logic_city".equals(queryParameter.getDataSourceName())) {
                return getSameRegionLogicCity(jdbcBean, queryParameter);
            }else if ("same_brand_region".equals(queryParameter.getDataSourceName())) {
                return getSameBrandRegion(jdbcBean, queryParameter);
            }else if ("spatial_dynamics".equals(queryParameter.getDataSourceName())) {
                return getSpatialDynamics(jdbcBean, queryParameter);
            }else if ("logic_city_to_city".equals(queryParameter.getDataSourceName())) {
                return logicCityToCity(jdbcBean, queryParameter);
            }
        }catch (Exception e){
            logger.error("查询sql失败",e);
        }
        return null;

    }

    /**
     *通过逻辑城市查询物理城市
     */
    private Object logicCityToCity(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        Filter projectIdFilter=null;
        for(Filter filter:queryParameter.getFilters()){
            if("project_id".equals(filter.getField())){
                projectIdFilter=filter;
            }
        }
        if(projectIdFilter==null){
            return null;
        }
        String querySql;
        queryParameter.getFilters().remove(projectIdFilter);
        String[] selectAndGroupAndOrder = getSelectAndGroupAndOrderSql(jdbcBean, queryParameter);
        String whereSql = getWhereSqlWithWhereStr(queryParameter);
        querySql = selectAndGroupAndOrder[0] +
                "FROM TD_PROJECT "+whereSql+" AND project_type=1 AND city IN (SELECT DISTINCT city FROM TD_PROJECT WHERE project_type=1 AND logical_city IN " +
                "(SELECT logical_city FROM TD_PROJECT WHERE `id` = '"+ projectIdFilter.getStringValue() + "'))" +
                selectAndGroupAndOrder[1] + selectAndGroupAndOrder[2];
        if(queryParameter.isShowSql()){
            return querySql;
        }
        List<Map<String,Object>>queryMapList =queryForList(jdbcBean,querySql);
        changeNullToZero(queryParameter,queryMapList);
        return queryMapList;
    }

    /**
     *客流动态-空间动态
     */
    private Object getSpatialDynamics(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        Map<String,String>nextLevelMap=new HashedMap();
        nextLevelMap.put("11","1");
        nextLevelMap.put("5","11");
        nextLevelMap.put("6","5");
        String projectType=null;
        Filter projectIdFilter=null;
        for(Filter filter:queryParameter.getFilters()){
            if("project_type".equals(filter.getField())){
                projectType=(String)filter.getValue();
                if("11".equals(projectType)){
                    projectType="1";
                    filter.setValue(projectType);
                }else if("5".equals(projectType)){
                    projectType="11";
                    filter.setValue(projectType);
                }else if("6".equals(projectType)){
                    projectType="5";
                    filter.setValue(projectType);
                }
            }else if("project_id".equals(filter.getField())){
                projectIdFilter=filter;
            }
        }
        queryParameter.getFilters().remove(projectIdFilter);
        if(projectType==null||projectIdFilter==null){
            return null;
        }
        String projectId=projectIdFilter.getStringValue();
        if("1".equals(projectType)){
            jdbcBean.setTableName("SELECT TD_METRIC_DAY.project_name,TD_METRIC_DAY.tenant_id tenant_id,active_users,longitude,latitude,date,TD_METRIC_DAY.project_type " +
                    "FROM TD_METRIC_DAY JOIN  TD_PROJECT ON TD_METRIC_DAY.project_id=TD_PROJECT.id WHERE TD_METRIC_DAY.logical_city =  " +
                    "(SELECT logical_city FROM TD_PROJECT WHERE id= "+projectId +") AND TD_METRIC_DAY.project_type="+projectType);
        }else if("11".equals(projectType)){
            jdbcBean.setTableName("SELECT TD_METRIC_DAY.project_name,TD_METRIC_DAY.tenant_id tenant_id,active_users,longitude,latitude,date,TD_METRIC_DAY.project_type " +
                    "FROM TD_METRIC_DAY JOIN  TD_PROJECT ON TD_METRIC_DAY.project_id=TD_PROJECT.id WHERE TD_METRIC_DAY.region =  " +
                    "(SELECT region FROM TD_PROJECT WHERE id= "+projectId +") AND TD_METRIC_DAY.project_type="+projectType);
        }else if("5".equals(projectType)){
            jdbcBean.setTableName("SELECT TD_METRIC_DAY.project_name,TD_METRIC_DAY.tenant_id tenant_id,active_users,longitude,latitude,date,TD_METRIC_DAY.project_type " +
                    "FROM TD_METRIC_DAY JOIN  TD_PROJECT ON TD_METRIC_DAY.project_id=TD_PROJECT.id WHERE TD_METRIC_DAY.brand =  " +
                    "(SELECT brand FROM TD_PROJECT WHERE id= "+projectId +") AND TD_METRIC_DAY.project_type="+projectType);
        }

        return getLRRResultMap(jdbcBean,queryParameter);
    }

    private Object getSameLogicCityShop(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        return getSameLocation(jdbcBean,queryParameter,"logical_city");
    }

    private Object getSameCountyShop(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        return getSameLocation(jdbcBean,queryParameter,"county");
    }

    private Object getSameMallShop(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        return getSameLocation(jdbcBean,queryParameter,"mall");
    }

    private Object getSameRegionLogicCity(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        return getSameLocation(jdbcBean,queryParameter,"region");
    }

    private Object getSameBrandRegion(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        return getSameLocation(jdbcBean,queryParameter,"brand");
    }

    /**
     *运营概览-店铺-同城四象限
     */
    private Object getSameCityShop(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        return getSameLocation(jdbcBean,queryParameter,"city");
    }

    /**
     *运营概览-同城四象限
     */
    private Object getSameLocation(JdbcBean jdbcBean, QueryParameter queryParameter,String sameField)throws Exception{
        Filter projectIdFilter=null;
        Filter projectTypeFilter=null;
        for(Filter filter:queryParameter.getFilters()){
            if("project_id".equals(filter.getField())){
                projectIdFilter=filter;
            }
            if("project_type".equals(filter.getField())){
                projectTypeFilter=filter;
            }
        }
        if(projectIdFilter==null){
            return null;
        }
        String querySql;
        queryParameter.getFilters().remove(projectIdFilter);
        String[] selectAndGroupAndOrder = getSelectAndGroupAndOrderSql(jdbcBean, queryParameter);
        String whereSql = getWhereSqlWithWhereStr(queryParameter);
        querySql = selectAndGroupAndOrder[0] +
                "FROM TD_METRIC_DAY AS REPORT_TEMP_A " + whereSql + " AND project_id in (SELECT id FROM TD_PROJECT WHERE project_type = " +projectTypeFilter.getValue()+
                " AND "+sameField+" IN (SELECT "+sameField+"  FROM TD_PROJECT AS REPORT_TEMP_A WHERE 1=1  AND `id` = '"+ projectIdFilter.getStringValue() + "'))" +
                selectAndGroupAndOrder[1] + selectAndGroupAndOrder[2];
        if(queryParameter.isShowSql()){
            return querySql;
        }
        List<Map<String,Object>>queryMapList =queryForList(jdbcBean,querySql);
        changeNullToZero(queryParameter,queryMapList);
        return queryMapList;
    }

    /**
     *运营概览-城市-客流分布
     */
    private Object getCustomerDistributionShop(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        Filter projectIdFilter=null;
        for(Filter filter:queryParameter.getFilters()){
            if("project_id".equals(filter.getField())){
                projectIdFilter=filter;
                queryParameter.getFilters().remove(filter);
                break;
            }
        }
        if(projectIdFilter==null){
            return null;
        }
        String querySql;
        if("=".equals(projectIdFilter.getOperator())) {
            String[] selectAndGroupAndOrder = getSelectAndGroupAndOrderSql(jdbcBean, queryParameter);
            String whereSql = getWhereSqlWithWhereStr(queryParameter);
            querySql = selectAndGroupAndOrder[0] + ",REPORT_TEMP_B.longitude,REPORT_TEMP_B,latitude" +
                    "FROM TD_METRIC_DAY AS REPORT_TEMP_A,TD_PROJECT  AS REPORT_TEMP_B " + whereSql + " AND city IN (SELECT city  FROM TD_PROJECT AS REPORT_TEMP_A WHERE 1=1  AND `id` = '"
                    + projectIdFilter.getStringValue() + "') AND REPORT_TEMP_A.project_id=REPORT_TEMP_B.project_id" +
                    selectAndGroupAndOrder[1] + selectAndGroupAndOrder[2];
        }else{
            jdbcBean.setTableName("TD_METRIC_DAY");
            querySql=assemblingSql(jdbcBean,queryParameter);
        }
        if(queryParameter.isShowSql()){
            return querySql;
        }
        List<Map<String,Object>>queryMapList =queryForList(jdbcBean,querySql);
        return queryMapList;
    }

    /**
     *运营概览-客流分布
     */
    private Object getPassengerFlowDistribution(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{

        Filter projectIdFilter=null;
        for(Filter filter:queryParameter.getFilters()){
            if("project_id".equals(filter.getField())){
                projectIdFilter=filter;
                queryParameter.getFilters().remove(filter);
                break;
            }
        }
        if(projectIdFilter!=null){
            jdbcBean.setTableName("SELECT TD_METRIC_DAY.project_name,active_users,longitude,latitude,date,TD_METRIC_DAY.project_type,region " +
                    "FROM TD_METRIC_DAY JOIN  TD_PROJECT ON TD_METRIC_DAY.project_id=TD_PROJECT.id WHERE TD_METRIC_DAY.logical_city IN  " +
                    "(SELECT logical_city FROM TD_PROJECT WHERE id= "+projectIdFilter.getValue() +")");
        }else{
            jdbcBean.setTableName("SELECT TD_METRIC_DAY.project_name,active_users,longitude,latitude,date,TD_METRIC_DAY.project_type,TD_METRIC_DAY.logical_city" +
                    ",TD_METRIC_DAY.region,TD_METRIC_DAY.brand FROM TD_METRIC_DAY JOIN   TD_PROJECT ON TD_METRIC_DAY.project_id=TD_PROJECT.id");
        }
        return getLRRResultMap(jdbcBean,queryParameter);
    }

    private Object getLRRResultMap(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        Map<String, Object> resultMap = new LinkedHashMap();
        String querySql=assemblingSql(jdbcBean,queryParameter);
        QueryParameter lrrQueryParameter =getLRRQueryParameter(queryParameter);
        String lrrQuerySql=assemblingSql(jdbcBean,lrrQueryParameter);
        if(queryParameter.isShowSql()){
            resultMap.put("环比时间Sql",lrrQuerySql);
            resultMap.put("当前时间Sql",querySql);
            return resultMap;
        }
        List<Map<String,Object>>queryMapList =queryForList(jdbcBean,querySql);
        List<Map<String,Object>>lrrQueryMapList =queryForList(jdbcBean,lrrQuerySql);
        resultMap.put("本阶段入店客流",queryMapList);
        resultMap.put("环比阶段入店客流",lrrQueryMapList);
        return resultMap;
    }


    /**
     * 城市概览-城市级别
     * @param jdbcBean
     * @param queryParameter
     * @return
     */
    private Object getCityLevel(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        String whereSql=getWhereSqlStr(queryParameter);
        String topNLimitBySql=getLimitSqlStr(queryParameter);

        List<Map<String,Object>> resultList=new ArrayList<>();

        //查询所有城市客流
        Map<String,Object> allCityResult=getCityMap(jdbcBean,whereSql,topNLimitBySql,0,queryParameter.isShowSql());
        allCityResult.put("name","全部城市");
        Integer allActiveUsers=(Integer) allCityResult.get("cityActiveUsers");
        allCityResult.remove("cityActiveUsers");
        //查询一线城市客流
        Map<String,Object> firstLevelCityResult=getCityMap(jdbcBean,whereSql,topNLimitBySql,allActiveUsers,1,queryParameter.isShowSql());
        firstLevelCityResult.put("name","一线城市");
        //查询二线城市客流
        Map<String,Object> secondLevelCityResult=getCityMap(jdbcBean,whereSql,topNLimitBySql,allActiveUsers,2,queryParameter.isShowSql());
        secondLevelCityResult.put("name","二线城市");
        //查询三线城市客流
        Map<String,Object> thirdLevelCityResult=getCityMap(jdbcBean,whereSql,topNLimitBySql,allActiveUsers,3,queryParameter.isShowSql());
        thirdLevelCityResult.put("name","三线城市");


        resultList.add(allCityResult);
        resultList.add(firstLevelCityResult);
        resultList.add(secondLevelCityResult);
        resultList.add(thirdLevelCityResult);
        return resultList;

    }





    /**
     *客流动态-小时动态
     */
    private Object getPassengerHourDynamics(JdbcBean jdbcBean, QueryParameter queryParameter){
        String metric=queryParameter.getMetrics().get(0).getField();
        String nowDateWhereSql=" WHERE 1=1 ";
        String yestodayWhereSql=" WHERE 1=1 ";
        String beforeSevenDayWhereSql=" WHERE 1=1 ";
        String beforeThirtyDayWhereSql=" WHERE 1=1 ";
        for(Filter filter:queryParameter.getFilters()){
            Object value=filter.getValue();
            if("project_id".equals(filter.getField())){
                nowDateWhereSql += " AND " + filter.getField() + " " + filter.getOperator() + " ('" + value + "')";
                yestodayWhereSql += " AND " + filter.getField() + " " + filter.getOperator() + " ('" + value + "')";
                beforeSevenDayWhereSql += " AND " + filter.getField() + " " + filter.getOperator() + " ('" + value + "')";
                beforeThirtyDayWhereSql += " AND " + filter.getField() + " " + filter.getOperator() + " ('" + value + "')";
            }else if("date".equals(filter.getField())){
                nowDateWhereSql += " AND " + filter.getField() + " " + filter.getOperator() + " '" + value + "'";
                yestodayWhereSql += " AND " + filter.getField() + " " + filter.getOperator() + " date_format(date_add('"+value+"', interval -1 day) ,'%Y-%m-%d')";
                beforeSevenDayWhereSql += " AND " + filter.getField() + " < '" + value + "' " +
                        "AND " + filter.getField() + ">=" + " date_format(date_add('"+value+"', interval -7 day) ,'%Y-%m-%d')";
                beforeThirtyDayWhereSql += " AND " + filter.getField() + " < '" + value + "' " +
                        " AND " + filter.getField() +  ">=" + " date_format(date_add('"+value+"', interval -30 day) ,'%Y-%m-%d')";
            }
        }

        String querySql = "SELECT * FROM (" +
                "SELECT CAST(hour AS SIGNED integer) AS date,'今日' AS name,SUM("+metric+") AS value  FROM TD_METRIC_HOUR_REAL_TIME  " +nowDateWhereSql +"  GROUP BY hour"
                +" UNION "+
                "SELECT CAST(hour AS SIGNED integer) AS date,'昨日' AS name,SUM("+metric+") AS value  FROM TD_METRIC_HOUR_REAL_TIME  " +yestodayWhereSql +"  GROUP BY hour"
                +" UNION "+
                "SELECT CAST(hour AS SIGNED integer) AS date,'近7日' AS name,ROUND(AVG("+metric+"),0) AS value  FROM TD_METRIC_HOUR_REAL_TIME  " +beforeSevenDayWhereSql +"  GROUP BY hour"
                +" UNION "+
                "SELECT CAST(hour AS SIGNED integer) AS date,'近30日' AS name,ROUND(AVG("+metric+"),0) AS value  FROM TD_METRIC_HOUR_REAL_TIME  " +beforeThirtyDayWhereSql +"  GROUP BY hour" +
                ") AS TEMP_A ORDER BY date,field(name,'今日','昨日','近7日','近30日')";
        if(queryParameter.isShowSql()){
            return querySql;
        }
        List<Map<String,Object>>queryMapList =queryForList(jdbcBean,querySql);
        settingZero(queryParameter,queryMapList);
        return queryMapList;
    }


    /**
     *运营概览-目标考核
     */
    private Object getTargetAssessment(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        Map<String, Object> resultMap = new LinkedHashMap();
        String whereSql=getWhereSqlWithWhereStr(queryParameter);
        String limitBySql=getLimitSqlStr(queryParameter);

        String targetAssessmentSql = "SELECT target_name AS 名称,page_index AS 指标类型,CONCAT(start_date,'~',end_date) AS 起止时间," +
                "(CASE WHEN target_value>=10000 THEN CONCAT(target_value/10000,'万') WHEN target_value<10 THEN CONCAT(target_value,'%') ELSE target_value END) AS 目标数据," +
                "(CASE WHEN current_value>=10000 THEN CONCAT(current_value/10000,'万') WHEN current_value<10 THEN CONCAT(current_value,'%') ELSE current_value END) AS 当前数据," +
                "CONCAT(ROUND(current_value/target_value*100,2),'%') AS 达成率,operation_state AS 运营状态 FROM TD_TARGET_MANAGEMENT "+
                whereSql+" ORDER BY start_date DESC "+limitBySql;
        if(queryParameter.isShowSql()){
            return targetAssessmentSql;
        }
        List<Map<String,Object>>queryMapList =queryForList(jdbcBean,targetAssessmentSql);

        String queryCountSql = "SELECT COUNT(*) AS pageCount FROM TD_TARGET_MANAGEMENT "+whereSql;
        Map<String,Object> queryMapCountMap =queryForMap(jdbcBean,queryCountSql);
        Long count=(Long) queryMapCountMap.get("pageCount");
        resultMap.put("total",count);
        resultMap.put("data",queryMapList);
        return resultMap;
    }

    /**
     *趋势指标-明细分析
     */
    private Object getTrendDetail(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        jdbcBean.setTableName("TD_METRIC_DAY");
        return getlrrResult(jdbcBean,queryParameter);
    }

    /**
     *活跃指标-入店时长-明细数据
     */
    private Object getActiveDurationDetail(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        jdbcBean.setTableName("TD_METRIC_DAY");
        return getlrrResult(jdbcBean,queryParameter);
    }

    /**
     *活跃指标-到访次数-明细数据
     */
    private Object getVisitNumberDetail(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        jdbcBean.setTableName("TD_METRIC_DAY");
        return getlrrResult(jdbcBean,queryParameter);
    }

    /**
     * 转化指标-明细数据
     * @param jdbcBean
     * @param queryParameter
     * @return
     */
    private Object getConversionDetail(JdbcBean jdbcBean,QueryParameter queryParameter)throws Exception{
        Metric faMetric=new Metric();
        faMetric.setField("ROUND(sum(active_users)/sum(front_users)*100,1)");
        faMetric.setAlias("fa");
        queryParameter.getMetrics().add(faMetric);
        Metric fsMetric=new Metric();
        fsMetric.setField("ROUND(sum(stay_users)/sum(front_users)*100,1)");
        fsMetric.setAlias("fs");
        queryParameter.getMetrics().add(fsMetric);
        Metric foMetric=new Metric();
        foMetric.setField("ROUND(sum(order_count)/sum(front_users)*100,1)");
        foMetric.setAlias("fo");
        queryParameter.getMetrics().add(foMetric);
        Metric asMetric=new Metric();
        asMetric.setField("ROUND(sum(stay_users)/sum(active_users)*100,1)");
        asMetric.setAlias("as");
        queryParameter.getMetrics().add(asMetric);
        Metric aoMetric=new Metric();
        aoMetric.setField("ROUND(sum(order_count)/sum(active_users)*100,1)");
        aoMetric.setAlias("ao");
        queryParameter.getMetrics().add(aoMetric);
        Metric soMetric=new Metric();
        soMetric.setField("ROUND(sum(order_count)/sum(stay_users)*100,1)");
        soMetric.setAlias("so");
        queryParameter.getMetrics().add(soMetric);
        List<Map<String, Object>>  detailResultMapList =new ArrayList<>();
        jdbcBean.setTableName("TD_METRIC_DAY");
        Map<String, Object> resultMap=(Map<String,Object>)getlrrResult(jdbcBean,queryParameter);
        if(queryParameter.isShowSql()){
            return resultMap;
        }
        Map<String, Object>  detailResultMap=((List<Map<String, Object>>)resultMap.get("data")).get(0);
        Map<String, Object> faMap=new LinkedHashMap();
        faMap.put("转换环节","周边-入店");
        faMap.put("转化率",detailResultMap.get("fa")+"%");
        faMap.put("转化率_环比",detailResultMap.get("fa_环比"));
        faMap.put("转化率_环比_状态",detailResultMap.get("fa_环比_状态"));
        detailResultMapList.add(faMap);

        Map<String, Object> acsMap=new LinkedHashMap();
        acsMap.put("转换环节","入店-停留");
        acsMap.put("转化率",detailResultMap.get("as")+"%");
        acsMap.put("转化率_环比",detailResultMap.get("as_环比"));
        acsMap.put("转化率_环比_状态",detailResultMap.get("as_环比_状态"));
        detailResultMapList.add(acsMap);

        Map<String, Object> srMap=new LinkedHashMap();
        srMap.put("转换环节","停留-转化");
        srMap.put("转化率",detailResultMap.get("so")+"%");
        srMap.put("转化率_环比",detailResultMap.get("so_环比"));
        srMap.put("转化率_环比_状态",detailResultMap.get("so_环比_状态"));
        detailResultMapList.add(srMap);

        Map<String, Object> fsMap=new LinkedHashMap();
        fsMap.put("转换环节","周边-停留");
        fsMap.put("转化率",detailResultMap.get("fs")+"%");
        fsMap.put("转化率_环比",detailResultMap.get("fs_环比"));
        fsMap.put("转化率_环比_状态",detailResultMap.get("fs_环比_状态"));
        detailResultMapList.add(fsMap);

        Map<String, Object> frMap=new LinkedHashMap();
        frMap.put("转换环节","周边-转化");
        frMap.put("转化率",detailResultMap.get("fo")+"%");
        frMap.put("转化率_环比",detailResultMap.get("fo_环比"));
        frMap.put("转化率_环比_状态",detailResultMap.get("fo_环比_状态"));
        detailResultMapList.add(frMap);


        Map<String, Object> arMap=new LinkedHashMap();
        arMap.put("转换环节","入店-转化");
        arMap.put("转化率",detailResultMap.get("ao")+"%");
        arMap.put("转化率_环比",detailResultMap.get("ao_环比"));
        arMap.put("转化率_环比_状态",detailResultMap.get("ao_环比_状态"));
        detailResultMapList.add(arMap);

        resultMap.put("total",6);
        resultMap.put("data",detailResultMapList);
        return resultMap;
    }

    private Object getSourceSnalysis(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        Map<String, Object> resultMap = new LinkedHashMap();
        String whereSql=getWhereSqlWithWhereStr(queryParameter);

        String tableNameSql = "SELECT area_name AS area_name,(CASE `crowd_type` WHEN 'AU' THEN metric_value ELSE 0 END ) as AU, " +
                "(CASE `crowd_type` WHEN 'NU' THEN metric_value ELSE 0  END ) as NU, " +
                "(CASE `crowd_type` WHEN 'OU' THEN metric_value ELSE 0  END ) as OU, " +
                "(CASE `crowd_type` WHEN 'SU' THEN metric_value ELSE 0 END ) as SU, " +
                "(CASE `crowd_type` WHEN 'JU' THEN metric_value ELSE 0  END ) as JU, " +
                "(CASE `crowd_type` WHEN 'HU' THEN metric_value ELSE 0  END ) as HU, " +
                "(CASE `crowd_type` WHEN 'MU' THEN metric_value ELSE 0  END ) as MU, " +
                "(CASE `crowd_type` WHEN 'LU' THEN metric_value ELSE 0  END ) as LU, " +
                "(CASE `crowd_type` WHEN 'SLU' THEN metric_value ELSE 0 END ) as SLU FROM TD_TENANT_TOP_AREA_COUNT "+
                whereSql;
        jdbcBean.setTableName(tableNameSql);
        queryParameter.getFilters().clear();
        queryParameter.getDateFilters().clear();
        String querySql=assemblingSql(jdbcBean,queryParameter);
        if(queryParameter.isShowSql()){
            return querySql;
        }
        List<Map<String,Object>>queryMapList =queryForList(jdbcBean,querySql);
        String queryCountSql = "SELECT COUNT(area_name) AS pageCount FROM (SELECT area_name FROM TD_TENANT_TOP_AREA_COUNT "+
                whereSql+"  GROUP BY area_name ) AS TEMP";
        Map<String,Object> queryMapCountMap =queryForMap(jdbcBean,queryCountSql);
        Long count=(Long) queryMapCountMap.get("pageCount");
        resultMap.put("total",count);
        resultMap.put("data",queryMapList);
        return resultMap;
    }


    /**
     * 客流动态-小时动态-指标概览
     */
    private Object getMetricOverview(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        Map<String, Object> resultMap = new LinkedHashMap();
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar=Calendar.getInstance();
        String nowDateStr=sdfDate.format(calendar.getTime());
        Integer nowHour=calendar.get(Calendar.HOUR_OF_DAY);
        String findMaxDateSql="SELECT DISTINCT CONCAT(date,' ',hour) AS maxDate FROM TD_METRIC_FACT WHERE date <'"+nowDateStr+"' OR (date='"+nowDateStr+"' AND hour <= "
                +nowHour+") ORDER BY date desc,hour desc limit 2";
        List<Map<String, Object>> maxDateMapList=queryForList(jdbcBean,findMaxDateSql);
        if(maxDateMapList.size()<2){
            return null;
        }
        String maxTime=(String)maxDateMapList.get(1).get("maxDate");
        SimpleDateFormat sdfAll = new SimpleDateFormat("yyyy-MM-dd HH");
        Date currentDate=sdfAll.parse(maxTime);
        DateUtil dateUtil=new DateUtil(currentDate);
        //当前日期
        String currentDateStr=dateUtil.getCurrentDateStr();
        //当前小时
        Integer currentHour=dateUtil.getCurrentHour();
        //昨天日期
        String yestodayDateStr=dateUtil.getBeforeDaysDateStr(1);
        //前第7天日期
        String beforeSevenDayDateStr=dateUtil.getBeforeDaysDateStr(7);
        //前第30天日期
        String beforeThirtyDayDateStr=dateUtil.getBeforeDaysDateStr(30);
        //一个小时到当前小时
        String currentToNextHour=dateUtil.getSomeHourToOtherHour(0,1);
        //7天到1天前
        String beforeSevenToOne=dateUtil.getBeforeSomeDaysToSomeDays(7,1);
        //30天到1天前
        String beforeThirtyToOne=dateUtil.getBeforeSomeDaysToSomeDays(30,1);
        //截止当前小时
        String endCurrentHour=dateUtil.getEndHour(1);


        Filter filter=queryParameter.getFilters().get(0);
        String []projectIdArr=((String)filter.getValue()).split(",");
        filter.setOperator("=");
        for(String projectId:projectIdArr){
            Map<String, Object> oneProjectMap=new LinkedHashMap();
            String projectNameSql = "SELECT distinct project_name FROM TD_PROJECT WHERE id="+" '"+projectId+"'";
            Map<String, Object> projectNameMap=queryForMap(jdbcBean,projectNameSql);
            String projectName=(String) projectNameMap.get("project_name");

            String totalRealTimeSql = "SELECT COALESCE(SUM(hour_users),0) AS total,'"+currentToNextHour+"' AS time FROM TD_METRIC_FACT " +
                    "WHERE date = '"+currentDateStr+"' AND hour = "+currentHour+" AND "+filter.getField()+" "+filter.getOperator()+" '"+projectId+"'";
            Map<String, Object> totalResultMap=queryForMap(jdbcBean,totalRealTimeSql);
            oneProjectMap.put("实时入店客流", totalResultMap);

            String totalEndTimeSql = "SELECT COALESCE(SUM(end_hour_users),0) AS total,'"+endCurrentHour+"' AS time FROM TD_METRIC_FACT " +
                    "WHERE date = '"+currentDateStr+"' AND hour = "+currentHour+" AND "+filter.getField()+" "+filter.getOperator()+" '"+projectId+"'";
            Map<String, Object>  endResultMap=queryForMap(jdbcBean,totalEndTimeSql);
            oneProjectMap.put("今日累计入店客流", endResultMap);

            String yesterdayEndTimeSql = "SELECT COALESCE(SUM(end_hour_users),0) AS total,'"+endCurrentHour+"' AS time FROM TD_METRIC_FACT " +
                    "WHERE date = date_format('"+yestodayDateStr+"' ,'%Y-%m-%d') AND hour = "+currentHour+" AND "+filter.getField()+" "+filter.getOperator()+" '"+projectId+"'";
            Map<String, Object>  yesterdayEndResultMap=queryForMap(jdbcBean,yesterdayEndTimeSql);
            oneProjectMap.put("昨日同比客流", yesterdayEndResultMap);

            String totalSevenDayInShopSql = "SELECT ROUND(COALESCE(AVG(active_users),0),0) AS total,'" +beforeSevenToOne+ "'AS time " +
                    "FROM TD_METRIC_DAY WHERE date<=date_format('"+yestodayDateStr+"','%Y-%m-%d') AND date>=date_format('"+beforeSevenDayDateStr+"' ,'%Y-%m-%d') " +
                    " AND "+filter.getField()+" "+filter.getOperator()+" '"+projectId+"'";
            Map<String, Object>  sevenResultMap=queryForMap(jdbcBean,totalSevenDayInShopSql);
            oneProjectMap.put("近7日平均客流", sevenResultMap);

            String totalThirtyDayInShopSql = "SELECT ROUND(COALESCE(AVG(active_users),0),0) AS total,'"+beforeThirtyToOne+"' AS time " +
                    "FROM TD_METRIC_DAY WHERE date<=date_format('"+yestodayDateStr+"' ,'%Y-%m-%d') AND date>=date_format('"+beforeThirtyDayDateStr+"' ,'%Y-%m-%d')" +
                    " AND "+filter.getField()+" "+filter.getOperator()+" '"+projectId+"'";
            Map<String, Object>  thirtyResultMap=queryForMap(jdbcBean,totalThirtyDayInShopSql);
            oneProjectMap.put("近30日平均客流", thirtyResultMap);

            resultMap.put(projectName,oneProjectMap);

            if(queryParameter.isShowSql()){
                oneProjectMap.put("查询最大Sql",findMaxDateSql);
                oneProjectMap.put("查询项目名称sql",projectNameSql);
                oneProjectMap.put("实时客流sql",totalRealTimeSql);
                oneProjectMap.put("今日累计客流sql",totalEndTimeSql);
                oneProjectMap.put("昨日同比客流sql",yesterdayEndTimeSql);
                oneProjectMap.put("近7日平均客流sql",totalSevenDayInShopSql);
                oneProjectMap.put("近30日平均客流sql",totalThirtyDayInShopSql);
            }
        }
        return resultMap;
    }

    /**
     *  销售雷达
     * @param jdbcBean
     * @param queryParameter
     * @return
     * @throws Exception
     */
    private Object salesRadar(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        List<Object> resultList = new ArrayList<>();

        QueryParameter newQueryParameter = new QueryParameter();
        newQueryParameter.setDateFilters(queryParameter.getDateFilters());
        String filterSql =getWhereSqlStr(newQueryParameter);

        String tenant_id=null;
        String project_type=null;
        String project_id=null;

        // 集合为中文
        Set<String> querySet = new HashSet<String>();
        for(Metric tmpMetric:queryParameter.getMetrics()){
            querySet.add(tmpMetric.getAlias().replace("`","").trim());
        }

        for(Filter tmpFilter:queryParameter.getFilters()){
            if("tenant_id".equalsIgnoreCase(tmpFilter.getField())) {
                tenant_id = tmpFilter.getStringValue();
            }else if("project_id".equalsIgnoreCase(tmpFilter.getField())){
                project_id = tmpFilter.getStringValue();
            }
        }

        String getBrandSql = "select ID,BRAND,PROJECT_TYPE from TD_PROJECT WHERE ID in ("+project_id+")";
        List<Map<String, Object>> brandMapList = DataBaseUtil.queryForList(jdbcBean,getBrandSql);

        StringBuffer brandBuffer = new StringBuffer();
        Map<Integer,String> projectBrandMap =new HashMap<>();
        for(int k=0;k<brandMapList.size();k++){
            // 方便根据 ID 查询 品牌
            projectBrandMap.put(Integer.valueOf(brandMapList.get(k).get("ID").toString()),brandMapList.get(k).get("BRAND").toString());

            if(k==0){
                brandBuffer.append("'").append(brandMapList.get(k).get("BRAND").toString()).append("'");
                project_type = brandMapList.get(k).get("PROJECT_TYPE").toString();
            }else{
                brandBuffer.append(",").append("'").append(brandMapList.get(k).get("BRAND").toString()).append("'");
            }
        }

        String currentSql ="SELECT PROJECT_ID,PROJECT_NAME AS `PROJECT_NAME`," +
                "   IFNULL(SUM(sales_amount),0.0) AS `销售金额`," +
                "   IFNULL(ROUND(sum(sales_amount) / sum(order_count),1),0.0) AS `VPC`," +
                "   IFNULL(ROUND(sum(order_count_gt1) / sum(order_count) * 100,2),0.0) AS `关联销售订单占比`," +
                "   IFNULL(SUM(order_count),0.0) AS `订单数`," +
                "   IFNULL(SUM(non_vip_sales_amount),0.0) AS `非会员销售金额`," +
                "   IFNULL(SUM(vip_sales_amount),0.0) AS `会员销售金额`," +
                "   IFNULL(ROUND(sum(sales_amount) / sum(sales_count),1),0.0) AS `件单价`," +
                "   IFNULL(ROUND(sum(vip_order_count_gt1) / sum(vip_order_count) * 100,2),0.0) AS `会员关联销售订单占比`," +
                "   IFNULL(ROUND(sum(sales_count) / sum(order_count),1),0.0) AS `IPC`," +
                "   IFNULL(ROUND(sum(non_vip_sales_amount) / sum(non_vip_order_count),1),0.0) AS `非会员VPC`," +
                "   IFNULL(ROUND(sum(vip_sales_amount) / sum(vip_order_count),1),0.0) AS `会员VPC`," +
                "   IFNULL(ROUND(sum(non_vip_order_count_gt1) / sum(non_vip_order_count) * 100,2),0.0) AS `非会员关联销售订单占比`," +
                "   IFNULL(SUM(sales_count),0.0) AS `销件数`  FROM TD_METRIC_DAY AS REPORT_TEMP_A where 1=1" +filterSql+
                "   AND `PROJECT_ID` in("+project_id+") AND `TENANT_ID` = "+tenant_id+" GROUP BY PROJECT_ID, `PROJECT_NAME`";

        String maxSql="select BRAND,"+
               "  max(`销售金额`) AS `销售金额`,"  +
               "  max(`VPC`) AS `VPC`,"  +
               "  max(`关联销售订单占比`) AS `关联销售订单占比`,"  +
               "  max(`订单数`) AS `订单数`,"  +
               "  max(`非会员销售金额`) AS `非会员销售金额`,"  +
               "  max(`会员销售金额`) AS `会员销售金额`,"  +
               "  max(`件单价`) AS `件单价`,"  +
               "  max(`会员关联销售订单占比`) AS `会员关联销售订单占比`,"  +
               "  max(`IPC`) AS `IPC`,"  +
               "  max(`非会员VPC`) AS `非会员VPC`,"  +
               "  max(`会员VPC`) AS `会员VPC`,"  +
               "  max(`非会员关联销售订单占比`) AS `非会员关联销售订单占比`,"  +
               "  max(`销件数`) AS `销件数`"  +
               " from (SELECT MAX(BRAND) AS BRAND,"  +
                 " SUM(sales_amount) AS `销售金额`,"  +
                 " ROUND(sum(sales_amount) / sum(order_count),1) AS `VPC`,"  +
                 " ROUND(sum(order_count_gt1) / sum(order_count) * 100,2) AS `关联销售订单占比`,"  +
                 " SUM(order_count) AS `订单数`,"  +
                 " SUM(non_vip_sales_amount) AS `非会员销售金额`,"  +
                 " SUM(vip_sales_amount) AS `会员销售金额`,"  +
                 " ROUND(sum(sales_amount) / sum(sales_count),1) AS `件单价`,"  +
                 " ROUND(sum(vip_order_count_gt1) / sum(vip_order_count) * 100,2) AS `会员关联销售订单占比`,"  +
                 " ROUND(sum(sales_count) / sum(order_count),1) AS `IPC`,"  +
                 " ROUND(sum(non_vip_sales_amount) / sum(non_vip_order_count),1) AS `非会员VPC`,"  +
                 " ROUND(sum(vip_sales_amount) / sum(vip_order_count),1) AS `会员VPC`,"  +
                 " ROUND(sum(non_vip_order_count_gt1) / sum(non_vip_order_count) * 100,2) AS `非会员关联销售订单占比`,"  +
                 " SUM(sales_count) AS `销件数`"  +
                 " FROM TD_METRIC_DAY AS REPORT_TEMP_A WHERE 1 = 1 "+ filterSql +"AND `PROJECT_TYPE` = "+ project_type +" AND brand in ("+brandBuffer.toString()+") AND `TENANT_ID` = '"+tenant_id+"' GROUP BY `PROJECT_ID` ) t GROUP BY BRAND";

        if(queryParameter.isShowSql()){
            resultList.add(currentSql);
            resultList.add(maxSql);
            return resultList;
        }

        List<Map<String, Object>> curMapList =DataBaseUtil.queryForList(jdbcBean,currentSql);
        List<Map<String, Object>> maxMapList =DataBaseUtil.queryForList(jdbcBean,maxSql);

        for(int k=0;k<curMapList.size();k++){
            Map<String, Object> resultMap = new LinkedHashMap();

            Map<String, Object> curMap =curMapList.get(k);
            Map<String, Object> maxMap = null;
            for(int h=0;h<maxMapList.size();h++){
                if(maxMapList.get(h).get("BRAND").toString().trim().equals(projectBrandMap.get(curMap.get("PROJECT_ID")).trim())){
                    maxMap =maxMapList.get(h);
                    break;
                }
            }

            resultMap.put("project_name",curMap.get("PROJECT_NAME"));

            // 消除返回的多余的查询指标
            Set<String> mapKeySet = new HashSet<>(curMap.keySet());
            for(String curKey:mapKeySet){
                if(!querySet.contains(curKey)){
                    curMap.remove(curKey);
                }
            }

            Map<String, Object> rateMap =new HashMap<>();
            for(String zhKey:querySet){
                rateMap.put(zhKey,getRate(curMap.get(zhKey),maxMap.get(zhKey)));
            }
//            rateMap.put("销售金额",getRate(curMap.get("销售金额"),maxMap.get("销售金额")));
//            rateMap.put("VPC",getRate(curMap.get("VPC"),maxMap.get("VPC")));
//            rateMap.put("关联销售订单占比",getRate(curMap.get("关联销售订单占比"),maxMap.get("关联销售订单占比")));
//            rateMap.put("订单数",getRate(curMap.get("订单数"),maxMap.get("订单数")));
//            rateMap.put("非会员销售金额",getRate(curMap.get("非会员销售金额"),maxMap.get("非会员销售金额")));
//            rateMap.put("会员销售金额",getRate(curMap.get("会员销售金额"),maxMap.get("会员销售金额")));
//            rateMap.put("件单价",getRate(curMap.get("件单价"),maxMap.get("件单价")));
//            rateMap.put("会员关联销售订单占比",getRate(curMap.get("会员关联销售订单占比"),maxMap.get("会员关联销售订单占比")));
//            rateMap.put("IPC",getRate(curMap.get("IPC"),maxMap.get("IPC")));
//            rateMap.put("非会员VPC",getRate(curMap.get("非会员VPC"),maxMap.get("非会员VPC")));
//            rateMap.put("会员VPC",getRate(curMap.get("会员VPC"),maxMap.get("会员VPC")));
//            rateMap.put("非会员关联销售订单占比",getRate(curMap.get("非会员关联销售订单占比"),maxMap.get("非会员关联销售订单占比")));
//            rateMap.put("销件数",getRate(curMap.get("销件数"),maxMap.get("销件数")));



            resultMap.put("curMap",curMap);
            resultMap.put("rateMap",rateMap);
            resultList.add(resultMap);
        }

        return resultList;
    }

    private Double  getRate(Object curValueStr, Object maxValueStr) {
        Double result=null;
        if (maxValueStr == null || curValueStr == null ) {
            result= 0.0 ;
        } else {
            Double  maxValue =Double.parseDouble(maxValueStr.toString());
            Double  curValue =Double.parseDouble(curValueStr.toString());
            if(maxValue==0){
                result= 0.0 ;
            }else{
                BigDecimal bg = new BigDecimal((100.0*curValue)/(1.0*maxValue));
                result= bg.setScale(1, BigDecimal.ROUND_HALF_UP).doubleValue();
            }
        }
        return result;
    }
        /**
         * 集团概览-概览数据
         * @param jdbcBean
         * @param queryParameter
         * @param percentageStatus 0指不查询百分比，1指查询百分比
         * @return
         */
    private Object queryOverview(JdbcBean jdbcBean, QueryParameter queryParameter,Integer percentageStatus)throws Exception{
        Map<String, Object> resultMap = new LinkedHashMap();
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar=Calendar.getInstance();
        String nowDateStr=sdfDate.format(calendar.getTime());
        Integer nowHour=calendar.get(Calendar.HOUR_OF_DAY);
        String findMaxDateSql="SELECT DISTINCT CONCAT(date,' ',hour) AS maxDate FROM TD_METRIC_FACT WHERE date <'"+nowDateStr+"' OR (date='"+nowDateStr+"' AND hour <= "
                +nowHour+") ORDER BY date desc,hour desc limit 2";
        List<Map<String, Object>> maxDateMapList=queryForList(jdbcBean,findMaxDateSql);
        if(maxDateMapList.size()<2){
            return null;
        }
        String maxTime=(String)maxDateMapList.get(1).get("maxDate");
        SimpleDateFormat sdfAll = new SimpleDateFormat("yyyy-MM-dd HH");
        Date currentDate=sdfAll.parse(maxTime);
        DateUtil dateUtil=new DateUtil(currentDate);
        //当前日期
        String currentDateStr=dateUtil.getCurrentDateStr();
        //当前小时
        Integer currentHour=dateUtil.getCurrentHour();
        //昨天日期
        String yestodayDateStr=dateUtil.getBeforeDaysDateStr(1);
        //前第7天日期
        String beforeSevenDayDateStr=dateUtil.getBeforeDaysDateStr(7);
        //前第8天日期
        String beforeEightDayDateStr=dateUtil.getBeforeDaysDateStr(8);
        //前第14天日期
        String beforeFourteenDayDateStr=dateUtil.getBeforeDaysDateStr(14);
        //当前小时
        String currentHourToNextHour=dateUtil.getSomeHourToOtherHour(0,1);
        //7天到1天前
        String beforeSevenToOne=dateUtil.getBeforeSomeDaysToSomeDays(7,1);
        //14天到8天前
        String beforeFourteenToEight=dateUtil.getBeforeSomeDaysToSomeDays(14,8);
        //截止当前小时
        String endCurrentHour=dateUtil.getEndHour(1);



        String filterSql =getWhereSqlStr(queryParameter);

        String totalRealTimeSql = "SELECT COALESCE(SUM(hour_users),0) AS total,'"+currentHourToNextHour+"' AS time FROM TD_METRIC_FACT " +
                "WHERE date = '"+currentDateStr+"' AND hour = "+currentHour+" "+filterSql;
        String yesterdayRealTimeSql = "SELECT COALESCE(SUM(hour_users),0) AS before_total,'昨日' AS before_time FROM TD_METRIC_FACT " +
                "WHERE date = '"+yestodayDateStr+"' AND hour = "+currentHour+" "+filterSql;
        String projectRealTimeSql = "SELECT project_name,COALESCE(SUM(hour_users),0) AS project_count  FROM TD_METRIC_FACT " +
                "WHERE date = '"+currentDateStr+"' AND hour = "+currentHour+" "+filterSql+"  GROUP BY project_name ORDER BY project_count DESC,project_name ASC  LIMIT 5";
        resultMap.put("实时入店客流", mergeData(jdbcBean, totalRealTimeSql, yesterdayRealTimeSql, projectRealTimeSql,percentageStatus,queryParameter.isShowSql()));

        String totalEndTimeSql = "SELECT COALESCE(SUM(end_hour_users),0) AS total,'"+endCurrentHour+"' AS time FROM TD_METRIC_FACT " +
                "WHERE date = '"+currentDateStr+"' AND hour = "+currentHour+" "+filterSql;
        String yesterdayEndTimeSql = "SELECT COALESCE(SUM(end_hour_users),0) AS before_total,'昨日' AS before_time FROM TD_METRIC_FACT " +
                "WHERE date = '"+yestodayDateStr+"' AND hour = "+currentHour+" "+filterSql;
        String projectEndTimeSql = "SELECT project_name,COALESCE(SUM(end_hour_users),0) AS project_count  FROM TD_METRIC_FACT " +
                "WHERE date = '"+currentDateStr+"' AND hour = "+currentHour+" "+filterSql+" GROUP BY project_name ORDER BY project_count DESC,project_name ASC LIMIT 5";
        resultMap.put("今日累计入店客流", mergeData(jdbcBean, totalEndTimeSql, yesterdayEndTimeSql, projectEndTimeSql,percentageStatus,queryParameter.isShowSql()));

        String totalSevenDayInShopSql = "SELECT COALESCE(SUM(active_users),0) AS total,'" +beforeSevenToOne +"' AS time " +
                "FROM TD_METRIC_DAY WHERE date<='"+yestodayDateStr+"' AND date>='"+beforeSevenDayDateStr+"'"+filterSql;
        String beforeSevenDayInShopSql = "SELECT COALESCE(SUM(active_users),0) AS before_total,'" +beforeFourteenToEight+ "' AS before_time " +
                "FROM TD_METRIC_DAY WHERE date<='"+beforeEightDayDateStr+"' AND date>='"+beforeFourteenDayDateStr+"'"+filterSql;
        String projectSevenDayInShopSql = "SELECT project_name,COALESCE(SUM(active_users),0) AS project_count " +
                "FROM TD_METRIC_DAY WHERE date<='"+yestodayDateStr+"' AND date>='"+beforeSevenDayDateStr+"' "+filterSql
                +" GROUP BY project_name ORDER BY project_count DESC,project_name ASC  LIMIT 5";
        resultMap.put("近7日入店客流", mergeData(jdbcBean, totalSevenDayInShopSql, beforeSevenDayInShopSql, projectSevenDayInShopSql,percentageStatus,queryParameter.isShowSql()));

        String totalActivePercentSql = "SELECT CONCAT (ROUND(COALESCE(SUM(high_active_users)/SUM(active_users),0)*100,1),'%') AS total,'" +beforeSevenToOne +"' AS time " +
                "FROM TD_METRIC_DAY WHERE date<='"+yestodayDateStr+"' AND date>='"+beforeSevenDayDateStr+"'"+filterSql;
        String beforeActivePercentSql = "SELECT CONCAT (ROUND(COALESCE(SUM(high_active_users)/SUM(active_users),0)*100,1),'%') AS before_total,'" +
                beforeFourteenToEight+"' AS before_time " +
                "FROM TD_METRIC_DAY WHERE date<='"+beforeEightDayDateStr+"' AND date>='"+beforeFourteenDayDateStr+"'"+filterSql;
        String projectActivePercentSql = "SELECT project_name,CONCAT (ROUND(COALESCE(SUM(high_active_users)/SUM(active_users),0)*100,1),'%') AS project_count " +
                "FROM TD_METRIC_DAY WHERE date<='"+yestodayDateStr+"' AND date>='"+beforeSevenDayDateStr+"' "+filterSql
                +"  GROUP BY project_name ORDER BY project_count DESC,project_name ASC  LIMIT 5";
        resultMap.put("近7日高活跃客流占比", mergeData(jdbcBean, totalActivePercentSql, beforeActivePercentSql, projectActivePercentSql, 0,queryParameter.isShowSql()));

        return resultMap;
    }

    private Object mergeData(JdbcBean jdbcBean,String totalSqlQuery,String beforeSqlQuery,String projectSqlQuery,Integer status,boolean showSql){
        Map<String,Object>resultMap=new LinkedHashMap();
        if(showSql){
            resultMap.put("total",totalSqlQuery);
            resultMap.put("before",beforeSqlQuery);
            resultMap.put("project",projectSqlQuery);
            return resultMap;
        }
        Map<String, Object> totalResultMap=queryForMap(jdbcBean,totalSqlQuery);
        Map<String, Object> beforeResultMap=queryForMap(jdbcBean,beforeSqlQuery);
        List<Map<String, Object>> projectResultMapList=queryForList(jdbcBean,projectSqlQuery);
        if(status==1){
            Object total=totalResultMap.get("total");
            if(total!=null){
                double totalCount=((BigDecimal)total).doubleValue();
                if(totalCount!=0){
                    for(Map<String, Object> brandResultMap:projectResultMapList){
                        double brandCount=((BigDecimal)brandResultMap.get("project_count")).doubleValue();
                        double percentage = new BigDecimal(brandCount/totalCount*100).setScale(1, BigDecimal.ROUND_HALF_UP).doubleValue();
                        brandResultMap.put("percentage",percentage+"%");
                    }
                }
            }
        }
        resultMap.put("total",totalResultMap);
        resultMap.put("before",beforeResultMap);
        resultMap.put("project",projectResultMapList);
        return resultMap;
    }

    private Map<String,Object> getCityMap(JdbcBean jdbcBean,String whereSql,String topNLimitBySql,Integer allActiveUsers,Integer cityLevel,boolean showSql){
        return getCityMap(jdbcBean,whereSql+" AND city_level = "+cityLevel,topNLimitBySql,allActiveUsers,showSql);
    }

    private Map<String,Object> getCityMap(JdbcBean jdbcBean,String whereSql,String topNLimitBySql,Integer allActiveUsers,boolean showSql){
        Map<String,Object> cityResultMap=new LinkedHashMap();
        //查询某等级城市总入店客流
        String cityActiveUsersSql = "SELECT SUM(active_users) AS all_active_users,COUNT(distinct project_name) AS all_city_count FROM TD_METRIC_DAY WHERE 1=1 "+whereSql;
        String  topNCitySql="SELECT city AS name,SUM(active_users) AS value FROM TD_METRIC_DAY WHERE 1=1 "+whereSql
                + " GROUP BY city order by value desc" + topNLimitBySql;

        if(showSql){
            cityResultMap.put("总入店客流sql",cityActiveUsersSql);
            cityResultMap.put("topN城市sql",topNCitySql);
            return cityResultMap;
        }
        Map<String,Object> cityActiveUsersMap =queryForMap(jdbcBean,cityActiveUsersSql);
        Integer cityActiveUsers=0;
        if(cityActiveUsersMap.get("all_active_users")!=null) {
            cityActiveUsers = ((BigDecimal) cityActiveUsersMap.get("all_active_users")).intValue();
        }
        Long cityCount=(Long) cityActiveUsersMap.get("all_city_count");
        List<Map<String,Object>>cityMapList =queryForList(jdbcBean,topNCitySql);
        if(cityCount>cityMapList.size()){
//            Map<String,Object>otherCityMap=new LinkedHashMap();
//            Integer otherCityActiveUser=cityActiveUsers;
            Integer sumTopN=0;
            for(Map<String,Object> cityMap:cityMapList){
                Integer cityActiveUser=((BigDecimal) cityMap.get("value")).intValue();
                sumTopN += cityActiveUser;
//                otherCityActiveUser -=cityActiveUser;
            }
//            otherCityMap.put("name","其他");
//            otherCityMap.put("value",otherCityActiveUser);
//            cityMapList.add(otherCityMap);
        }
        cityResultMap.put("data",cityMapList);
        if(allActiveUsers==0){
            cityResultMap.put("cityActiveUsers",cityActiveUsers); // 总人数
//            cityResultMap.put("proportion",new BigDecimal(cityActiveUsers/cityActiveUsers.doubleValue()).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
            cityResultMap.put("proportion","100.0%");
        }else{
            cityResultMap.put("proportion",new BigDecimal(cityActiveUsers*100.0/allActiveUsers.doubleValue()).setScale(1, BigDecimal.ROUND_HALF_UP).doubleValue()+"%");
        }

        return cityResultMap;
    }
    /**
     * 运营概览-销售树
     */
    private Object getSalesTree(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        Map<String, Object> resultMap = new LinkedHashMap();
        int startTimes=1;
        int endTimes=30;
        if(queryParameter.getStartDateFilter()==null&&queryParameter.getEndDateFilter()==null){
            Date nowDate=new Date();
            DateUtil dateUtil=new DateUtil(nowDate);
            String endDateStr=dateUtil.getBeforeDaysDateStr(startTimes);
            String startDateStr=dateUtil.getBeforeDaysDateStr(endTimes-startTimes+1);
            Filter startDateFilter=new Filter();
            startDateFilter.setField("date");
            startDateFilter.setOperator(">=");
            startDateFilter.setValue(startDateStr);
            queryParameter.getDateFilters().add(startDateFilter);
            Filter endDateFilter=new Filter();
            endDateFilter.setField("date");
            endDateFilter.setOperator("<=");
            endDateFilter.setValue(endDateStr);
            queryParameter.getDateFilters().add(endDateFilter);
        }
        String whereSql=getWhereSqlWithWhereStr(queryParameter);
        String dateInterval=getDateInterval(queryParameter);

        QueryParameter lrrQueryParameter=getLRRQueryParameter(queryParameter);

        String lrrWhereSql=getWhereSqlWithWhereStr(lrrQueryParameter);
        String lrrDateInterval=getDateInterval(lrrQueryParameter);
        String seventSalesSql = "SELECT COALESCE(SUM(sales_amount),0) AS 销售金额,COALESCE(SUM(order_count),0) AS 订单数," +
                " COALESCE(ROUND(sum(sales_amount)/sum(order_count),1),0) AS 客单价VPC,COALESCE(SUM(active_users),0) AS 入店客流," +
                "CONCAT(ROUND(COALESCE(SUM(order_count)/SUM(active_users),0)*100,1),'%')  AS 转化率,COALESCE(ROUND(sum(sales_amount)/sum(sales_count),1),0) AS 件单价ASP," +
                "COALESCE(ROUND(sum(sales_count)/sum(order_count),2),0) AS 搭配率IPC," +
                "'"+dateInterval+"' AS time " +
                "FROM TD_METRIC_DAY " +whereSql;
        String beforeSalesSql = "SELECT COALESCE(SUM(sales_amount),0) AS 销售金额,COALESCE(SUM(order_count),0) AS 订单数," +
                "COALESCE(ROUND(sum(sales_amount)/sum(order_count),1),0) AS 客单价VPC,COALESCE(SUM(active_users),0) AS 入店客流," +
                "CONCAT(ROUND(COALESCE(SUM(order_count)/SUM(active_users),0)*100,1),'%') AS 转化率,COALESCE(ROUND(sum(sales_amount)/sum(sales_count),1),0) AS 件单价ASP," +
                "COALESCE(ROUND(sum(sales_count)/sum(order_count),2),0) AS 搭配率IPC," +
                "'"+lrrDateInterval+"' AS time FROM TD_METRIC_DAY " +lrrWhereSql;
        if(queryParameter.isShowSql()){
            return seventSalesSql+" union "+beforeSalesSql;
        }
        List<Map<String,Object>>queryMapList =queryForList(jdbcBean,seventSalesSql+" union "+beforeSalesSql);
        for(Map<String,Object> queryMap:queryMapList){
            Object dateTime=queryMap.get("time");
            for(String key:queryMap.keySet()){
                if(!"time".equals(key)){
                    if(resultMap.containsKey(key)){
                        List<Map<String,Object>> metricList=(List<Map<String,Object>>)resultMap.get(key);
                        Map<String,Object> oneMetricMap=new LinkedHashMap();
                        oneMetricMap.put("metric",queryMap.get(key));
                        oneMetricMap.put("date",dateTime);
                        metricList.add(oneMetricMap);
                    }else{
                        List<Map<String,Object>> metricList=new ArrayList<>();
                        Map<String,Object> oneMetricMap=new LinkedHashMap();
                        oneMetricMap.put("metric",queryMap.get(key));
                        oneMetricMap.put("date",dateTime);
                        metricList.add(oneMetricMap);
                        resultMap.put(key,metricList);
                    }
                }
            }
        }
        return resultMap;
    }

    private String getDateInterval(QueryParameter queryParameter)throws Exception{
        if(queryParameter.getDateGranularity()==0){
            SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");
            SimpleDateFormat sdfConverDate = new SimpleDateFormat("M.dd");
            Date startDate=sdfDate.parse(queryParameter.getStartDateFilter().getStringValue());
            Date endDate=sdfDate.parse(queryParameter.getEndDateFilter().getStringValue());
            return sdfConverDate.format(startDate)+"-"+sdfConverDate.format(endDate);
        }else if(queryParameter.getDateGranularity()==1){
            SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM");
            SimpleDateFormat sdfConverDate = new SimpleDateFormat("yy.M");
            Date startDate=sdfDate.parse(queryParameter.getStartDateFilter().getStringValue());
            Date endDate=sdfDate.parse(queryParameter.getEndDateFilter().getStringValue());
            return sdfConverDate.format(startDate)+"-"+sdfConverDate.format(endDate);
        }else if(queryParameter.getDateGranularity()==2){
            SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-ww");
            SimpleDateFormat sdfConverDate = new SimpleDateFormat("yy.w");
            Date startDate=sdfDate.parse(queryParameter.getStartDateFilter().getStringValue());
            Date endDate=sdfDate.parse(queryParameter.getEndDateFilter().getStringValue());
            return sdfConverDate.format(startDate)+"-"+sdfConverDate.format(endDate);
        }
        return null;
    }



    private String getBeforeWhereSql(QueryParameter queryParameter){
        StringBuilder beforeWheresql=new StringBuilder();
        beforeWheresql.append(" WHERE 1=1 ");
        String startDate=null;
        String endDate=null;
        for(Filter filter:queryParameter.getFilters()){
            Object value=filter.getValue();
            if(!"date".equals(filter.getField())) {
                beforeWheresql.append(" AND " + filter.getField() + " " + filter.getOperator() + " '" + value + "'");
            }else if(">=".equals(filter.getOperator())){
                startDate=(String)filter.getValue();
            }else if("<=".equals(filter.getOperator())){
                endDate=(String)filter.getValue();
            }
        }
        beforeWheresql.append(" AND date >=date_add('"+startDate+"',interval TO_DAYS('"+startDate+"')-TO_DAYS('"+endDate+"')-1 day) " +
                "AND  date<=date_add('"+endDate+"',interval TO_DAYS('"+startDate+"')-TO_DAYS('"+endDate+"')-1 day)");
        return beforeWheresql.toString();
    }

    /**
     * 获取环比日期查询字符串
     * @param queryParameter
     * @return
     */
    private String getRadioDateStr(QueryParameter queryParameter){
        String startDate=null;
        String endDate=null;
        List<Filter> filterList=queryParameter.getDateFilters();
        if(filterList.size()==0){
            filterList=queryParameter.getFilters();
        }
        for(Filter filter:filterList){
            if("date".equals(filter.getField())) {
                if(">=".equals(filter.getOperator())){
                    startDate=(String)filter.getValue();
                }else if("<=".equals(filter.getOperator())){
                    endDate=(String)filter.getValue();
                }
            }
        }
        return "date_add(date,interval TO_DAYS('"+endDate+"')-TO_DAYS('"+startDate+"')-1 day)";
    }

    /**
     *订单分析-明细数据
     */
    private Object getOrderDetail(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        jdbcBean.setTableName("TD_METRIC_DAY");
        return getlrrResult(jdbcBean,queryParameter);
    }

    /**
     * 获取环比数据结果
     * @param jdbcBean
     * @param queryParameter
     * @return
     * @throws Exception
     */
    private Object getlrrResult(JdbcBean jdbcBean,QueryParameter queryParameter)throws Exception{
        Map<String, Object> resultMap = new LinkedHashMap();
        //总条数
        Long count=0L;
        String querySql=assemblingSql(jdbcBean,queryParameter);
        if(queryParameter.isShowSql()){
            resultMap.put("当前时间Sql",querySql);
        }
        List<Map<String,Object>>queryMapList =queryForList(jdbcBean,querySql);
        changeNullToZero(queryParameter,queryMapList);
        if(queryMapList.size()>0){
            //如果为升序，则为
            boolean isAsc=true;
            if(queryParameter.getOrderBy().size()>0&&"DESC".equals(queryParameter.getOrderBy().get(0).getFunction().toUpperCase())){
                isAsc=false;
            }
            int diffTimes=getTimeInterval(queryParameter);
            String dateDimensionName=queryParameter.getDateFilters().get(0).getField();
            if(queryParameter.getDateDimensions().size()>0){
                dateDimensionName=queryParameter.getDateDimensions().get(0).getResultAlias();
            }

            QueryParameter lrrQueryParameter =getLRRQueryParameter(queryParameter,queryMapList,diffTimes,dateDimensionName,isAsc);
            String lrrQuerySql=assemblingSql(jdbcBean,lrrQueryParameter);

            if(queryParameter.isShowSql()){
                resultMap.put("环比时间Sql",lrrQuerySql);
                return resultMap;
            }

            List<Map<String,Object>>lrrQueryMapList =queryForList(jdbcBean,lrrQuerySql);
            changeNullToZero(queryParameter,lrrQueryMapList);
            int lrrIndex=0;
            List<Metric>metricList=queryParameter.getMetrics();
            //如果查询时按时间维度分组查询，则按照每个时间点进行环比，否则按照汇总值环比
            if(queryParameter.getDateDimensions().size()>0){
                for(Map<String,Object> queryResultMap:queryMapList){
                    String dateDimensionValue=(String)queryResultMap.get(dateDimensionName);
                    int timeInterval=0;
                    Map<String,Object> lrrQueryResultMap=null;
                    while (lrrQueryMapList.size()>lrrIndex){
                        lrrQueryResultMap=lrrQueryMapList.get(lrrIndex);
                        String lrrDateDimensionValue=(String)lrrQueryResultMap.get(dateDimensionName);
                        timeInterval=getTimeInterval(queryParameter.getDateGranularity(),lrrDateDimensionValue,dateDimensionValue);
                        //如果为升序，则间隔时间大于环比时间时退出，反之降序时，间隔时间小于环比时间时退出
                        if(isAsc&&timeInterval<=diffTimes){
                            break;
                        }else if(!isAsc&&timeInterval>=diffTimes){
                            break;
                        }
                        lrrIndex++;
                    }
                    if(diffTimes==timeInterval){
                        computeRadio(metricList,queryResultMap,lrrQueryResultMap);
                        lrrIndex++;
                    }else {
                        for(Metric metric:metricList){
                            String metricName=metric.getResultAlias();
                            Object metricObject=queryResultMap.get(metricName);
                            setlrrMap(queryResultMap,metricName,metricObject,"0.0%","UP");
                        }
                    }
                }
            }else{
                Map<String,Object> queryResultMap=queryMapList.get(0);
                Map<String,Object> lrrQueryResultMap=lrrQueryMapList.get(0);
                computeRadio(metricList,queryResultMap,lrrQueryResultMap);
            }

            String queryCountSql = assemblingPageCountSql(queryParameter);
            Map<String,Object> queryMapCountMap =queryForMap(jdbcBean,queryCountSql);
            count=(Long) queryMapCountMap.get("pageCount");
        }
        changeNullToZero(queryParameter,queryMapList);
        resultMap.put("total",count);
        resultMap.put("data",queryMapList);
        return resultMap;
    }

    private void computeRadio(List<Metric>metricList,Map<String,Object> queryResultMap,Map<String,Object> lrrQueryResultMap){
        for (Metric metric : metricList) {
            String metricName = metric.getResultAlias();
            Object metricObject = queryResultMap.get(metricName);
            double metricValue;
            double lrrMetricValue;
            if(metricObject instanceof Integer){
                metricValue = ((Integer) metricObject).doubleValue();
                lrrMetricValue = ((Integer) lrrQueryResultMap.get(metricName)).doubleValue();
            }else{
               metricValue = ((BigDecimal) metricObject).doubleValue();
               lrrMetricValue = ((BigDecimal) lrrQueryResultMap.get(metricName)).doubleValue();
            }
            if (lrrMetricValue == 0) {
                setlrrMap(queryResultMap, metricName, metricObject, "0.0%", "UP");
            } else {
                double percentage = new BigDecimal(abs(metricValue - lrrMetricValue) / lrrMetricValue * 100).setScale(1, BigDecimal.ROUND_HALF_UP).doubleValue();
                queryResultMap.remove(metricName);
                queryResultMap.put(metricName, metricObject);
                queryResultMap.put(metricName + "_环比", percentage + "%");
                queryResultMap.put(metricName + "_环比_状态", metricValue >= lrrMetricValue ? "UP" : "DOWN");
            }
        }
    }


    private void setlrrMap(Map<String,Object> queryResultMap,String metricName,Object metricObject,Object lrrPercentage,Object lrrStatus){
        queryResultMap.remove(metricName);
//        if(metricObject!=null){
            queryResultMap.put(metricName,metricObject);
//        }else {
//            queryResultMap.put(metricName,0);
//        }
        queryResultMap.put(metricName+"_环比",lrrPercentage);
        queryResultMap.put(metricName+"_环比_状态",lrrStatus);
    }

//    private Object getOrderDetail(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
//        Map<String, Object> resultMap = new LinkedHashMap();
//        String whereSql=getWhereSqlWithWhereStr(queryParameter);
//        String lrrWhereSql=getLRRWhereSqlWithWhereStr(queryParameter);
//        String limitBySql=getLimitSqlStr(queryParameter);
//        String radioDateStr=getRadioDateStr(queryParameter);
//
//        String querySql = "SELECT REPORT_TEMP_A.date AS 时间,REPORT_TEMP_A.sales_amount AS 销售金额," +
//                "CONCAT(ROUND(ABS(REPORT_TEMP_A.sales_amount-REPORT_TEMP_B.sales_amount)/REPORT_TEMP_B.sales_amount*100,2),'%') AS 销售金额_环比," +
//                "(CASE WHEN REPORT_TEMP_A.sales_amount>=REPORT_TEMP_B.sales_amount THEN 'UP' ELSE 'DOWN' END) AS 销售金额_环比_状态," +
//                "REPORT_TEMP_A.vip_sales_amount AS 会员成交金额," +
//                "CONCAT(ROUND(ABS(REPORT_TEMP_A.vip_sales_amount-REPORT_TEMP_B.vip_sales_amount)/REPORT_TEMP_B.vip_sales_amount*100,2),'%') AS 会员成交金额_环比," +
//                "(CASE WHEN REPORT_TEMP_A.vip_sales_amount>=REPORT_TEMP_B.vip_sales_amount THEN 'UP' ELSE 'DOWN' END) AS 会员成交金额_环比_状态," +
//                "REPORT_TEMP_A.non_vip_sales_amount AS 非会员成交金额," +
//                "CONCAT(ROUND(ABS(REPORT_TEMP_A.non_vip_sales_amount-REPORT_TEMP_B.non_vip_sales_amount)/REPORT_TEMP_B.non_vip_sales_amount*100,2),'%') AS 非会员成交金额_环比," +
//                "(CASE WHEN REPORT_TEMP_A.non_vip_sales_amount>=REPORT_TEMP_B.non_vip_sales_amount THEN 'UP' ELSE 'DOWN' END) AS 非会员成交金额_环比_状态 " +
//                "FROM " +
//                "(SELECT date,sales_amount,vip_sales_amount,non_vip_sales_amount FROM TD_METRIC_DAY "+whereSql+") AS REPORT_TEMP_A LEFT JOIN " +
//                "(SELECT "+radioDateStr+" AS date,sales_amount,vip_sales_amount,non_vip_sales_amount FROM TD_METRIC_DAY "+lrrWhereSql+") AS REPORT_TEMP_B " +
//                "ON REPORT_TEMP_A.date=REPORT_TEMP_B.date ORDER BY '时间' "+limitBySql;
//        if(queryParameter.isShowSql()){
//            return querySql;
//        }
//        List<Map<String,Object>>queryMapList =queryForList(jdbcBean,querySql);
//        String queryCountSql = "SELECT COUNT(*) AS pageCount FROM TD_METRIC_DAY "+whereSql;
//        Map<String,Object> queryMapCountMap =queryForMap(jdbcBean,queryCountSql);
//        Long count=(Long) queryMapCountMap.get("pageCount");
//        resultMap.put("total",count);
//        resultMap.put("data",queryMapList);
//        return resultMap;
//    }

    /**
     *获取时间间隔
     * @param queryParameter
     * @return
     * @throws Exception
     */
    public static Integer getTimeInterval(QueryParameter queryParameter)throws Exception{
        String startDateStr=queryParameter.getStartDateFilter().getStringValue();
        String endDateStr=queryParameter.getEndDateFilter().getStringValue();
        return getTimeInterval(queryParameter.getDateGranularity(),startDateStr,endDateStr);
    }
    /**
     *获取时间间隔
     * @param dateGranularity
     * @return
     * @throws Exception
     */
    public static Integer getTimeInterval(Integer dateGranularity,String startDateStr,String endDateStr)throws Exception{
        int diffTimes=0;
        if(dateGranularity==0){
            SimpleDateFormat dateSdf = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate=dateSdf.parse(startDateStr);
            Date endDate=dateSdf.parse(endDateStr);
            diffTimes=getDiffDays(startDate,endDate);
        }else if(dateGranularity==1){
            SimpleDateFormat dateSdf = new SimpleDateFormat("yyyy-MM");
            Date startDate=dateSdf.parse(startDateStr);
            Date endDate=dateSdf.parse(endDateStr);
            diffTimes=getDiffMonth(startDate,endDate);
        }else if(dateGranularity==2){
            LocalDate startDate= LocalDate.parse(startDateStr, DateTimeFormat.forPattern("yyyy-ww"));
            LocalDate endDate= LocalDate.parse(endDateStr, DateTimeFormat.forPattern("yyyy-ww"));

            diffTimes=getDiffWeek(startDate,endDate);
        }
        return diffTimes;
    }
    /**
     *获取环比查询参数
     * @param queryParameter
     * @return
     * @throws Exception
     */
    public static QueryParameter getLRRQueryParameter(QueryParameter queryParameter)throws Exception{
        int diffTimes=getTimeInterval(queryParameter)+1;
        String dateDimensionName=queryParameter.getStartDateFilter().getField();
        return getLRRQueryParameter(queryParameter,null,diffTimes,dateDimensionName,false);
    }
    /**
     *获取环比查询参数
     * @param queryParameter
     * @return
     * @throws Exception
     */
    public static QueryParameter getLRRQueryParameter(QueryParameter queryParameter,List<Map<String,Object>>queryMapList,Integer diffTimes,String dateDimensionName,boolean isAsc)throws Exception{
        QueryParameter lrrQueryParameter=queryParameter.clone();
        Filter startDateFilter=queryParameter.getStartDateFilter();
        Filter endDateFilter=queryParameter.getEndDateFilter();
        String startDateStr=startDateFilter.getStringValue();
        String endDateStr=endDateFilter.getStringValue();
        if(queryMapList!=null&&queryParameter.getDateDimensions().size()>0){
            //获取查询结果中的最大日期和最小日期
            String topDimensionValue=(String)queryMapList.get(0).get(dateDimensionName);
            String bottomDimensionValue=(String)queryMapList.get(queryMapList.size()-1).get(dateDimensionName);
            if(isAsc){
                startDateStr=topDimensionValue;
                endDateStr=bottomDimensionValue;
            }else{
                startDateStr=bottomDimensionValue;
                endDateStr=topDimensionValue;
            }
        }


        if(lrrQueryParameter.getDateGranularity()==0){
            SimpleDateFormat dateSdf = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate=dateSdf.parse(startDateStr);
            Date endDate=dateSdf.parse(endDateStr);
            startDate=getCalculateDay(startDate,-diffTimes);
            endDate=getCalculateDay(endDate,-diffTimes);
            startDateFilter.setValue(dateSdf.format(startDate));
            endDateFilter.setValue(dateSdf.format(endDate));
        }else if(lrrQueryParameter.getDateGranularity()==1){
            SimpleDateFormat dateSdf = new SimpleDateFormat("yyyy-MM");
            Date startDate=dateSdf.parse(startDateStr);
            Date endDate=dateSdf.parse(endDateStr);
            startDate=getCalculateMonth(startDate,-diffTimes);
            endDate=getCalculateMonth(endDate,-diffTimes);
            startDateFilter.setValue(dateSdf.format(startDate));
            endDateFilter.setValue(dateSdf.format(endDate));
        }else if(lrrQueryParameter.getDateGranularity()==2){
//            SimpleDateFormat dateSdf = new SimpleDateFormat("yyyy-ww");
//            Date startDate=dateSdf.parse(startDateStr);
//            Date endDate=dateSdf.parse(endDateStr);
//
//            startDate=getCalculateWeek(startDate,-diffTimes);
//            endDate=getCalculateWeek(endDate,-diffTimes);
//            startDateFilter.setValue(dateSdf.format(startDate));
//            endDateFilter.setValue(dateSdf.format(endDate));

            LocalDate startDate= LocalDate.parse(startDateStr, DateTimeFormat.forPattern("yyyy-ww"));
            LocalDate endDate= LocalDate.parse(endDateStr, DateTimeFormat.forPattern("yyyy-ww"));

//            int diffTimes=getDiffWeek(startDate,endDate);

            startDateFilter.setValue(startDate.minusWeeks(diffTimes).toString("yyyy-ww"));
            endDateFilter.setValue(endDate.minusWeeks(diffTimes).toString("yyyy-ww"));
        }
        return lrrQueryParameter;
    }


    class DateUtil{
        private SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");
        private SimpleDateFormat sdfMonthDate = new SimpleDateFormat("M.dd");
        private Date currentDate;
        private String currentDateStr;
        private Integer currentHour;
        //一个小时到当前小时
        private String beforeOneToCurrentHour;

        public DateUtil(Date date){
            currentDate=date;
        }
        public String getEndHour(int somhour){
            return "截止 "+getSomeHour(somhour)+":00";
        }

        //今天日期
        public String getCurrentDateStr(){
            if(currentDateStr==null){
                initCurrentDate();
            }
            return this.currentDateStr;
        }

        public Integer getCurrentHour(){
            if(currentDateStr==null){
                initCurrentDate();
            }
            return this.currentHour;
        }

        private void initCurrentDate(){
            Calendar calendar=Calendar.getInstance();
            calendar.setTime(currentDate);
            this.currentDateStr=sdfDate.format(currentDate);
            this.currentHour=calendar.get(Calendar.HOUR_OF_DAY);
        }

        public Integer getSomeHour(int someHour){
            Calendar calendar=Calendar.getInstance();
            calendar.setTime(currentDate);
            calendar.add(Calendar.HOUR,someHour);
            return calendar.get(Calendar.HOUR_OF_DAY);
        }

        public String getBeforeDaysDateStr(int beforeDays){
            Calendar calendar=Calendar.getInstance();
            calendar.setTime(currentDate);
            calendar.add(Calendar.DATE,-beforeDays);
            return sdfDate.format(calendar.getTime());
        }

        public String getBeforeDaysMonthDateStr(int beforeDays){
            Calendar calendar=Calendar.getInstance();
            calendar.setTime(currentDate);
            calendar.add(Calendar.DATE,-beforeDays);
            return sdfMonthDate.format(calendar.getTime());
        }

        public String getSomeHourToOtherHour(int someHour,int otherHour){
            if(this.beforeOneToCurrentHour==null){
                this.beforeOneToCurrentHour=getSomeHour(someHour)+":00-"+getSomeHour(otherHour)+":00";
            }
            return this.beforeOneToCurrentHour;
        }

        public String getBeforeSomeDaysToSomeDays(int beforeAnyDays,int beforeOtherDays){
            return  getBeforeDaysMonthDateStr(beforeAnyDays)+"-"+getBeforeDaysMonthDateStr(beforeOtherDays);
        }
    }
    /**
     *
     * @param queryParameter
     * @return
     * @throws Exception
     */
    public String getLRRWhereSqlWithWhereStr(QueryParameter queryParameter)throws Exception{
        QueryParameter lrrQueryParameter=queryParameter.clone();
        Filter startDateFilter=null;
        Filter endDateFilter=null;
        for(Filter dateFilter:lrrQueryParameter.getDateFilters()){
            if("date".equals(dateFilter.getField())) {
                if(">=".equals(dateFilter.getOperator())||">".equals(dateFilter.getOperator())){
                    startDateFilter=dateFilter;
                }else if("<=".equals(dateFilter.getOperator())||"<".equals(dateFilter.getOperator())){
                    endDateFilter=dateFilter;
                }
            }
        }
        if(startDateFilter==null||endDateFilter==null){
            return null;
        }
        String startDateStr=(String)startDateFilter.getValue();
        String endDateStr=(String)endDateFilter.getValue();
        if(lrrQueryParameter.getDateGranularity()==0){
            SimpleDateFormat dateSdf = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate=dateSdf.parse(startDateStr);
            Date endDate=dateSdf.parse(endDateStr);
            int diffTimes=getDiffDays(startDate,endDate);
            startDate=getCalculateDay(startDate,-1-diffTimes);
            endDate=getCalculateDay(endDate,-1-diffTimes);
            startDateFilter.setValue(dateSdf.format(startDate));
            endDateFilter.setValue(dateSdf.format(endDate));
            return getWhereSqlWithWhereStr(lrrQueryParameter);
        }else if(lrrQueryParameter.getDateGranularity()==1){
            SimpleDateFormat dateSdf = new SimpleDateFormat("yyyy-MM");
            Date startDate=dateSdf.parse(startDateStr);
            Date endDate=dateSdf.parse(endDateStr);
            int diffTimes=getDiffMonth(startDate,endDate);
            startDate=getCalculateMonth(startDate,-1-diffTimes);
            endDate=getCalculateMonth(endDate,-1-diffTimes);
            startDateFilter.setValue(dateSdf.format(startDate));
            endDateFilter.setValue(dateSdf.format(endDate));
            return getWhereSqlWithWhereStr(lrrQueryParameter);
        }else if(lrrQueryParameter.getDateGranularity()==2){

            LocalDate startDate= LocalDate.parse(startDateStr, DateTimeFormat.forPattern("yyyy-ww"));
            LocalDate endDate= LocalDate.parse(endDateStr, DateTimeFormat.forPattern("yyyy-ww"));

            int diffTimes=getDiffWeek(startDate,endDate);

//            startDate=getCalculateWeek(startDate,-1-diffTimes);
//            endDate=getCalculateWeek(endDate,-1-diffTimes);

            startDateFilter.setValue(startDate.minusWeeks(diffTimes).toString("yyyy-ww"));
            endDateFilter.setValue(endDate.minusWeeks(diffTimes).toString("yyyy-ww"));
            return getWhereSqlWithWhereStr(lrrQueryParameter);
        }
        return null;
    }
    /**
     * 两个日期的月份差
     *
     * @param fromDate 起始日期
     *            ，toDate 结束日期
     * @return 两日期的月分差，例1998-4-21~1998-6-21 相差两个月 返回2
     * @since 0.1
     */
    public static int getDiffMonth(Date fromDate, Date toDate) {
        Calendar c = Calendar.getInstance();
        c.setTime(fromDate);
        int fromYear = c.get(Calendar.YEAR);
        int fromMonth = c.get(Calendar.MONTH) + 1;
        c.setTime(toDate);
        int toYear = c.get(Calendar.YEAR);
        int toMonth = c.get(Calendar.MONTH) + 1;
        int monthCount = 0;

        if (toYear == fromYear) {
            monthCount = toMonth - fromMonth;
        } else if (toYear - fromYear == 1) {
            monthCount = 12 - fromMonth + toMonth;
        } else {
            monthCount = 12 - fromMonth + 12 * (toYear - fromYear - 1) + toMonth;
        }
        return monthCount;
    }

    /**
     * 两个日期的周差
     *
     * @param fromDate 起始日期，toDate 结束日期
     * @return 两日期的月分差，例1998-4-21~1998-6-21 相差两个月 返回2
     * @since 0.1
     */
    public static int getDiffWeek(LocalDate fromDate, LocalDate toDate) {
        int weekCount=0;
        weekCount = (int) ((toDate.toDate().getTime() - fromDate.toDate().getTime()) / (1000*3600*24*7))+1;
        return weekCount;
    }

    /**
     * 两个日期的天数差
     *
     * @param fromDate 起始日期
     *            ，toDate 结束日期
     * @return 两日期的月分差，例1998-4-21~1998-4-25 相差两个月 返回4
     * @since 0.1
     */
    public static int getDiffDays(Date fromDate, Date toDate) {
        return (int) ((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    /**
     * 当前日期加减天数
     *
     * @param date
     * @return
     */
    public static Date getCalculateDay(Date date, int num) {

        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, num);
        date = calendar.getTime();

        return date;
    }

    /**
     * 当前日期加减周
     *
     * @param date
     * @return
     */
//    public static Date getCalculateWeek(Date date, int num) {
//        Calendar calendar = new GregorianCalendar();
//        calendar.setTime(date);
//        calendar.add(Calendar.WEEK_OF_YEAR, num);
//        date = calendar.getTime();
//
//        return date;
//    }

    /**
     * 当前日期加减月
     *
     * @param date
     * @return
     */
    public static Date getCalculateMonth(Date date, int num) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(Calendar.MONTH, num);
        date = calendar.getTime();

        return date;
    }
}
