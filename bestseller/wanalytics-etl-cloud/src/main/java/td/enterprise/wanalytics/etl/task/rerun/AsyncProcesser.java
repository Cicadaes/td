package td.enterprise.wanalytics.etl.task.rerun;


import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * Created by junmin.li
 */
public class AsyncProcesser {

    private static final Logger logger = Logger.getLogger(FSQueueWriter.class);

    private static ThreadPoolExecutor execsIn = null;

    private static int OUT_THREAD_SIZE = 30;

    private static ThreadPoolExecutor execsOut = null;

    private static int OUT_SCHEDULE_THREAD_SIZE = 50;

    private static int PERIOD = 10;

    private static ScheduledThreadPoolExecutor execsOutSch = null;

    private static AsyncProcesser instance = null;

    private AsyncProcesser() {
        init();
    }

    private void init() {

        int outCount = SysConfigUtil.getValue(WifipixTaskConstant.SEND_THREAD_SIZE) == null ? 50 : Integer.parseInt(SysConfigUtil.getValue(WifipixTaskConstant.SEND_THREAD_SIZE));

        logger.info("发送线程个数是：" + outCount);

        int writeCount = SysConfigUtil.getValue(WifipixTaskConstant.WRITE_THREAD_SIZE) == null ? 50 : Integer.parseInt(SysConfigUtil.getValue(WifipixTaskConstant.WRITE_THREAD_SIZE));

        logger.info("写线程个数：" + writeCount);


        OUT_SCHEDULE_THREAD_SIZE = SysConfigUtil.getValue(WifipixTaskConstant.SCHEDULE_SEND_THREAD_SIZE) == null ? 100 : Integer.parseInt(SysConfigUtil.getValue(WifipixTaskConstant.SCHEDULE_SEND_THREAD_SIZE));

        logger.info("调度发送线程个数：" + OUT_SCHEDULE_THREAD_SIZE);

        execsIn = (ThreadPoolExecutor) Executors.newFixedThreadPool(writeCount);

        execsOut = (ThreadPoolExecutor) Executors.newFixedThreadPool(outCount);

        execsOutSch = (ScheduledThreadPoolExecutor) Executors.newScheduledThreadPool(OUT_SCHEDULE_THREAD_SIZE);

        for (int i = 0; i < OUT_SCHEDULE_THREAD_SIZE; i++) {
            execsOutSch.scheduleAtFixedRate(new FSQueueReader(), 0, PERIOD, TimeUnit.MILLISECONDS);
        }
    }

    public static AsyncProcesser getInstance() {
        if (instance == null) {
            instance = new AsyncProcesser();
        }
        return instance;
    }

    public void in(String json) {
        execsIn.execute(new FSQueueWriter(json));
    }

    public void out() {
        execsOut.execute(new FSQueueReader());
    }

    public  void shutdown(){
        execsIn.shutdown();
        execsOut.shutdown();
        execsOutSch.shutdown();
        FSQueueManager.getInstance().getWiFiReceiveFQueue().close();
    }
}
