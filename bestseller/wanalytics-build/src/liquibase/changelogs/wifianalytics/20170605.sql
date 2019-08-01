--liquibase formatted sql

--changeset ran.li:1496654175000-1
INSERT INTO `TD_AZKABAN_JOB_CONFIG` (`id`, `project_name`, `project_desc`, `job_file_path`, `flow_name`, `schedule_time`, `schedule_date`, `is_recurring`, `recurring_period`, `status`)
VALUES
	(null, 'PostTenantLogTask', '根据接收配置发送租户日志', '/home/hadoop/wanalytics/etl/bin/job/PostTenantLogTask.job', 'PostTenantLogTask', '00,00,am,CST', '01/01/2017', '', '', 1),
	(null, 'PostAllLogTask', '根据接收配置发送所有日志', '/home/hadoop/wanalytics/etl/bin/job/PostAllLogTask.job', 'PostAllLogTask', '00,00,am,CST', '01/01/2017', '', '', 1)