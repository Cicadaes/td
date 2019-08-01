package com.talkingdata.marketing.core.service.common;

import com.talkingdata.marketing.core.commons.cache.MktEhcacheWrapper;
import com.talkingdata.marketing.core.dao.campaign.PipelineDefinitionDao;
import com.talkingdata.marketing.core.dao.campaign.PipelineInstanceDao;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.campaign.PipelineInstance;
import com.talkingdata.marketing.core.page.campaign.PipelineInstancePage;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * ehcache 缓存交互
 * Created by tend on 2017/9/19.
 * @author xiaoming.kang
 */
@Component
public class EhcacheService {

    @Autowired
    private MktEhcacheWrapper mktEhcacheWrapper;

    @Autowired
    private PipelineDefinitionDao pipelineDefinitionDao;

    @Autowired
    private PipelineInstanceDao pipelineInstanceDao;

    /**
     * 根据key获取营销流程定义缓存，如果缓存不存在则根据pipelineDefinitionId查询表TD_MKT_PIPELINE_DEFINITION
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              版本
     * @return 营销流程定义 pipeline definition
     */
    public PipelineDefinition findPipelineDefinitionCache(Integer campaignId, Integer pipelineDefinitionId, String version) {
        String key = String.format("%s_%s_%s", campaignId, pipelineDefinitionId, version);
        MktEhcacheWrapper.MktCacheNameEnum cacheName = MktEhcacheWrapper.MktCacheNameEnum.PIPELINE_DEFINITION_CACHE;
        Object value = mktEhcacheWrapper.getElementValue(cacheName, key);
        if (value == null) {
            PipelineDefinition pipelineDefinition = pipelineDefinitionDao.selectByPrimaryKey(pipelineDefinitionId);
            mktEhcacheWrapper.saveElement(cacheName, key, pipelineDefinition);
            return pipelineDefinition;
        }
        return (PipelineDefinition) value;
    }

    /**
     * 根据key获取营销流程实例缓存，如果缓存不存在则根据key查询表TD_MKT_PIPELINE_INSTANCE, 如果不存在则抛出异常
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              版本
     * @return 营销流程实例 pipeline instance
     */
    public PipelineInstance findPipelineInstanceCache(Integer campaignId, Integer pipelineDefinitionId, String version) {
        String key = String.format("%s_%s_%s", campaignId, pipelineDefinitionId, version);
        MktEhcacheWrapper.MktCacheNameEnum cacheName = MktEhcacheWrapper.MktCacheNameEnum.PIPELINE_INSTANCE_CACHE;
        Object value = mktEhcacheWrapper.getElementValue(cacheName, key);
        if (value == null) {
            PipelineInstancePage instancePage = new PipelineInstancePage();
            instancePage.setCampaignId(String.valueOf(campaignId));
            instancePage.setPipelineDefinitionId(String.valueOf(pipelineDefinitionId));
            instancePage.setVersion(version);
            List<PipelineInstance> pipelineInstanceList = pipelineInstanceDao.queryByList(instancePage);
            if (pipelineInstanceList == null || pipelineInstanceList.isEmpty()) {
                throw new IllegalArgumentException(String.format("campaignId: %s, pipelineDefinitionId: %s, version: %s, not exist in DB",
                        campaignId, pipelineDefinitionId, version));
            }
            mktEhcacheWrapper.saveElement(cacheName, key, pipelineInstanceList.get(0));
            return pipelineInstanceList.get(0);
        }
        return (PipelineInstance) value;
    }

    /**
     * Find pipeline user instance cache.
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              版本
     * @param userId               userId
     */
    public void findPipelineUserInstanceCache(Integer campaignId, Integer pipelineDefinitionId, String version, String userId) {

    }

    /**
     * 根据key获取全局进入规则缓存，如果缓存不存在则返回空
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param userId               userId
     * @return userId对应的值 （用户的进入时间_进入次数）
     */
    public String findPipelineEnterCache(Integer campaignId, Integer pipelineDefinitionId, String userId) {
        String key = String.format("%s_%s", campaignId, pipelineDefinitionId);
        MktEhcacheWrapper.MktCacheNameEnum cacheName = MktEhcacheWrapper.MktCacheNameEnum.PIPELINE_ENTER_CACHE;
        Map<String, String> enterCache = (Map<String, String>) mktEhcacheWrapper.getElementValue(cacheName, key);
        if (enterCache == null) {
            return null;
        }
        return enterCache.get(userId);
    }

    /**
     * 保存全局进入规则缓存
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param userId               userId
     * @param enterTime            用户的进入时间
     * @param times                进入次数
     */
    public void savePipelineEnterCache(Integer campaignId, Integer pipelineDefinitionId, String userId, String enterTime, Integer times) {
        String key = String.format("%s_%s", campaignId, pipelineDefinitionId);
        MktEhcacheWrapper.MktCacheNameEnum cacheName = MktEhcacheWrapper.MktCacheNameEnum.PIPELINE_ENTER_CACHE;
        Map<String, String> enterCache = (Map<String, String>) mktEhcacheWrapper.getElementValue(cacheName, key);
        if (enterCache == null) {
            enterCache = new HashMap<>(16);
        }
        enterCache.put(userId, String.format("%s_%s", enterTime, times));
        mktEhcacheWrapper.saveElement(cacheName, key, enterCache);
    }

    /**
     * 根据key获取全局禁止规则缓存，如果缓存不存在则返回空
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param indexCode            指标编码
     * @param userId               userId
     * @return userId对应的值 （进入次数）
     */
    public String findPipelineTerminationCache(Integer campaignId, Integer pipelineDefinitionId, String indexCode, String userId) {
        String key = String.format("%s_%s_%s", campaignId, pipelineDefinitionId, indexCode);
        MktEhcacheWrapper.MktCacheNameEnum cacheName = MktEhcacheWrapper.MktCacheNameEnum.PIPELINE_TERMINATION_CACHE;
        Map<String, String> terminationCache = (Map<String, String>) mktEhcacheWrapper.getElementValue(cacheName, key);
        if (terminationCache == null) {
            return null;
        }
        return terminationCache.get(userId);
    }

    /**
     * 保存全局禁止规则缓存
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param indexCode            指标编码
     * @param userId               userId
     * @param times                进入次数
     */
    public void savePipelineTerminationCache(Integer campaignId, Integer pipelineDefinitionId, String indexCode, String userId, Integer times) {
        String key = String.format("%s_%s_%s", campaignId, pipelineDefinitionId, indexCode);
        MktEhcacheWrapper.MktCacheNameEnum cacheName = MktEhcacheWrapper.MktCacheNameEnum.PIPELINE_TERMINATION_CACHE;
        Map<String, String> terminationCache = (Map<String, String>) mktEhcacheWrapper.getElementValue(cacheName, key);
        if (terminationCache == null) {
            terminationCache = new HashMap<>(16);
        }
        terminationCache.put(userId, times == 0 ? "0" : String.valueOf(times));
        mktEhcacheWrapper.saveElement(cacheName, key, terminationCache);
    }
}
