--liquibase formatted sql

--changeset kai.zhang:1509421259000-1
ALTER TABLE TD_METRIC_DAY DROP COLUMN interval_30;
ALTER TABLE TD_METRIC_DAY modify `interval_2` int(11) DEFAULT NULL COMMENT '0-1分钟区间次数';
ALTER TABLE TD_METRIC_DAY modify `interval_5` int(11) DEFAULT NULL COMMENT '1-5分钟区间次数';
ALTER TABLE TD_METRIC_DAY modify `interval_10` int(11) DEFAULT NULL COMMENT '5-15分钟区间次数';
ALTER TABLE TD_METRIC_DAY modify `interval_15` int(11) DEFAULT NULL COMMENT '>15分钟区间次数';

--changeset kai.zhang:1509421259000-2
alter table TD_METRIC_DAY modify `project_num` varchar(64) DEFAULT NULL COMMENT '店铺编号';



