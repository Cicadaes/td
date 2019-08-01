package com.talkingdata.marketing.web.controller.campaign;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

import java.util.List;
import java.util.Map;

import com.talkingdata.marketing.core.annotation.EnableAssignmentTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.campaign.SegmentTaskCalcObjectRecord;
import com.talkingdata.marketing.core.page.campaign.SegmentTaskCalcObjectRecordPage;
import com.talkingdata.marketing.core.service.campaign.SegmentTaskCalcObjectRecordService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class SegmentTaskCalcObjectRecordController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(SegmentTaskCalcObjectRecordController.class);

    @Autowired
    private SegmentTaskCalcObjectRecordService segmentTaskCalcObjectRecordService;

    @RequestMapping(value = "/segmentTaskCalcObjectRecords", method = GET)
    @ResponseBody
    public List<SegmentTaskCalcObjectRecord> query(SegmentTaskCalcObjectRecordPage page) throws Exception {
        page.setOrderBy(SegmentTaskCalcObjectRecord.fieldToColumn(page.getOrderBy()));
        return segmentTaskCalcObjectRecordService.queryByList(page);
    }

    @RequestMapping(value = "/segmentTaskCalcObjectRecords/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(SegmentTaskCalcObjectRecordPage page) throws Exception {
        page.setOrderBy(SegmentTaskCalcObjectRecord.fieldToColumn(page.getOrderBy()));
        List<SegmentTaskCalcObjectRecord> rows = segmentTaskCalcObjectRecordService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/segmentTaskCalcObjectRecords/{id}", method = GET)
    @ResponseBody
    public SegmentTaskCalcObjectRecord find(@PathVariable Integer id) throws Exception {
        return segmentTaskCalcObjectRecordService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/segmentTaskCalcObjectRecords", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    @EnableAssignmentTime
    public SegmentTaskCalcObjectRecord create(@RequestBody SegmentTaskCalcObjectRecord segmentTaskCalcObjectRecord) throws Exception {
        segmentTaskCalcObjectRecordService.insert(segmentTaskCalcObjectRecord);
        return segmentTaskCalcObjectRecord;
    }

    @RequestMapping(value = "/segmentTaskCalcObjectRecords", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody SegmentTaskCalcObjectRecord segmentTaskCalcObjectRecord) throws Exception {
        segmentTaskCalcObjectRecordService.updateByPrimaryKeySelective(segmentTaskCalcObjectRecord);
    }

    @RequestMapping(value = "/segmentTaskCalcObjectRecords/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        segmentTaskCalcObjectRecordService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_SEGMENT_TASK_CALC_OBJECT_RECORD where id = {}", id);
    }

    @RequestMapping(value = "/segmentTaskCalcObjectRecords/date/segment/{segmentId}", method = GET)
    @ResponseBody
    public List<String> getDateList(@PathVariable Integer segmentId) {
        return segmentTaskCalcObjectRecordService.getDateList(segmentId);
    }

    @RequestMapping(value = "/segmentTaskCalcObjectRecords/date/segment/{pipelineId}/{pipelineNodeId}", method = GET)
    @ResponseBody
    public List<String> getDateList(@PathVariable Integer pipelineId,
            @PathVariable String pipelineNodeId) {
        return segmentTaskCalcObjectRecordService.getDateListByPipelineId(pipelineId, pipelineNodeId);
    }
}
