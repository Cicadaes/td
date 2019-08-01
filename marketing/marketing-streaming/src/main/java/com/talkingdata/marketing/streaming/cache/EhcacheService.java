package com.talkingdata.marketing.streaming.cache;

import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.model.PipelineInstance;
import com.talkingdata.marketing.streaming.model.PipelineStage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * mkt 与 ehcache 交互的业务服务类
 * Created by tend on 2017/9/22.
 *
 * @author sheng.hong
 */
@Component
public class EhcacheService {

    @Autowired
    private MktEhcacheManager mktEhcacheManager;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 根据key获取营销流程定义缓存，如果缓存不存在则根据pipelineDefinitionId查询表TD_MKT_PIPELINE_DEFINITION
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              版本
     * @return 营销流程定义
     */
    public PipelineDefinition findPipelineDefinitionCache(Integer campaignId, Integer pipelineDefinitionId, String version) {
        String key = pipelineDefCacheKey(campaignId, pipelineDefinitionId, version);
        MktEhcacheManager.MktCacheNameEnum cacheName = MktEhcacheManager.MktCacheNameEnum.PIPELINE_DEFINITION_CACHE;
        Object value = mktEhcacheManager.getElementValue(cacheName, key);
        if (value == null) {
            String sql = "select * from TD_MKT_PIPELINE_DEFINITION where id = ?";
            PipelineDefinition pipelineDefinition = jdbcTemplate.queryForObject(sql,
                    new Integer[]{pipelineDefinitionId}, new BeanPropertyRowMapper<>(PipelineDefinition.class));
            mktEhcacheManager.saveElement(cacheName, key, pipelineDefinition);
            return pipelineDefinition;
        }
        return (PipelineDefinition) value;
    }

    /**
     * 清除指定PipelineDefinition在ehcache中的缓存
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              版本
     */
    public void removePipelineDefinitionCache(Integer campaignId, Integer pipelineDefinitionId, String version) {
        String key = pipelineDefCacheKey(campaignId, pipelineDefinitionId, version);
        MktEhcacheManager.MktCacheNameEnum cacheName = MktEhcacheManager.MktCacheNameEnum.PIPELINE_DEFINITION_CACHE;
        mktEhcacheManager.removeElement(cacheName, key);
    }

    /**
     * 根据key获取营销流程实例缓存，如果缓存不存在则根据key查询表TD_MKT_PIPELINE_INSTANCE, 如果不存在则抛出异常
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              版本
     * @return 营销流程实例
     */
    public PipelineInstance findPipelineInstanceCache(Integer campaignId, Integer pipelineDefinitionId, String version) {
        String key = pipelineInstanceCacheKey(campaignId, pipelineDefinitionId, version);
        MktEhcacheManager.MktCacheNameEnum cacheName = MktEhcacheManager.MktCacheNameEnum.PIPELINE_INSTANCE_CACHE;
        Object value = mktEhcacheManager.getElementValue(cacheName, key);
        if (value == null) {
            List<PipelineInstance> pipelineInstanceList;
            if (version == null) {
                String sql = "select * from TD_MKT_PIPELINE_INSTANCE where campaign_id = ? and pipeline_definition_id = ? and version is null and status in (0,1)";
                pipelineInstanceList = jdbcTemplate.query(sql, new Object[]{campaignId, pipelineDefinitionId},
                        new BeanPropertyRowMapper<>(PipelineInstance.class));
            } else {
                String sql = "select * from TD_MKT_PIPELINE_INSTANCE where campaign_id = ? and pipeline_definition_id = ? and version = ?  and status in (0,1)";
                pipelineInstanceList = jdbcTemplate.query(sql, new Object[]{campaignId, pipelineDefinitionId, version},
                        new BeanPropertyRowMapper<>(PipelineInstance.class));
            }
            if (pipelineInstanceList == null || pipelineInstanceList.isEmpty()) {
                return null;
            }
            PipelineInstance pipelineInstance = pipelineInstanceList.get(0);
            mktEhcacheManager.saveElement(cacheName, key, pipelineInstance);
            return pipelineInstanceList.get(0);
        }
        return (PipelineInstance) value;
    }

    /**
     * 清除指定PipelineInstance在ehcache中的缓存
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              版本
     */
    public void removePipelineInstanceCache(Integer campaignId, Integer pipelineDefinitionId, String version) {
        String key = pipelineInstanceCacheKey(campaignId, pipelineDefinitionId, version);
        MktEhcacheManager.MktCacheNameEnum cacheName = MktEhcacheManager.MktCacheNameEnum.PIPELINE_INSTANCE_CACHE;
        mktEhcacheManager.removeElement(cacheName, key);
    }

    /**
     * 根据key获取全局进入规则缓存，如果缓存不存在则返回空
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              版本
     * @param userId               userId
     * @return userId对应的值（用户的进入时间_进入次数）
     */
    public String findPipelineEnterCache(Integer campaignId, Integer pipelineDefinitionId, String version, String userId) {
        String key = String.format("%s_%s_%s", campaignId, pipelineDefinitionId, version);
        MktEhcacheManager.MktCacheNameEnum cacheName = MktEhcacheManager.MktCacheNameEnum.PIPELINE_ENTER_CACHE;
        Map<String, String> enterCache = (Map<String, String>) mktEhcacheManager.getElementValue(cacheName, key);
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
     * @param version              版本
     * @param userId               userId
     * @param enterTime            用户的进入时间
     * @param times                进入次数
     */
    public void savePipelineEnterCache(Integer campaignId, Integer pipelineDefinitionId, String version, String userId, String enterTime, Integer times) {
        String key = String.format("%s_%s_%s", campaignId, pipelineDefinitionId, version);
        MktEhcacheManager.MktCacheNameEnum cacheName = MktEhcacheManager.MktCacheNameEnum.PIPELINE_ENTER_CACHE;
        Map<String, String> enterCache = (Map<String, String>) mktEhcacheManager.getElementValue(cacheName, key);
        if (enterCache == null) {
            enterCache = new HashMap<>(16);
        }
        enterCache.put(userId, String.format("%s_%s", enterTime, times));
        mktEhcacheManager.saveElement(cacheName, key, enterCache);
    }

    /**
     * 根据key获取全局禁止规则缓存，如果缓存不存在则返回空
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              版本
     * @param userId               userId
     * @param indexCode            指标编码
     * @return userId对应的值（进入次数）
     */
    public String findPipelineTerminationCache(Integer campaignId, Integer pipelineDefinitionId, String version, String indexCode, String userId) {
        String key = String.format("%s_%s_%s_%s", campaignId, pipelineDefinitionId, version, indexCode);
        MktEhcacheManager.MktCacheNameEnum cacheName = MktEhcacheManager.MktCacheNameEnum.PIPELINE_TERMINATION_CACHE;
        Map<String, String> terminationCache = (Map<String, String>) mktEhcacheManager.getElementValue(cacheName, key);
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
     * @param version              版本
     * @param indexCode            指标编码
     * @param userId               userId
     * @param times                进入次数
     */
    public void savePipelineTerminationCache(Integer campaignId, Integer pipelineDefinitionId, String version, String indexCode, String userId, Integer times) {
        String key = String.format("%s_%s_%s_%s", campaignId, pipelineDefinitionId, version, indexCode);
        MktEhcacheManager.MktCacheNameEnum cacheName = MktEhcacheManager.MktCacheNameEnum.PIPELINE_TERMINATION_CACHE;
        Map<String, String> terminationCache = (Map<String, String>) mktEhcacheManager.getElementValue(cacheName, key);
        if (terminationCache == null) {
            terminationCache = new HashMap<>(16);
        }
        terminationCache.put(userId, times == 0 ? "0" : String.valueOf(times));
        mktEhcacheManager.saveElement(cacheName, key, terminationCache);
    }

    /**
     * 根据key获取当前流程的分流器分支执行状态值
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              营销流程版本
     * @param splitNodeId          分流器ID
     * @return 状态值
     */
    public Long findPipelineSplitBranchStatus(Integer campaignId, Integer pipelineDefinitionId, String version, String splitNodeId) {
        String key = String.format("%s_%s_%s_%s", campaignId, pipelineDefinitionId, version, splitNodeId);
        Object value = mktEhcacheManager.getElementValue(MktEhcacheManager.MktCacheNameEnum.PIPELINE_SPLIT_BRANCH_CACHE, key);
        return value == null ? null : (Long) value;
    }

    /**
     * 缓存当前流程的分流器分支执行状态值
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              营销流程版本
     * @param splitNodeId          分流器ID
     * @param branchStatus         状态值
     */
    public void savePipelineSplitBranchStatus(Integer campaignId, Integer pipelineDefinitionId, String version, String splitNodeId, Long branchStatus) {
        String key = String.format("%s_%s_%s_%s", campaignId, pipelineDefinitionId, version, splitNodeId);
        mktEhcacheManager.saveElement(MktEhcacheManager.MktCacheNameEnum.PIPELINE_SPLIT_BRANCH_CACHE, key, branchStatus);
    }

    /**
     * 根据key获取当前流程的分流器上一次分支计算值
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              营销流程版本
     * @param splitNodeId          分流器ID
     * @return
     */
    public Integer findPipelineSplitLastTimeBranchResult(Integer campaignId, Integer pipelineDefinitionId, String version, String splitNodeId) {
        String key = String.format("%s_%s_%s_result_%s", campaignId, pipelineDefinitionId, version, splitNodeId);
        Object value = mktEhcacheManager.getElementValue(MktEhcacheManager.MktCacheNameEnum.PIPELINE_SPLIT_BRANCH_CACHE, key);
        return value == null ? null : (Integer) value;
    }

    /**
     * 缓存当前流程的分流器上一次分支计算值
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              营销流程版本
     * @param splitNodeId          分流器ID
     * @param result               缓存值
     */
    public void savePipelineSplitLastTimeBranchResult(Integer campaignId, Integer pipelineDefinitionId, String version, String splitNodeId, Integer result) {
        String key = String.format("%s_%s_%s_result_%s", campaignId, pipelineDefinitionId, version, splitNodeId);
        mktEhcacheManager.saveElement(MktEhcacheManager.MktCacheNameEnum.PIPELINE_SPLIT_BRANCH_CACHE, key, result);
    }

    /**
     * 根据key获取用户通过记录，包括通过时间和通过次数
     * key由campaignId_pipelineDefinitionId_version_accessNode_userId组成,value由通过时间_通过次数组成.
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              版本
     * @param accessNode           通过点
     * @param userId               userId
     * @return 返回记录，若为检索到返回NULL
     */
    public String findUserAccessTrace(Integer campaignId, Integer pipelineDefinitionId, String version, String accessNode, String userId) {
        String key = String.format("%s_%s_%s_%s", campaignId, pipelineDefinitionId, version, accessNode);
        MktEhcacheManager.MktCacheNameEnum cacheName = MktEhcacheManager.MktCacheNameEnum.PIPELINE_USER_ACCESS_TRACE_CACHE;
        Map<String, String> cache = (Map<String, String>) mktEhcacheManager.getElementValue(cacheName, key);
        if (cache == null) {
            return null;
        }
        return cache.get(userId);
    }

    /**
     * 保存用户通过记录，包括通过时间和通过次数
     * key由campaignId_pipelineDefinitionId_version_accessNode_userId组成,value由accessTime_accessTimes.
     * 保存时需要先检索上次缓存数据，在此基础上更新数据。如果是第一次保存，则直接创建并保存。
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              版本
     * @param accessNode           通过点
     * @param userId               用户ID值
     * @param accessTime           通过时间
     * @param accessTimes          通过次数
     */
    public void saveUserAccessTrace(Integer campaignId, Integer pipelineDefinitionId, String version, String accessNode, String userId, String accessTime, Integer accessTimes) {
        String key = String.format("%s_%s_%s_%s", campaignId, pipelineDefinitionId, version, accessNode);
        MktEhcacheManager.MktCacheNameEnum cacheName = MktEhcacheManager.MktCacheNameEnum.PIPELINE_USER_ACCESS_TRACE_CACHE;
        Map<String, String> cache = (Map<String, String>) mktEhcacheManager.getElementValue(cacheName, key);
        if (cache == null) {
            cache = new HashMap<>(16);
        }
        cache.put(userId, String.format("%s_%d", accessTime, accessTimes));
        mktEhcacheManager.saveElement(cacheName, key, cache);
    }

    /**
     * 查询Pipeline对应的所有stage
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 营销流程定义ID
     * @param version              版本
     * @return Map，key：stageName，value：PipelineStage
     */
    public Map<String, PipelineStage> findPipelineStageCache(Integer campaignId, Integer pipelineDefinitionId, String version) {
        String key = String.format("%s_%s_%s_PipelineStage", campaignId, pipelineDefinitionId, version);
        MktEhcacheManager.MktCacheNameEnum cacheName = MktEhcacheManager.MktCacheNameEnum.PIPELINE_STAGE_CACHE;
        Object value = mktEhcacheManager.getElementValue(cacheName, key);
        if (value == null) {
            List<PipelineStage> pipelineStageList;
            if (version == null) {
                String sql = "select * from TD_MKT_PIPELINE_STAGE where campaign_id = ? and pipeline_definition_id = ? and version is null";
                pipelineStageList = jdbcTemplate.query(sql, new Object[]{campaignId, pipelineDefinitionId},
                        new BeanPropertyRowMapper<>(PipelineStage.class));
            } else {
                String sql = "select * from TD_MKT_PIPELINE_STAGE where campaign_id = ? and pipeline_definition_id = ? and version = ?";
                pipelineStageList = jdbcTemplate.query(sql, new Object[]{campaignId, pipelineDefinitionId, version},
                        new BeanPropertyRowMapper<>(PipelineStage.class));
            }
            if (pipelineStageList == null || pipelineStageList.isEmpty()) {
                return null;
            }
            Map<String, PipelineStage> pipelineStageMap = new HashMap<>(16);
            for (PipelineStage pipelineStage : pipelineStageList) {
                pipelineStageMap.put(pipelineStage.getStageName(), pipelineStage);
            }
            mktEhcacheManager.saveElement(cacheName, key, pipelineStageMap);
            return pipelineStageMap;
        }
        return (Map<String, PipelineStage>) value;
    }

    /**
     * 保存bitmap数据缓存
     *
     * @param offset offset
     * @param bitmap bitmap
     */
    public void saveBitmapCache(String offset, byte[] bitmap) {
        mktEhcacheManager.saveElement(MktEhcacheManager.MktCacheNameEnum.BITMAP_CACHE, offset, bitmap);
    }

    /**
     * 获取bitmap缓存
     *
     * @param offset offset
     * @return bitmap
     */
    public byte[] findBitmapCache(String offset) {
        return (byte[]) mktEhcacheManager.getElementValue(MktEhcacheManager.MktCacheNameEnum.BITMAP_CACHE, offset);
    }

    private String pipelineDefCacheKey(Integer campaignId, Integer pipelineDefinitionId, String version) {
        return String.format("%s_%s_%s_PipelineDefinition", campaignId, pipelineDefinitionId, version);
    }

    private String pipelineInstanceCacheKey(Integer campaignId, Integer pipelineDefinitionId, String version) {
        return String.format("%s_%s_%s_PipelineInstance", campaignId, pipelineDefinitionId, version);
    }

}
