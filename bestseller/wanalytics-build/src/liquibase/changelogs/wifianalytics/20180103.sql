--liquibase formatted sql

--changeset junmin.li:1514982874038-1
ALTER TABLE TD_BS_USER ADD COLUMN `shop_code` varchar(10) DEFAULT NULL COMMENT '店铺编码'; -- 店铺编码

ALTER TABLE TD_BS_USER ADD COLUMN `user_sign` varchar(10) DEFAULT NULL COMMENT '用户标识,枚举值：1-零售 2-非零售'; -- 用户标识

