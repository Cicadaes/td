--liquibase formatted sql

--changeset junmin.li:1493258643683-1
alter table TD_MAC_COMPANY modify `is_mobile` int(10) DEFAULT 0 COMMENT '2表示非移动mac黑名单，其它值合理';
