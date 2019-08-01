package com.talkingdata.marketing.core.service.admin;

import com.talkingdata.marketing.core.constant.Constant;
import com.talkingdata.marketing.core.entity.admin.FunnelStepConditionDefinition;
import com.talkingdata.marketing.core.entity.admin.FunnelStepDefinition;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.entity.campaign.CampaignFunnelConfig;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition.FunnelEvent;
import com.talkingdata.marketing.core.middleware.UserCloudApi;
import com.talkingdata.marketing.core.page.admin.FunnelIndexDefinitionPage;
import com.talkingdata.marketing.core.page.admin.FunnelStepConditionDefinitionPage;
import com.talkingdata.marketing.core.service.campaign.CampaignFunnelConfigService;
import com.talkingdata.marketing.core.service.campaign.CampaignService;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.admin.FunnelIndexDefinitionDao;
import com.talkingdata.marketing.core.entity.admin.FunnelIndexDefinition;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_FUNNEL_INDEX_DEFINITION FunnelIndexDefinitionService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-05-02 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("funnelIndexDefinitionService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class FunnelIndexDefinitionService extends BaseService<FunnelIndexDefinition, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(FunnelIndexDefinitionService.class);

    @Autowired
    private FunnelIndexDefinitionDao dao;

    @Override
    public FunnelIndexDefinitionDao getDao() {
        return dao;
    }

    @Autowired
    private UserCloudApi userCloudApi;
    @Autowired
    private CampaignService campaignService;
    @Autowired
    private FunnelStepConditionDefinitionService funnelStepConditionDefinitionService;
    @Autowired
    private FunnelStepDefinitionService funnelStepDefinitionService;
    @Autowired
    private CampaignFunnelConfigService campaignFunnelConfigService;


    /**
     *
     * 1.查询数据库中的事件名称定义
     * 2.查询用户管家中的事件名称定义
     * 3.计算出最新的事件名定义
     *
     * @param tenantId
     * @return
     * @throws Exception
     */
    public List<FunnelIndexDefinition> findNewDefinitions(String tenantId) throws Exception {
        List<FunnelIndexDefinition> old = getOldDefinition(tenantId);
        List<FunnelIndexDefinition> total = getTotalDefinition(tenantId);
        List<FunnelIndexDefinition> result = getNewDefinition(old, total);
        return result;
    }

    private List<FunnelIndexDefinition> getNewDefinition(final List<FunnelIndexDefinition> old,
                         final List<FunnelIndexDefinition> total) throws Exception {
        if(old.isEmpty() || total.isEmpty()) {
            return total;
        }
        for (int i = total.size() - 1; i >= 0; i--) {
            FunnelIndexDefinition t = total.get(i);
            for (FunnelIndexDefinition index : old) {
                if(index.getEventId().equals(t.getEventId())) {
                    total.remove(i);
                    break;
                }
            }
        }
        return total;
    }

    private List<FunnelIndexDefinition> getTotalDefinition(String tenantId) throws Exception {
        List<FunnelIndexDefinition> result = parse(userCloudApi.getFunnelEventApi(tenantId));
        return result == null ? Collections.EMPTY_LIST : result;
    }

    private List<FunnelIndexDefinition> parse(final List<FunnelEvent> funnelEvents) {
        List<FunnelIndexDefinition> result = new ArrayList<>();
        for (FunnelEvent funnelEvent : funnelEvents) {
            result.add(getInstance(funnelEvent));
        }
        return result == null ? Collections.EMPTY_LIST : result;
    }

    private FunnelIndexDefinition getInstance(final FunnelEvent funnelEvent) {
        FunnelIndexDefinition funnelIndexDefinition = new FunnelIndexDefinition();
        funnelIndexDefinition.setName(funnelEvent.getAttributeValue());
        funnelIndexDefinition.setEventId(funnelEvent.getAttributeValue());
        funnelIndexDefinition.setTenantId(funnelEvent.getTenantId());
        return funnelIndexDefinition;
    }

    public List<FunnelIndexDefinition> getOldDefinition(String tenantId) {
        FunnelIndexDefinitionPage page = new FunnelIndexDefinitionPage();
        page.setTenantId(tenantId);
        page.setEventId(null);
        page.setEventIdOperator("is not");
        page.setPageSize(Constant.QUERY_PAGE_SIZE);
        List<FunnelIndexDefinition> result = getDao().queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }

    /**
     * 当前漏斗事件定义是否可以改变(删除或修改)
     *
     * @param tenantId
     * @param eventId
     * @return 如果在使用则无法改变，返回false；否则返回true
     * @throws Exception
     */
    public Boolean changeAble(String tenantId, String eventId) throws Exception {
        return !isUse(tenantId, eventId);
    }

    /**
     * 判断是否被使用的逻辑：
     *  1.查出当前漏斗事件定义关联的使用者
     *  2.检验这些使用者是否有效
     *
     * @param tenantId
     * @param eventId
     * @return 若使用者是有效的则返回true，否则返回false
     * @throws Exception
     */
    private boolean isUse(String tenantId, String eventId) throws Exception {
        List<Integer> users = getAllUser(tenantId, eventId);
        return users.isEmpty() ? false : isValidUser(users);
    }

    /**
     * 检验这些使用者是否有效
     *
     * @param users
     * @return
     * @throws Exception
     */
    private boolean isValidUser(List<Integer> users) throws Exception {
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
     * 逻辑：
     *  1.通过事件key查出获取步骤数据
     *  2.通过步骤获取漏斗数据
     *  3.通过漏斗获取活动数据，即使用者
     *
     * @param tenantId
     * @param eventId
     * @return
     * @throws Exception
     */
    private List<Integer> getAllUser(String tenantId, String eventId) throws Exception {
        FunnelStepConditionDefinitionPage stepConditionPage = new FunnelStepConditionDefinitionPage();
        stepConditionPage.setKey(eventId);
        stepConditionPage.setTenantId(tenantId);
        stepConditionPage.setPageSize(Constant.QUERY_PAGE_SIZE);
        List<Integer> stepDefinitions = parseToStepDefinitionId(funnelStepConditionDefinitionService.queryByList(stepConditionPage));

        if (stepDefinitions.isEmpty()) {
            return stepDefinitions;
        }
        List<Integer> funnelDefinition = parseToFunnelDefinitionId(funnelStepDefinitionService.listByIds(stepDefinitions));

        return funnelDefinition.isEmpty() ? funnelDefinition : parseToCampaignId(campaignFunnelConfigService.listByIds(funnelDefinition));
    }

    private List<Integer> parseToCampaignId(List<CampaignFunnelConfig> campaignFunnelConfigs) throws Exception {
        if (campaignFunnelConfigs == null) {
            return Collections.EMPTY_LIST;
        }
        List<Integer> result = new ArrayList<>();
        for (CampaignFunnelConfig campaignFunnel : campaignFunnelConfigs) {
            result.add(campaignFunnel.getCampaignId());
        }
        return result;
    }

    private List<Integer> parseToFunnelDefinitionId(List<FunnelStepDefinition> funnelStepDefinitions) throws Exception {
        if (funnelStepDefinitions == null) {
            return Collections.EMPTY_LIST;
        }
        List<Integer> result = new ArrayList<>();
        for (FunnelStepDefinition funnelStep : funnelStepDefinitions) {
            result.add(funnelStep.getFunnelDefinitionId());
        }
        return result;
    }

    private List<Integer> parseToStepDefinitionId(List<FunnelStepConditionDefinition> funnelStepConditionDefinitions) throws Exception {
        if (funnelStepConditionDefinitions == null) {
            return Collections.EMPTY_LIST;
        }
        List<Integer> result = new ArrayList<>();
        for (FunnelStepConditionDefinition stepCondition : funnelStepConditionDefinitions) {
            result.add(stepCondition.getFunnelStepDefinitionId());
        }
        return result;
    }

}
