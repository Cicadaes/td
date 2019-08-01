package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.EquityRecordConstants;
import com.talkingdata.marketing.core.dao.campaign.PipelineEquityConfigDefinitionDao;
import com.talkingdata.marketing.core.entity.campaign.EquityConfig;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.campaign.PipelineEquityConfigDefinition;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.campaign.EquityRecordPage;
import com.talkingdata.marketing.core.page.campaign.PipelineEquityConfigDefinitionPage;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_EQUITY_CONFIG_DEFINITION PipelineEquityConfigDefinitionService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-08-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("pipelineEquityConfigDefinitionService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PipelineEquityConfigDefinitionService extends BaseService<PipelineEquityConfigDefinition, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(PipelineEquityConfigDefinitionService.class);

    @Autowired private PipelineEquityConfigDefinitionDao dao;

    @Autowired private ExceptionBuilder exceptionBuilder;

    @Autowired private EquityRecordService equityRecordService;

    @Autowired private EquityConfigService equityConfigService;
    @Autowired private PipelineEquityConfigDefinitionService pipelineEquityConfigDefinitionService;
    @Autowired private PipelineDefinitionService pipelineDefinitionService;

    @Override public PipelineEquityConfigDefinitionDao getDao() {
        return dao;
    }

    /**
     * 检索营销流程权益
     *
     * @param pipelineDefinitionId 流程ID
     * @param tenantId             租户ID
     * @return 如果没有查检索到数据 ，返回空集
     * @throws Exception the exception
     */
    public List<PipelineEquityConfigDefinition> listByPipelineDefinitionId(Integer pipelineDefinitionId, String tenantId) throws Exception {
        PipelineEquityConfigDefinitionPage page = new PipelineEquityConfigDefinitionPage();
        page.setPipelineDefinitionId(String.valueOf(pipelineDefinitionId));
        page.setTenantId(tenantId);
        page.setCount("0");
        page.setCountOperator("!=");
        List<PipelineEquityConfigDefinition> result = getDao().queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    /**
     * Valid equity count.
     * 校验是否可以设置指定数量
     *
     * @param pipelineEquityConfigDefinition the pipeline equity config definition
     * @throws Exception the exception
     */
    public void validEquityCount(PipelineEquityConfigDefinition pipelineEquityConfigDefinition) throws Exception {
        Integer usedEquityCount = getUsedEquityCount(pipelineEquityConfigDefinition);
        if (usedEquityCount != null && usedEquityCount > pipelineEquityConfigDefinition.getCount()) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_EQUITY_INVALID);
        }
    }

    /**
     * 查询所有已被发放的权益数量
     */
    private Integer getUsedEquityCount(PipelineEquityConfigDefinition pipelineEquityConfigDefinition) throws Exception {
        EquityRecordPage page = new EquityRecordPage();
        page.setStatus(String.valueOf(EquityRecordConstants.EquityRecordStatusConstants.PIPELINE_EQUITY_USED));
        page.setEquityConfigId(String.valueOf(pipelineEquityConfigDefinition.getEquityConfigId()));
        page.setPipelineDefinitionId(String.valueOf(pipelineEquityConfigDefinition.getPipelineDefinitionId()));
        return equityRecordService.queryByCount(page);
    }

    /**
     * Valid overflow.
     * 校验是否超过总数
     *
     * @param pipelineEquityConfigDefinitions the pipeline equity config definitions
     * @throws Exception the exception
     */
    public void validOverflow(List<PipelineEquityConfigDefinition> pipelineEquityConfigDefinitions) throws Exception {
        Map<Integer, List<PipelineEquityConfigDefinition>> map = getMapFromList(pipelineEquityConfigDefinitions);
        Set<Map.Entry<Integer, List<PipelineEquityConfigDefinition>>> entrieSet = map.entrySet();
        for (Map.Entry<Integer, List<PipelineEquityConfigDefinition>> entry : entrieSet) {
            Integer equityConfigId = entry.getKey();
            List<PipelineEquityConfigDefinition> equityConfigDefinitions = entry.getValue();
            Integer total = getTotal(equityConfigId);
            Integer allocated = 0;
            for (PipelineEquityConfigDefinition configDefinition : equityConfigDefinitions) {
                allocated += configDefinition.getCount();
            }
            if (allocated > total) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_EQUITY_OVERFLOW);
            }
        }
    }

    private Map<Integer, List<PipelineEquityConfigDefinition>> getMapFromList(List<PipelineEquityConfigDefinition> pipelineEquityConfigDefinitions) {
        HashMap<Integer, List<PipelineEquityConfigDefinition>> hashMap = new HashMap<>(16);
        for (PipelineEquityConfigDefinition pipelineEquityConfigDefinition : pipelineEquityConfigDefinitions) {
            List<PipelineEquityConfigDefinition> definitionList = hashMap.get(pipelineEquityConfigDefinition.getEquityConfigId());
            if (definitionList == null || definitionList.size() == 0) {
                definitionList = new ArrayList<>();
                definitionList.add(pipelineEquityConfigDefinition);
            } else {
                definitionList.add(pipelineEquityConfigDefinition);
            }
            hashMap.put(pipelineEquityConfigDefinition.getEquityConfigId(), definitionList);
        }
        return hashMap;
    }

    private Integer getTotal(Integer equityConfigId) throws Exception {
        EquityConfig equityConfig = equityConfigService.selectByPrimaryKey(equityConfigId);
        if (equityConfig == null) {
            return 0;
        }
        return equityConfig.getTotal();
    }

    /**
     * Valid and insert pipeline equity config definition.
     * 活动未开始的时候的 权益分配
     *
     * @param pipelineEquityConfigDefinition the pipeline equity config definition
     * @return the pipeline equity config definition
     * @throws Exception the exception
     */

    public PipelineEquityConfigDefinition validAndInsert(PipelineEquityConfigDefinition pipelineEquityConfigDefinition) throws Exception {
        validEquityCount(pipelineEquityConfigDefinition);
        EquityConfig equityConfig = equityConfigService.selectByPrimaryKey(pipelineEquityConfigDefinition.getEquityConfigId());
        if (equityConfig == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.EQUITY_CONFIG_NOT_EXIST);
        }
        pipelineEquityConfigDefinition.setCode(equityConfig.getCode());
        insert(pipelineEquityConfigDefinition);
        return pipelineEquityConfigDefinition;
    }

    /**
     * Delete by pipeline definition id.
     *
     * @param pipelineDefinitionId the pipeline definition id
     */
    public void deleteByPipelineDefinitionId(Integer pipelineDefinitionId) {
        getDao().deleteByPipelineDefinitionId(pipelineDefinitionId);
    }

    /**
     * Query by pipeline definition id list list.
     *
     * @param idList the id list
     * @return the list
     */
    public List<PipelineEquityConfigDefinition> queryByPipelineDefinitionIdList(List<Integer> idList) {
        return getDao().findByPipelineDefinitionIdList(idList);
    }

    /**
     * Save by equity config.
     *
     * @param equityConfigs       the equity configs
     * @param pipelineDefinitions the pipeline definitions
     * @param request             the request
     * @throws Exception the exception
     */
    public void saveByEquityConfig(List<EquityConfig> equityConfigs, List<PipelineDefinition> pipelineDefinitions, HttpServletRequest request)
        throws Exception {
        if (null != equityConfigs && equityConfigs.size() > 0) {
            for (EquityConfig equityConfig : equityConfigs) {
                if (null != pipelineDefinitions && pipelineDefinitions.size() > 0) {
                    for (PipelineDefinition pipelineDefinition : pipelineDefinitions) {
                        savePipelineEquityConfigDefinition(pipelineDefinition.getId(), request, equityConfig);
                    }
                }
            }
        }
    }

    private void savePipelineEquityConfigDefinition(Integer pipelineDefinitionId, HttpServletRequest request, EquityConfig equityConfig)
        throws Exception {
        PipelineEquityConfigDefinition pipelineEquityConfigDefinition = new PipelineEquityConfigDefinition();
        pipelineEquityConfigDefinition.setPipelineDefinitionId(pipelineDefinitionId);
        pipelineEquityConfigDefinition.setEquityConfigId(equityConfig.getId());
        pipelineEquityConfigDefinition.setName(equityConfig.getName());
        pipelineEquityConfigDefinition.setCode(equityConfig.getCode());
        pipelineEquityConfigDefinition.setCount(0);
        pipelineEquityConfigDefinition.setPrecent(0F);
        pipelineEquityConfigDefinition.setCreateTime(new Date());
        AssignmentUtil.setInfo(pipelineEquityConfigDefinition, request);
        pipelineEquityConfigDefinitionService.insert(pipelineEquityConfigDefinition);
    }

    /**
     * Delete by equity config id.
     *
     * @param equityConfigId the equity config id
     */
    public void deleteByEquityConfigId(Integer equityConfigId) {
        getDao().deleteByEquityConfigId(equityConfigId);
    }

    /**
     * Save.
     *
     * @param pipelineEquityConfigDefinition the pipeline equity config definition
     * @throws Exception the exception
     */
    public void save(PipelineEquityConfigDefinition pipelineEquityConfigDefinition) throws Exception {
        if (null == pipelineEquityConfigDefinition.getId()) {
            insert(pipelineEquityConfigDefinition);
        } else {
            updateByPrimaryKeySelective(pipelineEquityConfigDefinition);
        }
    }

    /**
     * 修改对应权益的名称
     *
     * @param equityConfigId   权益ID
     * @param equityConfigName the equity config name
     * @throws Exception the exception
     */
    public void updateNameByEquityConfigId(Integer equityConfigId, String equityConfigName) throws Exception {
        getDao().updateNameByEquityConfigId(equityConfigId, equityConfigName);
    }
}
