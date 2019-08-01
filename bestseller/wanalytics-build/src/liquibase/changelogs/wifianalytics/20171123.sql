--liquibase formatted sql

--changeset yinglei.li:1511436032570-1
ALTER TABLE TD_BS_SHOP add  `run_date` varchar(40) DEFAULT NULL COMMENT '数据周期';
ALTER TABLE TD_BS_DEVICE add  `run_date` varchar(40) DEFAULT NULL COMMENT '数据周期';
ALTER TABLE TD_BS_DEVICE_RLT add  `run_date` varchar(40) DEFAULT NULL COMMENT '数据周期';
ALTER TABLE TD_BS_DEV_AP add  `run_date` varchar(40) DEFAULT NULL COMMENT '数据周期';
ALTER TABLE TD_BS_AUTH_HISTORY add  `run_date` varchar(40) DEFAULT NULL COMMENT '数据周期';
