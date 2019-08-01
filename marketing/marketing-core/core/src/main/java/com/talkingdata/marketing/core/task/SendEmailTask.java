package com.talkingdata.marketing.core.task;

import com.talkingdata.marketing.core.entity.admin.EmailSendJobInput;
import com.talkingdata.marketing.core.entity.thirdmodel.config.EmailServer;
import com.talkingdata.marketing.core.middleware.ConfigApi;
import com.talkingdata.marketing.core.service.admin.EmailSendJobInputService;
import com.talkingdata.marketing.core.util.SpringContextUtil;
import com.talkingdata.marketing.core.util.mail.EmailConstant;
import com.talkingdata.marketing.core.util.mail.MailUtils;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * The type Email 2 min task.
 * @author armeng
 */
@Component public class SendEmailTask implements Job, StatefulJob {
    private Logger logger = LoggerFactory.getLogger(getClass());

    private ConfigApi configApi;

    private EmailSendJobInputService emailSendJobInputService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        initDependence();

        logger.info("email send start.");
        boolean result = false;
        logger.info("触发定时任务:邮件发送[EmailSendJob]");
        try {
            //查询要发送的邮件配置
            List<EmailSendJobInput> emailSendList = emailSendJobInputService.findValid();
            if(emailSendList!=null){
                logger.debug("待发送邮件有:"+emailSendList.size()+"封.");
            }
            for (int i = 0; emailSendList != null && i < emailSendList.size(); i++) {
                EmailSendJobInput emailSend = emailSendList.get(i);
                try {
                    //设置邮件发送信息
                    EmailServer mailServerConfig = configApi.getEmailServerConfig(emailSend.getEmailServerCode());
                    MailUtils mail = new MailUtils();
                    //邮件服务器设置
                    mail.setFrom(mailServerConfig.getUser());
                    mail.setHost(mailServerConfig.getMailHost());
                    mail.setPort(mailServerConfig.getSmtpPort());
                    //mailServerConfig.getUser() 格式为发送用户邮箱 从中截取用户名
                    String userName = mailServerConfig.getUser().substring(0, mailServerConfig.getUser().indexOf("@"));
                    mail.setUserName(userName);
                    mail.setPassword(mailServerConfig.getPassword());
                    result = mail.sendMail(emailSend.getTo(), emailSend.getTitle(), emailSend.getContent(), emailSend.getAttachmentPath(), emailSend.getAttachmentDisplayName());
                } catch (Exception e) {
                    logger.error("邮件发送异常!",e);
                }finally{
                    EmailSendJobInput newEmailSend = new EmailSendJobInput();
                    newEmailSend.setId(emailSend.getId());
                    //修改状态
                    if(result){
                        logger.debug("邮件发送成功!");
                        newEmailSend.setStatus(EmailConstant.EmailSendStatusConstants.EMAIL_SEND_STATUS_SEND);
                    }
                    else{
                        logger.error("邮件发送失败!");
                        if(emailSend.getStatus()!= EmailConstant.EmailSendStatusConstants.EMAIL_SEND_STATUS_RETRY){
                            if(emailSend.getMaxRetry()!=null&&emailSend.getMaxRetry() !=0) {
                                newEmailSend.setStatus(EmailConstant.EmailSendStatusConstants.EMAIL_SEND_STATUS_RETRY);
                            } else {
                                newEmailSend.setStatus(EmailConstant.EmailSendStatusConstants.EMAIL_SEND_STATUS_FAILED);
                            }
                            newEmailSend.setRetry(0);
                        }else if(emailSend.getRetry()+1==emailSend.getMaxRetry()){
                            newEmailSend.setStatus(EmailConstant.EmailSendStatusConstants.EMAIL_SEND_STATUS_FAILED);
                            newEmailSend.setRetry(emailSend.getRetry()+1);
                        }else{
                            newEmailSend.setRetry(emailSend.getRetry()+1);
                        }
                    }
                    emailSendJobInputService.updateByPrimaryKeySelective(newEmailSend);
                }
            }
            logger.debug("定时任务:邮件发送[EmailSendJob],已执行完毕.");
        } catch (Exception e) {
            logger.error("数据库连接异常!",e);
        }
        logger.info("email send done.");
    }

    private void initDependence() {
        configApi = SpringContextUtil.getBean(ConfigApi.class);
        emailSendJobInputService = SpringContextUtil.getBean(EmailSendJobInputService.class);
    }
}
