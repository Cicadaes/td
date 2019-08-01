--liquibase formatted sql

--changeset kai.zhang:1503295586991-1
DELETE FROM `TD_PARAM` WHERE  param_key = 'city_center_point';
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'city_center_point', '/attachment/wifianalytics/city.json', '', 'wreport', 'WiFiAnalytics', 'WiFiAnalytics', NULL, '2017-9-30 11:02:21', '2017-9-30 11:02:21', NULL);
