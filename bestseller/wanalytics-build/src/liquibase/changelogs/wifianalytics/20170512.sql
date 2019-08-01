--liquibase formatted sql

--changeset ran.li:1494574029000-1
ALTER TABLE `TD_PROJECT_INDEX` CHANGE `seven_chain` `seven_chain` varchar(31) DEFAULT NULL COMMENT '7天客流环比字符串';
ALTER TABLE `TD_PROJECT_INDEX` CHANGE `thirty_chain` `thirty_chain` varchar(31) DEFAULT NULL COMMENT '30天客流环比字符串';