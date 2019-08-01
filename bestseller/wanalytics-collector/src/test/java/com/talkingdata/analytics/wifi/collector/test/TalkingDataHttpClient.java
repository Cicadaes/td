package com.talkingdata.analytics.wifi.collector.test;


import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.ByteArrayRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.Map;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

/**
 * Created by xiaolong on 2015/4/17.
 */
public class TalkingDataHttpClient {

    public static String doGet(String url, Map<String, Object> parameter) throws IOException {
        DefaultHttpClient httpclient = new DefaultHttpClient();
        if (parameter != null) {
            url = url + "?";
            for (Map.Entry<String, Object> entry : parameter.entrySet()) {
                url += entry.getKey() + "=" + URLEncoder.encode(entry.getValue().toString(), "UTF-8") + "&";
            }
            url = url.substring(0, url.length() - 1);
        }
        HttpGet httpgets = new HttpGet(url);
        HttpResponse response = httpclient.execute(httpgets);
        HttpEntity entity = response.getEntity();
        return EntityUtils.toString(entity, "UTF-8");
    }

    public static String doPost(String url, Object params) throws IOException {
        DefaultHttpClient httpclient = new DefaultHttpClient();
        HttpPost post = new HttpPost(url);
        post.setHeader("Content-Type", "application/json");
        post.setEntity(new StringEntity(params.toString(), "UTF-8"));
        HttpResponse response = httpclient.execute(post);
        HttpEntity entity = response.getEntity();
        return EntityUtils.toString(entity, "UTF-8");
    }

    public static String doGzipPost(String url, String msg) {
        PostMethod postMethod = new PostMethod(url);
        postMethod.setContentChunked(true);
        postMethod.addRequestHeader("Accept", "text/plain");
        postMethod.setRequestHeader("Content-Encoding", "gzip");
        postMethod.setRequestHeader("Transfer-Encoding", "chunked");

        ByteArrayOutputStream originalContent = new ByteArrayOutputStream();
        try {
            originalContent
                    .write(msg.getBytes(Charset.forName("UTF-8")));
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            GZIPOutputStream gzipOut = new GZIPOutputStream(baos);
            originalContent.writeTo(gzipOut);
            gzipOut.finish();

            postMethod.setRequestEntity(new ByteArrayRequestEntity(baos
                    .toByteArray(), "text/plain; charset=utf-8"));
        } catch (IOException e) {
            e.printStackTrace();
        }
        HttpClient httpClient = new HttpClient();
        BufferedInputStream buf;
        byte[] buffer = new byte[1024];
        try {
            int status = httpClient.executeMethod(postMethod);
            System.out.println("status : " + status);
            if (HttpStatus.SC_OK == status) {
                buf = new BufferedInputStream(new GZIPInputStream(postMethod.getResponseBodyAsStream()));
                ByteArrayOutputStream bao = new ByteArrayOutputStream();
                int len;
                while ((len = buf.read(buffer)) != -1) {
                    bao.write(buffer, 0, len);
                }
                bao.close();
                buf.close();
                return new String(bao.toByteArray());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

}
