package com.talkingdata.marketing.batch.config;

import org.springframework.beans.BeansException;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Spring Application Context Manager
 * @author hongsheng
 * @create 2017-10-30-下午4:40
 * @since JDK 1.8
 */
public class ApplicationContextManager {

    private static Object lock = new Object();

    private static final ApplicationContextManager INSTANCE = new ApplicationContextManager();

    private AbstractApplicationContext applicationContext;

    private ApplicationContextManager() {
        synchronized (lock) {
            if (applicationContext == null) {
                applicationContext = new ClassPathXmlApplicationContext("classpath:config/marketing-batch-spring-config.xml");
            }
        }
    }

    public static ApplicationContextManager getInstance() {
        return INSTANCE;
    }

    public synchronized AbstractApplicationContext getApplicationContext() {
        if (applicationContext == null) {
            applicationContext = new ClassPathXmlApplicationContext("classpath:config/marketing-batch-spring-config.xml");
        }
        return applicationContext;
    }

    public <T> T getBean(Class<T> requiredType) throws BeansException {
        return getApplicationContext().getBean(requiredType);
    }

    public Object getBean(String name) throws BeansException {
        return getApplicationContext().getBean(name);
    }

    public <T> T getBean(String name, Class<T> requiredType) throws BeansException {
        return getApplicationContext().getBean(name, requiredType);
    }
}
