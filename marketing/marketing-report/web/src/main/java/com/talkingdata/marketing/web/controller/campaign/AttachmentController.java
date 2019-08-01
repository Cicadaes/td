package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.constant.AttachmentConstants;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.campaign.AttachmentPage;
import com.talkingdata.marketing.core.service.campaign.AttachmentService;
import com.talkingdata.marketing.core.util.FileUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class AttachmentController extends BaseController {

    private static final Logger logger = LoggerFactory.getLogger(AttachmentController.class);

    @Autowired
    private AttachmentService attachmentService;

    @Autowired
    private ExceptionBuilder exceptionBuilder;

    @RequestMapping(value = "/attachments", method = GET)
    @ResponseBody
    public List<Attachment> query(AttachmentPage page) throws Exception {
        page.setOrderBy(Attachment.fieldToColumn(page.getOrderBy()));
        return attachmentService.queryByList(page);
    }

    @RequestMapping(value = "/attachments/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(AttachmentPage page) throws Exception {
        page.setOrderBy(Attachment.fieldToColumn(page.getOrderBy()));
        List<Attachment> rows = attachmentService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/attachments/{id}", method = GET)
    @ResponseBody
    public Attachment find(@PathVariable Integer id) throws Exception {
        return attachmentService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/attachments", method = POST,consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Attachment create(@RequestBody Map paramMap) throws Exception {
        Integer uploadUUID = (Integer) paramMap.get("uploadUUID");
        Attachment attachment = attachmentService.selectByPrimaryKey(uploadUUID);
        File file = new File(attachment.getPath());
        if(!file.exists()){
            throw exceptionBuilder.buildMktException(ExceptionMessage.FILE_NOT_EXIST);
        }
        FileUtil.fileCheck(file, AttachmentConstants.AttachmentFormatConstants.CSV_SUFFIX);
        return attachment;
    }

    @RequestMapping(value = "/attachments", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody Attachment attachment) throws Exception {
        attachmentService.updateByPrimaryKeySelective(attachment);
    }

    @RequestMapping(value = "/attachments/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        attachmentService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_ATTACHMENT where id = {}", id);
    }

}
