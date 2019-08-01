package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.service.campaign.EquityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class EquityReloadController extends BaseController {
    private static final Logger logger = LoggerFactory.getLogger(EquityRecordController.class);

    @Autowired
    private EquityService equityService;

    @RequestMapping(value = "{campaignId}/pipelineDefinitionId/{pipelineDefinitionId}/equityCode/{equityCode}/reload", method = GET)
    @ResponseBody
    public Integer reload(@PathVariable Integer campaignId,
                         @PathVariable Integer pipelineDefinitionId,
                         @PathVariable String equityCode) throws Exception {
        return equityService.reload(campaignId, pipelineDefinitionId, equityCode);
    }
}
