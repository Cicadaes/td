package com.talkingdata.marketing.web.controller.campaign;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.campaign.PipelineInstance;
import com.talkingdata.marketing.core.page.campaign.PipelineInstancePage;
import com.talkingdata.marketing.core.service.campaign.PipelineInstanceService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class PipelineInstanceController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(PipelineInstanceController.class);

    @Autowired
    private PipelineInstanceService pipelineInstanceService;

    @RequestMapping(value = "/pipelineInstances", method = GET)
    @ResponseBody
    public List<PipelineInstance> query(PipelineInstancePage page) throws Exception {
        page.setOrderBy(PipelineInstance.fieldToColumn(page.getOrderBy()));
        return pipelineInstanceService.queryByList(page);
    }

    @RequestMapping(value = "/pipelineInstances/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(PipelineInstancePage page) throws Exception {
        page.setOrderBy(PipelineInstance.fieldToColumn(page.getOrderBy()));
        List<PipelineInstance> rows = pipelineInstanceService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/pipelineInstances", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public PipelineInstance create(@RequestBody PipelineInstance pipelineInstance) throws Exception {
        pipelineInstanceService.insert(pipelineInstance);
        return pipelineInstance;
    }

}
