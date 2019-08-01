package td.olap.query;

/**
 * Created by Yan on 2017/4/6.
 */

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.*;

import org.apache.commons.lang.StringUtils;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.script.Script;
import org.elasticsearch.script.ScriptType;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.metrics.scripted.ScriptedMetric;
import org.elasticsearch.search.aggregations.metrics.scripted.ScriptedMetricAggregationBuilder;
import org.elasticsearch.search.aggregations.metrics.sum.InternalSum;
import org.elasticsearch.search.aggregations.metrics.valuecount.InternalValueCount;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.olap.query.runscript.bean.EsQueryBean;
import td.olap.query.utils.RedisClient;

public class WiFiAnalyticsESQuerService {

	private static Logger logger = LoggerFactory.getLogger(WiFiAnalyticsESQuerService.class);
	private static TransportClient client = null;

	private static WiFiAnalyticsESQuerService instance = null;

	private static String cluster;
	private static String hosts;

	public static WiFiAnalyticsESQuerService getInstance(String cluster, String hosts) throws UnknownHostException {
		if (instance == null) {
			instance = new WiFiAnalyticsESQuerService(cluster, hosts);
		}
		return instance;
	}

	private WiFiAnalyticsESQuerService(String clusterName, String hostlist) throws UnknownHostException {
		cluster = clusterName;
		hosts = hostlist;
		Settings settings = Settings.builder().put("cluster.name", clusterName)
				.put("client.transport.sniff", true).build();
		client = new PreBuiltTransportClient(settings);
		List<String> esHostsList = Arrays.asList(hostlist.split(","));
		for (String host : esHostsList) {
			String[] ipPort = host.split(":");
			client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName(ipPort[0]), Integer.valueOf(ipPort[1])));
		}
	}

	/**
	 * 案场到访总时间
	 *
	 * @param query   EsQueryBean
	 * @return 次数
	 */

	public Double querySum(EsQueryBean query) {

        AggregationBuilder aggregationBuilder = AggregationBuilders.sum(query.getIndex()).field(query.getIndex());
        SearchResponse searchResponse = query(generateQueryBuild(query), aggregationBuilder , query.getDbName(), query.getTypeName());

		Object sum = searchResponse.getAggregations().getProperty(query.getIndex());
		return ((InternalSum) sum).getValue();
	}

	/**
	 * 案场到访次数
	 *
	 * @param query @link EsQueryBean

	 * @return 次数
	 */
	public long queryCounter(EsQueryBean query) {

		AggregationBuilder aggregationBuilder = AggregationBuilders.count(query.getIndex()).field(query.getIndex());
		SearchResponse searchResponse = query(generateQueryBuild(query), aggregationBuilder , query.getDbName(), query.getTypeName());

		Object count = searchResponse.getAggregations().getProperty(query.getIndex());
		return ((InternalValueCount) count).getValue();
	}


	/**
	 * 获取人群
	 * @param query @link EsQueryBean
	 * @return 次数
	 */
	public byte[] queryBitmap(EsQueryBean query, String redisHosts,String masterName) {

		SearchRequestBuilder searchRequestBuilder = client.prepareSearch(query.getDbName()).setTypes(query.getTypeName());
		List<BoolQueryBuilder> queryBuilderList = generateQueryBuild(query);
		BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
		for (QueryBuilder queryBuilder : queryBuilderList)
			boolQueryBuilder.must(queryBuilder);
		searchRequestBuilder.setQuery(boolQueryBuilder);
		String aggTypeOffset = "tenant_offset";
		ScriptedMetricAggregationBuilder aggregation = null;

		if(StringUtils.isNotEmpty(query.getEventCount()) && StringUtils.isNotEmpty(query.getRelatetionship())){

			Map<String,Object> map = new HashMap<>();
			map.put("_agg",new HashMap());
			map.put("computerType", "eventcount");
			map.put("relatetionship", query.getRelatetionship());
			map.put("eventcount", query.getEventCount());
			aggregation = AggregationBuilders
					.scriptedMetric("agg")
					.initScript(new Script("params._agg.transactions = new HashMap()"))
					.mapScript(new Script("def pro = [];if(params._agg.transactions.get(doc." + aggTypeOffset + ".value + \"\") == null){pro.add(doc." + aggTypeOffset + ".value + \",\" + 1);params._agg.transactions[doc." + aggTypeOffset + ".value + \"\"]=pro} else {params._agg.transactions.get(doc."  + aggTypeOffset +  ".value + \"\").add(doc." + aggTypeOffset + ".value  + \",\" + 1)}"))
					.reduceScript(new Script(ScriptType.INLINE, "native", "topOffset", map))
					.params(map);
		}else {
			Map<String,Object> map = new HashMap<String,Object>();
			map.put("_agg",new HashMap());
			aggregation = AggregationBuilders
				.scriptedMetric("agg")
				.initScript(new Script("params._agg.transactions = []"))
				.mapScript(new Script("params._agg.transactions.add(doc." + aggTypeOffset + ".value)"))
				.combineScript(new Script("def profit = []; for (t in params._agg.transactions) { profit.add((int)t) } return profit"))
				.reduceScript(new Script(ScriptType.INLINE,"native","offset",map));
		}

		if(aggregation == null){
			return null;
		}


		searchRequestBuilder.addAggregation(aggregation);
		SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();
		ScriptedMetric agg = searchResponse.getAggregations().get("agg");
		String key = (String) agg.aggregation();

		//System.out.println("scriptedResult [{}] " + key);
		return RedisClient.getInstance( redisHosts, masterName).get(key.getBytes());
	}


	private SearchResponse query(List<BoolQueryBuilder> queryBuilderList, AggregationBuilder aggregationBuild, String dbName, String typeName) {
		SearchRequestBuilder searchRequestBuilder = client.prepareSearch(dbName).setTypes(typeName);
		BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
		for (QueryBuilder queryBuilder : queryBuilderList)
			boolQueryBuilder.must(queryBuilder);
		searchRequestBuilder.setQuery(boolQueryBuilder);
		searchRequestBuilder.addAggregation(aggregationBuild);
		SearchResponse searchResponse = searchRequestBuilder.get();
		return searchResponse;
	}


	private List<BoolQueryBuilder> generateQueryBuild(EsQueryBean queryBean){

        List<BoolQueryBuilder> queryBuilderList = new ArrayList<>();
        if(StringUtils.isNotEmpty(queryBean.getTenantId())) {
			queryBuilderList.add(QueryBuilders.boolQuery().must(QueryBuilders.termQuery("tenant_id", queryBean.getTenantId())));
		}

        if(StringUtils.isNotEmpty(queryBean.getProjectId())) {
			queryBuilderList.add(QueryBuilders.boolQuery().must(QueryBuilders.termQuery("project_id", queryBean.getProjectId())));
		}

        if(StringUtils.isNotEmpty(queryBean.getNewFlag())){
            queryBuilderList.add(QueryBuilders.boolQuery().must(QueryBuilders.termQuery("new_flag", queryBean.getNewFlag())));
        }

        if(StringUtils.isNotEmpty(queryBean.getCount())){
            queryBuilderList.add(QueryBuilders.boolQuery().must(QueryBuilders.termQuery("count", queryBean.getCount())));
        }

		if(StringUtils.isNotEmpty(queryBean.getActiveSign())){
			queryBuilderList.add(QueryBuilders.boolQuery().must(QueryBuilders.termQuery("active_sign", queryBean.getActiveSign())));
		}

        if(StringUtils.isNotEmpty(queryBean.getMinDuration()) ){
			if(queryBean.isHasMin()) {
				queryBuilderList.add(QueryBuilders.boolQuery().must(QueryBuilders.rangeQuery("session_duration").gte(queryBean.getMinDuration())));
			}else{
				queryBuilderList.add(QueryBuilders.boolQuery().must(QueryBuilders.rangeQuery("session_duration").gt(queryBean.getMinDuration())));
			}
        }

		if(StringUtils.isNotEmpty(queryBean.getMaxDuration()) ){
			if(queryBean.isHasMax()) {
				queryBuilderList.add(QueryBuilders.boolQuery().must(QueryBuilders.rangeQuery("session_duration").lte(queryBean.getMaxDuration())));
			}else{
				queryBuilderList.add(QueryBuilders.boolQuery().must(QueryBuilders.rangeQuery("session_duration").lt(queryBean.getMaxDuration())));
			}
		}

        if(StringUtils.isNotEmpty(queryBean.getStartDate()) ){
			queryBuilderList.add(QueryBuilders.boolQuery().must(QueryBuilders.rangeQuery("ts_receive").gte(queryBean.getStartDate())));
        }
		if( StringUtils.isNotEmpty(queryBean.getEndDate())){
			queryBuilderList.add(QueryBuilders.boolQuery().must(QueryBuilders.rangeQuery("ts_receive").lte(queryBean.getEndDate())));
		}

		if(null != queryBean.getProjectIds()  && queryBean.getProjectIds().size() > 0){
			queryBuilderList.add(QueryBuilders.boolQuery().filter(QueryBuilders.termsQuery("project_id", queryBean.getProjectIds())));
		}

		return queryBuilderList;
	}

}
