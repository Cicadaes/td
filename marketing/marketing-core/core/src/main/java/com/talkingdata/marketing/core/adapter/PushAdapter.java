package com.talkingdata.marketing.core.adapter;

import com.talkingdata.marketing.core.constant.PushConstants;
import com.talkingdata.marketing.core.entity.admin.ChannelDefinition;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.campaign.SegmentTaskCalcObjectRecord;
import com.talkingdata.marketing.core.entity.thirdmodel.push.PushBindModel;
import com.talkingdata.marketing.core.entity.thirdmodel.push.PushContent;
import com.talkingdata.marketing.core.middleware.PushMessageApi;
import com.talkingdata.marketing.core.page.dto.CrowdMsgDto;
import com.talkingdata.marketing.core.service.campaign.SegmentTaskCalcObjectRecordService;
import com.talkingdata.marketing.core.util.CrowdCsvUtil;

import com.talkingdata.marketing.core.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;

/**
 * @author tao.yang
 */
@Component
public class PushAdapter implements IAdapter{
    @Autowired
    private PushMessageApi pushMessageApi;
    @Autowired
    private SegmentTaskCalcObjectRecordService segmentTaskCalcObjectRecordService;

    @Override
    public void send(Map<String, Object> context, String deviceText, Segment segment, boolean fileUpload) throws Exception{
        String source = (String)context.get("source");
        String pushBaseUrl = (String)context.get("baseUrl");
        String username = (String)context.get("username");
        String password = (String)context.get("password");

        int accurate = PushConstants.GatewayAccurateConstant.GATEWAY_ACCURATE_INPUT;
        String devices = deviceText;
        if (fileUpload) {
            CrowdMsgDto msg = CrowdCsvUtil.parseText(deviceText);
            devices = msg.getContent();
            if (msg.getJson()) {
                accurate = PushConstants.GatewayAccurateConstant.GATEWAY_ACCURATE_JSON;
            }
        }

        PushContent pushContent = JsonUtil.toObject(segment.getMessage(), PushContent.class);
        String message = JsonUtil.toJson(pushContent.getMessages());
        String resp = pushMessageApi.push(pushContent.getApp(), pushContent.getOs(), accurate, devices, source, message);
        bindPush(segment, resp);
    }

    @Override
    public void send(Map<String, Object> context, ChannelDefinition channelDefinition, Segment segment) {
        //todo 暂不实现
    }

    @Override
    public void testSend(Map<String, Object> context, ChannelDefinition channelDefinition, String id, Segment segment) {
        //todo 暂不实现
    }

    private void bindPush(Segment segment, String resp) throws Exception {
        PushBindModel[] models = JsonUtil.toObject(resp, PushBindModel[].class);
        Date createTime = new Date();
        if (models != null && models.length > 0) {
            for (PushBindModel model : models) {
                SegmentTaskCalcObjectRecord segmentTaskCalcObjectRecord = new SegmentTaskCalcObjectRecord();
                segmentTaskCalcObjectRecord.setCampaignId(segment.getCampaignId());
                segmentTaskCalcObjectRecord.setCampaignLaunchUnitId(segment.getCampaignLaunchUnitId());
                segmentTaskCalcObjectRecord.setSegmentId(segment.getId());
                //todo 将attr1存储为json形式
                segmentTaskCalcObjectRecord.setAttr1(model.getPush());
                segmentTaskCalcObjectRecord.setCreateTime(createTime);
                segmentTaskCalcObjectRecord.setStartTime(createTime);
                segmentTaskCalcObjectRecord.setTenantId(segment.getTenantId());
                segmentTaskCalcObjectRecord.setCreator(segment.getCreator());
                segmentTaskCalcObjectRecord.setCreateBy(segment.getCreateBy());
                segmentTaskCalcObjectRecordService.insert(segmentTaskCalcObjectRecord);
            }
        }
    }
}
