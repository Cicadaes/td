package td.enterprise.wanalytics.etl.task.postlog;

import kafka.consumer.ConsumerConfig;
import kafka.consumer.ConsumerIterator;
import kafka.consumer.KafkaStream;
import kafka.javaapi.consumer.ConsumerConnector;
import kafka.message.MessageAndMetadata;
import kafka.serializer.StringDecoder;
import kafka.utils.VerifiableProperties;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.bean.ReceiveConfig;
import td.enterprise.wanalytics.etl.task.postlog.bean.BaseReceiveConfigTask;
import td.enterprise.wanalytics.etl.util.ReceiveConfigUtil;

import java.util.*;

public class ConsumeKafkaLog extends BaseReceiveConfigTask {
	
	private static final Logger logger = Logger.getLogger(ConsumeKafkaLog.class);
	
	private final ConsumerConnector consumer;
	
	private static final String LOG_SEPARATOR = ",";
	private static final int CODE_SITE = 7;
	private static final String MACFILTER_SIGN_MOBILE = "10"; //mac非移动设备
	private static final String MACFILTER_SIGN_LENGTH = "11"; //mac长度不满足17位
	private static final String SIGNALFILTER_SIGN = "7"; //信号强度不在范围内
	private static final String NORMAL_SIGN = "";
	private static final String UNNORMAL_SIGN = "-1";

	public int messageNumberTmp = 0;//每次从kafka获取message条数计数器
	public int messageTotalTmp = 0;//总共从kafka获取message条数计数器
	public int messageTotalFilterTmp = 0;//总共从kafka获取message过滤后条数计数器

	public ConsumeKafkaLog() {
		Properties props = new Properties();
		// kafka 配置
		props.put("zookeeper.connect", ReceiveConfigUtil.getValue("kafka.offlineEnhancement.zkhosts"));
		props.put("group.id", ReceiveConfigUtil.getValue("kafka.offlineEnhancement.log.consumer.group.id"));
		props.put("zookeeper.session.timeout.ms", ReceiveConfigUtil.getValue("zookeeper.session.timeout.ms"));
		props.put("zookeeper.sync.time.ms", ReceiveConfigUtil.getValue("zookeeper.sync.time.ms"));
		props.put("zk.connectiontimeout.ms", ReceiveConfigUtil.getValue("zk.connectiontimeout.ms"));
		props.put("socket.timeout.ms", ReceiveConfigUtil.getValue("socket.timeout.ms"));
		props.put("socket.receive.buffer.bytes", ReceiveConfigUtil.getValue("socket.receive.buffer.bytes"));
		props.put("socket.send.buffer.bytes", ReceiveConfigUtil.getValue("socket.send.buffer.bytes"));
		props.put("auto.offset.reset", ReceiveConfigUtil.getValue("auto.offset.reset"));
		props.put("auto.commit.enable", ReceiveConfigUtil.getValue("auto.commit.enable"));
		props.put("serializer.class", ReceiveConfigUtil.getValue("serializer.class"));
		
		ConsumerConfig config = new ConsumerConfig(props);
		consumer = kafka.consumer.Consumer.createJavaConsumerConnector(config);
	}

	public ConsumeKafkaLog(String groupId) {
		Properties props = new Properties();
		// kafka 配置
		props.put("zookeeper.connect", ReceiveConfigUtil.getValue("kafka.offlineEnhancement.zkhosts"));
		props.put("group.id", groupId);
		props.put("zookeeper.session.timeout.ms", ReceiveConfigUtil.getValue("zookeeper.session.timeout.ms"));
		props.put("zookeeper.sync.time.ms", ReceiveConfigUtil.getValue("zookeeper.sync.time.ms"));
		props.put("zk.connectiontimeout.ms", ReceiveConfigUtil.getValue("zk.connectiontimeout.ms"));
		props.put("socket.timeout.ms", ReceiveConfigUtil.getValue("socket.timeout.ms"));
		props.put("socket.receive.buffer.bytes", ReceiveConfigUtil.getValue("socket.receive.buffer.bytes"));
		props.put("socket.send.buffer.bytes", ReceiveConfigUtil.getValue("socket.send.buffer.bytes"));
		props.put("auto.offset.reset", ReceiveConfigUtil.getValue("auto.offset.reset"));
		props.put("auto.commit.enable", ReceiveConfigUtil.getValue("auto.commit.enable"));
		props.put("serializer.class", ReceiveConfigUtil.getValue("serializer.class"));

		ConsumerConfig config = new ConsumerConfig(props);
		consumer = kafka.consumer.Consumer.createJavaConsumerConnector(config);
	}
	
	public Map<String,Integer> consume(ReceiveConfig tenantConfig, long distance) {
		String uniqueId = tenantConfig.getUniqueId()==null?"":tenantConfig.getUniqueId();
		long messageNumber = tenantConfig.getMessageNumber()==null?0:tenantConfig.getMessageNumber();
		long localThreshold = tenantConfig.getLocalThreshold()==null?0:tenantConfig.getLocalThreshold();
		
		String kafkaTopic;
		if(tenantConfig.getIsTenant()==1){
			kafkaTopic = tenantConfig.getKafkaTopic()==null?"":tenantConfig.getKafkaTopic();
		}else{
			kafkaTopic = ReceiveConfigUtil.getValue("kafka.all.log.topic")==null?"":ReceiveConfigUtil.getValue("kafka.all.log.topic");
			localThreshold = (int) distance;
			//testdata
//			kafkaTopic = "ALL_LOG";
		}

		logger.info(uniqueId + ":------------------kafkaTopic=" + kafkaTopic);
		
		Map<String, Integer> topicCountMap = new HashMap<String, Integer>();
		topicCountMap.put(kafkaTopic, new Integer(1));
		
		StringDecoder keyDecoder = new StringDecoder(new VerifiableProperties());
		StringDecoder valueDecoder = new StringDecoder(new VerifiableProperties());
		Map<String, List<KafkaStream<String, String>>> consumerMap = consumer.createMessageStreams(topicCountMap, keyDecoder, valueDecoder);
		
		KafkaStream<String, String> stream = consumerMap.get(kafkaTopic).get(0);
		ConsumerIterator<String, String> it = stream.iterator();
		
		if(distance <= localThreshold){
			//循环发送post请求
			int times = getIntDivide((int)distance,(int)messageNumber);
			logger.debug("times--------------------" + times);
			for (int i = 0; i < times; i++) {
				logger.debug("i--------------------" + i);

				long begin = System.currentTimeMillis();
				List<String> logsList = repeatConsume(false, it, tenantConfig, distance,i);
				long end = System.currentTimeMillis();
				logger.debug("kafkaTopic : " + kafkaTopic + " ===== repeatConsume Used times :" + (end - begin)/1000 + " seconds " +tenantConfig.toString());
				
				begin = System.currentTimeMillis();
				boolean postSucc = PostKafkaLog.execute(tenantConfig, logsList, i);
				end = System.currentTimeMillis();
				logger.debug("kafkaTopic : " + kafkaTopic + " ===== PostKafkaLog.execute Used times :" + (end - begin)/1000 + " seconds " +tenantConfig.toString());
				
				if(postSucc){
					//手动提交offset,当auto.commit.enable=false时使用
					logger.info("-------------consumer.commitOffsets()");
					consumer.commitOffsets();
				}else{
					logger.error("-------------consumer.shutdown() failed");
					consumer.shutdown();
				}
			}
		}else{
			//先循环发送post请求
			int times = getIntDivide((int)localThreshold,(int)messageNumber);
			logger.debug("times--------------------" + times);
			for (int i = 0; i < times; i++) {
				long begin = System.currentTimeMillis();
				List<String> logsList = repeatConsume(false, it, tenantConfig, distance, i);
				long end = System.currentTimeMillis();
				logger.debug("kafkaTopic : " + kafkaTopic + " ===== repeatConsume Used times :" + (end - begin)/1000 + " seconds " +tenantConfig.toString());
				
				begin = System.currentTimeMillis();
				boolean postSucc = PostKafkaLog.execute(tenantConfig, logsList, i);
				end = System.currentTimeMillis();
				logger.debug("kafkaTopic : " + kafkaTopic + " ===== PostKafkaLog.execute Used times :" + (end - begin)/1000 + " seconds " +tenantConfig.toString());
				
				if(postSucc){
					logger.info("-------------consumer.commitOffsets()");
					consumer.commitOffsets();
				}else{
					logger.error("-------------consumer.shutdown() failed");
					consumer.shutdown();
				}
			}
			//剩余落盘至sftp
			if(messageTotalTmp >= localThreshold){  //防止post失败时，不停全部落盘，判断在post的数据全部消费后，才执行sftp
				List<String> logsList = repeatConsume(true, it, tenantConfig, distance, 0);
				long begin = System.currentTimeMillis();
				boolean sftpSucc = SendKafkaLogToSFTP.execute(tenantConfig, logsList);
				long end = System.currentTimeMillis();
				logger.debug("kafkaTopic : " + kafkaTopic + " ===== SendKafkaLogToSFTP.execute Used times :" + (end - begin)/1000 + " seconds " +tenantConfig.toString());
	
				if(sftpSucc){
					logger.info("-------------consumer.commitOffsets()");
					consumer.commitOffsets();
				}else{
					logger.error("-------------consumer.shutdown() failed");
					consumer.shutdown();
				}
			}
		}
		consumer.shutdown();
		logger.info(kafkaTopic + " ： end......");

		Map<String,Integer> map = new HashMap<String,Integer>();
		map.put("messageTotalFilterNum", messageTotalFilterTmp);
		map.put("messageTotalNum", messageTotalTmp);
		return map;
	}
	
	public List<String> repeatConsume(boolean isLocal,ConsumerIterator<String, String> it,ReceiveConfig tenantConfig,long distance,int i){
		List<String> logsList = new ArrayList<String>();//每次从kafka中取到的日志集合
		while (it.hasNext()){
			MessageAndMetadata<String, String> mam = it.next();
			
			boolean filterFlag = false;
			String code = UNNORMAL_SIGN;
			if((mam.message().replace(",", ", ").split(LOG_SEPARATOR).length-1) < CODE_SITE){
				filterFlag = true;
			}else{
				code = mam.message().replace(",", ", ").split(LOG_SEPARATOR)[CODE_SITE].trim();
				logger.debug("code========="+code);
			}
			
			//0不过滤，1过滤
			int filterMac = tenantConfig.getFilterMac();
			int filterSignal = tenantConfig.getFilterSignal();

			if(filterMac==1 && filterSignal==1){
				//两种情况都过滤，则过滤所有非正常日志
				if((code.equals(MACFILTER_SIGN_MOBILE) || code.equals(MACFILTER_SIGN_LENGTH)) || code.equals(SIGNALFILTER_SIGN) || !code.equals(NORMAL_SIGN)){
					filterFlag = true;
				}
			}else if(filterMac==1 && filterSignal==0){
				if((code.equals(MACFILTER_SIGN_MOBILE) || code.equals(MACFILTER_SIGN_LENGTH)) || !code.equals(NORMAL_SIGN)){
					filterFlag = true;
				}
			}else if(filterMac==0 && filterSignal==1){
				if(code.equals(SIGNALFILTER_SIGN) || !code.equals(NORMAL_SIGN)){
					filterFlag = true;
				}
			}
			
			//更新消费计数器
			messageTotalTmp++;
			logger.info("messageTotalTmp----" + messageTotalTmp);
			
//			debug
//			logger.debug("i:" + i + ", mam.message():"+mam.message()+"---------messageTotalFilterTmp"+messageTotalFilterTmp+"---------messageNumberTmp"+messageNumberTmp);

			logger.debug("filterFlag-----"+filterFlag);
			if(!filterFlag){
				logsList.add(mam.message());
				messageNumberTmp++;
				messageTotalFilterTmp++;
			}

			//对计数器进行判断
			if(!isLocal){
				long messageNumber =tenantConfig.getMessageNumber()==null?0:tenantConfig.getMessageNumber();
				long localThreshold;
				if(tenantConfig.getIsTenant()==1){
					localThreshold = tenantConfig.getLocalThreshold()==null?0:tenantConfig.getLocalThreshold();
				}else{
					localThreshold = (int) distance;
				}
				if(messageNumberTmp >= messageNumber || messageTotalTmp >= localThreshold){
					logger.debug("messageNumber----" + messageNumber + ", localThreshold----" + localThreshold);
					if(messageTotalTmp >= localThreshold){  //记录一条日志
						logger.info("messageTotalTmp:" + messageTotalTmp + ", mam.message():"+mam.message());
					}
					messageNumberTmp = 0;
					break;
				}
			}else{
				if(messageTotalTmp >= distance){
					logger.debug("messageTotalTmp----" + messageTotalTmp + ", distance----" + distance);
					logger.info("messageTotalTmp:" + messageTotalTmp + ", mam.message():"+mam.message());  //记录一条日志
					break;
				}
			}
		}
		return logsList;
	}
	
	public static int getIntDivide(int dividend,int divisor) {
		int result = 0;
		if(dividend!=0 && divisor!=0){
			double divideDouble = (double)dividend/(double)divisor;
			double divideInt = dividend/divisor;
			if(divideDouble==divideInt){
				result = (int)divideInt;
			}else{
				result =  (int)divideInt+1;
			}
		}else{
			result = 1;
		}
		return result;
	}
	
	public static void main(String[] args) {
		long distance = 100;
		
		ReceiveConfig tenantConfig = new ReceiveConfig();
		tenantConfig.setKafkaTopic("20161012");

		tenantConfig.setRetryTimes(1);
		tenantConfig.setRetryInterval(1);
		
		tenantConfig.setFilterMac(1);
		tenantConfig.setFilterSignal(1);

		tenantConfig.setLocalThreshold(distance);
		tenantConfig.setMessageNumber(10L);
		
//		tenantConfig.setUrl("http://api.map.baidu.com/telematics/v3/weather?location=%E5%8C%97%E4%BA%AC&output=json&ak=E4805d16520de693a3fe707cdc962045");
		tenantConfig.setUrl("http://59.110.47.41/");

		new ConsumeKafkaLog().consume(tenantConfig,distance);
	}

}