package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.BatchNoticeConstants;
import com.talkingdata.marketing.core.constant.ChannelConstants;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType;
import com.talkingdata.marketing.core.constant.IdTypeConstants;
import com.talkingdata.marketing.core.constant.NodeOperatorConstants.CalcType;
import com.talkingdata.marketing.core.constant.PipelineInstanceConstant;
import com.talkingdata.marketing.core.dao.campaign.PipelineDefinitionDao;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.entity.campaign.BatchNotice;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.EquityConfig;
import com.talkingdata.marketing.core.entity.campaign.PipelineCrowdRel;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.campaign.PipelineEquityConfigDefinition;
import com.talkingdata.marketing.core.entity.campaign.PipelineInstance;
import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.PipelineDebugParam;
import com.talkingdata.marketing.core.entity.campaign.definition.PipelineDiagram;
import com.talkingdata.marketing.core.entity.campaign.definition.PipelineDiagramException;
import com.talkingdata.marketing.core.entity.campaign.definition.node.EdgeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.EndNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.EntranceNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.FilterNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.GenerateCrowdNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.HourMeterNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.PushNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.ShortMessageNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.SplitNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.TriggerNodeDefinition;
import com.talkingdata.marketing.core.entity.dto.NodeCheckDto;
import com.talkingdata.marketing.core.entity.dto.PipelineDebugParamDto;
import com.talkingdata.marketing.core.entity.dto.PipelineDefinitionDto;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.exception.MktException;
import com.talkingdata.marketing.core.page.campaign.PipelineCrowdRelPage;
import com.talkingdata.marketing.core.page.campaign.PipelineDefinitionPage;
import com.talkingdata.marketing.core.page.campaign.PipelineInstancePage;
import com.talkingdata.marketing.core.page.campaign.extend.CrowdCreationPage;
import com.talkingdata.marketing.core.page.campaign.extend.PipelineDefinitionExtendPage;
import com.talkingdata.marketing.core.page.dto.PipelineEquityConfigDefinitionDto;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.core.util.CronDateUtils;
import com.talkingdata.marketing.core.util.JsonUtil;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import static com.talkingdata.marketing.core.constant.BatchNoticeConstants.BatchNoticeStatusConstants.STATUS_OFFLINE;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_APPLY_FAIL;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_APPLY_SUCC;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_APPLY_TO_ONLINE;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_CHECKED;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_FINISH;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_OFFLINE;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_TESTING;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_WAITING_ONLINE;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineInstanceConstant.PIPELINE_INSTANCE_STATUS_OFFLINE;

/**
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_DEFINITION PipelineDefinitionService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-08-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("pipelineDefinitionService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PipelineDefinitionService extends BaseService<PipelineDefinition, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(PipelineDefinitionService.class);

    @Autowired private PipelineDefinitionDao dao;
    @Autowired private CampaignLaunchUnitService campaignLaunchUnitService;
    @Autowired private PipelineStageService pipelineStageService;
    @Autowired private EquityService equityService;
    @Autowired private EquityConfigService equityConfigService;
    @Autowired private EquityRecordService equityRecordService;
    @Autowired private PipelineInstanceService pipelineInstanceService;
    @Autowired private PipelineDefinitionService pipelineDefinitionService;
    @Autowired private PipelineEquityConfigDefinitionService pipelineEquityConfigDefinitionService;
    @Autowired private PipelineCrowdRelService pipelineCrowdRelService;
    @Autowired private BatchNoticeService batchNoticeService;
    @Autowired private CrowdService crowdService;
    @Autowired private ExceptionBuilder exceptionBuilder;
    @Autowired private NodeOperatorValidateService operatorValidateService;

    @Override public PipelineDefinitionDao getDao() {
        return dao;
    }

    public List<NodeCheckDto> check(PipelineDefinition pipelineDefinition) throws Exception {
        PipelineDiagram pipelineDiagram = JsonUtil.toObject(pipelineDefinition.getDiagram(), PipelineDiagram.class);
        saveDmpCrowd(pipelineDiagram);
        List<NodeCheckDto> nodeCheckDtos = new ArrayList<>();
        validateFreeNode(pipelineDiagram, nodeCheckDtos);
        if (!nodeCheckDtos.isEmpty()) {
            return nodeCheckDtos;
        }
        validateAllStartNode(pipelineDiagram, nodeCheckDtos);
        validateAllEndNode(pipelineDiagram, nodeCheckDtos);
        if (!nodeCheckDtos.isEmpty()) {
            return nodeCheckDtos;
        }
        List<AbstractNodeDefinition> nodeDefinitionList = pipelineDiagram.getNodeDefinitionList();
        if (nodeDefinitionList != null && nodeDefinitionList.size() > 0) {
            for (AbstractNodeDefinition abstractNodeDefinition : nodeDefinitionList) {
                NodeCheckDto checkDto = validate(abstractNodeDefinition);
                if (checkDto != null) {
                    nodeCheckDtos.add(checkDto);
                }
            }
        }
        if (nodeCheckDtos.size() == 0) {
            PipelineDefinition updatePipelineDefinition = new PipelineDefinition();
            updatePipelineDefinition.setId(pipelineDefinition.getId());
            updatePipelineDefinition.setStatus(PIPELINE_DEFINITION_STATUS_CHECKED);
            /**关联节点与人群的关系*/
            pipelineDiagram.relateCrowdId();
            /**冗余数据赋值*/
            assignRedundantData(pipelineDefinition, pipelineDiagram);
            updatePipelineDefinition.setDiagram(pipelineDiagram.toJsonSring());
            pipelineDefinitionService.updateByPrimaryKeySelective(updatePipelineDefinition);
        }
        return nodeCheckDtos;
    }

    /**
     * 对于用户运营人群，需要将人群信息ID存储到入口算子的crowdId中
     */
    private void saveDmpCrowd(PipelineDiagram pipelineDiagram) throws Exception {
        List<AbstractNodeDefinition> nodes = pipelineDiagram.findAllEntranceNode();
        for (AbstractNodeDefinition node : nodes) {
            if (node instanceof EntranceNodeDefinition) {
                EntranceNodeDefinition entranceNode = (EntranceNodeDefinition)node;
                if (Objects.equals(CrowdType.CROWD_TYPE_ACCURATE_HISTORY, entranceNode.getCrowdType())) {
                    if (entranceNode.getRefId() == null) {
                        logger.warn("campaignId: {}, pipelineId: {}, CrowdType: {}, refId is null", pipelineDiagram.getCampaignId(),
                            pipelineDiagram.getPipelineId(), entranceNode.getCrowdType());
                        return;
                    }
                    Crowd crowd = crowdService.queryByRefId(entranceNode.getRefId());
                    if (crowd == null) {
                        logger.error("campaignId: {}, pipelineId: {}, crowd refId: {}, crowd is not found", pipelineDiagram.getCampaignId(),
                            pipelineDiagram.getPipelineId(), entranceNode.getRefId());
                        return;
                    }
                    entranceNode.setCrowdId(crowd.getId());
                }
            }
        }
    }

    /**
     * 冗余数据赋值,pipelineDefinition有部分字段会在diagramDefinition中复存
     *
     * @param pipelineDefinition
     * @param diagramDefinition
     */
    private void assignRedundantData(PipelineDefinition pipelineDefinition, PipelineDiagram diagramDefinition) {
        BeanUtils.copyProperties(pipelineDefinition, diagramDefinition);
    }

    private void updateStatus(PipelineDefinition pipelineDefinition, Integer status) throws Exception {
        if (pipelineDefinition != null) {
            pipelineDefinition.setUpdateTime(new Date());
            pipelineDefinition.setStatus(status);
            // Pipeline上线，Pipeline开始debug
            if (status.equals(PIPELINE_DEFINITION_STATUS_APPLY_SUCC) || status.equals(PIPELINE_DEFINITION_STATUS_TESTING)
                    || status.equals(PIPELINE_DEFINITION_STATUS_WAITING_ONLINE)) {
                //生成stage，并保存到库中
                generateState(pipelineDefinition);
                //权益分配
                equityService.allocateEquity(pipelineDefinition.getCampaignId(), pipelineDefinition.getId());
                //创建pipelineInstance
                createPipelineInstance(pipelineDefinition);
                // Pipeline上线后下线，Pipeline在debug后停止debug
            } else if (status.equals(PIPELINE_DEFINITION_STATUS_OFFLINE) || status.equals(PIPELINE_DEFINITION_STATUS_CHECKED)) {
                equityService.recycleEquity(pipelineDefinition.getId());
                updateInstanceStatus(pipelineDefinition);
                pipelineStageService.deleteByCampaignIdAndPipelineIdAndVersion(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(),
                    pipelineDefinition.getVersion(), pipelineDefinition.getTenantId());
                batchNoticeService
                    .updateStatusByUniqueIndex(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), pipelineDefinition.getVersion(),
                        STATUS_OFFLINE);
            }
            updateByPrimaryKeySelective(pipelineDefinition);
        }
    }

    /**
     * 下线时将状态置为已下线
     *
     * @param pipelineDefinition
     * @throws Exception
     */
    private void updateInstanceStatus(PipelineDefinition pipelineDefinition) throws Exception {
        PipelineInstancePage page = new PipelineInstancePage();
        page.setCampaignId(String.valueOf(pipelineDefinition.getCampaignId()));
        page.setPipelineDefinitionId(String.valueOf(pipelineDefinition.getId()));
        page.setVersion(pipelineDefinition.getVersion());
        page.setStatus(String.valueOf(PIPELINE_INSTANCE_STATUS_OFFLINE));
        page.setStatusOperator("<");
        PipelineInstance instance = pipelineInstanceService.queryBySingle(page);
        if(null == instance){
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_IS_NOT_EXIST);
        }
        PipelineInstance param = new PipelineInstance();
        param.setId(instance.getId());
        param.setStatus(PIPELINE_INSTANCE_STATUS_OFFLINE);
        pipelineInstanceService.updateByPrimaryKeySelective(param);
    }

    public PipelineDefinition approvePipelineDefinition(PipelineDefinition pipelineDefinition, HttpServletRequest request) throws Exception {
        PipelineDefinition pipelineDefinitionInDb = pipelineDefinitionService.selectByPrimaryKey(pipelineDefinition.getId());
        if (!pipelineDefinitionInDb.getStatus().equals(PIPELINE_DEFINITION_STATUS_APPLY_TO_ONLINE)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_CANNOT_HANDLE);
        }
        //判断一下活动是否开始.已经开始则上线。没有开始则状态变为等待上线.
        Date now = new Date();
        if(pipelineDefinitionInDb.getStartTime().before(now)){
            updateStatus(pipelineDefinitionInDb, PIPELINE_DEFINITION_STATUS_APPLY_SUCC);
        }else{
            updateStatus(pipelineDefinitionInDb, PIPELINE_DEFINITION_STATUS_WAITING_ONLINE);
        }


        String diagram = pipelineDefinitionInDb.getDiagram();
        PipelineDiagram pipelineDiagram = JsonUtil.toObject(diagram, PipelineDiagram.class);
        saveBatchNotice(pipelineDefinitionInDb, pipelineDiagram, request);
        PipelineDiagram diagramDefinition;
        try {
            diagramDefinition = JsonUtil.toObject(pipelineDefinitionInDb.getDiagram(), PipelineDiagram.class);
        } catch (Exception e) {
            logger.error("创建PipelineDefinition，PipelineDiagram转换失败:", e);
            throw new PipelineDiagramException("转换失败");
        }
        pipelineDefinitionService.savePipelineCrowdRel(pipelineDefinitionInDb, diagramDefinition, request);
        return pipelineDefinitionInDb;
    }

    public PipelineDefinition rejectPipelineDefinition(PipelineDefinition pipelineDefinition) throws Exception {
        PipelineDefinition pipelineDefinitionInDb = pipelineDefinitionService.selectByPrimaryKey(pipelineDefinition.getId());
        if (!pipelineDefinitionInDb.getStatus().equals(PIPELINE_DEFINITION_STATUS_APPLY_TO_ONLINE)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_CANNOT_HANDLE);
        }
        updateStatus(pipelineDefinitionInDb, PIPELINE_DEFINITION_STATUS_APPLY_FAIL);
        return pipelineDefinitionInDb;
    }

    public PipelineDefinition offlinePipelineDefinition(PipelineDefinition pipelineDefinition, HttpServletRequest request) throws Exception {
        updateStatus(pipelineDefinition, PIPELINE_DEFINITION_STATUS_OFFLINE);
        PipelineDiagram diagramDefinition = null;
        try {
            diagramDefinition = JsonUtil.toObject(pipelineDefinition.getDiagram(), PipelineDiagram.class);
        } catch (Exception e) {
            logger.error("更新PipelineDefinition，PipelineDiagram转换失败:", e);
            throw new PipelineDiagramException("转换失败", e);
        }
        pipelineDefinitionService.updatePipelineCrowdRel(pipelineDefinition, diagramDefinition, request, true);
        return pipelineDefinition;
    }

    private void generateState(PipelineDefinition pipelineDefinition) throws Exception {
        String diagram = pipelineDefinition.getDiagram();
        PipelineDiagram pipelineDiagram = JsonUtil.toObject(diagram, PipelineDiagram.class);
        pipelineStageService.generateStage(pipelineDiagram);
    }

    private void createPipelineInstance(PipelineDefinition pipelineDefinition) throws Exception {
        PipelineInstance pipelineInstance = new PipelineInstance();
        pipelineInstance.setCampaignId(pipelineDefinition.getCampaignId());
        pipelineInstance.setPipelineDefinitionId(pipelineDefinition.getId());
        pipelineInstance.setVersion(pipelineDefinition.getVersion());
        pipelineInstance.setStatus(PipelineInstanceConstant.PIPELINE_INSTANCE_NOT_START);
        pipelineInstance.setStartTime(pipelineDefinition.getStartTime());
        pipelineInstance.setEndTime(pipelineDefinition.getEndTime());
        pipelineInstance.setSubmitTime(new Date());
        pipelineInstance.setTenantId(pipelineDefinition.getTenantId());
        pipelineInstance.setCreator(pipelineDefinition.getCreator());
        pipelineInstance.setCreateBy(pipelineDefinition.getCreateBy());
        pipelineInstance.setCreateTime(pipelineDefinition.getCreateTime());
        pipelineInstance.setUpdater(pipelineDefinition.getUpdater());
        pipelineInstance.setUpdateBy(pipelineDefinition.getUpdateBy());
        pipelineInstance.setUpdateTime(pipelineDefinition.getUpdateTime());
        pipelineInstanceService.insert(pipelineInstance);
    }

    public List<PipelineDefinitionDto> queryByPage(PipelineDefinitionExtendPage page) throws Exception {
        Integer offset = null;
        Integer limit = null;
        if (page.getPage() != null && page.getPageSize() != null) {
            offset = (page.getPage() - 1) * page.getPageSize();
            limit = page.getPageSize();
        }
        Integer campaignId = page.getCampaignId() == null ? null : Integer.valueOf(page.getCampaignId());
        Date updateTime1 = page.getUpdateTime1() == null ? null : new Date(page.getUpdateTime1());
        Date updateTime2 = page.getUpdateTime2() == null ? null : new Date(page.getUpdateTime2());
        return getDao()
            .queryByPage(campaignId, page.getCreator(), page.getName(), page.getStatusList(), page.getUpdater(), updateTime1, updateTime2, offset,
                limit);
    }

    public int countByPage(PipelineDefinitionExtendPage page) {
        Integer campaignId = page.getCampaignId() == null ? null : Integer.valueOf(page.getCampaignId());
        Date updateTime1 = page.getUpdateTime1() == null ? null : new Date(page.getUpdateTime1());
        Date updateTime2 = page.getUpdateTime2() == null ? null : new Date(page.getUpdateTime2());
        return getDao().countByPage(campaignId, page.getCreator(), page.getName(), page.getStatusList(), page.getUpdater(), updateTime1, updateTime2);
    }

    public Crowd createRelatedCrowd(CrowdCreationPage crowdCreationPage, HttpServletRequest request, Attachment attachment) throws Exception {
        Crowd crowd = campaignLaunchUnitService.buildAndCreateCrowd(crowdCreationPage, request, attachment);
        return crowd;
    }

    /**
     * 检索活动流程全部权益
     *
     * @param pipelineDefinitionId 活动流程ID
     * @param tenantId             租户
     * @return 如果没有查检索到数据，返回空集
     * @throws Exception
     */
    public List<PipelineEquityConfigDefinition> findCampaignGlobalEquity(Integer pipelineDefinitionId, String tenantId) throws Exception {
        return pipelineEquityConfigDefinitionService.listByPipelineDefinitionId(pipelineDefinitionId, tenantId);
    }

    public void delete(Integer id) throws Exception {
        deleteByPrimaryKey(id);
        pipelineEquityConfigDefinitionService.deleteByPipelineDefinitionId(id);
    }

    public NodeCheckDto validate(AbstractNodeDefinition abstractNodeDefinition) {
        NodeCheckDto nodeCheckDto = null;
        if (abstractNodeDefinition instanceof EntranceNodeDefinition) {
            nodeCheckDto = operatorValidateService.validateEntranceNode((EntranceNodeDefinition)abstractNodeDefinition);
        }
        if (abstractNodeDefinition instanceof FilterNodeDefinition) {
            nodeCheckDto = operatorValidateService.validateFilterNode((FilterNodeDefinition)abstractNodeDefinition);
        }
        if (abstractNodeDefinition instanceof GenerateCrowdNodeDefinition) {
            nodeCheckDto = operatorValidateService.validateGenerateCrowdNode((GenerateCrowdNodeDefinition)abstractNodeDefinition);
        }
        if (abstractNodeDefinition instanceof HourMeterNodeDefinition) {
            nodeCheckDto = operatorValidateService.validateHourMeterNode((HourMeterNodeDefinition)abstractNodeDefinition);
        }
        if ((abstractNodeDefinition instanceof PushNodeDefinition)) {
            nodeCheckDto = operatorValidateService.validatePushNode((PushNodeDefinition)abstractNodeDefinition);
        }
        if (abstractNodeDefinition instanceof ShortMessageNodeDefinition) {
            nodeCheckDto = operatorValidateService.validateShortMessageNode((ShortMessageNodeDefinition)abstractNodeDefinition);
        }
        if (abstractNodeDefinition instanceof SplitNodeDefinition) {
            nodeCheckDto = operatorValidateService.validateSplitNode((SplitNodeDefinition)abstractNodeDefinition);
        }
        if (abstractNodeDefinition instanceof TriggerNodeDefinition) {
            nodeCheckDto = operatorValidateService.validateTriggerNode((TriggerNodeDefinition)abstractNodeDefinition);
        }
        return nodeCheckDto;
    }

    public List<PipelineDefinitionDto> queryPipelineDefinitionDtoByParam(Integer campaignId, String tenantId) throws Exception {
        PipelineDefinitionPage pipelineDefinitionPage = new PipelineDefinitionPage();
        pipelineDefinitionPage.setCampaignId(campaignId + "");
        pipelineDefinitionPage.setTenantId(tenantId);
        pipelineDefinitionPage.setPageSize(Integer.MAX_VALUE);
        List<PipelineDefinitionDto> pipelineDefinitionDtoList = new ArrayList<>();
        List<PipelineDefinition> pipelineDefinitions = queryByList(pipelineDefinitionPage);
        List<EquityConfig> equityConfigs = equityConfigService.findByCampaignId(campaignId);
        if (pipelineDefinitions != null && pipelineDefinitions.size() > 0) {
            pipelineDefinitionDtoList = getPipelineDefinitionDto(pipelineDefinitions, equityConfigs, tenantId);
        }
        return pipelineDefinitionDtoList;
    }

    /**
     * 根据Id查询pipelineDefinition，返回包含权益信息的PipelineDefinitionDto
     *
     * @param id pipelineDefinition id
     * @return 包含权益信息的PipelineDefinitionDto
     */
    public PipelineDefinitionDto queryPipelineDefinitionDtoById(Integer id) throws Exception {
        PipelineDefinition pipelineDefinition = getDao().selectByPrimaryKey(id);
        List<EquityConfig> equityConfigs = equityConfigService.findByCampaignId(pipelineDefinition.getCampaignId());
        return buildPipelineDefinitionDto(equityConfigs, pipelineDefinition.getTenantId(), pipelineDefinition);
    }

    private List<PipelineDefinitionDto> getPipelineDefinitionDto(List<PipelineDefinition> pipelineDefinitions, List<EquityConfig> equityConfigs,
        String tenantId) throws Exception {
        List<PipelineDefinitionDto> pipelineDefinitionDtos = new ArrayList<>();
        for (PipelineDefinition pipelineDefinition : pipelineDefinitions) {
            PipelineDefinitionDto pipelineDefinitionDto = buildPipelineDefinitionDto(equityConfigs, tenantId, pipelineDefinition);
            pipelineDefinitionDto.setStatus(calcPipelineStatus(pipelineDefinition));
            pipelineDefinitionDtos.add(pipelineDefinitionDto);
        }
        return pipelineDefinitionDtos;
    }

    /**
     * 计算Pipeline的当前状态
     *
     * @param pipelineDefinition
     * @return
     */
    private int calcPipelineStatus(PipelineDefinition pipelineDefinition) {
        if (pipelineDefinition.getEndTime().before(new Date())) {
            return PIPELINE_DEFINITION_STATUS_FINISH;
        }
        return pipelineDefinition.getStatus();
    }

    private PipelineDefinitionDto buildPipelineDefinitionDto(List<EquityConfig> equityConfigs, String tenantId, PipelineDefinition pipelineDefinition)
        throws Exception {
        List<PipelineEquityConfigDefinition> pipelineEquityConfigDefinitions =
            pipelineEquityConfigDefinitionService.listByPipelineDefinitionId(pipelineDefinition.getId(), tenantId);
        Map<Integer, PipelineEquityConfigDefinition> map = genMap(pipelineEquityConfigDefinitions);
        PipelineDefinitionDto pipelineDefinitionDto = new PipelineDefinitionDto();
        BeanUtils.copyProperties(pipelineDefinition, pipelineDefinitionDto);
        List<PipelineEquityConfigDefinitionDto> pipelineEquityConfigDefinitionDtos = new ArrayList<>();
        if (null != equityConfigs && equityConfigs.size() > 0) {
            for (EquityConfig equityConfig : equityConfigs) {
                PipelineEquityConfigDefinitionDto pipelineEquityConfigDefinitionDto = new PipelineEquityConfigDefinitionDto();
                PipelineEquityConfigDefinition value = map.get(equityConfig.getId());
                if (null == value) {
                    value = new PipelineEquityConfigDefinition();
                    value.setName(equityConfig.getName());
                    value.setPipelineDefinitionId(pipelineDefinition.getId());
                    value.setPrecent(0F);
                    value.setCode(equityConfig.getCode());
                    value.setCount(0);
                    value.setEquityConfigId(equityConfig.getId());
                    BeanUtils.copyProperties(value, pipelineEquityConfigDefinitionDto);
                    pipelineEquityConfigDefinitionDto.setRemain(0);
                } else {
                    BeanUtils.copyProperties(value, pipelineEquityConfigDefinitionDto);
                    int used = equityRecordService
                        .countUsedForPipelineEquity(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), value.getEquityConfigId());
                    pipelineEquityConfigDefinitionDto.setRemain(value.getCount() - used);
                }
                pipelineEquityConfigDefinitionDtos.add(pipelineEquityConfigDefinitionDto);
            }
        }
        pipelineDefinitionDto.setPipelineEquityConfigDefinitionDtos(pipelineEquityConfigDefinitionDtos);
        return pipelineDefinitionDto;
    }

    private Map<Integer, PipelineEquityConfigDefinition> genMap(List<PipelineEquityConfigDefinition> pipelineEquityConfigDefinitions) {
        Map<Integer, PipelineEquityConfigDefinition> map = new HashMap<>(16);
        for (PipelineEquityConfigDefinition pipelineEquityConfigDefinition : pipelineEquityConfigDefinitions) {
            map.put(pipelineEquityConfigDefinition.getEquityConfigId(), pipelineEquityConfigDefinition);
        }
        return map;
    }

    private List<Integer> getIdList(List<PipelineDefinition> pipelineDefinitions) {
        ArrayList<Integer> idList = new ArrayList<>();
        for (PipelineDefinition pipelineDefinition : pipelineDefinitions) {
            idList.add(pipelineDefinition.getId());
        }
        return idList;
    }

    public List<PipelineDefinition> findByCampaignId(Integer campaignId) {
        return getDao().findByCampaignId(campaignId);
    }

    /**
     * 检索当前租户下的营销流程数据，条件营销活动ID与营销流程名称
     * 在此使用同步代码块，目前只是适用单机部署情况
     *
     * @param campaignId   营销活动ID
     * @param pipelineName 营销流程名称
     * @param tenantId     租户ID
     * @return
     */
    public List<PipelineDefinition> getByCampaignIdAndPipelineName(Integer campaignId, String pipelineName, String tenantId) {
        List<PipelineDefinition> result = new ArrayList<>();
        PipelineDefinitionPage page = new PipelineDefinitionPage();
        page.setCampaignId(String.valueOf(campaignId));
        page.setName(null == pipelineName ? "":pipelineName);
        page.setTenantId(tenantId);
        synchronized (PipelineDefinitionService.class) {
            result = getDao().queryByList(page);
        }
        return result;
    }

    /**
     * 更新记录至Pipeline人群关联表
     *
     * @param pipelineDefinition
     * @param pipelineDiagram
     * @param request
     * @throws Exception
     */
    public void updatePipelineCrowdRel(PipelineDefinition pipelineDefinition, PipelineDiagram pipelineDiagram, HttpServletRequest request,
        boolean delete) throws Exception {
        //删除
        PipelineCrowdRelPage pipelineCrowdRelPage = new PipelineCrowdRelPage();
        pipelineCrowdRelPage.setPipelineId(pipelineDiagram.getPipelineId() + "");
        List<PipelineCrowdRel> pipelineCrowdRels = pipelineCrowdRelService.queryByList(pipelineCrowdRelPage);
        for (PipelineCrowdRel pipelineCrowdRel : pipelineCrowdRels) {
            pipelineCrowdRelService.deleteByPrimaryKey(pipelineCrowdRel.getId());
        }
        if (!delete) {
            //保存
            savePipelineCrowdRel(pipelineDefinition, pipelineDiagram, request);
        }
    }

    /**
     * 保存记录至Pipeline人群关联表
     *
     * @param pipelineDefinition
     * @param pipelineDiagram
     * @param request
     * @throws Exception
     */
    public void savePipelineCrowdRel(PipelineDefinition pipelineDefinition, PipelineDiagram pipelineDiagram, HttpServletRequest request)
        throws Exception {
        // //入口节点获取人群
        List<AbstractNodeDefinition> allEntranceNode = pipelineDiagram.findAllEntranceNode();
        for (AbstractNodeDefinition abstractNodeDefinition : allEntranceNode) {
            if (abstractNodeDefinition instanceof EntranceNodeDefinition) {
                EntranceNodeDefinition entranceNodeDefinition = (EntranceNodeDefinition)abstractNodeDefinition;
                if (entranceNodeDefinition.getCrowdId() != null) {
                    PipelineCrowdRel pipelineCrowdRel = new PipelineCrowdRel();
                    pipelineCrowdRel.setCampaignId(pipelineDefinition.getCampaignId());
                    pipelineCrowdRel.setPipelineId(pipelineDiagram.getPipelineId());
                    pipelineCrowdRel.setPipelineVersion(pipelineDiagram.getVersion());
                    pipelineCrowdRel.setPipelineNodeId(entranceNodeDefinition.getId());
                    pipelineCrowdRel.setCrowdId(entranceNodeDefinition.getCrowdId());
                    pipelineCrowdRel.setCrowdVerion(entranceNodeDefinition.getCrowdVersion());
                    Crowd crowd = crowdService.selectByPrimaryKey(entranceNodeDefinition.getCrowdId());
                    pipelineCrowdRel.setCrowdRefId(crowd.getRefId());
                    pipelineCrowdRel.setCalcStatus(crowd.getCalcStatus());
                    pipelineCrowdRel.setCalcType(entranceNodeDefinition.getCalcType());
                    pipelineCrowdRel.setCalcPeriod(entranceNodeDefinition.getPeriod());
                    AssignmentUtil.setInfo(pipelineCrowdRel, request);
                    pipelineCrowdRelService.insert(pipelineCrowdRel);
                }
            }
        }

    }

    /**
     * 保存记录至Pipeline通知表
     *
     * @param pipelineDefinition
     * @param pipelineDiagram
     * @param request
     * @throws Exception
     */
    private void saveBatchNotice(PipelineDefinition pipelineDefinition, PipelineDiagram pipelineDiagram, HttpServletRequest request)
        throws Exception {
        //循环所有节点
        List<AbstractNodeDefinition> allEntranceNode = pipelineDiagram.getNodeDefinitionList();
        for (AbstractNodeDefinition abstractNodeDefinition : allEntranceNode) {
            BatchNotice batchNotice = new BatchNotice();
            batchNotice.setCampaignId(pipelineDefinition.getCampaignId());
            batchNotice.setPipelineId(pipelineDiagram.getPipelineId());
            batchNotice.setVersion(pipelineDiagram.getVersion());
            batchNotice.setCreateTime(new Date());
            if (abstractNodeDefinition instanceof PushNodeDefinition) {
                //推送
                PushNodeDefinition pushNodeDefinition = (PushNodeDefinition)abstractNodeDefinition;
                batchNotice.setPipelineNodeId(pushNodeDefinition.getId());
                batchNotice.setNoticeType(ChannelConstants.PUSH);
                batchNotice.setStatus(BatchNoticeConstants.BatchNoticeCalcStatusConstants.CALC_STATUS_UNSTART);
                batchNotice.setCalcStatus(BatchNoticeConstants.BatchNoticeCalcStatusConstants.CALC_STATUS_UNSTART);
                batchNotice.setIdType(IdTypeConstants.TDID);
                batchNotice.setNoticeMessage(JsonUtil.toJson(pushNodeDefinition));
                if (StringUtils.isNotEmpty(pushNodeDefinition.getAppointedTime())) {
                    Date noticeTime = CronDateUtils.getNextByCron(pushNodeDefinition.getAppointedTime(), new Date());
                    batchNotice.setNoticeTime(noticeTime);
                    batchNotice.setCronExpression(pushNodeDefinition.getAppointedTime());
                }
                batchNotice.setTriggerType(pushNodeDefinition.getTriggerType());
                AssignmentUtil.setInfo(batchNotice, request);
                batchNoticeService.insert(batchNotice);
            } else if (abstractNodeDefinition instanceof ShortMessageNodeDefinition) {
                //短信
                ShortMessageNodeDefinition shortMessageNodeDefinition = (ShortMessageNodeDefinition)abstractNodeDefinition;
                batchNotice.setPipelineNodeId(shortMessageNodeDefinition.getId());
                batchNotice.setNoticeType(ChannelConstants.SMS);
                batchNotice.setStatus(BatchNoticeConstants.BatchNoticeCalcStatusConstants.CALC_STATUS_UNSTART);
                batchNotice.setCalcStatus(BatchNoticeConstants.BatchNoticeCalcStatusConstants.CALC_STATUS_UNSTART);
                batchNotice.setIdType(IdTypeConstants.MOBILEID);
                batchNotice.setNoticeMessage(JsonUtil.toJson(shortMessageNodeDefinition));
                if (StringUtils.isNotEmpty(shortMessageNodeDefinition.getCronExpression())) {
                    Date noticeTime = CronDateUtils.getNextByCron(shortMessageNodeDefinition.getCronExpression(), new Date());
                    batchNotice.setNoticeTime(noticeTime);
                    batchNotice.setCronExpression(shortMessageNodeDefinition.getCronExpression());
                }
                batchNotice.setTriggerType(shortMessageNodeDefinition.getTriggerType());
                AssignmentUtil.setInfo(batchNotice, request);
                batchNoticeService.insert(batchNotice);
            }
        }
    }

    /**
     * 检索简洁的PipelineDefinition数据，不包含diagram字段的数据
     *
     * @param ids PipelineDefinition主键ID
     * @return 如果未检索到返回空集
     * @throws Exception
     */
    public List<PipelineDefinition> findSimpleInstanceByIds(Set<Integer> ids) throws Exception {
        if (ids == null || ids.isEmpty()) {
            return Collections.EMPTY_LIST;
        }
        return getDao().selectSimpleInstanceByIds(ids);
    }

    /**
     * 校验Pipeline中是否存在游离算子
     */
    private void validateFreeNode(PipelineDiagram pipelineDiagram, List<NodeCheckDto> nodeCheckDtos) throws MktException {
        List<AbstractNodeDefinition> freeNodeDefinition = pipelineDiagram.findFreeNodeDefinition();
        if (freeNodeDefinition != null && !freeNodeDefinition.isEmpty()) {
            for (AbstractNodeDefinition definition : freeNodeDefinition) {
                List<String> errMsg = new ArrayList<>();
                errMsg.add("组件未包含进流程");
                nodeCheckDtos.add(new NodeCheckDto(definition.getId(), errMsg));
            }
        }
        List<EdgeDefinition> freeEdgeDefinition = pipelineDiagram.findFreeEdgeDefinition();
        if (freeEdgeDefinition != null && !freeEdgeDefinition.isEmpty()) {
            for (EdgeDefinition definition : freeEdgeDefinition) {
                List<String> errMsg = new ArrayList<>();
                errMsg.add("组件未包含进流程");
                nodeCheckDtos.add(new NodeCheckDto(definition.getId(), errMsg));
            }
        }
    }

    /**
     * 校验Pipeline是否以入口算子开始
     */
    private void validateAllStartNode(PipelineDiagram pipelineDiagram, List<NodeCheckDto> nodeCheckDtos) throws MktException {
        List<AbstractNodeDefinition> allEntranceNode = pipelineDiagram.findAllEntranceNode();
        if (allEntranceNode != null && !allEntranceNode.isEmpty()) {
            for (AbstractNodeDefinition abstractNodeDefinition : allEntranceNode) {
                if (!(abstractNodeDefinition instanceof EntranceNodeDefinition)) {
                    List<String> errMsg = new ArrayList<>();
                    errMsg.add("流程应以入口算子开始");
                    nodeCheckDtos.add(new NodeCheckDto(abstractNodeDefinition.getId(), errMsg));
                }
            }
        }
    }

    /**
     * 校验Pipeline中是否存在未结束算子
     */
    private void validateAllEndNode(PipelineDiagram pipelineDiagram, List<NodeCheckDto> nodeCheckDtos) throws MktException {
        List<AbstractNodeDefinition> allEndNode = pipelineDiagram.findAllEndNode();
        if (allEndNode != null && !allEndNode.isEmpty()) {
            if (allEndNode.size() > 1 || !(allEndNode.get(0) instanceof EndNodeDefinition)) {
                for (AbstractNodeDefinition definition : allEndNode) {
                    if (!(definition instanceof EndNodeDefinition)) {
                        List<String> errMsg = new ArrayList<>();
                        errMsg.add("分支未结束");
                        nodeCheckDtos.add(new NodeCheckDto(definition.getId(), errMsg));
                    }
                }
            }
        }
    }

    /**
     * Pipeline数据提交
     *
     * @param pipelineId 待提交Pipeline数据的ID
     * @throws Exception
     */
    public void submit(Integer pipelineId) throws Exception {
        PipelineDefinition pipelineDefinition = pipelineDefinitionService.selectByPrimaryKey(pipelineId);
        if (pipelineDefinition == null || pipelineDefinition.getStatus() == null || (!PIPELINE_DEFINITION_STATUS_CHECKED
            .equals(pipelineDefinition.getStatus()))) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_CANNOT_COMMIT);
        }
        if (PIPELINE_DEFINITION_STATUS_TESTING.equals(pipelineDefinition.getStatus())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_CANNOT_SUBMIT_DEBUG);
        }
        PipelineDefinition pipelineInstance = new PipelineDefinition();
        pipelineInstance.setId(pipelineId);
        pipelineInstance.setStatus(PIPELINE_DEFINITION_STATUS_APPLY_TO_ONLINE);
        updateByPrimaryKeySelective(pipelineInstance);
    }

    /**
     * debug 营销流程
     * 先更新debug参数，写用户运营人群
     * 然后在走上线的流程：updateStatus（生成stage，权益分配，PipelineInstance, 更新PipelineDefinition状态）, 保存通知信息，保存人群与Pipeline关联
     *
     * @param pipelineDef   PipelineDefinition
     * @param debugParamDto PipelineDebugParamDto
     */
    public void debugPipeline(PipelineDefinition pipelineDef, PipelineDebugParamDto debugParamDto, HttpServletRequest request) throws Exception {
        updateDebugParam(pipelineDef, debugParamDto);
        updateStatus(pipelineDef, PIPELINE_DEFINITION_STATUS_TESTING);
        PipelineDiagram pipelineDiagram = JsonUtil.toObject(pipelineDef.getDiagram(), PipelineDiagram.class);
        saveBatchNotice(pipelineDef, pipelineDiagram, request);
        saveDebugPipelineCrowdRel(pipelineDef, pipelineDiagram, debugParamDto, request);
    }

    /**
     * 停止debug营销流程
     * 先 updateStatus（回收权益，PipelineInstance，删除stage，删除通知信息，更新PipelineDefinition状态）
     * 在删除Pipeline与人群关联
     *
     * @param pipelineDef PipelineDefinition
     */
    public void debugStopPipeline(PipelineDefinition pipelineDef) throws Exception {
        updateStatus(pipelineDef, PIPELINE_DEFINITION_STATUS_CHECKED);
        PipelineDiagram diagram = JsonUtil.toObject(pipelineDef.getDiagram(), PipelineDiagram.class);
        deletePipelineCrowdRel(pipelineDef, diagram);
    }

    private void saveDebugPipelineCrowdRel(PipelineDefinition pipelineDef, PipelineDiagram pipelineDiagram, PipelineDebugParamDto debugParamDto,
        HttpServletRequest request) throws Exception {
        PipelineCrowdRel pipelineCrowdRel = new PipelineCrowdRel();
        pipelineCrowdRel.setCampaignId(pipelineDef.getCampaignId());
        pipelineCrowdRel.setPipelineId(pipelineDef.getId());
        pipelineCrowdRel.setPipelineVersion(pipelineDef.getVersion());
        pipelineCrowdRel.setCrowdId(pipelineDiagram.getDebugParam().getDebugCrowdId());
        pipelineCrowdRel.setCrowdVerion(debugParamDto.getDebugCrowd().getLastVersion());
        pipelineCrowdRel.setCrowdRefId(debugParamDto.getDebugCrowd().getRefId());
        pipelineCrowdRel.setCalcStatus(debugParamDto.getDebugCrowd().getCalcStatus());
        // debug 状态下人群频率为永不
        pipelineCrowdRel.setCalcType(CalcType.NODE_CALC_TYPE_NEVER);
        AssignmentUtil.setInfo(pipelineCrowdRel, request);
        pipelineCrowdRelService.insert(pipelineCrowdRel);
    }

    private void deletePipelineCrowdRel(PipelineDefinition pipelineDef, PipelineDiagram diagram) {
        PipelineCrowdRel crowdRel = new PipelineCrowdRel();
        crowdRel.setCampaignId(pipelineDef.getCampaignId());
        crowdRel.setPipelineId(pipelineDef.getId());
        crowdRel.setPipelineVersion(pipelineDef.getVersion());
        crowdRel.setCrowdId(diagram.getDebugParam().getDebugCrowdId());
        pipelineCrowdRelService.getDao().deleteByPipelineInfoAndCrowdId(crowdRel);
    }

    /**
     * 更新Pipeline测试参数
     */
    private void updateDebugParam(PipelineDefinition pipelineDef, PipelineDebugParamDto debugParamDto) throws Exception {
        PipelineDiagram diagram = JsonUtil.toObject(pipelineDef.getDiagram(), PipelineDiagram.class);
        PipelineDebugParam debugParam = new PipelineDebugParam();
        BeanUtils.copyProperties(debugParamDto, debugParam);
        Crowd debugCrowd = debugParamDto.getDebugCrowd();
        if (debugCrowd == null) {
            throw new MktException(ExceptionMessage.RIGHT_TOP.getCode(), "测试人群不能为空");
        }
        if (debugParamDto.getDebugCrowdId() == null) {
            Crowd crowdByQuery = crowdService.queryByRefId(debugCrowd.getRefId());
            if (crowdByQuery == null) {
                logger.info("crowdRefId: {}, dmp crowd insert to DB", debugCrowd.getRefId());
                crowdService.getDao().insert(debugCrowd);
            }
        }
        debugParam.setDebugCrowdId(debugCrowd.getId());
        diagram.setDebugParam(debugParam);
        pipelineDef.setDiagram(JsonUtil.toJson(diagram));
    }

    public List<AbstractNodeDefinition> queryForbidRules(Integer pipelineId,String type) throws Exception{
        logger.info("查询禁止规则开始.pipelineId={}",pipelineId);
        PipelineDefinition pipelineDef = pipelineDefinitionService.selectByPrimaryKey(pipelineId);
        if (pipelineDef == null || pipelineDef.getStatus() == null) {
            throw new MktException(ExceptionMessage.RIGHT_TOP.getCode(), "营销流程不存在");
        }

        PipelineDiagram pipelineDiagram = JsonUtil.toObject(pipelineDef.getDiagram(), PipelineDiagram.class);
        if(null != pipelineDiagram){
            List<AbstractNodeDefinition> forbidNodeList = new ArrayList<>();
            List<AbstractNodeDefinition> nodeList = pipelineDiagram.getNodeDefinitionList();
            if(CollectionUtils.isNotEmpty(nodeList)){
                for(AbstractNodeDefinition node : nodeList){
                    HashMap nodeMap = JsonUtil.toObject(JsonUtil.toJson(node), HashMap.class);
                    if(type.equals(nodeMap.get("type"))){
                        forbidNodeList.add(node);
                    }
                }
            }
            logger.info("查询禁止规则结束.forbidNodeList={}");
            return forbidNodeList;
        }else{
            throw new MktException(ExceptionMessage.RIGHT_TOP.getCode(), "营销流程不存在");
        }
    }

}
