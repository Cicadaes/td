--liquibase formatted sql

--changeset junmin.li:1500535517654-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'submit.sensor.log.time', '5', '提交探针日志时间,单位为秒', 'wreport', 'WifiAnalytics', 'WifiAnalytics', NULL, '2017-07-20 15:31:33', '2017-07-20 15:31:52', '0');
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'sensor.log.ttl', '60', '探针日志在redis时间，单位为秒', 'wreport', 'WifAnalytics', 'WifAnalytics', NULL, '2017-07-20 15:33:08', '2017-07-20 15:33:08', '0');

