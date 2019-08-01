package td.olap.query;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class QueryServiceVisitDepth {

	private static QueryServiceVisitDepth instance;

	private final static Logger logger = Logger.getLogger(QueryServiceVisitDepth.class);

	private static String queryUrl =  null;

	public static QueryServiceVisitDepth getInstance(String url ) {
		if (instance == null) {
			instance = new QueryServiceVisitDepth();
			queryUrl = url +  "/api/query" ;
		}
		return instance;
	}

	private QueryServiceVisitDepth() {
	}

	/**
	 * 查询一段时间内的人数，会排重
	 * @param projectIds
	 * @param start
	 * @param end
	 * @param cube
	 * @return
	 */
	public  Long querySumFromCube(String projectIds, String start, String end, String cube) {
		String script = "r30223=select * from bitmap." + cube + " where  project_id in (" + projectIds + ") and (date between " + start + " and " + end + ");";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Long result = QueryEngineResultUtil.getDefaultValue(qer).longValue();
		logger.info("queryEngine-script:" + script);
		logger.info("queryEngine-result:" + result);
		return result;
	}

	public  Long querySum(String projectIds, String start, String end, String cube) {
		String script = "r30223=select * from enterprise." + cube + " where  project_id in (" + projectIds + ") and (date between " + start + " and " + end + ");";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Long result = QueryEngineResultUtil.getDefaultValue(qer).longValue();
		logger.info("queryEngine-script:" + script);
		logger.info("queryEngine-result:" + result);
		return result;
	}

	/**
	 * 查询一段时间内的人数，会排重
	 * @param projectIds
	 * @param start
	 * @param end
	 * @param cubeType
	 * @return
	 */
	public  Map<String,Integer> querySumFromCubeByDate(String projectIds, String start, String end, String cubeType) {
		String cube  = "";
		switch ( cubeType ){
			case WiFiAnalyticsQuerService.NEW:
				cube = WiFiAnalyticsQuerService.NEW_USER_DAY_CUBE ;
			break;
			case WiFiAnalyticsQuerService.OLD:
				cube = WiFiAnalyticsQuerService.OLD_USER_DAY_CUBE ;
				break;
		}

		if(StringUtils.isEmpty(cube)){
			throw new RuntimeException( "cube 名称不能为空！");
		}

		String script = "r30223=select * from bitmap." + cube + " where  project_id in (" + projectIds + " )  and (date between " + start + " and " + end + " ) group by date;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String,Integer> resultMap = new HashMap<String,Integer>();
		if (qer != null) {
			List<ResultBean> results = qer.getResults();
			for (ResultBean resultBean : results) {
				resultMap.put(resultBean.getKey(), resultBean.getValue() != null ? Integer.parseInt(resultBean.getValue() + "") :  0);
			}
		}
		return resultMap;
	}

	/**
	 * 查询一段时间内的人数，会排重
	 * @param projectIds
	 * @param start
	 * @param end
	 * @param counterType
	 * @return
	 */
	public  Map<String,Integer> querySumFromCounterByDate(String projectIds, String start, String end, String counterType) {
		String counter  = "";
		switch ( counterType ){
			case WiFiAnalyticsQuerService.NEW:
				counter = WiFiAnalyticsQuerService.OFFLINE_NEW_USER_DAY_COUNTER ;
				break;
			case WiFiAnalyticsQuerService.OLD:
				counter = WiFiAnalyticsQuerService.OFFLINE_OLD_USER_DAY_COUNTER ;
				break;
		}

		if(StringUtils.isEmpty(counter)){
			throw new RuntimeException( "counter 名称不能为空！");
		}
		String script = "r30223=select * from enterprise." + counter + " where  project_id in (" + projectIds + " )  and (date between " + start + " and " + end + " ) group by date;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map<String,Integer> resultMap = new HashMap<String,Integer>();
		if (qer != null) {
			List<ResultBean> results = qer.getResults();
			for (ResultBean resultBean : results) {
				resultMap.put(resultBean.getKey(), resultBean.getValue() != null ? Integer.parseInt(resultBean.getValue() + "") :  0);
			}
		}
		return resultMap;
	}

	public  Map queryByDate( Integer projectId, String start, String end, String cube) {
		String script = "r30223=select * from enterprise." + cube + " where   project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by date order by date;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Map resultMap = new HashMap<>();
		if (qer != null) {
			List<ResultBean> results = qer.getResults();
			for (ResultBean resultBean : results) {
				resultMap.put(resultBean.getKey(), resultBean.getValue());
			}
		}
		return resultMap;
	}

	public  List<Map<Object, Object>> queryEnterUserDegreeList( Integer projectId, String start, String end, Integer type) {
		String cube = "offline_enter_user_degree_times_counter";
		if (type != null && type == 2) {
			cube = "offline_enter_user_degree_duration_counter";
		}
		String script = "r30223=select * from enterprise." + cube + " where  project_id=" + projectId + " and date between " + start + " and " + end
				+ " group by room_number;";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		List list = new ArrayList<>();
		if (qer != null) {
			List<ResultBean> results = qer.getResults();
			for (ResultBean resultBean : results) {
				Map<Object, Object> tmpMap = new HashMap<>();
				Object value = resultBean.getValue();
				// 转化为小时
				if (type == 2) {
					Double d = new Double(String.valueOf(resultBean.getValue()));
					d = d / 60;
					BigDecimal b = new BigDecimal(d);
					value = b.setScale(2, BigDecimal.ROUND_HALF_UP);
				}

				tmpMap.put("key", resultBean.getKey());
				tmpMap.put("value", value);
				list.add(tmpMap);
			}
		}

		return list;
	}

}
