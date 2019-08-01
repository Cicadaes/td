--liquibase formatted sql

--changeset ran.li:1501585881654-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`)
VALUES (null, 'project.permission.level', '1', '项目权限等级，0为无权限，1为um权限', 'wreport', 'WifiAnalytics', 'WifiAnalytics', NULL, '2017-07-20 15:31:33', '2017-07-20 15:31:52', '0');

