--liquibase formatted sql

--changeset junmin.li:1490165582036-1
alter table TD_CROWD_BLACK_LIST modify `source` int(2) DEFAULT NULL COMMENT '来源 1：手工录入，2：批量导入,3： 自动过滤, 4: 停留时长过长, 5:非营业时间出现 , 6:非移动设备mac';
