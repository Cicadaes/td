--liquibase formatted sql

--changeset ran.li:1502879309000-1
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
		'LanguageSign',
		'隐藏语言标志',
		'LanguageSign',
		'wreport',
		'wreport',
		'wreport',
		NULL,
		NULL,
		NULL
	);
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (NULL, (select id from TD_DIC where dic_key='LanguageSign'), '0', '0', '0', 'wreport', 'wreport', NULL, NULL, NULL);
