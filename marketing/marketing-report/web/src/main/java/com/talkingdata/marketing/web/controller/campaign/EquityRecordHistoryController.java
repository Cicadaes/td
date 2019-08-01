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
import com.talkingdata.marketing.core.entity.campaign.EquityRecordHistory;
import com.talkingdata.marketing.core.page.campaign.EquityRecordHistoryPage;
import com.talkingdata.marketing.core.service.campaign.EquityRecordHistoryService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class EquityRecordHistoryController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(EquityRecordHistoryController.class);

    @Autowired
    private EquityRecordHistoryService equityRecordHistoryService;

    @RequestMapping(value = "/equityRecordHistories", method = GET)
    @ResponseBody
    public List<EquityRecordHistory> query(EquityRecordHistoryPage page) throws Exception {
        page.setOrderBy(EquityRecordHistory.fieldToColumn(page.getOrderBy()));
        return equityRecordHistoryService.queryByList(page);
    }

    @RequestMapping(value = "/equityRecordHistories/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(EquityRecordHistoryPage page) throws Exception {
        page.setOrderBy(EquityRecordHistory.fieldToColumn(page.getOrderBy()));
        List<EquityRecordHistory> rows = equityRecordHistoryService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/equityRecordHistories/{id}", method = GET)
    @ResponseBody
    public EquityRecordHistory find(@PathVariable Integer id) throws Exception {
        return equityRecordHistoryService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/equityRecordHistories", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public EquityRecordHistory create(@RequestBody EquityRecordHistory equityRecordHistory) throws Exception {
        equityRecordHistoryService.insert(equityRecordHistory);
        return equityRecordHistory;
    }

    @RequestMapping(value = "/equityRecordHistories", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody EquityRecordHistory equityRecordHistory) throws Exception {
        equityRecordHistoryService.updateByPrimaryKeySelective(equityRecordHistory);
    }

    @RequestMapping(value = "/equityRecordHistories/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        equityRecordHistoryService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_EQUITY_RECORD_HISTORY where id = {}", id);
    }

}
