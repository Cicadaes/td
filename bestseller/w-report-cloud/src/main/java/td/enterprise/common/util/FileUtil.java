package td.enterprise.common.util;


import com.alibaba.fastjson.JSON;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FileUtil {

  @SuppressWarnings("ResultOfMethodCallIgnored")
  public static String readStringByFilePath(String path, String charsetName) {
    File file = new File(path);
    Long length = file.length();
    byte[] contents = new byte[length.intValue()];
    try {
      FileInputStream fileInputStream = new FileInputStream(file);
      fileInputStream.read(contents);
      fileInputStream.close();
    } catch (IOException e) {
      log.error("readStringByFilePath error. path:{}, charsetName:{}", path, charsetName);
      e.printStackTrace();
    }

    try {
      return new String(contents, charsetName);
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    }
    return null;
  }

  public static void main(String[] args) {
    //todo caution: overwrite your own file path before run it
    String path = "/attachment/wifianalytics/city.json";
    String s = readStringByFilePath(path, "UTF-8");
    JSON.parseObject(s);
    System.out.println(s);
  }
}
