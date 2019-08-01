package com.talkingdata.marketing.core.config;

import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.cache.ehcache.EhCacheManagerFactoryBean;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.core.io.ClassPathResource;

/**
 * Cache Config
 * @create 2017-09-07-下11:52
 * @since JDK 1.8
 * @author hongsheng
 */
@Configuration
@EnableCaching
public class CacheConfig {

    private Logger logger = LoggerFactory.getLogger(getClass());

    public static final int DEFAULT_MAXSIZE = 1000;
    public static final int DEFAULT_TTL = 300;

    @Bean
    public EhCacheCacheManager ehCacheCacheManager() {
        logger.info("EhCacheCache生成开始");
        EhCacheCacheManager ehCacheCacheManager = new EhCacheCacheManager(ehCacheManagerFactoryBean().getObject());
        logger.info("EhCacheCache生成结束");
        return ehCacheCacheManager;
    }

    @Bean
    public EhCacheManagerFactoryBean ehCacheManagerFactoryBean() {
        EhCacheManagerFactoryBean cacheManagerFactoryBean = new EhCacheManagerFactoryBean();
        cacheManagerFactoryBean.setConfigLocation(new ClassPathResource("/config/ehcache.xml"));
        cacheManagerFactoryBean.setShared(true);
        return cacheManagerFactoryBean;
    }


    /**
     * 定义cache名称、超时时长（秒）、最大容量
     */
    public enum Caches{
        /**
         *  //缺省5分钟
         */
        getDefault,
        /**
         *  //超时时间1分钟，最大容量10000
         */
        getOtherthing(60, 10000);

        /**
         *  //最大數量
         */
        private int maxSize=DEFAULT_MAXSIZE;
        /**
         * //过期时间（秒）
         */
        private int ttl=DEFAULT_TTL;

        Caches() {
        }

        Caches(int ttl) {
            this.ttl = ttl;
        }

        Caches(int ttl, int maxSize) {
            this.ttl = ttl;
            this.maxSize = maxSize;
        }

        public int getMaxSize() {
            return maxSize;
        }
        public int getTtl() {
            return ttl;
        }
    }

    /**
     * 创建基于Caffeine的Cache Manager
     * @return
     */
    @Bean
    @Primary
    public CacheManager caffeineCacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();

        ArrayList<CaffeineCache> caches = new ArrayList<CaffeineCache>();
        for(Caches c : Caches.values()){
            caches.add(new CaffeineCache(c.name(),
                    Caffeine.newBuilder().recordStats()
                            .expireAfterWrite(c.getTtl(), TimeUnit.SECONDS)
                            .maximumSize(c.getMaxSize())
                            .build())
            );
        }

        cacheManager.setCaches(caches);

        return cacheManager;
    }

}