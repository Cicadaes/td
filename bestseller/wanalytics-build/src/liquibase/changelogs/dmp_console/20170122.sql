--liquibase formatted sql

--changeset junmin.li:1485069074313-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'room.stay.user.minutes', '15', '房间默认停留15分钟', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-01-22 15:09:52', '2017-01-22 15:09:52', '0');
