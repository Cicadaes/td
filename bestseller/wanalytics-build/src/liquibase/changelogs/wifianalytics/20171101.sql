--liquibase formatted sql

--changeset kai.zhang:1509501446000-1
CREATE TABLE `TD_METRIC_DAY_OFFLINE` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `interval_2` int(11) DEFAULT NULL COMMENT '0-1分钟区间驻留次数',
  `interval_5` int(11) DEFAULT NULL COMMENT '1-5分钟区间驻留次数',
  `interval_10` int(11) DEFAULT NULL COMMENT '5-15分钟区间驻留次数',
  `interval_15` int(11) DEFAULT NULL COMMENT '>15分钟区间驻留次数',
  `project_id` int(11) DEFAULT NULL COMMENT '店铺(项目)id(TD_PROJECT)',
  `project_name` varchar(100) DEFAULT NULL COMMENT '项目名称',
  `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份',
  `logical_city` varchar(100) DEFAULT NULL COMMENT '逻辑城市',
  `region` varchar(100) DEFAULT NULL COMMENT '大区',
  `channel` varchar(100) DEFAULT NULL COMMENT '渠道',
  `brand` varchar(100) DEFAULT NULL COMMENT '品牌',
  `province` varchar(100) DEFAULT NULL COMMENT '省',
  `city` varchar(100) DEFAULT NULL COMMENT '城市',
  `date` varchar(10) DEFAULT NULL COMMENT '日期',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '数据创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4866 DEFAULT CHARSET=utf8





