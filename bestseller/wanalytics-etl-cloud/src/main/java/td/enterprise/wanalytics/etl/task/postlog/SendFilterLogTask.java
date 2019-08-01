package td.enterprise.wanalytics.etl.task.postlog;

import org.apache.commons.cli.*;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.bean.ReceiveConfig;
import td.enterprise.wanalytics.etl.task.postlog.bean.BaseReceiveConfigTask;
import td.enterprise.wanalytics.etl.util.KafkaUtil;
import td.enterprise.wanalytics.etl.util.ReceiveConfigUtil;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class SendFilterLogTask extends BaseReceiveConfigTask {
	
	private static final Logger logger = Logger.getLogger(SendFilterLogTask.class);
	public static Map<String,Integer> messageTotalMap = new ConcurrentHashMap<String,Integer>();//总共从kafka获取message条数计数器

	public static void main(String[] args) {
		
//		long begin = System.currentTimeMillis();
		
		Options options = new Options();
		options.addOption("tenantId", "tenantId", true, "UM中租户ID");
		options.addOption("uniqueId", "uniqueId", true, "租户唯一ID");//log中的id
		options.addOption("month", "month", true, "月份");//子目录名
		options.addOption("datehour", "datehour", true, "小时");//文件名前缀
		options.addOption("urls", "urls", true, "post请求接收数据地址");
		options.addOption("retryTimes", "retryTimes", true, "post失败重试次数");
		options.addOption("retryInterval", "retryInterval", true, "post失败重试间隔");
		options.addOption("filterMac", "filterMac", true, "mac过滤");
		options.addOption("filterSignal", "filterSignal", true, "信号过滤");
		options.addOption("kafkaTopic", "kafkaTopic", true, "合作商对应的队列名");
		options.addOption("messageNumber", "messageNumber", true, "每次从kafka获取message条数");
		options.addOption("alarmThreshold", "alarmThreshold", true, "报警阈值");
		options.addOption("localThreshold", "localThreshold", true, "落入sftp阈值");
		options.addOption("azkabanExecId", "azkabanExecId", true, "schedulerTaskLogId");
		options.addOption("serviceCallLogId", "serviceCallLogId", true, "添加后的id");

		CommandLineParser parser = new PosixParser();
		CommandLine line = null;
		try {
			line = parser.parse(options, args);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
//		uniqueId = line.getOptionValue("uniqueId")==null?"":line.getOptionValue("uniqueId");
//		String month = line.getOptionValue("month")==null?"-":line.getOptionValue("month");
//		String datehour = line.getOptionValue("datehour")==null?"-":line.getOptionValue("datehour");
//		
//		urls = line.getOptionValue("urls")==null?"":line.getOptionValue("urls");
//		retryTimes = Integer.parseInt(line.getOptionValue("retryTimes")==null?"0":line.getOptionValue("retryTimes"));
//		retryInterval = Integer.parseInt(line.getOptionValue("retryInterval")==null?"0":line.getOptionValue("retryInterval"));
//		
//		filterMac = Integer.parseInt(line.getOptionValue("filterMac")==null?"0":line.getOptionValue("filterMac"));
//		filterSignal = Integer.parseInt(line.getOptionValue("filterSignal")==null?"0":line.getOptionValue("filterSignal"));
//		
//		kafkaTopic = line.getOptionValue("kafkaTopic")==null?"":line.getOptionValue("kafkaTopic");
//		messageNumber = Integer.parseInt(line.getOptionValue("messageNumber")==null?"0":line.getOptionValue("messageNumber"));
//		alarmThreshold = Integer.parseInt(line.getOptionValue("alarmThreshold")==null?"0":line.getOptionValue("alarmThreshold"));
//		localThreshold = Integer.parseInt(line.getOptionValue("localThreshold")==null?"0":line.getOptionValue("localThreshold"));
//		
//		long timestamp = System.currentTimeMillis();
//		fileName =  uniqueId + "/unsent/" + month + "/" + datehour + "-" + timestamp + ".log";

		
		//test data
//		uniqueId = "20161012";
//		String month = "2016-11";
//		String datehour = "2016-11-23-11";
//		
//		urls = "http://api.map.baidu.com/telematics/v3/weather?location=%E5%8C%97%E4%BA%AC&output=json&ak=E4805d16520de693a3fe707cdc962045";
//		retryTimes = 1;
//		retryInterval = 1;
//		
//		filterMac = 1;
//		filterSignal = 1;
//		
//		kafkaTopic = "20161012";
//		messageNumber = 50;
//		alarmThreshold = 100;
//		localThreshold = 150;
//		
//		long timestamp = System.currentTimeMillis();
//		fileName =  uniqueId + "/unsent/" + month + "/" + datehour + "-" + timestamp + ".log";
		
		//execute();
		
//		long end = System.currentTimeMillis();
//		logger.info("tenantId : " + uniqueId + " ===== PostReceiveConfigLogTask Used times :" + (end - begin)/1000 + " seconds");
	}
	
	public void execute(ReceiveConfig tenantConfig, String groupId) {
		boolean fail = false;
		String kafkaTopic;
		if(tenantConfig.getIsTenant()==1){
			if(tenantConfig.getKafkaTopic()==null || tenantConfig.getKafkaTopic().equals("")){
				fail = true;
			}
			kafkaTopic = tenantConfig.getKafkaTopic();
		}else{
			String topicConfig = ReceiveConfigUtil.getValue("kafka.all.log.topic");
			if(ReceiveConfigUtil.getValue("kafka.all.log.topic")==null || topicConfig.equals("")){
				fail = true;
			}
			kafkaTopic = ReceiveConfigUtil.getValue("kafka.all.log.topic");
		}
		Integer messageTotalNum = messageTotalMap.get(groupId);
		logger.debug("key:" + groupId + ",=============messageTotalMap:" + messageTotalNum);

		//等上一次执行完毕才执行——用statefuljob代替
//		if(messageTotalNum==null || messageTotalNum==0){
			//获取offset值
			Long customerCurrent = KafkaUtil.getInstance().getCurrentOffsetByTopic(groupId,kafkaTopic,0);
			Long topicLast = KafkaUtil.getInstance().getLastOffsetByTopic(kafkaTopic);
			if(topicLast==null){
				logger.error("异常或kafka中无此topic:"+kafkaTopic);
				fail = true;
			}else if(customerCurrent==null){
				logger.debug("异常或此groupId未曾消费:"+kafkaTopic);
				fail = true;
			}

			if(fail){
				return;
			}
			
			long distance = topicLast - customerCurrent;
			logger.info("groupId:"+groupId+",kafkaTopic:"+kafkaTopic+"-------------------current:"+customerCurrent+",last:"+topicLast+",distance:"+distance +"====="+tenantConfig.toString());
			
			//test data
//			distance = 100;
			
			//检查kafka中数据量，若超出邮件告警
			checkOffset(tenantConfig,distance);
			
			messageTotalMap.put(groupId, -1); //正在执行标志
			//消费kafka数据，并发送post请求
			long begin = System.currentTimeMillis();
			Map<String,Integer> map = new ConsumeKafkaLog(groupId).consume(tenantConfig,distance);
			long end = System.currentTimeMillis();
			int messageTotalFilterNum = map.get("messageTotalFilterNum");
			logger.info("groupId : " + groupId + ", kafkaTopic : " + kafkaTopic + ", messageTotalFilterNum : " + messageTotalFilterNum + " ===== ConsumeKafkaLog().consume Used times :" + (end - begin)/1000 + " seconds: ");
			
			//执行完毕后初始化参数
			messageTotalNum = map.get("messageTotalNum");
			if(messageTotalNum==distance){
				messageTotalMap.put(groupId, 0);
			}else{
				messageTotalMap.put(groupId, messageTotalNum);
			}
//		}
			
	}
	
	private static void checkOffset(ReceiveConfig tenantConfig,long distance){
		Long alarmThreshold = tenantConfig.getAlarmThreshold();
		Long localThreshold = tenantConfig.getLocalThreshold();
		String title;
		if(tenantConfig.getIsTenant()!=1){
			title = "[ALL_LOG] (全部日志)";
			localThreshold = distance;
		}else{
			title = "["+tenantConfig.getKafkaTopic()+"] (租户: "+tenantConfig.getUniqueId()+")";
		}
		
		if(distance < 0 || distance > alarmThreshold){
			String context = "";
			String mailTitle = "";
			if(distance < 0){
		    	context ="Kafka中Topic为 "+title+" \n当前的日志数据量为: "+distance+"条, offset存在异常, 请排查原因并恢复！";
		    	mailTitle = "Kafka中Topic为 "+title+" 的未消费日志条数异常！ ";
			}else if(distance > alarmThreshold){
				long post = localThreshold;
				if(localThreshold > distance){
					post = distance;
				}
				long local = 0;
				if(distance > localThreshold){
					local = distance - localThreshold;
				}
		    	context ="Kafka中Topic为 "+title+" \n当前的日志数据量为: "+distance+"条, \n预设报警数量为: "+alarmThreshold+"条, 相差: "+(distance-alarmThreshold)+"条, \n预计本批post发送数量为: "+post+"条, \n预计本次存入sftp数量为: "+local+"条。";
		    	mailTitle = "Kafka中日志条数超出Topic为 "+title+" 的报警阈值！ ";
			}

	    	sendMail(mailTitle, context);
		}
		
	}
	
}
