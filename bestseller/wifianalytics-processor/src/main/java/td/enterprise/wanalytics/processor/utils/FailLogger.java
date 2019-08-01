package td.enterprise.wanalytics.processor.utils;

import td.enterprise.framework.commons.plugin.line.Line;

/**
 * 记录失败的日志   
 * @author junmin.li
 *
 */
public class FailLogger {
	
	//public static Logger logger = LoggerFactory.getLogger(FailLogger.class);

	private static String prefix = "fail";

//	public static void write(String content){
//		logger.info(content);
//	}
	
	public static void write(Line line){
		long tsreceive = line.getLongValue(LineKeyConstants.tsreceive);
		String dateHour = DateTimeUtil.getDateHour(tsreceive);
		String content = LineUtils.getLogInfo(line);
		String yearMonth = dateHour.substring(0,7);
		LogFactory.getLogger(dateHour,prefix,prefix + "-" + yearMonth).info(content);
	}
	
//	public static void write(String content,Exception e){
//		logger.error(content,e);
//	}
	

}
