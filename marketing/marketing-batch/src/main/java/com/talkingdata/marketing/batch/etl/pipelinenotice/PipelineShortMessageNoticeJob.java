package com.talkingdata.marketing.batch.etl.pipelinenotice;

import com.talkingdata.marketing.core.constant.ChannelConstants;
import com.talkingdata.marketing.core.entity.campaign.BatchNotice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Pipeline通知任务--短信通知任务
 *
 * @author hongsheng
 * @create 2017-11-17-下午3:01
 * @since JDK 1.8
 */
@Component
public class PipelineShortMessageNoticeJob extends AbstractPipelineNoticeJob {

    /**
     * logger
     */
    private static final Logger logger = LoggerFactory.getLogger(PipelineShortMessageNoticeJob.class);

    @Override
    protected List<BatchNotice> getProcessData() throws Exception {
        logger.info("[Pipeline通知任务]--检索待执行短信通知数据");
        List<BatchNotice> lockBatchNotices = lockCurrentCalcBatchNotices(ChannelConstants.SMS);
        List<BatchNotice> correctBatchNotices = filterBatchNotices(lockBatchNotices);
        logger.info("[Pipeline通知任务]--检索待执行短信通知数据为{}", correctBatchNotices);
        return correctBatchNotices;
    }

    @Override
    protected void notice(List<BatchNotice> notices) throws Exception {
        processBatchNotices(notices);
    }
}
