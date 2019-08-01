package td.enterprise.wanalytics.processor.utils;

import td.enterprise.framework.commons.plugin.line.Line;

public class FrontLogger {
		  //日志前缀
		  private static String prefix = "front";

		  public static void write(Line line){
					long tsreceive = line.getLongValue(LineKeyConstants.tsreceive);
					String dateHour = DateTimeUtil.getDateHour(tsreceive);
					String content = LineUtils.getLogInfo(line);
					String yearMonth = dateHour.substring(0,7);
					LogFactory.getLogger(dateHour,prefix,prefix + "-" + yearMonth).info(content);
		  }
}
