package td.enterprise.wanalytics.etl.util;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.log4j.Logger;

import td.enterprise.wanalytics.etl.bean.*;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

/**
 * DMK公用类
 * @author junmin.li
 *
 */
public class DMKUtils {

	public static Logger logger = Logger.getLogger(DMKUtils.class);

	private static String accessToken = null;// 保留登录的token
	private static  int timeout = 0; // 超时时间秒
	private  static long latestLoginTime = 0;

	//缓存下来
	private static String ACCESS_TOKEN_URL = null;//获取AccessToken接口
	private static String API_KEY  = null;
	private static String API_TOKEN = null;
	private static String ID_MAPPING_URL = null; //IDMapping 接口
	private static String TAG_DEMOGRAPHIC_URL = null; //人口属性接口
	private static String TAG_APP_URL = null; //应用兴趣
	private static String TAG_DEVICE_URL = null; //设备属性
	private static String POSITION_URL = null; //地理位置接口
  private static String USER_LOC_RESIDENCE_INFO_URL = null; //夜间活跃区域查询服务
  private static String USER_LOC_RESIDENCE_INFO_ACCESS_TOKEN_URL = null; //夜间活跃区域查询服务AccessToken接口

//	2200 错误 服务异常
//	2201 正常 输入的 id 查询到
//	2202 正常 输入的 id 未查询到

	//IDMAPING 状态码
	public static int IDMAPPING_EXCEPTION = 2200;
	public static int IDMAPPING_FOUND = 2201;
	public static int IDMAPPING_NOT_FOUND = 2202;

	//最大尝试次数
	private static int MAC_RETRY_COUNT = 10;

	//临时尝试次数
	private static int retry_count = 0;

	/**
	 * 获取登录accessToken
	 * @param url
	 * @param apikey
	 * @param apitoken
	 * @return
	 * @throws Exception
	 */
	public static String getAccessToken(String url,String apikey,String apitoken) throws Exception{
		if(isTimeout()){
			String accessUrl = url + "?apikey=" + apikey + "&apitoken=" + apitoken;
			logger.info("accessUrl=" + accessUrl);
			Map  result = HttpUtil.SubmitGet(accessUrl);
			Map  map = (Map)result.get("data");
			accessToken = map.get("token") + "" ;
			boolean login = Boolean.parseBoolean(map.get("login") + "" );
			timeout  = Integer.parseInt(map.get("timeout") + "");
			if(!login || StringUtils.isEmpty(accessToken)  ){
				throw new Exception("登录失败！");
			}
			latestLoginTime = System.currentTimeMillis();
			return accessToken;
		}else{
			return accessToken;
		}
	}

	/**
	 *
	 * @return
	 */
	private static boolean isTimeout(){
		if( StringUtils.isBlank(accessToken)){
			return true;
		}else {
			long current = System.currentTimeMillis();
			long interval = (current - latestLoginTime)/ 1000;
			return interval + 1800 > timeout;
		}
	}

	/**
	 * 获取AccessToken
	 * @return
	 * @throws Exception
	 */
	public static String getAccessToken() throws Exception{
		if(ACCESS_TOKEN_URL == null){
			ServiceConf conf = SysConfigUtil.getServiceConfig(WifipixTaskConstant.TD_DMK_GET_ACCESS_TOKEN);
			if(null == conf){
				throw new Exception("未找到DMK 获取 AccessToken  配置！");
			}
			API_KEY = conf.getAppkey();
			API_TOKEN = conf.getToken();
			ACCESS_TOKEN_URL = conf.getService();
			logger.info("ACCESS_TOKEN_URL=" + ACCESS_TOKEN_URL  + " API_KEY=" + API_KEY + " API_TOKEN=" + API_TOKEN);
		}
		return getAccessToken(ACCESS_TOKEN_URL,API_KEY,API_TOKEN);
	}

	/**
	 * 根据mac进行查询
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public static  DmkResponse queryIDMappingByMac(String id) throws Exception {
		return queryIDMapping(id,"mac");
	}

	/**
	 * 根据tdid进行查询
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public static DmkResponse queryIDMappingByTDID(String id) throws Exception {
		return queryIDMapping(id,"tdid");
	}

	/**
	 * 人口属性查询
	 * @param id
	 * @param type
	 * @return
	 * @throws Exception
	 */
	public static DmkResponse queryTagDemographic(String id, String type) throws Exception{
		if(TAG_DEMOGRAPHIC_URL == null){
			ServiceConf conf = SysConfigUtil.getServiceConfig(WifipixTaskConstant.TD_DMK_TAGDEMOGRAPHIC);
			if(null == conf){
				throw new Exception("未找到DMK 获取 TD_DMK_TAGDEMOGRAPHIC(人口属性) 配置！");
			}
			TAG_DEMOGRAPHIC_URL = conf.getService();
			logger.info("TAG_DEMOGRAPHIC_URL=" + TAG_DEMOGRAPHIC_URL );
		}
		String requestUrl = TAG_DEMOGRAPHIC_URL + "?id=" + URLEncoder.encode(id) + "&type=" + type;
		logger.debug("TAG_DEMOGRAPHIC_URL requestURL=" + requestUrl);
		DmkResponse response = query(requestUrl);
		logger.debug("return result=" + response);
		return response;
	}

	public static DmkResponse  queryTagDemographicByMac(String id) throws Exception{
		return queryTagDemographic(id,"mac");
	}

	public static DmkResponse  queryTagDemographicByTDID(String id) throws Exception{
		return queryTagDemographic(id,"tdid");
	}


	/**
	 * idmapping 服务
	 * @param id
	 * @param type
	 * @return
	 * @throws Exception
	 */
	public static  DmkResponse queryIDMapping(String id,String type) throws Exception{
		if(ID_MAPPING_URL == null){
			ServiceConf conf = SysConfigUtil.getServiceConfig(WifipixTaskConstant.TD_DMK_IDMAPPING);
			if(null == conf){
				throw new Exception("未找到DMK 获取 IDMapping 配置！");
			}
			ID_MAPPING_URL = conf.getService();
			logger.info("ID_MAPPING_URL=" + ID_MAPPING_URL );
		}
		String requestUrl = ID_MAPPING_URL + "?id=" + URLEncoder.encode(id) + "&type=" + type;
		if(requestUrl.indexOf("user-idmapping2") != -1){
			requestUrl +="&otype=tdid";
		}
		logger.info("IDMapping requestURL=" + requestUrl);
		DmkResponse response = query(requestUrl);
		logger.info("return result=" + response);
		return response;
	}


	public static DmkResponse  queryTagAppByMac(String id) throws Exception{
		return queryTagApp(id,"mac");
	}

	public static DmkResponse  queryTagAppByTDID(String id) throws Exception{
		return queryTagApp(id,"tdid");
	}


	/**
	 * 应用兴趣标签查询服务
	 * @param id
	 * @param type
	 * @return
	 * @throws Exception
	 */
	public static DmkResponse  queryTagApp(String id,String type) throws Exception{
		if(TAG_APP_URL == null){
			ServiceConf conf = SysConfigUtil.getServiceConfig(WifipixTaskConstant.TD_DMK_TAG_APP);
			if(null == conf){
				throw new Exception("未找到DMK 获取 TD_DMK_TAG_APP(应用兴趣 ) 配置！");
			}
			TAG_APP_URL = conf.getService();
			logger.info("TAG_APP_URL=" + TAG_APP_URL );
		}
		String requestUrl = TAG_APP_URL + "?id=" + URLEncoder.encode(id) + "&type=" + type;
		logger.debug("TAG_APP_URL requestURL=" + requestUrl);
		DmkResponse response = query(requestUrl);
		logger.debug("return result=" + response);
		return response;
	}


	public static DmkResponse queryTagDeviceByMac(String id) throws Exception{
		return queryTagDevice(id,"mac");
	}

	public static DmkResponse  queryTagDeviceByTDID(String id) throws Exception{
		return queryTagDevice(id,"tdid");
	}


	/**
	 * 移动终端设备属性标签查询服务
	 * @param id
	 * @param type
	 * @return
	 * @throws Exception
	 */
	public static DmkResponse queryTagDevice(String id, String type) throws Exception{
		if(TAG_DEVICE_URL == null){
			ServiceConf conf = SysConfigUtil.getServiceConfig(WifipixTaskConstant.TD_DMK_TAG_DEVICE);
			if(null == conf){
				throw new Exception("未找到DMK 获取 TD_DMK_TAG_DEVICE(移动终端设备属性标签查询服务) 配置！");
			}
			TAG_DEVICE_URL = conf.getService();
			logger.info("TAG_DEVICE_URL=" + TAG_DEVICE_URL );
		}
		String requestUrl = TAG_DEVICE_URL + "?id=" + URLEncoder.encode(id) + "&type=" + type;
		logger.debug("TAG_DEVICE_URL requestURL=" + requestUrl);
		DmkResponse response = query(requestUrl);
		logger.debug("return result=" + response);
		return response;
	}


	/**
	 * I010305-月聚集位置查询服务
	 * @param id
	 * @param type
	 * @return
	 * @throws Exception
	 */
	public static DmkResponse  queryPosition(String id,String type,String month) throws Exception{
		if(POSITION_URL == null){
			ServiceConf conf = SysConfigUtil.getServiceConfig(WifipixTaskConstant.TD_DMK_POSITION_DEVICE);
			if(null == conf){
				throw new Exception("未找到DMK 获取 TD_DMK_POSITION_DEVICE(月聚集位置查询服务)配置！");
			}
			POSITION_URL = conf.getService();
			logger.info("POSITION_URL=" + POSITION_URL);
		}
		String requestUrl = POSITION_URL + "?id=" + URLEncoder.encode(id) + "&type=" + type + "&month=" + month;
		logger.debug("POSITION_URL requestURL=" + requestUrl);
		DmkResponse response = query(requestUrl);
		logger.debug("return result=" + response);

		return response;
	}

	public static DmkResponse queryPositionByTDID(String id, String month) throws Exception{
		return queryPosition(id,"tdid",month);
	}

	public static DmkResponse  queryPositionByMac(String id,String month) throws Exception{
		return queryPosition(id,"mac",month);
	}

	/**
	 * 直接查询，返回结果不进行处理
	 * @param url
	 * @return
	 * @throws Exception
	 */
	public static DmkResponse query(String url) throws  Exception{
		long t0 = System.currentTimeMillis();
		String token =  getAccessToken ();
		long t1 = System.currentTimeMillis();
		HttpClient httpClient = null;
		if(url.toLowerCase().indexOf("https") != -1){
			httpClient = HttpsClient.newHttpsClient();
		}else{
			httpClient = HttpsClient.createDefault();
		}
		DmkResponse dmkResponse = new DmkResponse();
		try {
			HttpGet httpGet = new HttpGet(url);
			httpGet.setHeader("X-Access-Token",token);
			long t2 = System.currentTimeMillis();
			HttpResponse response = httpClient.execute(httpGet);
			long t3 = System.currentTimeMillis();
			int statusCode = response.getStatusLine().getStatusCode();
			logger.info("statusCode=" + statusCode + " url=" + url);
			dmkResponse.setHttpStatus(statusCode);
			if(statusCode == HttpStatus.SC_OK){
				retry_count = 0;
				HttpEntity resEntity = response.getEntity();
				BufferedReader br = new BufferedReader(new InputStreamReader(resEntity.getContent(), "utf-8"));
				StringBuffer content = new StringBuffer();
				String line = null;
				while((line = br.readLine()) != null) {
					content.append(line);
				}
				dmkResponse.setData(content.toString());
			}else if(statusCode == HttpStatus.SC_FORBIDDEN){
				logger.error("无权限");
			}else if(statusCode == HttpStatus.SC_BAD_REQUEST){
				logger.error("请求错误");
			}else if(statusCode == HttpStatus.SC_UNAUTHORIZED){
				logger.error("认证失败");
				accessToken= null;
				getAccessToken();
				retry_count ++;
				if(retry_count >= MAC_RETRY_COUNT){
					logger.error("达到大尝试次数，停止尝试");
					throw new Exception("服务器错误");
				}else {
					return query(url);
				}
			}else if(statusCode == HttpStatus.SC_NOT_FOUND){
				logger.error("请求错误地址");
			}else if(statusCode == HttpStatus.SC_METHOD_NOT_ALLOWED){
				logger.error("提交了不支持的方法");
			}else if(statusCode == HttpStatus.SC_NOT_ACCEPTABLE){
				logger.error("提交了不支持的请求格式");
			}else if(statusCode == HttpStatus.SC_GONE){
				logger.error("服务接口已升级，不再支持");
			}else if(statusCode == 430){
				logger.error("超过配额");
			}else if(statusCode == HttpStatus.SC_INTERNAL_SERVER_ERROR){
				logger.error("服务器500错误，进行重试");
			}else if(statusCode == HttpStatus.SC_SERVICE_UNAVAILABLE){
				logger.error("服务器暂时不可用");
			}else {
				logger.error("调用失败，返回http请求状态未处理statusCode=" + statusCode);
			}
		} catch (Exception e) {
			logger.error("查询url=" + url + "异常",e);
			throw e;
		} finally {
			try {
				httpClient.getConnectionManager().shutdown();
			} catch (Exception ignore) {
				ignore.printStackTrace();
			}
		}
		return dmkResponse;
	}

	public static Map queryResult(String url) throws Exception{
		String token =  getAccessToken ();
		HttpClient httpClient;
		httpClient = HttpsClient.newHttpsClient();
		try {
			HttpGet httpGet = new HttpGet(url);
			httpGet.setHeader("X-Access-Token",token);
			HttpResponse response = httpClient.execute(httpGet);
			int statusCode = response.getStatusLine().getStatusCode();
			if(statusCode == HttpStatus.SC_OK){
				HttpEntity resEntity = response.getEntity();

				BufferedReader br = new BufferedReader(new InputStreamReader(resEntity.getContent(), "utf-8"));
				StringBuffer content = new StringBuffer();
				String line = null;
				while((line = br.readLine()) != null) {
					content.append(line);
				}
				return JacksonMapper.getObjectMapper().readValue(content.toString(), HashMap.class);
			}else {
				return null;
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("http get failed !",e);
		} finally {
			try {
				httpClient.getConnectionManager().shutdown();
			} catch (Exception ignore) {
				ignore.printStackTrace();
			}
		}

	}

	/**
	 * 夜间活跃区域查询服务， 取夜间出现最多的top3区域
	 * @param id 设备id
	 * @param idType id类型
	 */
	public static UserLocalEntity queryUserLocResidence(String id, String idType) throws Exception {
    if(USER_LOC_RESIDENCE_INFO_URL == null){
      ServiceConf conf = SysConfigUtil.getServiceConfig(WifipixTaskConstant.TD_DMK_USER_LOC_RESIDENCE_INFO);
      if(conf == null){
        throw new Exception("未找到DMK 获取 TD_DMK_USER_LOC_RESIDENCE_INFO(夜间活跃区域查询服务) 的配置信息！");
      }
      USER_LOC_RESIDENCE_INFO_URL = conf.getService();
      logger.debug("USER_LOC_RESIDENCE_INFO_URL=" + USER_LOC_RESIDENCE_INFO_URL);
    }
    String url = USER_LOC_RESIDENCE_INFO_URL + "?id=" + URLEncoder.encode(id) + "&type=" + idType;

    logger.debug("USER_LOC_RESIDENCE_INFO_URL url=" + url);
    DmkResponse response = query(url);
    logger.debug("return DmkResponse=" + response);
		String data = response.getData();
		UserLocalEntity userLocalEntity = JacksonMapper.getObjectMapper().readValue(data, UserLocalEntity.class);
		return userLocalEntity;
  }


	public static void main(String[] args) throws Exception {
		//TagsBean bean = queryTagDemographic("00:08:22:02:34:34","mac");
		//System.out.println("-------over in the main----------" + bean);
//		System.out.println(getAccessToken());
		long start = System.currentTimeMillis();
		String url = "http://172.23.5.146:8080/data/user-loc-geo-mon/v1?id=02%3A1a%3A11%3Af1%3A16%3Aec&type=mac&month=201707";
		DmkResponse response = DMKUtils.query(url);
		long end = System.currentTimeMillis();
		System.out.println("---------耗时：" + (end -start));

//		UserLocalBean tdid = queryUserLocResidence("74:51:ba:a6:f5:2c", WifipixTaskConstant.TD_DMK_ID_TYPE_MAC);
	}

}
