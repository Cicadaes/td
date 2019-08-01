package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.annotation.EnableAssignmentTime;
import com.talkingdata.marketing.core.entity.campaign.CampaignFunnelConfig;
import com.talkingdata.marketing.core.entity.dto.*;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.campaign.CampaignFunnelConfigPage;
import com.talkingdata.marketing.core.service.campaign.CampaignFunnelConfigService;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class CampaignFunnelConfigController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(CampaignFunnelConfigController.class);

    @Autowired
    private CampaignFunnelConfigService campaignFunnelConfigService;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    @RequestMapping(value = "/campaignFunnelConfigs", method = GET)
    @ResponseBody
    public List<CampaignFunnelConfig> query(CampaignFunnelConfigPage page) throws Exception {
        page.setOrderBy(CampaignFunnelConfig.fieldToColumn(page.getOrderBy()));
        return campaignFunnelConfigService.queryByList(page);
    }

    @RequestMapping(value = "/campaignFunnelConfigs/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(CampaignFunnelConfigPage page) throws Exception {
        page.setOrderBy(CampaignFunnelConfig.fieldToColumn(page.getOrderBy()));
        List<CampaignFunnelConfig> rows = campaignFunnelConfigService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/campaignFunnelConfigs/{id}", method = GET)
    @ResponseBody
    public CampaignFunnelConfig find(@PathVariable Integer id) throws Exception {
        return campaignFunnelConfigService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/campaignFunnelConfigs", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    @EnableAssignmentTime
    public CampaignFunnelConfig create(@RequestBody CampaignFunnelConfig campaignFunnelConfig, HttpServletRequest request) throws Exception {
        campaignFunnelConfig = AssignmentUtil.setInfo(campaignFunnelConfig,request);
        campaignFunnelConfigService.insert(campaignFunnelConfig);
        return campaignFunnelConfig;
    }

    @RequestMapping(value = "/campaignFunnelConfigs", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody CampaignFunnelConfig campaignFunnelConfig) throws Exception {
        campaignFunnelConfigService.updateByPrimaryKeySelective(campaignFunnelConfig);
    }

    @RequestMapping(value = "/campaignFunnelConfigs/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        campaignFunnelConfigService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_CAMPAIGN_FUNNEL_CONFIG where id = {}", id);
    }

    @ApiOperation(value = "设置默认漏斗接口", notes = "传递原默认数据的ID和需设置默认数据的ID值", response = String.class)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "sId", value = "原默认数据的ID值，没有传零即可", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "dId", value = "需设置默认数据的ID值", required = true, dataType = "int", paramType = "path")
    })
    @RequestMapping(value = "/campaignFunnelConfigs/{sId}/{dId}", method = PUT)
    @ResponseBody
    public String setDefaultFlag(@PathVariable("sId") Integer sId, @PathVariable("dId") Integer dId) throws Exception {
        return campaignFunnelConfigService.setDefaultFlag(sId, dId);
    }

    @ApiOperation(value = "显示转换概览", notes = "根据漏斗和人群获取转换数据", response = List.class)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "crowdIds", value = "人群ID，最多传2", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "funnelId", value = "漏斗ID", required = true, dataType = "int", paramType = "query")
    })
    @RequestMapping(value = "/campaignFunnelConfigs/funnelConvertOverview", method = GET)
    @ResponseBody
    public List<FunnelConvertOverview> showFunnelConvertOverview(@RequestParam List<Integer> crowdIds,
                                              @RequestParam Integer funnelId) throws Exception {
        return campaignFunnelConfigService.getFunnelConvertOverview(crowdIds, funnelId);
    }

    /**
     * curl "http://localhost:1111/campaign/campaignFunnelConfigs/funnel/trend?crowdIds=1&eventIds=finance_event1,finance_event6&granularity=1"
     */
    @RequestMapping(value = "/campaignFunnelConfigs/funnel/trend", method = RequestMethod.GET)
    @ResponseBody
    public List<FunnelTrendDto> getTrendChart(@RequestParam Integer campaignId, @RequestParam List<Integer> crowdIds, @RequestParam List<String> eventIds, @RequestParam String granularity) throws Exception {
        int eventIdsLength = 2;
        if (eventIds.size() != eventIdsLength) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FUNNEL_EVENTS_LENGTH);
        }
        return campaignFunnelConfigService.getEventConvertTrend(campaignId, crowdIds, eventIds, granularity);
    }

    @RequestMapping(value = "/campaignFunnelConfigs/funnel/event/{eventId}/trend", method = RequestMethod.GET)
    @ResponseBody
    public List<EventDateDetailDto> getEventTrend(@RequestParam Integer campaignId, @PathVariable String eventId, @RequestParam List<Integer> crowdIds, @RequestParam String granularity) throws Exception{
        return campaignFunnelConfigService.getEventFinishTrend(campaignId, crowdIds, eventId, granularity);
    }

    @RequestMapping(value = "/campaignFunnelConfigs/funnel/{funnelId}/detail", method = RequestMethod.GET)
    @ResponseBody
    public FunnelDetailPage showFunnelDetail(@RequestParam List<Integer> crowdIds,
                                             @PathVariable Integer funnelId,
                                             @RequestParam Integer page,
                                             @RequestParam Integer pageSize) throws Exception{
        if (page < 1) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FUNNEL_START_PAGE_INVALID);
        }
        int offset = (page - 1) * pageSize;
        return campaignFunnelConfigService.buildFunnelDetail(crowdIds, funnelId, offset, pageSize);
    }

    @RequestMapping(value = "/campaignFunnelConfigs/funnel/{funnelId}/detail/download", method = RequestMethod.GET)
    @ResponseBody
    public void downloadFunnelDetail(HttpServletResponse res, @RequestParam List<Integer> crowdIds,
                                                   @PathVariable Integer funnelId,
                                                   @RequestParam String campaignName) throws Exception{
        InputStream is = campaignFunnelConfigService.downloadFunnelDetail(crowdIds, funnelId);
        String fileName = campaignName+"详情表.xls";
        download(res, is, fileName);
    }

}
