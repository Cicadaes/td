package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.page.Pager;
import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.annotation.AuditLogSave;
import com.talkingdata.marketing.core.annotation.EnableAssignmentTime;
import com.talkingdata.marketing.core.constant.CampaignConstant;
import com.talkingdata.marketing.core.constant.SessionConstants;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.entity.dto.CampaignStatDto;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.campaign.CampaignPage;
import com.talkingdata.marketing.core.page.campaign.extend.CampaignExtendPage;
import com.talkingdata.marketing.core.service.campaign.CampaignService;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.core.util.ExcelUtil;
import com.talkingdata.marketing.web.constraint.MktValidator;
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
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.util.Date;
import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class CampaignController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(CampaignController.class);
    @Autowired
    private CampaignService campaignService;
    @Autowired
    private MktValidator mktValidator;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    @RequestMapping(value = "/campaigns", method = GET)
    @ResponseBody
    public ResponseEntity query(CampaignPage page) throws Exception {
        page.setOrderBy(Campaign.fieldToColumn(page.getOrderBy()));
        return new ResponseEntity(campaignService.queryByList(page), HttpStatus.OK);
    }

    /**
     * curl -X GET --header 'Accept: application/json' 'http://localhost:1111/campaign/campaigns/rows?page=1&pageSize=2&name=f&startTimeLong=1477516586313&endTimeLong=1493474280000&status=2'
     * curl -X GET --header 'Accept: application/json' 'http://localhost:1111/marketing-api/campaign/campaigns/rows?orderBy=startTime&order=asc&startTimeLong=1487008124999&endTimeLong=1518544124999'
     * curl -X GET --header 'Accept: application/json' 'http://localhost:1111/marketing-api/campaign/campaigns/rows?order=asc&startTimeLong=1487008124999&endTimeLong=1518544124999'
     */
    @RequestMapping(value = "/campaigns/rows", method = GET)
    @ResponseBody
    public ResponseEntity queryRows(CampaignPage page, HttpServletRequest request) throws Exception {
        long startTime = System.currentTimeMillis();
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        CampaignPage.fillDate(page);
        page.setOrderBy(Campaign.fieldToColumn(page.getOrderBy()));
        page.setTenantId(tenant.getCaCode());
        List<CampaignExtendPage> list = campaignService.getCampaignExtendPages(page);
        ResponseEntity returnResponse = new ResponseEntity(getGridData(campaignService.countByParam(page), list), HttpStatus.OK);
        logger.info("营销活动查询列表耗时:{}", ((System.currentTimeMillis() - startTime) / 1000));
        return returnResponse;
    }

    @RequestMapping(value = "/campaigns/download", method = GET)
    @ResponseBody
    public void download(HttpServletResponse response, CampaignPage page) throws Exception {
        CampaignPage.fillDate(page);
        page.setOrderBy(Campaign.fieldToColumn(page.getOrderBy()));
        Pager pager = page.getPager();
        pager.setPageEnabled(false);
        page.setPager(pager);
        List<CampaignExtendPage> list = campaignService.getCampaignExtendPages(page);
        String[] format = new String[]{
                "活动名称,name", "活动时间,dateRange", "活动状态,statusStr",
                "创建人,creator", "描述,description"};
        InputStream inputStream = ExcelUtil.buildWorkbook("营销活动列表", format, list);
        String fileName = "活动列表_" + DateUtil.getSpecificDateFormat() + ".xls";
        CampaignController.download(response, inputStream, fileName);
    }

    @RequestMapping(value = "/campaigns/{id}", method = GET)
    @ResponseBody
    public ResponseEntity find(@PathVariable Integer id) throws Exception {
        return new ResponseEntity(campaignService.getCampaignByPrimaryKey(id), HttpStatus.OK);
    }

    @RequestMapping(value = "/campaigns", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    @EnableAssignmentTime
    @AuditLogSave(opType = AuditLogSave.OpType.create,targetType = AuditLogSave.TargetType.campaign)
    public ResponseEntity create(@RequestBody Campaign campaign, HttpServletRequest request) throws Exception {
        campaign = AssignmentUtil.setInfo(campaign,request);
        campaign.setUpdateTime(new Date());
        if (campaign.getName().length() > CampaignConstant.CAMPAIGN_NAME_MAX_LENGTH){
            throw exceptionBuilder.buildMktException(ExceptionMessage.CAMPAIGN_NAME_TOO_LONG);
        }
        if ((!StringUtils.isEmpty(campaign.getDescription())) && campaign.getDescription().length() > CampaignConstant.CAMPAIGN_DESCRIPTION_MAX_LENGTH){
            throw exceptionBuilder.buildMktException(ExceptionMessage.CAMPAIGN_DESCRIPTION_TOO_LONG);
        }
        if (!mktValidator.validateUnique(campaign)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CAMPAIGN_NAME_DUP);
        }
        campaignService.insert(campaign);
        return new ResponseEntity(campaign, HttpStatus.OK);
    }

    @RequestMapping(value = "/campaigns", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    @AuditLogSave(opType = AuditLogSave.OpType.update,targetType = AuditLogSave.TargetType.campaign,targetId = "#campaign.id")
    public void update(@RequestBody Campaign campaign, HttpServletRequest request) throws Exception {
        AssignmentUtil.setUpdateBasicInfo(campaign, request);
        if (campaign.getName() != null) {
            if (!mktValidator.validateUnique(campaign)) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.CAMPAIGN_NAME_DUP);
            }
        }
        if (campaign.getStartTime() != null && campaign.getEndTime() != null ) {
            mktValidator.validateCampaignTimeFrame(campaign.getId(), campaign.getStartTime(), campaign.getEndTime());
        }
        campaignService.updateByPrimaryKeySelective(campaign);
    }

    @RequestMapping(value = "/campaigns/{id}", method = DELETE)
    @ResponseBody
    @AuditLogSave(opType = AuditLogSave.OpType.delete,targetType = AuditLogSave.TargetType.campaign,targetId = "#id")
    public void delete(@PathVariable Integer id) throws Exception {
        campaignService.delete(id);
        logger.info("delete from TD_MKT_CAMPAIGN where id = {}", id);
    }

    @RequestMapping(value = "/campaigns/stat", method = GET)
    @ResponseBody
    public ResponseEntity stat(HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        CampaignStatDto campaignStatDto = campaignService.stat(tenant.getCaCode());
        return new ResponseEntity(campaignStatDto, HttpStatus.OK);
    }

    @ApiOperation(value = "活动克隆", notes = "活动克隆（暂时只克隆活动的基本信息和目标）")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "campaign", value = "营销活动（只需要包含：活动名称，活动时间，描述）", required = true, dataType = "Campaign", paramType = "query"),
            @ApiImplicitParam(name = "id", value = "被克隆的活动id", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/campaign/clone/{id}", method = POST)
    @AuditLogSave(opType = AuditLogSave.OpType.create,targetType = AuditLogSave.TargetType.campaign)
    public ResponseEntity copy(@PathVariable Integer id,@RequestBody Campaign campaign, HttpServletRequest request) throws Exception {
        if (!mktValidator.validateUnique(campaign)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CAMPAIGN_NAME_DUP);
        }
        Campaign campaignNew = campaignService.copy(id,campaign,request);
        return new ResponseEntity(campaignNew,HttpStatus.OK);
    }
}
