--liquibase formatted sql

--changeset yunlong.wang:1482828862110-1
INSERT INTO `TD_DIC` (`id`, `name`, `description`, `dic_key`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, 'ProjectType', '项目类型', 'ProjectType', 'wreport', 'wreport', 'wreport', NULL, '2016-5-19 11:11:24', '2016-5-19 11:11:24');
INSERT INTO `TD_DIC` (`id`, `name`, `description`, `dic_key`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, 'ProjectCity', '项目所在城市', 'ProjectCity', 'wreport', 'wreport', 'wreport', NULL, '2016-6-3 18:36:03', '2016-6-3 18:36:03');
INSERT INTO `TD_DIC` (`id`, `name`, `description`, `dic_key`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, 'MagnifyingRate', '放大倍率', 'MagnifyingRate', 'wreport', 'wreport', 'wreport', NULL, '2016-9-28 10:28:13', '2016-9-28 10:28:13');
INSERT INTO `TD_DIC` (`id`, `name`, `description`, `dic_key`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, 'RoomBrand', '房间品牌', 'RoomBrand', 'wreport', 'execestate@163.com', 'execestate@163.com', NULL, '2016-11-10 16:05:39', '2016-11-10 16:05:39');
INSERT INTO `TD_DIC` (`id`, `name`, `description`, `dic_key`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, 'StayTime', '到访天数区间', 'StayTime', 'wreport', 'wreport', 'wreport', NULL, '2016-10-24 20:45:46', '2016-10-24 20:45:46');
INSERT INTO `TD_DIC` (`id`, `name`, `description`, `dic_key`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, 'StayMinutes', '单店停留阈值', 'StayMinutes', 'wreport', 'wreport', 'wreport', NULL, '2016-11-14 14:58:30', '2016-11-14 14:58:30');
INSERT INTO `TD_DIC` (`id`, `name`, `description`, `dic_key`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, 'ActiveUserVisitMinutes', '项目到访有效时间', 'ActiveUserVisitMinutes', 'wreport', 'wreport', 'wreport', NULL, '2016-11-15 21:14:54', '2016-11-15 21:14:54');
INSERT INTO `TD_DIC` (`id`, `name`, `description`, `dic_key`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, 'ProjectStayUserMinutes', '项目停留有效时间', 'ProjectStayUserMinutes', 'wreport', 'wreport', 'wreport', NULL, '2016-11-15 21:15:25', '2016-11-15 21:15:25');
INSERT INTO `TD_DIC` (`id`, `name`, `description`, `dic_key`, `system_code`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, 'ProjectTimeoutMinutes', '停留超时时间间隔', 'ProjectTimeoutMinutes', 'wreport', 'wreport', 'wreport', NULL, '2016-11-15 21:14:54', '2016-11-15 21:14:54');

INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectType'), '1', '营销案场', 0, 'wreport', 'wreport', NULL, '2016-5-19 11:12:05', '2016-5-19 11:12:05');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectType'), '2', '商业运营', 0, 'wreport', 'wreport', NULL, '2016-5-19 11:11:49', '2016-5-19 11:11:49');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectType'), '3', '项目前策', 0, 'wreport', 'wreport', '', '2016-8-26 11:50:42', '2016-8-26 11:50:42');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectType'), '4', '其他', 0, 'wreport', 'wreport', NULL, '2016-8-29 10:07:33', '2016-8-29 10:07:33');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectCity'), '深圳市', '深圳市', 0, 'wreport', 'wreport', NULL, '2016-6-3 18:39:17', '2016-6-3 18:39:17');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectCity'), '青岛市', '青岛市', 0, 'wreport', 'wreport', NULL, '2016-6-3 18:39:53', '2016-6-3 18:39:53');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectCity'), '北京市', '北京市', 0, 'wreport', 'wreport', NULL, '2016-6-3 18:41:01', '2016-6-3 18:41:01');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectCity'), '上海市', '上海市', 0, 'wreport', 'wreport', NULL, '2016-6-3 18:41:20', '2016-6-3 18:41:20');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectCity'), '广州市', '广州市', 0, 'wreport', 'wreport', NULL, '2016-6-3 18:41:37', '2016-6-3 18:41:37');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectCity'), '长沙市', '长沙市', 0, 'wreport', 'wreport', NULL, '2016-6-14 10:56:47', '2016-6-14 10:56:47');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectCity'), '杭州市', '杭州市', 0, 'wreport', 'wreport', NULL, '2016-6-14 10:56:47', '2016-6-14 10:56:47');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='MagnifyingRate'), '5', 'X5倍', 0, 'wreport', 'wreport', '', '2016-9-28 10:29:56', '2016-10-11 13:41:00');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='MagnifyingRate'), '10', 'X10倍', 0, 'wreport', 'wreport', '', '2016-8-29 10:08:04', '2016-10-11 13:41:15');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='MagnifyingRate'), '20', 'X20倍', 0, 'wreport', 'wreport', '', '2016-8-29 10:08:04', '2016-10-11 13:41:19');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='StayTime'), '1', '1,4', 0, 'wreport', 'wreport', NULL, '2016-10-24 20:46:40', '2016-11-16 16:01:45');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='StayTime'), '2', '5,15', 0, 'wreport', 'wreport', NULL, '2016-10-24 20:47:07', '2016-11-16 16:01:53');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='StayTime'), '3', '16,30', 0, 'wreport', 'wreport', NULL, '2016-10-24 20:47:53', '2016-11-16 16:02:01');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='StayTime'), '4', '31,60', 0, 'wreport', 'wreport', NULL, '2016-10-24 20:48:08', '2016-11-16 16:02:52');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='StayTime'), '5', '120,150', 0, 'wreport', 'wreport', NULL, '2016-10-24 20:48:24', '2016-10-24 20:48:24');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='StayTime'), '6', '180', 0, 'wreport', 'wreport', NULL, '2016-10-24 20:49:28', '2016-10-24 20:49:28');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='StayMinutes'), '5', '5', 0, 'wreport', 'wreport', NULL, '2016-11-14 14:59:13', '2016-11-14 14:59:13');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='StayMinutes'), '10', '10', 0, 'wreport', 'wreport', NULL, '2016-11-14 14:59:33', '2016-11-14 14:59:33');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='StayMinutes'), '15', '15', 0, 'wreport', 'wreport', NULL, '2016-11-14 14:59:45', '2016-11-14 14:59:45');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='StayMinutes'), '20', '20', 0, 'wreport', 'wreport', NULL, '2016-11-15 10:42:44', '2016-11-15 10:42:44');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='StayMinutes'), '25', '25', 0, 'wreport', 'wreport', NULL, '2016-11-15 10:43:20', '2016-11-15 10:43:20');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='StayMinutes'), '30', '30', 0, 'wreport', 'wreport', NULL, '2016-11-15 10:43:46', '2016-11-15 10:43:46');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ActiveUserVisitMinutes'), '0', '0', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ActiveUserVisitMinutes'), '1', '1', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ActiveUserVisitMinutes'), '2', '2', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ActiveUserVisitMinutes'), '3', '3', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ActiveUserVisitMinutes'), '4', '4', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ActiveUserVisitMinutes'), '5', '5', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectStayUserMinutes'), '5', '5', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectStayUserMinutes'), '10', '10', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectStayUserMinutes'), '15', '15', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectStayUserMinutes'), '20', '20', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectStayUserMinutes'), '30', '30', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectStayUserMinutes'), '35', '35', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectStayUserMinutes'), '60', '60', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectStayUserMinutes'), '90', '90', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectStayUserMinutes'), '120', '120', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectTimeoutMinutes'), '10', '10', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectTimeoutMinutes'), '20', '20', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectTimeoutMinutes'), '30', '30', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectTimeoutMinutes'), '40', '40', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectTimeoutMinutes'), '50', '50', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');
INSERT INTO `TD_DIC_ITEM` (`id`, `dic_id`, `dic_item_key`, `dic_item_value`, `parent_id`, `create_by`, `creator`, `update_by`, `create_time`, `update_time`) VALUES (null, (select id from TD_DIC where dic_key='ProjectTimeoutMinutes'), '60', '60', 0, 'wreport', 'wreport', NULL, '2016-11-15 21:15:57', '2016-11-15 21:15:57');

