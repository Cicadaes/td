package td.enterprise.wanalytics.processor;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;
import org.apache.commons.lang.StringUtils;
import org.apache.storm.Config;
import org.apache.storm.LocalCluster;
import org.apache.storm.StormSubmitter;
import org.apache.storm.kafka.BrokerHosts;
import org.apache.storm.kafka.SpoutConfig;
import org.apache.storm.kafka.ZkHosts;
import org.apache.storm.kafka.bolt.KafkaBolt;
import org.apache.storm.kafka.bolt.selector.DefaultTopicSelector;
import org.apache.storm.spout.RawScheme;
import org.apache.storm.spout.SchemeAsMultiScheme;
import org.apache.storm.topology.TopologyBuilder;
import org.apache.storm.tuple.Fields;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;
import td.enterprise.dmp.common.ApplicationContextManager;
import td.enterprise.dmp.meta.entity.cube.Cube;
import td.enterprise.dmp.meta.page.cube.CubePage;
import td.enterprise.dmp.meta.service.cube.CubeService;
import td.enterprise.framework.plugin.changer.atomic.impl.SpringDaoChanger;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.kafka.BitmapKafkaSpout;
import td.enterprise.wanalytics.kafka.CollectorKafkaSpout;
import td.enterprise.wanalytics.processor.cache.CacheFactory;
import td.enterprise.wanalytics.processor.utils.ProcessorConfigs;
import td.enterprise.wanalytics.processor.utils.RedisClient;
import td.olap.bitmap.service.BitmapService;
import td.olap.bitmap.service.ServiceHelper;

import java.util.*;

/**
 * 请参考 https://github.com/apache/storm/tree/master/external/storm-kafka
 * 读取WiFiPix上传log解析成单条数据写入Kafka队列
 * 
 * @author yangtao
 */
public class WifiAnalyticsTopology {

	private static Logger logger = LoggerFactory.getLogger(WifiAnalyticsTopology.class);

	public static void main(String[] args) throws Exception {

		//创建cube表，如果不存在
		checkAndCreateCubeTables();
		
		//初始化租户黑名单
		//initBacklist();
		
		//初始化所有探针信息
		//initAllSensorMac();
		
		logger.info("============== WifiAnalyticsTopology {} 提交开始...", WifiAnalyticsTopology.class.getSimpleName());
		Properties config = ProcessorConfigs.getprocessWiFiConfigProperties();

		WifiAnalyticsTopology topology = new WifiAnalyticsTopology();

		if (args == null || args.length == 0) {
			topology.submitWifiAnalyticsTopology(config);
			topology.submitWifiAnalyticsBitmapTopology(config);
		} else if (args != null && args[0].equals("WifiAnalyticsTopology")) {
			topology.submitWifiAnalyticsTopology(config);
		} else if (args != null && args[0].equals("WifiAnalyticsBitmapTopology")) {
			topology.submitWifiAnalyticsBitmapTopology(config);
		}
		logger.info("============== 提交完成。", WifiAnalyticsTopology.class.getSimpleName());
		String runType = config.getProperty("storm.runtype", "cluster");
		if ("cluster".equals(runType)) {
			System.exit(0);
		}
	}
	
	/**
	 * 动态检查和创建表
	 */
	private static void checkAndCreateCubeTables() {
		ApplicationContext bitmapApplicationContext = new ClassPathXmlApplicationContext(new String[]{"meta-applicationContext.xml", "computer-applicationContext.xml"});
		ApplicationContextManager.setAppContext(bitmapApplicationContext);
		BitmapService bitmapService = ServiceHelper.getServiceImpl(1);
		CubeService cubeService =  (CubeService) ApplicationContextManager.getBean("cubeService");
		CubePage page = new CubePage();
	    try{
	    	page.setPage(1);
	    	page.setRows(2000);
	    	page.setDomainId(Constants.DOMAIN_ID);
	    	List<Cube> list = cubeService.queryByList(page);
	    	List<Cube> buildList = new ArrayList<Cube> ();
	    	for(Cube cube : list){
	    	    Cube newCube = cubeService.buildByCubeName(cube.getName(), cube.getDomainId());
	    	    buildList.add(newCube);
	    	}
	    	list.clear();
	    	list = null;
	    	bitmapService.loadMeta(Constants.DOMAIN_ID + "", buildList);
	    }catch(Exception e){
	    	e.printStackTrace();
	    	logger.error("Init Cube Exception",e);
	    }
	}

	public void submitWifiAnalyticsTopology(Properties configs) {
		String topologyName = "WifiAnalyticsTopology";
		String wifiAnalyticsTopic = configs.getProperty("kafka.wifianalytics.collector.topic", "wifi.collector");
		logger.info("topologyName : {}", topologyName);
		logger.info("kafka.wifi.topic.collector : {}", wifiAnalyticsTopic);
		Config config = new Config();
		config.setNumWorkers(Integer.valueOf(configs.getProperty("storm.wifianalytics.workers", "1")));
		config.setNumAckers(Integer.valueOf(configs.getProperty("storm.wifianalytics.ackers", "1")));
		if (StringUtils.isNotBlank(configs.getProperty("WifiAnalyticsTopology.storm.Config.TOPOLOGY_MAX_SPOUT_PENDING"))) {
			config.setMaxSpoutPending(Integer.valueOf(configs.getProperty("WifiAnalyticsTopology.storm.Config.TOPOLOGY_MAX_SPOUT_PENDING")));
		}

		config.put(Config.TOPOLOGY_EXECUTOR_RECEIVE_BUFFER_SIZE, Integer.valueOf(configs.getProperty("storm.Config.TOPOLOGY_RECEIVER_BUFFER_SIZE", "8")));
		config.put(Config.TOPOLOGY_TRANSFER_BUFFER_SIZE, Integer.valueOf(configs.getProperty("storm.Config.TOPOLOGY_TRANSFER_BUFFER_SIZE", "32")));
		config.put(Config.TOPOLOGY_EXECUTOR_RECEIVE_BUFFER_SIZE,
				Integer.valueOf(configs.getProperty("storm.Config.TOPOLOGY_EXECUTOR_RECEIVE_BUFFER_SIZE", "16384")));
		config.put(Config.TOPOLOGY_EXECUTOR_SEND_BUFFER_SIZE,
				Integer.valueOf(configs.getProperty("storm.Config.TOPOLOGY_EXECUTOR_SEND_BUFFER_SIZE", "16384")));
		config.put(Config.TOPOLOGY_MESSAGE_TIMEOUT_SECS, Integer.valueOf(configs.getProperty("storm.Config.TOPOLOGY_MESSAGE_TIMEOUT_SECS", "30000")));

		// Kafka配置
		Properties props = new Properties();
		props.put("bootstrap.servers", configs.getProperty("kafka.wifianalytics.brokers"));
		props.put("acks", configs.getProperty("kafka.producer.request.required.acks", "1"));
		props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
		props.put("value.serializer", "org.apache.kafka.common.serialization.ByteArraySerializer");
//		common.put(KafkaBolt.KAFKA_BROKER_PROPERTIES, props);

		try {
			BrokerHosts hosts = new ZkHosts(configs.getProperty("kafka.wifianalytics.zkhosts"));
			SpoutConfig spoutConfig = new SpoutConfig(hosts, wifiAnalyticsTopic, "/wifianalytics/kafkaoffsets", wifiAnalyticsTopic);
			spoutConfig.zkServers = Arrays.asList(configs.getProperty("storm.wifianalytics.offsetstorage.zkhosts").split(","));// store
																																// offsets
			spoutConfig.zkPort = Integer.valueOf(configs.getProperty("storm.wifianalytics.offsetstorage.zkport", "2181"));
			spoutConfig.scheme = new SchemeAsMultiScheme(new RawScheme());
			spoutConfig.stateUpdateIntervalMs = Long.valueOf(configs.getProperty("storm.kafkaspout.stateUpdateIntervalMs", "10000"));
			CollectorKafkaSpout kafkaSpout = new CollectorKafkaSpout(spoutConfig);
			TopologyBuilder builder = new TopologyBuilder();
			builder.setSpout(wifiAnalyticsTopic, kafkaSpout, Integer.valueOf(configs.getProperty("storm.wifianalytics.kafkaSpout.excuters", "1")));
			// wifi bolt
			String wifiLogBoltName = "wifiBolt";
			builder.setBolt(wifiLogBoltName, new WiFiBolt(), Integer.valueOf(configs.getProperty("storm.wifianalytics.wifiBolt.excuters", "1")))
					.fieldsGrouping(wifiAnalyticsTopic, new Fields("mac"));

			// kafka bolt
			String wifiLog2CubeBoltName = "wifiCube2Kafka";
			KafkaBolt<String, byte[]> bitmapKafkaBolt = new KafkaBolt<String, byte[]>().withTopicSelector(new DefaultTopicSelector(configs
					.getProperty("kafka.wifianalytics.bitmap.topic", "wifianalytics.bitmap")));
			builder.setBolt(wifiLog2CubeBoltName, bitmapKafkaBolt,
					Integer.valueOf(configs.getProperty("storm.wifianalytics.kafkaBolt.excuters", "1"))).shuffleGrouping(wifiLogBoltName, "bitmap");
			
			bitmapKafkaBolt.withProducerProperties(props);
			bitmapKafkaBolt.setAsync(false);
			
			String runType = configs.getProperty("storm.runtype", "cluster");
			if ("cluster".equals(runType)) {
				StormSubmitter.submitTopology(topologyName, config, builder.createTopology());
			} else {
				LocalCluster localCluster = new LocalCluster();
				localCluster.submitTopology(topologyName, config, builder.createTopology());
			}
			logger.info("====== Submit {} 已完成。", topologyName);
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("====== Submit {} 失败:{}", topologyName, e);
		}
	}

	public void submitWifiAnalyticsBitmapTopology(Properties configs) {
		String topologyName = "WifiAnalyticsBitmapTopology";
		String wifiAnalyticsBitmapTopic = configs.getProperty("kafka.wifianalytics.bitmap.topic", "wifianalytics.bitmap");
		logger.info("topologyName : {}", topologyName);
		logger.info("kafka.wifianalytics.bitmap.topic : {}", wifiAnalyticsBitmapTopic);
		Config config = new Config();
		config.setNumWorkers(Integer.valueOf(configs.getProperty("storm.wifianalytics.bitmap.workers", "1")));
		config.setNumAckers(Integer.valueOf(configs.getProperty("storm.wifianalytics.bitmap.ackers", "1")));
		if (StringUtils.isNotBlank(configs.getProperty("WifiAnalyticsBitmapTopology.storm.Config.TOPOLOGY_MAX_SPOUT_PENDING"))) {
			config.setMaxSpoutPending(Integer.valueOf(configs.getProperty("WifiAnalyticsBitmapTopology.storm.Config.TOPOLOGY_MAX_SPOUT_PENDING")));
		}

		config.put(Config.TOPOLOGY_EXECUTOR_RECEIVE_BUFFER_SIZE, Integer.valueOf(configs.getProperty("storm.Config.TOPOLOGY_RECEIVER_BUFFER_SIZE", "8")));
		config.put(Config.TOPOLOGY_TRANSFER_BUFFER_SIZE, Integer.valueOf(configs.getProperty("storm.Config.TOPOLOGY_TRANSFER_BUFFER_SIZE", "32")));
		config.put(Config.TOPOLOGY_EXECUTOR_RECEIVE_BUFFER_SIZE,
				Integer.valueOf(configs.getProperty("storm.Config.TOPOLOGY_EXECUTOR_RECEIVE_BUFFER_SIZE", "16384")));
		config.put(Config.TOPOLOGY_EXECUTOR_SEND_BUFFER_SIZE,
				Integer.valueOf(configs.getProperty("storm.Config.TOPOLOGY_EXECUTOR_SEND_BUFFER_SIZE", "16384")));
		config.put(Config.TOPOLOGY_MESSAGE_TIMEOUT_SECS, Integer.valueOf(configs.getProperty("storm.Config.TOPOLOGY_MESSAGE_TIMEOUT_SECS", "30000")));

//		// Kafka配置
//		Properties props = new Properties();
//		props.put("metadata.broker.list", configs.getProperty("kafka.wifianalytics.brokers"));
//		props.put("request.required.acks", configs.getProperty("kafka.producer.request.required.acks", "1"));
//		props.put("key.serializer.class", "kafka.serializer.StringEncoder");
//		props.put("serializer.class", "kafka.serializer.DefaultEncoder");
//		props.put("producer.type", configs.getProperty("kafka.producer.type", "sync"));
//		common.put(KafkaBolt.KAFKA_BROKER_PROPERTIES, props);

		try {
			BrokerHosts hosts = new ZkHosts(configs.getProperty("kafka.wifianalytics.zkhosts"));
			SpoutConfig spoutConfig = new SpoutConfig(hosts, wifiAnalyticsBitmapTopic, "/wifianalytics/kafkaoffsets", wifiAnalyticsBitmapTopic);
			spoutConfig.zkServers = Arrays.asList(configs.getProperty("storm.wifianalytics.offsetstorage.zkhosts").split(","));// store
																																// offsets
			spoutConfig.zkPort = Integer.valueOf(configs.getProperty("storm.wifianalytics.offsetstorage.zkport", "2181"));
			spoutConfig.scheme = new SchemeAsMultiScheme(new RawScheme());
			spoutConfig.stateUpdateIntervalMs = Long.valueOf(configs.getProperty("storm.kafkaspout.stateUpdateIntervalMs", "10000"));
			BitmapKafkaSpout kafkaSpout = new BitmapKafkaSpout(spoutConfig);
			TopologyBuilder builder = new TopologyBuilder();
			builder.setSpout(wifiAnalyticsBitmapTopic, kafkaSpout,
					Integer.valueOf(configs.getProperty("storm.wifianalytics.bitmap.kafkaSpout.excuters", "1")));
			String wifiBitmapBoltName = "wifiBitmapBolt";
			builder.setBolt(wifiBitmapBoltName, new WiFiBitmapBolt(),
					Integer.valueOf(configs.getProperty("storm.wifianalytics.bitmap.wifiBitmapBolt.excuters", "1"))).fieldsGrouping(
//					wifiAnalyticsBitmapTopic,"bitmap", new Fields("cubeName"));
					wifiAnalyticsBitmapTopic,"bitmap", new Fields("recordKey"));
			
			WifiCounterBolt counterBolt = new WifiCounterBolt();
			builder.setBolt("wifiCounterBolt", counterBolt,Integer.valueOf(configs.getProperty("storm.wifianalytics.bitmap.counterbolt.excuters", "1")))
					.shuffleGrouping(wifiAnalyticsBitmapTopic,"counter");
			
			String runType = configs.getProperty("storm.runtype", "cluster");
			if ("cluster".equals(runType)) {
				StormSubmitter.submitTopology(topologyName, config, builder.createTopology());
			} else {
				LocalCluster localCluster = new LocalCluster();
				localCluster.submitTopology(topologyName, config, builder.createTopology());
			}
			logger.info("====== Submit {} 已完成。", topologyName);
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("====== Submit {} 失败:{}", topologyName, e);
		}
	}
	//重新初始化黑名单
	public static void initBacklist() throws Exception{
		long begin = System.currentTimeMillis();
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select tenant_id , project_id,device_mac from TD_CROWD_BLACK_LIST where tenant_id is not null and device_mac is not null";
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		Map<String,String> blacklistMap = new HashMap<String,String> ();
		//放到ehcache 缓存
		Cache blackListMacCache = CacheFactory.getBlackListMacCache();
		if(null != list){
			for(Map<String,Object> map : list){
				Long object = (Long) map.get("project_id");
				if (object==null) {
					continue;
				}
				String key =  map.get("device_mac").toString().trim().toLowerCase() + "_" + map.get("tenant_id") +"_" +object;
				blacklistMap.put(key, "1");
				Element e = new Element(key, "1");
				blackListMacCache.put(e);
			}
		}
		if (null != list)
		list.clear();
		list = null;
		RedisClient.put(blacklistMap, RedisClient.expiredSeconds, Constants.BLACK_LIST_MAC_DB_INDEX);
		long end = System.currentTimeMillis();
		logger.info("============ 初始化黑名单完毕，用时:{}毫秒", (end-begin));
	}
	
	//查询探针信息
	public static void initAllSensorMac() throws Exception {
		long begin = System.currentTimeMillis();
		JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
		String sql = "select sensor_mac  from TD_SENSOR " ;
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		Map<String,String> sensorMap = new HashMap<String,String> ();
		if(null != list){
			for(Map<String,Object> map : list){
				String key =  "sensor_" + map.get("sensor_mac").toString().trim().toLowerCase();
				sensorMap.put(key, "1");
			}
		}
		if (null != list)
		list.clear();
		list = null;
		RedisClient.put(sensorMap, RedisClient.expiredSeconds, Constants.PROJECT_FRONT_USER_DB_INDEX);
		long end = System.currentTimeMillis();
		logger.info("============ 初始化所有探针mac完毕，用时:{}毫秒", (end-begin));
	}
	
}
