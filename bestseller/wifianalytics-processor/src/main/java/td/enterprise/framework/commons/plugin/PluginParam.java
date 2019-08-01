/**
 * 
 * @author davy
 * 日期:		2013-5-23 11:17:50
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.plugin;

import td.enterprise.framework.commons.Map;

/**
 * The Class PluginParam. The default character set is UTF-8
 * <p>
 * 中文： <br>
 * 这个是td.framework.commons.Map的子类，详见td.framework.commons.Map的doc。 <br>
 * English: <br>
 * This is Map subclass, see Map the doc.
 * </p>
 * 
 * @author davy
 */
public class PluginParam extends Map<String, Object> {

	/**
	 * Instantiates a new plugin param.
	 * 
	 * @param readerParamMap
	 *            the reader param map
	 */
	public PluginParam(java.util.Map<String, Object> readerParamMap) {
		super(readerParamMap);
	}

}
