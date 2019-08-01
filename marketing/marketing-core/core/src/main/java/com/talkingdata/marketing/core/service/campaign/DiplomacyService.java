package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.entity.admin.FunnelIndexDefinition;
import com.talkingdata.marketing.core.entity.campaign.AppConfig;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.campaign.SegmentTaskCalcObjectRecord;
import com.talkingdata.marketing.core.entity.thirdmodel.push.PushContent;
import com.talkingdata.marketing.core.page.admin.FunnelIndexDefinitionPage;
import com.talkingdata.marketing.core.page.admin.ProductPage;
import com.talkingdata.marketing.core.page.campaign.CampaignPage;
import com.talkingdata.marketing.core.service.admin.FunnelIndexDefinitionService;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.util.RandomUtil;
import com.talkingdata.marketing.core.util.data.PushLogTdId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * The type Diplomacy service.
 *
 * @author armeng
 * @create 2017 -05-10-下午4:25
 * @since JDK 1.8
 */
@Service("diplomacyService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class DiplomacyService {

    private static final Logger logger = LoggerFactory.getLogger(DiplomacyService.class);

    @Autowired
    private FunnelIndexDefinitionService funnelIndexDefinitionService;
    @Autowired
    private CampaignService campaignService;
    @Autowired
    private SegmentTaskCalcObjectRecordService segmentTaskCalcObjectRecordService;
    @Autowired
    private SegmentService segmentService;
    @Autowired
    private CrowdService crowdService;
    @Autowired
    private AppConfigService appConfigService;

    /**
     * Gets all funnel index definition.
     *
     * @return the all funnel index definition
     * @throws Exception the exception
     */
    public String getAllFunnelIndexDefinition() throws Exception {
        List<FunnelIndexDefinition> list = getFunnelIndexDefinitions();
        return parse2Result(list);
    }

    private String parse2Result(List<FunnelIndexDefinition> list) {
        StringBuilder builder = new StringBuilder();
        for (FunnelIndexDefinition index : list) {
            builder.append(index.getEventId()).append(",");
        }
        return builder.toString();
    }

    private List<FunnelIndexDefinition> getFunnelIndexDefinitions() throws Exception {
        FunnelIndexDefinitionPage page = new FunnelIndexDefinitionPage();
        page.setPageSize(Integer.MAX_VALUE);
        List<FunnelIndexDefinition> result = funnelIndexDefinitionService.queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    /**
     * Create push log.
     *
     * @param campaignIds the campaign ids
     * @throws Exception the exception
     */
    public void createPushLog(Integer[] campaignIds) throws Exception {
        List<Campaign> campaigns = getCampaigns(campaignIds);
        if (campaigns.isEmpty()) {
            logger.info("无需要生成PUSH LOG的营销活动");
            return;
        }
        createLog(campaigns);
    }

    private void createLog(List<Campaign> campaignList) throws Exception {
        List<SegmentTaskCalcObjectRecord> segmentTaskCalcObjectRecords = segmentTaskCalcObjectRecordService
                .listByCampaignIds(parseToCampaignIdList(campaignList));
        Map<Integer, Campaign> campaignMap = parse2Map(campaignList);
        String pushLogFile = System.getProperty("user.dir") + File.separator + "push_log.txt";
        logger.info("创建数据保存在：" + pushLogFile);
        try (FileWriter fw = new FileWriter(new File(pushLogFile)); BufferedWriter bw = new BufferedWriter(fw)) {
            doCreate(segmentTaskCalcObjectRecords, campaignMap, bw);
        } catch (Exception e) {
            logger.info("写入数据失败", e);
        }
    }

    private void doCreate(List<SegmentTaskCalcObjectRecord> segmentTaskCalcObjectRecords, Map<Integer, Campaign> campaignMap, BufferedWriter bw)
            throws Exception {
        for (SegmentTaskCalcObjectRecord index : segmentTaskCalcObjectRecords) {
            StringBuilder builder = new StringBuilder();
            // tdid
            builder.append(PushLogTdId.TD_ID.get(RandomUtil.getRandomValue(PushLogTdId.TD_ID.size() - 1))).append("\0");
            //PushId
            builder.append(index.getAttr1()).append("\0");
            //EventType
            builder.append(getEventType(RandomUtil.getRandomValue(5))).append("\0");

            String eventTime = getEventTime(index.getStartTime());
            //EventTime
            builder.append(eventTime).append("\0");
            // PromotionId
            builder.append(index.getSegmentId()).append("\0");

            Segment segment = getSegmentInfo(index.getSegmentId());
            Crowd crowd = getCrowdInfo(segment.getCrowdId());

            // PromotionName
            builder.append(segment.getName()).append("\0");

            Campaign campaign = campaignMap.get(index.getCampaignId());

            // CampaignId
            builder.append(campaign.getId()).append("\0");
            // CampaignName
            builder.append(campaign.getName()).append("\0");
            // CrowdId
            builder.append(crowd.getId()).append("\0");
            // CrowdName
            builder.append(crowd.getRefName()).append("\0");
            // CrowdType
            builder.append(crowd.getCrowdType()).append("\0");

            PushContent pushContent = JsonUtil.toObject(segment.getMessage(), PushContent.class);

            // Platform
            builder.append(getPlateform(pushContent.getOs())).append("\0");
            // AppId
            builder.append(pushContent.getApp()).append("\0");
            // AppName
            builder.append(getAppName(pushContent.getApp())).append("\0");

            // PushChannel
            builder.append(4).append("\0");
            // Day
            builder.append(getDay(eventTime));
            writeBuilder(bw, builder.toString());
        }
    }

    private void writeBuilder(BufferedWriter bw, String content) throws Exception {
        bw.append(content);
        bw.newLine();
        bw.flush();
    }

    private String getDay(String eventTime) throws Exception {
        DateFormat sf = new SimpleDateFormat("yyyyMMdd");
        return sf.format(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(eventTime));
    }

    private String getAppName(String appId) throws Exception {
        ProductPage page = new ProductPage();
        page.setSequencenumber(appId);
        AppConfig appConfig = appConfigService.queryBySingle(page);
        return appConfig == null ? null : appConfig.getAppName();
    }

    private String getPlateform(String os) throws Exception {
        String androidFlag = "a";
        if (androidFlag.equalsIgnoreCase(os)) {
            return "Android";
        }
        return "IOS";
    }

    private Segment getSegmentInfo(Integer segmentId) throws Exception {
        return segmentService.selectByPrimaryKey(segmentId);
    }

    private Crowd getCrowdInfo(Integer crowdId) throws Exception {
        return crowdService.selectByPrimaryKey(crowdId);
    }

    private String getEventTime(Date startTime) throws Exception {
        long currentTime = startTime.getTime() + (RandomUtil.getRandomValue(5 * 60 * 60 * 1000) + (1 * 60 * 60 * 1000));
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(currentTime));
    }

    private String getEventType(Integer randomValue) throws Exception {
        String eventType = "click";
        int typeSend = 1;
        int typeClick = 2;
        int typeArrivaled = 3;
        int typeImpressions = 4;
        if (randomValue == typeSend) {
            eventType = "send";
        }
        if (randomValue == typeClick) {
            eventType = "click";
        }
        if (randomValue == typeArrivaled) {
            eventType = "arrivaled";
        }
        if (randomValue == typeImpressions) {
            eventType = "impressions";
        }
        return eventType;
    }

    private Map<Integer, Campaign> parse2Map(List<Campaign> campaignList) throws Exception {
        Map<Integer, Campaign> result = new HashMap<>(16);
        for (Campaign index : campaignList) {
            result.put(index.getId(), index);
        }
        return result;
    }

    private List<Campaign> getCampaigns(Integer[] campaignIds) throws Exception {
        List<Campaign> result = new ArrayList<>();
        if (campaignIds == null || campaignIds.length == 0) {
            result = listCampaign();
        } else {
            result = listCampaignById(Arrays.asList(campaignIds));
        }
        return result;
    }

    private List<Campaign> listCampaignById(List<Integer> campaignIds) throws Exception {
        return campaignService.selectByIds(campaignIds);
    }

    private List<Campaign> listCampaign() throws Exception {
        CampaignPage page = new CampaignPage();
        page.setStartTime(new Date());
        page.setStartTimeOperator("<=");
        page.setEndTime(new Date());
        page.setEndTimeOperator(">=");
        return campaignService.queryByList(page);
    }

    private List<Integer> parseToCampaignIdList(List<Campaign> campaigns) {
        List<Integer> campaignIds = new ArrayList();
        for (Campaign campaign : campaigns) {
            campaignIds.add(campaign.getId());
        }
        return campaignIds;
    }
}
