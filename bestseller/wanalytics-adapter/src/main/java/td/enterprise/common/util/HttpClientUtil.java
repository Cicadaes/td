package td.enterprise.common.util;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.net.ssl.SSLHandshakeException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.HttpVersion;
import org.apache.http.NoHttpResponseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.HttpRequestRetryHandler;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.CoreProtocolPNames;
import org.apache.http.protocol.ExecutionContext;
import org.apache.http.protocol.HTTP;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.EntityUtils;

/**
 * Apache Httpclient 4.0 工具包装类
 *
 * @author shezy
 */
@SuppressWarnings("all")
public class HttpClientUtil {
	private static final String CHARSET_UTF8 = "UTF-8";
	private static final String CHARSET_GBK = "GBK";
	private static final String SSL_DEFAULT_SCHEME = "https";
	private static final int SSL_DEFAULT_PORT = 443;

	private static final String APPLICATION_JSON = "application/json";

	private static final String CONTENT_TYPE_TEXT_JSON = "text/json";

	// 异常自动恢复处理, 使用HttpRequestRetryHandler接口实现请求的异常恢复
	private static HttpRequestRetryHandler requestRetryHandler = new HttpRequestRetryHandler() {
		// 自定义的恢复策略
		public boolean retryRequest(IOException exception, int executionCount, HttpContext context) {
			// 设置恢复策略，在发生异常时候将自动重试3次
			if (executionCount >= 3) {
				// Do not retry if over max retry count
				return false;
			}
			if (exception instanceof NoHttpResponseException) {
				// Retry if the server dropped connection on us
				return true;
			}
			if (exception instanceof SSLHandshakeException) {
				// Do not retry on SSL handshake exception
				return false;
			}
			HttpRequest request = (HttpRequest) context.getAttribute(ExecutionContext.HTTP_REQUEST);
			boolean idempotent = (request instanceof HttpEntityEnclosingRequest);
			if (!idempotent) {
				// Retry if the request is considered idempotent
				return true;
			}
			return false;
		}
	};

	// 使用ResponseHandler接口处理响应，HttpClient使用ResponseHandler会自动管理连接的释放，解决了对连接的释放管理
	private static ResponseHandler responseHandler = new ResponseHandler() {
		// 自定义响应处理
		public String handleResponse(HttpResponse response) throws ClientProtocolException, IOException {
			HttpEntity entity = response.getEntity();
			if (!(response.getStatusLine().getStatusCode() == 200 || response.getStatusLine().getStatusCode() == 201)) {
				System.out.println("Post Collector Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
			}else{
				System.out.println("collector.status.code:" + response.getStatusLine().getStatusCode());
			}
			if (entity != null) {
				String charset = EntityUtils.getContentCharSet(entity) == null ? CHARSET_GBK : EntityUtils.getContentCharSet(entity);
				return new String(EntityUtils.toByteArray(entity), charset);
			} else {
				return null;
			}
		}
	};

	/**
	 * Get方式提交,URL中包含查询参数, 格式：http://www.g.cn?search=p&name=s.....
	 *
	 * @param url
	 *            提交地址
	 * @return 响应消息
	 */
	public static String get(String url) {
		return get(url, new HashMap(), "");
	}

	/**
	 * Get方式提交,URL中不包含查询参数, 格式：http://www.g.cn
	 *
	 * @param url
	 *            提交地址
	 * @param params
	 *            查询参数集, 键/值对
	 * @return 响应消息
	 */
	public static String get(String url, Map params) {
		return get(url, params, "");
	}

	/**
	 * Get方式提交,URL中不包含查询参数, 格式：http://www.g.cn
	 *
	 * @param url
	 *            提交地址
	 * @param params
	 *            查询参数集, 键/值对
	 * @param charset
	 *            参数提交编码集
	 * @return 响应消息
	 */
	public static String get(String url, Map params, String charset) {
		System.out.println(url);

		if (url == null || url.trim().length() == 0) {
			return null;
		}
		List qparams = getParamsList(params);
		if (qparams != null && qparams.size() > 0) {
			charset = (charset == null ? CHARSET_GBK : charset);
			String formatParams = URLEncodedUtils.format(qparams, charset);
			url = (url.indexOf("?")) < 0 ? (url + "?" + formatParams) : (url.substring(0, url.indexOf("?") + 1) + formatParams);
		}
		DefaultHttpClient httpclient = getDefaultHttpClient(charset);
		HttpGet hg = new HttpGet(url);
		// 发送请求，得到响应
		String responseStr = null;
		try {
			responseStr = (String)httpclient.execute(hg, responseHandler);
		} catch (ClientProtocolException e) {
			throw new RuntimeException("客户端连接协议错误", e);
		} catch (IOException e) {
			throw new RuntimeException("IO操作异常", e);
		} finally {
			abortConnection(hg, httpclient);
		}
		return responseStr;
	}
	
	/**
	 * Post方式提交,URL中不包含提交参数, 格式：http://www.g.cn
	 *
	 * @param url
	 *            提交地址
	 * @param params
	 *            提交参数集, 键/值对
	 * @return 响应消息
	 */
	public static String post(String url, Map params) {
		return post(url, params, "");
	}

	/**
	 * Post方式提交,URL中不包含提交参数, 格式：http://www.g.cn
	 *
	 * @param url
	 *            提交地址
	 * @param params
	 *            提交参数集, 键/值对
	 * @param charset
	 *            参数提交编码集
	 * @return 响应消息
	 */
	public static String post(String url, Map params, String charset) {
		if (url == null || url.trim().length() == 0) {
			return null;
		}
		// 创建HttpClient实例
		DefaultHttpClient httpclient = getDefaultHttpClient(charset);
		UrlEncodedFormEntity formEntity = null;
		try {
			if (charset == null || charset.trim().length() == 0) {
				formEntity = new UrlEncodedFormEntity(getParamsList(params));
			} else {
				formEntity = new UrlEncodedFormEntity(getParamsList(params), charset);
			}
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException("不支持的编码集", e);
		}
		HttpPost hp = new HttpPost(url);
		hp.setEntity(formEntity);
		// 发送请求，得到响应
		String responseStr = null;
		try {
			responseStr = (String)httpclient.execute(hp, responseHandler);
		} catch (ClientProtocolException e) {
			throw new RuntimeException("客户端连接协议错误", e);
		} catch (IOException e) {
			throw new RuntimeException("IO操作异常", e);
		} finally {
			abortConnection(hp, httpclient);
		}
		return responseStr;
	}
	
	/**
	 * Post方式提交,URL中不包含提交参数, 格式：http://www.g.cn
	 *
	 * @param url
	 *            提交地址
	 * @param body
	 *            提交参数
	 * @param charset
	 *            参数提交编码集
	 * @return 响应消息
	 */
	public static String post(String url, String body, String charset) {
		if (url == null || url.trim().length() == 0) {
			return null;
		}
		// 创建HttpClient实例
		DefaultHttpClient httpclient = getDefaultHttpClient(charset);
		ByteArrayEntity stringEntity = null;
		try {
			stringEntity = new ByteArrayEntity(GZIPUtils.gzipString(body, HTTP.UTF_8));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		HttpPost hp = new HttpPost(url);
		hp.setEntity(stringEntity);
		hp.setHeader("accept-encoding", "gzip, deflate");
		// 发送请求，得到响应
		String responseStr = null;
		try {
			responseStr = (String)httpclient.execute(hp, responseHandler);
		} catch (ClientProtocolException e) {
			throw new RuntimeException("客户端连接协议错误", e);
		} catch (IOException e) {
			throw new RuntimeException("IO操作异常", e);
		} finally {
			abortConnection(hp, httpclient);
		}
		return responseStr;
	}
	
	/**
	 * 获取DefaultHttpClient实例
	 *
	 * @param charset
	 *            参数编码集, 可空
	 * @return DefaultHttpClient 对象
	 */
	private static DefaultHttpClient getDefaultHttpClient(final String charset) {
		DefaultHttpClient httpclient = new DefaultHttpClient();
		httpclient.getParams().setParameter(CoreProtocolPNames.PROTOCOL_VERSION, HttpVersion.HTTP_1_1);
		// 模拟浏览器，解决一些服务器程序只允许浏览器访问的问题
		httpclient.getParams().setParameter(CoreProtocolPNames.USER_AGENT, "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)");
		httpclient.getParams().setParameter(CoreProtocolPNames.USE_EXPECT_CONTINUE, Boolean.FALSE);
		httpclient.getParams().setParameter(CoreProtocolPNames.HTTP_CONTENT_CHARSET, charset == null ? CHARSET_GBK : charset);
		httpclient.setHttpRequestRetryHandler(requestRetryHandler);
		return httpclient;
	}

	/**
	 * 将传入的键/值对参数转换为NameValuePair参数集
	 *
	 * @param paramsMap
	 *            参数集, 键/值对
	 * @return NameValuePair参数集
	 */
	private static List getParamsList(Map paramsMap) {
		if (paramsMap == null || paramsMap.size() == 0) {
			return null;
		}
		List params = new ArrayList();
		for (Object key : paramsMap.keySet()) {
			if(paramsMap.get(key) != null && !paramsMap.get(key).toString().equals("null")){
				params.add(new BasicNameValuePair(key.toString(), paramsMap.get(key).toString()));
			}			
		}
		return params;
	}
	
	/**
	 * 释放HttpClient连接
	 *
	 * @param hrb
	 *            请求对象
	 * @param httpclient
	 *            client对象
	 */
	private static void abortConnection(final HttpRequestBase hrb, final HttpClient httpclient) {
		if (hrb != null) {
			hrb.abort();
		}
		if (httpclient != null) {
			httpclient.getConnectionManager().shutdown();
		}
	}

	
}