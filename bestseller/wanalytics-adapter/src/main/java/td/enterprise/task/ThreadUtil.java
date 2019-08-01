package td.enterprise.task;

import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import td.enterprise.common.util.LogUtils;
import td.enterprise.constants.ThreadConstants;

public class ThreadUtil {

    private static ThreadUtil         instance;
    private static ThreadPoolExecutor pool;

    /**
     * 314572800=1024*1024*300
     */
    private ThreadUtil() {
        //pool = Executors.newFixedThreadPool(200);
        pool = new ThreadPoolExecutor(ThreadConstants.SEND_THREAD_SIZE, ThreadConstants.SEND_THREAD_SIZE, 0L, //
                TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>(2000000));
    }

    public final static ThreadUtil getInstance() {
        if (instance == null) {
            synchronized (ThreadUtil.class) {
                if (instance == null) {
                    instance = new ThreadUtil();
                }
            }
        }
        return instance;
    }

    public void submit(Runnable task) {
        try {
            pool.submit(task);
        } catch (Exception e) {
            LogUtils.log4Task.error("ThreadUtilError:", e);
        }
    }

    public ThreadPoolExecutor getPool() {
        return pool;
    }

}
