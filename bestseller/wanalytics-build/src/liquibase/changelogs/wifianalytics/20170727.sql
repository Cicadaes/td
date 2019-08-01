--liquibase formatted sql

--changeset ran.li:1500284947000-1
UPDATE `TD_AZKABAN_JOB_CONFIG` SET `schedule_time`='00,01,am,CST' WHERE `project_name`='WifiAnalyticsTagTask';
UPDATE `TD_AZKABAN_JOB_CONFIG` SET `schedule_time`='02,00,am,CST' WHERE `project_name`='PositionTask';
UPDATE `TD_AZKABAN_JOB_CONFIG` SET `schedule_time`='03,00,am,CST', `recurring_period` = '1M' WHERE `project_name`='PeopleGroupSumTask';