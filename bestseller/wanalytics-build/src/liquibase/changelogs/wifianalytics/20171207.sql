--liquibase formatted sql

--changeset youyu.dong:1512619200570-1

ALTER TABLE TD_PROJECT_INDEX  add `tenant_id` varchar(64) DEFAULT NULL COMMENT '租户';
ALTER TABLE TD_PROJECT_INDEX  add `principal` varchar(127) DEFAULT NULL COMMENT '负责人';

--changeset youyu.dong:1512637200570-1

ALTER TABLE TD_PROJECT            change `C_CITY_CN_NAME` c_city_cn_name varchar(100) DEFAULT NULL COMMENT '不区分品牌的逻辑城市';
ALTER TABLE TD_METRIC_DAY         change `C_CITY_CN_NAME` c_city_cn_name varchar(100) DEFAULT NULL COMMENT '不区分品牌的逻辑城市';
ALTER TABLE TD_METRIC_DAY_ACTIVE  change `C_CITY_CN_NAME` c_city_cn_name varchar(100) DEFAULT NULL COMMENT '不区分品牌的逻辑城市';
ALTER TABLE TD_METRIC_FACT        change `C_CITY_CN_NAME` c_city_cn_name varchar(100) DEFAULT NULL COMMENT '不区分品牌的逻辑城市';

ALTER TABLE TD_METRIC_WEEK        change `C_CITY_CN_NAME` c_city_cn_name varchar(100) DEFAULT NULL COMMENT '不区分品牌的逻辑城市';
ALTER TABLE TD_METRIC_MONTH       change `C_CITY_CN_NAME` c_city_cn_name varchar(100) DEFAULT NULL COMMENT '不区分品牌的逻辑城市';
