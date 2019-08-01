package com.talkingdata.marketing.batch.etl.pipelinenotice;

import com.talkingdata.marketing.core.constant.ChannelConstants;
import com.talkingdata.marketing.core.entity.campaign.BatchNotice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Pipeline通知任务--推送通知任务
 *
 * @author hongsheng
 * @create 2017-11-13-下午3:57
 * @since JDK 1.8
 */
@Component
public class PipelinePushNoticeJob extends AbstractPipelineNoticeJob {
    
    /**
     * logger
     */
    private static final Logger logger = LoggerFactory.getLogger(PipelinePushNoticeJob.class);

    @Override
    protected List<BatchNotice> getProcessData() throws Exception {
        logger.info("[Pipeline通知任务]--检索待执行推送通知数据");
        List<BatchNotice> lockBatchNotices = lockCurrentCalcBatchNotices(ChannelConstants.PUSH);
        List<BatchNotice> correctBatchNotices = filterBatchNotices(lockBatchNotices);
        logger.info("[Pipeline通知任务]--检索待执行推送通知数据为{}", correctBatchNotices);
        return correctBatchNotices;
    }

    @Override
    protected void notice(List<BatchNotice> notices) throws Exception {
        processBatchNotices(notices);
    }
}
