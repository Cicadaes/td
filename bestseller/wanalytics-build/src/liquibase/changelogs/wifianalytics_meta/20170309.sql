--liquibase formatted sql

--changeset ran.li:1488957936000-2
UPDATE `wifianalytics_meta`.`TD_METRIC` SET `name` = 'offline_sensor_heart_hour_counter' WHERE `id` = '91';
UPDATE `wifianalytics_meta`.`TD_FACT_TABLE` SET `name` = 'offline_sensor_heart_hour_counter' WHERE `id` = '91';
UPDATE `wifianalytics_meta`.`TD_CUBE` SET `name` = 'offline_sensor_heart_hour_counter', `description` = 'offline_sensor_heart_hour_counter' WHERE `id` = '92';
UPDATE `wifianalytics_meta`.`TD_COLUMN` SET `not_null` = 0 WHERE `id`>=451 AND `id`<=458
