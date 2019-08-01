--liquibase formatted sql

--changeset ran.li:11492694477000-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'project.theme', 'green', '默认主题为清新绿', 'wreport', 'WifiAnalytics', 'WifiAnalytics', NULL, '2017-04-20 21:20:29', '2017-04-20 21:21:09', 0);
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'project.max.duration', '90', '过滤用户停留时间超过90分钟的用户,不包含90分钟，放到黑名单中', 'wreport', 'WifiAnalytics', 'WifiAnalytics', NULL, '2017-03-21 16:11:26', '2017-03-21 16:11:26', 0);