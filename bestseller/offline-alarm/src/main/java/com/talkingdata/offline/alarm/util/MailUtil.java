package com.talkingdata.offline.alarm.util;

import java.security.GeneralSecurityException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import com.sun.mail.util.MailSSLSocketFactory;


public class MailUtil {

	public static boolean sendMail(String subject,String context,String[] recipientArr) throws GeneralSecurityException {
		boolean flag = true;

		// 建立邮件会话
		Properties pro = new Properties();
		
		MailSSLSocketFactory sf = new MailSSLSocketFactory();
		sf.setTrustAllHosts(true);
		pro.put("mail.excegroup.ssl.enable", "true");
		pro.put("mail.excegroup.ssl.socketFactory", sf);
		pro.put("mail.excegroup.host", "mail.excegroup.com");// 存储发送邮件的服务器
		pro.put("mail.excegroup.auth", "true"); // 通过服务器验证
		pro.put("mail.excegroup.port", "25");
		
		Session s = Session.getInstance(pro); // 根据属性新建一个邮件会话
		// s.setDebug(true);

		// 由邮件会话新建一个消息对象
		MimeMessage message = new MimeMessage(s);


		try {
			// 设置邮件
			InternetAddress fromAddr = null;
			InternetAddress[] toAddr = new InternetAddress[recipientArr.length];
			for(int i=0;i<recipientArr.length;i++){
				toAddr[i] =  new InternetAddress(recipientArr[i]);
			}
			fromAddr = new InternetAddress("dmp@excegroup.com"); // 邮件发送地址
			message.setFrom(fromAddr); // 设置发送地址

			message.setRecipients(Message.RecipientType.TO, toAddr); // 设置接收地址
			
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
			message.setSubject(subject+"["+df.format(new Date())+"]"); // 设置邮件标题
			message.setText(context); // 设置邮件正文
			message.setSentDate(new Date()); // 设置邮件日期

			message.saveChanges(); // 保存邮件更改信息

			Transport transport = s.getTransport("smtp");
			transport.connect("mail.excegroup.com", "dmp@excegroup.com", "aaa@111"); // 服务器地址，邮箱账号，邮箱密码
			transport.sendMessage(message, message.getAllRecipients()); // 发送邮件
			transport.close();// 关闭

		} catch (Exception e) {
			e.printStackTrace();
			flag = false;// 发送失败
		}

		return flag;
	}
	
	public static boolean sendHtmlMail(String subject,String context,String[] recipientArr) throws GeneralSecurityException {
		boolean flag = true;

		// 建立邮件会话
		Properties pro = new Properties();
		
		MailSSLSocketFactory sf = new MailSSLSocketFactory();
		sf.setTrustAllHosts(true);
		pro.put("mail.excegroup.ssl.enable", "true");
		pro.put("mail.excegroup.ssl.socketFactory", sf);
		pro.put("mail.excegroup.host", "mail.excegroup.com");// 存储发送邮件的服务器
		pro.put("mail.excegroup.auth", "true"); // 通过服务器验证
		pro.put("mail.excegroup.port", "25");
		
		Session s = Session.getInstance(pro); // 根据属性新建一个邮件会话
		// s.setDebug(true);

		// 由邮件会话新建一个消息对象
		MimeMessage message = new MimeMessage(s);


		try {
			// 设置邮件
			InternetAddress fromAddr = null;
			InternetAddress[] toAddr = new InternetAddress[recipientArr.length];
			for(int i=0;i<recipientArr.length;i++){
				toAddr[i] =  new InternetAddress(recipientArr[i]);
			}
			fromAddr = new InternetAddress("dmp@excegroup.com"); // 邮件发送地址
			message.setFrom(fromAddr); // 设置发送地址

			message.setRecipients(Message.RecipientType.TO, toAddr); // 设置接收地址
			
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
			message.setSubject(subject+"["+df.format(new Date())+"]"); // 设置邮件标题
			
			//MimeMultipart类是一个容器类，包含MimeBodyPart类型的对象  
            Multipart mainPart = new MimeMultipart();
            //创建一个包含HTML内容的MimeBodyPart
            MimeBodyPart messageBodyPart = new MimeBodyPart();  
            //设置HTML内容  
            messageBodyPart.setContent(context,"text/html; charset=utf-8");  
            mainPart.addBodyPart(messageBodyPart);
            message.setContent(mainPart);
//			message.setText(context); // 设置邮件正文
			message.setSentDate(new Date()); // 设置邮件日期

			message.saveChanges(); // 保存邮件更改信息

			Transport transport = s.getTransport("smtp");
			transport.connect("mail.excegroup.com", "dmp@excegroup.com", "aaa@111"); // 服务器地址，邮箱账号，邮箱密码
			transport.sendMessage(message, message.getAllRecipients()); // 发送邮件
			transport.close();// 关闭

		} catch (Exception e) {
			e.printStackTrace();
			flag = false;// 发送失败
		}

		return flag;
	}
	
	public static void main(String[] args) throws GeneralSecurityException {
		String [] recipientArr = {"yunlong.wang@tendcloud.com"};
		sendMail("test", "test", recipientArr);
	}
}
