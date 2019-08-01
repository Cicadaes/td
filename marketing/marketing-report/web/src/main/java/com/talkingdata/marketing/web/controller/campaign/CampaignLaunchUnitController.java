package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.constant.CommonConstants;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.entity.campaign.CampaignLaunchUnit;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.page.campaign.CampaignLaunchUnitPage;
import com.talkingdata.marketing.core.page.campaign.extend.CrowdCreationPage;
import com.talkingdata.marketing.core.page.dto.CampaignLaunchUnitDto;
import com.talkingdata.marketing.core.service.campaign.AttachmentService;
import com.talkingdata.marketing.core.service.campaign.CampaignLaunchUnitService;
import com.talkingdata.marketing.core.util.JsonUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
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
@Controller @RequestMapping("/campaign") public class CampaignLaunchUnitController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(CampaignLaunchUnitController.class);

    @Autowired private CampaignLaunchUnitService campaignLaunchUnitService;

    @Autowired private ExceptionBuilder exceptionBuilder;
    @Autowired private AttachmentService attachmentService;

    @RequestMapping(value = "/campaignLaunchUnits", method = GET) @ResponseBody public List<CampaignLaunchUnit> query(CampaignLaunchUnitPage page)
        throws Exception {
        page.setOrderBy(CampaignLaunchUnit.fieldToColumn(page.getOrderBy()));
        return campaignLaunchUnitService.queryByList(page);
    }

    @RequestMapping(value = "/campaignLaunchUnits/rows", method = GET) @ResponseBody public Map<String, Object> queryRows(CampaignLaunchUnitPage page)
        throws Exception {
        page.setOrderBy(CampaignLaunchUnit.fieldToColumn(page.getOrderBy()));
        page.setStatus(String.valueOf(CommonConstants.SampleStatusConstants.NORMAL));
        List<CampaignLaunchUnit> rows = campaignLaunchUnitService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/campaignLaunchUnits/{id}", method = GET) @ResponseBody public CampaignLaunchUnit find(@PathVariable Integer id)
        throws Exception {
        return campaignLaunchUnitService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/campaignLaunchUnits", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE) @ResponseBody
    public CampaignLaunchUnit create(@RequestBody CampaignLaunchUnit campaignLaunchUnit) throws Exception {
        campaignLaunchUnitService.insert(campaignLaunchUnit);
        return campaignLaunchUnit;
    }

    @RequestMapping(value = "/campaignLaunchUnits", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE) @ResponseBody
    public void update(@RequestBody CampaignLaunchUnit campaignLaunchUnit) throws Exception {
        campaignLaunchUnitService.updateByPrimaryKeySelective(campaignLaunchUnit);
    }

    @RequestMapping(value = "/campaignLaunchUnits/{id}", method = DELETE) @ResponseBody public void delete(@PathVariable Integer id)
        throws Exception {
        campaignLaunchUnitService.deleteWithUpdateCrowdStatus(id);
        logger.info("delete from TD_MKT_CAMPAIGN_LAUNCH_UNIT where id = {}", id);
    }

    @RequestMapping(value = "/campaignLaunchUnits/ext", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE) @ResponseBody
    public CampaignLaunchUnit createRelatedCrowd(@RequestBody CrowdCreationPage crowdCreationPage, HttpServletRequest request) throws Exception {
        logger.info("createRelatedCrowd开始.参数crowdCreationPage={}", JsonUtil.toJson(crowdCreationPage));
        Attachment attachment = null;
        if(StringUtils.isNotBlank(crowdCreationPage.getUploadUUID())){
             attachment = attachmentService.selectByPrimaryKey(Integer.parseInt(crowdCreationPage.getUploadUUID()));
        }
        CampaignLaunchUnit unit = campaignLaunchUnitService.createRelatedCrowd(crowdCreationPage, request, attachment);
        return unit;
    }

    @RequestMapping(value = "/campaignLaunchUnits/campaign/{campaignId}", method = GET) @ResponseBody
    public List<CampaignLaunchUnitDto> querySegments(@PathVariable Integer campaignId) throws Exception {
        List<CampaignLaunchUnitDto> pageList = campaignLaunchUnitService.findByCampaignId(campaignId);
        return pageList;
    }

    @RequestMapping(value = "/campaignLaunchUnits/{id}/recount", method = RequestMethod.PATCH) @ResponseBody
    public ResponseEntity reCount(@PathVariable Integer id) throws Exception {//TODO 重新计算 compute
        return campaignLaunchUnitService.recount(id);
    }

    @RequestMapping(value = "/campaignLaunchUnits/{id}/crowds", method = GET) @ResponseBody
    public CampaignLaunchUnitDto getUnitCrowds(@PathVariable Integer id) throws Exception {
        return campaignLaunchUnitService.getUnitCrowds(id);
    }

}
