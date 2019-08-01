package com.talkingdata.analytics.wifi.collector.control;

import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * Created by loong on 4/13/16.
 */
public class AsyncProcesser {

    private static ThreadPoolExecutor execsIn = null;

    private static int OUT_THREAD_SIZE = Runtime.getRuntime().availableProcessors();

    private static ThreadPoolExecutor execsOut = null;

    private static int OUT_SCHEDULE_THREAD_SIZE = 5;

    private static int PERIOD = 100;

    private static ScheduledThreadPoolExecutor execsOutSch = null;

    private static AsyncProcesser instance = null;

    public boolean isShutdownIn = false;

    public boolean isShutdownSchedule = false;

    private AsyncProcesser() {
        init();
    }

    private void init() {

        execsIn = (ThreadPoolExecutor) Executors.newFixedThreadPool(200);

        execsOut = (ThreadPoolExecutor) Executors.newFixedThreadPool(OUT_THREAD_SIZE);

        execsOutSch = (ScheduledThreadPoolExecutor) Executors.newScheduledThreadPool(OUT_SCHEDULE_THREAD_SIZE);

        for (int i = 0; i < OUT_SCHEDULE_THREAD_SIZE; i++) {
            execsOutSch.scheduleAtFixedRate(new FSQueueReader(), 0, PERIOD, TimeUnit.MILLISECONDS);
        }
    }

    public static AsyncProcesser getInstance() {
        if (instance == null) {
            synchronized (AsyncProcesser.class) {
                if (instance == null) {
                    instance = new AsyncProcesser();
                }
            }
        }
        return instance;
    }

    public void in(WiFiDataEntity dataEntity) {
        execsIn.execute(new FSQueueWriter(dataEntity));
    }

    public void out() {
        execsOut.execute(new FSQueueReader());
    }

    public void restartOutExec(int poolSize) {
        execsOut.shutdown();

        while (!execsOut.isShutdown()) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        OUT_THREAD_SIZE = poolSize;
        execsOut = (ThreadPoolExecutor) Executors.newFixedThreadPool(OUT_THREAD_SIZE);
    }

    public void shutdownIn() {
        execsIn.shutdown();
        isShutdownIn = true;
    }

    public void shutdownSchedule() {
        execsOutSch.shutdown();
        isShutdownSchedule = true;
    }

    public void startIn() {
        execsIn = (ThreadPoolExecutor) Executors.newCachedThreadPool();
        isShutdownIn = false;
    }

    public void startSchedule() {
        execsOutSch = (ScheduledThreadPoolExecutor) Executors.newScheduledThreadPool(OUT_SCHEDULE_THREAD_SIZE);
        for (int i = 0; i < OUT_SCHEDULE_THREAD_SIZE; i++) {
            execsOutSch.scheduleAtFixedRate(new FSQueueReader(), 0, PERIOD, TimeUnit.MILLISECONDS);
        }
        isShutdownSchedule = false;
    }

    public void restartScheduleOutExec(int period, int poolSize) {
        execsOutSch.shutdown();

        while (!execsOutSch.isShutdown()) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        OUT_SCHEDULE_THREAD_SIZE = poolSize;
        PERIOD = period;
        execsOutSch = (ScheduledThreadPoolExecutor) Executors.newScheduledThreadPool(OUT_SCHEDULE_THREAD_SIZE);
        for (int i = 0; i < OUT_SCHEDULE_THREAD_SIZE; i++) {
            execsOutSch.scheduleAtFixedRate(new FSQueueReader(), 0, PERIOD, TimeUnit.MILLISECONDS);
        }
    }

    public String stats() {
        StringBuffer sb = new StringBuffer();
        sb.append("******** Thread Pool IN ********").append("\r\n");
        sb.append(" isShutdown: ").append(execsIn.isShutdown()).append("\r\n");
        sb.append(" Core_Pool_Size: ").append(execsIn.getCorePoolSize()).append("\r\n");
        sb.append(" Maximum_Pool_Size: ").append(execsIn.getMaximumPoolSize()).append("\r\n");
        sb.append(" KeepAlive_Time: ").append(execsIn.getKeepAliveTime(TimeUnit.SECONDS)).append("\r\n");
        sb.append("\r\n");
        sb.append(" Active_count: ").append(execsIn.getActiveCount()).append("\r\n");
        sb.append(" Pool_Size: ").append(execsIn.getPoolSize()).append("\r\n");
        sb.append(" Largest_Pool_Size: ").append(execsIn.getLargestPoolSize()).append("\r\n");
        sb.append("\r\n");
        sb.append(" Task_Queue_Size: ").append(execsIn.getQueue().size()).append("\r\n");
        sb.append(" Completed_Task_count: ").append(execsIn.getCompletedTaskCount()).append("\r\n");
        sb.append(" Task_Count: ").append(execsIn.getTaskCount()).append("\r\n");
        sb.append("\r\n");
        sb.append("******** Thread Pool OUT ********").append("\r\n");
        sb.append(" isShutdown: ").append(execsOut.isShutdown()).append("\r\n");
        sb.append(" Core_Pool_Size: ").append(execsOut.getCorePoolSize()).append("\r\n");
        sb.append(" Maximum_Pool_Size: ").append(execsOut.getMaximumPoolSize()).append("\r\n");
        sb.append(" KeepAlive_Time: ").append(execsOut.getKeepAliveTime(TimeUnit.SECONDS)).append("\r\n");
        sb.append("\r\n");
        sb.append(" Active_count: ").append(execsOut.getActiveCount()).append("\r\n");
        sb.append(" Pool_Size: ").append(execsOut.getPoolSize()).append("\r\n");
        sb.append(" Largest_Pool_Size: ").append(execsOut.getLargestPoolSize()).append("\r\n");
        sb.append("\r\n");
        sb.append(" Task_Queue_Size: ").append(execsOut.getQueue().size()).append("\r\n");
        sb.append(" Completed_Task_count: ").append(execsOut.getCompletedTaskCount()).append("\r\n");
        sb.append(" Task_Count: ").append(execsOut.getTaskCount()).append("\r\n");
        sb.append("\r\n");
        sb.append("******** Thread Pool OUT OF SCHEDULE ********").append("\r\n");
        sb.append(" isShutdown: ").append(execsOutSch.isShutdown()).append("\r\n");
        sb.append(" Interval: ").append(PERIOD).append("ms\r\n");
        sb.append(" Core_Pool_Size: ").append(execsOutSch.getCorePoolSize()).append("\r\n");
        sb.append(" Maximum_Pool_Size: ").append(execsOutSch.getMaximumPoolSize()).append("\r\n");
        sb.append(" KeepAlive_Time: ").append(execsOutSch.getKeepAliveTime(TimeUnit.SECONDS)).append("\r\n");
        sb.append("\r\n");
        sb.append(" Active_count: ").append(execsOutSch.getActiveCount()).append("\r\n");
        sb.append(" Pool_Size: ").append(execsOutSch.getPoolSize()).append("\r\n");
        sb.append(" Largest_Pool_Size: ").append(execsOutSch.getLargestPoolSize()).append("\r\n");
        sb.append("\r\n");
        sb.append(" Task_Queue_Size: ").append(execsOutSch.getQueue().size()).append("\r\n");
        sb.append(" Completed_Task_count: ").append(execsOutSch.getCompletedTaskCount()).append("\r\n");
        sb.append(" Task_Count: ").append(execsOutSch.getTaskCount()).append("\r\n");
        return sb.toString();
    }

}
