--liquibase formatted sql

--changeset yinglei.li:1509005459121-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'project.opening.time', '00:00', '营业开始时间', 'wreport', 'WifiAnalytics', 'WifiAnalytics', NULL, '2017-10-26 16:08:41', '2017-10-26 16:08:41', '0');
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'project.closing.time', '23:00', '营业结束时间', 'wreport', 'WifiAnalytics', 'WifiAnalytics', NULL, '2017-10-26 16:08:41', '2017-10-26 16:08:41', '0');

