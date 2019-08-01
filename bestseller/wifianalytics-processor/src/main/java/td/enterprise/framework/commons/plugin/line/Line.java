/**
 *
 * @author davy
 * 日期:		2013-5-23 11:17:49
 *
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.plugin.line;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Iterator;
import java.util.Map;

/**
 * The Class Line. The default character set is UTF-8
 * <p>
 * 中文：<br>
 * 这是插件间数据传输的最小单元，是一个Map。<br>
 * English:<br>
 * This is a plug for data transmission between the smallest unit of a Map.
 * </p>
 *
 * @author davy
 */
public class Line extends td.enterprise.framework.commons.Map<String, Object> implements ILine,Cloneable {

    /**
     * The Constant logger.
     */
    private static final Logger logger = LoggerFactory.getLogger(Line.class);

    public boolean discard;

    public boolean fail;

    /**
     * Instantiates a new line.
     */
    public Line() {
        super();
    }

    public boolean need() {
        return !discard && !fail;
    }

    /**
     * Instantiates a new line.
     *
     * @param m the m
     */
    public Line(Map<String, Object> m) {
        super(m);
    }

    /**
     * The main method.
     *
     * @param args the arguments
     */
    public static void main(String[] args) {
        Line data = new Line();
        data.put("key", true);
        System.out.println(data.get("key"));
        System.out.println(data.getBoolValue("key"));
    }

    /**
     * 目前是浅拷贝，没有引用对象，如果有引用对象，需要做深拷贝
     * @return
     */
    public Object clone() {
        Line target = new Line();
        for (Iterator keyIt = this.keySet().iterator(); keyIt.hasNext();) {
            String key = keyIt.next() + "";
            target.put(key, this.get(key));
        }
        return target;
    }

    @Override
    public String toString() {
        return "Line{" +
                "discard=" + discard +
                ", fail=" + fail +
                "} " + super.toString();
    }
}
