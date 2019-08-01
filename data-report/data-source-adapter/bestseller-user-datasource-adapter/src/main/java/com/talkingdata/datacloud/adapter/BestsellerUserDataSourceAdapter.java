package com.talkingdata.datacloud.adapter;

import com.talkingdata.datacloud.adapter.common.AbstractMysqlAdapter;
import com.talkingdata.datacloud.adapter.common.JdbcBean;
import com.talkingdata.datacloud.adapter.entity.QueryParameter;
import org.apache.commons.collections.map.HashedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.talkingdata.datacloud.adapter.util.DataBaseUtil.queryForList;
import static com.talkingdata.datacloud.adapter.util.DataBaseUtil.queryForMap;

/**
 * @author  yangruobin on 2017/9/19.
 */
public class BestsellerUserDataSourceAdapter extends AbstractMysqlAdapter {
    private static final Logger logger = LoggerFactory.getLogger(BestsellerUserDataSourceAdapter.class);

    private static Map<Integer,String>nameFMap=new LinkedHashMap<>();
    private static Map<Integer,String>nameRMap=new LinkedHashMap<>();
    private static Map<Integer,String>fineGrainClassMap=new LinkedHashMap<>();
    private static Map<Integer,String>coarseGrainClassMap=new LinkedHashMap<>();
    static{
        nameFMap.put(0,"total");
        nameFMap.put(1,"F=1");
        nameFMap.put(2,"F=2");
        nameFMap.put(3,"F=3");
        nameFMap.put(4,"F=4");
        nameFMap.put(5,"F>=5");
        nameRMap.put(0,"total");
        nameRMap.put(1,"R>360");
        nameRMap.put(2,"180<R≤360");
        nameRMap.put(3,"90<R≤180");
        nameRMap.put(4,"30<R≤90");
        nameRMap.put(5,"R<=30");
        fineGrainClassMap.put(0,"低价值");
        fineGrainClassMap.put(1,"中价值发展客户");
        fineGrainClassMap.put(2,"中价值保持客户");
        fineGrainClassMap.put(3,"中价值挽留客户");
        fineGrainClassMap.put(4,"中高价值发展客户");
        fineGrainClassMap.put(5,"中高价值保持客户");
        fineGrainClassMap.put(6,"中高价值挽留客户");
        fineGrainClassMap.put(7,"高价值客户");
        coarseGrainClassMap.put(0,"低价值客户");
        coarseGrainClassMap.put(1,"中价值客户");
        coarseGrainClassMap.put(2,"中价值客户");
        coarseGrainClassMap.put(3,"中价值客户");
        coarseGrainClassMap.put(4,"中高价值客户");
        coarseGrainClassMap.put(5,"中高价值客户");
        coarseGrainClassMap.put(6,"中高价值客户");
        coarseGrainClassMap.put(7,"高价值客户");

    }
    @Override
    public Object findData(QueryParameter queryParameter){
        String dataSourceConnectionInfo = queryParameter.getDataSourceConnectionInfo();
        JdbcBean jdbcBean = JdbcBean.getJdbcBean(dataSourceConnectionInfo, DIRVERCLASSNAME);
        try {
            if ("statistical_analysis".equals(queryParameter.getDataSourceName())) {
                return getStatisticalAnalysis(jdbcBean, queryParameter);
            }else if ("member_score".equals(queryParameter.getDataSourceName())) {
                return getMemberScore(jdbcBean, queryParameter);
            }else if ("member_class".equals(queryParameter.getDataSourceName())) {
                return getMemberClass(jdbcBean, queryParameter);
            }else if ("date_range".equals(queryParameter.getDataSourceName())) {
                return getDateRange(jdbcBean, queryParameter);
            }else if ("cycle_comparison".equals(queryParameter.getDataSourceName())) {
                return getCycleComparison(jdbcBean, queryParameter);
            }
        }catch (Exception e){
            logger.error("查询sql失败",e);
        }
        return null;

    }

    /**
     * 统计分析
     * @param jdbcBean
     * @param queryParameter
     * @return
     * @throws Exception
     */
    private Object getDateRange(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        SimpleDateFormat monthSdf = new SimpleDateFormat("yyyyMM");
        SimpleDateFormat dateSdf = new SimpleDateFormat("yyyy-MM-dd");
        List<Map<String,Object>>resultMapList=new ArrayList<>();
        //当月最后一天
        Calendar calendar=Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        //去年下一个月第一天
        Calendar lastYearNextMonthFirstDate=(Calendar) calendar.clone();
        lastYearNextMonthFirstDate.add(Calendar.YEAR, -1);
        lastYearNextMonthFirstDate.add(Calendar.MONTH, 1);
        lastYearNextMonthFirstDate.set(Calendar.DAY_OF_MONTH,1);


        for(int i=0;i<12;i++){
            calendar.add(Calendar.MONTH,-1);
            lastYearNextMonthFirstDate.add(Calendar.MONTH,-1);

            Map<String,Object> dateMap=new HashedMap();
            Date currentDate=calendar.getTime();
            String dateKey=monthSdf.format(currentDate);

            Date startDate=lastYearNextMonthFirstDate.getTime();
            String startDateValue=dateSdf.format(startDate);

            Date endDate=calendar.getTime();
            String endDateValue=dateSdf.format(endDate);

            dateMap.put("key",dateKey);
            dateMap.put("value",startDateValue+"~"+endDateValue);
            resultMapList.add(dateMap);
        }


        return resultMapList;
    }

    /**
     * 统计分析
     * @param jdbcBean
     * @param queryParameter
     * @return
     * @throws Exception
     */
    private Object getStatisticalAnalysis(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        List<Map<String,Object>>resultMapList=new ArrayList<>();
        String metric=queryParameter.getMetrics().get(0).getField();
        String whereSql=getWhereSqlWithWhereStr(queryParameter);
        String querySql = "select R,F,sum("+metric+") AS "+metric+" from bs_member_monetary "+whereSql+" group by R,F ORDER BY R DESC,F ASC";
        if(queryParameter.isShowSql()){
            return querySql;
        }
        List<Map<String,Object>>queryMapList =queryForList(jdbcBean,querySql);
        if(queryMapList.size()>0){
            int resultIndex=0;
            //初始化R的total
            Map<Integer,Double> mapR=new LinkedHashMap<>();
            for(int fIndex=1;fIndex<=5;fIndex++){
                mapR.put(fIndex,0d);
            }

            for(int rIndex=5;rIndex>=1;rIndex--){
                double sumF=0;
                for(int fIndex=1;fIndex<=5;fIndex++){
                    Map<String,Object>resultMap=queryMapList.get(resultIndex);
                    Integer resultF=(Integer)resultMap.get("F");
                    Integer resultR=(Integer)resultMap.get("R");
                    Double resultMetric=0d;
                    if(resultR==rIndex&&resultF==fIndex){
                        Object resultMetricObject=resultMap.get(metric);
                        if(resultMetricObject instanceof Integer){
                            resultMetric=((Integer)resultMetricObject).doubleValue();
                        }else if(resultMetricObject instanceof BigDecimal){
                            resultMetric=((BigDecimal)resultMetricObject).doubleValue();
                        }else {
                            resultMetric=(Double) resultMetricObject;
                        }
                        //统计F的total
                        sumF+=resultMetric;
                        //统计R的total
                        Double countMetric=mapR.get(resultF);
                        countMetric+=resultMetric;
                        mapR.put(resultF,countMetric);

                        resultIndex++;
                    }
                    insertMapToList(rIndex,fIndex,metric,resultMetric,resultMapList);
                }
                //插入F的total记录
                insertMapToList(rIndex,0,metric,sumF,resultMapList);
            }

            Double allTotal=0D;
            //插入R的total记录，并统计汇总total
            for(Integer keyF:mapR.keySet()){
                Double keyFTotal=mapR.get(keyF);
                insertMapToList(0,keyF,metric,keyFTotal,resultMapList);
                allTotal+=keyFTotal;
            }
            //插入汇总total
            insertMapToList(0,0,metric,allTotal,resultMapList);
        }
        Map<String, Object> resultMap = new LinkedHashMap();
        resultMap.put("total",resultMapList.size());
        resultMap.put("data",resultMapList);
        return resultMap;
    }


    private void insertMapToList(Integer valueR,Integer valueF,String metric,Double valueMetric,List<Map<String,Object>>resultMapList){
        Map<String,Object>insertMap= new LinkedHashMap<>();
        insertMap.put("R",nameRMap.get(valueR));
        insertMap.put("F",nameFMap.get(valueF));
        insertMap.put(metric,valueMetric);
        resultMapList.add(insertMap);
    }
    /**
     * 周期对比明细
     * @param jdbcBean
     * @param queryParameter
     * @return
     * @throws Exception
     */
    private Object getCycleComparison(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        boolean pageCount=queryParameter.isPageCount();
        queryParameter.setPageCount(false);
        queryParameter.setDataSourceName("TD_REPORT_LIFE_CYCLE");
        if(queryParameter.isShowSql()){
            jdbcBean.setTableName("TD_REPORT_LIFE_CYCLE");
            return super.assemblingSql(jdbcBean,queryParameter);
        }
        List<Map<String,Object>> resultMapList=(List<Map<String,Object>>)super.findData(queryParameter);
        List<Map<String, Object>> conversionMapList=new ArrayList<>();
        Map<String,Map<String, Object>> conversionMapMap=new LinkedHashMap<>();
        Set<String> dateSet=new HashSet<>();
        for(Map<String,Object> resultMap:resultMapList){
            String custmerClass=resultMap.get("客户分类").toString();
            String date=resultMap.get("date").toString();
            String value=resultMap.get("value").toString();
            String proportion=resultMap.get(date+"_占比").toString();
            dateSet.add(date);
            if(conversionMapMap.containsKey(custmerClass)){
                Map<String,Object> convertMap=conversionMapMap.get(custmerClass);
                convertMap.put(date,value);
                convertMap.put(date+"_占比",proportion);
            }else{
                Map<String,Object> convertMap=new LinkedHashMap();
                convertMap.put(date,value);
                convertMap.put(date+"_占比",proportion);
                conversionMapMap.put(custmerClass,convertMap);
            }
        }
        for(String key:conversionMapMap.keySet()){
            Map<String,Object> convertMap=conversionMapMap.get(key);
            Map<String,Object> convertMap2=new LinkedHashMap<>();
            convertMap2.put("客户分类",key);
            convertMap2.putAll(convertMap);
            conversionMapList.add(convertMap2);
        }
        queryParameter.setPageCount(pageCount);
        return queryPageCount(jdbcBean,queryParameter,conversionMapList);
    }

    /**
     *
     * @param jdbcBean
     * @param queryParameter
     * @return
     * @throws Exception
     */
    private Object getMemberScore(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        String tableName="bs_member_score";
        jdbcBean.setTableName(tableName);
        String querySql=assemblingSql(jdbcBean,queryParameter);
        if(queryParameter.isShowSql()){
            return querySql;
        }
        List<Map<String,Object>>queryMapList =queryForList(jdbcBean,querySql);

        String whereSql=getWhereSqlWithWhereStr(queryParameter);
        String queryTotal="SELECT SUM(total) AS total FROM "+tableName+" "+whereSql;
        Map<String,Object>totalMap =queryForMap(jdbcBean,queryTotal);

        totalMap.put("data",queryMapList);
        return totalMap;
    }

    /**
     * 客户得分
     * @param jdbcBean
     * @param queryParameter
     * @return
     * @throws Exception
     */
    private Object getMemberClass(JdbcBean jdbcBean, QueryParameter queryParameter)throws Exception{
        Map<String,Object> resultMap=new LinkedHashMap<>();
        String tableName="bs_member_class";
        jdbcBean.setTableName(tableName);
        String querySql=assemblingSql(jdbcBean,queryParameter);
        if(queryParameter.isShowSql()){
            return querySql;
        }
        List<Map<String,Object>>queryMapList =queryForList(jdbcBean,querySql);



        String sumField="member_count";
        Integer sumFieldCount=0;
        for(Map<String,Object>queryResultMap:queryMapList){
            sumFieldCount+= (Integer)queryResultMap.get(sumField);
        }

        //柱图统计
        List<Map<String,Object>>barMapList=new ArrayList<>();
        for(Map<String,Object>queryResultMap:queryMapList){
            Map<String,Object>insertBarMap= new LinkedHashMap<>();
            Integer classLabelValue=(Integer)queryResultMap.get("class_label");
            Integer memberCountValue=(Integer)queryResultMap.get("member_count");
            insertBarMap.put("name",fineGrainClassMap.get(classLabelValue));
            insertBarMap.put("value",memberCountValue);
            barMapList.add(insertBarMap);
        }

        //饼图统计
        List<Map<String,Object>>pieMapList=new ArrayList<>();
        Long lowCount=0L;
        Long mediumCount=0L;
        Long mediumHeightCount=0L;
        Long heightCount=0L;
        for(Map<String,Object>queryResultMap:queryMapList){
            Integer classLabelValue=(Integer)queryResultMap.get("class_label");
            Integer memberCountValue=(Integer)queryResultMap.get("member_count");

            if (classLabelValue==0){
                lowCount+=memberCountValue;
            }else if(classLabelValue==1||classLabelValue==2||classLabelValue==3) {
                mediumCount += memberCountValue;
            }else if(classLabelValue==4||classLabelValue==5||classLabelValue==6) {
                mediumHeightCount += memberCountValue;
            }else {
                heightCount+=memberCountValue;
            }
        }


//        Map<String,Object>insertLowPieMap= new LinkedHashMap<>();
//        insertLowPieMap.put("name","低价值客户");
//        insertLowPieMap.put("value",decimalFormat.format(lowCount*100D/sumFieldCount)+"%");
//        pieMapList.add(insertLowPieMap);
//
//        Map<String,Object>insertMediumPieMap= new LinkedHashMap<>();
//        insertMediumPieMap.put("name","中价值客户");
//        insertMediumPieMap.put("value",decimalFormat.format(mediumCount*100D/sumFieldCount)+"%");
//        pieMapList.add(insertMediumPieMap);
//
//        Map<String,Object>insertMediumHeightPieMap= new LinkedHashMap<>();
//        insertMediumHeightPieMap.put("name","中高价值客户");
//        insertMediumHeightPieMap.put("value",decimalFormat.format(mediumHeightCount*100D/sumFieldCount)+"%");
//        pieMapList.add(insertMediumHeightPieMap);
//
//        Map<String,Object>insertHeightPieMap= new LinkedHashMap<>();
//        insertHeightPieMap.put("name","高价值客户");
//        insertHeightPieMap.put("value",decimalFormat.format(heightCount*100D/sumFieldCount)+"%");
//        pieMapList.add(insertHeightPieMap);

        Map<String,Object>insertLowPieMap= new LinkedHashMap<>();
        insertLowPieMap.put("name","低价值客户");
        insertLowPieMap.put("value",lowCount);
        pieMapList.add(insertLowPieMap);

        Map<String,Object>insertMediumPieMap= new LinkedHashMap<>();
        insertMediumPieMap.put("name","中价值客户");
        insertMediumPieMap.put("value",mediumCount);
        pieMapList.add(insertMediumPieMap);

        Map<String,Object>insertMediumHeightPieMap= new LinkedHashMap<>();
        insertMediumHeightPieMap.put("name","中高价值客户");
        insertMediumHeightPieMap.put("value",mediumHeightCount);
        pieMapList.add(insertMediumHeightPieMap);

        Map<String,Object>insertHeightPieMap= new LinkedHashMap<>();
        insertHeightPieMap.put("name","高价值客户");
        insertHeightPieMap.put("value",heightCount);
        pieMapList.add(insertHeightPieMap);

        resultMap.put("total",sumFieldCount);
        resultMap.put("pie",pieMapList);
        resultMap.put("bar",barMapList);

        return resultMap;
    }
}
