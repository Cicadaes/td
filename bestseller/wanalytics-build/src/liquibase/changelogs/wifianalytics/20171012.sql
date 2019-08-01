--liquibase formatted sql
--changeset youyu.dong:1507737600966-1
alter table TD_PROJECT modify `project_num` varchar(64) DEFAULT NULL COMMENT '店铺ID或者编码';

--changeset kai.zhang:1507971587000-1
alter table TD_PROJECT_PLACE add `corners` varchar(500) DEFAULT NULL COMMENT '店铺角标坐标数组';

