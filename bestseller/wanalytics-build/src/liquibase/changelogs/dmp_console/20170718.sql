--liquibase formatted sql

--changeset hao.yang:1500375021386-1
INSERT INTO `TD_DIC` (
	`id`,
	`name`,
	`description`,
	`dic_key`,
	`system_code`,
	`create_by`,
	`creator`,
	`update_by`,
	`create_time`,
	`update_time`
)
VALUES
	(
		NULL,
		'SensorType',
		'探针类型',
		'SensorType',
		'wreport',
		'wreport',
		'wreport',
		NULL,
		'2017-05-19 11:11:24',
		'2017-05-19 11:11:24'
	);

INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (NULL, (select id from TD_DIC where dic_key='SensorType'), '1', 'wifi探针', '0', 'wreport', 'wreport', NULL, '2017-04-22 14:35:30', '2017-04-22 14:35:30');

INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (NULL, (select id from TD_DIC where dic_key='SensorType'), '2', '3G/4G探针', '0', 'wreport', 'wreport', NULL, '2017-04-22 14:35:30', '2017-04-22 14:35:30');
