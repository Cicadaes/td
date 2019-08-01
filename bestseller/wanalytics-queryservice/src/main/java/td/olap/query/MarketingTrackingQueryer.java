package td.olap.query;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import td.enterprise.dmp.common.config.Configuration;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;

public class MarketingTrackingQueryer {
	private final static Logger logger = Logger.getLogger(MarketingTrackingQueryer.class);

	private static String queryUrl = Configuration.getInstance().getConfig("query.engine.url") + "/api/query";

	private static String domain = Configuration.getInstance().getConfig("bitmap.domain.default");

	private static MarketingTrackingQueryer instance;

	public static MarketingTrackingQueryer getInstance() {
		if (instance == null) {
			instance = new MarketingTrackingQueryer();
		}
		return instance;
	}

	private MarketingTrackingQueryer() {
	}

	/**
	 * 查询时间段范围内某活动批次的事件数据
	 * @param type事件类型
	 * @param batchNo活动批次号
	 * @param startDay开始时间
	 * @param endDay结束时间
	 * @return
	 */
	public Map<String, List<?>> queryEvent(Integer type, String batchNo, String startDay, String endDay, Integer lanuchId) {
		String batchNoFill = StringUtils.rightPad(batchNo, 32, "0");
		String startRowKey = String.format("%d#%s#%s", type, batchNoFill, startDay);
		String endRowKey = String.format("%d#%s#%s", type, batchNoFill, endDay);

		Configuration conf = Configuration.getInstance();
		String table = conf.getConfig("hive.table.marketingdata");
		StringBuilder sb = new StringBuilder();
		sb.append(String.format("marketingData=select * from %s.%s where startRowKey = '%s' and endRowKey = '%s' group by day;", domain, table, startRowKey, endRowKey));
		//TODO 关联投放的人的bitmap
		//TODO 暂时放弃关联吧
		/*sb.append(String.format("crowd=select * from " + domain + ".launch_crowd where id=%d;", lanuchId));
		sb.append("unite(marketingData  ,crowd ,'manytoone').subkey(0);");*/
		
		logger.info("script: " + sb.toString());
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		return QueryEngineResultUtil.convertRangeResult(qer, startDay, endDay);
	}
	
	/**
	 * 查询时间段范围内某活动批次的事件数据总数
	 * @param type事件类型
	 * @param batchNo活动批次号
	 * @param startDay开始时间
	 * @param endDay结束时间
	 * @return
	 */
	public Integer queryEventCount(Integer type, String batchNo, String startDay, String endDay, Integer launchId) {
		String batchNoFill = StringUtils.rightPad(batchNo, 32, "0");
		String startRowKey = String.format("%d#%s#%s", type, batchNoFill, startDay);
		String endRowKey = String.format("%d#%s#%s", type, batchNoFill, endDay);

		Configuration conf = Configuration.getInstance();
		String table = conf.getConfig("hive.table.marketingdata");
		StringBuilder sb = new StringBuilder();
		sb.append(String.format("marketingData=select * from %s.%s where startRowKey = '%s' and endRowKey = '%s';", domain, table, startRowKey, endRowKey));
		//TODO 关联投放的人的bitmap
		//TODO 暂时放弃关联吧
		/*sb.append(String.format("crowd=select * from " + domain + ".launch_crowd where id=%d;", launchId));
//		sb.append(String.format("crowd=select * from " + domain + ".custom_tag where id=%d;", 21));
		sb.append("unite(marketingData  ,crowd).subkey(0);");*/
		logger.info("script: " + sb.toString());

		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, sb.toString());
		
		Integer count = 0;
		if(qer != null) {
			if(qer.getResults() != null && qer.getResults().size() > 0) {
				Object value = qer.getResults().get(0).getValue();
				if(value != null){
					count = Integer.parseInt(value.toString());
				}
			}
		} else {
			logger.error("bitmap查询无结果！");
		}
		
		
		
		return count;
	}

	/**
	 * 查询转换数据
	 * @param pageId页面ID
	 * @param eventId事件ID
	 * @param startDay开始时间
	 * @param endDay结束时间
	 * @return
	 */
	public Map<String, List<?>> queryConversion(String pageId, String eventId, String startDay, String endDay, Integer launchId) {
		if (StringUtils.isBlank(startDay)) {
			startDay = "00000000";
		}
		if (StringUtils.isBlank(endDay)) {
			endDay = "zzzzzzzz";
		}
		String script = null;
		// 页面ID与事件ID都不为空
		Configuration conf = Configuration.getInstance();
		String pageTable = conf.getConfig("hive.table.conversionPage");
		String eventTable = conf.getConfig("hive.table.conversionEvent");
		if (StringUtils.isNotBlank(pageId) && StringUtils.isNotBlank(eventId)) {
			StringBuilder sb = new StringBuilder();
			String pageIdFill = StringUtils.rightPad(pageId, 16, "0");
			String startRowKey = String.format("%s#%s", pageIdFill, startDay);
			String endRowKey = String.format("%s#%s", pageIdFill, endDay);
			sb.append(String.format("conversion_page=select * from %s.%s where startRowKey = '%s' and endRowKey = '%s' group by day;", domain, pageTable, startRowKey, endRowKey));
			String eventIdFill = StringUtils.rightPad(eventId, 16, "0");
			startRowKey = String.format("%s#%s", eventIdFill, startDay);
			endRowKey = String.format("%s#%s", eventIdFill, endDay);
			sb.append(script = String.format("conversion_event=select * from %s.%s where startRowKey = '%s' and endRowKey = '%s' group by day;", domain, eventTable, startRowKey,
					endRowKey));
			sb.append("conversion=union(conversion_page,conversion_event);");
			//TODO 关联投放的人的bitmap
			//TODO 暂时放弃关联吧
			/*sb.append(String.format("crowd=select * from " + domain + ".launch_crowd where id=%d;", launchId));
//			sb.append(String.format("crowd=select * from " + domain + ".custom_tag where id=%d;", 21));
			sb.append("unite(conversion  ,crowd ,'manytoone').subkey(0);");*/
			script = sb.toString();
		}
		// 单查页面ID
		else if (StringUtils.isNotBlank(pageId)) {
			String pageIdFill = StringUtils.rightPad(pageId, 16, "0");
			String startRowKey = String.format("%s#%s", pageIdFill, startDay);
			String endRowKey = String.format("%s#%s", pageIdFill, endDay);
			StringBuilder sb = new StringBuilder();
			sb.append(String.format("conversion=select * from %s.%s where startRowKey = '%s' and endRowKey = '%s' group by day;", domain, pageTable, startRowKey, endRowKey));
			//TODO 关联投放的人的bitmap
			//TODO 暂时放弃关联吧
			/*sb.append(String.format("crowd=select * from " + domain + ".launch_crowd where id=%d;", launchId));
			sb.append("unite(conversion  ,crowd ,'manytoone').subkey(0);");*/
			script = sb.toString();
		}
		// 单查事件ID
		else if (StringUtils.isNotBlank(eventId)) {
			String eventIdFill = StringUtils.rightPad(eventId, 16, "0");
			String startRowKey = String.format("%s#%s", eventIdFill, startDay);
			String endRowKey = String.format("%s#%s", eventIdFill, endDay);
			StringBuilder sb = new StringBuilder();
			sb.append(String.format("conversion=select * from %s.%s where startRowKey = '%s' and endRowKey = '%s' group by day;", domain, eventTable, startRowKey, endRowKey));
			//TODO 关联投放的人的bitmap
			//TODO 暂时放弃关联吧
			/*sb.append(String.format("crowd=select * from " + domain + ".launch_crowd where id=%d;", launchId));
			sb.append("unite(conversion  ,crowd ,'manytoone').subkey(0);");*/
			script = sb.toString();
		}else{
			return QueryEngineResultUtil.convertRangeResult(null, startDay, endDay);
		}
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		return QueryEngineResultUtil.convertRangeResult(qer, startDay, endDay);
	}
	
	/**
	 * 查询转换数据总数
	 * @param pageId页面ID
	 * @param eventId事件ID
	 * @param startDay开始时间
	 * @param endDay结束时间
	 * @return
	 */
	public Integer queryConversionCount(String pageId, String eventId, String startDay, String endDay, Integer lanuchId) {
		if (StringUtils.isBlank(startDay)) {
			startDay = "00000000";
		}
		if (StringUtils.isBlank(endDay)) {
			endDay = "zzzzzzzz";
		}
		String script = null;
		// 页面ID与事件ID都不为空
		Configuration conf = Configuration.getInstance();
		String pageTable = conf.getConfig("hive.table.conversionPage");
		String eventTable = conf.getConfig("hive.table.conversionEvent");
		if (StringUtils.isNotBlank(pageId) && StringUtils.isNotBlank(eventId)) {
			StringBuilder sb = new StringBuilder();
			String pageIdFill = StringUtils.rightPad(pageId, 16, "0");
			String startRowKey = String.format("%s#%s", pageIdFill, startDay);
			String endRowKey = String.format("%s#%s", pageIdFill, endDay);
			sb.append(String.format("conversion_page=select * from %s.%s where startRowKey = '%s' and endRowKey = '%s';", domain, pageTable, startRowKey, endRowKey));
			String eventIdFill = StringUtils.rightPad(eventId, 16, "0");
			startRowKey = String.format("%s#%s", eventIdFill, startDay);
			endRowKey = String.format("%s#%s", eventIdFill, endDay);
			sb.append(script = String.format("conversion_event=select * from %s.%s where startRowKey = '%s' and endRowKey = '%s';", domain, eventTable, startRowKey,
					endRowKey));
			sb.append("conversion=union2(conversion_page,conversion_event);");
			//TODO 关联投放的人的bitmap
			//TODO 暂时放弃关联吧
			/*sb.append(String.format("crowd=select * from " + domain + ".launch_crowd where id=%d;", lanuchId));
			sb.append("unite(conversion  ,crowd).subkey(0);");*/
			script = sb.toString();
		}
		// 单查页面ID
		else if (StringUtils.isNotBlank(pageId)) {
			String pageIdFill = StringUtils.rightPad(pageId, 16, "0");
			String startRowKey = String.format("%s#%s", pageIdFill, startDay);
			String endRowKey = String.format("%s#%s", pageIdFill, endDay);
			StringBuilder sb = new StringBuilder();
			sb.append(String.format("conversion=select * from %s.%s where startRowKey = '%s' and endRowKey = '%s';", domain, pageTable, startRowKey, endRowKey));
			//TODO 关联投放的人的bitmap
			//TODO 暂时放弃关联吧
			/*sb.append(String.format("crowd=select * from " + domain + ".launch_crowd where id=%d;", lanuchId));
			sb.append("unite(conversion  ,crowd).subkey(0);");*/
			script = sb.toString();
		}
		// 单查事件ID
		else if (StringUtils.isNotBlank(eventId)) {
			String eventIdFill = StringUtils.rightPad(eventId, 16, "0");
			String startRowKey = String.format("%s#%s", eventIdFill, startDay);
			String endRowKey = String.format("%s#%s", eventIdFill, endDay);
			StringBuilder sb = new StringBuilder();
			sb.append(String.format("conversion=select * from %s.%s where startRowKey = '%s' and endRowKey = '%s';", domain, eventTable, startRowKey, endRowKey));
			//TODO 关联投放的人的bitmap
			//TODO 暂时放弃关联吧
			/*sb.append(String.format("crowd=select * from " + domain + ".launch_crowd where id=%d;", lanuchId));
			sb.append("unite(conversion  ,crowd).subkey(0);");*/
			script = sb.toString();
		}else{
			return 0;
		}
		
		logger.debug("queryUrl: " + queryUrl);
		logger.debug("script: " + script);
		QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
		Integer count = 0;
		if(qer != null && qer.getResults() != null && qer.getResults().size() > 0) {
			Object value = qer.getResults().get(0).getValue();
			if(value != null){
				count = Integer.parseInt(value.toString());
			}
		} else {
			logger.info("***<<< 查询无结果 >>>***");
		}
		return count;
	}
}
