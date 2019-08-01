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
import com.talkingdata.marketing.core.entity.campaign.PipelineStage;
import com.talkingdata.marketing.core.page.campaign.PipelineStagePage;
import com.talkingdata.marketing.core.service.campaign.PipelineStageService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class PipelineStageController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(PipelineStageController.class);

    @Autowired
    private PipelineStageService pipelineStageService;

    @RequestMapping(value = "/pipelineStages", method = GET)
    @ResponseBody
    public List<PipelineStage> query(PipelineStagePage page) throws Exception {
        page.setOrderBy(PipelineStage.fieldToColumn(page.getOrderBy()));
        return pipelineStageService.queryByList(page);
    }

    @RequestMapping(value = "/pipelineStages/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(PipelineStagePage page) throws Exception {
        page.setOrderBy(PipelineStage.fieldToColumn(page.getOrderBy()));
        List<PipelineStage> rows = pipelineStageService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/pipelineStages/{id}", method = GET)
    @ResponseBody
    public PipelineStage find(@PathVariable Integer id) throws Exception {
        return pipelineStageService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/pipelineStages", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public PipelineStage create(@RequestBody PipelineStage pipelineStage) throws Exception {
        pipelineStageService.insert(pipelineStage);
        return pipelineStage;
    }

    @RequestMapping(value = "/pipelineStages", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody PipelineStage pipelineStage) throws Exception {
        pipelineStageService.updateByPrimaryKeySelective(pipelineStage);
    }

    @RequestMapping(value = "/pipelineStages/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        pipelineStageService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_PIPELINE_STAGE where id = {}", id);
    }

}
