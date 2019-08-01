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
public class BestsellerDataSourceAdapterTest {
    public static URL url=BestsellerDataSourceAdapterTest.class.getResource("/");

    private QueryParameter getQueryParameter(String dataSourceName){
        QueryParameter queryParameter=new QueryParameter();
//        queryParameter.setDataSourceConnectionInfo("{\"host\":\"10.150.35.16\",\"port\":3306,\"user\":\"wifianalytics\",\"password\":\"wifianalytics\",\"database\":\"wifianalytics\"}");
        queryParameter.setDataSourceConnectionInfo("{\"host\":\"172.23.4.145\",\"port\":3306,\"user\":\"wifianalytics\",\"password\":\"wifianalytics\",\"database\":\"wifianalytics\"}");
        queryParameter.setDataSourceName(dataSourceName);
        return queryParameter;
    }

    private QueryParameter getQueryParameter(String fileName,String tableName) throws Exception{
        String jsonStr = FileUtils.readContent(url.getFile()+fileName);
        QueryParameter queryParameter= JSONUtils.readValueToBean(jsonStr,QueryParameter.class);
        queryParameter.setDataSourceConnectionInfo("{\"host\":\"172.23.4.135\",\"port\":3306,\"user\":\"wifianalytics\",\"password\":\"wifianalytics\",\"database\":\"wifianalytics\"}");
//        queryParameter.setDataSourceConnectionInfo("{\"host\":\"10.150.33.124\",\"port\":\"3306\",\"user\":\"wifianalytics\",\"password\":\"wifianalytics\",\"database\":\"wifianalytics\"}");
        queryParameter.setDataSourceName(tableName);
        return queryParameter;
    }
    //集团概览
    @Test
    public void testGroupOverview() throws Exception {
        BestsellerDataSourceAdapter bestsellerDataSourceAdapter=new BestsellerDataSourceAdapter();
        QueryParameter queryParameter=getQueryParameter("testGroupOverview.json","bestseller_overview");
        Object object=bestsellerDataSourceAdapter.findData(queryParameter);
        System.out.println(JSONUtils.writeValueAsString(object));
    }
    //城市概览
    @Test
    public void testPhysicalityOverview() throws Exception {
//        BestsellerDataSourceAdapter bestsellerDataSourceAdapter=new BestsellerDataSourceAdapter();
//        QueryParameter queryParameter=getQueryParameter("bestseller_overview");
//
//        Filter filter=new Filter();
//        filter.setField("project_type");
//        filter.setOperator("=");
//        filter.setValue("9");
//        queryParameter.getFilters().add(filter);
//
//        Object object=bestsellerDataSourceAdapter.findData(queryParameter);
//        System.out.println(JSONUtils.writeValueAsString(object));
        testQuery("testGroupOverview.json","bestseller_overview");
    }
    //城市概览-店铺概览
    @Test
    public void testShopOverview() throws Exception {
        BestsellerDataSourceAdapter bestsellerDataSourceAdapter=new BestsellerDataSourceAdapter();
        QueryParameter queryParameter=getQueryParameter("overview_noPercentage");

        Filter filter=new Filter();
        filter.setField("project_type");
        filter.setOperator("=");
        filter.setValue("1");
        queryParameter.getFilters().add(filter);

        Object object=bestsellerDataSourceAdapter.findData(queryParameter);
        System.out.println(JSONUtils.writeValueAsString(object));
    }
    //合作商概览
    @Test
    public void testNoPercentageOverview() throws Exception {
        BestsellerDataSourceAdapter bestsellerDataSourceAdapter=new BestsellerDataSourceAdapter();
        QueryParameter queryParameter=getQueryParameter("overview_noPercentage");

        Filter filter=new Filter();
        filter.setField("project_type");
        filter.setOperator("=");
        filter.setValue("7");
        queryParameter.getFilters().add(filter);

        Object object=bestsellerDataSourceAdapter.findData(queryParameter);
        System.out.println(JSONUtils.writeValueAsString(object));
    }


    @Test
    public void testMetricOverview() throws Exception {
        testQuery("testMetricOverview.json","metric_overview");
    }
    //销售树
    @Test
    public void testSalesTree() throws Exception {
        testQuery("testSalesTree.json","bestseller_sales_tree");
    }

    private void testQuery(String fileName,String tableName)throws Exception{
        BestsellerDataSourceAdapter bestsellerDataSourceAdapter=new BestsellerDataSourceAdapter();
        QueryParameter queryParameter=getQueryParameter(fileName,tableName);
        Object object=bestsellerDataSourceAdapter.findData(queryParameter);
        System.out.println(JSONUtils.writeValueAsString(object));
    }

    //运营概览-目标考核
    @Test
    public void testTargetAssessment() throws Exception {
        testQuery("testTargetAssessment.json","target_assessment");
    }

    //趋势指标-明细数据
    @Test
    public void testTrendDetail() throws Exception {
        testQuery("testTrendDetail.json","trend_detail");
    }

    //订单分析-明细数据
    @Test
    public void testOrderDetail() throws Exception {
        testQuery("testOrderDetail.json","order_detail");
    }

    //来源分析-明细数据
    @Test
    public void testSourceSnalysis() throws Exception {
        testQuery("testSourceSnalysis.json","source_analysis");
    }

    //城市概览-城市级别
    @Test
    public void testCityLevel() throws Exception {
        testQuery("testCityLevel.json","city_level");

    }

    //转化指标-明细
    @Test
    public void testConversionDetail() throws Exception {
        testQuery("testConversionDetail.json","conversion_detail");
    }

    //到访次数-明细
    @Test
    public void testVisitNumberDetail() throws Exception {
        testQuery("testVisitNumberDetail.json","visit_number_detail");
    }

    //入店时长-明细
    @Test
    public void testActiveDurationDetail() throws Exception {
        testQuery("testActiveDurationDetail.json","active_duration_detail");
    }
    //客流动态-小时动态
    @Test
    public void testPassengerHourDynamics() throws Exception {
        testQuery("testPassengerHourDynamics.json","passenger_hour_dynamics");
    }

    //运营概览-客流分布
    @Test
    public void testPassengerFlowDistribution() throws Exception {
        testQuery("testPassengerFlowDistribution.json","passenger_flow_distribution");
    }
    //运营概览-店铺-同城四象限
    @Test
    public void testGetSameCityShop() throws Exception {
        testQuery("testGetSameCityShop.json","same_city_shop");
    }
    //运营概览-店铺-同城四象限
    @Test
    public void testGetSameLogicCityShop() throws Exception {
        testQuery("testGetSameLogicCityShop.json","same_logic_city_shop");
    }
    //运营概览-品牌四象限
    @Test
    public void testSameBrandRegion() throws Exception {
        testQuery("testSameBrandRegion.json","same_brand_region");
    }
    //运营概览-大区四象限
    @Test
    public void testSameRegionLogicCity() throws Exception {
        testQuery("testSameRegionLogicCity.json","same_region_logic_city");
    }
    //运营概览-店铺-同商场四象限
    @Test
    public void testSameMallShop() throws Exception {
        testQuery("testSameMallShop.json","same_mall_city_shop");
    }
    //运营概览-店铺-同区县四象限
    @Test
    public void testSameCountyShop() throws Exception {
        testQuery("testSameCountyShop.json","same_county_city_shop");
    }
    //运营概览-店铺-同区县四象限
    @Test
    public void testLogicCityToCity() throws Exception {
        testQuery("testLogicCityToCity.json","logic_city_to_city");
    }
    //客流动态-空间动态
    @Test
    public void testGetSpatialDynamics() throws Exception {
        testQuery("testGetSpatialDynamics.json","spatial_dynamics");
    }

    //客流动态-空间动态
    @Test
    public void testMapConvert() throws Exception {
        testQuery("testMapConvert.json","map_convert");
    }
}
