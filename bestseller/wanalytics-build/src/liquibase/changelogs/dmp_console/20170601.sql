--liquibase formatted sql

--changeset junmin.li:1496283749761-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'redis.sentinels', '172.23.5.151:26379', 'redis列表', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-06-01 15:09:52', '2017-06-01 15:09:52', '0');
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'redis.master', 'mymaster', 'master 名称', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-06-01 15:09:52', '2017-06-01 15:09:52', '0');

--changeset ran.li:1496296992000-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'mail.smtp.from', 'dmpplus_admin@tendcloud.com', 'smtp认证用户名', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-06-01 14:00:00', '2017-06-01 14:00:00', '0');
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'mail.smtp.password', 'W3@talkingdata', 'smtp认证密码', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-06-01 14:00:00', '2017-06-01 14:00:00', '0');
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'mail.smtp.host', 'smtp.office365.com', 'smtp发送邮件服务器地址', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-06-01 14:00:00', '2017-06-01 14:00:00', '0');
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'mail.smtp.port', '587', 'smtp发送邮件服务器端口', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-06-01 14:00:00', '2017-06-01 14:00:00', '0');
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'mail.smtp.auth', 'true', 'smtp是否身份验证', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-06-01 14:00:00', '2017-06-01 14:00:00', '0');
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'mail.smtp.starttls.enable', 'true', 'smtp是否需要STARTTLS验证', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-06-01 14:00:00', '2017-06-01 14:00:00', '0');
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'mail.name', 'wanalytics.mail', '邮件显示地址', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-06-01 14:00:00', '2017-06-01 14:00:00', '0');
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'mail.transport', 'smtp', '邮件认证模式', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-06-01 14:00:00', '2017-06-01 14:00:00', '0');
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'mail.default.recipients', 'weiguang.liu@tendcloud.com,yunlong.wang@tendcloud.com,junmin.li@tendcloud.com,ran.li@tendcloud.com', '邮件默认发送地址', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-06-01 14:00:00', '2017-06-01 14:00:00', '0');

