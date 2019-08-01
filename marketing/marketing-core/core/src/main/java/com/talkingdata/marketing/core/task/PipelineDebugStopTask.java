package com.talkingdata.marketing.core.task;

import com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant;
import com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineInstanceConstant;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.campaign.PipelineInstance;
import com.talkingdata.marketing.core.page.campaign.PipelineDefinitionPage;
import com.talkingdata.marketing.core.page.campaign.PipelineInstancePage;
import com.talkingdata.marketing.core.service.campaign.PipelineDefinitionService;
import com.talkingdata.marketing.core.service.campaign.PipelineInstanceService;
import com.talkingdata.marketing.core.util.SpringContextUtil;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;

/**
 * 定时停止Pipeline debug
 *
 * @author Created by tend on 2018/1/17.
 */
public class PipelineDebugStopTask implements Job, StatefulJob {

    private Logger logger = LoggerFactory.getLogger(PipelineDebugStopTask.class);
    private PipelineDefinitionService pipelineDefService = SpringContextUtil.getBean(PipelineDefinitionService.class);
    private PipelineInstanceService pipelineInstanceService = SpringContextUtil.getBean(PipelineInstanceService.class);

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        List<PipelineDefinition> testingPipeline = findTestingPipeline();
        if (testingPipeline == null || testingPipeline.isEmpty()) {
            logger.info("testing pipelineDefinition does not exist");
        } else {
            logger.info("testing pipelineDefinition: {} ", testingPipeline.size());
            long current = System.currentTimeMillis();
            int oneDay = 24 * 60 * 60 * 1000;
            for (PipelineDefinition pipelineDef : testingPipeline) {
                PipelineInstance pipelineInstance = findPipelineInstance(pipelineDef);
                if (pipelineInstance != null) {
                    // 如果距离当前时间差一天则停止debug
                    if ((current - pipelineInstance.getSubmitTime().getTime()) >= oneDay) {
                        try {
                            pipelineDefService.debugStopPipeline(pipelineDef);
                            logger.info("campaignId: {}, pipelineDefinitionId: {}, version: {}, debug stop success",
                                    pipelineDef.getCampaignId(), pipelineDef.getId(), pipelineDef.getVersion());
                        } catch (Exception e) {
                            logger.error("campaignId: {}, pipelineDefinitionId: {}, version: {}, debug stop has exception: ",
                                    pipelineDef.getCampaignId(), pipelineDef.getId(), pipelineDef.getVersion(), e);
                        }
                    }
                }
            }
        }
    }

    /**
     * 根据PipelineDefinition查询对应的PipelineInstance，状态为执行中的
     */
    private PipelineInstance findPipelineInstance(PipelineDefinition pipelineDef) {
        PipelineInstancePage instancePage = new PipelineInstancePage();
        instancePage.setCampaignId(String.valueOf(pipelineDef.getCampaignId()));
        instancePage.setPipelineDefinitionId(String.valueOf(pipelineDef.getId()));
        instancePage.setVersion(pipelineDef.getVersion());
        instancePage.setStatus(String.valueOf(PipelineInstanceConstant.PIPELINE_INSTANCE_STATUS_PROCESSING));
        PipelineInstance pipelineInstance;
        try {
            pipelineInstance = pipelineInstanceService.queryBySingle(instancePage);
            if (pipelineInstance == null) {
                instancePage.setStatus(String.valueOf(PipelineInstanceConstant.PIPELINE_INSTANCE_STATUS_UNSTART));
                pipelineInstance = pipelineInstanceService.queryBySingle(instancePage);
            }
        } catch (Exception e) {
            pipelineInstance = null;
            logger.error("campaignId: {}, pipelineDefinitionId: {}, version: {}, status: {}, query pipelineInstance has exception: ",
                    pipelineDef.getCampaignId(), pipelineDef.getId(), pipelineDef.getVersion(),
                    PipelineInstanceConstant.PIPELINE_INSTANCE_STATUS_PROCESSING, e);
        }
        return pipelineInstance;
    }

    /**
     *  查询所有在测试中的Pipeline
     */
    private List<PipelineDefinition> findTestingPipeline() {
        List<PipelineDefinition> testingPipeline;
        PipelineDefinitionPage page = new PipelineDefinitionPage();
        page.setStatus(String.valueOf(PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_TESTING));
        page.setPageSize(Integer.MAX_VALUE);
        try {
            testingPipeline = pipelineDefService.queryByList(page);
        } catch (Exception e) {
            testingPipeline = Collections.emptyList();
            logger.error("query testing pipelineDefinition has exception: ", e);
        }
        return testingPipeline;
    }
}
