package td.enterprise.wanalytics.etl.task.postlog.bean;

import org.apache.http.protocol.HTTP;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.util.MailUtil;
import td.enterprise.wanalytics.etl.util.ReceiveConfigUtil;

import java.security.GeneralSecurityException;

public abstract class BaseReceiveConfigTask {
	
	private static final Logger logger = Logger.getLogger(BaseReceiveConfigTask.class);

//	public static String tenantId;//UM中租户ID(tenant_id)
//	public static String uniqueId;//TD_TENANT表/log中租户唯一ID(tenant_id)
//	
//	public static String urls;//post请求接收数据地址
//	public static int retryTimes;//post失败重试次数
//	public static int retryInterval;//post失败重试间隔
//	
//	public static int filterMac;//mac过滤
//	public static int filterSignal;//信号过滤
//	
//	public static String kafkaTopic;//合作商对应的队列名
//	public static int messageNumber;//每次从kafka获取message条数
//	public static int alarmThreshold;//报警阈值
//	public static int localThreshold;//落入sftp阈值
//	public static long distance;//Kafka中本区间内数据条数
//	
//	public static String sftpPwd;//对应sftp密码
//	
//	public static List<String> logsList = new ArrayList<String>();//每次从kafka中取到的日志集合
//	
//	public static String fileName;//生成文件名
	
	public static final String VERSION_KEY = "version";
	public static final String DATATYPE_KEY = "datatype";
	public static final String VERSION_VALUE = "1.0";
	public static final String DATATYPE_VALUE = "log";
	public static final String REQENTITY_LOG_KEY = "data";
	
	public static final String APPLICATION_JSON = "application/json";
	public static final String CONTENT_TYPE_TEXT_JSON = "text/json";
	public static final String CHARACTER_ENCODING = HTTP.UTF_8;
	
	public  static void sendMail (String mailTitle, String context){
		String recipients = ReceiveConfigUtil.getValue("postlog.alarm.recipients");
		String[] recipientArr = recipients.split(",");

		try {
    		logger.info(context);
			MailUtil.sendMail(mailTitle, context, recipientArr);
		} catch (GeneralSecurityException e) {
			e.printStackTrace();
		}
	}
}
