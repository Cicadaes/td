package com.talkingdata.marketing.batch.config;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.joran.JoranConfigurator;
import ch.qos.logback.core.util.StatusPrinter;
import org.slf4j.LoggerFactory;

import java.io.File;

/**
 * 加载logback外部配置的XML文件
 *
 * @author hongsheng
 * @create 2018-01-10-上午11:21
 * @since JDK 1.8
 */
public class LogbackInit {

    /**
     * 设置logback.xml配置文件并加载
     *
     * @param configFilepathName 配置文件路径名
     */
    public static void initLogback(String configFilepathName) {
        File file = new File(configFilepathName);
        LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
        JoranConfigurator joranConfigurator = new JoranConfigurator();
        joranConfigurator.setContext(loggerContext);
        loggerContext.reset();
        try {
            joranConfigurator.doConfigure(file);
        } catch (Exception e) {
            System.out.println(String.format("Load logback config file error. Message: ", e.getMessage()));
        }
        StatusPrinter.printInCaseOfErrorsOrWarnings(loggerContext);
    }
}
