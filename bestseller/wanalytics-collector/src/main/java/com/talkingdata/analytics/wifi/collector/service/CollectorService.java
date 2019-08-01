package com.talkingdata.analytics.wifi.collector.service;

public class CollectorService {

	private static CollectorService collectorService;
	
	private KafkaService kafkaService;
	
	private CollectorService(){}
	
	public static CollectorService getInstance(){
		if(collectorService==null){
			collectorService = new CollectorService();
		}
		return collectorService;
	}
	
	/**
	 * 发送数据到Kafka消息队列
	 * @param srcType
	 * @param ep
	 */
	public void send(String srcType,byte[] ep,String deviceid){
		kafkaService.send(srcType, ep,deviceid);
	}	

	public KafkaService getKafkaService() {
		return kafkaService;
	}

	public void setKafkaService(KafkaService kafkaService) {
		this.kafkaService = kafkaService;
	}
	
}
