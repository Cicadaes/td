package td.olap.query;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import td.enterprise.dmp.common.config.Configuration;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;

public class QueryServiceVisitDepth {
	private static QueryServiceVisitDepth instance;

	private final static Logger logger = Logger.getLogger(QueryServiceVisitDepth.class);

	private static String queryUrl = Configuration.getInstance().getConfig("query.engine.url") + "/api/query";

	public static QueryServiceVisitDepth getInstance() {
		if (instance == null) {
			instance = new QueryServiceVisitDepth();
		}
		return instance;
	}

	private QueryServiceVisitDepth() {
	}

	public static Long query01(String tenantId, Integer projectId, String start, String end, String cube) {
		String script = "r30223=select * from enterprise." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and (date between " + start + " and " + end + ");";
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Long result = QueryEngineResultUtil.getDefaultValue(qer).longValue();
		logger.info("queryEngine-script:" + script);
		logger.info("queryEngine-result:" + result);
		return result;
	}

	public static Map query02(String tenantId, Integer projectId, String start, String end, String cube) {
		String script = "r30223=select * from enterprise." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
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

	public static List<Map<Object, Object>> queryEnterUserDegreeList(String tenantId, Integer projectId, String start, String end, Integer type) {
		String cube = "offline_enter_user_degree_times_counter";
		if (type != null && type == 2) {
			cube = "offline_enter_user_degree_duration_counter";
		}
		String script = "r30223=select * from enterprise." + cube + " where tenant_id=" + tenantId + " and project_id=" + projectId + " and date between " + start + " and " + end
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
