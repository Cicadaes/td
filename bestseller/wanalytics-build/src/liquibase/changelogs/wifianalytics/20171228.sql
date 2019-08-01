--liquibase formatted sql

--changeset yinglei.li:1514438117570-1

ALTER TABLE TD_METRIC_FACT ADD COLUMN `tenant_id` varchar(64) DEFAULT NULL COMMENT '租户'; -- 增加租户ID

ALTER TABLE TD_METRIC_DAY_ACTIVE ADD COLUMN `tenant_id` varchar(64) DEFAULT NULL COMMENT '租户'; -- 增加租户ID
