package td.olap.query.utils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import td.enterprise.console.core.entity.admin.DicItem;
import td.enterprise.dmp.common.util.DateUtil;
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

	public static Map<String, Object> buildResult(String name, QueryEngineResult qer, List<DicItem> dicItems, Integer viewType) {
		Map<String, Object> result = null;
		switch (viewType) {
//		case DictConstants.REPORT_VIEW_TYPE_BAR:
//			result = buildResultForBar(name, qer, dicItems);
//			break;
//		case DictConstants.REPORT_VIEW_TYPE_COLUMN:
//			result = buildResultForColumn(name, qer, dicItems);
//			break;
//		case DictConstants.REPORT_VIEW_TYPE_PIE:
//			result = buildResultForPie(name, qer, dicItems);
//			break;
//		case DictConstants.REPORT_VIEW_TYPE_CHINA_MAP:
//			result = buildResultForChina_Map(name, qer, dicItems);
//			break;
//		case DictConstants.REPORT_VIEW_TYPE_LINE:
//			result = buildResultForLine(name, qer, dicItems);
//			break;
		default:
			result = buildResultForDefault(name, qer, dicItems);
			break;
		}
		return result;
	}

	private static Map<String, Object> buildResultForBar(String name, QueryEngineResult qer, List<DicItem> dicItems) {
		return buildResultForDefault(name, qer, dicItems);
	}

	private static Map<String, Object> buildResultForColumn(String name, QueryEngineResult qer, List<DicItem> dicItems) {
		return buildResultForDefault(name, qer, dicItems);
	}

	private static Map<String, Object> buildResultForPie(String name, QueryEngineResult qer, List<DicItem> dicItems) {
		Map<String, Object> result = new HashMap<String, Object>();

		Map<Integer, String> kvMap = new HashMap<>() ;//TODO:因错误暂时注释  //DicUtil.getIdValueMap(dicItems);

		List<Object> values = new ArrayList<Object>();
		int count = 0;
		int otherValue = 0;
		if(qer != null){
			Collections.sort(qer.getResults(), Collections.reverseOrder());
			for (ResultBean rb : qer.getResults()) {
				count++;
				Integer dictKey = rb.getKey() != null && !"default".equals(rb.getKey())? Integer.valueOf(rb.getKey().toString()) : 0;
				String key = kvMap.get(dictKey);
				Integer value = rb.getValue() != null ? Integer.valueOf(rb.getValue().toString()) : 0;
				if(count < 11){
					values.add(new Object[] { key, value });
				}else{
					otherValue = otherValue + value;
				}
			}
		}
		
		if(count >= 11){
			values.add(new Object[] { "其他", otherValue });
		}
		
		List<Map<String, Object>> series = new ArrayList<Map<String, Object>>();
		Map<String, Object> sery = new HashMap<String, Object>();

		sery.put(RESULT_SERY_TYPE, RESULT_SERY_TYPE_PIE);
		sery.put(RESULT_SERY_NAME, name);
		sery.put(RESULT_SERY_DATA, values);
		series.add(sery);

		result.put(RESULT_SERIES, series);

		return result;
	}

	private static Map<String, Object> buildResultForLine(String name, QueryEngineResult qer, List<DicItem> dicItems) {
		return buildResultForDefault(name, qer, dicItems);
	}

	private static Map<String, Object> buildResultForChina_Map(String name, QueryEngineResult qer, List<DicItem> dicItems) {
		Map<String, Object> result = new HashMap<String, Object>();

		List<String> keyList = new ArrayList<String>();
		List<Integer> valueList = new ArrayList<Integer>();
		List<Double> rateList = new ArrayList<Double>();

		Integer total = 0;
		int otherValue = 0;
		int count = 0;
		if(qer != null){
			for (int i = 0; i < qer.getResults().size(); i++) {
				ResultBean rb = qer.getResults().get(i);
				total += Integer.valueOf(rb.getValue()!=null?rb.getValue().toString():"0");
			}
			Collections.sort(qer.getResults(), Collections.reverseOrder());
			for (int i = 0; i < qer.getResults().size(); i++) {
				count ++;
				ResultBean rb = qer.getResults().get(i);
				Integer value = Integer.valueOf(rb.getValue() !=null?String.valueOf(rb.getValue()):"0");
				String key = rb.getKey();
				if(count < 11){
					keyList.add(key);
					valueList.add(value);
					rateList.add(Double.valueOf(value) / total);
				}else{
					otherValue = otherValue + value;
				}
			}
		}
		if(count >= 11){
			keyList.add("其他");
			valueList.add(otherValue);
			rateList.add(Double.valueOf(otherValue) / total);
		}

		result.put(RESULT_ECHART_MAP_KEY, keyList);
		result.put(RESULT_ECHART_MAP_VALUE, valueList);
		result.put(RESULT_ECHART_MAP_RATE, rateList);

		return result;
	}

	private static Map<String, Object> buildResultForDefault(String name, QueryEngineResult qer, List<DicItem> dicItems) {
		Map<String, Object> result = new HashMap<String, Object>();

		Map<Integer, String> kvMap =  new HashMap<Integer, String>();//TODO:因错误暂时注释 //DicUtil.getIdValueMap(dicItems);

		List<String> displayKeys = new ArrayList<String>();
		List<Integer> values = new ArrayList<Integer>();
		int count = 0;
		int otherValue = 0;
		if(qer != null){
			Collections.sort(qer.getResults(), Collections.reverseOrder());
			for (ResultBean rb : qer.getResults()) {
				count ++;
				String key = kvMap.get(rb.getKey());
				if(StringUtils.isBlank(key)){
					key = rb.getKey();
				}
				int value = rb.getValue()!=null?Integer.valueOf(rb.getValue().toString()):0;
				if(count < 11){
					displayKeys.add(key);
					values.add(value);
				}else{
					otherValue = otherValue + value;
				}
			}
		}
		
		if(count >= 11){
			displayKeys.add("其它");
			values.add(otherValue);
		}
		
		List<Map<String, Object>> series = new ArrayList<Map<String, Object>>();
		Map<String, Object> sery = new HashMap<String, Object>();
		sery.put(RESULT_SERY_NAME, name);
		sery.put(RESULT_SERY_DATA, values);
		series.add(sery);

		result.put(RESULT_CATEGORIES, displayKeys);
		result.put(RESULT_SERIES, series);
		return result;
	}

	public static List<Integer> getValues(QueryEngineResult qer) {
		List<Integer> result = new ArrayList<Integer>();
		for (ResultBean rb : qer.getResults()) {
			result.add((Integer) rb.getValue());
		}
		Collections.sort(result);
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
		if (qer != null && qer.getResults() != null && qer.getResults().size() > 0) {
			return true;
		}
		return false;
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

	public static Map<String, List<?>> convertRangeResult(QueryEngineResult qer, String startDay, String endDay) {
		Map<String, List<?>> result = new HashMap<String, List<?>>();
		Map<String, Object> qerMap = new HashMap<String, Object>();
		List<String> days = DateUtil.getTimeRange(startDay, endDay, 0);
		
		if(qer != null){
			for (ResultBean rb : qer.getResults()) {
				qerMap.put(rb.getKey(), rb.getValue());
			}
		}
		List<Integer> values = new ArrayList<Integer>();
		for (String day : days) {
			if (qerMap.containsKey(day)) {
				values.add(Integer.parseInt( qerMap.get(day) == null ? "0" : (String)qerMap.get(day)));
			} else {
				values.add(0);
			}
		}
		result.put("keys", days);
		result.put("displayKeys", days);
		result.put("values", values);

		return result;
	}
}
