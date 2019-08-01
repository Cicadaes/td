--liquibase formatted sql

--changeset kai.zhang:1508129968000-1
ALTER TABLE TD_INSTALL_INFO modify `related_type` int(11) DEFAULT NULL COMMENT '3.探针对应店铺相对位置';
ALTER TABLE TD_PROJECT_PLACE ADD `ratio` int(11) DEFAULT NULL COMMENT '图片缩放比率';
ALTER TABLE TD_PROJECT_PLACE ADD `corners` varchar(400) DEFAULT NULL COMMENT '图片corner坐标，例，[[0,0],[6,0],[6,6],[0,6]]';

--changeset yinglei.li:1508140379000-2
ALTER TABLE TD_BS_SHOP modify `shop_status` varchar(20) NOT NULL COMMENT '店铺状态 1-开店中  2-已闭店  3-装修中';

--changeset yinglei.li:1508140679000-3
ALTER TABLE TD_BS_SHOP change column `provice` `province` varchar(100) DEFAULT NULL COMMENT '省';

ALTER TABLE TD_BS_DEVICE change column `dev_location_provice` `dev_location_province` varchar(100) DEFAULT NULL COMMENT '设备位置-省';

--changeset yinglei.li:1508140689000-4
ALTER TABLE TD_BS_DEVICE_RLT comment '绫致店铺与设备关系(AP、小贝)';
