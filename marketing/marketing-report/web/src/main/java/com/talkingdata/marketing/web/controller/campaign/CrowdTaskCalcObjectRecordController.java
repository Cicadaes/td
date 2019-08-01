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
import com.talkingdata.marketing.core.entity.campaign.CrowdTaskCalcObjectRecord;
import com.talkingdata.marketing.core.page.campaign.CrowdTaskCalcObjectRecordPage;
import com.talkingdata.marketing.core.service.campaign.CrowdTaskCalcObjectRecordService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class CrowdTaskCalcObjectRecordController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(CrowdTaskCalcObjectRecordController.class);

    @Autowired
    private CrowdTaskCalcObjectRecordService crowdTaskCalcObjectRecordService;

    @RequestMapping(value = "/crowdTaskCalcObjectRecords", method = GET)
    @ResponseBody
    public List<CrowdTaskCalcObjectRecord> query(CrowdTaskCalcObjectRecordPage page) throws Exception {
        page.setOrderBy(CrowdTaskCalcObjectRecord.fieldToColumn(page.getOrderBy()));
        return crowdTaskCalcObjectRecordService.queryByList(page);
    }

    @RequestMapping(value = "/crowdTaskCalcObjectRecords/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(CrowdTaskCalcObjectRecordPage page) throws Exception {
        page.setOrderBy(CrowdTaskCalcObjectRecord.fieldToColumn(page.getOrderBy()));
        List<CrowdTaskCalcObjectRecord> rows = crowdTaskCalcObjectRecordService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/crowdTaskCalcObjectRecords/{id}", method = GET)
    @ResponseBody
    public CrowdTaskCalcObjectRecord find(@PathVariable Integer id) throws Exception {
        return crowdTaskCalcObjectRecordService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/crowdTaskCalcObjectRecords", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    @EnableAssignmentTime
    public CrowdTaskCalcObjectRecord create(@RequestBody CrowdTaskCalcObjectRecord crowdTaskCalcObjectRecord) throws Exception {
        crowdTaskCalcObjectRecordService.insert(crowdTaskCalcObjectRecord);
        return crowdTaskCalcObjectRecord;
    }

    @RequestMapping(value = "/crowdTaskCalcObjectRecords", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody CrowdTaskCalcObjectRecord crowdTaskCalcObjectRecord) throws Exception {
        crowdTaskCalcObjectRecordService.updateByPrimaryKeySelective(crowdTaskCalcObjectRecord);
    }

    @RequestMapping(value = "/crowdTaskCalcObjectRecords/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        crowdTaskCalcObjectRecordService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_CROWD_TASK_CALC_OBJECT_RECORD where id = {}", id);
    }

}
