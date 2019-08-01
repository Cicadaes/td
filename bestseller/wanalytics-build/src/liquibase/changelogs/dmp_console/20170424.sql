--liquibase formatted sql

--changeset junmin.li:1493086427903-1
update TD_PARAM set param_value=30 where param_key='wifianalytics.calc.cycle.statistics' and system_code='wreport';
update TD_PARAM set param_value=30 where param_key='tags.query.date.interval' and system_code='wreport';
