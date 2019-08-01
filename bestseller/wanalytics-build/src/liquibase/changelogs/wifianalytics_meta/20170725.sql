--liquibase formatted sql

--changeset yunlong.wang:1500979743330-1
INSERT INTO `TD_CUBE` (`id`, `name`, `owner`, `description`, `fact_table_id`, `domain_id`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('100', 'offline_stay_user_project_tracks_counter', NULL, 'offline_stay_user_project_tracks_counter', '99', '2', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:11', '2017-07-24 10:53:11');
INSERT INTO `TD_METRIC` (`id`, `cube_id`, `name`, `type`, `column_id`, `compute_by`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('99', '100', 'offline_stay_user_project_tracks_counter', '1', '489', 'counter', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:13', '2017-07-24 10:53:13');
INSERT INTO `TD_FACT_TABLE` (`id`, `name`, `version`, `domain_id`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('99', 'offline_stay_user_project_tracks_counter', '1', '2', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:11', '2017-07-24 10:53:11');
INSERT INTO `TD_DIMENSION` (`id`, `cube_id`, `name`, `default_value`, `display_name`, `column_id`, `type`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('412', '100', 'analysiss_id', 'analysiss_id', NULL, '484', '0', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:12', '2017-07-24 10:53:12');
INSERT INTO `TD_DIMENSION` (`id`, `cube_id`, `name`, `default_value`, `display_name`, `column_id`, `type`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('413', '100', 'tenant_id', 'tenant_id', NULL, '485', '0', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:12', '2017-07-24 10:53:12');
INSERT INTO `TD_DIMENSION` (`id`, `cube_id`, `name`, `default_value`, `display_name`, `column_id`, `type`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('414', '100', 'up_project_id', 'up_project_id', NULL, '486', '0', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:13', '2017-07-24 10:53:13');
INSERT INTO `TD_DIMENSION` (`id`, `cube_id`, `name`, `default_value`, `display_name`, `column_id`, `type`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('415', '100', 'down_project_id', 'down_project_id', NULL, '487', '0', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:13', '2017-07-24 10:53:13');
INSERT INTO `TD_DIMENSION` (`id`, `cube_id`, `name`, `default_value`, `display_name`, `column_id`, `type`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('416', '100', 'date', 'date', NULL, '488', '0', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:13', '2017-07-24 10:53:13');
INSERT INTO `TD_DIMENSION` (`id`, `cube_id`, `name`, `default_value`, `display_name`, `column_id`, `type`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('417', '100', 'metric_value', 'metric_value', NULL, '489', '0', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:13', '2017-07-24 10:53:13');
INSERT INTO `TD_COLUMN` (`id`, `name`, `type`, `fact_id`, `not_null`, `length`, `another_name`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('484', 'analysiss_id', 'int', '99', 0, '10', NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:11', '2017-07-24 10:53:11');
INSERT INTO `TD_COLUMN` (`id`, `name`, `type`, `fact_id`, `not_null`, `length`, `another_name`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('485', 'tenant_id', 'int', '99', 0, '10', NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:12', '2017-07-24 10:53:12');
INSERT INTO `TD_COLUMN` (`id`, `name`, `type`, `fact_id`, `not_null`, `length`, `another_name`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('486', 'up_project_id', 'int', '99', 0, '100', NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:12', '2017-07-24 10:53:12');
INSERT INTO `TD_COLUMN` (`id`, `name`, `type`, `fact_id`, `not_null`, `length`, `another_name`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('487', 'down_project_id', 'int', '99', 0, '10', NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:13', '2017-07-24 10:53:13');
INSERT INTO `TD_COLUMN` (`id`, `name`, `type`, `fact_id`, `not_null`, `length`, `another_name`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('488', 'date', 'varchar', '99', 0, '32', NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:12', '2017-07-24 10:53:12');
INSERT INTO `TD_COLUMN` (`id`, `name`, `type`, `fact_id`, `not_null`, `length`, `another_name`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('489', 'metric_value', 'int', '99', 0, '10', NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:13', '2017-07-24 10:53:13');





