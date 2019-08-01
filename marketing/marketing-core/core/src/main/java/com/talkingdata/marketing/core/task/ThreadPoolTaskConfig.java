package com.talkingdata.marketing.core.task;

import com.talkingdata.marketing.core.constant.ParamConstants;
import com.talkingdata.marketing.core.middleware.ConfigApi;
import org.apache.commons.lang3.concurrent.BasicThreadFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

import java.util.concurrent.Executor;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;


//@Configuration
/**
 * The type Thread pool task config.
 * @author armeng
 */
public class ThreadPoolTaskConfig implements SchedulingConfigurer {
    /**
     *
     */
    private static final Logger logger = LoggerFactory.getLogger(ThreadPoolTaskConfig.class);
    @Autowired
    private ConfigApi configApi;

    @Override
    public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar) {
        scheduledTaskRegistrar.setScheduler(taskExecutor());
    }

    /**
     * Task executor executor.
     *
     * @return the executor
     */
    @Bean(destroyMethod="shutdown")
    public Executor taskExecutor() {
        String message = configApi.getParam(ParamConstants.SCHEDULE_THREAD_POOL_SIZE, ParamConstants.SYSTEM_CODE);
        int poolSize = 4;
        if (message != null) {
            try {
                poolSize = Integer.parseInt(message);
            } catch (Exception e) {
                logger.error("load pool size err{}",e);
                e.printStackTrace();
            }
        }
        logger.info("cron task pool init "+poolSize+" thread.");

        ScheduledExecutorService executorService = new ScheduledThreadPoolExecutor(poolSize,
                new BasicThreadFactory.Builder().namingPattern("marketing-schedule-pool-%d").daemon(true).build());
        return executorService;
    }
}
