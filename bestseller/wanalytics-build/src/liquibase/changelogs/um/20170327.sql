--liquibase formatted sql

--changeset yunlong.wang:1490605947110-1
alter table UM_ROLE_RESOURCE add attr1 varchar(255) DEFAULT NULL;
--changeset yunlong.wang:1490605947110-2
alter table UM_ROLE_RESOURCE add attr2 varchar(255) DEFAULT NULL;
--changeset yunlong.wang:1490605947110-3
alter table UM_ROLE_RESOURCE add attr3 varchar(255) DEFAULT NULL;