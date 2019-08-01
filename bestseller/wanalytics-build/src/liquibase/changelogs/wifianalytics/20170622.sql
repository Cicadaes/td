--liquibase formatted sql

--changeset yanghao:123456789
INSERT INTO `TD_AZKABAN_JOB_CONFIG` (`id`, `project_name`, `project_desc`, `job_file_path`, `flow_name`, `schedule_time`, `schedule_date`, `is_recurring`, `recurring_period`, `status`) VALUES (null, 'ReadMacTask', 'mac数据月度更新任务工具', '/home/hadoop/wanalytics/etl/bin/job/ReadMacTask.job', 'ReadMacTask', '00,00,am,CST', '01/01/2017', 'on', '1M', '1');
