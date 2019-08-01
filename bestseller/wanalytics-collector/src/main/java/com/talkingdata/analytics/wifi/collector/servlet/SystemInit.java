package com.talkingdata.analytics.wifi.collector.servlet;

import com.talkingdata.analytics.wifi.collector.config.Configuration;
import com.talkingdata.analytics.wifi.collector.control.AsyncProcesser;
import com.talkingdata.analytics.wifi.collector.runtime.Domain;
import com.talkingdata.analytics.wifi.collector.service.CollectorService;
import com.talkingdata.analytics.wifi.collector.service.KafkaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.util.Properties;

/**
 * 系统初始化程序
 */
public class SystemInit implements ServletContextListener {

    private static Logger logger = LoggerFactory.getLogger(SystemInit.class);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        Domain.domain = Configuration.get("domain");

        // 初始化相关实例（以后建议使用Spring管理）
        Properties props = Configuration.get();
        KafkaService kafkaService = KafkaService.getInstance(props);
        CollectorService collectorService = CollectorService.getInstance();
        collectorService.setKafkaService(kafkaService);

        AsyncProcesser.getInstance();

        logger.info("System init success.");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // do nothing
    }

}
