--liquibase formatted sql

--changeset nan.e:1488952748000-1
alter table TD_APMAC_HEART_COUNTER rename offline_sensor_heart_hour_counter;
alter table TD_APMAC_EFFECTIVE_COUNTER rename offline_sensor_effective_hour_counter;