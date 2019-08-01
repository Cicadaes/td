--liquibase formatted sql

--changeset yinglei.li:1508986559966-1
alter table TD_BS_DEVICE modify `dev_mac` varchar(100) DEFAULT NULL COMMENT '小贝设备MAC';
