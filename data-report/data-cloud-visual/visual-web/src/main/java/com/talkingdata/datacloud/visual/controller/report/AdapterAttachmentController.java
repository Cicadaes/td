package com.talkingdata.datacloud.visual.controller.report;

import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.visual.entity.report.AdapterAttachment;
import com.talkingdata.datacloud.visual.page.report.AdapterAttachmentPage;
import com.talkingdata.datacloud.visual.service.report.AdapterAttachmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@Controller
@RequestMapping("/report")
public class AdapterAttachmentController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(AdapterAttachmentController.class);


    @Autowired
    private AdapterAttachmentService adapterAttachmentService;
    @RequestMapping(value = "/adapterAttachments", method = GET)
    @ResponseBody
    public List<AdapterAttachment> query(AdapterAttachmentPage page) throws Exception {
        page.setOrderBy(AdapterAttachment.fieldToColumn(page.getOrderBy()));
        return adapterAttachmentService.queryByList(page);
    }

    @RequestMapping(value = "/adapterAttachments/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(AdapterAttachmentPage page) throws Exception {
        page.setOrderBy(AdapterAttachment.fieldToColumn(page.getOrderBy()));
        List<AdapterAttachment> rows = adapterAttachmentService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/adapterAttachments/{id}", method = GET)
    @ResponseBody
    public AdapterAttachment find(@PathVariable Integer id) throws Exception {
        return adapterAttachmentService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/adapterAttachments", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody AdapterAttachment adapterAttachment) throws Exception {
        adapterAttachmentService.updateByPrimaryKeySelective(adapterAttachment);
    }

    @RequestMapping(value = "/adapterAttachments/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        adapterAttachmentService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_VISUAL_ADAPTER_ATTACHMENT where id = {}", id);
    }

}
