/**
 * 
 * @author davy
 * 日期:		2013-5-23 11:17:49
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.plugin;

import td.enterprise.framework.commons.plugin.line.Line;

/**
 * The Interface LineReceiver. The default character set is UTF-8
 * 
 * @author davy
 */
public interface LineReceiver {

	/**
	 * Receiver.
	 * 
	 * @return the line
	 */
	public Line receiver(int index);

}
