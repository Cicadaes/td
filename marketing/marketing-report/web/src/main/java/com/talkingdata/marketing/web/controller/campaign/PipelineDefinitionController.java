package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.constant.AttachmentConstants;
import com.talkingdata.marketing.core.constant.EquityRecordConstants;
import com.talkingdata.marketing.core.constant.PipelineDefinitionConstant;
import com.talkingdata.marketing.core.constant.SessionConstants;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.campaign.PipelineEquityConfigDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.PipelineDiagram;
import com.talkingdata.marketing.core.entity.campaign.definition.PipelineDiagramException;
import com.talkingdata.marketing.core.entity.campaign.definition.node.EdgeDefinition;
import com.talkingdata.marketing.core.entity.dto.NodeCheckDto;
import com.talkingdata.marketing.core.entity.dto.PipelineConfigDTO;
import com.talkingdata.marketing.core.entity.dto.PipelineDebugParamDto;
import com.talkingdata.marketing.core.entity.dto.PipelineDefinitionDto;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.tag.TagVo;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.exception.MktException;
import com.talkingdata.marketing.core.page.admin.BehaviorDefinitionPage;
import com.talkingdata.marketing.core.page.campaign.EquityRecordPage;
import com.talkingdata.marketing.core.page.campaign.PipelineDefinitionPage;
import com.talkingdata.marketing.core.page.campaign.extend.BehaviorDefinitionExtendPage;
import com.talkingdata.marketing.core.page.campaign.extend.CrowdCreationPage;
import com.talkingdata.marketing.core.page.campaign.extend.PipelineDefinitionExtendPage;
import com.talkingdata.marketing.core.service.admin.BehaviorDefinitionService;
import com.talkingdata.marketing.core.service.campaign.AttachmentService;
import com.talkingdata.marketing.core.service.campaign.EquityRecordService;
import com.talkingdata.marketing.core.service.campaign.PipelineConfigService;
import com.talkingdata.marketing.core.service.campaign.PipelineDefinitionService;
import com.talkingdata.marketing.core.service.campaign.PipelineEquityConfigDefinitionService;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.core.util.FileUtil;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.web.constraint.MktValidator;
import com.talkingdata.marketing.web.util.PipelineUtil;
import com.tendcloud.enterprise.um.umic.entity.Tenant;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_APPLY_FAIL;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_APPLY_SUCC;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_CHECKED;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_DRAFT;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_OFFLINE;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_TESTING;
import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_WAITING_ONLINE;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PATCH;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class PipelineDefinitionController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(PipelineDefinitionController.class);
    @Autowired
    EquityRecordService equityRecordService;
    @Autowired
    PipelineEquityConfigDefinitionService pipelineEquityConfigDefinitionService;
    @Autowired
    private PipelineDefinitionService pipelineDefinitionService;
    @Autowired
    private MktValidator mktValidator;
    @Autowired
    private ExceptionBuilder exceptionBuilder;
    @Autowired
    private PipelineUtil pipelineUtil;
    @Autowired
    private PipelineConfigService pipelineConfigService;
    @Autowired
    private BehaviorDefinitionService behaviorDefinitionService;
    @Autowired
    private AttachmentService attachmentService;

    @RequestMapping(value = "/pipelineDefinitions", method = GET)
    @ResponseBody
    public List<PipelineDefinition> query(PipelineDefinitionPage page) throws Exception {
        page.setOrderBy(PipelineDefinition.fieldToColumn(page.getOrderBy()));
        return pipelineDefinitionService.queryByList(page);
    }

    @ApiOperation(value = "根据活动id查找营销流程（包含权益信息）", notes = "根据活动id查找营销流程（包含权益信息）")
    @RequestMapping(value = "/pipelineDefinitions/campaignId/{campaignId}", method = GET)
    @ResponseBody
    public List<PipelineDefinitionDto> queryPipelineDefinitionDto(@PathVariable Integer campaignId, HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        return pipelineDefinitionService.queryPipelineDefinitionDtoByParam(campaignId,tenant.getCaCode());
    }

    /**
     * 根据 营销活动名称 发布者  流程名称  查询营销流程
     * 查找流程列表 campaignId,creator,name
     * 根据 营销活动名称 发布者  流程名称  下线时间 操作者 查询营销流程下线历史
     * 查找下线历史 campaignId,creator,name,updateTime1(offlineStartTime),updateTime2(offlineEndTime),updater
     */
    @RequestMapping(value = "/pipelineDefinitions/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(PipelineDefinitionExtendPage page) throws Exception {
        List<PipelineDefinitionDto> rows = pipelineDefinitionService.queryByPage(page);
        int total = pipelineDefinitionService.countByPage(page);
        return getGridData(total, rows);
    }

    @ApiOperation(value = "根据Pipeline id查询PipelineDefinition(包含权益信息)")
    @RequestMapping(value = "/pipelineDefinitions/{id}", method = GET)
    @ResponseBody
    public PipelineDefinitionDto find(@PathVariable Integer id) throws Exception {
        PipelineDefinitionDto pipelineDefinitionDto = pipelineDefinitionService.queryPipelineDefinitionDtoById(id);
        return pipelineDefinitionDto == null ? new PipelineDefinitionDto() : pipelineDefinitionDto;
    }

    /**
     * @param actionType 0 临时保存  1 提交
     * @param pipelineDefinition
     * @param request
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "保存营销流程", notes = "第一次创建调用，申请上线调用")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "actionType", value = "0:保存草稿,1:申请上线", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "pipelineDefinition", value = "营销流程实体", required = true, dataType = "PipelineDefinition")
    })
    @RequestMapping(value = "/pipelineDefinitions/{actionType}", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public PipelineDefinition create(@PathVariable Integer actionType, @RequestBody PipelineDefinition pipelineDefinition, HttpServletRequest request) throws Exception {
        PipelineDiagram diagramDefinition = null;
        try {
            diagramDefinition = JsonUtil.toObject(pipelineDefinition.getDiagram(),PipelineDiagram.class);
        } catch (Exception e) {
            logger.error("创建PipelineDefinition，PipelineDiagram转换失败:",e);
            throw new PipelineDiagramException("转换失败");
        }
        if (pipelineDefinition.getId() != null) {
            PipelineDefinition pipelineDef = pipelineDefinitionService.selectByPrimaryKey(pipelineDefinition.getId());
            if (pipelineDef != null && PIPELINE_DEFINITION_STATUS_TESTING.equals(pipelineDef.getStatus())) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_CANNOT_UPDATE);
            }
        }
        boolean validateNodeDefinitionId = mktValidator.validateNodeDefinitionId(diagramDefinition.getNodeDefinitionList(), diagramDefinition.getEdgeDefinitionList());
        if (!validateNodeDefinitionId){
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_REPEAT_ID);
        }
        AssignmentUtil.setInfo(pipelineDefinition,request);
        if (!Objects.equals(actionType, PipelineDefinitionConstant.ActionTypeConstant.COMMIT)){
            pipelineDefinition.setStatus(PIPELINE_DEFINITION_STATUS_DRAFT);
        }
        if (null == pipelineDefinition.getId()){
            pipelineDefinition.setCreateTime(new Date());
        }
        pipelineUtil.save(request, pipelineDefinition, actionType);
        return pipelineDefinition;
    }

    @ApiOperation(value = "Pipeline数据提交", notes = "GET方法")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "pipelineId", value = "待提交Pipeline数据的唯一标识", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/pipelineDefinitions/submit/{pipelineId}", method = GET)
    @ResponseBody
    public ResponseEntity submitPipeline(@PathVariable Integer pipelineId) throws Exception {
        pipelineDefinitionService.submit(pipelineId);
        return new ResponseEntity(new PipelineDefinition(), HttpStatus.OK);
    }

    //postman:{"campaignId": 0,"createBy": "string","createTime": "2017-09-04T03:36:58.079Z","creator": "string","description":"string","diagram":"{\"pipelineId\":null,\"campaignId\":null,\"name\":null,\"status\":null,\"version\":null,\"startTime\":null,\"endTime\":null,\"description\":null,\"tenantId\":null,\"creator\":null,\"createBy\":null,\"createTime\":null,\"updater\":null,\"updateBy\":null,\"updateTime\":null,\"pipelineTerminationRuleDefinition\":{\"expression\":\"expression\"},\"pipelineEnterRuleDefinition\":{\"unlimited\":true,\"lessThanDays\":5,\"lessThanTimes\":3},\"pipelineForbiddenRuleDefinition\":{\"expression\":\"expression\"},\"nodeDefinitionList\":[{\"type\":\"end\",\"id\":\"6677\",\"pipelineDefinitionId\":null,\"name\":\"入口\",\"operatorCode\":null,\"x\":50,\"y\":50,\"width\":null,\"height\":null,\"description\":\"description\"}],\"edgeDefinitionList\":[{\"id\":null,\"pipelineDefinitionId\":null,\"name\":\"name\",\"expression\":\"expression\",\"sourceNodeId\":6677,\"targetNodeId\":6677}]}","endTime":"2017-09-04T03:36:58.079Z","id": 0,"name": "string","startTime": "2017-09-04T03:36:58.079Z","status": 0,"tenantId": "string","updateBy": "string","updateTime": "2017-09-04T03:36:58.079Z","updater":"string","version": "string"}
    /**
     * @param actionType:0 临时保存  1 提交
     * @param pipelineDefinition
     * @param request
     * @throws Exception
     */
    @ApiOperation(value = "更新营销流程", notes = "更新营销流程")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "actionType", value = "0:保存草稿,1:申请上线  更新流程只会是0", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "pipelineDefinition", value = "营销流程实体", required = true, dataType = "PipelineDefinition")
    })
    @RequestMapping(value = "/pipelineDefinitions/{actionType}", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@PathVariable Integer actionType,@RequestBody PipelineDefinition pipelineDefinition, HttpServletRequest request) throws Exception {
        logger.debug("actionType:"+actionType+",pipelineDefinition:"+pipelineDefinition.toString());
        List<Integer> allowUpdateStatusList = new ArrayList(Arrays.asList(PIPELINE_DEFINITION_STATUS_DRAFT,PIPELINE_DEFINITION_STATUS_CHECKED,PIPELINE_DEFINITION_STATUS_OFFLINE,PIPELINE_DEFINITION_STATUS_APPLY_FAIL));
        if (!allowUpdateStatusList.contains(pipelineDefinition.getStatus())){
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_CANNOT_UPDATE);
        }
        PipelineDiagram diagramDefinition = null;
        try {
            diagramDefinition = JsonUtil.toObject(pipelineDefinition.getDiagram(),PipelineDiagram.class);
        } catch (Exception e) {
            logger.error("更新PipelineDefinition，PipelineDiagram转换失败:",e);
            throw new PipelineDiagramException("转换失败", e);
        }
        List<EdgeDefinition> edgeDefinitionList = diagramDefinition.getEdgeDefinitionList();
        boolean validateNodeDefinitionId = mktValidator.validateNodeDefinitionId(diagramDefinition.getNodeDefinitionList(), edgeDefinitionList);
        if (!validateNodeDefinitionId){
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_REPEAT_ID);
        }
        AssignmentUtil.setUpdateBasicInfo(pipelineDefinition,request);
        pipelineDefinition.setStatus(PIPELINE_DEFINITION_STATUS_DRAFT);
        pipelineUtil.save(request,pipelineDefinition,actionType);
    }

    @RequestMapping(value = "/pipelineDefinitions/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        PipelineDefinition pipelineDefinition = pipelineDefinitionService.selectByPrimaryKey(id);
        if (pipelineDefinition == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_IS_NOT_EXIST);
        }
        EquityRecordPage equityRecordPage = new EquityRecordPage();
        equityRecordPage.setPipelineDefinitionId(id+"");
        equityRecordPage.setStatus(EquityRecordConstants.EquityRecordStatusConstants.PIPELINE_EQUITY_NOT_USED+"");
        int usedRecordCount = equityRecordService.queryByCount(equityRecordPage);
        boolean allowDel = PIPELINE_DEFINITION_STATUS_DRAFT.equals(pipelineDefinition.getStatus()) || PIPELINE_DEFINITION_STATUS_APPLY_FAIL.equals(pipelineDefinition.getStatus())
            || PIPELINE_DEFINITION_STATUS_CHECKED.equals(pipelineDefinition.getStatus());
        if ((!allowDel) || usedRecordCount>0){
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_CANNOT_DELETE);
        }
        pipelineDefinitionService.delete(id);
        logger.info("delete from TD_MKT_PIPELINE_DEFINITION where id = {}", id);

        PipelineDiagram diagramDefinition = null;
        try {
            diagramDefinition = JsonUtil.toObject(pipelineDefinition.getDiagram(), PipelineDiagram.class);
        } catch (Exception e) {
            logger.error("更新PipelineDefinition，PipelineDiagram转换失败:", e);
            throw new PipelineDiagramException("转换失败", e);
        }
        pipelineDefinitionService.updatePipelineCrowdRel(pipelineDefinition, diagramDefinition, null, true);
    }

    @ApiOperation(value = "营销流程校验", notes = "营销流程校验")
    @RequestMapping(value = "/pipelineDefinitions/check", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ResponseEntity check(HttpServletRequest request, @RequestBody PipelineDefinition pipelineDefinition) throws Exception {
        PipelineDefinition currentPipelineDefinition = pipelineDefinitionService.selectByPrimaryKey(pipelineDefinition.getId());
        if (currentPipelineDefinition == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
        }
        boolean allowCheck = PIPELINE_DEFINITION_STATUS_DRAFT.equals(currentPipelineDefinition.getStatus()) ||
                PIPELINE_DEFINITION_STATUS_OFFLINE.equals(currentPipelineDefinition.getStatus());
        if (!allowCheck){
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_CANNOT_CHECK);
        }
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        validatePipelineNameUnique(pipelineDefinition, tenant);

        mktValidator.validatePipelineTimeFrame(pipelineDefinition.getCampaignId(), pipelineDefinition.getStartTime(),pipelineDefinition.getEndTime());

        List<NodeCheckDto> nodeDefinitionCheckDtoList = pipelineDefinitionService.check(pipelineDefinition);
        return new ResponseEntity(nodeDefinitionCheckDtoList, HttpStatus.OK);
    }

    @ApiOperation(value = "系统管理员同意上线请求  营销流程变成已上线", notes = "系统管理员同意上线请求  营销流程变成已上线")
    @RequestMapping(value = "/pipelineDefinitions/approvePipelineDefinition/{id}", method = PATCH, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ResponseEntity approvePipelineDefinition(@PathVariable Integer id, HttpServletRequest request) throws Exception {
        if (id == null){
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_MISSING_EXAMINE_FIELD);
        }
        PipelineDefinition pipelineDefinition = new PipelineDefinition();
        pipelineDefinition.setId(id);
        AssignmentUtil.setUpdateBasicInfo(pipelineDefinition,request);
        pipelineDefinitionService.approvePipelineDefinition(pipelineDefinition, request);
        return new ResponseEntity(HttpStatus.OK);
    }

    @ApiOperation(value = "系统管理员不同意上线请求  营销流程变成测试通过", notes = "系统管理员不同意上线请求  营销流程变成测试通过")
    @RequestMapping(value = "/pipelineDefinitions/rejectPipelineDefinition/{id}", method = PATCH, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ResponseEntity rejectPipelineDefinition(@PathVariable Integer id, HttpServletRequest request) throws Exception {
        if (id == null){
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_MISSING_EXAMINE_FIELD);
        }
        PipelineDefinition pipelineDefinition = new PipelineDefinition();
        pipelineDefinition.setId(id);
        AssignmentUtil.setUpdateBasicInfo(pipelineDefinition,request);
        pipelineDefinitionService.rejectPipelineDefinition(pipelineDefinition);
        return new ResponseEntity(HttpStatus.OK);
    }

    @ApiOperation(value = "系统管理员将营销流程下线  营销流程变成已下线", notes = "系统管理员将营销流程下线  营销流程变成已下线")
    @RequestMapping(value = "/pipelineDefinitions/offlinePipelineDefinition/{id}", method = PATCH, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ResponseEntity offlinePipelineDefinition(@PathVariable Integer id, HttpServletRequest request) throws Exception {
        if (id == null){
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_MISSING_EXAMINE_FIELD);
        }
        PipelineDefinition pipelineDefinition = pipelineDefinitionService.selectByPrimaryKey(id);
        if (!(pipelineDefinition.getStatus().equals(PIPELINE_DEFINITION_STATUS_APPLY_SUCC)
                || pipelineDefinition.getStatus().equals(PIPELINE_DEFINITION_STATUS_WAITING_ONLINE))){
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_CANNOT_OFFLINE);
        }
        AssignmentUtil.setUpdateBasicInfo(pipelineDefinition,request);
        pipelineDefinitionService.offlinePipelineDefinition(pipelineDefinition,request);
        return new ResponseEntity(HttpStatus.OK);
    }

    /**
     * 营销入口创建人群
     */
    @RequestMapping(value = "/pipelineDefinitions/crowd", method = POST)
    @ResponseBody
    public Crowd createRelatedCrowd(HttpServletRequest request) throws Exception {
        String page = request.getParameter("crowdCreationPage");
        if (StringUtils.isEmpty(page)){
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_PARAM_PAGE_NOT_EXIST);
        }
        String pageDecode = URLDecoder.decode(page, "utf-8");
        logger.info("createRelatedCrowd crowdCreationPage:"+pageDecode);
        CrowdCreationPage crowdCreationPage = null;
        try {
            crowdCreationPage = JsonUtil.toObject(pageDecode, CrowdCreationPage.class);
        } catch (IOException e) {
            logger.error("PipelineDefinition createRelatedCrowd error:",e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_PARAM_PAGE_INVALID);
        }
        Attachment attachment = null;
        if (StringUtils.isNotBlank(crowdCreationPage.getUploadUUID())) {
            attachment = attachmentService.selectByPrimaryKey(Integer.parseInt(crowdCreationPage.getUploadUUID()));
        }

        return pipelineDefinitionService.createRelatedCrowd(crowdCreationPage, request,attachment);
    }

    @ApiOperation(value = "检索全局组件营销权益", notes = "获取当前活动流程所分配到的全部权益")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "pipelineDefId", value = "活动流程主键ID", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/pipelineDefinitions/{pipelineDefId}/global/equity", method = GET)
    @ResponseBody
    public ResponseEntity globalEquity(HttpServletRequest request, @PathVariable Integer pipelineDefId) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        List<PipelineEquityConfigDefinition> result = null;
        try {
            result = pipelineDefinitionService.findCampaignGlobalEquity(pipelineDefId, tenant.getCaCode());
        } catch (Exception e) {
            logger.error("查询活动流程的权益失败：", e);
            throw  exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
        }
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @ApiOperation(value = "检索Pipeline事件", notes = "GET方法获取")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "scope", value = "事件所属", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/pipelineDefinitions/config/event/{scope}", method = GET)
    @ResponseBody
    public ResponseEntity pipelineEvent(HttpServletRequest request, @PathVariable Integer scope) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        List<PipelineConfigDTO> result = null;
        try {
            result = pipelineConfigService.findPipelineEvent(tenant.getCaCode(), scope);
        } catch (Exception e) {
            logger.error("查询Pipeline事件失败：", e);
            throw  exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
        }
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @ApiOperation(value = "检索Pipeline指标", notes = "需要传递参数:活动ID")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "campaignId", value = "活动主键ID", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/pipelineDefinitions/config/{campaignId}/index", method = GET)
    @ResponseBody
    public ResponseEntity pipelineIndex(HttpServletRequest request, @PathVariable Integer campaignId) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        List<PipelineConfigDTO> result = null;
        try {
            result = pipelineConfigService.findPipelineIndex(campaignId, tenant.getCaCode());
        } catch (Exception e) {
            logger.error("查询Pipeline指标失败：", e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
        }
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @ApiOperation(value = "检索Pipeline提前终止规则", notes = "需要传递参数:活动ID和活动流程ID")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "campaignId", value = "活动ID", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "pipelineDefinitionId", value = "活动流程ID", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/pipelineDefinitions/config/{campaignId}/{pipelineDefinitionId}/terminationRule", method = GET)
    @ResponseBody
    public ResponseEntity pipelineTerminationRule(HttpServletRequest request, @PathVariable Integer pipelineDefinitionId,
        @PathVariable Integer campaignId) throws  Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        List<PipelineConfigDTO> result  = null;
        try {
            result = pipelineConfigService.findPipelineTerminationRule(pipelineDefinitionId, campaignId, tenant.getCaCode());
        } catch (Exception e) {
            logger.error("查询Pipeline提前终止规则失败：", e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
        }
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @ApiOperation(value = "检索Pipeline全局禁止规则", notes = "GET方法获取")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "scope", value = "事件所属", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/pipelineDefinitions/config/forbiddenRule/{scope}", method = GET)
    @ResponseBody
    public ResponseEntity pipelineForbiddenRule(HttpServletRequest request, @PathVariable Integer scope) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        List<PipelineConfigDTO> result = null;
        try {
            result = pipelineConfigService.findPipelineForbiddenRule(tenant.getCaCode(), scope);
        } catch (Exception e) {
            logger.error("查询Pipeline全局禁止规则失败：", e);
            throw  exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
        }
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @ApiOperation(value = "检索Pipeline分流组件的维度数据", notes = "GET方法获取，无需参数")
    @RequestMapping(value = "/pipelineDefinitions/config/splitNode/dimension", method = GET)
    @ResponseBody
    public ResponseEntity pipelineSplitNodeDimension(HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        List<PipelineConfigDTO> result = null;
        try {
            result = pipelineConfigService.findPipelineSplitNodeDimension(tenant.getCaCode());
        } catch (Exception e) {
            logger.error("查询Pipeline分流组件的维度数据失败：", e);
            throw  exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
        }
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @ApiOperation(value = "检索Pipeline分流组件的维度的选项数据", notes = "需要传递参数:维度ID")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dimensionId", value = "维度ID", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/pipelineDefinitions/config/splitNode/dimension/{dimensionId}", method = GET)
    @ResponseBody
    public ResponseEntity pipelineSplitNodeDimensionO(HttpServletRequest request, @PathVariable Integer dimensionId) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        List<PipelineConfigDTO> result = null;
        try {
            result = pipelineConfigService.findPipelineSplitNodeDimensionOption(dimensionId);
        } catch (Exception e) {
            logger.error("查询Pipeline分流组件的维度的选项数据失败：", e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
        }
        return new ResponseEntity(result, HttpStatus.OK);
    }

    /**
     * 验证Pipeline名称唯一，若不唯一返回异常信息
     * @param pipelineDefinition Pipeline数据
     * @param tenant 租户信息
     * @return
     * @throws Exception
     */
    private void validatePipelineNameUnique(PipelineDefinition pipelineDefinition, Tenant tenant) throws Exception {
        if (!mktValidator.validatePipelineNameOnlyInCampaign(pipelineDefinition.getId(), pipelineDefinition.getCampaignId(), pipelineDefinition.getName(), tenant.getCaCode())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_NAME_REPEAT);
        }
    }

    /**
     * 事件选择  调用用户管家接口
     */
    @RequestMapping(value = "/pipelineDefinitions/config/behaviorDefinitions/tags", method = GET)
    @ResponseBody
    public ResponseEntity findEvents(HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        List<TagVo> tagVoList = behaviorDefinitionService.findTags(tenant.getCaCode());
        return new ResponseEntity(tagVoList, HttpStatus.OK);
    }

    @ApiOperation(value = "检索Pipeline触发器同时满足的指标", notes = "需要传递参数:活动ID和活动流程ID")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "campaignId", value = "活动ID", required = true, dataType = "int", paramType = "path"),
        @ApiImplicitParam(name = "pipelineDefinitionId", value = "活动流程ID", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/pipelineDefinitions/config/{campaignId}/{pipelineDefinitionId}/triggerNodeIndex", method = GET)
    @ResponseBody
    public ResponseEntity triggerNodeIndex(HttpServletRequest request, @PathVariable Integer pipelineDefinitionId, @PathVariable Integer campaignId) throws  Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        List<PipelineConfigDTO> result  = null;
        try {
            result = pipelineConfigService.findTriggerNodeIndex(pipelineDefinitionId, campaignId, tenant.getCaCode());
        } catch (Exception e) {
            logger.error("检索Pipeline触发器同时满足的指标失败：", e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
        }
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @ApiOperation(value = "短信黑名单上传", notes = "POST请求，无参数")
    @RequestMapping(value = "/pipelineDefinitions/upload/blacklist", method = POST,consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ResponseEntity uploadBlackList(@RequestBody Map paramMap, HttpServletRequest request) throws Exception {
        Attachment attachment = attachmentService.selectByPrimaryKey((Integer)paramMap.get("uploadUUID"));
        File file = new File(attachment.getPath());
        if(!file.exists()){
            throw exceptionBuilder.buildMktException(ExceptionMessage.FILE_NOT_EXIST);
        }
        FileUtil.fileCheck(file, AttachmentConstants.AttachmentFormatConstants.CSV_SUFFIX);
        return new ResponseEntity(attachment.getId(), HttpStatus.OK);
    }

    @ApiOperation(value = "检索Pipeline短信应用中的自定义标签", notes = "GET请求，需要传递参数:活动流程ID")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "pipelineDefinitionId", value = "活动流程ID", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/pipelineDefinitions/config/{pipelineDefinitionId}/shortMessageLabel", method = GET)
    @ResponseBody
    public ResponseEntity pipelineShortMessageLabel(@PathVariable Integer pipelineDefinitionId) throws Exception {
        Set<String> result = null;
        try {
            result = pipelineConfigService.findPipelineShortMessageLabel(pipelineDefinitionId);
        } catch (Exception e) {
            logger.error("检索Pipeline短信应用中的自定义标签失败：", e);
            result = Collections.EMPTY_SET;
        }
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @ApiOperation(value = "检索Pipeline有效权益", notes = "GET请求")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "pipelineDefId", value = "活动流程主键ID", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/pipelineDefinitions/{pipelineDefId}/remain/equity", method = GET)
    @ResponseBody
    public ResponseEntity pipelineRemainEquity(HttpServletRequest request, @PathVariable Integer pipelineDefId) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        List<PipelineConfigDTO> result = null;
        try {
            result = pipelineConfigService.findRemainEquity(pipelineDefId, tenant.getCaCode());
        } catch (Exception e) {
            logger.error("检索Pipeline有效权益失败：", e);
            result = Collections.EMPTY_LIST;
        }
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @ApiOperation(value = "营销流程测试执行", notes = "营销流程测试执行")
    @RequestMapping(value = "/pipelineDefinitions/{pipelineId}/debug", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ResponseEntity debug(@PathVariable Integer pipelineId, @RequestBody PipelineDebugParamDto debugParamDto, HttpServletRequest request) throws Exception {
        PipelineDefinition pipelineDef = pipelineDefinitionService.selectByPrimaryKey(pipelineId);
        if (pipelineDef == null || pipelineDef.getStatus() == null) {
            throw new MktException(ExceptionMessage.RIGHT_TOP.getCode(), "营销流程不存在");
        }
        if (!PIPELINE_DEFINITION_STATUS_CHECKED.equals(pipelineDef.getStatus()) &&
                !PIPELINE_DEFINITION_STATUS_DRAFT.equals(pipelineDef.getStatus())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_CANNOT_CHECK);
        }
        if (!PIPELINE_DEFINITION_STATUS_CHECKED.equals(pipelineDef.getStatus())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_CANNOT_DEBUG);
        }
        pipelineDefinitionService.debugPipeline(pipelineDef, debugParamDto, request);
        return new ResponseEntity<>("ok", HttpStatus.OK);
    }

    @ApiOperation(value = "停止营销流程测试执行", notes = "停止营销流程测试执行")
    @RequestMapping(value = "/pipelineDefinitions/{pipelineId}/debug-stop", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ResponseEntity debugStop(@PathVariable Integer pipelineId) throws Exception {
        PipelineDefinition pipelineDef = pipelineDefinitionService.selectByPrimaryKey(pipelineId);
        if (pipelineDef == null || pipelineDef.getStatus() == null) {
            throw new MktException(ExceptionMessage.RIGHT_TOP.getCode(), "营销流程不存在");
        }
        if (!PIPELINE_DEFINITION_STATUS_TESTING.equals(pipelineDef.getStatus())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_CANNOT_STOP_DEBUG);
        }
        pipelineDefinitionService.debugStopPipeline(pipelineDef);
        return new ResponseEntity<>("ok", HttpStatus.OK);
    }

    @ApiOperation(value="查询禁止规则",notes = "查询禁止规则")
    @RequestMapping(value="/pipelineDefinitions/{pipelineId}/forbidrules/{type}",method = GET)
    @ResponseBody
    public ResponseEntity queryForbidRules(@PathVariable Integer pipelineId,@PathVariable String type) throws Exception{
        if(null == pipelineId || StringUtils.isBlank(type)){
            throw new MktException("参数错误");
        }
        List<AbstractNodeDefinition> nodeList = pipelineDefinitionService.queryForbidRules(pipelineId,type);
        return new ResponseEntity<>(nodeList, HttpStatus.OK);
    }


    @ApiOperation(value = "检索Pipeline过滤器中的过滤标签")
    @RequestMapping(value = "/pipelineDefinitions/config/behaviorDefinitions", method = GET)
    @ResponseBody
    public ResponseEntity pipelineConfigBehaviorDef(HttpServletRequest request) throws Exception {
        BehaviorDefinitionPage page = new BehaviorDefinitionPage();
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        page.setTenantId(tenant.getCaCode());
        page.setPageSize(Integer.MAX_VALUE);
        List<BehaviorDefinitionExtendPage> behaviorDefs = behaviorDefinitionService.queryPageByList(page);
        List<PipelineConfigDTO> result = new ArrayList<>();
        for (BehaviorDefinitionExtendPage behaviorDef : behaviorDefs) {
            PipelineConfigDTO config = new PipelineConfigDTO();
            config.setCode(behaviorDef.getRowkey());
            config.setName(behaviorDef.getName());
            result.add(config);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
