/**
 * @author davy
 * 日期:		2013-5-23 11:28:57
 * <p/>
 * The default character set is UTF-8.
 */
package td.enterprise.framework.plugin.reader;

import td.enterprise.framework.commons.plugin.AbstractPlugin;
import td.enterprise.framework.commons.plugin.line.Lines;

/**
 * @author davy 日期: 2013-8-14 上午11:43:45
 *         <p/>
 *         中文：<br>
 *         这是一个抽象类，你在编写Reader的插件时只需继承此类即可。<br>
 *         English:<br>
 *         This is an abstract class, you only need to write Reader plug-in can be inherited.
 * @see AbstractPlugin </p>
 * <p>
 * </p>
 */
public abstract class Reader extends AbstractPlugin {
    /**
     * 中文：<br>
     * 你必须重写此方法，将输入源的数据，按照你想要的最小处理单元，构造一个td.framework.commons.plugin.line.Line返回，如果你读取到最后一个最小处理单元时，你要返回一个td.framework.commons.plugin
     * .line.EndLine来表示你读完了。<br>
     * 例子：<br>
     * 假如你是读文件的reader,你的最小处理单元是文件中的一行，你可以这么做。<br>
     * 文件中一行内容为<br>
     * 10650,1<br>
     * 该文件的描述是第一列为productid，第二列为platformid，他们中间以&quot;,&quot;（逗号）分割。<br>
     * 你可以将这一行数据分开，以productid为key，第一列的值为value,以platformid为key，第二列的值为value放入到Line中。<br>
     * 那么在后续的Changer处理中你可以以productid为key从中获取到productid的值。<br>
     * 为了方便，你可以使用 td.framework.commons.plugin.metadata.MetaData和td.framework.commons.util.LineUtils来帮助你方便的构建Line。如何使用请看他们的JavaDoc。<br>
     * English:<br>
     * You must override this method, the input source data, in accordance with the minimum processing unit you want to
     * construct a Line return, if you read to the last minimum processing unit, you to
     * return a EndLine to indicate that you read it.<br>
     * Examples: <br>
     * If you are reading a document reader, your processing unit is the smallest line in the file, you can do so. <br>
     * file line content <br>
     * 10650,1 <br>
     * is the first description of the file as productid, second column platformid, they are separated by a "," (comma)
     * division. <br>
     * You can change the line data separately to productid for the key, the first column is value, in order to
     * platformid is key, the second column is the value put into the Line in. <br>
     * then in subsequent Changer treatment you can derive productid as key to the productid value. <br>
     * For convenience, you can use MetaData and LineUtils to help
     * you easily build Line. See how to use their JavaDoc.
     *
     * @return Lines
     */
    public abstract Lines ReadLines();

}
