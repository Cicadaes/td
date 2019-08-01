--liquibase formatted sql

--changeset ran.li:1496301844000-1
INSERT INTO `TD_AZKABAN_JOB_CONFIG` (`id`, `project_name`, `project_desc`, `job_file_path`, `flow_name`, `schedule_time`, `schedule_date`, `is_recurring`, `recurring_period`, `status`)
VALUES
	(null, 'SensorAllMacSync', '从redis同步每天用户mac到mysql中', '/home/hadoop/wanalytics/etl/bin/job/SensorAllMacSync.job', 'SensorAllMacSync', '00,00,am,CST', '01/01/2017', 'on', '10m', 1)