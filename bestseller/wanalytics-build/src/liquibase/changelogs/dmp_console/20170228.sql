--liquibase formatted sql

--changeset ran.li:1488284021000-1
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectType'), '10', '集团级', 0, 'wreport', 'wreport', NULL, null, null);
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectType'), '11', '其他', 0, 'wreport', 'wreport', NULL, null, null);
