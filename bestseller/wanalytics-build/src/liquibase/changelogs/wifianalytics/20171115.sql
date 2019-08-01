--liquibase formatted sql

--changeset youyu.dong:1510718400570-1
ALTER TABLE TD_METRIC_DAY DROP COLUMN order_average_price;
ALTER TABLE TD_METRIC_DAY DROP COLUMN singular_price;
ALTER TABLE TD_METRIC_DAY DROP COLUMN customer_price;
ALTER TABLE TD_METRIC_DAY DROP COLUMN member_single_price;
ALTER TABLE TD_METRIC_DAY DROP COLUMN non_member_single_price;
ALTER TABLE TD_METRIC_DAY DROP COLUMN member_order_average_price;
ALTER TABLE TD_METRIC_DAY DROP COLUMN non_member_order_average_price;
ALTER TABLE TD_METRIC_DAY DROP COLUMN relation_order_rate;
ALTER TABLE TD_METRIC_DAY DROP COLUMN member_relation_order_rate;
ALTER TABLE TD_METRIC_DAY DROP COLUMN non_member_relation_order_rate;

ALTER TABLE TD_METRIC_WEEK DROP COLUMN order_average_price;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN singular_price;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN customer_price;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN member_single_price;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN non_member_single_price;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN member_order_average_price;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN non_member_order_average_price;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN relation_order_rate;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN member_relation_order_rate;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN non_member_relation_order_rate;

ALTER TABLE TD_METRIC_MONTH DROP COLUMN order_average_price;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN singular_price;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN customer_price;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN member_single_price;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN non_member_single_price;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN member_order_average_price;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN non_member_order_average_price;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN relation_order_rate;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN member_relation_order_rate;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN non_member_relation_order_rate;

ALTER TABLE TD_METRIC_DAY add  `tenant_id` varchar(64) DEFAULT NULL COMMENT '租户';
ALTER TABLE TD_METRIC_WEEK add  `tenant_id` varchar(64) DEFAULT NULL COMMENT '租户';
ALTER TABLE TD_METRIC_MONTH add  `tenant_id` varchar(64) DEFAULT NULL COMMENT '租户';

ALTER TABLE TD_METRIC_DAY modify  `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市  12：品牌渠道 13：渠道省份 14：渠道城市';
ALTER TABLE TD_METRIC_WEEK modify  `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市  12：品牌渠道 13：渠道省份 14：渠道城市';
ALTER TABLE TD_METRIC_MONTH modify  `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市  12：品牌渠道 13：渠道省份 14：渠道城市';



--changeset youyu.dong:1510718400570-2
ALTER TABLE TD_METRIC_DAY DROP COLUMN vpc;
ALTER TABLE TD_METRIC_DAY DROP COLUMN rpc;

ALTER TABLE TD_METRIC_WEEK DROP COLUMN vpc;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN rpc;

ALTER TABLE TD_METRIC_MONTH DROP COLUMN vpc;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN rpc;


--changeset youyu.dong:1510718400570-3
ALTER TABLE TD_METRIC_HOUR_REAL_TIME  add  `tenant_id` varchar(64) DEFAULT NULL COMMENT '租户';

ALTER TABLE TD_METRIC_DAY DROP COLUMN recent7Users;
ALTER TABLE TD_METRIC_DAY DROP COLUMN recent30HighRate;
