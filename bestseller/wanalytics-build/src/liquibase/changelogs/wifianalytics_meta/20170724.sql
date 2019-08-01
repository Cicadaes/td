--liquibase formatted sql

--changeset junmin.li:1500864777330-1
INSERT INTO `TD_CUBE` (`id`, `name`, `owner`, `description`, `fact_table_id`, `domain_id`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('99', 'project_custom_group_cube', NULL, 'project_custom_group_cube', '98', '1', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:11', '2017-07-24 10:53:11');
INSERT INTO `TD_METRIC` (`id`, `cube_id`, `name`, `type`, `column_id`, `compute_by`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('98', '99', 'project_custom_group_cube', '1', '483', 'bitmap', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:13', '2017-07-24 10:53:13');
INSERT INTO `TD_FACT_TABLE` (`id`, `name`, `version`, `domain_id`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('98', 'project_custom_group_cube', '1', '1', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:11', '2017-07-24 10:53:11');
INSERT INTO `TD_DIMENSION` (`id`, `cube_id`, `name`, `default_value`, `display_name`, `column_id`, `type`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('409', '99', 'project_id', 'project_id', NULL, '480', '0', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:12', '2017-07-24 10:53:12');
INSERT INTO `TD_DIMENSION` (`id`, `cube_id`, `name`, `default_value`, `display_name`, `column_id`, `type`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('410', '99', 'custom_crowd_id', 'custom_crowd_id', NULL, '481', '0', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:12', '2017-07-24 10:53:12');
INSERT INTO `TD_DIMENSION` (`id`, `cube_id`, `name`, `default_value`, `display_name`, `column_id`, `type`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('411', '99', 'custom_crowd_name', 'custom_crowd_name', NULL, '482', '0', NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:13', '2017-07-24 10:53:13');
INSERT INTO `TD_COLUMN` (`id`, `name`, `type`, `fact_id`, `not_null`, `length`, `another_name`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('480', 'project_id', 'int', '98', 0, '10', NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:11', '2017-07-24 10:53:11');
INSERT INTO `TD_COLUMN` (`id`, `name`, `type`, `fact_id`, `not_null`, `length`, `another_name`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('481', 'custom_crowd_id', 'int', '98', 0, '10', NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:12', '2017-07-24 10:53:12');
INSERT INTO `TD_COLUMN` (`id`, `name`, `type`, `fact_id`, `not_null`, `length`, `another_name`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('482', 'custom_crowd_name', 'varchar', '98', 0, '100', NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:12', '2017-07-24 10:53:12');
INSERT INTO `TD_COLUMN` (`id`, `name`, `type`, `fact_id`, `not_null`, `length`, `another_name`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES ('483', 'offset', 'int', '98', 0, '10', NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-07-24 10:53:13', '2017-07-24 10:53:13');





