--liquibase formatted sql

--changeset yinglei.li:1515383698888-1
ALTER TABLE TD_BS_SHOP ADD COLUMN `shop_size` varchar(20) DEFAULT NULL COMMENT '店铺大小 1-大  2-中  3-小'; -- 店铺大小

--changeset youyu.dong:1515405600888-1
ALTER TABLE TD_PROJECT ADD COLUMN `shop_size` varchar(20) DEFAULT NULL COMMENT '店铺大小 L-大  M-中  S-小'; -- 店铺大小

