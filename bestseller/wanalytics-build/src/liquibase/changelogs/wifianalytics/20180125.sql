--liquibase formatted sql

--changeset junmin.li:1516872394952-1
alter table TD_METRIC_HOUR_REAL_TIME drop COLUMN brand;
alter table TD_METRIC_HOUR_REAL_TIME drop COLUMN region;
alter table TD_METRIC_HOUR_REAL_TIME drop COLUMN city;
alter table TD_METRIC_HOUR_REAL_TIME drop COLUMN province;
alter table TD_METRIC_HOUR_REAL_TIME drop COLUMN channel;
alter table TD_METRIC_HOUR_REAL_TIME drop COLUMN mall;

--changeset junmin.li:1516872394952-2
alter table TD_METRIC_DAY drop COLUMN receipt_count;
alter table TD_METRIC_DAY drop COLUMN average_order_nums;
alter table TD_METRIC_DAY_ACTIVE drop COLUMN recent7Users;
alter table TD_METRIC_DAY_ACTIVE drop COLUMN recent30HighRate;
alter table TD_METRIC_WEEK drop COLUMN receipt_count;
alter table TD_METRIC_WEEK drop COLUMN average_order_nums;
alter table TD_METRIC_MONTH drop COLUMN receipt_count;
alter table TD_METRIC_MONTH drop COLUMN average_order_nums;
alter table TD_METRIC_DAY_PARTY drop COLUMN receipt_count;