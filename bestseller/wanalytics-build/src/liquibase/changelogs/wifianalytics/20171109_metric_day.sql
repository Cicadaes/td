--liquibase formatted sql

--changeset kai.zhang:1510219635000-1
ALTER TABLE TD_METRIC_DAY add  `sales_count` DECIMAL (10,2) DEFAULT 0 COMMENT '件单数(成交件数)';
ALTER TABLE TD_METRIC_DAY add  `order_count_gt1` INT DEFAULT 0 COMMENT '每单件数大于1的订单数';
ALTER TABLE TD_METRIC_DAY add  `vip_sales_amount` DECIMAL (10,2) DEFAULT 0 COMMENT '会员销售金额（成交金额）';
ALTER TABLE TD_METRIC_DAY add  `vip_order_count` INT DEFAULT 0 COMMENT '会员订单数（成交订单数）';
ALTER TABLE TD_METRIC_DAY add  `vip_sales_count` DECIMAL (10,2) DEFAULT 0 COMMENT '会员件单数(成交件数)';
ALTER TABLE TD_METRIC_DAY add  `vip_order_count_gt1` INT DEFAULT 0 COMMENT '会员每单件数大于1的订单数';
ALTER TABLE TD_METRIC_DAY add  `non_vip_sales_amount` DECIMAL (10,2) DEFAULT 0 COMMENT '非会员销售金额（成交金额）';
ALTER TABLE TD_METRIC_DAY add  `non_vip_order_count` INT DEFAULT 0 COMMENT '非会员订单数（成交订单数）';
ALTER TABLE TD_METRIC_DAY add  `non_vip_sales_count` DECIMAL (10,2) DEFAULT 0 COMMENT '非会员件单数(成交件数)';
ALTER TABLE TD_METRIC_DAY add  `non_vip_order_count_gt1` INT DEFAULT 0 COMMENT '非会员每单件数大于1的订单数';

ALTER TABLE TD_METRIC_DAY modify  `sales_amount` DECIMAL (10,2) DEFAULT 0 COMMENT '销售金额（成交金额）';

ALTER TABLE TD_METRIC_DAY DROP COLUMN singular_count;
ALTER TABLE TD_METRIC_DAY DROP COLUMN member_amount;
ALTER TABLE TD_METRIC_DAY DROP COLUMN member_order_num;
ALTER TABLE TD_METRIC_DAY DROP COLUMN non_member_amount;
ALTER TABLE TD_METRIC_DAY DROP COLUMN non_member_order_num;