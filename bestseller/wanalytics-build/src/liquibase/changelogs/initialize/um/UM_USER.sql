--liquibase formatted sql

--changeset yunlong.wang:1482894556120-16
INSERT INTO `UM_USER` VALUES (1,'system','超级用户','08b83c2378340ab7881506f0d188d57a1d750c3c',NULL,NULL,NULL,'testuser@172.30.4.200 ',NULL,NULL,NULL,2000152,NULL,0,NULL,NULL,'mysql',NULL,NULL);
INSERT INTO `UM_USER` VALUES (2,'UMAdmin','UM管理员','08b83c2378340ab7881506f0d188d57a1d750c3c',NULL,NULL,NULL,'testuser@172.30.4.200 ',NULL,NULL,NULL,2000152,NULL,0,NULL,NULL,'mysql',NULL,NULL);
INSERT INTO `UM_USER` VALUES (3,'azkaban','azkaban','08b83c2378340ab7881506f0d188d57a1d750c3c','','男',NULL,'azkaban@163.com','','','',NULL,' ',0,'2016-12-13 03:20:14','2016-12-13 03:20:14','UMAdmin',NULL,NULL);
--rollback delete from UM_USER;