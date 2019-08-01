--liquibase formatted sql

--changeset yunlong.wang:1482894556120-6
INSERT INTO `SYS_JOB_CONFIG` VALUES (1,'EmailSendJob','com.tendcloud.enterprise.um.task.EmailSendJob','60','2014-03-17 16:00:00',NULL,NULL,NULL,1,'EmailSendJob','um',NULL,NULL,'2014-09-04 04:34:40','2016-04-27 03:10:03');
INSERT INTO `SYS_JOB_CONFIG` VALUES (2,'ClearResetPasswordCountCacheJob','com.tendcloud.enterprise.um.task.ClearResetPasswordCountCacheJob','60',NULL,NULL,NULL,NULL,1,'ClearResetPasswordCountCacheJob','um',NULL,NULL,'2014-09-04 10:05:50','2016-04-27 03:10:03');
INSERT INTO `SYS_JOB_CONFIG` VALUES (8,'OuterUserResetPwd','com.tendcloud.enterprise.um.task.OuterUserPasswordExpiredJob','6000',NULL,NULL,NULL,NULL,1,'OuterUserPasswordExpiredJob','um',NULL,NULL,'2014-09-25 05:52:34','2016-04-27 03:10:03');
