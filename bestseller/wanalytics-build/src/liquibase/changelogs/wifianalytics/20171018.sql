--liquibase formatted sql

--changeset yinglei.li:1508322879000-1
ALTER TABLE TD_BS_AUTH_HISTORY modify `upstream` varchar(50) DEFAULT NULL COMMENT '上行流量';
ALTER TABLE TD_BS_AUTH_HISTORY modify `downstream` varchar(50) DEFAULT NULL COMMENT '下行流量';
ALTER TABLE TD_BS_AUTH_HISTORY modify `access_duration` varchar(50) DEFAULT NULL COMMENT '接入时长';
ALTER TABLE TD_BS_AUTH_HISTORY modify `access_ac_ip` varchar(50) DEFAULT NULL COMMENT '接入 AC 的 IP，已转化为整数';
ALTER TABLE TD_BS_AUTH_HISTORY modify `access_duration_sum` varchar(50) DEFAULT NULL COMMENT '累计接入时长';
ALTER TABLE TD_BS_AUTH_HISTORY modify `upstream_sum` varchar(50) DEFAULT NULL COMMENT '累计上行流量';
ALTER TABLE TD_BS_AUTH_HISTORY modify `downstream_sum` varchar(50) DEFAULT NULL COMMENT '累计下行流量';

--changeset yinglei.li:1508322979000-2
ALTER TABLE TD_BS_AUTH_HISTORY modify `headimgurl` varchar(255) DEFAULT NULL COMMENT '微信用户头像';
ALTER TABLE TD_BS_AUTH_HISTORY modify `unionid` varchar(255) DEFAULT NULL COMMENT '微信用户的唯一标识';
ALTER TABLE TD_BS_AUTH_HISTORY modify `tid` varchar(255) DEFAULT NULL COMMENT '微信用户加密后的手机号';
ALTER TABLE TD_BS_AUTH_HISTORY modify `app_id` varchar(255) DEFAULT NULL COMMENT '公众号的 appi';
ALTER TABLE TD_BS_AUTH_HISTORY modify `mobile_decode` varchar(255) DEFAULT NULL COMMENT '解密手机号';
