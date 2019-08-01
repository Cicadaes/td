package com.talkingdata.marketing.batch.config;

import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.service.campaign.CampaignService;
import org.junit.Test;

/**
 * ApplicationContextManager Test Class
 * @author hongsheng
 * @create 2017-10-30-下午5:16
 * @since JDK 1.8
 */
public class ApplicationContextManagerTest {

    @Test
    public void getBean() throws Exception {
        ApplicationContextManager instance = ApplicationContextManager.getInstance();
        CampaignService campaignService = instance.getBean("campaignService", CampaignService.class);
        Campaign campaign = campaignService.selectByPrimaryKey(329);
        System.out.println("营销活动名称是： " + campaign.getName());
    }
}
