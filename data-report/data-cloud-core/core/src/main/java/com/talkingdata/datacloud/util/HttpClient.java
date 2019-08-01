package com.talkingdata.datacloud.util;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpParams;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.JavaType;
import com.talkingdata.datacloud.exception.BusinessException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>Datetime   : 2013-5-28 下午9:21:52</p>
 * <p>Title      : HttpClient.java</p>
 * <p>Description: </p>
 * <p>Copyright  : Copyright (c) 2013</p>
 * <p>Company    : TendCloud</p>
 * @author  <a href="mailto:jinhu.fan@tendcloud.com">fjh</a>
 */
public class HttpClient {

	public static String host = "http://localhost:8082/rest";
	private static String encode = "utf-8";
//	private static String contentType = "application/json";

	private static final ObjectMapper mapper = new ObjectMapper();

	private HttpClient() {
		mapper.configure(org.codehaus.jackson.map.DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
	}

	@SuppressWarnings("unchecked")
    public static <T> T post(String path, Object body, Header[] headers, Class<T> returnClazz) throws ClientProtocolException, IOException, BusinessException {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		
		try {
			HttpPost post = new HttpPost(path);
			post.setHeader("charset", encode);
			post.setHeaders(headers);
			
			System.out.println("========[[post]]=======1======================" + path);
			CloseableHttpResponse response = httpClient.execute(post);
			System.out.println("========[[post]]=======1======================");
			
			try {
				HttpEntity entity = response.getEntity();
				BufferedReader br = new BufferedReader(new InputStreamReader(entity.getContent(), encode));
				StringBuffer last = new StringBuffer();
				String line = null;
				while ((line = br.readLine()) != null) {
					last.append(line);
				}
				
				int code = response.getStatusLine().getStatusCode();
				post.abort();
				
				if (HttpErrorCode.codes.contains(code)) {
					throw new BusinessException(last.toString());
				} else if (code == 200) {
					if (returnClazz == String.class) {
						return (T) last.toString();
					}
					return mapper.readValue(last.toString(), returnClazz);
				} else {
					throw new BusinessException(String.format("unknown exception. code: %s %s", String.valueOf(code), last.toString()));
				}
			} finally {
				response.close();
			}
			
		} finally {
			httpClient.close();
		}
	}
	
//    public static <T> T post1(String path, Object body, Header[] headers, Class<T> returnClazz) throws ClientProtocolException, IOException, BusinessException {
//		CloseableHttpClient httpClient1 = HttpClients.createDefault();
//		HttpPost post = new HttpPost(path);
//		
//		
//	}
//	public static <T> T postUploadFile(String path, Map<String, Object> param, Class<T> returnClazz) throws ClientProtocolException, IOException, BusinessException {
//
//		HttpParams params = new BasicHttpParams();
//		params.setParameter("charset", encode);
//		DefaultHttpClient hc = new DefaultHttpClient(params);
//
//		HttpPost post = new HttpPost(path);
//		
//		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
//		for (Entry<String, Object> entry : param.entrySet()) {
//			String key = entry.getKey();
//			Object value = entry.getValue();
//			if (value instanceof File) {
//				FileBody fileBody = new FileBody((File) value, ContentType.create("application/zip"));
//				builder.addPart(key, fileBody);
//			} else {
//				StringBody stringBody = new StringBody(String.valueOf(value), ContentType.TEXT_PLAIN);
//				builder.addPart(key, stringBody);
//			}
//		}
//		HttpEntity reqEntity = builder.build();
//		
//		post.setEntity(reqEntity);
//		
//		HttpResponse rp = hc.execute(post);
//
//		HttpEntity entity = rp.getEntity();
//		BufferedReader br = new BufferedReader(new InputStreamReader(entity.getContent(), encode));
//		StringBuffer last = new StringBuffer();
//		String line = null;
//		while ((line = br.readLine()) != null) {
//			last.append(line);
//		}
//		System.out.println(last);
//		int code = rp.getStatusLine().getStatusCode();
//
//		if (HttpErrorCode.codes.contains(code)) {
//			throw new BusinessException(last.toString());
//		} else if (code == 200) {
//			if (returnClazz == String.class) {
//				return (T) last.toString();
//			}
//			return mapper.readValue(last.toString(), returnClazz);
//		} else {
//			throw new BusinessException("unknown exception. code: {0} {1}", String.valueOf(code), last.toString());
//		}
//	}

	@SuppressWarnings("unchecked")
	public static <T> T get(String host, String path, Class<T> returnClazz) {		
		path = host + path;
		System.out.println("url path = " + path);
		HttpParams params = new BasicHttpParams();
		params.setParameter("charset", encode);
		DefaultHttpClient hc = new DefaultHttpClient(params);

		HttpGet get = new HttpGet(path);
		
		try {
			
			HttpResponse rp = hc.execute(get);

			HttpEntity entity = rp.getEntity();
			BufferedReader br = new BufferedReader(new InputStreamReader(entity.getContent(), encode));
			String line = null;
			StringBuffer last = new StringBuffer();
			while ((line = br.readLine()) != null) {
				last.append(line);
			}

			int code = rp.getStatusLine().getStatusCode();

			if (HttpErrorCode.codes.contains(code)) {
				throw new BusinessException(last.toString());
			} else if (code == 200) {
				if (returnClazz == String.class) {
					return (T) last.toString();
				}
				return mapper.readValue(last.toString(), returnClazz);
			} else {
				throw new BusinessException("unknown exception. {0}", last.toString());
			}
		} catch (Exception e) {
			throw new BusinessException(e);
		} finally {
			abortConnection(get, hc);
		}
	}

	@SuppressWarnings("rawtypes")
	public static List get_list(String path, Class elementClass) throws BusinessException, ClientProtocolException, IOException {
		path = host + path;

		HttpParams params = new BasicHttpParams();
		params.setParameter("charset", encode);
		DefaultHttpClient hc = new DefaultHttpClient(params);

		HttpGet get = new HttpGet(path);
		HttpResponse rp = hc.execute(get);

		HttpEntity entity = rp.getEntity();
		BufferedReader br = new BufferedReader(new InputStreamReader(entity.getContent(), encode));
		String line = null;
		StringBuffer last = new StringBuffer();
		while ((line = br.readLine()) != null) {
			last.append(line);
		}

		int code = rp.getStatusLine().getStatusCode();

		if (HttpErrorCode.codes.contains(code)) {
			throw new BusinessException(last.toString());
		} else if (code == 200) {
			JavaType javaType = getCollectionType(ArrayList.class, elementClass);
			return (List) mapper.readValue(last.toString(), javaType);
		} else {
			throw new BusinessException("unknown exception. {0}", last.toString());
		}

	}

	/**
	* 获取泛型的Collection Type                                                                       
	* @param collectionClass 泛型的Collection                                                         
	* @param elementClasses 元素类                                                                    
	* @return JavaType Java类型                                                                       
	*/
	public static JavaType getCollectionType(Class<?> collectionClass, Class<?>... elementClasses) {
		return mapper.getTypeFactory().constructParametricType(collectionClass, elementClasses);
	}
	
	/**
	 * 释放HttpClient连接
	 *
	 * @param hrb
	 *            请求对象
	 * @param httpclient
	 *            client对象
	 */
	private static void abortConnection(final HttpRequestBase hrb, final org.apache.http.client.HttpClient httpclient) {
		if (hrb != null) {
			hrb.abort();
		}
		if (httpclient != null) {
			httpclient.getConnectionManager().shutdown();
		}
	}
	

}
