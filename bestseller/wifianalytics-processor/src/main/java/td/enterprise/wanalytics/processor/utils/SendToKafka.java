package td.enterprise.wanalytics.processor.utils;

import kafka.javaapi.producer.Producer;
import kafka.producer.KeyedMessage;
import kafka.producer.ProducerConfig;

import java.util.Properties;

public class SendToKafka {
	
	static Properties configs = ProcessorConfigs.getprocessWiFiConfigProperties();
	static String brokerhosts = (String)configs.getProperty("kafka.wifianalytics.brokers");
	Producer<String, String> producer =null;
	
	public SendToKafka() {
		
		Properties props = new Properties();
		props.put("metadata.broker.list",brokerhosts);
		props.put("serializer.class", "kafka.serializer.StringEncoder");
		props.put("key.serializer.class", "kafka.serializer.StringEncoder");
		props.put("request.required.acks", "1");
		ProducerConfig config = new ProducerConfig(props);
		producer = new Producer<String, String>(config);
	}
	
	public void send(String topicname,String key ,String msg){
		KeyedMessage<String, String> data = new KeyedMessage<String, String>(topicname, key, msg);
		producer.send(data);
	}
	
	public void close(){
		producer.close();
	}
}
