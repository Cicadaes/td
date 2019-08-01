package td.olap.query.utils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;

public class QueryEngineResultUtil {
	private static final String RESULT_CATEGORIES = "categories";
	private static final String RESULT_SERIES = "series";
	private static final String RESULT_SERY_NAME = "name";
	private static final String RESULT_SERY_TYPE = "type";
	private static final String RESULT_SERY_TYPE_PIE = "pie";
	private static final String RESULT_SERY_DATA = "data";

	private static final String RESULT_ECHART_MAP_KEY = "key";
	private static final String RESULT_ECHART_MAP_VALUE = "value";
	private static final String RESULT_ECHART_MAP_RATE = "rate";

	public static List<Integer> getValues(QueryEngineResult qer) {
		List<Integer> result = new ArrayList<Integer>();
		for (ResultBean rb : qer.getResults()) {
			result.add((Integer) rb.getValue());
		}
		Collections.sort(result);
		return result;
	}
	
	public static Map<String,Integer> getKeysValues(QueryEngineResult qer) {
		Map<String,Integer> result = new HashMap<String,Integer>();
		for (ResultBean rb : qer.getResults()) {
			result.put((String) rb.getKey(),Integer.valueOf(rb.getValue()+""));
		}
		return result;
	}

	public static List<Double> getRateValues(QueryEngineResult qer) {
		List<Double> result = new ArrayList<Double>();
		List<Double> el = new ArrayList<Double>();
		Collections.sort(el);
		Double total = 0d;
		for (ResultBean rb : qer.getResults()) {
			el.add((Double) rb.getValue());
			total += (Double) rb.getValue();
		}
		for (Double e : el) {
			// result.add(Utils.formatValue(e / total * 100));
		}
		return result;
	}

	public static boolean isEffective(QueryEngineResult qer) {
        return qer != null && qer.getResults() != null && qer.getResults().size() > 0;
    }

	public static Integer getDefaultValue(QueryEngineResult qer) {
		Integer value = 0;
		if (isEffective(qer)) {
			if(qer.getResults().get(0).getValue() != null) {
				BigDecimal bigDecimal = new BigDecimal((String) qer.getResults().get(0).getValue()).setScale(0, BigDecimal.ROUND_HALF_UP);
				value = bigDecimal.intValue();
			}
			
		}
		return value;
	}

//	public static Map<String, List<?>> convertRangeResult(QueryEngineResult qer, String startDay, String endDay) {
//		Map<String, List<?>> result = new HashMap<String, List<?>>();
//		Map<String, Object> qerMap = new HashMap<String, Object>();
//		List<String> days = DateUtil.getTimeRange(startDay, endDay, 0);
//
//		if(qer != null){
//			for (ResultBean rb : qer.getResults()) {
//				qerMap.put(rb.getKey(), rb.getValue());
//			}
//		}
//		List<Integer> values = new ArrayList<Integer>();
//		for (String day : days) {
//			if (qerMap.containsKey(day)) {
//				values.add(Integer.parseInt( qerMap.get(day) == null ? "0" : (String)qerMap.get(day)));
//			} else {
//				values.add(0);
//			}
//		}
//		result.put("keys", days);
//		result.put("displayKeys", days);
//		result.put("values", values);
//
//		return result;
//	}
}
