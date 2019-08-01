package td.enterprise.wanalytics.etl.task.postlog;

import net.sf.json.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.bean.ReceiveConfig;
import td.enterprise.wanalytics.etl.task.postlog.bean.BaseReceiveConfigTask;
import td.enterprise.wanalytics.etl.util.HttpsClient;

import java.util.ArrayList;
import java.util.List;

public class PostKafkaLog extends BaseReceiveConfigTask {
	
	private static final Logger logger = Logger.getLogger(PostKafkaLog.class);

//	private static final String KEY = "key";
//	private static final String TOKEN = "token";
//	private static final String KEY_VALUE = "456d29ef8bafd5202547e50d3e64d4ea";
//	private static final String TOKEN_VALUE = "c92fc921126230c45be6c62dc2480ea6";

	public static final String RESPONSE_KEY = "sign";
	public static final String SUCCESS_SIGN = "success";
	public static final String IOEXCEPTION_SIGN = "exception";
	public static final String EMPTY_SIGN = "empty";
	
	private static int retryTimesTmp = 0;//重试计数器

	public static boolean execute(ReceiveConfig tenantConfig, List<String> logsList, int i) {
		boolean succ = true;
		//logsList.size()==0时说明全部都被过滤掉了，不应该出现这种问题，所以不发送也不commit，需等排查后再处理进行commit，否则会丢数据
		if(logsList!=null && logsList.size()>0){
//			String urls = tenantConfig.getUrls()==null?"":tenantConfig.getUrls();
			String uniqueId = tenantConfig.getUniqueId()==null?"":tenantConfig.getUniqueId();
		
//			String[] urlArray = urls.split(",");
//			for(String url:urlArray){
				String url = tenantConfig.getUrl();
				logger.info(uniqueId + ":post------------------url=" + url);
				
				boolean flag = executePost(url,tenantConfig,logsList);
				if(!flag){
					succ = false;
//					break;
				}
				
				retryTimesTmp = 0;//恢复重试计数器
				logger.info(url + " ： end....");
//			}
		}else{
			logger.error("logsList------------------logsList.size()=0!!!");
			//可加报警
			succ = false;
		}
		
		return succ;
	}
	
	private static boolean executePost(String url,ReceiveConfig tenantConfig,List<String> logsList){
		int retryTimes = tenantConfig.getRetryTimes()==null?0:tenantConfig.getRetryTimes();
		int retryInterval = tenantConfig.getRetryInterval()==null?0:tenantConfig.getRetryInterval();
		boolean flag = false;
		
		StringEntity strEntity = getReceiveConfigLogEntry(logsList);
		boolean succ = submitPost(url, strEntity, retryTimes, tenantConfig.getIsTenant()==1);
		if(succ){
			flag = true;
		}else{
			retryTimesTmp ++;
			if(retryTimesTmp <= retryTimes){
				logger.info("submit PostReceiveConfigLogTask task failed "+ retryTimesTmp +" times!");
				try {
					Thread.sleep(retryInterval*1000);
				} catch (InterruptedException e) {
					logger.error("Thread.sleep InterruptedException "+e.getMessage());
				}
				flag = executePost(url, tenantConfig, logsList);
			}
		}
		return flag;
	}
	
	private static StringEntity getReceiveConfigLogEntry(List<String> logsList) {
		JSONObject jsonObj = new JSONObject();
		jsonObj.put(VERSION_KEY, VERSION_VALUE);
		jsonObj.put(DATATYPE_KEY, DATATYPE_VALUE);
		jsonObj.put(REQENTITY_LOG_KEY, logsList);
		
		StringEntity strEntity = new StringEntity(jsonObj.toString(), CHARACTER_ENCODING);
		strEntity.setContentType(APPLICATION_JSON);
		strEntity.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, APPLICATION_JSON));
		
		return strEntity;
	}
   
	private static boolean submitPost(String url, StringEntity strEntity, int retryTimes, boolean isTenant) {
		boolean flag = false;
		CloseableHttpClient httpClient = null;
		CloseableHttpResponse response = null;
		try {
			httpClient = HttpsClient.createDefault();

			HttpPost httpPost = new HttpPost(url);
			httpPost.setEntity(strEntity);
			response = httpClient.execute(httpPost);

			int statusCode = response.getStatusLine().getStatusCode();
			if(statusCode == HttpStatus.SC_OK){
				logger.info("http server response normal .....statusCode:"+statusCode);
				HttpEntity entity = response.getEntity();//获得响应实体
				if(isTenant){
					if(entity != null){
						String sign = EntityUtils.toString(entity, CHARACTER_ENCODING); 
						if(sign.equals(SUCCESS_SIGN)){
							logger.info("http server receive success .....sign:"+SUCCESS_SIGN);
							flag = true;
						}else if(sign.equals(IOEXCEPTION_SIGN)){
							logger.error("http server receive failed ! sign:"+IOEXCEPTION_SIGN);
						}else if(sign.equals(EMPTY_SIGN)){
							logger.error("http server receive failed ! sign:"+EMPTY_SIGN);
						}else{
							logger.error("http server receive failed ! sign is not defined");
						}
					}else{
						logger.error("http server receive failed ! entity is null");
					}
				}else{
					flag = true;
					logger.info("http server receive success .....");
				}
			}else {
				logger.error("http post statusCode failed ! statusCode:"+statusCode);
			}
		} catch (Exception e) {
			logger.error("http post runtime failed !"+e.getMessage());
		} finally {
			try {
				if (null != response)
				response.close();
				if (null != httpClient)
				httpClient.close();
			} catch (Exception E) {
			}
		}
		if(flag){
			retryTimesTmp = retryTimes+1;
		}
		return flag;
	}

	public static void main(String[] args) {
		List<String> logsList = new ArrayList<String>();
//		logsList.add("xxx,1.0,002,1.1,1479687291555,001bc509a00e,70,1479687289674,80;81;82;83;84;85;86;87;88,24696864223c,,,,,,,,,,,,,,,,%5B%7B%22fragtype%22%3A%22PROBRP%22%2C%22dstmac%22%3A%222082c0aea97e%22%2C%22ssid%22%3A%22TP-LINK_223C%22%2C%22channel%22%3A%2211%22%7D%2C%7B%22fragtype%22%3A%22PROBRP%22%2C%22dstmac%22%3A%22b05b6774db88%22%2C%22ssid%22%3A%22TP-LINK_223C%22%2C%22channel%22%3A%2211%22%7D%2C%7B%22fragtype%22%3A%22PROBRP%22%2C%22dstmac%22%3A%22f4e3fb585774%22%2C%22ssid%22%3A%22TP-LINK_223C%22%2C%22channel%22%3A%2211%22%7D%2C%7B%22fragtype%22%3A%22BEACON%22%2C%22dstmac%22%3A%22ffffffffffff%22%2C%22ssid%22%3A%22TP-LINK_223C%22%2C%22channel%22%3A%2211%22%7D%5D,,,,4,777973,3,00:00,24:00,xxxx测试探针,,,xx市,,,,,,,,,");
		logsList.add("你好,1.0,002,1.1,1481090401052,e4956e40da51,33,1481090400710,78;79;80;81;83;84;85;86;87;88;89;90;91;92,d48304e8c3b6,,,,,,,,,,,,,,,,%5B%7B%22fragtype%22%3A%22PROBRP%22%2C%22dstmac%22%3A%2218e29f019984%22%2C%22ssid%22%3A%22FAST_C3B6%22%2C%22channel%22%3A%2211%22%7D%2C%7B%22fragtype%22%3A%22BEACON%22%2C%22dstmac%22%3A%22ffffffffffff%22%2C%22ssid%22%3A%22FAST_C3B6%22%2C%22channel%22%3A%2211%22%7D%5D,,,,3,777868,3,00:00,24:00,xxx,,,xx市,,,,,,,,,");

		String urls = "http://localhost:8080/offlineenhancement-reciver-demo/stormLogReceive";
//		String urls = "http://122.224.160.179:8188/meadinju-server/test";
		urls = "http://59.110.47.41/";
//		urls = "59.110.47.41";

//		urls = "http://interface.meadinyun.com/pushSensorData";
//		urls = "http://wifidata.xdrig.com/offline";
		urls = "http://bs.urbanxyz.com:8080/";

		
		int retryInterval = 1;
		int retryTimes = 2;
		ReceiveConfig tenantConfig = new ReceiveConfig();
		tenantConfig.setRetryInterval(retryInterval);
		tenantConfig.setRetryTimes(retryTimes);
		tenantConfig.setUrl(urls);
		tenantConfig.setIsTenant(0);
		execute(tenantConfig,logsList,0);
	}
}
