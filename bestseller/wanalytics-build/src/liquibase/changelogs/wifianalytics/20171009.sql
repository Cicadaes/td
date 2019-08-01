--liquibase formatted sql

--changeset kai.zhang:1490165586766-1
alter table TD_TENANT_TOP_AREA_COUNT modify `area_type` int(11) DEFAULT NULL COMMENT '1： 小区 2： 县区';
alter table TD_TENANT_TOP_AREA_COUNT add `project_type` int(11) DEFAULT NULL;
alter table TD_TENANT_TOP_AREA_COUNT add `crowd_type` varchar(10) DEFAULT NULL;
alter table TD_TENANT_TOP_AREA_COUNT add `crowd_name` varchar(100) DEFAULT NULL;
