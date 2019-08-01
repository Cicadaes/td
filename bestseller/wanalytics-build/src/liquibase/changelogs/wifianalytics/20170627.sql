--liquibase formatted sql

--changeset junmin.li:1498532735836-1
alter table TD_DMK_IDMAPPING add `http_status` int;