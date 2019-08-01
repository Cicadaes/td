--liquibase formatted sql

--changeset junmin.li:1490083387663-1
ALTER TABLE `TD_CROWD_BLACK_LIST`   drop  INDEX IDX_QUERY ;
ALTER TABLE `TD_CROWD_BLACK_LIST`   ADD UNIQUE INDEX `IDX_UNIQ_PROJECT_MAC` (`project_id`, `device_mac`) ;
