package com.talkingdata.marketing.web.controller.admin;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.annotation.EnableAssignmentTime;
import com.talkingdata.marketing.core.constant.SessionConstants;
import com.talkingdata.marketing.core.entity.admin.CampaignTargetDefinition;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.admin.CampaignTargetDefinitionPage;
import com.talkingdata.marketing.core.page.campaign.extend.CampaignTargetDefinitionExtendPage;
import com.talkingdata.marketing.core.service.admin.CampaignTargetDefinitionService;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.web.constraint.MktValidator;
import com.tendcloud.enterprise.um.umic.entity.Tenant;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/admin")
public class CampaignTargetDefinitionController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(CampaignTargetDefinitionController.class);

    @Autowired
    private CampaignTargetDefinitionService campaignTargetDefinitionService;

    @Autowired
    private ExceptionBuilder exceptionBuilder;
    @Autowired
    private MktValidator mktValidator;

    @RequestMapping(value = "/campaignTargetDefinitions", method = GET)
    @ResponseBody
    public List<CampaignTargetDefinitionExtendPage> query(CampaignTargetDefinitionPage page, HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        page.setTenantId(tenant.getCaCode());
        page.setOrderBy(CampaignTargetDefinition.fieldToColumn(page.getOrderBy()));
        page.getPager().setPageEnabled(false);
        return campaignTargetDefinitionService.queryPageByList(page);
    }

    @RequestMapping(value = "/campaignTargetDefinitions/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(CampaignTargetDefinitionPage page, HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        page.setTenantId(tenant.getCaCode());
        page.setOrderBy(CampaignTargetDefinition.fieldToColumn(page.getOrderBy()));
        List<CampaignTargetDefinitionExtendPage> rows = campaignTargetDefinitionService.queryPageByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/campaignTargetDefinitions/{id}", method = GET)
    @ResponseBody
    public CampaignTargetDefinitionExtendPage find(@PathVariable Integer id) throws Exception {
        return campaignTargetDefinitionService.getByKey(id);
    }

    @EnableAssignmentTime
    @RequestMapping(value = "/campaignTargetDefinitions", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public CampaignTargetDefinition create(@RequestBody CampaignTargetDefinitionExtendPage campaignTargetDefinitionExtendPage, HttpServletRequest request) throws Exception {
        AssignmentUtil.setInfo(campaignTargetDefinitionExtendPage, request);
        campaignTargetDefinitionExtendPage.setCreateTime(new Date());
        if (!mktValidator.validateUnique(campaignTargetDefinitionExtendPage)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.TARGET_DEFINITION_NAME_DUP);
        }
        CampaignTargetDefinition campaignTargetDefinition = campaignTargetDefinitionService.save(campaignTargetDefinitionExtendPage);
        return campaignTargetDefinition;
    }

    @RequestMapping(value = "/campaignTargetDefinitions", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody CampaignTargetDefinitionExtendPage campaignTargetDefinitionExtendPage, HttpServletRequest request) throws Exception {
        AssignmentUtil.setUpdateBasicInfo(campaignTargetDefinitionExtendPage, request);
        if (!mktValidator.validateUnique(campaignTargetDefinitionExtendPage)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.TARGET_DEFINITION_NAME_DUP);
        }
        campaignTargetDefinitionService.update(campaignTargetDefinitionExtendPage);
    }

    @RequestMapping(value = "/campaignTargetDefinitions/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        campaignTargetDefinitionService.delete(id);
        logger.info("delete from TD_MKT_CAMPAIGN_TARGET_DEFINITION where id = {}", id);
    }

    @RequestMapping(value = "/campaignTargetDefinitions/show/new", method = GET)
    @ResponseBody
    public List<CampaignTargetDefinition> findNewDefinitions(HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        return campaignTargetDefinitionService.findNewDefinitions(tenant.getCaCode());
    }

    @RequestMapping(value = "/campaignTargetDefinitions/{campaignId}/unown", method = GET)
    @ResponseBody
    public List<CampaignTargetDefinition> queryUnownDefinitions(HttpServletRequest request, @PathVariable Integer campaignId) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        try {
            return campaignTargetDefinitionService.queryUnownDefinitions(campaignId, tenant.getCaCode());
        } catch (Exception e) {
            logger.error("查询当前活动未配置目标发生异常：{}", e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.TARGET_DEFINITION);
        }
    }
    @ApiOperation(value = "检查目标状态", notes = "需要对目标定义进行改变操作前调用此接口")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "目标定义ID", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/campaignTargetDefinitions/status/{id}", method = GET)
    @ResponseBody
    public Boolean checkStatus(HttpServletRequest request, @PathVariable Integer id) throws Exception {
        if (null == id) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
        }
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        try {
            return campaignTargetDefinitionService.changeAble(tenant.getCaCode(), id);
        } catch (Exception e) {
            logger.error("检查目标状态发生异常发生异常：{}", e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
        }
    }

}
