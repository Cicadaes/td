--liquibase formatted sql

--changeset yunlong.wang:1502421250000-1
INSERT INTO `TD_AZKABAN_JOB_CONFIG` (`id`, `project_name`, `project_desc`, `job_file_path`, `flow_name`, `schedule_time`, `schedule_date`, `is_recurring`, `recurring_period`, `status`)
VALUES
	(null, 'ProjectTracksTask', '计算上下游', '/home/hadoop/wanalytics/etl/bin/job/ProjectTracksTask.job', 'ProjectTracksTask', '00,00,am,CST', '01/01/2017', '', '', 1)
	
--changeset yunlong.wang:1502421250000-2
alter table  `TD_RELEVANCY_ANALYSISS` modify analysiss_project_ids varchar(512) comment '路径分析选中的项目ID,多个用逗号分割';