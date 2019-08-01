--liquibase formatted sql

--changeset junmin.li:1493690488547-1
alter table TD_PROJECT modify `category` varchar(255) DEFAULT NULL COMMENT '-1 竞品房间';
alter table TD_PROJECT modify `related_id` bigint(20) DEFAULT 0 COMMENT '竞品比较项目ID,此字段废弃,TD_PROJECT_RELATION通过关联关系';
