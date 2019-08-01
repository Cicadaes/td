--liquibase formatted sql

--changeset junmin.li:1497351083521-1
INSERT INTO `TD_AZKABAN_JOB_CONFIG` (`id`, `project_name`, `project_desc`, `job_file_path`, `flow_name`, `schedule_time`, `schedule_date`, `is_recurring`, `recurring_period`, `status`) VALUES   (null, 'MacPredictTask', '非移动设备Mac识别任务', '/home/hadoop/wanalytics/etl/bin/job/MacPredictTask.job', 'MacPredictTask', '03,30,am,CST', '01/01/2017', 'on', '1d', '1');

