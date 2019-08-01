--liquibase formatted sql

--changeset youyu.dong:1510888271570-1
ALTER TABLE TD_CITY add  `longitude_bd` varchar(40) DEFAULT NULL COMMENT '百度经度';
ALTER TABLE TD_CITY add  `latitude_bd` varchar(40) DEFAULT NULL COMMENT '百度维度';
