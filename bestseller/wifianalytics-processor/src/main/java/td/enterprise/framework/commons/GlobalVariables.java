/**
 * 
 * @author davy
 * 日期:		2013-5-23 11:17:49
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 中文：<br>
 * 这是一个Map的子类，他由JobInit插件生成，他可以在所有插件中使用，在一次job中所用的插件共享一个对象，你可以用它来进行插件间的消息通信。<br>
 * English:<br>
 * This is a subclass of the Map, he generated by the JobInit plugin, he can use all the plug-in, in a job used to share
 * a plugin object, you can use it to communicate messages between plugins. The Class GlobalVariables. <br>
 * The default character set is UTF-8
 * 
 * @author davy
 */
public class GlobalVariables extends Map<String, Object> {

	/** The Constant sartChangerName. */
	private static final String sartChangerName = "sartChangerName";

	/** The Constant logger. */
	private static final Logger logger = LoggerFactory.getLogger(GlobalVariables.class);

	/**
	 * Instantiates a new global variables.
	 * 
	 * @param map
	 *            the map
	 */
	public GlobalVariables(java.util.Map<String, Object> map) {
		super(map);
	}

	/**
	 * Instantiates a new global variables.
	 */
	public GlobalVariables() {
	}

	/**
	 * 中文：<br>
	 * 设置startChanger，在job.xml中你可以配置多个changer类型，但一个job只能执行一个类型，你可以通过这个来决定你需要执行的是哪一个。<br>
	 * English:<br>
	 * Set startChanger, in job.xml where you can configure multiple changer type, but one can only perform one type of
	 * job, you can use this to determine what you need to do is which one.
	 * 
	 * @param name
	 *            the new start changer name
	 */
	public void setStartChangerName(String name) {
		put(sartChangerName, name);
	}

	/**
	 * Gets the start changer name.
	 * 
	 * @return the start changer name
	 */
	public String getStartChangerName() {
		return getStringValue(sartChangerName);
	}
}