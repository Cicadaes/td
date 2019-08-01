--liquibase formatted sql

--changeset yinglei.li:1508212379000-1
ALTER TABLE TD_BS_DEVICE change column `dev_location_area` `dev_location_country` varchar(20) DEFAULT NULL COMMENT '设备位置-国家';

--changeset yinglei.li:1508212479000-2
ALTER TABLE TD_BS_DEV_AP change column `ap_id` `ap_ip` varchar(100) DEFAULT NULL COMMENT 'AP设备IP';
