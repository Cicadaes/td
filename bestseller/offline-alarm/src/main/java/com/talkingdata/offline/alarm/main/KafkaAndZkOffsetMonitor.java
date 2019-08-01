package com.talkingdata.offline.alarm.main;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TreeMap;
import java.util.Map.Entry;

import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;

import com.talkingdata.offline.alarm.util.KafkaOffsetTools;
import com.talkingdata.offline.alarm.util.MailUtil;
import com.talkingdata.offline.alarm.util.ZookeeperUtil;

import kafka.javaapi.PartitionMetadata;
import kafka.javaapi.consumer.SimpleConsumer;

public class KafkaAndZkOffsetMonitor {
	
//	private static final String ZK_HOST="10.150.33.112:2181,10.150.33.113:2181,10.150.33.114:2181";
//	private static final String KAFKA_HOST="10.150.33.112,10.150.33.113,10.150.33.114";
	private static final int KAFKA_PORT=9092;
//	private static final String TOPICS="wifi.collector,wifianalytics.bitmap";
	private static final int SESSION_TIMEOUT = 30000;
	private static SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
	
	public static void main(String[] args) throws Exception {
		
		if(args.length<4){
			System.out.println("Usage : Params is wrong!");
			System.exit(-1);
		}
		String zkHosts=args[0];
		String kafkaHosts=args[1];
		String[] kafkaHostArr = kafkaHosts.split(",");
		String topics = args[2];
		String recipients = args[3];
		String[] recipientArr = recipients.split(",");
		
		String date = df.format(new Date());
		KafkaOffsetTools kot = new KafkaOffsetTools();
		String [] topicArr = topics.split(",");
		List<String> seeds = new ArrayList<String>();
		for(String str:kafkaHostArr){
			seeds.add(str);
		}
		ZooKeeper zk =null;
		ZookeeperUtil zkClient = new ZookeeperUtil();
		try {
			zk = new ZooKeeper(zkHosts, KafkaAndZkOffsetMonitor.SESSION_TIMEOUT,new Watcher(){
				public void process(org.apache.zookeeper.WatchedEvent event)
				{
					
				}
			});
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		for(String topic:topicArr){
			TreeMap<Integer,PartitionMetadata> metadatas = kot.findLeader(seeds, KAFKA_PORT, topic);
			long zk_sum = 0;
			long kafka_sum=0;
			for(int i=0;i<3;i++){
				String leadBroker = metadatas.get(i).leader().host();
				String clientName = "Client_" + topic + "_" + i;
				System.out.println("leadBroker:["+leadBroker+"]");
				SimpleConsumer consumer = new SimpleConsumer(leadBroker, KAFKA_PORT, 100000,
						64 * 1024, clientName);
				long readOffset = kot.getLastOffset(consumer, topic, i,
						kafka.api.OffsetRequest.LatestTime(), clientName);
				if(consumer!=null)consumer.close();
				kafka_sum +=readOffset;
				byte[] bdata = zk.getData("/wifianalytics/kafkaoffsets/"+topic+"/partition_"+i, false, null);
				String sdata = new String(bdata,"UTF-8");
				sdata = sdata.substring(sdata.indexOf("offset")+8,sdata.indexOf("partition")-2);
				zk_sum+=Long.parseLong(sdata);
				System.out.println(date+"\t"+topic+"\tpartition_"+i+"\t"+readOffset+"\t"+sdata);
			}
			if(kafka_sum-zk_sum>= 100 * 10000){
				String message="time:["+date+"]\ntopic:["+topic+"]\nkafkaoffset:["+kafka_sum+"]\nzkoffset:["+zk_sum+"]\nlayerCount:["+(kafka_sum-zk_sum)+"]";
				MailUtil.sendMail("Product Offset Monitor Mail",message,recipientArr);
			}
			
		}
		try {
			zk.close();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
