--liquibase formatted sql

--changeset junmin.li:1505971411570-1
drop table OrganizationDim;
alter table TD_PROJECT modify `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：城市 4：办事处 5：大区 6：品牌';
