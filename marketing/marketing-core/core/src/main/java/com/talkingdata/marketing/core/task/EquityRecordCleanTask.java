package com.talkingdata.marketing.core.task;

import com.talkingdata.marketing.core.service.campaign.EquityRecordService;
import com.talkingdata.marketing.core.util.SpringContextUtil;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * The type Equity record clean task.
 * @author armeng
 */
@Component
public class EquityRecordCleanTask implements Job, StatefulJob {
    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private EquityRecordService equityRecordService;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        initDependence();
        logger.info("equity record clean start.");
        try {
            equityRecordService.clean();
        } catch (Exception e) {
            e.printStackTrace();
        }
        logger.info("equity record clean finish.");
    }

    private void initDependence() {
        equityRecordService = SpringContextUtil.getBean(EquityRecordService.class);
    }
}
