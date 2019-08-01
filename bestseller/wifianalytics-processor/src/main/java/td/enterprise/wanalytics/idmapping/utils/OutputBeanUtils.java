/**
 * 
 * @author davy
 * 日期:		2013-3-28 17:16:21
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.wanalytics.idmapping.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.wanalytics.idmapping.bean.OutputBean;

/**
 * 
 * @author davy 日期: 2013-3-22 下午3:36:19
 */
public class OutputBeanUtils extends BeanUtils {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = LoggerFactory.getLogger(OutputBeanUtils.class);

	public static boolean check(OutputBean outputBean) {
		if (isNotEmpty(outputBean) && isNotEmpty(outputBean.getKey(), outputBean.getValue(), outputBean.getOffset(), outputBean.getTime()))
			return true;
		else
			logger.warn(Utils.toLog("outputBean为空或者key为空或者value为空或者offset为0或者time为0\toutputBean是", outputBean));
		return false;
	}
}
