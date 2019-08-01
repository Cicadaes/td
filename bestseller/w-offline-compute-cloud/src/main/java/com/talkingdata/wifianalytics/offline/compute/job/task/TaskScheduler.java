package com.talkingdata.wifianalytics.offline.compute.job.task;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by loong on 4/26/16.
 */
public class TaskScheduler {

    public List<Task> createTaskList(String jobName, String tenantId, int projectId,
                                     int placeId,int roomId, int sensorId, String date, int dataInterval) {
        List<Task> tasks = new ArrayList<Task>();
        for (String job : jobName.split(",")) {
            switch (Task.TaskName.valueOf(job.toUpperCase())) {
                case ALL:
//                    tasks.add(new OffLineNewUserTask(tenantId, projectId, date, dataInterval));
//                    tasks.add(new OffLineOldUserTask(tenantId, projectId, date, dataInterval));
//                    tasks.add(new OffLineActiveUserTask(tenantId, projectId, date, dataInterval));
//                    tasks.add(new OffLineS   ++++tayUserTask(tenantId, projectId, date, dataInterval));
//                    tasks.add(new OffLineStayOldUserTask(tenantId, projectId, date, dataInterval));
//                    tasks.add(new OffLineStayNewUserTask(tenantId, projectId, date, dataInterval));
                    tasks.add(new OffLineNewUserSensorTask(tenantId, projectId, placeId, sensorId, date, dataInterval));
                    tasks.add(new OffLineOldUserSensorTask(tenantId, projectId, placeId, sensorId, date, dataInterval));
                    tasks.add(new OffLineActiveUserSensorHourTask(tenantId, projectId, placeId, sensorId, date, dataInterval));
                    tasks.add(new OffLineActiveUserHourTask(tenantId, projectId, date, dataInterval));
                    break;
            }
        }

        return tasks;
    }
    
    public static void main(String[] args) {
    	OffLineStayUserTask offlineTask = new OffLineStayUserTask("2000247", 8, 13,2,"2016-08-05", 30);
			offlineTask.run();
//    	OffLineEnterUserRoomTask offlineTask = new OffLineEnterUserRoomTask("2000247", 39, 44, -100, "2016-07-27", 31);
//			offlineTask.run();
			
	}
}
