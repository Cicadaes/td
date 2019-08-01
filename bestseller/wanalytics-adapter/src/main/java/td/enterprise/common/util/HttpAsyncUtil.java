package td.enterprise.common.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.GzipDecompressingEntity;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.nio.client.CloseableHttpAsyncClient;
import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
import org.apache.http.impl.nio.client.HttpAsyncClients;
import org.apache.http.impl.nio.conn.PoolingNHttpClientConnectionManager;
import org.apache.http.impl.nio.reactor.DefaultConnectingIOReactor;
import org.apache.http.impl.nio.reactor.IOReactorConfig;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.nio.conn.NoopIOSessionStrategy;
import org.apache.http.nio.conn.SchemeIOSessionStrategy;
import org.apache.http.nio.conn.ssl.SSLIOSessionStrategy;
import org.apache.http.nio.reactor.ConnectingIOReactor;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import td.enterprise.constants.FTPConstants;

import com.alibaba.fastjson.JSONObject;
import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;
import com.talkingdata.analytics.wifi.collector.databean.WifiData;
import com.talkingdata.analytics.wifi.collector.databean.WifiTa;

/**
 * @description async http pool util 
 * @author sxk
 * @date 2016年7月6日
 *
 */
public class HttpAsyncUtil {

    private static final Logger                 logger                 = LoggerFactory.getLogger(HttpAsyncUtil.class);

    private static final String                 logBody                = "HTTP Body:{}";

    private final String                        DEFAULT_CHARSET        = "UTF-8";

    private final String                        URL_PARAM_CONNECT_FLAG = "&";

    // http thread manager
    private PoolingNHttpClientConnectionManager connectionManager      = null;

    private CloseableHttpAsyncClient            httpAsyncClient;
    //连接建立时间，三次握手完成时间，单位ms
    private int                                 connectionTimeOut      = 30000;
    //数据传输过程中数据包之间间隔的最大时间，单位ms
    private int                                 socketTimeOut          = 30000;
    //httpclient使用连接池来管理连接，这个时间就是从连接池获取连接的超时时间，单位ms
    private int                                 connReqTimeout         = 10000;
    private int                                 maxTotal               = 200;
    private int                                 defaultMaxPerRoute     = 50;
    private int                                 ioThreadCount          = Runtime.getRuntime().availableProcessors();
    private boolean                             isKeepAlive            = true;

    /**
     *默认情况下i/o选择间隔设置为1000毫秒,因此粒度的套接字超时默认是1秒。
     *一个可以减少选择间隔,使i/o选择器线程遍历会话更多的代价更大的CPU利用率。
     *选择间隔 i/o女士选择器线程将有效地运行在一个繁忙的循环。
     * 所以如果设置超时时间小于1s的话，要相对应的设置setSelectInterval()才有效。
     */
    private static HttpAsyncUtil                instance               = null;

    private HttpAsyncUtil() {
        try {
            IOReactorConfig.Builder iorcBuilder = IOReactorConfig.custom();
            //iorcBuilder.setSelectInterval(1000);
            iorcBuilder.setConnectTimeout(connectionTimeOut);
            iorcBuilder.setSoTimeout(socketTimeOut);
            iorcBuilder.setIoThreadCount(ioThreadCount);
            iorcBuilder.setSoKeepAlive(isKeepAlive);
            IOReactorConfig ioReactorConfig = iorcBuilder.build();
            ConnectingIOReactor ioReactor = new DefaultConnectingIOReactor(ioReactorConfig);

            //忽略https的证书ssl验证
            TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
                public X509Certificate[] getAcceptedIssuers() {
                    return null;
                }

                public void checkClientTrusted(X509Certificate[] certs, String authType) {
                    // don't check
                }

                public void checkServerTrusted(X509Certificate[] certs, String authType) {
                    // don't check 
                }
            } };

            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, trustAllCerts, null);

            SSLIOSessionStrategy sslSessionStrategy = new SSLIOSessionStrategy(sslContext, null, null, //
                    SSLIOSessionStrategy.getDefaultHostnameVerifier());

            Registry<SchemeIOSessionStrategy> registry = RegistryBuilder.<SchemeIOSessionStrategy> create() // 
                    .register("http", NoopIOSessionStrategy.INSTANCE) //
                    .register("https", sslSessionStrategy).build();

            connectionManager = new PoolingNHttpClientConnectionManager(ioReactor, registry);

            connectionManager.setMaxTotal(maxTotal);
            connectionManager.setDefaultMaxPerRoute(defaultMaxPerRoute);

            RequestConfig.Builder rcBuilder = RequestConfig.custom();
            rcBuilder.setConnectionRequestTimeout(connReqTimeout);
            RequestConfig requestConfig = rcBuilder.build();
            HttpAsyncClientBuilder httpAsyncClientBuilder = HttpAsyncClients.custom();
            httpAsyncClientBuilder.setConnectionManager(connectionManager);
            httpAsyncClientBuilder.setDefaultRequestConfig(requestConfig);
            httpAsyncClient = httpAsyncClientBuilder.build();
            httpAsyncClient.start();
        } catch (Exception e) {
            logger.error("httpAsyncUtil init fail", e);
        }
    }

    public static HttpAsyncUtil getInstance() {
        if (null == instance) {
            synchronized (HttpAsyncUtil.class) {
                if (instance == null) {
                    instance = new HttpAsyncUtil();
                }
            }
        }
        return instance;
    }

    //url校验
    public boolean verifyUrl(String url) {
        return (null == url || 0 == url.trim().length() || !url.startsWith("http")) ? false : true;
    }

    public String get(String url) {
        return get(url, null, null, null, 0);
    }

    public String get(String url, Map<String, String> params) {
        return get(url, params, null, null, 0);
    }

    public String get(String url, Map<String, String> params, Map<String, String> headers) {
        return get(url, params, headers, null, 0);
    }

    public String get(String url, Map<String, String> params, Map<String, String> headers, String charset, int timeout) {
        long startMillis = System.currentTimeMillis();
        String responseBody = null;
        HttpResponse httpResponse = get2Response(url, params, headers, charset, 0);
        if (null != httpResponse) {
            try {
                responseBody = EntityUtils.toString(httpResponse.getEntity(), null == charset ? DEFAULT_CHARSET : charset);
            } catch (ParseException | IOException e) {
                logError(url, e, startMillis, "get");
            }
        }
        logMsg(url, params, headers, responseBody, startMillis, "get");
        return responseBody;
    }

    private HttpResponse get2Response(String url, Map<String, String> params, Map<String, String> headers, String charset, int timeout) {
        if (!verifyUrl(url)) {
            return null;
        }
        HttpGet httpGet = null;
        HttpResponse httpResponse;
        try {
            if (params != null && params.size() > 0) {
                StringBuffer paramsUrl = new StringBuffer();
                for (String key : params.keySet()) {
                    if (paramsUrl.length() > 0) {
                        paramsUrl.append(URL_PARAM_CONNECT_FLAG);
                    }
                    paramsUrl.append(key).append("=").append(params.get(key));
                }
                if (url.indexOf('?') == -1) {
                    url += "?" + paramsUrl.toString();
                } else {
                    url += URL_PARAM_CONNECT_FLAG + paramsUrl.toString();
                }
            }
            httpGet = new HttpGet(url);

            if (null != headers && headers.size() > 0) {
                for (String headerName : headers.keySet()) {
                    httpGet.addHeader(headerName, headers.get(headerName));
                }
            }
            RequestConfig.Builder rcBuilder = RequestConfig.custom();
            rcBuilder.setConnectionRequestTimeout(timeout == 0 ? connReqTimeout : timeout);
            RequestConfig requestConfig = rcBuilder.build();
            httpGet.setConfig(requestConfig);

            httpResponse = (HttpResponse) httpAsyncClient.execute(httpGet, null).get();
            if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                return httpResponse;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            closeHttpRequestBase(httpGet);
        }
        return null;
    }

    /**
     * 下载头像，判断headers使用
     * @param url
     * @param charset
     * @param timeout
     *
     */
    public HttpResponse get2Response(String url, String charset, int timeout) {
        if (!verifyUrl(url)) {
            return null;
        }
        long startMillis = System.currentTimeMillis();
        HttpGet httpGet = null;
        HttpResponse httpResponse;
        try {

            httpGet = new HttpGet(url);

            RequestConfig.Builder rcBuilder = RequestConfig.custom();
            rcBuilder.setConnectionRequestTimeout(timeout == 0 ? connReqTimeout : timeout);
            RequestConfig requestConfig = rcBuilder.build();
            httpGet.setConfig(requestConfig);

            httpResponse = (HttpResponse) httpAsyncClient.execute(httpGet, null).get();
            logMsg(url, null, null, null, startMillis, "get2Response");
            if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                return httpResponse;
            }
        } catch (Exception e) {
            logError(url, e, startMillis, "get2Response");
        } finally {
            closeHttpRequestBase(httpGet);
        }
        return null;
    }

    public String post(String url, Map<String, String> params) {
        return post(url, params, null, null, 0);
    }

    public String post(String url, Map<String, String> params, Map<String, String> headers) {
        return post(url, params, headers, null, 0);
    }

    public String post(String url, Map<String, String> params, Map<String, String> headers, String charset) {
        return post(url, params, headers, charset, 0);
    }

    public String post(String url, Map<String, String> params, Map<String, String> headers, String charset, int timeout) {
        long startMillis = System.currentTimeMillis();
        String responseBody = null;
        HttpResponse httpResponse = post2Response(url, params, headers, charset, timeout);
        if (null != httpResponse) {
            try {
                responseBody = EntityUtils.toString(httpResponse.getEntity(), null == charset ? DEFAULT_CHARSET : charset);
            } catch (ParseException | IOException e) {
                logger.error("response content parse error", e);
            }
        }
        logMsg(url, params, headers, responseBody, startMillis, "post");
        return responseBody;
    }

    private HttpResponse post2Response(String url, Map<String, String> params, Map<String, String> headers, String charset, int timeout) {
        if (!verifyUrl(url)) {
            return null;
        }
        long startMillis = System.currentTimeMillis();
        HttpPost httpPost = new HttpPost(url);
        HttpResponse httpResponse;
        try {
            if (params != null && params.size() > 0) {
                List<NameValuePair> paramsList = new ArrayList<NameValuePair>();
                for (String key : params.keySet()) {
                    paramsList.add(new BasicNameValuePair(key, params.get(key)));
                }
                UrlEncodedFormEntity urlEncodedFormEntity = new UrlEncodedFormEntity(paramsList, DEFAULT_CHARSET);
                httpPost.setEntity(urlEncodedFormEntity);
            }
            if (null != headers && headers.size() > 0) {
                for (String headerName : headers.keySet()) {
                    httpPost.addHeader(headerName, headers.get(headerName));
                }
            }
            RequestConfig.Builder rcBuilder = RequestConfig.custom();
            rcBuilder.setConnectionRequestTimeout(timeout == 0 ? connReqTimeout : timeout);
            RequestConfig requestConfig = rcBuilder.build();
            httpPost.setConfig(requestConfig);

            httpResponse = (HttpResponse) httpAsyncClient.execute(httpPost, null).get();
            if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                return httpResponse;
            }
        } catch (Exception e) {
            logError(url, e, startMillis, "post2Response");
        } finally {
            closeHttpRequestBase(httpPost);
        }
        return null;
    }

    public String post(String url, String params) {
        return post(url, params, null, null, 0);
    }

    public String post(String url, String params, Map<String, String> headers) {
        return post(url, params, headers, null, 0);
    }

    public String post(String url, String params, Map<String, String> headers, String charset) {
        return post(url, params, headers, charset, 0);
    }

    public String post(String url, String params, Map<String, String> headers, String charset, int timeout) {
        long startMillis = System.currentTimeMillis();
        String responseBody = null;
        HttpResponse httpResponse = post2Response(url, params, headers, charset, timeout);
        if (null != httpResponse) {
            try {
                responseBody = EntityUtils.toString(httpResponse.getEntity(), null == charset ? DEFAULT_CHARSET : charset);
            } catch (ParseException | IOException e) {
                logger.error("response content parse error", e);
            }
        }
        logMsg(url, params, headers, responseBody, startMillis, "post");
        return responseBody;
    }

    private HttpResponse post2Response(String url, String params, Map<String, String> headers, String charset, int timeout) {
        if (!verifyUrl(url)) {
            return null;
        }
        HttpPost httpPost = new HttpPost(url);
        HttpResponse httpResponse;
        try {
            if (params != null) {
                StringEntity urlEncodedFormEntity = new StringEntity(params, DEFAULT_CHARSET);
                httpPost.setEntity(urlEncodedFormEntity);
            }
            if (null != headers && headers.size() > 0) {
                for (String headerName : headers.keySet()) {
                    httpPost.addHeader(headerName, headers.get(headerName));
                }
            }
            RequestConfig.Builder rcBuilder = RequestConfig.custom();
            rcBuilder.setConnectionRequestTimeout(timeout == 0 ? connReqTimeout : timeout);
            RequestConfig requestConfig = rcBuilder.build();
            httpPost.setConfig(requestConfig);

            httpResponse = (HttpResponse) httpAsyncClient.execute(httpPost, null).get();
            if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                return httpResponse;
            }
        } catch (Exception e) {
            logError(url, e, System.currentTimeMillis(), "post2Response");
        } finally {
            closeHttpRequestBase(httpPost);
        }
        return null;
    }

    public File download(String url) {
        return download(url, 0);
    }

    public File download(String url, int timeout) {
        File file = null;
        HttpResponse httpResponse = get2Response(url, null, null, null, timeout);
        if (null != httpResponse) {
            try {
                file = File.createTempFile("file", ".temp");
                FileOutputStream outstream = new FileOutputStream(file);
                HttpEntity entity = httpResponse.getEntity();
                entity.writeTo(outstream);
            } catch (Exception e) {
                if (file != null) {
                    file.delete();
                }
                file = null;
                logError(url, e, System.currentTimeMillis(), "download");
            }
        }
        logMsg(url, null, null, file.getName(), System.currentTimeMillis(), "download");
        return file;
    }

    private void closeHttpRequestBase(HttpRequestBase requestBase) {
        if (null != requestBase) {
            requestBase.releaseConnection();
            requestBase = null;
        }
    }

    public String postGzip(String url, String params) {
        if (!verifyUrl(url) || null == params || params.length() == 0) {
            return null;
        }
        String responseBody = null;
        HttpPost httpPost = new HttpPost(url);
        HttpResponse httpResponse;
        try {
            ByteArrayEntity stringEntity = new ByteArrayEntity(GZIPUtils.gzipString(params, DEFAULT_CHARSET));
            httpPost.setEntity(stringEntity);
            httpPost.setHeader("accept-encoding", "gzip, deflate");
            httpResponse = (HttpResponse) httpAsyncClient.execute(httpPost, null).get();
            if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                httpResponse.setEntity(new GzipDecompressingEntity(httpResponse.getEntity()));
                responseBody = EntityUtils.toString(httpResponse.getEntity(), DEFAULT_CHARSET);
            }
        } catch (Exception e) {
            logError(url, e, System.currentTimeMillis(), "post2Response");
        } finally {
            closeHttpRequestBase(httpPost);
        }
        return responseBody;
    }

    private void logMsg(String url, Object params, Map<String, String> headers, String respBody, long startMillis, String method) {
        JSONObject logMsg = new JSONObject();
        logMsg.put("requestUrl", url);
        logMsg.put("method", method);
        logMsg.put("requestParams", params);
        logMsg.put("requestHeaders", headers);
        logMsg.put("requestTime", DateUtils.date2String(new Date(startMillis), DateUtils.FORMATTYPE_yyyy_MM_dd_HH_mm_ss));
        logMsg.put("responseBody", respBody);
        long endMillis = System.currentTimeMillis();
        logMsg.put("runtime", endMillis - startMillis);
        logger.info(logBody, logMsg);
    }

    private void logError(String url, Exception e, long startMillis, String method) {
        JSONObject logMsg = new JSONObject();
        logMsg.put("requestUrl", url);
        logMsg.put("method", method);
        logMsg.put("requestTime", DateUtils.date2String(new Date(startMillis), DateUtils.FORMATTYPE_yyyy_MM_dd_HH_mm_ss));
        long endMillis = System.currentTimeMillis();
        logMsg.put("runtime", endMillis - startMillis);
        logger.error(logMsg.toJSONString(), e);
    }

    public static void main(String[] args) throws IOException {
        Long time = 1510761600000L;
        WifiData wifiData = WifiData.builder().apmac("apmacaaaaa").tssend(time).num(1).build();
        List<WifiTa> wifiList = new ArrayList<>();
        WifiTa ta = WifiTa.builder().mac("usermacaaaa").channel(11).rssi("-20").build();
        wifiList.add(ta);
        wifiData.setWifitalist(wifiList);

        WiFiDataEntity wiFiDataEntity = new WiFiDataEntity();
        wiFiDataEntity.setDevtype(FTPConstants.FTP_DEV_TYPE);
        wiFiDataEntity.setWifidata(wifiData);
        wiFiDataEntity.setTsreceive(wifiData.getTssend());
        String params = JsonUtils.objectToJsonStr(wiFiDataEntity);
        System.out.println(params);
        String res = HttpAsyncUtil.getInstance().postGzip("http://172.23.4.130:8083/g/ow", params);
        System.out.println(res);
    }
}
