--liquibase formatted sql

--changeset yinglei.li:1516000476888-1

ALTER TABLE TD_METRIC_WEEK        change `sales_amount` sales_amount decimal(20,2) DEFAULT '0.00' COMMENT '销售金额（成交金额）';
ALTER TABLE TD_METRIC_MONTH       change `sales_amount` sales_amount decimal(20,2) DEFAULT '0.00' COMMENT '销售金额（成交金额）';