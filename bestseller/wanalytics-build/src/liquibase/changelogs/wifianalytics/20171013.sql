--liquibase formatted sql
--changeset youyu.dong:1507824000966-1
alter table TD_METRIC_DAY add  `new_active_duration` int(11) DEFAULT NULL COMMENT '新客到访时长';
alter table TD_METRIC_DAY add  `new_active_time` int(11) DEFAULT NULL COMMENT '新客到访次数';
alter table TD_METRIC_DAY add  `old_active_duration` int(11) DEFAULT NULL COMMENT '老客到访时长';
alter table TD_METRIC_DAY add  `old_active_time` int(11) DEFAULT NULL COMMENT '老客到访次数';

alter table TD_METRIC_WEEK add  `new_active_duration` int(11) DEFAULT NULL COMMENT '新客到访时长';
alter table TD_METRIC_WEEK add  `new_active_time` int(11) DEFAULT NULL COMMENT '新客到访次数';
alter table TD_METRIC_WEEK add  `old_active_duration` int(11) DEFAULT NULL COMMENT '老客到访时长';
alter table TD_METRIC_WEEK add  `old_active_time` int(11) DEFAULT NULL COMMENT '老客到访次数';

alter table TD_METRIC_MONTH add  `new_active_duration` int(11) DEFAULT NULL COMMENT '新客到访时长';
alter table TD_METRIC_MONTH add  `new_active_time` int(11) DEFAULT NULL COMMENT '新客到访次数';
alter table TD_METRIC_MONTH add  `old_active_duration` int(11) DEFAULT NULL COMMENT '老客到访时长';
alter table TD_METRIC_MONTH add  `old_active_time` int(11) DEFAULT NULL COMMENT '老客到访次数';
