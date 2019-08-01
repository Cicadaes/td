package com.talkingdata.wifianalytics.offline.compute.test;

import com.talkingdata.wifianalytics.offline.compute.job.Job;
import com.talkingdata.wifianalytics.offline.compute.job.JobParameter;
import com.talkingdata.wifianalytics.offline.compute.job.JobScheduler;

/**
 * Created by loong on 4/26/16.
 */
public class Test {

    public static void main(String[] args) {
        Job jobScheduler = new JobScheduler();
        JobParameter jobParameter = new JobParameter();
        jobParameter.setDate("2016-04-25");
        jobParameter.setJobName("offline_new_user_task");
        jobParameter.setDateInterval(31);
        jobScheduler.run(jobParameter);
    }
}
