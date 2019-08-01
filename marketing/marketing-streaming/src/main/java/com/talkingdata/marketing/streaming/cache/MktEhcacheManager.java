package com.talkingdata.marketing.streaming.cache;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Mkt的ehcacheManager类
 * Created by tend on 2017/9/22.
 * @author sheng.hong
 */
@Component
public class MktEhcacheManager {

    private static final Logger logger = LoggerFactory.getLogger(MktEhcacheManager.class);

    @Autowired
    private EhCacheCacheManager ehCacheCacheManager;

    /**
     * 保存元素到缓存
     *
     * @param cacheName 缓存区名称 @see MktCacheNameEnum
     * @param key       Element的key
     * @param value     Element的value
     */
    public void saveElement(MktCacheNameEnum cacheName, String key, Object value) {
        getCache(cacheName.getName()).put(key, value);
    }

    /**
     * 检索指定的缓存数据
     *
     * @param cacheName 缓存区名称 @see MktCacheNameEnum
     * @param key       Element的key
     * @return value
     */
    public Object getElementValue(MktCacheNameEnum cacheName, String key) {
        Cache.ValueWrapper value = getCache(cacheName.getName()).get(key);
        return value == null ? null : value.get();
    }

    /**
     * 移除指定元素
     *
     * @param cacheName 缓存区名称 @see MktCacheNameEnum
     * @param key       key
     */
    public void removeElement(MktCacheNameEnum cacheName, String key) {
        getCache(cacheName.getName()).evict(key);
    }

    /**
     * 清空指定缓存区
     *
     * @param cacheName 缓存区名称 @see MktCacheNameEnum
     */
    public void cleanCache(MktCacheNameEnum cacheName) {
        getCache(cacheName.getName()).clear();
    }

    /**
     * 清空全部缓存区
     */
    public void cleanCacheAll() {
        ehCacheCacheManager.getCacheManager().clearAll();
    }

    /**
     * 获取缓存对象，不存返回null
     *
     * @param cacheName cacheName
     * @return Cache
     */
    private Cache getCache(String cacheName) {
        return ehCacheCacheManager.getCache(cacheName);
    }

    /**
     * 刷新指定的缓存空间
     *
     * @param cacheName 缓存区名称 @see MktCacheNameEnum
     */
    public boolean refreshCache(MktCacheNameEnum cacheName) {
        cleanCache(cacheName);
        return true;
    }

    /**
     * 刷新全部缓存
     */
    public boolean refreshCacheAll() {
        cleanCacheAll();
        return true;
    }

    /**
     * Cache名称枚举
     */
    public enum MktCacheNameEnum {

        /**
         * PipelineDefinition缓存
         */
        PIPELINE_DEFINITION_CACHE("pipelineDefinitionCache"),
        /**
         * pipelineInstance缓存
         */
        PIPELINE_INSTANCE_CACHE("pipelineInstanceCache"),
        /**
         * pipelineStage缓存
         */
        PIPELINE_STAGE_CACHE("pipelineStage"),
        /**
         * piprline全局进入规则缓存
         */
        PIPELINE_ENTER_CACHE("pipelineEnterCache"),
        /**
         * piprline终止规则缓存
         */
        PIPELINE_TERMINATION_CACHE("pipelineTerminationCache"),
        /**
         * piprline用户通过记录缓存
         */
        PIPELINE_USER_ACCESS_TRACE_CACHE("pipelineUserAccessTraceCache"),
        /**
         * 分流器分支执行状态值缓存
         */
        PIPELINE_SPLIT_BRANCH_CACHE("pipelineSplitBranchCache"),
        /**
         * bitmap 缓存
         */
        BITMAP_CACHE("bitmapCache");

        private String name;
        private static final Map<String, MktCacheNameEnum> MAP = new HashMap<>(16);

        static {
            for (MktCacheNameEnum val : values()) {
                MAP.put(val.getName(), val);
            }
        }

        public static MktCacheNameEnum parse(String name) {
            MktCacheNameEnum result = MAP.get(name);
            if (result == null) {
                throw new IllegalArgumentException("Invalid name " + name);
            }
            return result;
        }

        MktCacheNameEnum(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }
}
