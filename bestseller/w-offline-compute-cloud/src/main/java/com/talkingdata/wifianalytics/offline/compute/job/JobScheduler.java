package com.talkingdata.wifianalytics.offline.compute.job;

import com.talkingdata.wifianalytics.offline.compute.job.task.Task;
import com.talkingdata.wifianalytics.offline.compute.job.task.TaskScheduler;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import org.apache.log4j.Logger;
/**
 * Created by loong on 4/26/16.
 */
public class JobScheduler implements Job {

    private static TaskScheduler taskScheduler = new TaskScheduler();
    private static Logger logger = Logger.getLogger(JobScheduler.class);
    @Override
    public void run(JobParameter jobParameter) {
    	logger.info("***JobScheduler Job begin, parameters : " + jobParameter.toString());
        ThreadPoolExecutor executorService = (ThreadPoolExecutor) Executors
                .newCachedThreadPool();
        executorService.setCorePoolSize(6);
        List<Task> tasks = taskScheduler.createTaskList(jobParameter.getJobName(),
                jobParameter.getTenantId(), jobParameter.getProjectId(), jobParameter.getPlaceId(),jobParameter.getRoomId(),
                jobParameter.getSensorId(), jobParameter.getDate(), jobParameter.getDateInterval());
        for (Task task : tasks) {
//        	task.run(); 调试错误重要地方
            executorService.submit(task);
        }
        executorService.shutdown();
    }
}
