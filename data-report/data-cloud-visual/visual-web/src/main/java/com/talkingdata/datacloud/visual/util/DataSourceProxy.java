package com.talkingdata.datacloud.visual.util;

import com.talkingdata.datacloud.adapter.common.IDataSourceAdapter;
import com.talkingdata.datacloud.adapter.entity.DataPreviewPage;
import com.talkingdata.datacloud.adapter.entity.Filter;
import com.talkingdata.datacloud.adapter.entity.QueryParameter;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by yangruobin on 2017/12/20.
 */
public class DataSourceProxy implements IDataSourceAdapter {

  private static final Logger logger = LoggerFactory.getLogger(DataSourceProxy.class);
  IDataSourceAdapter dataSourceAdapter;

  public DataSourceProxy(IDataSourceAdapter dataSourceAdapter) {
    this.dataSourceAdapter = dataSourceAdapter;
  }

  @Override
  public boolean testConnection(String dataSourceConnectionInfo) {
    return dataSourceAdapter.testConnection(dataSourceConnectionInfo);
  }

  @Override
  public List<String> viewSourceList(String dataSourceConnectionInfo) {
    return dataSourceAdapter.viewSourceList(dataSourceConnectionInfo);
  }

  @Override
  public List<String> getViewList(String dataSourceConnectionInfo) {
    return dataSourceAdapter.getViewList(dataSourceConnectionInfo);
  }

  @Override
  public List<Map<String, Object>> viewMetadataPropertiesList(String dataSourceConnectionInfo,
      String dataSourceName) {
    return dataSourceAdapter.viewMetadataPropertiesList(dataSourceConnectionInfo, dataSourceName);
  }

  @Override
  public Map<String, Object> viewDataSourceDataList(DataPreviewPage dataPreviewPage) {
    return dataSourceAdapter.viewDataSourceDataList(dataPreviewPage);
  }

  @Override
  public Object findData(QueryParameter queryParameter) {
    try {
      boolean argb = addReportArgument(queryParameter);
//            如果配置项错误，则不做数据源查询
      if (!argb) {
        return Msg.getFailureMessage("参数配置错误");
      } else {
        Object result = dataSourceAdapter.findData(queryParameter);
        return result;
      }
    } catch (Exception e) {
      logger.error("查询出现问题", e);
    }
    return null;
  }

  @Override
  public List<String> viewMetricList(String dataSourceConnectionInfo, String dataSourceName) {
    return dataSourceAdapter.viewMetricList(dataSourceConnectionInfo, dataSourceName);
  }

  @Override
  public List<String> viewDimensionList(String dataSourceConnectionInfo, String dataSourceName) {
    return dataSourceAdapter.viewDimensionList(dataSourceConnectionInfo, dataSourceName);
  }

  @Override
  public List<String> viewDateDimensionList(String dataSourceConnectionInfo,
      String dataSourceName) {
    return dataSourceAdapter.viewDateDimensionList(dataSourceConnectionInfo, dataSourceName);
  }

  @Override
  public String getQuerySql(String dataSourceConnectionInfo, String dataSourceName) {
    return dataSourceAdapter.getQuerySql(dataSourceConnectionInfo, dataSourceName);
  }


  public static boolean addReportArgument(QueryParameter queryParameter) throws Exception {
    String tenantId = UserInfoUtil.getCurrentTenantId();
    if (StringUtils.isNotBlank(tenantId)) {
      Filter filter = new Filter();
      filter.setField("tenant_id");
      filter.setOperator("=");
      filter.setValue(tenantId);
      queryParameter.getFilters().add(filter);
      return true;
    }
    return false;
  }

  //加载报表的系统参数，用于实现带参数的报表功能
//    public static boolean addReportArgument(QueryParameter queryParameter)throws Exception{
//        DataSourceMetadataPage dataSourceMetadataPage=new DataSourceMetadataPage();
//        dataSourceMetadataPage.setDataSourceId(queryParameter.getDatasource_id());
//        List <DataSourceMetadata> dataSourceMetadataList=dataSourceMetadataService.queryByList(dataSourceMetadataPage);
//        for(DataSourceMetadata dataSourceMetadata:dataSourceMetadataList){
//            String argument=dataSourceMetadata.getArgument();
//            if(StringUtils.isEmpty(argument)){
//                continue;
//            }
//            Filter filter=new Filter();
//            filter.setField(dataSourceMetadata.getMetadata());
//            //当格式为${}方式为，说明为变量，否则为固定值
//            if(argument.matches("\\$\\{(.*)\\}")){
//                String valuePathStr=argument.replaceAll("\\$\\{(.*)\\}","$1");
//                String[]valuePaths=valuePathStr.split("\\.");
//                if(valuePaths.length<1){
//                    return false;
//                }
//                String firstKey=valuePaths[0];
//                //如果第一个key和组织机构的key相同，则提取组织机构的值
//                if(CommonUtils.ORG_SESSION_KEY.equals(firstKey)&&valuePaths.length==2){
//                    User user=privilegeService.getUserByRequest(request);
//                    Map<String, Object> objectMap=getReportArgument(privilegeService.getSession(),user.getUmid());
//                    if(objectMap!=null){
//                        Object value=objectMap.get(valuePaths[1]);
//                        filter.setValue(value);
//                    }else{
//                        //组织机构中没有对应的值，则不查询
//                        return false;
//                    }
//                }else if(!CommonUtils.ORG_SESSION_KEY.equals(firstKey)&&valuePaths.length==1){
//                    Object value=privilegeService.getSession().getAttribute(firstKey);
//                    filter.setValue(value);
//                }else{
//                    return false;
//                }
//
//            }else{
//                filter.setValue(argument);
//            }
//            queryParameter.getFilters().add(filter);
//        }
//        return true;
//    }
}
