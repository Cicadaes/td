--liquibase formatted sql

--changeset ran.li:1492680008000-1
INSERT INTO `TD_CUSTOM_LABEL_NAME` (`id`, `label`, `name`, `project_id`, `tenant_id`, `version`, `status`, `type`, `create_by`, `creator`, `create_time`, `update_by`, `updater`, `update_time`)
VALUES
	(1, 'Top10Title', 'Top10店铺(组)客流量', NULL, NULL, NULL, '0', NULL, 'init', 'init', '2017-04-20 17:14:13', NULL, NULL, '2017-04-20 17:14:13'),
	(2, 'IncomingPassengerFlow', '店前客流', NULL, NULL, NULL, '0', NULL, 'init', 'init', '2017-04-20 17:15:28', NULL, NULL, '2017-04-20 17:15:28'),
	(3, 'TOP10RoomPassengerFlowEnterCount', '进店客流', NULL, NULL, NULL, '0', NULL, 'init', 'init', '2017-04-20 17:24:03', NULL, NULL, '2017-04-20 17:24:03'),
	(4, 'PassengerTrendChartTitle_03', '进店率', NULL, NULL, NULL, '0', NULL, 'init', 'init', '2017-04-20 17:24:26', NULL, NULL, '2017-04-20 17:24:26'),
	(5, 'CompeteOverview2', 'TOP10店铺排名', NULL, NULL, NULL, '0', NULL, 'init', 'init', '2017-04-20 17:25:17', NULL, NULL, '2017-04-20 17:25:17');