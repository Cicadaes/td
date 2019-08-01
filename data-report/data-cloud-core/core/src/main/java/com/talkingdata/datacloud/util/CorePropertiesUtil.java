package com.talkingdata.datacloud.util;

import org.springframework.core.io.support.PropertiesLoaderUtils;

import java.io.IOException;
import java.util.Properties;


public class CorePropertiesUtil {

    public static String azkabanUrl = "";
    public static String azkabanUserName = "";
    public static String azkabanPwd = "";
    public static String kylinUrl = "";
    public static String kylinUserName = "";
    public static String kylinPwd = "";

    public CorePropertiesUtil() {
        try {
            Properties prop = PropertiesLoaderUtils.loadAllProperties("dc_core.properties");
            kylinUrl = prop.getProperty("kylin.url").trim();
            kylinUserName = prop.getProperty("kylin.default.username").trim();
            kylinPwd = prop.getProperty("kylin.default.password").trim();
            azkabanUrl = prop.getProperty("azkaban.url").trim();
            azkabanUserName = prop.getProperty("azkaban.default.username").trim();
            azkabanPwd = prop.getProperty("azkaban.default.password").trim();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

