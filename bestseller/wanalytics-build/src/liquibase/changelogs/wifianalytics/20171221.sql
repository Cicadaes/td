--liquibase formatted sql

--changeset yinglei.li:1513835782570-1

ALTER TABLE TD_METRIC_MONTH DROP COLUMN `interval_30`; -- 删除15-30分钟区间次数字段

--changeset yinglei.li:1513839782570-2

ALTER TABLE TD_METRIC_MONTH modify `project_num` varchar(64) DEFAULT NULL COMMENT '店铺编号'; -- 修改店铺编号可以为空

--changeset yinglei.li:1513846782570-1

ALTER TABLE TD_METRIC_WEEK DROP COLUMN `interval_30`; -- 删除15-30分钟区间次数字段

--changeset yinglei.li:1513849782570-2

ALTER TABLE TD_METRIC_WEEK modify `project_num` varchar(64) DEFAULT NULL COMMENT '店铺编号'; -- 修改店铺编号可以为空
