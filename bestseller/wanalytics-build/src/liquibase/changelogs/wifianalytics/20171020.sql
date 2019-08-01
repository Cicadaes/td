--liquibase formatted sql

--changeset yinglei.li:1508490719966-1
alter table TD_BS_AUTH_HISTORY modify  `user_ip` varchar(100) DEFAULT NULL COMMENT '用户的 IP，已转化为整数';
