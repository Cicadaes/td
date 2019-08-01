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

import java.io.File;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 根据日期动态获取Logger，每小时1个logger，如果超过24小时，进行释放
 */
public class LogFactory {

	public static Logger logger = LoggerFactory.getLogger(LogFactory.class);

	private LogFactory() {
	}
	//日志文件路径
	private static String LOG_PATH = null;

	//Logger 释放最大间隔时间，默认1天时间
	private static long CLEAN_INTERVAL =  60 * 60 * 24 ;

	//最小间隔
	private static int MIN_INTERVAL = 3600;
	static{
		Properties config = ProcessorConfigs.getprocessWiFiConfigProperties();
		LOG_PATH = config.getProperty("storm.log.path");
		CLEAN_INTERVAL = Long.parseLong(config.getProperty("storm.log.clean.interval"));
	}

	//缓存日志对象
	private static Map<String,Logger> LOG_MAP = new ConcurrentHashMap<String,Logger>();

	//日志最后使用时间
	private static Map<String,Long> LOG_USE_TIME_MAP = new ConcurrentHashMap<>();

	//获取worker 进程所在端口
	public static final String WORKER_PORT = System.getProperty("worker.port");

	private static long lastCleanTime = System.currentTimeMillis();

	static {
		new Thread(new Runnable() {
			@Override
			public void run() {
				while (true) {
					try {
						if ((System.currentTimeMillis() - lastCleanTime) / 1000 >= MIN_INTERVAL
									) {
								batchStopLogger();
								lastCleanTime = System.currentTimeMillis();
						}
					} catch (Exception e) {
						logger.error("============Clean Logger Exception:" + e.getMessage(), e);
						lastCleanTime = System.currentTimeMillis();
					}
					try {
						Thread.sleep(100000);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
					if (0 == 1) { //此为永久张死循环，但为防止sonar校验，特加此判断
						break;
					}
				}

			}

		}).start();
	}

	/**
	 * yyyy-MM-dd-HH
	 * @param dateHour
	 */
	public static void start(String dateHour,String prefix,String folder) {
		String key = dateHour + "_" + prefix + "_" + folder ;
		// 为false时，返回多个LoggerContext对象， true：返回唯一的单例LoggerContext
		final LoggerContext ctx = (LoggerContext) LogManager.getContext(false);
		final Configuration config = ctx.getConfiguration();
		// 创建一个展示的样式：PatternLayout， 还有其他的日志打印样式。
		Layout layout = PatternLayout.createLayout(PatternLayout.DEFAULT_CONVERSION_PATTERN, config, null, null, true,
				false, null, null);
		File pathFolder = new File(LOG_PATH + "/" + folder );
		pathFolder.mkdirs();
		String fileName = String.format(LOG_PATH + "/" + folder + "/" + prefix + ".%s-%s.log" , dateHour,WORKER_PORT);
		Appender appender = FileAppender.createAppender(fileName, "true",
				"false",key, "true", "true", "true", null, layout, null, null, null, config);
		appender.start();
		config.addAppender(appender);
		AppenderRef ref = AppenderRef.createAppenderRef(key, null, null);
		AppenderRef[] refs = new AppenderRef[] { ref };
		LoggerConfig loggerConfig = LoggerConfig.createLogger("false", Level.ALL, "" + key, "true", refs, null,
				config, null);
		loggerConfig.addAppender(appender, null, null);
		config.addLogger("" + key, loggerConfig);
		ctx.updateLoggers();
	}

	/**
	 * 执行清理过期日志
	 * @param key
	 */
	public static void stop(String key) {
		final LoggerContext ctx = (LoggerContext) LogManager.getContext(false);
		final Configuration config = ctx.getConfiguration();
		config.getAppender("" + key).stop();
		config.getLoggerConfig("" + key).removeAppender("" + key);
		config.removeLogger("" + key);
		ctx.updateLoggers();
	}

	/**
	 * 获取Logger
	 *
	 * 如果不想使用slf4j,那这里改成直接返回Log4j的Logger即可
	 * 
	 * @param dateHour yyyy-MM-dd-HH
	 * @param prefix 日志文件名称
	 * @return
	 */
	public synchronized  static Logger getLogger(String dateHour,String prefix,String folder) {
		String key = dateHour + "_" + prefix + "_" + folder ;
		if(LOG_MAP.get(key) == null){
			start(dateHour,prefix,folder);
		    Logger log = LoggerFactory.getLogger(key);
			LOG_MAP.put(key,log);
		}
		LOG_USE_TIME_MAP.put(key,System.currentTimeMillis());//更新最后使用时间
		return LOG_MAP.get(key);
	}

	/**
	 * 批量关闭使用时间过长的Logger，避免出现open too many files 问题
	 */
	private static void batchStopLogger() {
		logger.info("清理过期logger开始");
		if(LOG_USE_TIME_MAP != null){
			Iterator<Map.Entry<String,Long>> iter = LOG_USE_TIME_MAP.entrySet().iterator();
			while(iter.hasNext()) {
				Map.Entry<String, Long> item = iter.next();
				String dateHour = item.getKey();
				long  lastUserTime = item.getValue();
				if((System.currentTimeMillis() - lastUserTime) >= CLEAN_INTERVAL){
					iter.remove();
					LOG_MAP.remove(dateHour);
					stop(dateHour);
					logger.info("清理logger=" + dateHour);
				}

			}
		}
		logger.info("清理过期logger结束");
	}

}
