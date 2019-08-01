package com.talkingdata.marketing.core.service.admin;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.admin.FunnelDefinitionDao;
import com.talkingdata.marketing.core.entity.admin.FunnelDefinition;
import com.talkingdata.marketing.core.entity.admin.FunnelStepConditionDefinition;
import com.talkingdata.marketing.core.entity.admin.FunnelStepDefinition;
import com.talkingdata.marketing.core.entity.admin.extend.FunnelStepDefinitionExt;
import com.talkingdata.marketing.core.entity.campaign.CampaignFunnelConfig;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.admin.FunnelStepDefinitionPage;
import com.talkingdata.marketing.core.page.campaign.CampaignFunnelConfigPage;
import com.talkingdata.marketing.core.page.dto.CreateFunnelDto;
import com.talkingdata.marketing.core.service.campaign.CampaignFunnelConfigService;
import com.talkingdata.marketing.core.util.AssignmentBasicInfoUtil;
import com.talkingdata.marketing.core.util.JsonUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


/**
 * <br>
 * <b>功能：</b>TD_MKT_FUNNEL_DEFINITION FunnelDefinitionService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("funnelDefinitionService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class FunnelDefinitionService extends BaseService<FunnelDefinition, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(FunnelDefinitionService.class);

    @Autowired
    private FunnelDefinitionDao dao;
    @Autowired
    private FunnelStepConditionDefinitionService funnelStepConditionDefinitionService;
    @Autowired
    private FunnelStepDefinitionService funnelStepDefinitionService;
    @Autowired
    private CampaignFunnelConfigService campaignFunnelConfigService;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    @Override
    public FunnelDefinitionDao getDao() {
        return dao;
    }

    /**
     * 创建漏斗时的操作：
     * 1.保存漏斗定义
     * 2.保存活动与漏斗关系
     * 3.保存漏斗步骤定义
     * 4.保存漏斗步骤条件
     *
     * @param createFunnelDto the create funnel dto
     * @return the integer
     * @throws Exception the exception
     */
    public Integer createFunnel(CreateFunnelDto createFunnelDto) throws Exception {
        Integer funnelDefinitionId = saveFunnelDefinition(createFunnelDto);
        saveother(createFunnelDto, funnelDefinitionId);
        return funnelDefinitionId;
    }

    private void saveother(CreateFunnelDto createFunnelDto, Integer funnelDefinitionId) throws Exception {
        saveCampaignFunnelConfig(createFunnelDto, funnelDefinitionId);
        List<FunnelStepConditionDefinition> funnelStepConditionDefinitionAdds = new ArrayList<>();
        List<FunnelStepDefinitionExt> funnelStepDefinitionExts = createFunnelDto.getFunnelStepDefinitionExts();
        for (FunnelStepDefinitionExt funnelStepDefinitionExt : funnelStepDefinitionExts) {
            funnelStepDefinitionExt.setFunnelDefinitionId(funnelDefinitionId);
            setCreateBasicInfo(funnelStepDefinitionExt, createFunnelDto);
            Integer funnelStepDefinitionId = saveFunnelStepDefinition(funnelStepDefinitionExt);
            List<FunnelStepConditionDefinition> funnelStepConditionDefinitions = funnelStepDefinitionExt.getFunnelStepConditionDefinitions();
            for (FunnelStepConditionDefinition funnelStepConditionDefinition : funnelStepConditionDefinitions) {
                funnelStepConditionDefinition.setFunnelStepDefinitionId(funnelStepDefinitionId);
                setCreateBasicInfo(funnelStepConditionDefinition, createFunnelDto);
                funnelStepConditionDefinitionAdds.add(funnelStepConditionDefinition);
            }
        }
        funnelStepConditionDefinitionService.insertBatch(funnelStepConditionDefinitionAdds);
    }

    private void saveCampaignFunnelConfig(CreateFunnelDto createFunnelDto, Integer funnelDefinitionId) throws Exception {
        CampaignFunnelConfig campaignFunnelConfig = new CampaignFunnelConfig();
        campaignFunnelConfig.setCampaignId(createFunnelDto.getCampaignId());
        campaignFunnelConfig.setFunnelId(funnelDefinitionId);
        campaignFunnelConfig.setFunnelName(createFunnelDto.getFunnelName());
        setCreateBasicInfo(campaignFunnelConfig, createFunnelDto);
        if (createFunnelDto.getDefaultFlag() == null) {
            campaignFunnelConfig.setDefaultFlag(0);
        } else {
            campaignFunnelConfig.setDefaultFlag(createFunnelDto.getDefaultFlag());
        }
        campaignFunnelConfigService.insert(campaignFunnelConfig);
    }

    private Integer saveFunnelStepDefinition(FunnelStepDefinitionExt funnelStepDefinitionExt) throws Exception {
        FunnelStepDefinition funnelStepDefinition = new FunnelStepDefinition();
        funnelStepDefinition.setFunnelDefinitionId(funnelStepDefinitionExt.getFunnelDefinitionId());
        funnelStepDefinition.setName(funnelStepDefinitionExt.getName());
        funnelStepDefinition.setOrder(funnelStepDefinitionExt.getOrder());
        funnelStepDefinition.setType(funnelStepDefinitionExt.getType());
        setCreateBasicInfo(funnelStepDefinition, funnelStepDefinitionExt);
        funnelStepDefinitionService.insert(funnelStepDefinition);
        return funnelStepDefinition.getId();
    }

    private Integer saveFunnelDefinition(CreateFunnelDto createFunnelDto) throws Exception {
        FunnelDefinition funnelDefinition = new FunnelDefinition();
        funnelDefinition.setName(createFunnelDto.getFunnelName());
        setCreateBasicInfo(funnelDefinition, createFunnelDto);
        insert(funnelDefinition);
        return funnelDefinition.getId();
    }

    /**
     * Delete funnel and related step.
     *
     * @param funnelDefinitionId the funnel definition id
     * @throws Exception the exception
     */


    /**
     * //    删除步骤：
     *    1 删除 活动漏斗配置定义
     *    2 删除 漏斗定义
     *    3 删除 漏斗步骤
     *    4 删除 漏斗步骤定义
     * @param funnelDefinitionId
     * @throws Exception
     */
    public void deleteFunnelAndRelatedStep(Integer funnelDefinitionId) throws Exception {
        CampaignFunnelConfig campaignFunnelConfig = getByFunnelId(funnelDefinitionId);
        if (campaignFunnelConfig == null) {
            logger.error("当前准备删除的活动漏斗定义不存在,funnelDefinitionId:"+funnelDefinitionId);
        } else {
            //    1 删除 活动漏斗配置定义
            campaignFunnelConfigService.deleteByPrimaryKey(campaignFunnelConfig.getId());
        }

        FunnelDefinition funnelDefinition = selectByPrimaryKey(funnelDefinitionId);
        if (funnelDefinition != null) {
            //    2 删除 漏斗定义
            String funnelJson = JsonUtil.toJson(funnelDefinition);
            deleteByPrimaryKey(funnelDefinitionId);
            logger.info("delete funnel:"+funnelJson);
        }

        List<FunnelStepDefinition> steps = getFunnelStepsByFunnelId(funnelDefinitionId);
        if (steps == null || steps.size() == 0) {
            logger.info("step not found,funnel id:"+funnelDefinitionId);
            return;
        }

        List<Integer> stepIds = buildFunnelStepIds(steps);
        //    3 删除 漏斗步骤
        String stepJson = JsonUtil.toJson(steps);
        logger.info("delete funnel info,funnel id:"+funnelDefinitionId+",step:"+stepJson);
        for (Integer stepId : stepIds) {
            funnelStepDefinitionService.deleteByPrimaryKey(stepId);
        }

        List<FunnelStepConditionDefinition> conditions = getFunnelEvent(stepIds);
        if (conditions == null || conditions.size() == 0) {
            logger.info("step condition not found,funnel id:"+funnelDefinitionId);
            return;
        }
        String conditionJson = JsonUtil.toJson(conditions);
        logger.info("delete funnel step condition info:"+conditionJson);
        //    4 删除 漏斗步骤定义
        for (FunnelStepConditionDefinition stepConditionDefinition : conditions) {
            funnelStepConditionDefinitionService.deleteByPrimaryKey(stepConditionDefinition.getId());
        }
    }

    /**
     * Gets funnel detail.
     *
     * @param funnelId the funnel id
     * @return the funnel detail
     * @throws Exception the exception
     */
    public CreateFunnelDto getFunnelDetail(Integer funnelId) throws Exception {
        CampaignFunnelConfig campaignFunnelConfig = getByFunnelId(funnelId);
        CreateFunnelDto createFunnelDto = new CreateFunnelDto();
        if (campaignFunnelConfig != null) {
            //组装漏斗活动关联
            createFunnelDto.setCreator(campaignFunnelConfig.getCreator());
            createFunnelDto.setCreateBy(campaignFunnelConfig.getCreateBy());
            createFunnelDto.setCreateTime(campaignFunnelConfig.getCreateTime());
            createFunnelDto.setTenantId(campaignFunnelConfig.getTenantId());
            createFunnelDto.setCampaignFunnelConfigId(campaignFunnelConfig.getId());
            createFunnelDto.setCampaignId(campaignFunnelConfig.getCampaignId());
            createFunnelDto.setDefaultFlag(campaignFunnelConfig.getDefaultFlag());
        }

        //组装漏斗
        FunnelDefinition funnelDefinition = selectByPrimaryKey(funnelId);
        if (funnelDefinition == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FUNNEL_DEFINITION_NOT_EXIST);
        }
        createFunnelDto.setFunnelDefinitionId(funnelDefinition.getId());
        createFunnelDto.setFunnelName(funnelDefinition.getName());

        List<FunnelStepDefinition> steps = getFunnelStepsByFunnelId(funnelId);
        if (steps == null || steps.size() == 0) {
            return createFunnelDto;

        }
        List<Integer> stepIds = buildFunnelStepIds(steps);
        List<FunnelStepConditionDefinition> conditions = getFunnelEvent(stepIds);

        //组装漏斗步骤
        List<FunnelStepDefinitionExt> funnelStepDefinitionExtList = new ArrayList();
        for (FunnelStepDefinition funnelStepDefinition : steps) {
            FunnelStepDefinitionExt funnelStepDefinitionExt = new FunnelStepDefinitionExt();
            funnelStepDefinitionExt.setCreateTime(funnelStepDefinition.getCreateTime());
            funnelStepDefinitionExt.setCreator(funnelStepDefinition.getCreator());
            funnelStepDefinitionExt.setCreateBy(funnelStepDefinition.getCreateBy());
            funnelStepDefinitionExt.setTenantId(funnelStepDefinition.getTenantId());
            funnelStepDefinitionExt.setUpdateTime(funnelStepDefinition.getUpdateTime());
            funnelStepDefinitionExt.setUpdateBy(funnelStepDefinition.getUpdateBy());
            funnelStepDefinitionExt.setUpdater(funnelStepDefinition.getUpdater());
            funnelStepDefinitionExt.setId(funnelStepDefinition.getId());
            funnelStepDefinitionExt.setName(funnelStepDefinition.getName());
            funnelStepDefinitionExt.setOrder(funnelStepDefinition.getOrder());
            funnelStepDefinitionExt.setType(funnelStepDefinition.getType());
            //组装漏斗步骤事件定义
            funnelStepDefinitionExt.setFunnelStepConditionDefinitions(getDefinitionByStepId(conditions, funnelStepDefinition.getId()));
            funnelStepDefinitionExt.setFunnelDefinitionId(funnelDefinition.getId());
            funnelStepDefinitionExtList.add(funnelStepDefinitionExt);
        }
        createFunnelDto.setFunnelStepDefinitionExts(funnelStepDefinitionExtList);
        return createFunnelDto;
    }

    private CampaignFunnelConfig getByFunnelId(Integer funnelId) throws Exception {
        CampaignFunnelConfigPage campaignFunnelConfigPage = new CampaignFunnelConfigPage();
        campaignFunnelConfigPage.setFunnelId(String.valueOf(funnelId));
        return campaignFunnelConfigService.queryBySingle(campaignFunnelConfigPage);
    }

    private List<FunnelStepDefinition> getFunnelStepsByFunnelId(Integer funnelId) throws Exception{
        FunnelStepDefinitionPage page = new FunnelStepDefinitionPage();
        page.setFunnelDefinitionId(String.valueOf(funnelId));
        page.setPageSize(Integer.MAX_VALUE);
        return funnelStepDefinitionService.queryByList(page);
    }

    private List<Integer> buildFunnelStepIds(List<FunnelStepDefinition> steps) {
        List<Integer> l = new ArrayList();
        for (FunnelStepDefinition step : steps) {
            l.add(step.getId());
        }
        return l;
    }

    private List<FunnelStepConditionDefinition> getFunnelEvent(final List<Integer> stepIds) throws Exception {
        List<FunnelStepConditionDefinition> result = funnelStepConditionDefinitionService.selectByIds(stepIds);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    private List<FunnelStepConditionDefinition> getDefinitionByStepId(List<FunnelStepConditionDefinition> definitionList, Integer stepId) {
        List<FunnelStepConditionDefinition> conditionDefinitions = new ArrayList();
        if (definitionList == null || definitionList.size() == 0) {
            return conditionDefinitions;
        }
        for (FunnelStepConditionDefinition definition : definitionList) {
            if (stepId.equals(definition.getFunnelStepDefinitionId())) {
                conditionDefinitions.add(definition);
            }
        }
        return conditionDefinitions;
    }

    private <D, S> void setCreateBasicInfo(D d, S s) {
        AssignmentBasicInfoUtil.setCreateBasicInfo(d, s);
    }

    /**
     * Update funnel integer.
     *
     * @param funnelDto the funnel dto
     * @return the integer
     * @throws Exception the exception
     */
    public Integer updateFunnel(CreateFunnelDto funnelDto) throws Exception{
        logger.info("update funnel:"+JsonUtil.toJson(funnelDto));
        deleteFunnelAndRelatedStep(funnelDto.getFunnelDefinitionId());
        return createFunnel(funnelDto);
    }

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     * @throws Exception the exception
     */
    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }
}
