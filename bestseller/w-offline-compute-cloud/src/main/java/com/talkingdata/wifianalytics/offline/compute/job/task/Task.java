package com.talkingdata.wifianalytics.offline.compute.job.task;

/**
 * Created by loong on 4/26/16.
 */
public interface Task extends Runnable {

    enum TaskName {
        OFFLINE_NEW_USER_TASK("offline_new_user_task"),
        OFFLINE_ACTIVE_USER_TASK("offline_active_user_task"),
        OFFLINE_ACTIVE_USER_HOUR_TASK("offline_active_user_hour_task"),
        OFFLINE_NEW_USER_SENSOR_TASK("offline_new_user_sensor_task"),
        OFFLINE_OLD_USER_TASK("offline_old_user_task"),
        OFFLINE_OLD_USER_SENSOR_TASK("offline_old_user_sensor_task"),
        OFFLINE_STAY_USER_DAY_TASK("offline_stay_user_day_task"),
        OFFLINE_ACTIVE_USER_SENSOR_HOUR_TASK("offline_active_user_sensor_hour_task"),
        OFFLINE_STAY_OLD_USER_DAY_TASK("offline_stay_old_user_day_task"),
        OFFLINE_STAY_NEW_USER_DAY_TASK("offline_stay_new_user_day_task"),
        ALL("all");

        TaskName(String name) {
            this.name = name;
        }

        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public static boolean contains(String name) {
            try {
                valueOf(name.toUpperCase());
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
            return true;
        }
    }

    enum TaskType {
        DAILY,
        HOUR,
        SENSOR,
        DAILY_ROOM
    }

}
