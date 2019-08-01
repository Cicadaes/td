package com.talkingdata.datacloud.visual.util;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.JarURLConnection;
import java.net.URL;
import java.util.jar.JarFile;
import java.util.jar.Manifest;

/**
 * Created by yangruobin on 2017/5/4.
 */
public class JarFileUtils {
    private static final Logger logger = LoggerFactory.getLogger(JarFileUtils.class);
    //通过MultipartFile类获取readFileName文件
    public static String readContent(MultipartFile jarFile,String readFileName) throws Exception{
        File file=new File(jarFile.getOriginalFilename());
        FileUtils.copyInputStreamToFile(jarFile.getInputStream(),file);

        String adapterJson=JarFileUtils.readFile(file.getAbsolutePath(),readFileName);
        return adapterJson;
    }
    //通过MultipartFile类获取getManfest文件
    public static String getManfestAttributes(MultipartFile multipartFile,String attributesName) throws Exception{
        File file=new File(multipartFile.getOriginalFilename());
        JarFile jarFile=new JarFile(file);
        Manifest manifest= jarFile.getManifest();
        String attributesValue=manifest.getMainAttributes().getValue(attributesName);
        return attributesValue;
    }



    //获取jar包文件里面的文件IO流,filePath是jar文件位置，name是jar文件里面文件的路径，相当于上面代码框中的entryName
    public static InputStream getJarInputStream(String filePath, String name)
            throws Exception {
        URL url = new URL("jar:file:" + filePath + "!/" + name);
        JarURLConnection jarConnection = (JarURLConnection) url
                .openConnection();
        InputStream in = jarConnection.getInputStream();

        return in;
    }
    //读取jar包中文件
    public static String readFile(String filePath, String entryName) {
        InputStream in = null;
        BufferedReader br = null;
        StringBuffer sb = null;

        try {
            in = getJarInputStream(filePath, entryName);
            br = new BufferedReader(new InputStreamReader(in, "UTF-8"));
            String con = null;
            sb = new StringBuffer();
            while ((con = br.readLine()) != null) {
//                if (before <= row && row < after) {
                sb.append(con);
//                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (br != null)
                    br.close();
                if (in != null)
                    in.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return sb==null?null:sb.toString();
    }


}
