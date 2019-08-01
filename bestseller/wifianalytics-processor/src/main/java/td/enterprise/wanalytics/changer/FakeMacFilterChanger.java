package td.enterprise.wanalytics.changer;

import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.commons.plugin.status.HandleStatus;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.atomic.impl.SpringDictDaoChanger;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.processor.utils.DiscardLogger;
import td.enterprise.wanalytics.processor.utils.FailLogger;
import td.enterprise.wanalytics.processor.utils.FrontUtils;
import td.enterprise.wanalytics.processor.utils.LineKeyConstants;

/**
 * <p>Description：伪MAC过滤</p>
 * <p><b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.</b></p>
 * @author liyinglei
 * @version 1.0
 * @date 2017年12月25日下午3:41:19 
 * @since jdk1.7
 */
public class FakeMacFilterChanger extends SpringDictDaoChanger {

	public Line _change(Line line) {
		if(null != line && FrontUtils.checkLineFront(line)){
			try{
				// 过滤伪MAC
				if (!checkMac((String) line.get(LineKeyConstants.mac))) {
					line.discard = true;
					line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_MAC_FAKE_FILTER);
					DiscardLogger.write(line);
				}
			}catch(Exception e){
				line.fail = true;
				line.put(Constants.ES_FAIL_CODE_KEY, Constants.ES_FAIL_CODE_VAlUE_MAC);
				FailLogger.write(line);
				logger.error("2=====FakeMacFilterChanger error !", e);
			}
		}
		return line;
	}
	
	protected boolean needChange(Line line) {
		return (Utils.isNotEmpty(line) && !line.discard && !line.getBoolValue(FAIL)) || FrontUtils.checkLineFront(line); 
	}

	public HandleStatus finish() {
		return HandleStatus.success;
	}
	
	/**
	 * 判断真伪MAC
	 * @param mac
	 * @return 真MAC：true 伪MAC：false
	 */
	public static boolean checkMac(String mac) {
		if ("0,4,8,c".indexOf(mac.substring(1, 2)) > -1) {
			return true;
		}
		return false;
	}

}
