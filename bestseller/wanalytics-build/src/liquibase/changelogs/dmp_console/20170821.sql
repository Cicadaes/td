--liquibase formatted sql

--changeset junmin.li:1503295586991-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'batchmanager.server.passwd.encode', 'Y', '调用azkaban密码是否加密', 'wreport', 'WifiAnalytics', 'WifiAnalytics', NULL, '2017-08-21 14:10:41', '2017-08-21 14:10:41', '0');

