package com.talkingdata.marketing.web.controller.campaign;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

import java.util.List;
import java.util.Map;

import com.talkingdata.marketing.core.entity.campaign.BatchNotice;
import com.talkingdata.marketing.core.page.campaign.BatchNoticePage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.service.campaign.BatchNoticeService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class BatchNoticeController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(BatchNoticeController.class);

    @Autowired
    private BatchNoticeService batchNoticeService;

    @RequestMapping(value = "/batchNotices", method = GET)
    @ResponseBody
    public List<BatchNotice> query(BatchNoticePage page) throws Exception {
        page.setOrderBy(BatchNotice.fieldToColumn(page.getOrderBy()));
        return batchNoticeService.queryByList(page);
    }

    @RequestMapping(value = "/batchNotices/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(BatchNoticePage page) throws Exception {
        page.setOrderBy(BatchNotice.fieldToColumn(page.getOrderBy()));
        List<BatchNotice> rows = batchNoticeService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/batchNotices/{id}", method = GET)
    @ResponseBody
    public BatchNotice find(@PathVariable Integer id) throws Exception {
        return batchNoticeService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/batchNotices", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public BatchNotice create(@RequestBody BatchNotice batchNotice) throws Exception {
        batchNoticeService.insert(batchNotice);
        return batchNotice;
    }

    @RequestMapping(value = "/batchNotices", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody BatchNotice batchNotice) throws Exception {
        batchNoticeService.updateByPrimaryKeySelective(batchNotice);
    }

    @RequestMapping(value = "/batchNotices/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        batchNoticeService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_BATCH_NOTICE where id = {}", id);
    }

}
