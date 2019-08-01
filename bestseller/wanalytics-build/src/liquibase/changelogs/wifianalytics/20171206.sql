--liquibase formatted sql

--changeset youyu.dong:1512543600570-1

ALTER TABLE TD_PROJECT            add    `C_CITY_CN_NAME` varchar(100) DEFAULT NULL COMMENT '不区分品牌的逻辑城市';
ALTER TABLE TD_METRIC_DAY         add    `C_CITY_CN_NAME` varchar(100) DEFAULT NULL COMMENT '不区分品牌的逻辑城市';
ALTER TABLE TD_METRIC_DAY_ACTIVE  add    `C_CITY_CN_NAME` varchar(100) DEFAULT NULL COMMENT '不区分品牌的逻辑城市';
ALTER TABLE TD_METRIC_FACT        add    `C_CITY_CN_NAME` varchar(100) DEFAULT NULL COMMENT '不区分品牌的逻辑城市';

ALTER TABLE TD_METRIC_WEEK        add    `C_CITY_CN_NAME` varchar(100) DEFAULT NULL COMMENT '不区分品牌的逻辑城市';
ALTER TABLE TD_METRIC_MONTH       add    `C_CITY_CN_NAME` varchar(100) DEFAULT NULL COMMENT '不区分品牌的逻辑城市';
