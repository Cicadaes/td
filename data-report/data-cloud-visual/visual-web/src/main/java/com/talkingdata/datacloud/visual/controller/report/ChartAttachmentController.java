package com.talkingdata.datacloud.visual.controller.report;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
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

import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.visual.entity.report.ChartAttachment;
import com.talkingdata.datacloud.visual.page.report.ChartAttachmentPage;
import com.talkingdata.datacloud.visual.service.report.ChartAttachmentService;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/report")
public class ChartAttachmentController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(ChartAttachmentController.class);

    @Autowired
    private ChartAttachmentService chartAttachmentService;

    @RequestMapping(value = "/chartAttachments", method = GET)
    @ResponseBody
    public List<ChartAttachment> query(ChartAttachmentPage page) throws Exception {
        page.setOrderBy(ChartAttachment.fieldToColumn(page.getOrderBy()));
        return chartAttachmentService.queryByList(page);
    }

    @RequestMapping(value = "/chartAttachments/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(ChartAttachmentPage page) throws Exception {
        page.setOrderBy(ChartAttachment.fieldToColumn(page.getOrderBy()));
        List<ChartAttachment> rows = chartAttachmentService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/chartAttachments/{id}", method = GET)
    @ResponseBody
    public ChartAttachment find(@PathVariable Integer id) throws Exception {
        return chartAttachmentService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/chartAttachments", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ChartAttachment create(@RequestBody ChartAttachment chartAttachment) throws Exception {
        chartAttachmentService.insert(chartAttachment);
        return chartAttachment;
    }
    //图片上传，参考算子的OperatorService类processAttchment方法240行
    @RequestMapping(value = "/images", method = POST)
    @ResponseBody
    public Integer upload(@RequestParam("file") MultipartFile file) throws Exception {
        ChartAttachment chartAttachment=new ChartAttachment();
        chartAttachment.setName(file.getOriginalFilename());
        chartAttachment.setType(3);
        chartAttachment.setData(file.getBytes());
        chartAttachment.setSize(file.getSize()+"byte");
        chartAttachmentService.insert(chartAttachment);
        return chartAttachment.getId();
    }
    //图片下载，参考算子的OperatorController类operatorIcon方法292行
    @RequestMapping(value = "/images/{id}", method = GET,produces = IMAGE_JPEG_VALUE)
    @ResponseBody
    public String upload(@PathVariable Integer id) throws Exception {
        ChartAttachment chartAttachment=chartAttachmentService.selectByPrimaryKey(id);
        String result = new String((byte[])chartAttachment.getData());
        return result;
    }

    @RequestMapping(value = "/chartAttachments", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody ChartAttachment chartAttachment) throws Exception {
        chartAttachmentService.updateByPrimaryKeySelective(chartAttachment);
    }

    @RequestMapping(value = "/chartAttachments/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        chartAttachmentService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_VISUAL_CHART_ATTACHMENT where id = {}", id);
    }

}
