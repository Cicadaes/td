--liquibase formatted sql

--changeset junmin.li:1497842850097-1
INSERT INTO `TD_AZKABAN_JOB_CONFIG` (`id`, `project_name`, `project_desc`, `job_file_path`, `flow_name`, `schedule_time`, `schedule_date`, `is_recurring`, `recurring_period`, `status`) VALUES (null, 'SyncBlackListMacToRedis', '每小时同步黑名单到redis中，实时过滤黑名单用户', '/home/hadoop/wanalytics/etl/bin/job/SyncBlackListMacToRedis.job', 'SyncBlackListMacToRedis', '00,00,am,CST', '01/01/2017', 'on', '1h', '1');
