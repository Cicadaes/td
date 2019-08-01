--liquibase formatted sql

--changeset junmin.li:1497351795269-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'mac.predict.url', 'http://172.23.5.109:9000/api', 'Mac非设备识别算法url', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-06-13 15:09:52', '2017-06-13 15:09:52', '0');

