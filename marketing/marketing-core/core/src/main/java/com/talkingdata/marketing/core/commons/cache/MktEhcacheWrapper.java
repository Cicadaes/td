package com.talkingdata.marketing.core.commons.cache;

import java.util.HashMap;
import java.util.Map;
import org.apache.commons.collections.map.HashedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Mkt业务缓存使用
 *      提供对缓存的增、删、改、查功能
 * @author hongsheng
 * @create 2017-09-07
 * @since JDK 1.8
 */
@Component
public class MktEhcacheWrapper {

    private static final Logger logger = LoggerFactory.getLogger(MktEhcacheWrapper.class);

    @Autowired
    private EhcacheManager ehcacheManager;

    /**
     * 移除指定元素
     * @param cacheName 缓存区名称 @see MktCacheNameEnum
     * @param elementKeyName Element的key @see MktCacheElementKeyNameEnum
     */
    public void removeElement(MktCacheNameEnum cacheName, MktCacheElementKeyNameEnum elementKeyName) {
        ehcacheManager.evictElement(cacheName.getName(), elementKeyName.getName());
    }

    /**
     * 清空指定缓存区
     * @param cacheName 缓存区名称 @see MktCacheNameEnum
     */
    public void cleanCache(MktCacheNameEnum cacheName) {
        ehcacheManager.cleanPart(cacheName.getName());
    }

    /**
     * 清空全部缓存区
     */
    public void cleanCacheAll() {
        ehcacheManager.cleanFull();
    }

    /**
     * 检索指定的缓存数据
     * @param cacheName 缓存区名称 @see MktCacheNameEnum
     * @param elementKeyName Element的key @see MktCacheElementKeyNameEnum
     * @return
     */
    public Object getElementValue(MktCacheNameEnum cacheName, MktCacheElementKeyNameEnum elementKeyName) {
        Object result = ehcacheManager.getValue(cacheName.getName(), elementKeyName.getName());
        if (result == null) {
            result = findFromSource();
            saveElement(cacheName, elementKeyName, result);
        }
        return result;
    }

    public Object getElementValue(MktCacheNameEnum cacheName, String elementKeyName) {
        return ehcacheManager.getValue(cacheName.getName(), elementKeyName);
    }
    /**
     *
     * @return
     */
    private Object findFromSource() {
        //TODO 获取数据并存入缓存
        return null;
    }

    /**
     * 保存元素到缓存
     * @param cacheName 缓存区名称 @see MktCacheNameEnum
     * @param elementKeyName Element的key @see MktCacheElementKeyNameEnum
     * @param value Element的value
     */
    public void saveElement(MktCacheNameEnum cacheName, MktCacheElementKeyNameEnum elementKeyName, Object value) {
        ehcacheManager.put(cacheName.getName(), elementKeyName.getName(), value);
    }

    public void saveElement(MktCacheNameEnum cacheName, String elementKeyName, Object value) {
        ehcacheManager.put(cacheName.getName(), elementKeyName, value);
    }

    /**
     * Cache名称枚举
     */
    public enum MktCacheNameEnum {
	    //("pipelineCache")
        PIPELINE_CACHE("pipelineCache"),
	    //("behaviorCache")
        BEHAVIOR_CACHE("behaviorCache"),
	    //("pipelineDefinitionCache")
        PIPELINE_DEFINITION_CACHE("pipelineDefinitionCache"),
	    //("pipelineInstanceCache")
        PIPELINE_INSTANCE_CACHE("pipelineInstanceCache"),
	    //("pipelineUserInstanceCache")
        PIPELINE_USER_INSTANCE_CACHE("pipelineUserInstanceCache"),
	    //("pipelineEnterCache")
        PIPELINE_ENTER_CACHE("pipelineEnterCache"),
        //pipelineTerminationCache
        PIPELINE_TERMINATION_CACHE("pipelineTerminationCache");

        private String name;
        private static final Map<String, MktCacheNameEnum> MAP = new HashMap(16);

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

        MktCacheNameEnum(String name){
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }
    /**
     * 刷新指定的缓存空间
     * @param cacheName 缓存区名称 @see MktCacheNameEnum
     * @return
     */
    public boolean refreshCache(MktCacheNameEnum cacheName) {
        cleanCache(cacheName);
        return true;
    }
    /**
     * 刷新全部缓存
     * @return
     */
    public boolean refreshCacheAll() {
        cleanCacheAll();
        return true;
    }
    /**
     * key name enum for cache element
     */
    public enum MktCacheElementKeyNameEnum {
        //TODO
        KEY_ONE("key1"),
        TOTAL_BEHAVIOR("totalBehavior");

        private String name;
        private static final Map<String, MktCacheElementKeyNameEnum> MAP = new HashedMap();
        static {
            for (MktCacheElementKeyNameEnum val : values()) {
                MAP.put(val.getName(), val);
            }
        }

        public static MktCacheElementKeyNameEnum parse(String name) {
            MktCacheElementKeyNameEnum result= MAP.get(name);
            if (result == null) {
                throw new IllegalArgumentException("Invalid name " + name);
            }
            return result;
        }

        MktCacheElementKeyNameEnum(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

}
