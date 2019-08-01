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
import td.enterprise.wanalytics.idmapping.bean.InputBean;

/**
 * 
 * @author davy 日期: 2013-3-22 下午3:36:19
 */
public class InputBeanUtils extends BeanUtils {
	/**
	 * 
	 */
	private static final long serialVersionUID = 5386328591959690552L;

	private static final Logger logger = LoggerFactory.getLogger(InputBeanUtils.class);

	public static boolean check(InputBean inputBean) {
		if (isNotEmpty(inputBean) && isNotEmpty(inputBean.getDomain(), inputBean.getKey(), inputBean.getValue())
				&& isNotEmpty(inputBean.getTenantid()))
			return true;
		else
			logger.warn(Utils.toLog("InputBean为空或者domain为空或者key为空或者value为空或者tenantid为空\tInputBean是", inputBean));
		return false;
	}

}
