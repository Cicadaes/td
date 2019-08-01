--liquibase formatted sql

--changeset ran.li:1492832266000-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`)
VALUES
	(NULL, 'project.thresholdtime.unit', '60', '时间单位(秒的倍数)', 'wreport', 'WifiAnalytics', 'WifiAnalytics', NULL, '2017-04-21 16:11:26', '2017-04-21 16:11:26', 0),
	(NULL, 'project.staytimedistribution.unit', '60', '停留时间分布(单位，秒的倍数)', 'wreport', 'WifiAnalytics', 'WifiAnalytics', NULL, '2017-04-21 11:06:07', '2017-04-21 11:06:07', 0);
