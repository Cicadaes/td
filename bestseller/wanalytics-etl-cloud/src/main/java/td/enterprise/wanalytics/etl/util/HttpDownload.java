package td.enterprise.wanalytics.etl.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.*;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.log4j.Logger;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.SocketTimeoutException;

@Slf4j
public class HttpDownload {

	public static Logger logger = Logger.getLogger(HttpDownload.class);
    public static final int cache = 1024 * 2;
    public static final int retryNumberMax = 5;
    public static final int[] sleepIntervalSArr = {1, 2, 4, 6, 10};


    public static final boolean isWindows;
    public static final String splash;
    public static final String root;

    static {
        if (System.getProperty("os.name") != null && System.getProperty("os.name").toLowerCase().contains("windows")) {
            isWindows = true;
            splash = "\\";
            root = "D:";
        } else {
            isWindows = false;
            splash = "/";
            root = "/search";
        }
    }

    public static Boolean download(String url, String filePath) throws IOException {
        return downloadRetry(url, filePath);
    }

    public static long downloadNoRetry(String url, String filePath) throws IOException {
        HttpClient client = HttpsClient.newHttpsClient();
        HttpGet httpget = new HttpGet(url);
        InputStream is = null;
        FileOutputStream fileout = null;
        try{
        	 HttpResponse response = client.execute(httpget);

             HttpEntity entity = response.getEntity();
             is = entity.getContent();
             File file = new File(filePath);
             file.getParentFile().mkdirs();
             fileout = new FileOutputStream(file);

             long downloadByteNumber = 0;

             byte[] buffer = new byte[cache];
             int ch = 0;
             while ((ch = is.read(buffer)) != -1) {
                 downloadByteNumber += ch;
                 fileout.write(buffer, 0, ch);
             }
             return downloadByteNumber;
        }catch(Exception e){
        	throw e;
        }finally{
            FileUtil.close(is,fileout);
            client.getConnectionManager().shutdown();//关闭连接
        }
    }


    public static Boolean downloadRetry(String url, String filePath) throws IOException {
        long downloadByteNumber = 0;

        int retryNum = 0;
        while (retryNum <= retryNumberMax) {
        	try{
               downloadByteNumber = downloadNoRetry(url, filePath);
        	}catch(SocketTimeoutException e){
        		logger.error("下载超时异常：" ,e );
        	}catch(java.net.ConnectException e){
        		logger.error("下载超时异常：" ,e );
        	}
            if (downloadByteNumber > 0) {
                break;
            } else {
                retryNum++;
                logger.warn("download retry number  " + retryNum);
                if(retryNum==retryNumberMax){
                    break;
                }
                try {
                    Thread.sleep(sleepIntervalSArr[retryNum - 1] * 1000);
                } catch (InterruptedException e) {
                    throw new RuntimeException("sleep InterruptedException");
                }
            }
        }

        logger.info(filePath + " download size  :" + downloadByteNumber + " byte");
        return downloadByteNumber > 0;

    }

    public static String getFilePath(HttpResponse response) {
        String filepath = root + splash;
        String filename = getFileName(response);

        if (filename != null) {
            filepath += filename;
        } else {
            filepath += getRandomFileName();
        }
        logger.info("down load filepath :" + filename);
        return filepath;
    }

    public static String getFilePath(String saveDir, HttpResponse response) {
        String dirPath = saveDir + splash;
        String fileName = getFileName(response);
        String filePath = null;

        if (fileName != null) {
            filePath = dirPath + fileName;
        } else {
            filePath += getRandomFileName();
        }
        return filePath;
    }


    public static String getFileName(HttpResponse response) {
        Header contentHeader = response.getFirstHeader("Content-Disposition");
        String filename = null;
        if (contentHeader != null) {
            HeaderElement[] values = contentHeader.getElements();
            if (values.length == 1) {
                NameValuePair param = values[0].getParameterByName("filename");
                if (param != null) {
                    try {
                        //filename = new String(param.getValue().toString().getBytes(), "utf-8");
                        //filename=URLDecoder.decode(param.getValue(),"utf-8");
                        filename = param.getValue();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return filename;
    }


    public static String getRandomFileName() {
        return String.valueOf(System.currentTimeMillis());
    }

    public static void outHeaders(HttpResponse response) {
        Header[] headers = response.getAllHeaders();
        for (int i = 0; i < headers.length; i++) {
            log.info(""+headers[i]);
        }
    }

}
