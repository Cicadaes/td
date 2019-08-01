package com.talkingdata.marketing.core.service.admin;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.commons.cache.MktEhcacheWrapper;
import com.talkingdata.marketing.core.constant.CommonConstants;
import com.talkingdata.marketing.core.constant.Constant;
import com.talkingdata.marketing.core.constant.FunnelDefinitionConstants.FilterCalcConstants;
import com.talkingdata.marketing.core.dao.admin.BehaviorDefinitionDao;
import com.talkingdata.marketing.core.entity.admin.BehaviorDefinition;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.tag.TagInfo;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.tag.TagResp;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.tag.TagVo;
import com.talkingdata.marketing.core.middleware.TagApi;
import com.talkingdata.marketing.core.page.admin.BehaviorDefinitionPage;
import com.talkingdata.marketing.core.page.campaign.extend.BehaviorDefinitionExtendPage;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.talkingdata.marketing.core.commons.cache.MktEhcacheWrapper.MktCacheElementKeyNameEnum.TOTAL_BEHAVIOR;
import static com.talkingdata.marketing.core.constant.PipelineScopeConstants.PIPELINE_SCOPE_FORBIDDEN_RULE;
import static com.talkingdata.marketing.core.constant.PipelineScopeConstants.PIPELINE_SCOPE_HOURMETER;
import static com.talkingdata.marketing.core.constant.PipelineScopeConstants.PIPELINE_SCOPE_TRIGGER_EVENT;

/**
 * <br>
 * <b>功能：</b>TD_MKT_BEHAVIOR_DEFINITION BehaviorDefinitionService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-05 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("behaviorDefinitionService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class BehaviorDefinitionService extends BaseService<BehaviorDefinition, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(BehaviorDefinitionService.class);
    @Autowired MktEhcacheWrapper mktEhcacheWrapper;
    @Autowired private BehaviorDefinitionDao dao;
    @Autowired private TagApi tagApi;

    @Override public BehaviorDefinitionDao getDao() {
        return dao;
    }

    public BehaviorDefinition save(BehaviorDefinitionExtendPage behaviorDefinitionExtendPage) {
        BehaviorDefinition behaviorDefinition = getBehaviorDefinition(behaviorDefinitionExtendPage);
        behaviorDefinition.setStatus(0);
        getDao().insert(behaviorDefinition);
        return behaviorDefinition;
    }

    private BehaviorDefinition getBehaviorDefinition(BehaviorDefinitionExtendPage behaviorDefinitionExtendPage) {
        BehaviorDefinition behaviorDefinition = new BehaviorDefinition();
        BeanUtils.copyProperties(behaviorDefinitionExtendPage, behaviorDefinition);
        boolean timerFlag = behaviorDefinitionExtendPage.getTimerFlag() != null && behaviorDefinitionExtendPage.getTimerFlag();
        String timerFlagStatus = timerFlag ? "1" : "0";
        boolean eventFlag = behaviorDefinitionExtendPage.getEventFlag() != null && behaviorDefinitionExtendPage.getEventFlag();
        String eventFlagStatus = eventFlag ? "1" : "0";
        boolean forbidRuleFlag = behaviorDefinitionExtendPage.getForbidRuleFlag() != null && behaviorDefinitionExtendPage.getForbidRuleFlag();
        String forbidRuleFlagStatus = forbidRuleFlag ? "1" : "0";
        behaviorDefinition.setScope(
            new StringBuilder().append(timerFlagStatus).append(",").append(eventFlagStatus).append(",").append(forbidRuleFlagStatus).toString());
        return behaviorDefinition;
    }

    public void updateByBehaviorDefinitionExtendPage(BehaviorDefinitionExtendPage behaviorDefinitionExtendPage) {
        BehaviorDefinition behaviorDefinition = getBehaviorDefinition(behaviorDefinitionExtendPage);
        getDao().updateByPrimaryKeySelective(behaviorDefinition);
    }

    public List<BehaviorDefinitionExtendPage> queryPageByList(BehaviorDefinitionPage page) throws Exception {
        Integer rowCount = queryByCount(page);
        page.getPager().setRowCount(rowCount);
        List<BehaviorDefinition> behaviorDefinitions = getDao().queryByList(page);
        List<BehaviorDefinitionExtendPage> behaviorDefinitionExtendPageList = new ArrayList<>();
        for (BehaviorDefinition behaviorDefinition : behaviorDefinitions) {
            BehaviorDefinitionExtendPage behaviorDefinitionExtendPage = getBehaviorDefinitionExtendPage(behaviorDefinition);
            behaviorDefinitionExtendPageList.add(behaviorDefinitionExtendPage);
        }
        return behaviorDefinitionExtendPageList;
    }

    private BehaviorDefinitionExtendPage getBehaviorDefinitionExtendPage(BehaviorDefinition behaviorDefinition) {
        BehaviorDefinitionExtendPage behaviorDefinitionExtendPage = new BehaviorDefinitionExtendPage();
        BeanUtils.copyProperties(behaviorDefinition, behaviorDefinitionExtendPage);
        if (!StringUtils.isEmpty(behaviorDefinition.getScope())) {
            String[] split = behaviorDefinition.getScope().split(",");
            int standardLength = 3;
            if (split.length == standardLength) {
                behaviorDefinitionExtendPage.setTimerFlag("1".equals(split[0]));
                behaviorDefinitionExtendPage.setEventFlag("1".equals(split[1]));
                behaviorDefinitionExtendPage.setForbidRuleFlag("1".equals(split[2]));
            }
        }
        return behaviorDefinitionExtendPage;
    }

    public void delete(Integer id) {
        BehaviorDefinition behaviorDefinition = new BehaviorDefinition();
        behaviorDefinition.setId(id);
        behaviorDefinition.setStatus(CommonConstants.SampleStatusConstants.DELETE);
        getDao().updateByPrimaryKeySelective(behaviorDefinition);
    }

    private List<TagVo> getTotalBehaviorDefinition(String tenantId) throws Exception {
        List<TagVo> tagVos = new ArrayList<>();
        Object value = mktEhcacheWrapper.getElementValue(MktEhcacheWrapper.MktCacheNameEnum.BEHAVIOR_CACHE, TOTAL_BEHAVIOR);
        if (value == null) {
            TagResp tagResp = tagApi.findTag(tenantId);
            for (TagInfo tagInfo : tagResp.getRows()) {
                TagVo tagVo = new TagVo();
                tagVo.setBehaviorId(tagInfo.getId() + "");
                tagVo.setCode(tagInfo.getCode());
                tagVo.setName(tagInfo.getName());
                tagVo.setType(tagInfo.getType());
                String rowKey = StringUtils.rightPad(tagInfo.getTenantId() + "_biz_tag_" + tagInfo.getId() + "_" + tagInfo.getTouchPointType(),
                    FilterCalcConstants.HBASE_ROWKEY_LENGTH, FilterCalcConstants.HBASE_ROWKEY_MIN_PLACEHOLDER);
                tagVo.setRowkey(rowKey);
                tagVos.add(tagVo);
            }
            mktEhcacheWrapper.saveElement(MktEhcacheWrapper.MktCacheNameEnum.BEHAVIOR_CACHE, TOTAL_BEHAVIOR, tagVos);
        } else {
            tagVos = (List<TagVo>)value;
        }
        return tagVos;
    }

    public List<TagVo> findTags(String tenantId) throws Exception {
        List<TagVo> oldBehaviorDefinitions = getOldBehaviorDefinition(tenantId);
        List<TagVo> totalBehaviorDefinitions = getTotalBehaviorDefinition(tenantId);
        List<TagVo> result = getNewDefinition(oldBehaviorDefinitions, totalBehaviorDefinitions);
        return result;
    }

    private List<TagVo> getNewDefinition(final List<TagVo> old, final List<TagVo> total) {
        if (old.isEmpty() || total.isEmpty()) {
            return total;
        }
        List<TagVo> restList = new ArrayList<>();
        Set<String> oldBehaviorIdSet = old.stream().map(o -> o.getBehaviorId()).collect(Collectors.toSet());
        for (TagVo tagVo : total) {
            if (oldBehaviorIdSet.contains(tagVo.getBehaviorId())) {
                continue;
            }else{
                restList.add(tagVo);
            }

        }
        return restList;
    }

    private List<TagVo> getOldBehaviorDefinition(String tenantId) throws Exception {
        BehaviorDefinitionPage page = new BehaviorDefinitionPage();
        page.setTenantId(tenantId);
        page.setPageSize(Constant.QUERY_PAGE_SIZE);
        List<BehaviorDefinition> result = getDao().queryByList(page);
        List<TagVo> tagVos = new ArrayList<>();
        for (BehaviorDefinition behaviorDefinition : result) {
            TagVo tagVo = new TagVo();
            BeanUtils.copyProperties(behaviorDefinition, tagVo);
            tagVo.setId(behaviorDefinition.getBehaviorId() + "");
            tagVos.add(tagVo);
        }
        return tagVos;
    }

    public BehaviorDefinitionExtendPage getByKey(Integer id) {
        BehaviorDefinition behaviorDefinition = getDao().selectByPrimaryKey(id);
        return getBehaviorDefinitionExtendPage(behaviorDefinition);
    }

    /**
     * 返回指定scopeType的数据
     *
     * @param behaviorDefinitions 源数据
     * @param scopeType           @see Constant.PipelineScope
     * @return List<BehaviorDefinition>
     */
    public List<BehaviorDefinition> filterBySpecifyType(List<BehaviorDefinition> behaviorDefinitions, Integer scopeType) throws Exception {
        List<BehaviorDefinition> result = new ArrayList<>();
        for (BehaviorDefinition definition : behaviorDefinitions) {
            String param = definition.getScope();
            if (StringUtils.isBlank(param)) {
                break;
            }

            String[] scopes = param.split(",");
            if (PIPELINE_SCOPE_HOURMETER == scopeType) {
                if (Integer.valueOf(scopes[0]) == 1) {
                    result.add(definition);
                }
            } else if (PIPELINE_SCOPE_TRIGGER_EVENT == scopeType) {
                if (Integer.valueOf(scopes[1]) == 1) {
                    result.add(definition);
                }
            } else if (PIPELINE_SCOPE_FORBIDDEN_RULE == scopeType) {
                if (Integer.valueOf(scopes[2]) == 1) {
                    result.add(definition);
                }
            } else {
                logger.warn("当前scopeType{[]}不存在，请核实", scopeType);
            }

        }
        return result;
    }
}
