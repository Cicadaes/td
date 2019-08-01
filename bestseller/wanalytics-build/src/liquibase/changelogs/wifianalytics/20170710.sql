--liquibase formatted sql

--changeset ran.li:1499681542000-1
DELETE FROM `TD_CUSTOM_LABEL_NAME` WHERE `status` = 0;

--changeset ran.li:1499681542000-2
INSERT INTO `TD_CUSTOM_LABEL_NAME` (`id`, `label`, `name`, `project_id`, `tenant_id`, `version`, `status`, `type`, `create_by`, `creator`, `create_time`, `update_by`, `updater`, `update_time`)
VALUES
	(NULL, 'title_top10_flow', 'Top10店铺(组)客流量', NULL, NULL, NULL, '0', NULL, 'init', 'init', '2017-04-20 17:14:13', NULL, NULL, '2017-04-20 17:14:13'),
	(NULL, 'tab_active_passenger_flow', '进店客流', NULL, NULL, NULL, '0', NULL, 'init', 'init', '2017-04-20 17:24:03', NULL, NULL, '2017-04-20 17:24:03'),
	(NULL, 'title_top10_store_index', 'TOP10店铺排名', NULL, NULL, NULL, '0', NULL, 'init', 'init', '2017-04-20 17:25:17', NULL, NULL, '2017-04-20 17:25:17');

--changeset ran.li:1499681542000-3
UPDATE `TD_CUSTOM_LABEL_NAME` SET `label`='title_top10_flow' WHERE `label`='Top10Title';
UPDATE `TD_CUSTOM_LABEL_NAME` SET `label`='tab_active_passenger_flow' WHERE `label`='TOP10RoomPassengerFlowEnterCount';
UPDATE `TD_CUSTOM_LABEL_NAME` SET `label`='title_top10_store_index' WHERE `label`='CompeteOverview2';

--changeset ran.li:1499681542000-4
DELETE FROM `TD_CUSTOM_LABEL_NAME` WHERE `label` IN ('IncomingPassengerFlow', 'PassengerTrendChartTitle_03');