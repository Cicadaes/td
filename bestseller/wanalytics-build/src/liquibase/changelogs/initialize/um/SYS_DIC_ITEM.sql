--liquibase formatted sql

--changeset yunlong.wang:1482894556120-2
INSERT INTO `SYS_DIC_ITEM` VALUES (1,'0','启用',2,0,'2014-09-03 10:29:17','2014-09-03 10:29:17');
INSERT INTO `SYS_DIC_ITEM` VALUES (2,'1','禁用',2,0,'2014-09-03 10:29:23','2014-09-03 10:29:23');
INSERT INTO `SYS_DIC_ITEM` VALUES (3,'1','普通职员',1,0,'2014-09-03 10:29:40','2014-09-03 10:29:40');
INSERT INTO `SYS_DIC_ITEM` VALUES (4,'2','管理员',1,0,'2014-09-03 10:29:47','2014-09-03 10:29:47');
INSERT INTO `SYS_DIC_ITEM` VALUES (5,'3','领导',1,0,'2014-09-03 10:29:55','2014-09-03 10:29:55');
INSERT INTO `SYS_DIC_ITEM` VALUES (6,'4','联系人',1,0,'2014-09-03 10:30:07','2014-09-03 10:30:07');
INSERT INTO `SYS_DIC_ITEM` VALUES (7,'0','主应用',3,0,'2016-05-10 06:50:37','2016-05-10 06:50:37');
INSERT INTO `SYS_DIC_ITEM` VALUES (8,'1','从应用',3,0,'2016-05-10 06:50:47','2016-05-10 06:50:47');
INSERT INTO `SYS_DIC_ITEM` VALUES (9,'0','默认角色',4,0,'2016-05-12 11:28:22','2016-05-12 11:28:22');
INSERT INTO `SYS_DIC_ITEM` VALUES (10,'1','App管理员角色',4,0,'2016-05-12 11:28:34','2016-05-12 11:28:34');
INSERT INTO `SYS_DIC_ITEM` VALUES (11,'2','租户管理员角色',4,0,'2016-05-12 11:28:58','2016-05-12 11:28:58');
INSERT INTO `SYS_DIC_ITEM` VALUES (12,'3','租户管理员模板角色',4,0,'2016-05-12 11:29:18','2016-05-12 11:29:18');
INSERT INTO `SYS_DIC_ITEM` VALUES (13,'4','租户普通用户模板角色',4,0,'2016-05-12 11:30:03','2016-05-12 11:30:03');