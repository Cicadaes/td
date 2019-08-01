package com.talkingdata.datacloud.adapter;

import com.talkingdata.datacloud.adapter.entity.Filter;
import com.talkingdata.datacloud.adapter.entity.QueryParameter;
import com.talkingdata.datacloud.visual.util.FileUtils;
import com.talkingdata.datacloud.visual.util.JSONUtils;
import org.junit.Test;

import java.net.URL;

/**
 * Created by yangruobin on 2017/9/19.
 */
public class MysqlDataSourceAdapterTest {

  public static URL url = MysqlDataSourceAdapterTest.class.getResource("/");

  private QueryParameter getQueryParameter(String fileName, String tableName) throws Exception {
    //
    String jsonStr = FileUtils.readContent(url.getFile() + fileName);
    QueryParameter queryParameter = JSONUtils.readValueToBean(jsonStr, QueryParameter.class);
    Filter filter = new Filter();
    filter.setField("tenant_id");
    filter.setOperator("=");
    filter.setValue(5);
    queryParameter.getFilters().add(filter);

    queryParameter.setDataSourceConnectionInfo(
        "{\"host\":\"172.23.4.135\",\"port\":3306,\"user\":\"wifianalytics\",\"password\":\"wifianalytics\",\"database\":\"wifianalytics\"}");
    queryParameter.setDataSourceName(tableName);
    return queryParameter;
  }

  @Test
  public void testFindData() throws Exception {
    testQuery("findData.json", "TD_METRIC_DAY");
  }

  private void testQuery(String fileName, String tableName) throws Exception {
    MysqlDataSourceAdapter mysqlDataSourceAdapterTest = new MysqlDataSourceAdapter();
    QueryParameter queryParameter = getQueryParameter(fileName, tableName);
    Object object = mysqlDataSourceAdapterTest.findData(queryParameter);
    System.out.println(JSONUtils.writeValueAsString(object));
  }
}
