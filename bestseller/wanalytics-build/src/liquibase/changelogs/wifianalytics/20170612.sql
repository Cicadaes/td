--liquibase formatted sql

--changeset junmin.li:1497232036614-1
INSERT INTO `TD_AZKABAN_JOB_CONFIG` (`id`, `project_name`, `project_desc`, `job_file_path`, `flow_name`, `schedule_time`, `schedule_date`, `is_recurring`, `recurring_period`, `status`)
VALUES
    (null, 'RerunTask', '补数工具，清理指标数据，清理临时表数据', '/home/hadoop/wanalytics/etl/bin/job/RerunTask.job', 'RerunTask', '00,00,am,CST', '01/01/2017', '', '', '1'),
    (null, 'SendCollectorDataTask', '补数工具，发送Collector日志到Collector上', '/home/hadoop/wanalytics/etl/bin/job/SendCollectorDataTask.job', 'SendCollectorDataTask', '00,00,am,CST', '01/01/2017', '', '', '1')