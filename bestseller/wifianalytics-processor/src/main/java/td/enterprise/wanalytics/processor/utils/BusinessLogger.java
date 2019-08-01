package td.enterprise.wanalytics.processor.utils;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class BusinessLogger {

	public static String lock = "lock";

	public static final Map<String, Logger> loggerMap = new HashMap<String, Logger>();

	public static Logger getLogger(String loggerName) {
		Logger logger = loggerMap.get(loggerName);
		if (logger == null) {
			synchronized (lock) {
				if (logger == null) {
					logger = LoggerFactory.getLogger(loggerName);
					loggerMap.put(loggerName, logger);
				}
			}
		}
		return logger;
	}

	public static void logFactData(String factName, String content) {
		// 先要去除空格
		if (StringUtils.isBlank(content)) {
			return;
		}
		String[] fields = content.split(",");
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < fields.length; i++) {
			sb.append(fields[i].trim());
			if (i != fields.length - 1) {
				sb.append(",");
			}
		}
		getLogger("fact_" + factName).info(sb.toString());
	}

	public static void logDiscardData(String source, String content) {
		getLogger("discard_" + source).info(content);
	}

	public static void main(String[] args) {
		for (int i = 0; i < 100; i++) {
			logFactData("web_keyvalue", "content" + (i + 1));
		}
	}

}
