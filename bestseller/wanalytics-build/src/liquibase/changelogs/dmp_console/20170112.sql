--liquibase formatted sql

--changeset junmin.li:1484192111437-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'filter.mac.config', '{\"totalDays\" : \"10\",\"occurenceNumber\": \"7\"}', '过滤黑名单全局配置', 'wreport', 'WifiAnalytics', 'WifiAnalytics', NULL, '2017-01-09 11:02:26', '2017-01-09 13:11:55', 0);
--rollback delete from TD_PARAM where param_key='filter.mac.config' and system_code='wreport';