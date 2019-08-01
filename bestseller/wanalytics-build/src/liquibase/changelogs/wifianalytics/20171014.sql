--liquibase formatted sql
--changeset youyu.dong:1507910400966-1
alter table TD_TARGET_MANAGEMENT add  `metric_type` varchar(100) DEFAULT NULL COMMENT '指标类型名称';
alter table TD_TARGET_MANAGEMENT add  `metric_rate` varchar(1) DEFAULT NULL COMMENT '是否是比率(N/Y)';
alter table TD_PROJECT add  `county` varchar(120) DEFAULT NULL COMMENT '县名称';
