package com.talkingdata.marketing.core.util.mail;

import javax.mail.PasswordAuthentication;
/**
 * @description: 邮件验证类
 * @author: anjie.li 2015-09-17
 * @version: 1.0
 * @modify:
 * @Copyright: 公司版权所有
 */
public class MyAuthenticator extends javax.mail.Authenticator {
	private String strUser; 
    private String strPwd; 
    public MyAuthenticator(String user, String password) { 
      this.strUser = user; 
      this.strPwd = password; 
    } 

    @Override
    protected PasswordAuthentication getPasswordAuthentication() {
      return new PasswordAuthentication(strUser, strPwd); 
    } 

}
