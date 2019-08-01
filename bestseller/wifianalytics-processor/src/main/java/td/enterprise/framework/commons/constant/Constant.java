/**
 * 
 * @author davy
 * 日期:		2013-5-23 11:17:49
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.constant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.framework.commons.util.Utils;

import java.lang.reflect.Field;

/**
 * The Class Constant.
 * The default character set is UTF-8
 *
 * @author davy
 */
@Deprecated
public class Constant {
	
	/** The Constant logger. */
	private static final Logger logger = LoggerFactory.getLogger(Constant.class);
	
	/** The Constant DEFAULT_BUFFER. */
	public static final String DEFAULT_BUFFER = "default";

	/**
	 * To string.
	 *
	 * @return the string
	 */
	public static String ToString() {
		StringBuffer sb = new StringBuffer();
		for (Field field : Constant.class.getFields()) {
			try {
				sb.append(field.getName()).append("=").append("[").append(field.get(Constant.class)).append("]\t");
			} catch (Exception e) {
				logger.error(Utils.toLog("ETLConfigToString有错误啊!!!"));
			}
		}
		return sb.toString();
	}
}
