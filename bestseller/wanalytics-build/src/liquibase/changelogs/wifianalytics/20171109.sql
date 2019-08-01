--liquibase formatted sql

--changeset youyu.dong:1510214400570-1
ALTER TABLE TD_METRIC_DAY_REAL_TIME add  `project_num` varchar(64) DEFAULT NULL COMMENT '店铺ID或者编码';
ALTER TABLE TD_METRIC_DAY_REAL_TIME add  `logical_city` varchar(100) DEFAULT NULL COMMENT '逻辑城市';

ALTER TABLE TD_METRIC_FACT add  `project_num` varchar(64) DEFAULT NULL COMMENT '店铺ID或者编码';
ALTER TABLE TD_METRIC_FACT add  `logical_city` varchar(100) DEFAULT NULL COMMENT '逻辑城市';

ALTER TABLE TD_METRIC_HOUR_REAL_TIME add  `logical_city` varchar(100) DEFAULT NULL COMMENT '逻辑城市';

ALTER TABLE TD_METRIC_DAY_OFFLINE add  `project_num` varchar(64) DEFAULT NULL COMMENT '店铺ID或者编码';
ALTER TABLE TD_METRIC_DAY_OFFLINE add  `logical_city` varchar(100) DEFAULT NULL COMMENT '逻辑城市';

ALTER TABLE TD_METRIC_DAY_PARTY add  `project_num` varchar(64) DEFAULT NULL COMMENT '店铺ID或者编码';
ALTER TABLE TD_METRIC_DAY_PARTY add  `logical_city` varchar(100) DEFAULT NULL COMMENT '逻辑城市';

ALTER TABLE TD_METRIC_DAY_ACTIVE add  `logical_city` varchar(100) DEFAULT NULL COMMENT '逻辑城市';
ALTER TABLE TD_METRIC_WEEK_ACTIVE add  `logical_city` varchar(100) DEFAULT NULL COMMENT '逻辑城市';
ALTER TABLE TD_METRIC_MONTH_ACTIVE add  `logical_city` varchar(100) DEFAULT NULL COMMENT '逻辑城市';

