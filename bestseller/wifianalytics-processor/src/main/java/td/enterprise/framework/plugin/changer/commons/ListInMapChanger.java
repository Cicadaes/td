package td.enterprise.framework.plugin.changer.commons;

/**
 *
 * @author davy
 * 日期:		2013-6-3 11:50:49
 *
 * The default character set is UTF-8.
 */

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.commons.plugin.status.HandleStatus;
import td.enterprise.framework.commons.util.StringUtils;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.Changer;
import td.enterprise.framework.plugin.changer.commons.atomic.ETLAtomicChanger;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

public abstract class ListInMapChanger extends Changer {
    private static final Logger logger = LoggerFactory.getLogger(ListInMapChanger.class);
    protected static final String dataType = "datatype";
    protected ETLChangerContainer changerContainer;
    private static final Logger profilerLogger = LoggerFactory.getLogger("profiler");

    private final ReentrantLock lock = new ReentrantLock();
    private static final AtomicInteger myIndex = new AtomicInteger();

    
    public HandleStatus finish() {
        HandleStatus status = HandleStatus.success;
        for (ETLChangers changers : changerContainer.values()) {
            for (ETLAtomicChanger etlAtomicChanger : changers) {
                status = etlAtomicChanger.finish();
                logger.trace(Utils.toLog(etlAtomicChanger, "结束", status));
            }
        }
        return status;
    }

    
    public HandleStatus prepare() {
        try {
            lock.lock();
            setContextClassLoader(ListInMapChanger.class.getClassLoader());
            changerContainer = new ETLChangerContainer();
            changerRegistration();
            logger.trace("ListInMapChanger调用prepare");
            HandleStatus status = HandleStatus.success;
            for (ETLChangers changers : changerContainer.values()) {
                for (ETLAtomicChanger etlAtomicChanger : changers) {
                    etlAtomicChanger.setGlobalVariables(globalVariables);
                    etlAtomicChanger.setParam(param);
                    etlAtomicChanger.setPluginName(pluginName);
                    etlAtomicChanger.setPluginVersion(pluginVersion);
                    status = etlAtomicChanger.prepare();
                    logger.trace(Utils.toLog(etlAtomicChanger, "初始化", status));
                    if (!HandleStatus.isSuccess(status)) {
                        logger.error(Utils.toLog("ListInMapChanger-", StringUtils.ToString(myIndex.addAndGet(1)), "调用prepare失败\t", "ETLAtomicChanger是:", etlAtomicChanger));
                        return status;
                    }
                }
            }
            return status;
        } finally {
            lock.unlock();
        }
    }

    protected abstract void changerRegistration();

    
    public synchronized Line change(Line line) {
//        logger.trace("ListInMapChanger接收到的\t" + line.toString());
        if (changerContainer.size() == 1) {
            for (ETLChangers changers : changerContainer.values()) {
                for (ETLAtomicChanger etlAtomicChanger : changers) {
                    long startTime = System.nanoTime();
                    line = etlAtomicChanger.change(line);
                    long endTime = System.nanoTime();
                    profiler(etlAtomicChanger.getName(), myIndex.get(), startTime, endTime);
//                    logger.trace(Utils.toLog(etlAtomicChanger, "输出的\t", line));
                }
            }
        } else if (Utils.isNotEmpty(line.getStringValue(dataType))) {
            ETLChangers changers = changerContainer.get(line.getStringValue(dataType));
            for (ETLAtomicChanger etlAtomicChanger : changers) {
                long startTime = System.nanoTime();
                line = etlAtomicChanger.change(line);
                long endTime = System.nanoTime();
                profiler(etlAtomicChanger.getName(), myIndex.get(), startTime, endTime);
//                logger.trace(Utils.toLog(etlAtomicChanger, "输出的\t", line));
            }
        }
        if (line.discard)
            monitor.discard();
        else if (line.fail)
            monitor.fail();
        else
            monitor.success();
        return line;
    }

    protected void profiler(String pluginName, int myIndex, long startTime, long endTime) {
        if (getParamBoolValue("profiler", true))
            profilerLogger.info(Utils.toLog(pluginName, ",", myIndex, ",", (endTime - startTime)));
    }


}
