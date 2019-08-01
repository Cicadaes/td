package td.enterprise.wanalytics.processor.utils;

import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.wanalytics.common.Constants;

public class FrontUtils {



	/**
	* <p>Description: 判断店前客流逻辑：
	* 如果被discard掉：判断是否因为信号强度过滤，是否因为访问时间过短过滤，并且店前客流标记为Y，并且不是伪MAC过滤，则视为店前客流
	* </p>
	* @param line
	* @return
	* @author liyinglei 
	* @date 2017年12月6日下午7:31:44
	 */
	public static boolean checkLineFront(Line line) {
					if (line.discard) {
							  return (Constants.ES_DISCARD_CODE_RSSI_FILTER.equals(line.getStringValue(LineKeyConstants.discard))
									  || Constants.ES_DISCARD_CODE_VISIT_MINUTES_FILTER.equals(line.getStringValue(LineKeyConstants.discard)))
									  && line.getBoolValue(LineKeyConstants.isFrontUser) && (line.get(LineKeyConstants.projectid) != null
									  && !Constants.ES_DISCARD_CODE_MAC_FAKE_FILTER.equals(line.getStringValue(LineKeyConstants.discard)));
					} else {
							  return !line.discard;
					}
		  }
    public  static boolean writeFrontLogger(Line line){
			  if (line.discard) {
						return line.getBoolValue(LineKeyConstants.isFrontUser) && (line.get(LineKeyConstants.projectid) != null
								&& !Constants.ES_DISCARD_CODE_MAC_FAKE_FILTER.equals(line.getStringValue(LineKeyConstants.discard)));
			  } else {
						return !line.discard;
			  }



	}
}
