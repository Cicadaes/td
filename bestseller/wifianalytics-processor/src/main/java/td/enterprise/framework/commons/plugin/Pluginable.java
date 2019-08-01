/**
 * @author davy
 * 日期:		2013-5-23 11:17:49
 * <p/>
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.plugin;

import td.enterprise.framework.commons.GlobalVariables;
import td.enterprise.framework.commons.plugin.monitor.PluginMonitor;
import td.enterprise.framework.commons.plugin.status.HandleStatus;

import java.util.Observer;

/**
 * The Interface Pluginable. The default character set is UTF-8 <br>
 * 中文： <br>
 * 这个接口是所有插件的接口，实现了这个接口的类就是插件。 <br>
 * English: <br>
 * This interface is the interface to all plug-ins, a class that implements this interface is a plugin. <br>
 *
 * @author davy
 */
public interface Pluginable extends Observer {

    /**
     * 中文： <br>
     * 这个方法返回值在插件中一定不为null，它是你在job.xml中配置的标签的键值对。你也可以直接使用param这个成员变量。 <br>
     * 例如： <br>
     * 在job.xml这么配置 <br>
     * &lt;param key=&quot;readdir&quot; value=&quot;/tmp/read&quot; /&gt; <br>
     * 那么你在插件中调用 <br>
     * getParam().get(&quot;readdir&quot;)的值就是/tmp/read。 <br>
     * <br>
     * English: <br>
     * This method returns the value in the plugin certainly is not null, it is configured you labels job.xml key pair.
     * You can also use the param this member variable. <br>
     * For example: <br>
     * in job.xml so configured <br>
     * &lt;param key=&quot;readdir&quot; value=&quot;/tmp/read&quot; /&gt; <br>
     * then you call the plugin <br>
     * getParam().get ("readdir") value is the /tmp/read. *
     *
     * @return the param
     */
    public PluginParam getParam();

    /**
     * Sets the param.
     *
     * @param oParam
     *            the new param
     */
    public void setParam(PluginParam oParam);

    /**
     * 中文： <br>
     * 这个方法返回值在插件中一定不为null，在所有的插件中共享一个对象，你可以用它来进行插件间的消息通信。你也可以直接使用globalVariables这个成员变量。 <br>
     * 例如： <br>
     * 你在reader中getGlobalVariables().set("key)"了一个值，那么你在changer和writer中都能将它get出来。 <br>
     * English: <br>
     * This method returns the value in the plug-in must not be null, in all of the plug-in shared an object, you can
     * use it to communicate messages between plug-ins. You can also use globalVariables this member variable. <br>
     * example: <br>
     * You reader in getGlobalVariables().set ("key)" a value, then you are in the changer and the writer will be able
     * to get it out.
     *
     * @return the global variables
     */
    public GlobalVariables getGlobalVariables();

    /**
     * Sets the global variables.
     *
     * @param globalVariables
     *            the new global variables
     */
    public void setGlobalVariables(GlobalVariables globalVariables);

    /**
     * 中文： <br>
     * 获取一个td.framework.commons.plugin.monitor.PluginMonitor，详见它的doc。 <br>
     * English: <br>
     * Get a PluginMonitor, see its doc.
     *
     * @return the monitor
     */
    public PluginMonitor getMonitor();

    /**
     * Sets the monitor.
     *
     * @param monitor
     *            the new monitor
     */
    public void setMonitor(PluginMonitor monitor);

    /**
     * <p>
     * 中文： <br>
     * 这个方法是获取plugins.xml中&lt;name&gt;标签中的值。 <br>
     * English: <br>
     * This method is to obtain the &lt;name&gt; plugins.xml value in the label.
     * </p>
     *
     * @return the plugin name
     */
    public String getPluginName();

    /**
     * Sets the plugin name.
     *
     * @param pluginName
     *            the new plugin name
     */
    public void setPluginName(String pluginName);

    /**
     * <p>
     * 中文： <br>
     * 这个方法是获取plugins.xml中&lt;version&gt;标签中的值。 <br>
     * English: <br>
     * This method is to obtain the &lt;version&gt; plugins.xml value in the label.
     * </p>
     *
     * @return the plugin version
     */
    public String getPluginVersion();

    /**
     * Sets the plugin version.
     *
     * @param pluginVersion
     *            the new plugin version
     */
    public void setPluginVersion(String pluginVersion);

    /**
     * <p>
     * 中文： <br>
     * 这个方法是插件一个很重要的方法，它在插件调用setParam、setGlobalVariables、setMonitor、setPluginName、setPluginVersion后被第一个调用，
     * 你可以用它来初始化你插件的一些准备工作。当然，你也可以什么也不做。 <br>
     * 例如： <br>
     * 一个FileReader的插件，这个方法可以用来初始化BufferedReader。 <br>
     * English: <br>
     * This method is a very important way plug it in plug-in called setParam, setGlobalVariables, setMonitor,
     * setPluginName, setPluginVersion after the first call, you can use it to initialize your plug some of the
     * preparatory work. Of course, you can do nothing. <br>
     * example: <br>
     * a FileReader plug-ins, this method can be used to initialize BufferedReader.
     * </p>
     *
     * @return the handle status
     */
    public HandleStatus prepare();

    /**
     * <p>
     * 中文： <br>
     * 这个方法是插件一个很重要的方法，它在插件所用方法中最后调用，你可以用它来结束你插件的一些工作。当然，你也可以什么也不做。 <br>
     * 例如： <br>
     * 一个FileReader的插件，这个方法可以用来关闭文件流。 <br>
     * English: <br>
     * This method is plug a very important way, it is the method used in the plug-in the last call, you can use it to
     * end your plug some of the work. Of course, you can do nothing. <br>
     * example: <br>
     * a FileReader plug-ins, this method can be used to close the file stream.
     * </p>
     *
     * @return the handle status
     */
    public HandleStatus finish();

    /**
     * <p>
     * 中文： <br>
     * 这个方法一般放在在prepare方法的第一行，当然你也可以放在其他地方或者不调用， <br>
     * 但如果那么做了，你在使用spring、ehcahe或这其他第三方的自动加载配置文件或自动反射其他类的工具包时，会报要反射的类找不到或文件找不到。 <br>
     * 例如： <br>
     * 一个FileReader的插件，这个方法可以这么用。 <br>
     * setContextClassLoader(FileReader.class.getClassLoader()); <br>
     * English: <br>
     * This method is generally placed in the first line of the prepare method, of course, you can also be placed
     * elsewhere or do not call, <br>
     * but if you do, you're using spring, ehcahe or other third parties which automatically loads the configuration
     * file or automatic reflex other classes toolkit, will be reported to reflect the class not found or file not
     * found. <br>
     * example: <br>
     * a FileReader plug-in, so this method can be used. <br>
     * setContextClassLoader (FileReader.class.getClassLoader ());
     * </p>
     *
     * @param classLoader
     *            the new context class loader
     */
    public void setContextClassLoader(ClassLoader classLoader);
}
