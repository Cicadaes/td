package td.enterprise.common.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.apache.log4j.Logger;

public class PropertyConfig {
	private static final Logger log = Logger.getLogger(PropertyConfig.class);

	private static String configFile = "/config.properties";
	private static Properties prop = new Properties();

	static {
		InputStream is = PropertyConfig.class.getResourceAsStream(configFile);
		if (is == null) {
			log.error(configFile + "文件不存在,请检查");
		} else {
			try {
				prop.load(is);
			} catch (Exception e) {
				log.error("读取" + configFile + "出错:" + e.getMessage());
			} finally {
				if (is != null) {
					try {
						is.close();
					} catch (IOException e) {
						log.error("关闭IO流出错:" + e.getMessage());
					}
				}
			}
		}
	}

	public static String getProperty(String key) {
		return prop.getProperty(key);
	}
	
	public static String getSyncBIFileBakPath(){
		return prop.getProperty("syncBIFileBakPath");
	}
	public static String getLocalConfig(){
		return prop.getProperty("localConfig");
	}
	
	public static void main(String[] args){
		String advanceExtractTime=PropertyConfig.getProperty("EmailRunTime");
		System.out.print(advanceExtractTime);
	}
}
