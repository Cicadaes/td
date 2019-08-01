package com.talkingdata.datacloud.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.charset.Charset;

/**
 * <br>
 * <b>功能:</b><br>
 * <b>作者:</b> yashiro <br>
 * <b>日期:</b> 17/3/7 <br>
 */
public class FileUtil {

    public static String readTextContent(String shell) throws IOException {
        StringBuffer sb = new StringBuffer();
        URL resource = FileUtil.class.getClassLoader().getResource(shell);
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.openStream(), Charset.forName("UTF-8")))) {
            String line = null;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
                sb.append(System.lineSeparator());
            }
        }
        return sb.toString();
    }

    public static  boolean delFile(String fileName){
        if(fileName==null){
            return false;
        }
        File file = new File(fileName);
        if(file.exists()){
            return file.delete();
        }
        return false;
    }

}
