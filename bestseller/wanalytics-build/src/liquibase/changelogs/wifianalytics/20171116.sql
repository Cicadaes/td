--liquibase formatted sql

--changeset youyu.dong:1510804800570-1
ALTER TABLE TD_METRIC_WEEK add  `sales_count` DECIMAL (10,2) DEFAULT 0.0 COMMENT '件单数(成交件数)';
ALTER TABLE TD_METRIC_WEEK add  `order_count_gt1` INT DEFAULT 0.0 COMMENT '每单件数大于1的订单数';
ALTER TABLE TD_METRIC_WEEK add  `vip_sales_amount` DECIMAL (10,2) DEFAULT 0.0 COMMENT '会员销售金额（成交金额）';
ALTER TABLE TD_METRIC_WEEK add  `vip_order_count` INT DEFAULT 0.0 COMMENT '会员订单数（成交订单数）';
ALTER TABLE TD_METRIC_WEEK add  `vip_sales_count` DECIMAL (10,2) DEFAULT 0.0 COMMENT '会员件单数(成交件数)';
ALTER TABLE TD_METRIC_WEEK add  `vip_order_count_gt1` INT DEFAULT 0.0 COMMENT '会员每单件数大于1的订单数';
ALTER TABLE TD_METRIC_WEEK add  `non_vip_sales_amount` DECIMAL (10,2) DEFAULT 0.0 COMMENT '非会员销售金额（成交金额）';
ALTER TABLE TD_METRIC_WEEK add  `non_vip_order_count` INT DEFAULT 0.0 COMMENT '非会员订单数（成交订单数）';
ALTER TABLE TD_METRIC_WEEK add  `non_vip_sales_count` DECIMAL (10,2) DEFAULT 0.0 COMMENT '非会员件单数(成交件数)';
ALTER TABLE TD_METRIC_WEEK add  `non_vip_order_count_gt1` INT DEFAULT 0.0 COMMENT '非会员每单件数大于1的订单数';

ALTER TABLE TD_METRIC_WEEK modify  `sales_amount` DECIMAL (10,2) DEFAULT 0.0 COMMENT '销售金额（成交金额）';
ALTER TABLE TD_METRIC_WEEK  modify    `average_order_nums` decimal(10,2) DEFAULT 0.0 COMMENT '平均订单件数';

ALTER TABLE TD_METRIC_WEEK DROP COLUMN singular_count;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN member_amount;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN member_order_num;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN non_member_amount;
ALTER TABLE TD_METRIC_WEEK DROP COLUMN non_member_order_num;



ALTER TABLE TD_METRIC_MONTH add  `sales_count` DECIMAL (10,2) DEFAULT 0.0 COMMENT '件单数(成交件数)';
ALTER TABLE TD_METRIC_MONTH add  `order_count_gt1` INT DEFAULT 0.0 COMMENT '每单件数大于1的订单数';
ALTER TABLE TD_METRIC_MONTH add  `vip_sales_amount` DECIMAL (10,2) DEFAULT 0.0 COMMENT '会员销售金额（成交金额）';
ALTER TABLE TD_METRIC_MONTH add  `vip_order_count` INT DEFAULT 0.0 COMMENT '会员订单数（成交订单数）';
ALTER TABLE TD_METRIC_MONTH add  `vip_sales_count` DECIMAL (10,2) DEFAULT 0.0 COMMENT '会员件单数(成交件数)';
ALTER TABLE TD_METRIC_MONTH add  `vip_order_count_gt1` INT DEFAULT 0.0 COMMENT '会员每单件数大于1的订单数';
ALTER TABLE TD_METRIC_MONTH add  `non_vip_sales_amount` DECIMAL (10,2) DEFAULT 0.0 COMMENT '非会员销售金额（成交金额）';
ALTER TABLE TD_METRIC_MONTH add  `non_vip_order_count` INT DEFAULT 0.0 COMMENT '非会员订单数（成交订单数）';
ALTER TABLE TD_METRIC_MONTH add  `non_vip_sales_count` DECIMAL (10,2) DEFAULT 0.0 COMMENT '非会员件单数(成交件数)';
ALTER TABLE TD_METRIC_MONTH add  `non_vip_order_count_gt1` INT DEFAULT 0.0 COMMENT '非会员每单件数大于1的订单数';

ALTER TABLE TD_METRIC_MONTH modify  `sales_amount` DECIMAL (10,2) DEFAULT 0.0 COMMENT '销售金额（成交金额）';
ALTER TABLE TD_METRIC_MONTH modify    `average_order_nums` decimal(10,2) DEFAULT 0.0 COMMENT '平均订单件数';

ALTER TABLE TD_METRIC_MONTH DROP COLUMN singular_count;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN member_amount;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN member_order_num;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN non_member_amount;
ALTER TABLE TD_METRIC_MONTH DROP COLUMN non_member_order_num;


--changeset youyu.dong:1510804800570-2
ALTER TABLE TD_METRIC_WEEK  modify  `active_new_users`  int(11) DEFAULT 0 COMMENT '进店新客';
ALTER TABLE TD_METRIC_WEEK  modify  `active_old_users`  int(11) DEFAULT 0 COMMENT '进店老客';
ALTER TABLE TD_METRIC_WEEK  modify  `active_users`  int(11) DEFAULT 0 COMMENT '进店人数';
ALTER TABLE TD_METRIC_WEEK  modify  `stay_new_users`  int(11) DEFAULT 0 COMMENT '停留新客';
ALTER TABLE TD_METRIC_WEEK  modify  `stay_old_users`  int(11) DEFAULT 0 COMMENT '停留老客';
ALTER TABLE TD_METRIC_WEEK  modify  `stay_users`  int(11) DEFAULT 0 COMMENT '停留人数';
ALTER TABLE TD_METRIC_WEEK  modify  `front_users`  int(11) DEFAULT 0 COMMENT '周边人数';
ALTER TABLE TD_METRIC_WEEK  modify  `jump_users`  int(11) DEFAULT 0 COMMENT '跳出人数';
ALTER TABLE TD_METRIC_WEEK  modify  `high_active_users`  int(11) DEFAULT 0 COMMENT '高活跃人数';
ALTER TABLE TD_METRIC_WEEK  modify  `middle_active_users`  int(11) DEFAULT 0 COMMENT '中活跃人数';
ALTER TABLE TD_METRIC_WEEK  modify  `low_active_users`  int(11) DEFAULT 0 COMMENT '低活跃人数';
ALTER TABLE TD_METRIC_WEEK  modify  `sleep_active_users`  int(11) DEFAULT 0 COMMENT '沉睡人数';
ALTER TABLE TD_METRIC_WEEK  modify  `high_stay_users`  int(11) DEFAULT 0 COMMENT '高活跃停留人数';
ALTER TABLE TD_METRIC_WEEK  modify  `middle_stay_users`  int(11) DEFAULT 0 COMMENT '中活跃停留人数';
ALTER TABLE TD_METRIC_WEEK  modify  `low_stay_users`  int(11) DEFAULT 0 COMMENT '低活跃停留人数';
ALTER TABLE TD_METRIC_WEEK  modify  `sleep_stay_users`  int(11) DEFAULT 0 COMMENT '沉睡停留人数';
ALTER TABLE TD_METRIC_WEEK  modify  `active_duration`  int(11) DEFAULT 0 COMMENT '到访总时长';
ALTER TABLE TD_METRIC_WEEK  modify  `active_times`  int(11) DEFAULT 0 COMMENT '到访总次数';
ALTER TABLE TD_METRIC_WEEK  modify  `stay_duration`  int(11) DEFAULT 0 COMMENT '停留总时长';
ALTER TABLE TD_METRIC_WEEK  modify  `stay_times`  int(11) DEFAULT 0 COMMENT '停留总次数';
ALTER TABLE TD_METRIC_WEEK  modify  `interval_2`  int(11) DEFAULT 0 COMMENT '2两分钟区间次数';
ALTER TABLE TD_METRIC_WEEK  modify  `interval_5`  int(11) DEFAULT 0 COMMENT '2到5分钟区间次数';
ALTER TABLE TD_METRIC_WEEK  modify  `interval_10`  int(11) DEFAULT 0 COMMENT '5-10分钟区间次数';
ALTER TABLE TD_METRIC_WEEK  modify  `interval_15`  int(11) DEFAULT 0 COMMENT '10-15分钟区间次数';
ALTER TABLE TD_METRIC_WEEK  modify  `visit_cycle`  int(11) DEFAULT 0 COMMENT '到访周期';
ALTER TABLE TD_METRIC_WEEK  modify  `sales_amount`  int(11) DEFAULT 0 COMMENT '销售金额';
ALTER TABLE TD_METRIC_WEEK  modify  `order_count`  int(11) DEFAULT 0 COMMENT '订单数';
ALTER TABLE TD_METRIC_WEEK  modify  `receipt_count`  int(11) DEFAULT 0 COMMENT'转化数,小票数';
ALTER TABLE TD_METRIC_WEEK  modify  `member_count`  int(11) DEFAULT 0 COMMENT'会员数';
ALTER TABLE TD_METRIC_WEEK  modify  `potential_count`  int(11) DEFAULT 0 COMMENT'潜客数';
ALTER TABLE TD_METRIC_WEEK  modify  `average_order_nums`  int(11) DEFAULT 0 COMMENT'平均订单件数';
ALTER TABLE TD_METRIC_WEEK  modify  `new_active_duration`  int(11) DEFAULT 0 COMMENT'新客到访时长';
ALTER TABLE TD_METRIC_WEEK  modify  `new_active_time`  int(11) DEFAULT 0 COMMENT'新客到访次数';
ALTER TABLE TD_METRIC_WEEK  modify  `old_active_duration`  int(11) DEFAULT 0 COMMENT'老客到访时长';
ALTER TABLE TD_METRIC_WEEK  modify  `old_active_time`  int(11) DEFAULT 0 COMMENT'老客到访次数';

ALTER TABLE TD_METRIC_MONTH  modify  `active_new_users`  int(11) DEFAULT 0 COMMENT '进店新客';
ALTER TABLE TD_METRIC_MONTH  modify  `active_old_users`  int(11) DEFAULT 0 COMMENT '进店老客';
ALTER TABLE TD_METRIC_MONTH  modify  `active_users`  int(11) DEFAULT 0 COMMENT '进店人数';
ALTER TABLE TD_METRIC_MONTH  modify  `stay_new_users`  int(11) DEFAULT 0 COMMENT '停留新客';
ALTER TABLE TD_METRIC_MONTH  modify  `stay_old_users`  int(11) DEFAULT 0 COMMENT '停留老客';
ALTER TABLE TD_METRIC_MONTH  modify  `stay_users`  int(11) DEFAULT 0 COMMENT '停留人数';
ALTER TABLE TD_METRIC_MONTH  modify  `front_users`  int(11) DEFAULT 0 COMMENT '周边人数';
ALTER TABLE TD_METRIC_MONTH  modify  `jump_users`  int(11) DEFAULT 0 COMMENT '跳出人数';
ALTER TABLE TD_METRIC_MONTH  modify  `high_active_users`  int(11) DEFAULT 0 COMMENT '高活跃人数';
ALTER TABLE TD_METRIC_MONTH  modify  `middle_active_users`  int(11) DEFAULT 0 COMMENT '中活跃人数';
ALTER TABLE TD_METRIC_MONTH  modify  `low_active_users`  int(11) DEFAULT 0 COMMENT '低活跃人数';
ALTER TABLE TD_METRIC_MONTH  modify  `sleep_active_users`  int(11) DEFAULT 0 COMMENT '沉睡人数';
ALTER TABLE TD_METRIC_MONTH  modify  `high_stay_users`  int(11) DEFAULT 0 COMMENT '高活跃停留人数';
ALTER TABLE TD_METRIC_MONTH  modify  `middle_stay_users`  int(11) DEFAULT 0 COMMENT '中活跃停留人数';
ALTER TABLE TD_METRIC_MONTH  modify  `low_stay_users`  int(11) DEFAULT 0 COMMENT '低活跃停留人数';
ALTER TABLE TD_METRIC_MONTH  modify  `sleep_stay_users`  int(11) DEFAULT 0 COMMENT '沉睡停留人数';
ALTER TABLE TD_METRIC_MONTH  modify  `active_duration`  int(11) DEFAULT 0 COMMENT '到访总时长';
ALTER TABLE TD_METRIC_MONTH  modify  `active_times`  int(11) DEFAULT 0 COMMENT '到访总次数';
ALTER TABLE TD_METRIC_MONTH  modify  `stay_duration`  int(11) DEFAULT 0 COMMENT '停留总时长';
ALTER TABLE TD_METRIC_MONTH  modify  `stay_times`  int(11) DEFAULT 0 COMMENT '停留总次数';
ALTER TABLE TD_METRIC_MONTH  modify  `interval_2`  int(11) DEFAULT 0 COMMENT '2两分钟区间次数';
ALTER TABLE TD_METRIC_MONTH  modify  `interval_5`  int(11) DEFAULT 0 COMMENT '2到5分钟区间次数';
ALTER TABLE TD_METRIC_MONTH  modify  `interval_10`  int(11) DEFAULT 0 COMMENT '5-10分钟区间次数';
ALTER TABLE TD_METRIC_MONTH  modify  `interval_15`  int(11) DEFAULT 0 COMMENT '10-15分钟区间次数';
ALTER TABLE TD_METRIC_MONTH  modify  `visit_cycle`  int(11) DEFAULT 0 COMMENT '到访周期';
ALTER TABLE TD_METRIC_MONTH  modify  `sales_amount`  int(11) DEFAULT 0 COMMENT '销售金额';
ALTER TABLE TD_METRIC_MONTH  modify  `order_count`  int(11) DEFAULT 0 COMMENT '订单数';
ALTER TABLE TD_METRIC_MONTH  modify  `receipt_count`  int(11) DEFAULT 0 COMMENT'转化数,小票数';
ALTER TABLE TD_METRIC_MONTH  modify  `member_count`  int(11) DEFAULT 0 COMMENT'会员数';
ALTER TABLE TD_METRIC_MONTH  modify  `potential_count`  int(11) DEFAULT 0 COMMENT'潜客数';
ALTER TABLE TD_METRIC_MONTH  modify  `average_order_nums`  int(11) DEFAULT 0 COMMENT'平均订单件数';
ALTER TABLE TD_METRIC_MONTH  modify  `new_active_duration`  int(11) DEFAULT 0 COMMENT'新客到访时长';
ALTER TABLE TD_METRIC_MONTH  modify  `new_active_time`  int(11) DEFAULT 0 COMMENT'新客到访次数';
ALTER TABLE TD_METRIC_MONTH  modify  `old_active_duration`  int(11) DEFAULT 0 COMMENT'老客到访时长';
ALTER TABLE TD_METRIC_MONTH  modify  `old_active_time`  int(11) DEFAULT 0 COMMENT'老客到访次数';

--changeset youyu.dong:1510804800570-3
 ALTER TABLE TD_PROJECT modify  `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市  12：品牌渠道 13：渠道省份 14：渠道城市';

 ALTER TABLE TD_METRIC_DAY modify  `sales_amount` DECIMAL (10,2) DEFAULT 0 COMMENT '销售金额（成交金额）';
 ALTER TABLE TD_METRIC_DAY modify    `average_order_nums` decimal(10,2) DEFAULT 0.0 COMMENT '平均订单件数';

 ALTER TABLE TD_METRIC_WEEK modify  `sales_amount` DECIMAL (10,2) DEFAULT 0 COMMENT '销售金额（成交金额）';
 ALTER TABLE TD_METRIC_WEEK modify    `average_order_nums` decimal(10,2) DEFAULT 0.0 COMMENT '平均订单件数';

 ALTER TABLE TD_METRIC_MONTH modify  `sales_amount` DECIMAL (10,2) DEFAULT 0 COMMENT '销售金额（成交金额）';
 ALTER TABLE TD_METRIC_MONTH modify    `average_order_nums` decimal(10,2) DEFAULT 0.0 COMMENT '平均订单件数';