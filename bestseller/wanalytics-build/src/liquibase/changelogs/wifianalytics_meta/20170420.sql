--liquibase formatted sql

--changeset ran.li:1492686363000-1
INSERT INTO `wifianalytics_meta`.`TD_METRIC` (`id`, `cube_id`, `name`, `type`, `column_id`, `compute_by`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`)
VALUES
	(93, 94, 'atomic_cube', 1, 462, 'bitmap', NULL, NULL, 'tools', 'tools', 'tools', '2017-04-20 18:55:21', '2017-04-20 18:55:21');

INSERT INTO `wifianalytics_meta`.`TD_FACT_TABLE` (`id`, `name`, `version`, `domain_id`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`)
VALUES
	(93, 'atomic_cube', '1', 1, NULL, NULL, 'tools', 'tools', 'tools', '2017-04-20 18:55:19', '2017-04-20 18:55:19');

INSERT INTO `wifianalytics_meta`.`TD_DIMENSION` (`id`, `cube_id`, `name`, `default_value`, `display_name`, `column_id`, `type`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`)
VALUES
	(395, 94, 'tag_value', 'tag_value', NULL, 461, 0, NULL, NULL, 'tools', 'tools', 'tools', '2017-04-20 18:55:20', '2017-04-20 18:55:20'),
	(394, 94, 'tag_code', 'tag_code', NULL, 460, 0, NULL, NULL, 'tools', 'tools', 'tools', '2017-04-20 18:55:20', '2017-04-20 18:55:20'),
	(393, 94, 'tenant_id', 'tenant_id', NULL, 459, 0, NULL, NULL, 'tools', 'tools', 'tools', '2017-04-20 18:55:19', '2017-04-20 18:55:19');

INSERT INTO `TD_CUBE` (`id`, `name`, `owner`, `description`, `fact_table_id`, `domain_id`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`)
VALUES
	(94, 'atomic_cube', NULL, 'atomic_cube', 93, 1, NULL, NULL, 'tools', 'tools', 'tools', '2017-04-20 18:55:19', '2017-04-20 18:55:19');

INSERT INTO `wifianalytics_meta`.`TD_COLUMN` (`id`, `name`, `type`, `fact_id`, `not_null`, `length`, `another_name`, `data_app_id`, `tenant_id`, `creator`, `create_by`, `update_by`, `create_time`, `update_time`)
VALUES
	(462, 'offset', 'int', 93, 0, 10, NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-04-20 18:55:20', '2017-04-20 18:55:20'),
	(461, 'tag_value', 'varchar', 93, 0, 255, NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-04-20 18:55:20', '2017-04-20 18:55:20'),
	(460, 'tag_code', 'varchar', 93, 0, 255, NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-04-20 18:55:20', '2017-04-20 18:55:20'),
	(459, 'tenant_id', 'varchar', 93, 0, 64, NULL, NULL, NULL, 'tools', 'tools', 'tools', '2017-04-20 18:55:19', '2017-04-20 18:55:19');
