package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.annotation.EnableAssignmentTime;
import com.talkingdata.marketing.core.entity.campaign.CampaignTargetConfig;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.campaign.CampaignTargetConfigPage;
import com.talkingdata.marketing.core.service.campaign.CampaignTargetConfigService;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.web.constraint.MktValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class CampaignTargetConfigController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(CampaignTargetConfigController.class);

    @Autowired
    private CampaignTargetConfigService campaignTargetConfigService;
    @Autowired
    private MktValidator mktValidator;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    @RequestMapping(value = "/campaignTargetConfigs", method = GET)
    @ResponseBody
    public List<CampaignTargetConfig> query(CampaignTargetConfigPage page) throws Exception {
        page.setOrderBy(CampaignTargetConfig.fieldToColumn(page.getOrderBy()));
        return campaignTargetConfigService.queryByList(page);
    }

    @RequestMapping(value = "/campaignTargetConfigs/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(CampaignTargetConfigPage page) throws Exception {
        page.setOrderBy(CampaignTargetConfig.fieldToColumn(page.getOrderBy()));
        List<CampaignTargetConfig> rows = campaignTargetConfigService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/campaignTargetConfigs/{id}", method = GET)
    @ResponseBody
    public CampaignTargetConfig find(@PathVariable Integer id) throws Exception {
        CampaignTargetConfig campaignTargetConfig = campaignTargetConfigService.selectByPrimaryKey(id);
        return campaignTargetConfig == null ? new CampaignTargetConfig() : campaignTargetConfig;
    }

    @EnableAssignmentTime
    @RequestMapping(value = "/campaignTargetConfigs", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public CampaignTargetConfig create(@RequestBody CampaignTargetConfig campaignTargetConfig, HttpServletRequest request) throws Exception {
        if(!validateUnique(campaignTargetConfig)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.TARGET_CONFIG_DUP);
        }
        campaignTargetConfig = AssignmentUtil.setInfo(campaignTargetConfig,request);
        campaignTargetConfigService.insert(campaignTargetConfig);
        return campaignTargetConfig;
    }

    @RequestMapping(value = "/campaignTargetConfigs", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody CampaignTargetConfig campaignTargetConfig, HttpServletRequest request) throws Exception {
        if(!validateUnique(campaignTargetConfig)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.TARGET_CONFIG_DUP);
        }
        AssignmentUtil.setUpdateBasicInfo(campaignTargetConfig,request);
        campaignTargetConfigService.updateByPrimaryKeySelective(campaignTargetConfig);
    }

    @RequestMapping(value = "/campaignTargetConfigs/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        campaignTargetConfigService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_CAMPAIGN_TARGET_CONFIG where id = {}", id);
    }

    @RequestMapping(value = "/campaignTargetConfigs/campaignId/{campaignId}", method = GET)
    @ResponseBody
    public List<CampaignTargetConfig> findByCampaignId(@PathVariable Integer campaignId) throws Exception {
        return campaignTargetConfigService.findByCampaignId(campaignId);
    }
    @EnableAssignmentTime
    @RequestMapping(value = "/campaignTargetConfigs/save", method = POST)
    @ResponseBody
    public CampaignTargetConfig insertOrUpdate(@RequestBody CampaignTargetConfig campaignTargetConfig) throws Exception {
        campaignTargetConfigService.insertOrUpdateCampaignTargetConfig(campaignTargetConfig);
        return campaignTargetConfig;
    }

    @RequestMapping(value = "/campaignTargetConfigs/delete", method = RequestMethod.DELETE)
    @ResponseBody
    public String deleteTarget(@RequestParam Integer campaignId, @RequestParam Integer targetDefinitionId, @RequestParam Integer metricType) throws  Exception {
        campaignTargetConfigService.deleteByUniqueIndex(campaignId, targetDefinitionId, metricType);
        return "success";
    }

    private boolean validateUnique(CampaignTargetConfig campaignTargetConfig) {
        return mktValidator.validateUnique(campaignTargetConfig);
    }

}
