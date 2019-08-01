package td.enterprise.common.util;

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

public class MailUtil {
	
	/**
	 * 邮箱地址
	 */
	private static String address;
	/**
	 * 密码
	 */
	private static String password;
	/*
	 * 主机
	 */
	private static String host;
	/**
	 * 端口
	 */
	private static String port;
	/**
	 * 是否校验
	 */
	private static String auth;
	/**
	 * 启用starttls
	 */
	private static String starttls;
	/**
	 * 邮件显示地址
	 */
	private static String name;
	/**
	 * 传输类型
	 */
	private static String transType;
	
	public static void init(String address,String password,String host,String port,String auth,String starttls,String name,String transType) {
		MailUtil.address = address;
		MailUtil.password = password;
		MailUtil.host = host;
		MailUtil.port = port;
		MailUtil.auth = auth;
		MailUtil.starttls = starttls;
		MailUtil.name = name;
		MailUtil.transType = transType;
	}

	public static boolean sendMail(String subject,String context,String[] recipientArr) throws GeneralSecurityException {
		boolean flag = true;

		// 建立邮件会话
		Properties pro = new Properties();
		
		pro.setProperty("mail.smtp.from", address);
		pro.setProperty("mail.smtp.password", password);
		pro.setProperty("mail.smtp.host", host);
		pro.setProperty("mail.smtp.port", port);
		pro.setProperty("mail.smtp.auth", auth);
	    pro.setProperty("mail.smtp.starttls.enable", starttls);
		
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
			fromAddr = new InternetAddress(name); // 邮件显示地址
			message.setFrom(fromAddr); // 设置发送地址

			message.setRecipients(Message.RecipientType.TO, toAddr); // 设置接收地址
			
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
			message.setSubject(subject+"["+df.format(new Date())+"]"); // 设置邮件标题
			message.setText(context); // 设置邮件正文
			message.setSentDate(new Date()); // 设置邮件日期

			message.saveChanges(); // 保存邮件更改信息

			Transport transport = s.getTransport(transType);
			transport.connect(host, address, password); // 服务器地址，邮箱账号，邮箱密码
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
		
		pro.setProperty("mail.smtp.from", address);
		pro.setProperty("mail.smtp.password", password);
		pro.setProperty("mail.smtp.host", host);
		pro.setProperty("mail.smtp.port", port);
		pro.setProperty("mail.smtp.auth", auth);
	    pro.setProperty("mail.smtp.starttls.enable", starttls);
		
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
			fromAddr = new InternetAddress(name); // 邮件显示地址
			message.setFrom(fromAddr); // 设置发送地址

			message.setRecipients(Message.RecipientType.TO, toAddr); // 设置接收地址
			
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
			message.setSubject(subject+" ["+df.format(new Date())+"]"); // 设置邮件标题
			
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

			Transport transport = s.getTransport(transType);
			transport.connect(host, address, password); // 服务器地址，邮箱账号，邮箱密码
			transport.sendMessage(message, message.getAllRecipients()); // 发送邮件
			transport.close();// 关闭

		} catch (Exception e) {
			e.printStackTrace();
			flag = false;// 发送失败
		}

		return flag;
	}
	
	public  static void sendMail (String mailTitle, String content){
		String recipients = "ran.li@tendcloud.com";
		String[] recipientArr = recipients.split(",");

		try {
			MailUtil.sendMail(mailTitle, content, recipientArr);
		} catch (GeneralSecurityException e) {
			e.printStackTrace();
		}
	}
}
