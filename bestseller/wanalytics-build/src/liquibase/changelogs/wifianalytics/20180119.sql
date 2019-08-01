--liquibase formatted sql

--changeset youyu.dong:1516359600888-1

ALTER TABLE TD_METRIC_WEEK        change `non_vip_sales_amount` non_vip_sales_amount decimal(20,2) DEFAULT '0.00' COMMENT '非会员销售金额（成交金额）';
ALTER TABLE TD_METRIC_MONTH       change `non_vip_sales_amount` non_vip_sales_amount decimal(20,2) DEFAULT '0.00' COMMENT '非会员销售金额（成交金额）';

ALTER TABLE TD_METRIC_WEEK        change `vip_sales_amount` vip_sales_amount decimal(20,2) DEFAULT '0.00' COMMENT '会员销售金额（成交金额）';
ALTER TABLE TD_METRIC_MONTH       change `vip_sales_amount` vip_sales_amount decimal(20,2) DEFAULT '0.00' COMMENT '会员销售金额（成交金额）';