--liquibase formatted sql

--changeset yinglei.li:1515578240888-1
ALTER TABLE TD_INSTALL_INFO ADD COLUMN `shop_size` varchar(20) DEFAULT NULL COMMENT '店铺大小 1-大  2-中  3-小'; -- 店铺大小

