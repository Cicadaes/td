package td.enterprise.wanalytics.etl.util;

import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.wanalytics.etl.bean.ServiceConf;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;

import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class HttpUtil {

    private static final Logger logger = LoggerFactory.getLogger(HttpUtil.class);

    private static final String encode = "utf-8";

    public static Map SubmitPost(String url, MultipartEntity reqEntity) throws Exception {
        return SubmitPost(url, reqEntity, true);
    }

    public static Map SubmitPost(String url, MultipartEntity reqEntity, boolean useHttps) throws Exception {

        logger.debug("get url :  " + url);
        HttpClient httpClient = null;
        try {
        if (useHttps) {
            httpClient = HttpsClient.newHttpsClient();
        } else {
            httpClient = new DefaultHttpClient();
        }
        ETLHttpRequestRetryHandler retryhandler = new ETLHttpRequestRetryHandler();
        httpClient.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, retryhandler);

            HttpPost httpPost = new HttpPost(url);
            httpPost.setEntity(reqEntity);
            HttpResponse response = httpClient.execute(httpPost);

            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode == HttpStatus.SC_OK) {
                logger.debug("http server response normal .....");

                HttpEntity resEntity = response.getEntity();

                BufferedReader br = new BufferedReader(new InputStreamReader(resEntity.getContent(), encode));
                StringBuffer content = new StringBuffer();
                String line = null;
                while ((line = br.readLine()) != null) {
                    content.append(line);
                }
                return JacksonMapper.getObjectMapper().readValue(content.toString(), HashMap.class);

            } else {
                logger.warn("server response statusCode : " + statusCode);
                return null;
            }

        } catch (Exception e) {
            throw new Exception("http post failed !", e);
        } finally {
            try {
                httpClient.getConnectionManager().shutdown();
            } catch (Exception ignore) {

            }
        }

    }

    public static <T> T  postBody(String url, String json,  Class<T> clazz) throws Exception{
        return postBody(url,json,false,clazz);
    }

    /**
     * 提交内容到body
     * @param url
     * @param useHttps
     * @return
     * @throws Exception
     */
    public static <T> T  postBody(String url, String json, boolean useHttps,  Class<T> clazz) throws Exception {
        logger.debug("post url :  " + url);
        HttpClient httpClient = null;
        if (useHttps) {
            httpClient = HttpsClient.newHttpsClient();
        } else {
            httpClient = new DefaultHttpClient();
        }
        ETLHttpRequestRetryHandler retryhandler = new ETLHttpRequestRetryHandler();
        httpClient.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, retryhandler);
        try {
            HttpPost httpPost = new HttpPost(url);
            httpPost.addHeader("Content-Type", "application/json;charset=UTF-8");
            StringEntity stringEntity = new StringEntity(json);
            httpPost.setEntity(stringEntity);
            HttpResponse response = httpClient.execute(httpPost);

            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode == HttpStatus.SC_OK) {
                logger.debug("http server response normal .....");

                HttpEntity resEntity = response.getEntity();

                BufferedReader br = new BufferedReader(new InputStreamReader(resEntity.getContent(), encode));
                StringBuffer content = new StringBuffer();
                String line = null;
                while ((line = br.readLine()) != null) {
                    content.append(line);
                }
                return JacksonMapper.getObjectMapper().readValue(content.toString(), clazz);

            } else {
                logger.warn("server response statusCode : " + statusCode);
                return null;
            }

        } catch (Exception e) {
            throw new Exception("http post failed !", e);
        } finally {
            try {
                httpClient.getConnectionManager().shutdown();
            } catch (Exception ignore) {

            }
        }

    }

    public static HashMap SubmitGet(String url) throws RuntimeException {
        return SubmitGet(url, false);
    }

    public static HashMap SubmitGet(String url, boolean useHttps) throws RuntimeException {

        HttpClient httpClient = null;
        if (useHttps) {
            httpClient = HttpsClient.newHttpsClient();
        } else {
            httpClient = new DefaultHttpClient();
        }

        //添加重试机制
        ETLHttpRequestRetryHandler retryhandler = new ETLHttpRequestRetryHandler();
        httpClient.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, retryhandler);
        try {
            HttpGet httpGet = new HttpGet(url);
            HttpResponse response = httpClient.execute(httpGet);

            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode == HttpStatus.SC_OK) {
                logger.debug("http server response normal .....");

                HttpEntity resEntity = response.getEntity();

                BufferedReader br = new BufferedReader(new InputStreamReader(resEntity.getContent(), encode));
                StringBuffer content = new StringBuffer();
                String line = null;
                while ((line = br.readLine()) != null) {
                    content.append(line);
                }
                String value = content.toString();

                //dmpconsole 返回数组处理
                if(value.startsWith("[") && value.endsWith("]")){
                    value = value.substring(1, value.length() - 1);
                }

                return JacksonMapper.getObjectMapper().readValue(value, HashMap.class);

            } else {
                logger.warn("server response statusCode : " + statusCode);
                return null;
            }

        } catch (Exception e) {
            throw new RuntimeException("http get failed !", e);
        } finally {
            try {
                httpClient.getConnectionManager().shutdown();
            } catch (Exception ignore) {
                logger.error("httpClient shutdown", ignore);
            }
        }
    }

    //TODO 测试一把 Yan
    public static String getParamFromConfigServer(String key){
        String url = SysConfigUtil.getValue("config.server.url");
        String systemcode = SysConfigUtil.getValue("systemcode");
        url += "?paramKey=" + key + "&systemCode=" + systemcode;
        logger.info("参数请求url=" + url);
        Map map = SubmitGet(url);
        String m = "";
        if (null != map)
        m =  (String)map.get("paramValue");
        return m;
    }


    public static MultipartEntity getFEBetchUploadFileCommonReqEntry(String filePath, String tokenValue, String appkeyValue) throws UnsupportedEncodingException {
        MultipartEntity reqEntity = new MultipartEntity();
        FileBody bin = new FileBody(new File(filePath));
        StringBody token = new StringBody(tokenValue);
        StringBody appKey = new StringBody(appkeyValue);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_FILE_KEY, bin);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ETOKEN_KEY, token);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_APPKEY_KEY, appKey);
        return reqEntity;
    }

    public static MultipartEntity getFEBetchMAC2TDIDReqEntry(String filePath, String tokenValue, String appkeyValue) throws UnsupportedEncodingException {
        MultipartEntity reqEntity = getFEBetchUploadFileCommonReqEntry(filePath, tokenValue, appkeyValue);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_TYPE_KEY, new StringBody("1"));
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_INPUTIDTYPE_KEY, new StringBody("3"));
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_OUTPUTIDTYPE_KEY, new StringBody("5"));
        return reqEntity;
    }


    public static MultipartEntity getFEBetchMacMatchTagReqEntry(String filePath, String tokenValue, String appkeyValue) throws UnsupportedEncodingException {
        MultipartEntity reqEntity = getFEBetchUploadFileCommonReqEntry(filePath, tokenValue, appkeyValue);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_TYPE_KEY, new StringBody("2"));
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_INPUTIDTYPE_KEY, new StringBody("3"));

        return reqEntity;
    }

    public static MultipartEntity getFEBetchTDIDMatchTagReqEntry(String filePath, String tokenValue, String appkeyValue) throws UnsupportedEncodingException {
        MultipartEntity reqEntity = getFEBetchUploadFileCommonReqEntry(filePath, tokenValue, appkeyValue);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_TYPE_KEY, new StringBody("2"));
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_INPUTIDTYPE_KEY, new StringBody("5"));

        return reqEntity;
    }

    public static MultipartEntity getFEBetchMacMatchPotionReqEntry(String filePath, String tokenValue, String appkeyValue) throws UnsupportedEncodingException {
        MultipartEntity reqEntity = getFEBetchUploadFileCommonReqEntry(filePath, tokenValue, appkeyValue);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_TYPE_KEY, new StringBody("4"));
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_INPUTIDTYPE_KEY, new StringBody("5"));//上传tdid文件

        return reqEntity;
    }

    public static MultipartEntity getLookalikeReqEntry(String filePath, String tokenValue, String appkeyValue, int top, String city) throws UnsupportedEncodingException {
        MultipartEntity reqEntity = getLookalikeUploadFileCommonReqEntry(filePath, tokenValue, appkeyValue);
        reqEntity.addPart(WifipixTaskConstant.TASK_NAME, new StringBody("1"));//lookalike
        reqEntity.addPart(WifipixTaskConstant.PLATFORM, new StringBody("2"));//Android
        reqEntity.addPart(WifipixTaskConstant.ID_TYPE, new StringBody("5"));//输入mac地址
        reqEntity.addPart(WifipixTaskConstant.OUTPUT_TYPE, new StringBody("1"));//输出扩大后的tdid
        reqEntity.addPart(WifipixTaskConstant.ID_OUT_TYPE, new StringBody("5"));//输出tdid
        reqEntity.addPart(WifipixTaskConstant.IS_OUTPUT_ALL, new StringBody("true"));//true:扩大正样本和负样本合并后的结果
        reqEntity.addPart(WifipixTaskConstant.TOP, new StringBody("" + top));
        reqEntity.addPart(WifipixTaskConstant.CITY, new StringBody(city));
        return reqEntity;
    }

    public static MultipartEntity getXmeansReqEntry(String filePath, String tokenValue, String appkeyValue, int maxClass, int feature) throws UnsupportedEncodingException {
        MultipartEntity reqEntity = getXmeanUploadFileCommonReqEntry(filePath, tokenValue, appkeyValue);
        reqEntity.addPart(WifipixTaskConstant.FEATURE, new StringBody("" + feature));
        reqEntity.addPart(WifipixTaskConstant.MAX_CLASS, new StringBody(maxClass + ""));
        return reqEntity;
    }

    public static MultipartEntity getXmeanUploadFileCommonReqEntry(String filePath, String tokenValue, String appkeyValue) throws UnsupportedEncodingException {
        MultipartEntity reqEntity = new MultipartEntity();
        FileBody bin = new FileBody(new File(filePath));
        StringBody token = new StringBody(tokenValue);
        StringBody appKey = new StringBody(appkeyValue);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_FILE_KEY, bin);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ETOKEN_KEY, token);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_APPKEY_KEY, appKey);
        return reqEntity;
    }

    public static MultipartEntity getLookalikeUploadFileCommonReqEntry(String filePath, String tokenValue, String appkeyValue) throws UnsupportedEncodingException {
        MultipartEntity reqEntity = new MultipartEntity();
        FileBody bin = new FileBody(new File(filePath));
        StringBody token = new StringBody(tokenValue);
        StringBody appKey = new StringBody(appkeyValue);
        reqEntity.addPart(WifipixTaskConstant.POSDATA, bin);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ETOKEN_KEY, token);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_APPKEY_KEY, appKey);
        return reqEntity;
    }

    public static String getFEBetchTaskStatusReqUrl(String queryUrl, String taskid, String appkey, String tokenKey) throws UnsupportedEncodingException {
        String url = queryUrl + "?"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_TASKID_KEY + "=" + taskid + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_APPKEY_KEY + "=" + appkey + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ETOKEN_KEY + "=" + tokenKey;
        return url;
    }

    public static String getLookalikeTaskStatusReqUrl(String queryUrl, String taskid, String appkey, String tokenKey) throws UnsupportedEncodingException {
        String url = queryUrl + "?"
                + WifipixTaskConstant.TASK_ID + "=" + taskid + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_APPKEY_KEY + "=" + appkey + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ETOKEN_KEY + "=" + tokenKey;
        return url;
    }

    public static String getFEBetchTaskDownloadReqUrl(String taskid, String tokenValue, String appkeyValue) throws UnsupportedEncodingException {
        String url = getParamFromConfigServer(WifipixTaskConstant.TD_DMP_BATCH_TASK_DOWNLOAD) + "?"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_TASKID_KEY + "=" + taskid + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_APPKEY_KEY + "=" + appkeyValue + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ETOKEN_KEY + "=" + tokenValue + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ISENCRYPT_KEY + "=false";
        return url;
    }

    public static String getLookalikeDownloadReqUrl(String serviceUrl, String taskid, String tokenValue, String appkeyValue) throws UnsupportedEncodingException {
        String url = serviceUrl + "?"
                + WifipixTaskConstant.TASK_ID + "=" + taskid + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_APPKEY_KEY + "=" + appkeyValue + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ETOKEN_KEY + "=" + tokenValue + "&";
        return url;
    }

    public static Boolean downloadLookalikeResultFile(String taskid, String fileSaveAsPath, String tokenValue, String appkeyValue, String serviceUrl) throws IOException {
        String downloadUrl = getLookalikeDownloadReqUrl(serviceUrl, taskid, tokenValue, appkeyValue);
        logger.info("-------downloadUrl=" + downloadUrl);
        return HttpDownload.download(downloadUrl, fileSaveAsPath);
    }

    public static Boolean downloadFEBetchTaskResultFile(String taskid, String fileSaveAsPath, String tokenValue, String appkeyValue) throws IOException {
        String downloadUrl = getFEBetchTaskDownloadReqUrl(taskid, tokenValue, appkeyValue);
        logger.info("-------downloadUrl=" + downloadUrl);
        return HttpDownload.download(downloadUrl, fileSaveAsPath);
    }

    public static MultipartEntity getFEBetchActiveAppReqEntry() throws UnsupportedEncodingException {
        MultipartEntity reqEntity = new MultipartEntity();
       /* StringBody token = new StringBody(Constant.BETCH_INTERFACE_FE_BETCH_ETOKEN_VALUE);
        StringBody appKey = new StringBody(Constant.BETCH_INTERFACE_FE_BETCH_APPKEY_VALUE);
        reqEntity.addPart(Constant.BETCH_INTERFACE_FE_BETCH_ETOKEN_KEY,token);
        reqEntity.addPart(Constant.BETCH_INTERFACE_FE_BETCH_APPKEY_KEY,appKey );
//        reqEntity.addPart(Constant.BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_TASKID_KEY, new StringBody(mac2TDIDTaskid) );
        reqEntity.addPart(Constant.BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_STARTDATE_KEY, new StringBody(startDate) );
        reqEntity.addPart(Constant.BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_ENDDATE_KEY, new StringBody(endDate) );

        reqEntity.addPart(Constant.BETCH_INTERFACE_FE_BETCH_CALLBACKURL_KEY, new StringBody("https://api.talkingdata.com/dmp/batch/common/") );
        reqEntity.addPart(Constant.BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_USER_KEY, new StringBody(Constant.BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_USER_VALUE) );
        reqEntity.addPart(Constant.BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_INPUTPATH_KEY, new StringBody(Constant.BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_INPUTPATH_VALUE) );
*/
        return reqEntity;
    }

    public static String getFEBetchActiveAppTopNReqUrl(String requestUrl, String city, int topN, String startDate, String endDate, String tokenValue, String appkeyValue, String userValue) throws UnsupportedEncodingException {
        String url = requestUrl + "?"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ETOKEN_KEY + "=" + (tokenValue) + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_APPKEY_KEY + "=" + (appkeyValue) + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_APPS_POPULAR_TOPN_CITY_KEY + "=" + city + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_APPS_POPULAR_TOPN_TOPN_KEY + "=" + topN + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_STARTDATE_KEY + "=" + startDate + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_ENDDATE_KEY + "=" + endDate + "&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_CALLBACKURL_KEY + "=cb&"
                + WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_USER_KEY + "=" + userValue;
        return url;
    }


    public static MultipartEntity getWifipixBetchUploadFileReqEntry(String filePath, String startTime, String endTime, String tokenValue) throws UnsupportedEncodingException {
        MultipartEntity reqEntity = new MultipartEntity();
        logger.info("filePath:" + filePath + " =========  startTime:" + startTime + " ============ endTime:" + endTime);
        FileBody bin = new FileBody(new File(filePath));
        StringBody queryStartTime = new StringBody(startTime);
        StringBody queryEndTime = new StringBody(endTime);
        StringBody token = new StringBody(tokenValue);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_WIFIPIX_BETCH_FILE_KEY, bin);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_WIFIPIX_BETCH_ETOKEN_KEY, token);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_WIFIPIX_BETCH_DATATYPE_KEY, new StringBody("0"));
//        reqEntity.addPart(Constant.BETCH_INTERFACE_WIFIPIX_BETCH_PERSONTIME_KEY,new StringBody("0"));
//        reqEntity.addPart(Constant.BETCH_INTERFACE_WIFIPIX_BETCH_QUERYTYPE_KEY,new StringBody("mall,brand,category"));
//        reqEntity.addPart(Constant.BETCH_INTERFACE_WIFIPIX_BETCH_CALLBACKURL_KEY,);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_WIFIPIX_BETCH_QUERYSTARTTIME_KEY, queryStartTime);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_WIFIPIX_BETCH_QUERYENDTIME_KEY, queryEndTime);

        return reqEntity;
    }

    public static String getWifipixBetchTaskStatusReqUrl(String taskid) throws UnsupportedEncodingException {
        String url = getParamFromConfigServer(WifipixTaskConstant.WIFIPIX_BETCH_TASK_STATUS) + "?"
                + WifipixTaskConstant.BETCH_INTERFACE_WIFIPIX_BETCH_TASKID_KEY + "=" + taskid;
        return url;
    }

    public static String getWifipixBetchTaskDownloadReqUrl(String taskid) throws UnsupportedEncodingException {
        String url = getParamFromConfigServer(WifipixTaskConstant.WIFIPIX_BETCH_TASK_DOWNLOAD) + "?"
                + WifipixTaskConstant.BETCH_INTERFACE_WIFIPIX_BETCH_TASKID_KEY + "=" + taskid;
        return url;
    }

    public static Boolean downloadWifipixBetchTaskResultFile(String taskid, String fileSaveAsPath) throws IOException {
        return HttpDownload.download(getWifipixBetchTaskDownloadReqUrl(taskid), fileSaveAsPath);
    }

    public static MultipartEntity getTDIDMatchPotionReqEntry(String filePath, String tokenValue, String appkeyValue) throws UnsupportedEncodingException {
        MultipartEntity reqEntity = getFEBetchUploadFileCommonReqEntry(filePath, tokenValue, appkeyValue);
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_TYPE_KEY, new StringBody("4"));
        reqEntity.addPart(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_INPUTIDTYPE_KEY, new StringBody("5"));

        return reqEntity;
    }

    public static <T> T SubmitGet(String url, Class<T> clazz, boolean useHttps) throws RuntimeException {
        HttpClient httpClient = null;
        if (useHttps) {
            httpClient = HttpsClient.newHttpsClient();
        } else {
            httpClient = new DefaultHttpClient();
        }

        //添加重试机制
        ETLHttpRequestRetryHandler retryhandler = new ETLHttpRequestRetryHandler();
        httpClient.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, retryhandler);
        try {
            HttpGet httpGet = new HttpGet(url);
            HttpResponse response = httpClient.execute(httpGet);

            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode == HttpStatus.SC_OK) {
                logger.debug("http server response normal .....");
                HttpEntity resEntity = response.getEntity();

                BufferedReader br = new BufferedReader(new InputStreamReader(resEntity.getContent(), encode));
                StringBuffer content = new StringBuffer();
                String line = null;
                while ((line = br.readLine()) != null) {
                    content.append(line);
                }
                return JacksonMapper.getObjectMapper().readValue(content.toString(), clazz);
            } else {
                logger.warn("server response statusCode : " + statusCode);
                return null;
            }
        } catch (Exception e) {
            throw new RuntimeException("http get failed !", e);
        } finally {
            try {
                httpClient.getConnectionManager().shutdown();
            } catch (Exception ignore) {
                logger.error("httpClient shutdown", ignore);
            }
        }
    }

    public static <T> List<T> SubmitGetList(String url, Class<T> clazz, boolean useHttps) throws RuntimeException {
        HttpClient httpClient = null;
        if (useHttps) {
            httpClient = HttpsClient.newHttpsClient();
        } else {
            httpClient = new DefaultHttpClient();
        }

        //添加重试机制
        ETLHttpRequestRetryHandler retryhandler = new ETLHttpRequestRetryHandler();
        httpClient.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, retryhandler);
        try {
            HttpGet httpGet = new HttpGet(url);
            HttpResponse response = httpClient.execute(httpGet);

            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode == HttpStatus.SC_OK) {
                logger.debug("http server response normal .....");
                HttpEntity resEntity = response.getEntity();

                BufferedReader br = new BufferedReader(new InputStreamReader(resEntity.getContent(), encode));
                StringBuffer content = new StringBuffer();
                String line = null;
                while ((line = br.readLine()) != null) {
                    content.append(line);
                }
                return JsonUtils.jsonToObjectList(content.toString(), clazz);
            } else {
                logger.warn("server response statusCode : " + statusCode);
                return null;
            }
        } catch (Exception e) {
            throw new RuntimeException("http get failed !", e);
        } finally {
            try {
                httpClient.getConnectionManager().shutdown();
            } catch (Exception ignore) {
                logger.error("httpClient shutdown", ignore);
            }
        }
    }

}
