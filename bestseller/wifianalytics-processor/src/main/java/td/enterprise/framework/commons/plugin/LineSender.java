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
 * The Interface LineSender. The default character set is UTF-8
 * 
 * @author davy
 */
public interface LineSender {

	/**
	 * Creates the line.
	 * 
	 * @return the line
	 */
	public Line createLine();

	/**
	 * Send.
	 * 
	 * @param line
	 *            the line
	 * @return true, if successful
	 */
	public boolean send(Line line, int index);

}
