--liquibase formatted sql

--changeset youyu.dong:1509610271570-1
alter table TD_PROJECT         modify `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市';
alter table TD_METRIC_DAY      modify `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市';
alter table TD_METRIC_MONTH    modify `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市';
alter table TD_METRIC_WEEK     modify `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市';

alter table TD_METRIC_DAY_ACTIVE       modify `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市';
alter table TD_METRIC_MONTH_ACTIVE     modify `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市';
alter table TD_METRIC_WEEK_ACTIVE      modify `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市';

alter table TD_METRIC_FACT             modify `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市';
alter table TD_METRIC_HOUR_REAL_TIME   modify `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市';
