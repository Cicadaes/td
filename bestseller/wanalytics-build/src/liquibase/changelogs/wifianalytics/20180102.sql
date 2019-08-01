--liquibase formatted sql

--changeset junmin.li:1514877946038-1
ALTER TABLE TD_PROJECT_HEAT_MAP ADD COLUMN `tenant_id` varchar(64) DEFAULT NULL COMMENT '租户'; -- 增加租户ID

