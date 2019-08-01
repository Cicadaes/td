--liquibase formatted sql

--changeset yunlong.wang:1482894556120-5
INSERT INTO `SYS_EMAIL_TEMPLATE` VALUES (1,'ResetPasswordURLTemplate','重置密码链接','<p>尊敬的用户，您好：</p>您的密码重置申请已受理成功，<a href=\"${url}\">点击链接重置密码</a>，链接在两个小时内有效，请及时修改<div style=\"width:200px;float:right;margin:180px 50px 0px 0px;\"><p><b>TalkingData用户管理系统</b></p></div>','UM','2016-05-16 03:20:48','2016-05-16 03:26:06');
INSERT INTO `SYS_EMAIL_TEMPLATE` VALUES (2,'PasswordEditCodeTemplate','TalkingDate用户账户密码重置邮件','<p>尊敬的用户，您好：</p>您的密码重置申请已受理成功，重置密码为${password},请及时修改密码<div style=\"width:200px;float:right;margin:180px 50px 0px 0px;\"><p><b>TalkingDate</b></p></div>','UM','2016-05-16 03:22:09','2016-05-16 03:26:03');
INSERT INTO `SYS_EMAIL_TEMPLATE` VALUES (3,'RegistPasswordTemplate','TalkingDate户帐户启用通知','<p>尊敬的用户，您好：</p>\n您的帐户已经添加，密码为${password}，请用这个密码登录相关应用系统\n<div style=\"width:200px;float:right;margin:180px 50px 0px 0px;\"><p><b>TalkingDate</b></p></div>','UM','2016-05-16 03:22:50','2016-05-16 03:26:00');
