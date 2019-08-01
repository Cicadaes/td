/**
 * 
 */
package td.olap.query.utils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.StringEntity;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import td.enterprise.dmp.common.exception.BusinessException;
import td.olap.query.runscript.bean.QueryEngineResult;

/**
 * @author wenjian
 * 
 */
public class QueryServiceUtils {

	
	private final static Logger logger = Logger.getLogger(QueryServiceUtils.class);
	
	public static final String STARTTIME_DAY_DISPLAY = "yyyy-MM-dd";

	public static final String STARTTIME_DAY = "yyyyMMdd";

	public static final String TIMEFLAG = "yyMMddHH";
	
	private static ObjectMapper mapper = new ObjectMapper();

	public static String parseStarttime_day(String old, String oldpartern, String newpartern) {

		String strTime = "";

		if (StringUtils.isBlank(old)) {
			return "";
		}
		SimpleDateFormat edf = new SimpleDateFormat(oldpartern);

		try {
			Date oldDate = edf.parse(old);
			SimpleDateFormat newedf = new SimpleDateFormat(newpartern);
			strTime = newedf.format(oldDate);

		} catch (ParseException e) {
			throw new RuntimeException(e);
		}
		return strTime;
	}

	public static QueryEngineResult invoke(String method, String url, Map<String, String> params) {

		HttpClient client = BasicHttpClient.getHttpClientThreadLocal();

		HttpUriRequest req = null;

		try {

			if (HttpGet.METHOD_NAME.equalsIgnoreCase(method)) {
				req = createGetReq(params, url);

			} else if (HttpPost.METHOD_NAME.equalsIgnoreCase(method)) {
				req = createPostReq(params, url);
			}
			return client.execute(req, new ResponseHandler<QueryEngineResult>() {
				@Override
				public QueryEngineResult handleResponse(HttpResponse response) throws ClientProtocolException, IOException {
					HttpEntity entity = response.getEntity();
					if (entity != null) {
						String result = EntityUtils.toString(entity, "utf-8");
						try {
							return mapper.readValue(result, new TypeReference<QueryEngineResult>(){});
						} catch (Exception e) {
							e.printStackTrace();
							throw new RuntimeException("JSON对象转换异常!");
						}
					}					
					throw new RuntimeException("No entity!");
				}
			});

		} catch (Exception e) {
			throw new RuntimeException("invoke url [" + url + "] error!", e);
		}
	}

	public static List<Map<String, Object>> invokeMap(String method, String url, String params) {
		HttpClient client = BasicHttpClient.getHttpClientThreadLocal();

		HttpUriRequest req = null;

		try {
			if (HttpGet.METHOD_NAME.equalsIgnoreCase(method)) {
				req = createGetReq(null, url);
			} else if (HttpPost.METHOD_NAME.equalsIgnoreCase(method)) {
				req = createPostReq(params, url);
			}

			return client.execute(req, new ResponseHandler<List<Map<String, Object>>>() {
				@Override
				public List<Map<String, Object>> handleResponse(HttpResponse response) throws ClientProtocolException, IOException {

					HttpEntity entity = response.getEntity();

					if (entity != null) {
						String result = EntityUtils.toString(entity, "utf-8");
						try {
							return mapper.readValue(result, new TypeReference<List<Map<String,Object>>>(){});
						} catch (Exception e) {
							e.printStackTrace();
							throw new RuntimeException("JSON对象转换异常!");
						}
					}
					throw new RuntimeException("No entity!");
				}
			});

		} catch (Exception e) {
			throw new RuntimeException("invoke url [" + url + "] error!", e);
		}
	}

	@SuppressWarnings("unchecked")
	public static List<Integer> invokeForOffset(String method, String url, String params) {

		HttpClient client = BasicHttpClient.getHttpClientThreadLocal();

		HttpUriRequest req = null;

		try {

			if (HttpGet.METHOD_NAME.equalsIgnoreCase(method)) {
				req = createGetReq(null, url);
			} else if (HttpPost.METHOD_NAME.equalsIgnoreCase(method)) {
				req = createPostReq(params, url);
			}
			return client.execute(req, new ResponseHandler<List<Integer>>() {
				@Override
				public List<Integer> handleResponse(HttpResponse response) throws ClientProtocolException, IOException {
					List<Integer> result = new LinkedList<Integer>();
					HttpEntity entity = response.getEntity();

					if (entity != null) {
						String entityStr = EntityUtils.toString(entity, "utf-8");
						if(StringUtils.isNotBlank(entityStr)){
							try {
								result = mapper.readValue(entityStr, new TypeReference<List<Integer>>(){});
							} catch (Exception e) {
								try {
									Map<String,Object> map = mapper.readValue(entityStr, Map.class);
									Boolean success = (Boolean)map.get("success");
									String msg = (String)map.get("msg");
									if(!success && "空指针异常".equals(msg)){
										return null;
									}
								}catch(Exception e1){
									throw new BusinessException("JSON对象转换异常!", e);
								}
								throw new BusinessException("JSON对象转换异常!", e);
							}
						}
					}
					return result;
				}
			});

		} catch (Exception e) {
			throw new RuntimeException("invoke url [" + url + "] error!", e);
		}
	}
	
	/**
	 * 请求dmp-idmapping工程返回offset对应的id集合
	 * @param method请求类型 post or get
	 * @param url请求路径	
	 * @param params参数json格式
	 * @return
	 */
	public static List<String> invokeForId(String method, String url, String params) {

		logger.info("invoke : " + url + " params : " + params);
		
		HttpClient client = BasicHttpClient.getHttpClientThreadLocal();

		HttpUriRequest req = null;

		try {

			if (HttpGet.METHOD_NAME.equalsIgnoreCase(method)) {
				req = createGetReq(null, url);
			} else if (HttpPost.METHOD_NAME.equalsIgnoreCase(method)) {
				req = createPostReq(params, url);
			}
			return client.execute(req, new ResponseHandler<List<String>>() {
				@Override
				public List<String> handleResponse(HttpResponse response) throws ClientProtocolException, IOException {

					HttpEntity entity = response.getEntity();

					if (entity != null) {
						String result = EntityUtils.toString(entity, "utf-8");
						try {
							return mapper.readValue(result, new TypeReference<List<String>>(){});
						} catch (Exception e) {
							e.printStackTrace();
							throw new RuntimeException("JSON对象转换异常!");
						}
					}
					throw new RuntimeException("No entity!");
				}
			});

		} catch (Exception e) {
			throw new RuntimeException("invoke url [" + url + "] error!", e);
		}
	}

	public static QueryEngineResult invoke(String method, String url, String params) {

		logger.info("invoke : " + url + " params : " + params);
		
		HttpClient client = BasicHttpClient.getHttpClientThreadLocal();

		HttpUriRequest req = null;

		try {

			if (HttpGet.METHOD_NAME.equalsIgnoreCase(method)) {

			} else if (HttpPost.METHOD_NAME.equalsIgnoreCase(method)) {
				req = createPostReq(params, url);
			}
			return client.execute(req, new ResponseHandler<QueryEngineResult>() {
				@Override
				public QueryEngineResult handleResponse(HttpResponse response) throws ClientProtocolException, IOException {

					HttpEntity entity = response.getEntity();

					if (entity != null) {
						String result = EntityUtils.toString(entity, "utf-8");
						if(StringUtils.isNotEmpty(result) && result.contains("\"key_list\"")){
							try {
								return mapper.readValue(result, QueryEngineResult.class);
							} catch (Exception e) {
								e.printStackTrace();
								throw new RuntimeException("JSON对象转换异常!");
							}
						}else{
							return null;
						}
					}
					throw new RuntimeException("No entity!");
				}
			});

		} catch (Exception e) {
			throw new RuntimeException("invoke url [" + url + "] error!", e);
		}
	}

	@SuppressWarnings("unchecked")
	public static Map<String, QueryEngineResult> invokeAsMap(String method, String url, String params) {

		HttpClient client = BasicHttpClient.getHttpClientThreadLocal();

		HttpUriRequest req = null;

		try {

			if (HttpGet.METHOD_NAME.equalsIgnoreCase(method)) {

			} else if (HttpPost.METHOD_NAME.equalsIgnoreCase(method)) {
				req = createPostReq(params, url);
			}
			return client.execute(req, new ResponseHandler<Map<String, QueryEngineResult>>() {
				@Override
				public Map<String, QueryEngineResult> handleResponse(HttpResponse response) throws ClientProtocolException, IOException {

					HttpEntity entity = response.getEntity();

					if (entity != null) {
						String result = EntityUtils.toString(entity, "utf-8");
						try {
							return mapper.readValue(result, new TypeReference<Map<String, QueryEngineResult>>(){});
						} catch (Exception e) {
							e.printStackTrace();
							throw new RuntimeException("JSON对象转换异常!");
						}
					}
					throw new RuntimeException("No entity!");
				}
			});

		} catch (Exception e) {
			throw new RuntimeException("invoke url [" + url + "] error!", e);
		}
	}

	private static HttpUriRequest createGetReq(Map<String, String> params, String url) throws UnsupportedEncodingException {

		HttpUriRequest req = null;
		StringBuffer api = new StringBuffer(url);

		if (params != null) {
			api.append("?");

			for (String key : params.keySet()) {
				api.append(key).append("=").append(URLEncoder.encode(params.get(key), "utf-8")).append("&");

			}
			api.deleteCharAt(api.length() - 1);
		}
		req = new HttpGet(api.toString());
		return req;
	}

	private static HttpUriRequest createPostReq(String params, String url) throws UnsupportedEncodingException {

		HttpUriRequest req = null;
		req = new HttpPost(url);
		StringEntity reqEntity = new StringEntity(params, "UTF-8");
		reqEntity.setContentType("application/json" + HTTP.CHARSET_PARAM + "UTF-8");

		((HttpPost) req).setEntity(reqEntity);
		return req;
	}

	private static HttpUriRequest createPostReq(Map<String, String> params, String url) throws UnsupportedEncodingException {

		HttpUriRequest req = null;
		List<NameValuePair> nvps = new ArrayList<NameValuePair>();

		for (String key : params.keySet()) {
			nvps.add(new BasicNameValuePair(key, params.get(key)));
		}
		req = new HttpPost(url);
		((HttpPost) req).setEntity(new UrlEncodedFormEntity(nvps, "utf-8"));
		return req;
	}

	public static String getTodayStr() {
		SimpleDateFormat sdf = new SimpleDateFormat(STARTTIME_DAY);
		Date today = new Date();
		return sdf.format(today);
	}

	/**
	 * 
	 * @param starttime
	 * @param endtime
	 * @param order
	 *            大于0是正序，小于0是倒序
	 * @return
	 */
	public static List<String> getTimeRange(String starttime, String endtime, int order) {

		List<String> result = new ArrayList<String>();
		SimpleDateFormat sdf = new SimpleDateFormat(STARTTIME_DAY);
		result.add(starttime);

		if (starttime.equals(endtime)) {
			return result;
		}

		try {
			Date begin = sdf.parse(starttime);
			Date end = null;

			if (StringUtils.isBlank(endtime)) {
				end = new Date();

			} else {
				end = sdf.parse(endtime);
			}
			Calendar cal = Calendar.getInstance();
			// 使用给定的 Date 设置此 Calendar 的时间
			cal.setTime(begin);
			boolean bContinue = true;
			while (bContinue) {
				// 根据日历的规则，为给定的日历字段添加或减去指定的时间量
				cal.add(Calendar.DAY_OF_MONTH, 1);
				// 测试此日期是否在指定日期之后
				if (end.after(cal.getTime())) {
					if (order < 0) {
						result.add(0, sdf.format(cal.getTime()));

					} else {
						result.add(sdf.format(cal.getTime()));
					}
				} else {
					break;
				}
			}

			if (order < 0) {
				result.add(0, sdf.format(end));

			} else {
				result.add(sdf.format(end));
			}

		} catch (ParseException e) {
			e.printStackTrace();
		}
		return result;
	}

	public static List<String> copyList(List<String> old) {

		if (old != null) {
			List<String> result = new ArrayList<String>();

			for (String item : old) {
				result.add(item);
			}
			return result;
		}
		return null;
	}

	public static Object formatValue(Object value) {

		if (value == null) {
			return value;
		}

		if (value instanceof String) {

			if (((String) value).indexOf(".") > 0) {

				try {
					value = Double.parseDouble((String) value);
					DecimalFormat format = new DecimalFormat("0.00");
					value = format.format(value);

				} catch (Exception e) {
					e.printStackTrace();
				}
			}

		} else if (value instanceof Number) {

			if (!(value instanceof Integer)) {
				DecimalFormat format = new DecimalFormat("0.00");
				value = format.format(value);

			} else {
				value = String.valueOf(value);
			}
		}
		return value;
	}

	public static String getDaysAgo(int days) {
		SimpleDateFormat sdfNew = new SimpleDateFormat(STARTTIME_DAY);
		String res = "";
		Date date = new Date();
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.DATE, cal.get(Calendar.DATE) + days);
		res = sdfNew.format(cal.getTime());
		return res;
	}

	public static String timeflagToStr(int timeflag) {
		SimpleDateFormat sdfNew = new SimpleDateFormat(TIMEFLAG);
		Date date = null;

		try {
			date = sdfNew.parse(String.valueOf(timeflag));

		} catch (ParseException e) {
			return String.valueOf(timeflag);
		}
		SimpleDateFormat display = new SimpleDateFormat(STARTTIME_DAY_DISPLAY);
		return display.format(date);
	}
}
