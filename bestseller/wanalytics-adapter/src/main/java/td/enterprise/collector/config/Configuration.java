package td.enterprise.collector.config;

import java.io.File;
import java.io.FileReader;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 读取配置文件
 */
public class Configuration {

    private static Logger     logger         = LoggerFactory.getLogger(Configuration.class);

    private static Properties properties     = new Properties();

    private static String     configFileName = "config.properties";

    private static String     configFileDir  = "/nfs/config/wifianalytics/collector";

    private Configuration() {
    }

    static {
        try {
            // 尝试加载本地配置文件，以本地配置文件为准
            File localFile = new File(configFileDir + "/" + configFileName);
            if (localFile.exists() && localFile.isFile()) {
                properties.load(new FileReader(localFile));
            } else {// 从classpath获取参数
                properties.load(Thread.currentThread().getContextClassLoader().getResource(configFileName).openStream());
            }
            // 打印配置参数
            logger.info("Init system properties ok.\n{}", properties);
        } catch (Exception e) {
            logger.error("Init system properties failed.", e);
        }
    }

    public static Properties get() {
        return properties;
    }

    public static String get(final String key) {
        return properties.getProperty(key);
    }

    public static int getInt(final String key) {
        return Integer.parseInt(properties.getProperty(key));
    }

}
