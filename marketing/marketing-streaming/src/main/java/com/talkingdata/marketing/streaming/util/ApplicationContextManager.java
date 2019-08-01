package com.talkingdata.marketing.streaming.util;

import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import org.springframework.beans.BeansException;
import org.springframework.cache.Cache;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * @author Created by yangtao on 2017/9/20.
 */
public class ApplicationContextManager {

    private static final Object LOCK = new Object();

    private static final ApplicationContextManager INSTANCE = new ApplicationContextManager();

    private AbstractApplicationContext applicationContext;

    private ApplicationContextManager() {
        synchronized (LOCK) {
            if (applicationContext == null) {
                applicationContext = new ClassPathXmlApplicationContext("classpath:marketing-streaming-spring-beans.xml");
            }
        }
    }

    public static ApplicationContextManager getInstance() {
        return INSTANCE;
    }

    public synchronized AbstractApplicationContext getApplicationContext() {
        if (applicationContext == null) {
            applicationContext = new ClassPathXmlApplicationContext("classpath:marketing-streaming-spring-beans.xml");
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

    public static void main(String[] args) {
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:marketing-streaming-spring-beans.xml");
        JdbcTemplate jdbcTemplate = applicationContext.getBean(JdbcTemplate.class);
        PipelineDefinition pipelineDefinition = jdbcTemplate.queryForObject("select * from TD_MKT_PIPELINE_DEFINITION " +
                " where id = 18 ", new BeanPropertyRowMapper<PipelineDefinition>(PipelineDefinition.class));
        System.out.println(pipelineDefinition);
        System.out.println(jdbcTemplate.toString());

        EhCacheCacheManager ehCacheCacheManager = (EhCacheCacheManager) applicationContext.getBean("cacheManager");

        Cache pipelineDefinitionCahce = ehCacheCacheManager.getCache("PipelineDefinitionCache");

        pipelineDefinitionCahce.put("11", pipelineDefinition);

        pipelineDefinitionCahce.get("11").get();
        System.out.println(pipelineDefinition);
        System.out.println(jdbcTemplate.toString());

    }

}
