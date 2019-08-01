--liquibase formatted sql

--changeset ran.li:1491984898000-1
DELETE FROM `TD_DIC_ITEM` WHERE `dic_id` IN (SELECT id FROM TD_DIC WHERE dic_key='ProjectType');

--changeset ran.li:1491984898000-2
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectType'), '1', '店组类型项目', 0, 'wreport', 'wreport', NULL, null, null);
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectType'), '2', '店铺类型项目', 0, 'wreport', 'wreport', NULL, null, null);
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectType'), '-1', '竞品类型项目', 0, 'wreport', 'wreport', NULL, null, null);