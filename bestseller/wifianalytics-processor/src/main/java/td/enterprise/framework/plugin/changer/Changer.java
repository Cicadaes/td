/**
 * @author davy
 * 日期:		2013-5-23 11:33:16
 * <p/>
 * The default character set is UTF-8.
 */
package td.enterprise.framework.plugin.changer;

import td.enterprise.framework.commons.plugin.AbstractPlugin;
import td.enterprise.framework.commons.plugin.line.Line;

/**
 *
 * @author davy 日期: 2013-8-14 上午10:03:37
 *         <p>
 *         中文： <br>
 *         将你得到的Line经过各种处理得到结果的Line。<br>
 *         English: <br>
 *         Line will you get the results obtained through the various processing Line.
 *         </p>
 */
public abstract class Changer extends AbstractPlugin {

	public static final String DISCARD = "discard";

	public static final String FAIL = "fail";

	/**
	 * 中文： <br>
	 * 将你得到的Line经过各种处理得到结果的Line。<br>
	 * 在此方法中请不要抛出异常，如果抛出异常，我将停止调用所有的插件。<br>
	 * English: <br>
	 * Line will you get the results obtained through the various processing Line. <br>
	 * In this method, please do not throw an exception if an exception is thrown, I'll stop calling all plugins.
	 *
	 * @param line
	 * @return Line
	 */
	public abstract Line change(Line line);

}
