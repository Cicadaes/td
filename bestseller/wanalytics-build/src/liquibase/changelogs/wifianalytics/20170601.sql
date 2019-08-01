--liquibase formatted sql

--changeset ran.li:1496301844000-1
INSERT INTO `TD_AZKABAN_JOB_CONFIG` (`id`, `project_name`, `project_desc`, `job_file_path`, `flow_name`, `schedule_time`, `schedule_date`, `is_recurring`, `recurring_period`, `status`)
VALUES
	(null, 'CustomizedTagsTask', '用户自定义标签调用接口', '/home/hadoop/wanalytics/etl/bin/job/CustomizedTagsTask.job', 'CustomizedTagsTask', '02,00,am,CST', '01/01/2017', 'on', '1d', 1)