package td.enterprise.wanalytics.etl.util;

import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * Created by Ran on 2017/6/5.
 */
@Slf4j
public class ReceiveConfigUtil {

    private static Properties prop = new Properties();

    static {
        try {
            //判断线上配置文件是否存在，如果不存在，调用本项目中的配置文件
            if (new File("/nfs/config/w-etl-cloud/receiveConfig.properties").exists()) {
                log.info("使用/nfs/config/w-etl-cloud/receiveConfig.properties");
                prop.load(new FileInputStream("/nfs/config/w-etl-cloud/receiveConfig.properties"));
            } else {
                log.info("使用 classpath中 receiveConfig.properties");
                prop.load(ReceiveConfigUtil.class.getClassLoader().getResourceAsStream("receiveConfig.properties"));

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

}
