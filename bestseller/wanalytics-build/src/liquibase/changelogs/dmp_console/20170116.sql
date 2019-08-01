--liquibase formatted sql

--changeset junmin.li:1484533221758-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'share.attachment.path', '/attachment/wifianalytics', '附件共享目录', 'wreport', 'WifiAnalytics', 'WifiAnalytics', NULL, '2016-12-21 09:56:32', '2016-12-21 09:56:32', '0');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where `name` = 'ProjectType'), '6', '连锁', '0', 'wreport', 'wreport', NULL, '2016-10-24 20:49:28', '2016-10-24 20:49:28');
