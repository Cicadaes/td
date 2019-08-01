package td.enterprise.wanalytics.etl.util;

import lombok.extern.slf4j.Slf4j;
import td.enterprise.wanalytics.etl.bean.ServiceConf;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import static td.enterprise.wanalytics.etl.constant.Constant.TAG_DIMENSION;
import static td.enterprise.wanalytics.etl.constant.Constant.TAG_INDEX;

/**
 * Created by Yan on 2017/4/17.
 */
@Slf4j
public class SysConfigUtil {

    private static Properties prop = new Properties();

    static {
        try {
            //判断线上配置文件是否存在，如果不存在，调用本项目中的配置文件
            if (new File("/nfs/config/w-etl-cloud/sysConfig.properties").exists()) {
                log.info("使用/nfs/config/w-etl-cloud/sysConfig.properties");
                prop.load(new FileInputStream("/nfs/config/w-etl-cloud/sysConfig.properties"));
            } else {
                log.info("使用 classpath中 sysConfig.properties");
                prop.load(SysConfigUtil.class.getClassLoader().getResourceAsStream("sysConfig.properties"));

            }
        } catch (IOException e) {
            log.error("获取配置文件出错: " + e.getMessage());
        }
    }

    public static Properties getProp() {
        return prop;
    }
    /**
     * 根据key得到value的值
     */
    public static String getValue(String key)
    {
        return prop.getProperty(key);
    }

    public static ServiceConf getServiceConfig(String key){
        String value = prop.getProperty(key);
        value = value.replaceAll(";"," ; ") ;
        String[] lists = value.split(";");
        if(lists.length != 3){
            return null;
        }
        ServiceConf serviceConf = new ServiceConf();
        serviceConf.setService(lists[0].trim());
        serviceConf.setToken(lists[1].trim());
        serviceConf.setAppkey(lists[2].trim());
        return serviceConf;
    }

    public static List<String> getTagIndex(){
        String tagIndexString = getValue(TAG_INDEX);
        List<String> tagIndexList = Arrays.asList(tagIndexString.split(";"));
        return tagIndexList;
    }

}
