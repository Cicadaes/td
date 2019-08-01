package td.enterprise.wanalytics.etl.util;

import kafka.api.PartitionOffsetRequestInfo;
import kafka.common.TopicAndPartition;
import kafka.javaapi.OffsetResponse;
import kafka.javaapi.PartitionMetadata;
import kafka.javaapi.TopicMetadata;
import kafka.javaapi.TopicMetadataRequest;
import kafka.javaapi.consumer.SimpleConsumer;
import lombok.extern.slf4j.Slf4j;
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.imps.CuratorFrameworkState;
import org.apache.curator.retry.RetryNTimes;
import org.apache.log4j.Logger;
import org.apache.zookeeper.data.Stat;

import java.io.Serializable;
import java.util.*;
import java.util.Map.Entry;

/**  * @function:kafka相关工具类 
 */
@Slf4j
public class KafkaUtil implements Serializable {

	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(KafkaUtil.class);
	
	private static KafkaUtil kafkaUtil = null;  

    final static String ZKHOSTS = SysConfigUtil.getValue("kafka.wifianalytics.zkhosts");
    final static String BROKERS = SysConfigUtil.getValue("kafka.wifianalytics.brokers");
    final static String BROKERSLIST = SysConfigUtil.getValue("kafka.wifianalytics.brokers.list");
    final static int BROKERSPORT = Integer.parseInt(SysConfigUtil.getValue("kafka.wifianalytics.brokers.port"));
    final static int TIMEOUT = 20000;
    final static int BUFFERSIZE = 1024 * 1024;
    
	final static RetryPolicy RETRYPOLICY = new RetryNTimes(3, TIMEOUT);
    
	private static String _zkconsumers = "/consumers";

    public KafkaUtil(){}
    
    public static KafkaUtil getInstance(){  
        if(kafkaUtil == null){  
            kafkaUtil = new KafkaUtil();  
        }  
        return kafkaUtil;  
    }

	public TreeMap<Integer, PartitionMetadata> findLeader(List<String> a_seedBrokers, int a_port, String a_topic) {
		TreeMap<Integer, PartitionMetadata> map = new TreeMap<Integer, PartitionMetadata>();
		loop: for (String seed : a_seedBrokers) {
			SimpleConsumer consumer = null;
			try {
				consumer = new SimpleConsumer(seed, a_port, 100000, 64 * 1024, "leaderLookup" + new Date().getTime());
				List<String> topics = Collections.singletonList(a_topic);
				TopicMetadataRequest req = new TopicMetadataRequest(topics);
				kafka.javaapi.TopicMetadataResponse resp = consumer.send(req);

				List<TopicMetadata> metaData = resp.topicsMetadata();
				for (TopicMetadata item : metaData) {
					for (PartitionMetadata part : item.partitionsMetadata()) {
						map.put(part.partitionId(), part);
					}
				}
			} catch (Exception e) {
				log.info("Error communicating with Broker [" + seed + "] to find Leader for [" + a_topic + ", ] Reason: " + e);
			} finally {
				if (consumer != null)
					consumer.close();
			}
		}
		return map;
	}
    
	public long getLastOffset(SimpleConsumer consumer, String topic, int partition, long whichTime, String clientName) {
		TopicAndPartition topicAndPartition = new TopicAndPartition(topic, partition);
		Map<TopicAndPartition, PartitionOffsetRequestInfo> requestInfo = new HashMap<TopicAndPartition, PartitionOffsetRequestInfo>();
		requestInfo.put(topicAndPartition, new PartitionOffsetRequestInfo(whichTime, 1));
		kafka.javaapi.OffsetRequest request = new kafka.javaapi.OffsetRequest(requestInfo, kafka.api.OffsetRequest.CurrentVersion(), clientName);
		OffsetResponse response = consumer.getOffsetsBefore(request);

		if (response.hasError()) {
			logger.error("Error fetching data Offset Data the Broker. Reason: " + response.errorCode(topic, partition));
			return 0;
		}
		long[] offsets = response.offsets(topic, partition);
		return offsets[0];
	}

	public Long getLastOffsetByTopic(String topic) {
		List<String> seeds = new ArrayList<String>();
		String[] seedArr = BROKERSLIST.split(",");
		for(String seed:seedArr){
			seeds.add(seed);
		}
		TreeMap<Integer, PartitionMetadata> metadatas = findLeader(seeds, BROKERSPORT, topic);

		Long sumOffset = 0L;
		for (Entry<Integer, PartitionMetadata> entry : metadatas.entrySet()) {
			int partition = entry.getKey();
			String leadBroker = entry.getValue().leader().host();
			String clientName = "Client_" + topic + "_" + partition;
			SimpleConsumer consumer = new SimpleConsumer(leadBroker, BROKERSPORT, TIMEOUT, BUFFERSIZE, clientName);
			long readOffset = getLastOffset(consumer, topic, partition, kafka.api.OffsetRequest.LatestTime(), clientName);
			sumOffset += readOffset;
			if (consumer != null)
				consumer.close();
		}
		return sumOffset;
	}
    
	public Long getCurrentOffsetByTopic(String groupId, String topic, int partition) {
		CuratorFramework client = CuratorFrameworkFactory.newClient(ZKHOSTS, TIMEOUT, TIMEOUT, RETRYPOLICY);
		String currentOffset = "0";
		try {
			logger.info(client.getState());
			if(client.getState().equals(CuratorFrameworkState.LATENT)){
				client.start();
			}
			if (groupId != null && !groupId.equals("") && topic != null && !topic.equals("")) {
				String partitionpath = _zkconsumers + "/" + groupId + "/offsets/" + topic + "/" + partition;
				Stat stat = client.checkExists().forPath(partitionpath);
				if(stat!=null){
					byte[] newoffset = client.getData().forPath(partitionpath);
					currentOffset = new String(newoffset, "UTF-8");
				}
			}
			client.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		Long offset = Long.parseLong(currentOffset);
		return offset;
	}
  
    public static void main(String[] args){  
        try{  
            logger.debug("getLastOffsetByTopic---------"+KafkaUtil.getInstance().getLastOffsetByTopic("ALL_LOG"));  
            logger.debug("getCurrentOffsetByTopic---------"+KafkaUtil.getInstance().getCurrentOffsetByTopic("shujuzutest343410DA3DEC47BAD305DEE979FEDD40B091","ALL_LOG",0));
        }catch(Exception ex) {  
            ex.printStackTrace();  
        }  
    }
    
}  