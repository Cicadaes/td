package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.model.GenerateCrowd;
import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.exception.NodeOperatorException;
import com.talkingdata.marketing.streaming.pipeline.definition.node.GenerateCrowdNodeDefinition;
import com.talkingdata.marketing.streaming.util.DateUtil;
import com.tendcloud.tenddata.entity.EventPackage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * 人群生成算子
 *
 * @author hongsheng
 * @create 2017-09-27-下午6:03
 * @since JDK 1.8
 */
@Component
public class GenerateCrowdNodeOperator extends AbstractOperator {
    private static final Logger logger = LoggerFactory.getLogger(GenerateCrowdNodeOperator.class);

    /**
     * 判断采集时间生成人群
     *
     * @param pipelineDefinition pipeline数据
     * @param nodeDefinition     当前执行的具体算子
     * @param eventPackage       用户的属性、行为等数据
     * @return null：rectime为空或不在时间区间中，EventPackage：存在时间区间中
     * @throws NodeOperatorException  NodeOperatorException
     * @throws CrowdNotMatchException 如果eventpackage人群id与算子人群id不符，抛出此异常
     */
    @Override
    public GenerateCrowd executor(PipelineDefinition pipelineDefinition, AbstractNodeDefinition nodeDefinition,
                                 EventPackage eventPackage) throws NodeOperatorException, CrowdNotMatchException {
        validateCrowdIsMatch(pipelineDefinition, eventPackage, nodeDefinition);
        GenerateCrowdNodeDefinition generateCrowdNodeDef;
        if (nodeDefinition instanceof GenerateCrowdNodeDefinition) {
            generateCrowdNodeDef = (GenerateCrowdNodeDefinition) nodeDefinition;
        } else {
            throw new NodeOperatorException("AbstractNodeDefinition 不是正确的 FilterNodeDefinition");
        }
        if (eventPackage.rectime == null) {
            logger.error("mDeviceId: {}, EventPackage rectime is null", eventPackage.mDeviceId);
            return null;
        }
        // 采集时间 rectime
        Long startTime = generateCrowdNodeDef.getAcquisitionStartTime();
        Long endTime = generateCrowdNodeDef.getAcquisitionEndTime();
        if (startTime != null && endTime != null) {
            if (eventPackage.rectime >= startTime && eventPackage.rectime < endTime) {
                return new GenerateCrowd(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), eventPackage.additiveProfile.offset);
            }
        } else {
            return new GenerateCrowd(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), eventPackage.additiveProfile.offset);
        }
        logger.warn("mDeviceId: {}, pipelineId:{}, nodeName: {}, rectime: {}, startTime: {}, endTime: {}, generateCrowdOperator return null, ",
                eventPackage.mDeviceId, nodeDefinition.getPipelineDefinitionId(), nodeDefinition.getName(),
                DateUtil.format(eventPackage.rectime, DateUtil.dtf_y4mmdd_hhmmss), DateUtil.format(startTime, DateUtil.dtf_y4mmdd_hhmmss),
                DateUtil.format(endTime, DateUtil.dtf_y4mmdd_hhmmss));
        return null;
    }

}
