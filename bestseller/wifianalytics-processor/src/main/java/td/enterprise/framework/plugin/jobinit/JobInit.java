/**
 * @author davy
 * 日期:		2013-5-23 11:27:00
 * <p/>
 * The default character set is UTF-8.
 */
package td.enterprise.framework.plugin.jobinit;

import td.enterprise.framework.commons.GlobalVariables;
import td.enterprise.framework.commons.plugin.AbstractPlugin;

/**
 * @author davy 日期: 2013-8-14 上午11:43:45
 *         <p>
 *         中文：<br>
 *         这是一个抽象类，你在编写JobInit的插件时只需继承此类即可。这个插件并不是必须的。<br>
 *         English:<br>
 *         This is an abstract class, you only need to write JobInit plug-in can be inherited.This plug-in is not
 *         required.
 * @see AbstractPlugin </p>
 *      <p>
 *      </p>
 */
public abstract class JobInit extends AbstractPlugin {
    /**
     * 中文： <br>
     * 构建一个全局变量并返回。<br>
     * 有些参数通过配置文件获得可能并不方便，比如你需要从某个服务中取readaddress。你可以在这里得到并放入全局变量中，在reader中你就可以直接使用。<br>
     * English: <br>
     * Build a global variable and returns. <br>
     * some parameters via the configuration file may not be easy to obtain, for example, you need to fetch from a
     * service readaddress. Here you can get and put in a global variable, in the reader where you can directly use.
     *
     * @return
     */
    public abstract GlobalVariables init();

}
