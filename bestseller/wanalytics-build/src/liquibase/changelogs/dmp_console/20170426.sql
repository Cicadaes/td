--liquibase formatted sql

--changeset junmin.li:1493176918390-1
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'es.cluster.name', 'wifipix', 'es集群名称', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-04-26 15:09:52', '2017-04-26 15:09:52', '0');
INSERT INTO `TD_PARAM` (`id`, `param_key`, `param_value`, `description`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`, `is_password`) VALUES (null, 'es.hosts', '172.23.5.148:9300,172.23.5.149:9300,172.23.5.150:9300', 'es节点名称', 'wreport', 'WifiAnalyitcs', 'Wifianalytics', NULL, '2017-04-26 15:09:52', '2017-04-26 15:09:52', '0');

