--liquibase formatted sql

--changeset yunlong.wang:1482894556120-14
INSERT INTO `UM_ROLE` VALUES (2,8,'UM_ADMIN','用户认证管理系统管理员',NULL,'UM_ROLE_ADMIN',0,'2014-10-23 05:55:08','2014-10-23 05:55:08','',1);
INSERT INTO `UM_ROLE` VALUES (3,9,'wreport_ADMIN','客缘管理员',NULL,'ADMIN_TYPE',0,'2016-12-13 02:11:58','2016-12-13 02:11:58','UMAdmin',1);
INSERT INTO `UM_ROLE` VALUES (4,10,'offline-report_ADMIN','数聚管理员',NULL,'ADMIN_TYPE',0,'2016-12-13 02:13:28','2016-12-13 02:13:28','UMAdmin',1);
INSERT INTO `UM_ROLE` VALUES (3829,10,'TENANT_HZS_offline_report_TEST','合作商通用角色',NULL,'合作商通用角色',0,'2016-12-13 02:28:38','2016-12-13 02:28:38',NULL,0);
INSERT INTO `UM_ROLE` VALUES (3830,10,'TENANT_YJS_offline_report_TEST','硬件商通用角色',NULL,'硬件商通用角色',0,'2016-12-13 02:29:18','2016-12-13 02:29:18',NULL,0);

--changeset yunlong.wang:1492596665100-1
INSERT INTO `UM_ROLE` VALUES (3836, 11, 'tenant_ADMIN', 'tenant管理员', NULL, 'ADMIN_TYPE', '0', '2017-04-10 10:37:33', '2017-04-10 10:37:33', 'UMAdmin', '0');
