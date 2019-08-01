package com.talkingdata.marketing.core.page.campaign.extend;

import com.talkingdata.marketing.core.constant.CampaignConstant;
import com.talkingdata.marketing.core.constant.CampaignConstant.CampaignStatusConstant;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.page.campaign.CampaignPage;
import com.talkingdata.marketing.core.util.DateUtil;
import java.text.ParseException;

/**
 * The type Campaign extend page.
 * @author xiaoming.kang
 */
public class CampaignExtendPage extends CampaignPage {
    private String dateRange;
    private String targetReachSituation;
    private String statusStr;

    /**
     * Gets status str.
     *
     * @return the status str
     */
    public String getStatusStr() {
        return statusStr;
    }

    /**
     * Sets status str.
     *
     * @param statusStr the status str
     */
    public void setStatusStr(String statusStr) {
        this.statusStr = statusStr;
    }

    /**
     * Gets target reach situation.
     *
     * @return the target reach situation
     */
    public String getTargetReachSituation() {
        return targetReachSituation;
    }

    /**
     * Sets target reach situation.
     *
     * @param targetReachSituation the target reach situation
     */
    public void setTargetReachSituation(String targetReachSituation) {
        this.targetReachSituation = targetReachSituation;
    }

    /**
     * Gets date range.
     *
     * @return the date range
     */
    public String getDateRange() {
        return dateRange;
    }

    /**
     * Sets date range.
     *
     * @param dateRange the date range
     */
    public void setDateRange(String dateRange) {
        this.dateRange = dateRange;
    }

    /**
     * To campaign extend campaign extend page.
     *
     * @param campaign the campaign
     * @return the campaign extend page
     * @throws ParseException the parse exception
     */
    public static CampaignExtendPage toCampaignExtend(Campaign campaign) throws ParseException {
        CampaignExtendPage campaignExtendPage = new CampaignExtendPage();
        campaignExtendPage.setId(campaign.getId()+"");
        campaignExtendPage.setName(campaign.getName());
        campaignExtendPage.setDescription(campaign.getDescription());
        int status = calcCampaignStatus(campaign);
        campaignExtendPage.setStatus(campaign.getStatus()+"");
        String startTime = DateUtil.date2String("yyyy-MM-dd", campaign.getStartTime());
        String endTime = DateUtil.date2String("yyyy-MM-dd", campaign.getEndTime());
        campaignExtendPage.setDateRange(startTime+"~"+endTime);
        campaignExtendPage.setStatus(new Integer(status).toString());
        campaignExtendPage.setStatusStr(CampaignConstant.CAMPAIGN_STATUS_MAP.get(status));
        campaignExtendPage.setCreator(campaign.getCreator());
        campaignExtendPage.setStartTime(campaign.getStartTime());
        campaignExtendPage.setEndTime(campaign.getEndTime());
        return campaignExtendPage;
    }

    /**
     * Calc campaign status integer.
     *
     * @param campaign the campaign
     * @return the integer
     */
    public static Integer calcCampaignStatus(Campaign campaign) {
        Long now = System.currentTimeMillis();
        if (campaign.getStartTime().getTime() > now){
            return CampaignStatusConstant.CAMPAIGN_WAITING;
        }else if (campaign.getStartTime().getTime()<=now && campaign.getEndTime().getTime()>=now){
            return CampaignStatusConstant.CAMPAIGN_RUNNING;
        }else if (campaign.getEndTime().getTime()<now){
            return CampaignStatusConstant.CAMPAIGN_FINISH;
        }
        return 0;
    }
}

