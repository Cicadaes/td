package com.talkingdata.datacloud.visual.controller.report;

import com.talkingdata.datacloud.adapter.common.IDataSourceAdapter;
import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.visual.entity.report.ChartDataConfig;
import com.talkingdata.datacloud.visual.entity.report.DataSource;
import com.talkingdata.datacloud.visual.entity.report.DataSourceConnection;
import com.talkingdata.datacloud.visual.entity.report.DataSourceMetadata;
import com.talkingdata.datacloud.visual.page.report.DataSourceMetadataPage;
import com.talkingdata.datacloud.visual.service.report.ChartDataConfigService;
import com.talkingdata.datacloud.visual.service.report.DataSourceConnectionService;
import com.talkingdata.datacloud.visual.service.report.DataSourceMetadataService;
import com.talkingdata.datacloud.visual.service.report.DataSourceService;
import com.talkingdata.datacloud.visual.util.DataSourceHelper;
import com.talkingdata.datacloud.visual.util.JSONUtils;
import com.talkingdata.datacloud.visual.util.Msg;
import com.talkingdata.datacloud.visual.vo.CallBackParameter;
import com.talkingdata.datacloud.visual.vo.MetaData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.InvocationTargetException;
import java.util.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@Controller
@RequestMapping("/report")
public class DataSourceMetadataController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(DataSourceMetadataController.class);

    @Autowired
    private DataSourceMetadataService dataSourceMetadataService;
    @Autowired
    private DataSourceConnectionService dataSourceConnectionService;
    @Autowired
    private DataSourceService dataSourceService;
    @Autowired
    private ChartDataConfigService chartDataConfigService;

    @RequestMapping(value = "/dataSourceArguments", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public DataSourceMetadata updateArguments(@RequestBody DataSourceMetadata dataSourceMetadata) throws Exception {
        DataSourceMetadataPage dataSourceMetadataPage=new DataSourceMetadataPage();
        dataSourceMetadataPage.setDataSourceId(dataSourceMetadata.getDataSourceId());
        dataSourceMetadataPage.setMetadata(dataSourceMetadata.getMetadata());
        DataSourceMetadata dataSourceMetadataDb=dataSourceMetadataService.queryBySingle(dataSourceMetadataPage);
        if(dataSourceMetadataDb!=null){
            dataSourceMetadataDb.setArgument(dataSourceMetadata.getArgument());
            dataSourceMetadataService.updateByPrimaryKey(dataSourceMetadataDb);
        }else{
            dataSourceMetadataService.insert(dataSourceMetadata);
        }
        return dataSourceMetadataDb;
    }


    public List<DataSourceMetadata> queryByList(DataSourceMetadataPage dataSourceMetadataPage)throws Exception{
        List<DataSourceMetadata> dataSourceMetadataList=dataSourceMetadataService.queryByList(dataSourceMetadataPage);
        if(dataSourceMetadataList.size()==0){
            initDataSourceMetaDataTable(dataSourceMetadataPage.getDataSourceId());
        }
        return dataSourceMetadataService.queryByList(dataSourceMetadataPage);
    }

    public void initDataSourceMetaDataTable(Integer id)throws Exception{
        //初始化数据源参数
        DataSource dataSource = dataSourceService.queryDataSourceConnectionByPrimaryKey(id);
        initDataSourceMetaDataTable(dataSource);
    }

    public void initDataSourceMetaDataTable(DataSource dataSource)throws Exception{
        DataSourceConnection dataSourceConnection=dataSource.getDataSourceConnection();
        if(dataSourceConnection==null){
            //初始化数据源参数
            dataSourceConnection = dataSourceConnectionService.selectByPrimaryKey(dataSource.getDataSourceConnectionId());
        }
        //获取adapter
        IDataSourceAdapter adapter = DataSourceHelper.findAdapter(dataSourceConnection);
        //通过Adapter获取字典值
        List<Map<String,Object>> columnMapList = adapter.viewMetadataPropertiesList(dataSourceConnection.getParams(),dataSource.getMappedDataSource());
        List<String> metricList=adapter.viewMetricList(dataSourceConnection.getParams(),dataSource.getMappedDataSource());
        List<String> dimensionList=adapter.viewDimensionList(dataSourceConnection.getParams(),dataSource.getMappedDataSource());
        List<String> dateDimensionList=adapter.viewDateDimensionList(dataSourceConnection.getParams(),dataSource.getMappedDataSource());

        Set<String> metricSet=new HashSet(metricList);
        Set<String> dimensionSet=new HashSet(dimensionList);
        Set<String> dateDimentsionSet=new HashSet(dateDimensionList);

        //把数据源元数据插入DataSourceMetaData表中
        for(Map<String,Object> columnMap:columnMapList){
            String columnName=(String) columnMap.get("ColumnName");
            String columnType=(String) columnMap.get("ColumnType");



            DataSourceMetadata dataSourceMetadata=new DataSourceMetadata();
            dataSourceMetadata.setDataSourceId(dataSource.getId());
            dataSourceMetadata.setMetadata(columnName);
            dataSourceMetadata.setMetadataType(columnType);
            if(metricSet.contains(columnName)){
                dataSourceMetadata.setAnalyticType(0);
            }else if(dateDimentsionSet.contains(columnName)){
                dataSourceMetadata.setAnalyticType(2);
            }else if(dimensionSet.contains(columnName)){
                dataSourceMetadata.setAnalyticType(1);
            }
            dataSourceMetadataService.insert(dataSourceMetadata);
        }
    }


    @RequestMapping(value = "/dataSources/id/metaData", method = POST)
    @ResponseBody
    public Map<String,Object> findMetaDataList(@RequestBody CallBackParameter callBackParameter) throws Exception {
        //获取指标
        List<DataSourceMetadata>metricList=dataSourceMetadataService.getMetricList(callBackParameter.getDatasource_id());
        //获取所有维度
        List<DataSourceMetadata> dimensionList= dataSourceMetadataService.getAllDimentsionList(callBackParameter.getDatasource_id());
        //获取日期范围维度
        List<DataSourceMetadata>dateDimensionList= dataSourceMetadataService.getDateDimensionList(callBackParameter.getDatasource_id());

        List<MetaData> dimensionMetaDataList=getMetaDataList(dimensionList);
        List<MetaData> metricMetaDataList=getMetaDataList(metricList);

        Map<String,Object>resultMap=new HashMap<>();
        resultMap.put("dimensions",dimensionMetaDataList);
        resultMap.put("metrics",metricMetaDataList);

        //获取最近一次正确渲染图表的数据面板参数
        ChartDataConfig chartDataConfig=new ChartDataConfig();
        chartDataConfig.setType(callBackParameter.getChart_type());
        chartDataConfig.setDataSourceId(callBackParameter.getDatasource_id());
        chartDataConfig=chartDataConfigService.queryByLastSingle(chartDataConfig);
        Map<String,String>fieldValueMap=new HashMap<>();
        if(chartDataConfig!=null){
            Map map= JSONUtils.readValueToMap(chartDataConfig.getValue());
            List<Map<String,Object>> groupsMap = (List<Map<String,Object>>)map.get("parameters");
            for(Map<String,Object> group : groupsMap){
                if(group.get("name").equals("参数信息")){
                    List<Map<String,Object>> fieldsMap = (List<Map<String,Object>>)group.get("fields");
                    for(Map<String,Object> field : fieldsMap){
                        String code=(String)field.get("code");
                        String value=(String)field.get("value");
                        fieldValueMap.put(code,value);
                    }
                }
            }
        }

        resultMap.put("defaultValue",fieldValueMap);
        return resultMap;
    }

    /***
     * 回调报表自己能做的方法
     *
     * @param method 不能存在同名的重载方法
     * @return
     * @throws Exception
     */
    @ResponseBody
    @RequestMapping(value = "/dataSourceMetadatas/metadata-method-callback", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Object metaDataMethodCallback(@RequestParam(name = "current_DataSource") String dataSourceStr,
                                         @RequestParam(name = "method") String method) throws Exception {
        try {
            DataSource dataSource = JSONUtils.readValueToBean(dataSourceStr, DataSource.class);
//            datasourceConnectionService.replaceDataSourceConnection(operator);
//            IOperator operatorInstance = operatorLoader.loadOperator(operator.getCode(), operator.getVersion(), operator.getExecuteEngineVersion());
//            Method declaredMethod = operatorLoader.getMethod(operatorInstance, method);
//            return declaredMethod.invoke(operatorInstance, operator.getOperatorParameters());
//            dataSource
            return null;
        } catch (InvocationTargetException e) {
            return Msg.getFailureMessage("");
        }
    }


    private List getMetaDataList(List<DataSourceMetadata> dataSourceMetadataList){
        List<MetaData> metaDataList=new ArrayList<>();
        for(DataSourceMetadata dataSourceMetadata:dataSourceMetadataList){
            MetaData metaData=new MetaData();
            metaData.setCode(dataSourceMetadata.getMetadata());
            metaData.setName(dataSourceMetadata.getMetadata());
            metaData.setType(dataSourceMetadata.getMetadataType());
            metaDataList.add(metaData);
        }
        return metaDataList;
    }

    @RequestMapping(value = "/dataSourceMetadatas", method = GET)
    @ResponseBody
    public List<DataSourceMetadata> query(DataSourceMetadataPage page) throws Exception {
        page.setOrderBy(DataSourceMetadata.fieldToColumn(page.getOrderBy()));
        return dataSourceMetadataService.queryByList(page);
    }

    @RequestMapping(value = "/dataSourceMetadatas/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(DataSourceMetadataPage page) throws Exception {
        page.setOrderBy(DataSourceMetadata.fieldToColumn(page.getOrderBy()));
        List<DataSourceMetadata> rows = dataSourceMetadataService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/dataSourceMetadatas/{id}", method = GET)
    @ResponseBody
    public DataSourceMetadata find(@PathVariable Integer id) throws Exception {
        return dataSourceMetadataService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/dataSourceMetadatas", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public DataSourceMetadata create(@RequestBody DataSourceMetadata dataSourceMetadata) throws Exception {
        dataSourceMetadataService.insert(dataSourceMetadata);
        return dataSourceMetadata;
    }

    @RequestMapping(value = "/dataSourceMetadatas", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody DataSourceMetadata dataSourceMetadata) throws Exception {
        dataSourceMetadataService.updateByPrimaryKeySelective(dataSourceMetadata);
    }

    @RequestMapping(value = "/dataSourceMetadatas/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        dataSourceMetadataService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_VISUAL_DATA_SOURCE_METADATA where id = {}", id);
    }

}
