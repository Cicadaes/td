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
import com.talkingdata.marketing.core.entity.campaign.EquityRecord;
import com.talkingdata.marketing.core.page.campaign.EquityRecordPage;
import com.talkingdata.marketing.core.service.campaign.EquityRecordService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class EquityRecordController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(EquityRecordController.class);

    @Autowired
    private EquityRecordService equityRecordService;

    @RequestMapping(value = "/equityRecords", method = GET)
    @ResponseBody
    public List<EquityRecord> query(EquityRecordPage page) throws Exception {
        page.setOrderBy(EquityRecord.fieldToColumn(page.getOrderBy()));
        return equityRecordService.queryByList(page);
    }

    @RequestMapping(value = "/equityRecords/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(EquityRecordPage page) throws Exception {
        page.setOrderBy(EquityRecord.fieldToColumn(page.getOrderBy()));
        List<EquityRecord> rows = equityRecordService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/equityRecords/{id}", method = GET)
    @ResponseBody
    public EquityRecord find(@PathVariable Integer id) throws Exception {
        return equityRecordService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/equityRecords", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public EquityRecord create(@RequestBody EquityRecord equityRecord) throws Exception {
        equityRecordService.insert(equityRecord);
        return equityRecord;
    }

    @RequestMapping(value = "/equityRecords", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody EquityRecord equityRecord) throws Exception {
        equityRecordService.updateByPrimaryKeySelective(equityRecord);
    }

    @RequestMapping(value = "/equityRecords/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        equityRecordService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_EQUITY_RECORD where id = {}", id);
    }
}
