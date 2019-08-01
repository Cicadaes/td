package com.talkingdata.marketing.core.service.admin;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.CommonConstants;
import com.talkingdata.marketing.core.constant.Constant;
import com.talkingdata.marketing.core.constant.PipelineScopeConstants;
import com.talkingdata.marketing.core.dao.admin.CampaignTargetDefinitionDao;
import com.talkingdata.marketing.core.entity.admin.CampaignTargetDefinition;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.entity.campaign.CampaignTargetConfig;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition.CampaignTargetCubeItem;
import com.talkingdata.marketing.core.middleware.UserCloudApi;
import com.talkingdata.marketing.core.page.admin.CampaignTargetDefinitionPage;
import com.talkingdata.marketing.core.page.campaign.CampaignTargetConfigPage;
import com.talkingdata.marketing.core.page.campaign.extend.CampaignTargetDefinitionExtendPage;
import com.talkingdata.marketing.core.service.campaign.CampaignService;
import com.talkingdata.marketing.core.service.campaign.CampaignTargetConfigService;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.talkingdata.marketing.core.constant.PipelineScopeConstants.PIPELINE_SCOPE_PLAN_TARGET;

/**
 * <br>
 * <b>功能：</b>TD_MKT_CAMPAIGN_TARGET_DEFINITION CampaignTargetDefinitionService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("campaignTargetDefinitionService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CampaignTargetDefinitionService extends BaseService<CampaignTargetDefinition, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(CampaignTargetDefinitionService.class);

    @Autowired private CampaignTargetDefinitionDao dao;
    @Autowired private UserCloudApi userCloudApi;
    @Autowired private CampaignTargetConfigService campaignTargetConfigService;
    @Autowired private CampaignService campaignService;

    @Override public CampaignTargetDefinitionDao getDao() {
        return dao;
    }

    /**
     * 1.查询数据库中的指标定义
     * 2.查询用户管家中的指标定义
     * 3.计算出最新的指标定义
     *
     * @param tenantId
     * @return
     * @throws Exception
     */
    public List<CampaignTargetDefinition> findNewDefinitions(String tenantId) throws Exception {
        List<CampaignTargetDefinition> oldCampaignTargetDefinitions = getOldDefinition(tenantId);
        List<CampaignTargetDefinition> totalCampaignTargetDefinitions = getTotalDefinition(tenantId);
        List<CampaignTargetDefinition> result = getNewDefinition(oldCampaignTargetDefinitions, totalCampaignTargetDefinitions);
        return result;
    }

    private List<CampaignTargetDefinition> getNewDefinition(final List<CampaignTargetDefinition> old, final List<CampaignTargetDefinition> total)
        throws Exception {

        if (old.isEmpty() || total.isEmpty()) {
            return total;
        }
        for (int i = total.size() - 1; i >= 0; i--) {
            CampaignTargetDefinition t = total.get(i);
            for (CampaignTargetDefinition index : old) {
                if (index.getIndexId().equals(t.getIndexId())) {
                    total.remove(i);
                    break;
                }
            }
        }
        return total;
    }

    private List<CampaignTargetDefinition> getTotalDefinition(String tenantId) throws Exception {
        List<CampaignTargetDefinition> result = parse(userCloudApi.getCampaignTargetCube(tenantId));
        return result == null ? Collections.EMPTY_LIST : result;
    }

    private List<CampaignTargetDefinition> parse(final List<CampaignTargetCubeItem> campaignTargetCubesItem) throws Exception {
        List<CampaignTargetDefinition> result = new ArrayList<>();
        for (CampaignTargetCubeItem item : campaignTargetCubesItem) {
            result.add(getInstance(item));
        }
        return result == null ? Collections.EMPTY_LIST : result;
    }

    private CampaignTargetDefinition getInstance(CampaignTargetCubeItem item) throws Exception {
        CampaignTargetDefinition campaignTargetDefinition = new CampaignTargetDefinition();
        campaignTargetDefinition.setIndexId(item.getCubeId());
        campaignTargetDefinition.setName(item.getCubeName());
        campaignTargetDefinition.setTenantId(item.getTenantId());
        campaignTargetDefinition.setCode(item.getCubeCode());
        return campaignTargetDefinition;
    }

    private List<CampaignTargetDefinition> getOldDefinition(String tenantId) throws Exception {
        CampaignTargetDefinitionPage page = new CampaignTargetDefinitionPage();
        page.setTenantId(tenantId);
        page.setPageSize(Constant.QUERY_PAGE_SIZE);
        page.setStatus("0");
        List<CampaignTargetDefinition> result = getDao().queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    public List<CampaignTargetDefinition> getByIds(List<Integer> ids) {
        return getDao().selectByIds(ids);
    }

    public List<CampaignTargetDefinition> queryUnownDefinitions(Integer campaignId, String tenantId) throws Exception {
        List<CampaignTargetDefinition> totalCampaignTargetDefinitions = getCurrentTenantTotalDefinition(tenantId);
        List<CampaignTargetConfig> ownCampaignTargetConfig = getOwnCampaignTargetConfig(campaignId);
        return getUnownDefinition(ownCampaignTargetConfig, totalCampaignTargetDefinitions);
    }

    public List<CampaignTargetDefinition> getCurrentTenantTotalDefinition(String tenantId) throws Exception {
        return getOldDefinition(tenantId);
    }

    private List<CampaignTargetDefinition> getUnownDefinition(List<CampaignTargetConfig> own, List<CampaignTargetDefinition> total) throws Exception {
        if (own.isEmpty() || total.isEmpty()) {
            return total;
        }
        for (int i = total.size() - 1; i >= 0; i--) {
            CampaignTargetDefinition t = total.get(i);
            for (CampaignTargetConfig index : own) {
                if (index.getTargetDefinitionId().equals(t.getId())) {
                    total.remove(i);
                    break;
                }
            }
        }
        return filterBySpecifyType(total, PIPELINE_SCOPE_PLAN_TARGET);
    }

    private List<CampaignTargetConfig> getOwnCampaignTargetConfig(Integer campaignId) throws Exception {
        List<CampaignTargetConfig> result = campaignTargetConfigService.findByCampaignId(campaignId);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }

    /**
     * 当前目标定义是否可以改变(删除或修改)
     *
     * @param tenantId
     * @param id
     * @return 如果在使用则无法改变，返回false；否则返回true
     * @throws Exception
     */
    public Boolean changeAble(String tenantId, Integer id) throws Exception {
        return !isUse(tenantId, id);
    }

    /**
     * 判断是否被使用的逻辑：
     * 1.查出当前目标定义关联的使用者
     * 2.检验这些使用者是否有效
     *
     * @param tenantId
     * @param id
     * @return 若使用者是有效的则返回true，否则返回false
     * @throws Exception
     */
    private Boolean isUse(String tenantId, Integer id) throws Exception {
        List<Integer> users = getAllUser(tenantId, id);
        return users.isEmpty() ? false : isValidUser(users);
    }

    /**
     * 检验这些使用者是否有效
     *
     * @param users
     * @return
     * @throws Exception
     */
    private Boolean isValidUser(List<Integer> users) throws Exception {
        List<Campaign> usersInfo = campaignService.selectByIds(users);
        for (Campaign user : usersInfo) {
            if (user.getStatus() == 1) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取当前目标的全部使用者
     *
     * @param tenantId
     * @param id
     * @return
     * @throws Exception
     */
    private List<Integer> getAllUser(String tenantId, Integer id) throws Exception {
        CampaignTargetConfigPage targetPage = new CampaignTargetConfigPage();
        targetPage.setTargetDefinitionId(String.valueOf(id));
        targetPage.setTenantId(tenantId);
        targetPage.setPageSize(Integer.MAX_VALUE);
        List<CampaignTargetConfig> targetList = campaignTargetConfigService.queryByList(targetPage);
        return targetList == null ? Collections.EMPTY_LIST : parseToCampaignId(targetList);
    }

    private List<Integer> parseToCampaignId(List<CampaignTargetConfig> targetList) throws Exception {
        List<Integer> result = new ArrayList<>();
        for (CampaignTargetConfig config : targetList) {
            result.add(config.getCampaignId());
        }
        return result;
    }

    public CampaignTargetDefinition save(CampaignTargetDefinitionExtendPage campaignTargetDefinitionExtendPage) {
        CampaignTargetDefinition campaignTargetDefinition = new CampaignTargetDefinition();
        BeanUtils.copyProperties(campaignTargetDefinitionExtendPage, campaignTargetDefinition);
        campaignTargetDefinition.setStatus(0);
        String scope = getScope(campaignTargetDefinitionExtendPage);
        campaignTargetDefinition.setScope(scope);
        getDao().insert(campaignTargetDefinition);
        return campaignTargetDefinition;
    }

    private String getScope(CampaignTargetDefinitionExtendPage campaignTargetDefinitionExtendPage) {
        Boolean ruleFlag = campaignTargetDefinitionExtendPage.getRuleFlag() != null && campaignTargetDefinitionExtendPage.getRuleFlag();
        String ruleFlagStatus = ruleFlag ? "1" : "0";
        Boolean triggerFlag = campaignTargetDefinitionExtendPage.getTriggerFlag() != null && campaignTargetDefinitionExtendPage.getTriggerFlag();
        String triggerFlagStatus = triggerFlag ? "1" : "0";
        Boolean planFlag = campaignTargetDefinitionExtendPage.getPlanFlag() != null && campaignTargetDefinitionExtendPage.getPlanFlag();
        String planFlagStatus = planFlag ? "1" : "0";
        return new StringBuilder().append(ruleFlagStatus).append(",").append(triggerFlagStatus).append(",").append(planFlagStatus).toString();
    }

    public void delete(Integer id) {
        CampaignTargetDefinition campaignTargetDefinition = new CampaignTargetDefinition();
        campaignTargetDefinition.setId(id);
        campaignTargetDefinition.setStatus(CommonConstants.SampleStatusConstants.DELETE);
        getDao().updateByPrimaryKeySelective(campaignTargetDefinition);
    }

    public List<CampaignTargetDefinitionExtendPage> queryPageByList(CampaignTargetDefinitionPage page) throws Exception {
        List<CampaignTargetDefinition> campaignTargetDefinitions = queryByList(page);
        List<CampaignTargetDefinitionExtendPage> campaignTargetDefinitionExtendPageList = new ArrayList<>();
        for (CampaignTargetDefinition campaignTargetDefinition : campaignTargetDefinitions) {
            CampaignTargetDefinitionExtendPage campaignTargetDefinitionExtendPage = getCampaignTargetDefinitionExtendPage(campaignTargetDefinition);
            campaignTargetDefinitionExtendPageList.add(campaignTargetDefinitionExtendPage);
        }
        return campaignTargetDefinitionExtendPageList;
    }

    private CampaignTargetDefinitionExtendPage getCampaignTargetDefinitionExtendPage(CampaignTargetDefinition campaignTargetDefinition) {
        CampaignTargetDefinitionExtendPage campaignTargetDefinitionExtendPage = new CampaignTargetDefinitionExtendPage();
        BeanUtils.copyProperties(campaignTargetDefinition, campaignTargetDefinitionExtendPage);
        if (!StringUtils.isEmpty(campaignTargetDefinition.getScope())) {
            String[] split = campaignTargetDefinition.getScope().split(",");
            int standardLenth = 3;
            if (split.length == standardLenth) {
                campaignTargetDefinitionExtendPage.setRuleFlag("1".equals(split[0]));
                campaignTargetDefinitionExtendPage.setTriggerFlag("1".equals(split[1]));
                campaignTargetDefinitionExtendPage.setPlanFlag("1".equals(split[2]));
            }
        }
        return campaignTargetDefinitionExtendPage;
    }

    public void update(CampaignTargetDefinitionExtendPage campaignTargetDefinitionExtendPage) {
        CampaignTargetDefinition campaignTargetDefinition = new CampaignTargetDefinition();
        BeanUtils.copyProperties(campaignTargetDefinitionExtendPage, campaignTargetDefinition);
        String scope = getScope(campaignTargetDefinitionExtendPage);
        campaignTargetDefinition.setScope(scope);
        getDao().updateByPrimaryKeySelective(campaignTargetDefinition);
    }

    public CampaignTargetDefinitionExtendPage getByKey(Integer id) {
        CampaignTargetDefinition campaignTargetDefinition = getDao().selectByPrimaryKey(id);
        return getCampaignTargetDefinitionExtendPage(campaignTargetDefinition);
    }

    /**
     * 返回指定scopeType的数据
     *
     * @param campaignTargetDefinitions 源数据
     * @param scopeType                 @see Constant.PipelineScope
     * @return List<BehaviorDefinition>
     */
    public List<CampaignTargetDefinition> filterBySpecifyType(List<CampaignTargetDefinition> campaignTargetDefinitions, Integer scopeType)
        throws Exception {
        List<CampaignTargetDefinition> result = new ArrayList<>();
        for (CampaignTargetDefinition definition : campaignTargetDefinitions) {
            String param = definition.getScope();
            if (StringUtils.isBlank(param)) {
                continue;
            }

            String[] scopes = param.split(",");
            if (PipelineScopeConstants.PIPELINE_SCOPE_RULE == scopeType) {
                if (Integer.valueOf(scopes[0]) == 1) {
                    result.add(definition);
                }
            } else if (PipelineScopeConstants.PIPELINE_SCOPE_TRIGGER_INDEX == scopeType) {
                if (Integer.valueOf(scopes[1]) == 1) {
                    result.add(definition);
                }
            } else if (PipelineScopeConstants.PIPELINE_SCOPE_PLAN_TARGET == scopeType) {
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
