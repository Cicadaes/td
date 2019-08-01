package com.talkingdata.marketing.core.task;

import com.talkingdata.marketing.core.constant.CommonConstants;
import com.talkingdata.marketing.core.constant.DataDownloadConstants;
import com.talkingdata.marketing.core.entity.admin.EmailSendJobInput;
import com.talkingdata.marketing.core.entity.campaign.DataDownload;
import com.talkingdata.marketing.core.entity.thirdmodel.config.EmailTemplate;
import com.talkingdata.marketing.core.middleware.ConfigApi;
import com.talkingdata.marketing.core.middleware.CrowdApi;
import com.talkingdata.marketing.core.service.admin.EmailSendJobInputService;
import com.talkingdata.marketing.core.service.campaign.DataDownloadService;
import com.talkingdata.marketing.core.util.SpringContextUtil;
import com.talkingdata.marketing.core.util.mail.EmailConstant;
import com.tendcloud.enterprise.um.umic.entity.User;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * The type Crowd download 1 min task.
 * @author armeng
 */
@Component
public class CrowdDownload1MinTask implements Job, StatefulJob {
    private Logger logger = LoggerFactory.getLogger(getClass());

    private CrowdApi crowdApi;

    private ConfigApi configApi;

    private DataDownloadService dataDownloadService;

    private EmailSendJobInputService emailSendJobInputService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        initDependence();

        logger.info("crowd download start.");
        List<Integer> statusList = new ArrayList();

        statusList.add(DataDownloadConstants.DataDownloadStatusConstants.DATA_DOWNLOAD_WAITING);
        statusList.add(DataDownloadConstants.DataDownloadStatusConstants.DATA_DOWNLOAD_PROGRESS);
        List<DataDownload> dataDownloadList = dataDownloadService.getDataDownloadList(statusList);
        for (DataDownload dataDownload : dataDownloadList) {
            Integer status = DataDownloadConstants.DataDownloadStatusConstants.DATA_DOWNLOAD_PROGRESS;
            try {
                boolean crowdCheckReady = crowdApi.crowdCheckReady(dataDownload.getTaskId());
                if (crowdCheckReady) {
                    status = DataDownloadConstants.DataDownloadStatusConstants.DATA_DOWNLOAD_FINISH;
                    if (!CommonConstants.SYSTEM_USER.equals(dataDownload.getCreateBy())) {
                        String url = crowdApi.getCrowdDownloadUrl(dataDownload.getTaskId());
                        addToEmailSendJob(dataDownload, "人群下载通知", url);
                    }
                }
            } catch (Exception e) {
                status = DataDownloadConstants.DataDownloadStatusConstants.DATA_DOWNLOAD_FAIL;
                logger.error("check crowd status error",e);
            }
            dataDownload.setStatus(status);
            try {
                dataDownloadService.updateByPrimaryKeySelective(dataDownload);
            } catch (Exception e) {
                logger.error("crowd download updateByPrimaryKeySelective err");
                e.printStackTrace();
            }
        }
        logger.info("crowd download done.");
    }

    private void addToEmailSendJob(DataDownload dataDownload, String title, String url) throws Exception {
        User user = UmRmiServiceFactory.getSecurityService().getUserByUmId(dataDownload.getCreateBy());
        if (user == null) {
            logger.error("dataDownload " + dataDownload.getId() + "没有找到creator");
            return;
        }
        EmailSendJobInput emailSendJobInput = new EmailSendJobInput();
        emailSendJobInput.setTo(user.getEmail());
        emailSendJobInput.setTitle(title);
        emailSendJobInput.setStatus(EmailConstant.EmailSendStatusConstants.EMAIL_SEND_STATUS_UNSENT);
        emailSendJobInput.setEmailServerCode(CommonConstants.MAIL_SERVER_CODE);
        emailSendJobInput.setEmailTemplateCode(CommonConstants.MAIL_CROWD_TEMPLATE);
        emailSendJobInput.setCreateTime(new Date());
        emailSendJobInput.setMaxRetry(3);

        EmailTemplate emailTemplate = configApi.getEmailTemplate(CommonConstants.MAIL_CROWD_DOWNLOAD_TEMPLATE);
        String content = emailTemplate.getContent();
        content = content.replace("{crowdName}", dataDownload.getRefName())
                .replace("{url}", url)
                .replaceAll("\n", "<br/>");
        emailSendJobInput.setContent(content);
        emailSendJobInputService.insert(emailSendJobInput);
    }
    private void initDependence() {
        crowdApi = SpringContextUtil.getBean(CrowdApi.class);
        configApi = SpringContextUtil.getBean(ConfigApi.class);
        dataDownloadService = SpringContextUtil.getBean(DataDownloadService.class);
        emailSendJobInputService = SpringContextUtil.getBean(EmailSendJobInputService.class);
    }
}
