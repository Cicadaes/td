package com.talkingdata.datacloud.visual.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

//import javax.mail.internet.MimeMessage;

/**
 * Created by yangruobin on 2017/5/15.
 */
@Component
public class EmailComponent {

    private static String emailHost;

    private static Integer emailPort;

    private static String emailUsername;

    private static String emailPassword;

    private static boolean smtpAuth;

    private static Integer smtpTimeOut;

    private static boolean starttlsEnable;

    @Value("${email_host}")
    public void setEmailHost(String emailHost) {
        EmailComponent.emailHost = emailHost;
    }
    @Value("${email_port}")
    public void setEmailPort(Integer emailPort) {
        EmailComponent.emailPort = emailPort;
    }
    @Value("${email_username}")
    public void setEmailUsername(String emailUsername) {
        EmailComponent.emailUsername = emailUsername;
    }
    @Value("${email_password}")
    public void setEmailPassword(String emailPassword) {
        EmailComponent.emailPassword = emailPassword;
    }
    @Value("${mail_smtp_auth}")
    public void setSmtpAuth(boolean smtpAuth) {
        EmailComponent.smtpAuth = smtpAuth;
    }
    @Value("${mail_smtp_timeout}")
    public void setSmtpTimeOut(Integer smtpTimeOut) {
        EmailComponent.smtpTimeOut = smtpTimeOut;
    }
    @Value("${mail_smtp_starttls_enable}")
    public void setStarttlsEnable(boolean starttlsEnable) {
        EmailComponent.starttlsEnable = starttlsEnable;
    }


    public static boolean sendHtmlEmail(String toEmail,String subject,String url) throws Exception{
        JavaMailSenderImpl senderImpl = new JavaMailSenderImpl();

        // 设定mail server
        senderImpl.setHost(emailHost);
        senderImpl.setPort(emailPort);
        senderImpl.setUsername(emailUsername); // 根据自己的情况,设置username
        senderImpl.setPassword(emailPassword); // 根据自己的情况, 设置password

//        // 建立邮件消息,发送简单邮件和html邮件的区别
//        MimeMessage mailMessage = senderImpl.createMimeMessage();
//        MimeMessageHelper messageHelper = new MimeMessageHelper(mailMessage);
//
//         //设置收件人，寄件人
//        messageHelper.setTo(toEmail);
//        messageHelper.setFrom(senderImpl.getUsername());
//        messageHelper.setSubject(subject);
//        // true 表示启动HTML格式的邮件
//        messageHelper.setText("<html><head></head><body><h1>"+url+"</h1></body></html>", true);
//
//        Properties prop = new Properties();
//        prop.put("mail.smtp.auth", smtpAuth); // 将这个参数设为true，让服务器进行认证,认证用户名和密码是否正确
//        prop.put("mail.smtp.timeout", smtpTimeOut);
//        prop.put("mail.smtp.starttls.enable", starttlsEnable);
//        senderImpl.setJavaMailProperties(prop);
//        // 发送邮件
//        senderImpl.send(mailMessage);
        return true;
    }



    public static void main(String []args){

        try {
            EmailComponent.sendHtmlEmail("345047797@qq.com","测试HTML邮件！","http://www.baidu.com");
        }catch (Exception e){
            e.printStackTrace();
        }

    }

}
