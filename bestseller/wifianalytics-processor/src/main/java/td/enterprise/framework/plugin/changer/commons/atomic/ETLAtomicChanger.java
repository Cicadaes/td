/**
 *
 */
package td.enterprise.framework.plugin.changer.commons.atomic;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.commons.plugin.status.HandleStatus;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.Changer;

import java.util.Arrays;
import java.util.concurrent.atomic.AtomicLong;

/**
 * @author davy 2013年12月17日 下午1:20:56
 */
public abstract class ETLAtomicChanger extends Changer {
    protected static final String DISCARD_MESSAGE = "discardmessage";
    protected static final String FAIL_MESSAGE = "failmessage";
    protected static final String _package = "package";
    private static final Logger logger = LoggerFactory.getLogger(ETLAtomicChanger.class);
    protected volatile boolean debug;

    protected String[] outputNames;

    protected static final AtomicLong index = new AtomicLong();

    protected String name;

    protected long myIndex;

    public ETLAtomicChanger() {
        myIndex = index.addAndGet(1);
        name = this.getClass().getSimpleName();
    }

    public String getName() {
        return name;
    }

    public String[] getOutputNames() {
        return outputNames;
    }

    public void setOutputNames(String[] outputNames) {
        this.outputNames = outputNames;
    }

    public long getMyIndex() {
        return myIndex;
    }

    protected boolean needChange(Line line) {
        boolean isNeed = line.need();
        trace(logger, line, true);
        return isNeed;
    }

    
    public Line change(Line line) {
        if (needChange(line)) {
            line = _change(line);
            output(line);
        }
        return line;
    }

    protected abstract Line _change(Line line);

    protected void discard(Line line, Object... discardMessage) {
        line.discard = true;
        line.put(DISCARD_MESSAGE, Utils.toLog(discardMessage));
        warn(logger, Utils.toLog(this.getName(), "丢弃了:", line, ",原因是:", Utils.toLog(discardMessage)));
    }

    protected void fail(Line line, Object... failMessage) {
        line.fail = true;
        line.put(FAIL_MESSAGE, Utils.toLog(failMessage));
        error(logger, Utils.toLog(this.getName(), "出错了:", line, ",原因是:", Utils.toLog(failMessage)));
    }

    
    public HandleStatus finish() {
        return HandleStatus.success;
    }

    
    public HandleStatus prepare() {
        debug = getParamBoolValue("debug");
        return HandleStatus.success;
    }

    protected void output(Line line) {
        trace(logger, line, false);
        if (outputNames != null)
            for (String outName : outputNames) {
                line.put(outName, true);
            }
    }

    
    public String toString() {
        return this.name + (outputNames != null ? " outputNames=" + Arrays.toString(outputNames) : "") + ", myIndex=" + myIndex + "";
    }

    public void trace(Logger logger, Object... objects) {
        if (debug) {
            logger.trace(Utils.toLog(objects));
        }
    }

    public void trace(Logger logger, Line line, boolean in) {
        if (debug && in) {
            logger.trace(Utils.toLog(this.getName(), "接收到的:", line, ",", line.need() ? "" : "不", "需要处理"));
        } else if (debug) {
            logger.trace(Utils.toLog(this.getName(), "输出了:", line, ",outputNames是:", Arrays.toString(outputNames)));
        }
    }

    public void trace(Logger logger, Throwable e, Object... objects) {
        if (debug) {
            logger.trace(Utils.toLog(objects), e);
        }
    }

    public void debug(Logger logger, Object... objects) {
        if (debug) {
            logger.debug(Utils.toLog(objects));
        }
    }

    public void debug(Logger logger, Throwable e, Object... objects) {
        if (debug) {
            logger.debug(Utils.toLog(objects), e);
        }
    }

    public void info(Logger logger, Object... objects) {
        logger.info(Utils.toLog(objects));
    }

    public void info(Logger logger, Throwable e, Object... objects) {
        logger.info(Utils.toLog(objects), e);
    }

    public void warn(Logger logger, Object... objects) {
        logger.warn(Utils.toLog(objects));
    }

    public void warn(Logger logger, Throwable e, Object... objects) {
        logger.warn(Utils.toLog(objects), e);
    }

    public void error(Logger logger, Object... objects) {
        logger.error(Utils.toLog(objects));
    }

    public void error(Logger logger, Throwable e, Object... objects) {
        logger.error(Utils.toLog(objects), e);
    }
}
