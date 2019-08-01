/**
 * @author davy
 * 日期:		2013-5-23 11:30:59
 * <p/>
 * The default character set is UTF-8.
 */
package td.enterprise.framework.plugin.writer;

import td.enterprise.framework.commons.plugin.AbstractPlugin;
import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.commons.plugin.status.HandleStatus;

/**
 * * @author davy 日期: 2013-8-14 上午11:43:45
 * <p>
 * 中文：<br>
 * 这是一个抽象类，你在编写Writer的插件时只需继承此类即可。<br>
 * English:<br>
 * This is an abstract class, you only need to write Reader plug-in can be inherited.
 *
 * @see AbstractPlugin </p>
 *      <p>
 *      </p>
 */
public abstract class Writer extends AbstractPlugin {
    /**
     * 中文： <br>
     * 将你得到的Line输出到你所要输出的地方。<br>
     * English: <br>
     * Line output will you get to where you want to output.
     *
     * @param line
     * @return
     */
    public abstract HandleStatus writeLine(Line line);

}
