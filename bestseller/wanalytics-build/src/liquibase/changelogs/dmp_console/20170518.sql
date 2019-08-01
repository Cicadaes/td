--liquibase formatted sql

--changeset ran.li:1495089010000-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'download.template.file', '/Users/Yan/Downloads/template.xlsx', '数据下载模板', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-05-18 15:09:52', '2017-05-18 15:09:52', '0');
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'download.folder', '/tmp', '数据下载存放路径', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-05-18 15:09:52', '2017-05-18 15:09:52', '0');

