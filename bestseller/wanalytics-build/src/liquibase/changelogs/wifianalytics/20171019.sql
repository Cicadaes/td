--liquibase formatted sql

--changeset youyu.dong:1508342400966-1
alter table TD_PROJECT add  `city_type` int(2) COMMENT '城市类型 1： 直辖市 2： 省份';


--changeset youyu.dong:1508342480966-1
alter table TD_PROJECT add  `city_level` int(2) DEFAULT NULL COMMENT '城市等级：1，一线城市；2：二线城市；3，三线城市；4：四线城市；-1：其它';

--changeset youyu.dong:1508410800966-1
ALTER TABLE TD_PROJECT modify `logical_city` varchar(100) DEFAULT NULL COMMENT '逻辑城市';
alter table TD_METRIC_DAY add  `logical_city` varchar(100) DEFAULT NULL COMMENT '逻辑城市';
alter table TD_METRIC_WEEK add  `logical_city` varchar(100) DEFAULT NULL COMMENT '逻辑城市';
alter table TD_METRIC_MONTH add  `logical_city` varchar(100) DEFAULT NULL COMMENT '逻辑城市';