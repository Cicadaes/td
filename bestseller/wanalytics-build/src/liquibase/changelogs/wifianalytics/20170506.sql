--liquibase formatted sql

--changeset ran.li:1494003590000-1
UPDATE `TD_CUSTOM_LABEL_NAME` SET `name` = '有效客流'  WHERE `label` = 'TOP10RoomPassengerFlowEnterCount' AND status = '0';