package td.enterprise.wanalytics.processor.utils;


import td.enterprise.framework.commons.plugin.line.Line;

/**
 * 记录不合理的数据
 * @author junmin.li
 *
 */
public class DiscardLogger {
	
   //public static Logger logger = LoggerFactory.getLogger(DiscardLogger.class);

	//日志前缀
	private static String prefix = "discard";

	public static void write(Line line){
		long tsreceive = line.getLongValue(LineKeyConstants.tsreceive);
		String dateHour = DateTimeUtil.getDateHour(tsreceive);
		String content = LineUtils.getLogInfo(line);
		String yearMonth = dateHour.substring(0,7);
		LogFactory.getLogger(dateHour,prefix,prefix + "-" + yearMonth).info(content);
	}
	

}
