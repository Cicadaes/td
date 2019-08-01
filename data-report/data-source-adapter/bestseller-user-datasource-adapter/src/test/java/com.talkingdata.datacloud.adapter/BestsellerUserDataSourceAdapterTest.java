package com.talkingdata.datacloud.adapter;

import com.talkingdata.datacloud.adapter.entity.QueryParameter;
import com.talkingdata.datacloud.visual.util.FileUtils;
import com.talkingdata.datacloud.visual.util.JSONUtils;
import org.junit.Test;

/**
 * Created by yangruobin on 2017/9/19.
 */
public class BestsellerUserDataSourceAdapterTest {
    //    public static URL url=BestsellerUserDataSourceAdapterTest.class.getResource("/");
    private QueryParameter getQueryParameter(String fileName,String dataSourceName) throws Exception{
        String urlStr="/Users/yangruobin/ideagit/data-report/data-source-adapter/bestseller-user-datasource-adapter/src/test/resource/";
        String jsonStr = FileUtils.readContent(urlStr+fileName);
        QueryParameter queryParameter= JSONUtils.readValueToBean(jsonStr,QueryParameter.class);
        queryParameter.setDataSourceConnectionInfo("{\"host\":\"172.23.4.54\",\"port\":3306,\"user\":\"datacloud\",\"password\":\"datacloud@talkingdata\",\"database\":\"aop\"}");
//        queryParameter.setDataSourceConnectionInfo("{\"host\":\"10.150.33.121\",\"port\":3306,\"user\":\"bs_report\",\"password\":\"bs_report\",\"database\":\"bs_report\"}");
        queryParameter.setDataSourceName(dataSourceName);
        return queryParameter;
    }

    //统计分析
    @Test
    public void testStatisticalAnalysis() throws Exception{
        testQuery("statistical_analysis.json","statistical_analysis");
    }

    //客户得分
    @Test
    public void testCusomerScore() throws Exception{
        String dataSourceName="member_score";
        String json=dataSourceName+".json";
        QueryParameter queryParameter=getQueryParameter(json,dataSourceName);
        BestsellerUserDataSourceAdapter bestsellerUserDataSourceAdapter = new BestsellerUserDataSourceAdapter();
        Object object=bestsellerUserDataSourceAdapter.findData(queryParameter);
        System.out.println(JSONUtils.writeValueAsString(object));
    }

    //客户价值
    @Test
    public void testCusomerClass() throws Exception{
        String dataSourceName="member_class";
        String json=dataSourceName+".json";
        QueryParameter queryParameter=getQueryParameter(json,dataSourceName);
        BestsellerUserDataSourceAdapter bestsellerUserDataSourceAdapter = new BestsellerUserDataSourceAdapter();
        Object object=bestsellerUserDataSourceAdapter.findData(queryParameter);
        System.out.println(JSONUtils.writeValueAsString(object));
    }
    //日期范围
    @Test
    public void testDateRange() throws Exception {
        testQuery("testDateRange.json","date_range");
    }

    //周期对比明细
    @Test
    public void testCycleComparison() throws Exception {
        testQuery("testCycleComparison.json","cycle_comparison");
    }

    private void testQuery(String fileName,String tableName)throws Exception{
        BestsellerUserDataSourceAdapter bestsellerUserDataSourceAdapter=new BestsellerUserDataSourceAdapter();
        QueryParameter queryParameter=getQueryParameter(fileName,tableName);
        Object object=bestsellerUserDataSourceAdapter.findData(queryParameter);
        System.out.println(JSONUtils.writeValueAsString(object));
    }
}
