package td.enterprise.dmp.queryservice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import td.enterprise.dmp.common.config.Configuration;
import td.olap.query.WiFiAnalyticsQuerService;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.runscript.offline.OffLineDataScriptAdapter;
import td.olap.query.utils.QueryServiceUtils;

public class QueryServiceTest {

	public static void main(String[] args) throws Exception {
//		MarketingTrackingQueryer mq = MarketingTrackingQueryer.getInstance();
//		Map<String, List<?>> result = mq.queryEvent(1, "20150922145630_3", "20150801", "20150901");
//		System.out.println("count:" +mq.queryEventCount(1, "20150922145630_3", "20150801", "20150901"));
//		ObjectMapper objectMapper = new ObjectMapper();
//		try {
//			System.out.println(".....Marketing_Data...");
//			System.out.println(objectMapper.writeValueAsString(result));
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		
//		result = mq.queryConversion(null,null,"20150921", "20150930");
//		try {
//			System.out.println(".....Conversion...");
//			System.out.println(objectMapper.writeValueAsString(result));
//			System.out.println("count:" +mq.queryConversionCount(null,null,"20150921", "20150930"));
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		
//		Integer count = DmpQuery.getInstance().queryConversionScale(null,"1", 2,null);
//		System.out.println("count=====" + count);
//		
//		Map map = DmpQuery.getInstance().queryConversionPortrait(null, "1", 75, 1,1, null);
//		System.out.println(map);
		
//		Map map = DmpQuery.getInstance().queryCrowdPortrait(1, 75, 1);
//		System.out.println(map);
		String queryUrl = Configuration.getInstance().getConfig("query.engine.url") + "/api/query";
		Map<String,Map<String,Object>> map = new HashMap<>();
		OffLineDataScriptAdapter adapter = new OffLineDataScriptAdapter();
		StringBuffer sb = new StringBuffer();
		sb.append("r030102=select * from bitmap.active_user_sensor_hour_cube where project_id='1' and sensor_id in('1','2','3') and date='2016-05-24' and hour in('17','18','19') group by sensor_id order by sensor_id asc;");
		sb.append("r030102.subkey(0);");
//		String tenantId = "2000152";
//		String projectId = "1";
//		String startDate = "2016-04-06";
//		String endDate = "2016-05-06";
//		String crowdType = "NU";
//		String crowdId = "1";
//		sb.append(getCrowdCubeTql(tenantId, projectId, startDate, endDate, crowdType,crowdId));
//		sb.append("t30157=unite(r030102,r2000152120160422,'manytoone').subkey(0);");
//		sb.append("t30157.subkey(0);");
		QueryEngineResult agedistributeResult = QueryServiceUtils.invoke("post", queryUrl, adapter.adapt(sb.toString()));
		List<ResultBean> agedistributeResultBeanList = new ArrayList<>();
		if(agedistributeResult!=null){
			agedistributeResultBeanList = agedistributeResult.getResults();
		}
		for(ResultBean bean : agedistributeResultBeanList){
			System.out.println(bean.getKey()+","+bean.getValue());
		}
	
	}

}
