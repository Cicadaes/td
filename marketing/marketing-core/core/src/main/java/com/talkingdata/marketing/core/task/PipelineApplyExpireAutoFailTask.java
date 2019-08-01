package com.talkingdata.marketing.core.task;

import com.talkingdata.marketing.core.constant.PipelineDefinitionConstant;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.dto.PipelineDefinitionDto;
import com.talkingdata.marketing.core.page.campaign.PipelineDefinitionPage;
import com.talkingdata.marketing.core.page.campaign.extend.PipelineDefinitionExtendPage;
import com.talkingdata.marketing.core.service.campaign.PipelineDefinitionService;
import com.talkingdata.marketing.core.service.campaign.SegmentService;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.core.util.SpringContextUtil;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;
import java.util.Date;
import java.util.List;

/**
 *
 * @author xiaoming.kang
 * @date 2018/01/25
 */
public class PipelineApplyExpireAutoFailTask implements Job,StatefulJob{
    private static final Logger logger = LoggerFactory.getLogger(PipelineApplyExpireAutoFailTask.class);

    private PipelineDefinitionService pipelineDefinitionService;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        logger.info("==========营销活动过期申请自动审核不通过任务.启动=============================");
        initDependence();
        try {
            PipelineDefinitionPage page = new PipelineDefinitionPage();
            page.getPager().setPageEnabled(false);
            page.setStatus(PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_APPLY_TO_ONLINE+"");
            page.setStartTime2(DateUtil.formatDateTime(new Date(),"yyyy-MM-dd HH:mm:ss"));
            List<PipelineDefinition> pipelineDefinitionList =  pipelineDefinitionService.queryByList(page);
            logger.info("==========营销活动过期申请自动审核不通过任务.发现符合条件的营销活动有 {} 条",pipelineDefinitionList.size());
            for(PipelineDefinition pipeline : pipelineDefinitionList){
                updatePipelineStatus(pipeline.getId(), PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_APPLY_FAIL);
            }
        } catch (Exception e) {
            logger.error("==========营销活动过期申请自动审核不通过任务.异常.",e);
        }
        logger.info("==========营销活动过期申请自动审核不通过任务.结束=============================");
    }

    private void updatePipelineStatus(Integer id, Integer status) throws Exception {
        PipelineDefinition pipe = new PipelineDefinition();
        pipe.setId(id);
        pipe.setStatus(status);
        pipelineDefinitionService.updateByPrimaryKeySelective(pipe);
    }

    private void initDependence() {
        pipelineDefinitionService = SpringContextUtil.getBean(PipelineDefinitionService.class);
    }
}
