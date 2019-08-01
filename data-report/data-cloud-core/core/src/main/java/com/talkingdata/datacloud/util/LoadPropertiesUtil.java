package com.talkingdata.datacloud.util;

import org.apache.log4j.Logger;

import java.io.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

/**
 * @description: 加载属性文件
 * @author: cmh 2015年9月28日
 * @version: 1.0
 * @modify: <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class LoadPropertiesUtil {
	private static final Logger logger = Logger.getLogger(LoadPropertiesUtil.class);

	public static Map<String, String> loadProperties(String properties) {
		Properties prop = new Properties();
		Map<String, String> propertiesMap = new HashMap<String, String>();

		// 读取jar包内配置文件
		// InputStream in = Object.class.getResourceAsStream(properties);
		InputStream in = null;
		try {
			in = new BufferedInputStream(new FileInputStream(properties));
		} catch (FileNotFoundException e2) {
			logger.error(properties + " file not found!");
		}

		if (in != null) {
			logger.info("load properties form path: classpath " + properties);
		} else {
//			String confProperties = "conf" + File.separator + properties;
//			File propertiesFile = new File(confProperties);
//
//			logger.info("load properties form path:  " + propertiesFile.getAbsolutePath());
//			if (propertiesFile.exists()) {
//				try {
//					in = new FileInputStream(propertiesFile);
//				} catch (FileNotFoundException e) {
//					logger.error("properties is not found!", e);
//				}
//			} else {

				String filePath = LoadPropertiesUtil.class.getResource("/").getPath() + properties;
				logger.info("filePath==" + filePath);
				File propertiesFile =  new File(filePath);

				if (propertiesFile.exists()) {
					try {
						in = new FileInputStream(propertiesFile);
					} catch (FileNotFoundException e) {
						logger.error("properties is not found!", e);
					}
				}

				logger.warn(propertiesFile.getAbsolutePath() + " is not exist!");
//			}
		}

		if (in != null) {
			try {
				prop.load(in);
				Set<Object> keySet = prop.keySet();

				for (Object key : keySet) {
					logger.debug("key:" + key + ",value:" + prop.get(key));

					propertiesMap.put(key.toString(), prop.get(key).toString());
				}

			} catch (IOException e) {
				logger.error("load properties exception!", e);
			}

		} else {
			logger.warn(properties + " file is not exist!");
		}

		return propertiesMap;
	}
}
