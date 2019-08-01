package com.talkingdata.datacloud.visual.config;

import net.sf.ehcache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
@EnableCaching
public class CacheConfiguration {

    @Bean
    public CacheManager ehCacheCacheManager() {
        return new CacheManager();
    }

}
