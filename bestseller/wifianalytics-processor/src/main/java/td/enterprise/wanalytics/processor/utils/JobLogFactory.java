package td.enterprise.wanalytics.processor.utils;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.Appender;
import org.apache.logging.log4j.core.Layout;
import org.apache.logging.log4j.core.LoggerContext;
import org.apache.logging.log4j.core.appender.FileAppender;
import org.apache.logging.log4j.core.config.AppenderRef;
import org.apache.logging.log4j.core.config.Configuration;
import org.apache.logging.log4j.core.config.LoggerConfig;
import org.apache.logging.log4j.core.layout.PatternLayout;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.management.ManagementFactory;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 动态日志管理
 */
public class JobLogFactory {
	
	private JobLogFactory() {
	}
	private static String dir = null;
	static{
		Properties config = ProcessorConfigs.getprocessWiFiConfigProperties();
		dir = config.getProperty("storm.out.tenantid.dir");
	}

	//缓存日志对象
	private static Map<String,Logger> LOG_MAP = new ConcurrentHashMap<String,Logger>();

	//进程id
	public static final String pid = ManagementFactory.getRuntimeMXBean().getName().replaceAll("@.*", "");

	/**
	 * 租户id
	 * @param jobId
	 */
	public static void start(String jobId) {
		
		// 为false时，返回多个LoggerContext对象， true：返回唯一的单例LoggerContext
		final LoggerContext ctx = (LoggerContext) LogManager.getContext(false);
		final Configuration config = ctx.getConfiguration();
		// 创建一个展示的样式：PatternLayout， 还有其他的日志打印样式。
		Layout layout = PatternLayout.createLayout(PatternLayout.DEFAULT_CONVERSION_PATTERN, config, null, null, true,
				false, null, null);
		
		Appender appender = FileAppender.createAppender( String.format(dir + "/%s.log." + pid, jobId), "true",
				"false",jobId, "true", "true", "true", null, layout, null, null, null, config);
		appender.start();
		config.addAppender(appender);
		AppenderRef ref = AppenderRef.createAppenderRef(jobId, null, null);
		AppenderRef[] refs = new AppenderRef[] { ref };
		LoggerConfig loggerConfig = LoggerConfig.createLogger("false", Level.ALL, "" + jobId, "true", refs, null,
				config, null);
		loggerConfig.addAppender(appender, null, null);
		config.addLogger("" + jobId, loggerConfig);
		ctx.updateLoggers();
	}

	public static void stop(int jobId) {
		final LoggerContext ctx = (LoggerContext) LogManager.getContext(false);
		final Configuration config = ctx.getConfiguration();
		config.getAppender("" + jobId).stop();
		config.getLoggerConfig("" + jobId).removeAppender("" + jobId);
		config.removeLogger("" + jobId);
		ctx.updateLoggers();
	}

	/**
	 * 获取Logger
	 *
	 * 如果不想使用slf4j,那这里改成直接返回Log4j的Logger即可
	 * 
	 * @param jobId
	 * @return
	 */
	public synchronized  static Logger getLogger(String jobId) {
		if(LOG_MAP.get(jobId) == null){
			start(jobId);
		    Logger log = LoggerFactory.getLogger(jobId);
			LOG_MAP.put(jobId,log);
		}
		return LOG_MAP.get(jobId);
	}
}
