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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.campaign.PipelineSegmentGroup;
import com.talkingdata.marketing.core.page.campaign.PipelineSegmentGroupPage;
import com.talkingdata.marketing.core.service.campaign.PipelineSegmentGroupService;
import com.talkingdata.marketing.core.service.campaign.PipelineSegmentGroupRelService;

@Controller
@RequestMapping("/campaign")
public class PipelineSegmentGroupController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(PipelineSegmentGroupController.class);

    @Autowired
    private PipelineSegmentGroupService pipelineSegmentGroupService;

    @Autowired
    private PipelineSegmentGroupRelService pipelineSegmentGroupRelService;

    @RequestMapping(value = "/pipelineSegmentGroups", method = GET)
    @ResponseBody
    public List<PipelineSegmentGroup> query(PipelineSegmentGroupPage page) throws Exception {
        page.setOrderBy(PipelineSegmentGroup.fieldToColumn(page.getOrderBy()));
        return pipelineSegmentGroupService.queryByList(page);
    }

    @RequestMapping(value = "/pipelineSegmentGroups/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(PipelineSegmentGroupPage page) throws Exception {
        page.setOrderBy(PipelineSegmentGroup.fieldToColumn(page.getOrderBy()));
        List<PipelineSegmentGroup> rows = pipelineSegmentGroupService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/pipelineSegmentGroups/{id}", method = GET)
    @ResponseBody
    public PipelineSegmentGroup find(@PathVariable Integer id) throws Exception {
        return pipelineSegmentGroupService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/pipelineSegmentGroups", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public PipelineSegmentGroup create(@RequestBody PipelineSegmentGroup pipelineSegmentGroup) throws Exception {
        pipelineSegmentGroupService.insert(pipelineSegmentGroup);
        return pipelineSegmentGroup;
    }

    @RequestMapping(value = "/pipelineSegmentGroups", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody PipelineSegmentGroup pipelineSegmentGroup) throws Exception {
        pipelineSegmentGroupService.updateByPrimaryKeySelective(pipelineSegmentGroup);
    }

    @RequestMapping(value = "/pipelineSegmentGroups/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        pipelineSegmentGroupService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_PIPELINE_SEGMENT_GROUP where id = {}", id);
    }

    @RequestMapping(value = "/pipelineSegmentGroups/delete/{groupName}", method = DELETE)
    @ResponseBody
    public ResponseEntity deleteGroupByGroupName(@PathVariable String groupName) throws Exception {
        if (pipelineSegmentGroupRelService.findGroupRelsByGroupName(groupName).isEmpty()) {
            pipelineSegmentGroupService.deleteGroupByGroupName(groupName);
            logger.info("delete from TD_MKT_PIPELINE_SEGMENT_GROUP where id = {}", groupName);
            return new ResponseEntity(HttpStatus.OK);
        } else {
            logger.info("fail to delete from TD_MKT_PIPELINE_SEGMENT_GROUP where id = {}", groupName);
            return new ResponseEntity("投放组正在被其他流程使用，无法删除", HttpStatus.FORBIDDEN);
        }
    }

    @RequestMapping(value = "/pipelineSegmentGroups/create/{groupName}", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void createGroupByGroupName(@PathVariable String groupName) throws Exception {
        if (pipelineSegmentGroupService.findGroupByGroupName(groupName).isEmpty()) {
            pipelineSegmentGroupService.insertGroupByGroupName(groupName);
            logger.info("insert from TD_MKT_PIPELINE_SEGMENT_GROUP where group_name = {}", groupName);
        }
    }

    @RequestMapping(value = "/pipelineSegmentGroups/query/{groupName}", method = GET)
    @ResponseBody
    public ResponseEntity findGroupsByGroupName(@PathVariable String groupName) throws Exception {
        List<PipelineSegmentGroup> pipelineSegmentGroups = pipelineSegmentGroupService.findGroupsByGroupName(groupName);
        return new ResponseEntity(pipelineSegmentGroups, HttpStatus.OK);
    }
}
