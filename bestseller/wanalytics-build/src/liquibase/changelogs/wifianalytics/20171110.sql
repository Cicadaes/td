--liquibase formatted sql

--changeset youyu.dong:1510286400570-1
ALTER TABLE TD_METRIC_DAY  modify  `order_average_price` decimal(10,2) DEFAULT 0.0 COMMENT '订单均价';
ALTER TABLE TD_METRIC_DAY  modify  `singular_price` decimal(10,2) DEFAULT 0.0 COMMENT '件单价';
ALTER TABLE TD_METRIC_DAY  modify  `customer_price` decimal(10,2) DEFAULT 0.0 COMMENT '客单价';
ALTER TABLE TD_METRIC_DAY  modify    `rpc` decimal(10,2) DEFAULT 0.0 COMMENT 'rpc';
ALTER TABLE TD_METRIC_DAY  modify  `vpc` decimal(10,2) DEFAULT 0.0 COMMENT 'vpc';

ALTER TABLE TD_METRIC_DAY  modify    `member_single_price` decimal(10,2) DEFAULT 0.0 COMMENT '会员成交单价';

ALTER TABLE TD_METRIC_DAY  modify    `non_member_single_price` decimal(10,2) DEFAULT 0.0 COMMENT '非会员成交单价';
ALTER TABLE TD_METRIC_DAY  modify    `average_order_nums` decimal(10,2) DEFAULT 0.0 COMMENT '平均订单件数';
ALTER TABLE TD_METRIC_DAY  modify    `member_order_average_price` decimal(10,2) DEFAULT 0.0 COMMENT '会员订单均价';
ALTER TABLE TD_METRIC_DAY  modify    `non_member_order_average_price` decimal(10,2) DEFAULT 0.0 COMMENT '非会员订单均价';
