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
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.campaign.PipelineSegmentGroupRel;
import com.talkingdata.marketing.core.page.campaign.PipelineSegmentGroupRelPage;
import com.talkingdata.marketing.core.service.campaign.PipelineSegmentGroupRelService;

@Controller
@RequestMapping("/campaign")
public class PipelineSegmentGroupRelController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(PipelineSegmentGroupRelController.class);

    @Autowired
    private PipelineSegmentGroupRelService pipelineSegmentGroupRelService;

    @RequestMapping(value = "/pipelineSegmentGroupRels", method = GET)
    @ResponseBody
    public List<PipelineSegmentGroupRel> query(PipelineSegmentGroupRelPage page) throws Exception {
        page.setOrderBy(PipelineSegmentGroupRel.fieldToColumn(page.getOrderBy()));
        return pipelineSegmentGroupRelService.queryByList(page);
    }

    @RequestMapping(value = "/pipelineSegmentGroupRels/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(PipelineSegmentGroupRelPage page) throws Exception {
        page.setOrderBy(PipelineSegmentGroupRel.fieldToColumn(page.getOrderBy()));
        List<PipelineSegmentGroupRel> rows = pipelineSegmentGroupRelService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/pipelineSegmentGroupRels/{id}", method = GET)
    @ResponseBody
    public PipelineSegmentGroupRel find(@PathVariable Integer id) throws Exception {
        return pipelineSegmentGroupRelService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/pipelineSegmentGroupRels", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public PipelineSegmentGroupRel create(@RequestBody PipelineSegmentGroupRel pipelineSegmentGroupRel) throws Exception {
        pipelineSegmentGroupRelService.insert(pipelineSegmentGroupRel);
        return pipelineSegmentGroupRel;
    }

    @RequestMapping(value = "/pipelineSegmentGroupRels", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody PipelineSegmentGroupRel pipelineSegmentGroupRel) throws Exception {
        pipelineSegmentGroupRelService.updateByPrimaryKeySelective(pipelineSegmentGroupRel);
    }

    @RequestMapping(value = "/pipelineSegmentGroupRels/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        pipelineSegmentGroupRelService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_PIPELINE_SEGMENT_GROUP_REL where id = {}", id);
    }

    @RequestMapping(value = "/pipelineSegmentGroupRels/{pipelineId}/{groupName}",
            method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void createGroupRelByPipelineAndGroupName(@PathVariable Integer pipelineId,
            @PathVariable String groupName) throws Exception {
        pipelineSegmentGroupRelService.createGroupRelByPipelineAndGroupName(pipelineId, groupName);
        logger.info("create from TD_MKT_PIPELINE_SEGMENT_GROUP_REL where pipelineId = {}, groupName = {}",
                pipelineId, groupName);
    }
}
