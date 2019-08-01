--liquibase formatted sql

--changeset yunlong.wang:1482894556120-4
INSERT INTO `SYS_EMAIL_SERVER_CONFIG` VALUES (1,'PasswordEditCode','密码修改提醒','smtp.163.com',25,1,'analyticsv3@163.com','analyticsv3','um','2014-09-04 05:45:13','2016-04-27 03:20:22');
