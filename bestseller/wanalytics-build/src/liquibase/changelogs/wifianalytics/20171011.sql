--liquibase formatted sql

--changeset kai.zhang:1490165589966-1
alter table `TD_PROJECT` add logical_city varchar(100) DEFAULT NULL;
--changeset kai.zhang:1490165589966-2
ALTER TABLE TD_TENANT_HOUSING_COVERAGE_COUNT ADD crowd_name varchar(10) DEFAULT NULL COMMENT '人群名称字段';
ALTER TABLE TD_TENANT_HOUSING_COVERAGE_COUNT ADD crowd_type varchar(10) DEFAULT NULL COMMENT '人群类型';