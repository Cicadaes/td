package com.talkingdata.datacloud.visual.util;

import com.talkingdata.datacloud.ApplicationContextManager;
import com.talkingdata.datacloud.adapter.common.IDataSourceAdapter;
import com.talkingdata.datacloud.adapter.entity.*;
import com.talkingdata.datacloud.util.StringUtils;
import com.talkingdata.datacloud.visual.entity.report.DataSourceConnection;
import com.talkingdata.datacloud.visual.entity.report.DataSourceMetadata;
import com.talkingdata.datacloud.visual.entity.report.DataSourceSnapshot;
import com.talkingdata.datacloud.visual.entity.report.DataSourceSnapshotKey;
import com.talkingdata.datacloud.visual.service.report.*;
import com.talkingdata.datacloud.visual.vo.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.*;

//import com.talkingdata.datacloud.visual.vo.*;

/**
 * Created by yangruobin on 2017/5/16.
 */
public class ChartHelper {
    private static final Logger logger = LoggerFactory.getLogger(ChartHelper.class);
    private static DataSourceService dataSourceService= ApplicationContextManager.getBean(DataSourceService.class);
    private static PrivilegeService privilegeService= ApplicationContextManager.getBean(PrivilegeService.class);
    private static ConfigService configService= ApplicationContextManager.getBean(ConfigService.class);
    private static DataSourceMetadataService dataSourceMetadataService= ApplicationContextManager.getBean(DataSourceMetadataService.class);
    private static DataSourceSnapshotService dataSourceSnapshotService= ApplicationContextManager.getBean(DataSourceSnapshotService.class);

    //重新打开报表后填充查询结果到报表数据中
    public static DataSource buildChartDataSource(com.talkingdata.datacloud.visual.entity.report.Chart dbChart, List<Integer> limitList){
        QueryParameter queryParameter=new QueryParameter();
        String chartDataSource = dbChart.getChartDataConfig().getValue();
        Integer chartType = dbChart.getChartStyleConfig().getType();



        DataSource voDataSource;
        try {
            voDataSource=JSONUtils.readValueToBean(chartDataSource,DataSource.class);
            return  voDataSource;
        }catch (Exception e){
            logger.error("重新打开报表后填充查询结果到报表数据中失败",e);
            return againAssembly(dbChart,limitList);
//            return new com.talkingdata.datacloud.visual.vo.DataSource();
        }

    }



    public static DataSource againAssembly(com.talkingdata.datacloud.visual.entity.report.Chart dbChart, List<Integer> limitList){
        QueryParameter queryParameter=new QueryParameter();
        String chartDataSource = dbChart.getChartDataConfig().getValue();
        Integer chartType = dbChart.getChartStyleConfig().getType();

        Integer dataSourceId=dbChart.getDataSourceId();

        DataSource voDataSource;
        try {
            voDataSource=JSONUtils.readValueToBean(chartDataSource,DataSource.class);
            //判断是否有数据源，如果没有数据源，直接退出
            if(dataSourceId==null||dataSourceId==0){
                return voDataSource;
            }
            List<Parameter> parameterList= voDataSource.getParameters();
            for (Parameter parameter : parameterList) {
                List<Field> fieldList = parameter.getFields();
                for (Field field : fieldList) {
                    String code = field.getCode();
                    if (code.contains(DefinitionCodeType.DIMENSIONCODE)) {
                        if(field.getValue()==null||"".equals(field.getValue()))continue;
                        List<Map<String,Object>> fieldValue=(List<Map<String,Object>>)field.getValue();
                        Dimension dimensionFieldFunction=new Dimension();
                        dimensionFieldFunction.setField((String) fieldValue.get(0).get("id"));
                        queryParameter.getDimensions().add(dimensionFieldFunction);
                    } else if (code.contains(DefinitionCodeType.METRIC)) {
                        List<Map<String,Object>> fieldValue=(List<Map<String,Object>>) field.getValue();
                        for(Map<String,Object>metricMap:fieldValue){
                            Metric metricFieldFunction=new Metric();
                            metricFieldFunction.setField((String) metricMap.get("id"));
                            queryParameter.getMetrics().add(metricFieldFunction);
                        }
                    } else if (code.equals(DefinitionCodeType.DATE_CODE)) {
                        Map dateMap = (Map)field.getValue();
                        String startTime = (String) dateMap.get("start");
                        String endTime = (String) dateMap.get("end");
                        Filter startFilter = new Filter();
                        startFilter.setField("create_dt");
                        startFilter.setOperator(">=");
                        startFilter.setValue(startTime);
                        queryParameter.getFilters().add(startFilter);
                        Filter endFilter = new Filter();
                        endFilter.setField("create_dt");
                        endFilter.setOperator("<=");
                        endFilter.setValue(endTime);
                        queryParameter.getFilters().add(endFilter);
                    }
                }
            }

            if (limitList.size()>0) {
                queryParameter.setLimit(limitList);
                for(Dimension dimensionFieldFunction:queryParameter.getDimensions()){
                    OrderBy orderBy=new OrderBy();
                    orderBy.setField(dimensionFieldFunction.getField());
                    queryParameter.getOrderBy().add(orderBy);
                }
                if(chartType==4){
                    queryParameter.setQueryType(1);
                }
            }
            com.talkingdata.datacloud.visual.entity.report.DataSource dbDataSource;
            //当报表不发布时，则用显示的数据源，当报表为发布状态时，则用快照中的数据源
            if(dbChart.getStatus()!=1) {
                dbDataSource = dataSourceService.queryDataSourceConnectionByPrimaryKey(dataSourceId);
            }else{
                DataSourceSnapshotKey dataSourceSnapshotKey=new DataSourceSnapshotKey();
                dataSourceSnapshotKey.setDataSourceId(dataSourceId);
                dataSourceSnapshotKey.setReportId(dbChart.getReportId());
                DataSourceSnapshot dataSourceSnapshot=dataSourceSnapshotService.selectByPrimaryKey(dataSourceSnapshotKey);
                dbDataSource = dataSourceSnapshot2DataSource(dataSourceSnapshot);
            }
            queryParameter.setDataSourceConnectionInfo(dbDataSource.getDataSourceConnection().getParams());
            queryParameter.setDataSourceName(dbDataSource.getMappedDataSource());
            //获取adapter
            IDataSourceAdapter adapter = DataSourceHelper.findAdapter(dbDataSource.getDataSourceConnection());
            //通过Adapter获取获取
            Object dataObject = adapter.findData(queryParameter);

            //把日期转为yyyy-MM-dd格式，因为其他方法中的日期仍然要转为yyyy-MM-dd HH:mm:ss格式，所以单独转换。
            String resultJson=JSONUtils.writeValueAsCunstomString(dataObject,"yyyy-MM-dd");
            List<Map<String, Object>> dataResult=JSONUtils.readValueToBean(resultJson,List.class);

            voDataSource.setData(dataResult);
            return  voDataSource;
        }catch (Exception e){
            logger.error("重新打开报表后填充查询结果到报表数据中失败",e);
            return new com.talkingdata.datacloud.visual.vo.DataSource();
        }
    }

    //首次打开报表后填充数据源、维度、指标及查询结果到渲染面板中
    public static void fillVoChart(List<StyleDefinition> styleDefinitionList, List<com.talkingdata.datacloud.visual.entity.report.DataSource> dbDataSourceList) throws Exception {
        if(dbDataSourceList.size()==0){
            return;
        }
        //获取指标
        List<DataSourceMetadata>metricList=dataSourceMetadataService.getMetricList(dbDataSourceList.get(0).getId());
        //获取普通维度
        List<DataSourceMetadata> dimensionList= dataSourceMetadataService.getAllDimentsionList(dbDataSourceList.get(0).getId());
        int dimensionIndex=0;
        int measureIndex=0;

        for(com.talkingdata.datacloud.visual.vo.StyleDefinition styleDefinition:styleDefinitionList){
            for(FieldTab fieldTab:styleDefinition.getView().getFieldTabs()){
                for(FieldGroup fieldGroup:fieldTab.getFieldGroups()){
                    for(Field field:fieldGroup.getFields()){
                        if(field.getCode().equals(DefinitionCodeType.DATASOURCE_CODE)){
                            List<Map<String,Object>>  optionValueMapList=list2MapList(dbDataSourceList);
                            field.setOptionValues(optionValueMapList);
                            Object defaultValue=getDefaultValue(optionValueMapList.get(0),field.getValueType());
                            field.setDefaultValue(defaultValue);
                            field.setValue(defaultValue);
                        }else if(field.getCode().equals(DefinitionCodeType.DATE_CODE)){
                            Date nowDate=new Date();
                            Calendar startTime = Calendar.getInstance();
                            startTime.setTime(nowDate);
                            startTime.add(Calendar.MONTH,-1);
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                            Map<String,Object> timeMap=new HashMap<>();
                            timeMap.put("start",sdf.format(startTime.getTime()));
                            timeMap.put("end",sdf.format(nowDate));
                            timeMap.put("status",1);
                            field.setValue(timeMap);
                        }else if(field.getCode().contains("dimension")){
                            List<Map<String, Object>> dimensionMapList=list2MapList(dimensionList);
                            field.setOptionValues(dimensionMapList);
                            if(field.getRequried()==0&&dimensionMapList.size()>0){
                                Object defaultValue =  getDefaultValue(dimensionMapList.get(dimensionIndex++%dimensionMapList.size()),field.getValueType());
                                field.setValue(defaultValue);
                                field.setDefaultValue(defaultValue);
                            }
                        }else if(field.getCode().contains(DefinitionCodeType.METRIC)){
                            List<Map<String, Object>> metricMapList=list2MapList(metricList);
                            if(field.getRequried()==0) {
                                Object defaultValue =  getDefaultValue(metricMapList.get(measureIndex++ % metricMapList.size()),field.getValueType());
                                field.setValue(defaultValue);
                                field.setDefaultValue(defaultValue);
                            }
                            field.setOptionValues(metricMapList);
                        }
                    }
                }
            }
        }
    }


    private static com.talkingdata.datacloud.visual.entity.report.DataSource dataSourceSnapshot2DataSource(DataSourceSnapshot dataSourceSnapshot){
        com.talkingdata.datacloud.visual.entity.report.DataSource dbDataSource=new com.talkingdata.datacloud.visual.entity.report.DataSource();
        dbDataSource.setId(dataSourceSnapshot.getDataSourceId());
        dbDataSource.setName(dataSourceSnapshot.getName());
        dbDataSource.setMappedDataSource(dataSourceSnapshot.getMappedDataSource());
        dbDataSource.setDescription(dataSourceSnapshot.getDescription());

        DataSourceConnection dataSourceConnection=new DataSourceConnection();
        dataSourceConnection.setParams(dataSourceSnapshot.getParams());
        dataSourceConnection.setAdapterId(dataSourceSnapshot.getAdapterId());
        dbDataSource.setDataSourceConnection(dataSourceConnection);

        return dbDataSource;
    }

    private static List<Map<String,Object>> list2MapList(List list){
        List<Map<String,Object>> mapList=new ArrayList<>();
        for(Object value:list){
            mapList.add(object2Map(value));
        }
        return mapList;
    }

    public static Map<String,Object> object2Map(Object value){
        Map<String,Object> map=new HashMap<>();
        if(value instanceof String){
            map.put("id",value);
            map.put("name",value);
        }else if(value instanceof com.talkingdata.datacloud.visual.entity.report.DataSource){
            com.talkingdata.datacloud.visual.entity.report.DataSource dbDataSource=(com.talkingdata.datacloud.visual.entity.report.DataSource)value;
            map.put("id",dbDataSource.getId());
            map.put("name",dbDataSource.getName());
        }else if(value instanceof DataSourceMetadata){
            DataSourceMetadata dataSourceMetadata=(DataSourceMetadata)value;
            map.put("id",dataSourceMetadata.getMetadata());
            map.put("name",dataSourceMetadata.getMetadata());
        }
        return map;
    }

    private static Object getDefaultValue(Object value,int type)throws Exception{
        switch (type){
            case 6:
                List<Object> list=new ArrayList<>();
                list.add(value);
                return list;
            case 8:
                String conversionValue=JSONUtils.writeValueAsString(value);
                return conversionValue;
            case 9:
                Boolean bValue=(Boolean)value;
                return bValue;
            default:
                return value;
        }
    }
    //获取查询limit的临时方法
    public static List<Integer> getChartResultLimit(Style style,Integer chartType){
        List<String> limitCodeList=new ArrayList<>();
        List<Integer> resultList=new ArrayList<>();
        if(chartType==4){
            limitCodeList.add("choose_pie");
        }
        List<Parameter> parameterList= style.getParameters();
        for(int fieldGroupIndex=0;fieldGroupIndex<parameterList.size();fieldGroupIndex++){
            List<Field> fieldList=parameterList.get(fieldGroupIndex).getFields();
            for(int fieldIndex=0;fieldIndex<fieldList.size();fieldIndex++){
                for(String limitCode:limitCodeList) {
                    Field field = fieldList.get(fieldIndex);
                    if(field.getChildrenFields().size()>0){
                        for(Field childField:field.getChildrenFields()){
                            if (childField.getCode().equals(limitCode)) {
                                Integer value = (Integer) childField.getValue();
                                resultList.add(value);
                            }
                        }
                    }else{
                        if (field.getCode().equals(limitCode)) {
                            Integer value = Integer.parseInt((String) field.getValue());
                            resultList.add(value);

                        }
                    }
                }
            }
        }
        return resultList;
    }



    //获取组织机构对象
    public static Map<String, Object> getReportArgument(HttpSession session, String orgUserIdValue){
        Map<String, Object> object=(Map<String, Object>)session.getAttribute(CommonUtils.ORG_SESSION_KEY);
        String appCode=privilegeService.getAppcode();
        String orgTable=configService.getParam(CommonUtils.ORG_TABLE_KEY,appCode);
        String orgUserId=configService.getParam(CommonUtils.ORG_USER_ID_KEY,appCode);
        if(object==null&& !StringUtils.isEmpty(orgTable)&& !StringUtils.isEmpty(orgUserId)){
            object=dataSourceMetadataService.getOrgnization(orgTable,orgUserId,orgUserIdValue);
            if(object!=null){
                session.setAttribute("org",object);
            }
        }
        return object;
    }



//    public static com.talkingdata.datacloud.visual.vo.DataSource buildStyle(String chartStyle){
//        QueryParameter queryParameter=new QueryParameter();
//        Integer dataSourceId=0;
//        try {
//            Map<String,Object> chartMap=JSONUtils.readValueToMap(chartStyle);
//            List<Map<String,Object>> parameterList= (List<Map<String,Object>>)chartMap.get("parameters");
//            if(parameterList==null||parameterList.size()==0){
//                List<Object>result=new ArrayList<>();
//                Map<String, Object> resultMap=new HashMap<>();
//                result.add(resultMap);
//                chartMap.put("data",result);
//            }else {
//                for (Map parameter : parameterList) {
//                    List<Map<String, Object>> fieldList = (List<Map<String, Object>>) parameter.get("fields");
//                    for (Map field : fieldList) {
//                        String code = (String) field.get("code");
//                        if (code.contains(DefinitionCodeType.DIMENSIONCODE)) {
//                            queryParameter.getDimensions().add((String) field.get("defaultValue"));
//                        } else if (code.contains(DefinitionCodeType.METRIC)) {
//                            queryParameter.getMetrics().add((String) field.get("defaultValue"));
//                        } else if (code.equals(DefinitionCodeType.DATE_CODE)) {
//                            Map dateMap = (Map) field.get("value");
//                            String startTime = (String) dateMap.get("start");
//                            String endTime = (String) dateMap.get("end");
//                            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
//                            Date startDate = df.parse(startTime);
//                            Date endDate = df.parse(endTime);
//                            Filter filter = new Filter();
//                            filter.setField("create_dt");
//                            filter.setOperator(">=&&<=");
//                            List<Long> timeList = new ArrayList<>();
//                            timeList.add(startDate.getTime());
//                            timeList.add(endDate.getTime());
//                            filter.setValue(timeList);
//                            queryParameter.getFilters().add(filter);
//                        } else if (code.equals(DefinitionCodeType.DATASOURCE_CODE)) {
//                            String dataSourceListStr = (String) field.get("value");
//                            List<Map<String,Object>> dataSourceList= JSONUtils.readValueToBean(dataSourceListStr,List.class);
//                            dataSourceId = (Integer) dataSourceList.get(0).get("id");
//                        }
//                    }
//                }
//                DataSource dataSource = dataSourceService.selectByPrimaryKey(dataSourceId);
//                queryParameter.setDatasource(dataSource.getParams());
//
//
//                //获取adapter
//                IDataSourceAdapter adapter = DataSourceHelper.findAdapter(dataSource);
//                //通过Adapter获取获取
//                Object dataObject = adapter.findData(queryParameter);
//                chartMap.put("data", dataObject);
//            }
//            chartStyle = JSONUtils.writeValueAsCunstomString(chartMap);
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//        return  chartStyle;
//    }
}
