--liquibase formatted sql

--changeset junmin.li:1501566217850-1
alter table TD_DMK_LOG drop index IDX_QUERY;
alter table TD_DMK_LOG add index IDX_MAC_MONTH (`mac`,`type`,`month`);
