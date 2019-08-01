package com.talkingdata.marketing.core.commons.cache;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.stereotype.Component;

/**
 * Mkt Ehcache Manager
 * @author hongsheng
 * @create 2017-09-07-下午12:02
 * @since JDK 1.8
 */
@Component
public class EhcacheManager {

    @Autowired
    private EhCacheCacheManager ehCacheCacheManager;

    /**
     * 存入缓存
     * @param cacheName
     * @param key
     * @param value
     */
    public void put(String cacheName, String key, Object value) {
        getCache(cacheName).put(key, value);
    }

    /**
     * 清除Element
     * @param cacheName
     * @param key
     */
    public void evictElement(String cacheName, String key) {
        getCache(cacheName).evict(key);
    }

    /**
     * 清空部分缓存
     * @param cacheName
     */
    public void cleanPart(String cacheName) {
        getCache(cacheName).clear();
    }

    /**
     * 清空缓存
     */
    public void cleanFull() {
        ehCacheCacheManager.getCacheManager().clearAll();
    }

    /**
     * 获取缓存中的key映射的值
     * @param cacheName
     * @param key
     * @return
     */
    public Object getValue(String cacheName, String key) {
        Cache.ValueWrapper value = getCache(cacheName).get(key);
        return value == null ? null : value.get();
    }

    /**
     * 获取缓存对象，不存返回null
     * @param cacheName
     * @return
     * @throws NullPointerException  当cacheName名称不存在
     */
    public Cache getCache(String cacheName) {
         return ehCacheCacheManager.getCache(cacheName);
    }
}
