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
import com.talkingdata.marketing.core.entity.campaign.DataDownload;
import com.talkingdata.marketing.core.page.campaign.DataDownloadPage;
import com.talkingdata.marketing.core.service.campaign.DataDownloadService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class DataDownloadController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(DataDownloadController.class);

    @Autowired
    private DataDownloadService dataDownloadService;

    @RequestMapping(value = "/dataDownloads", method = GET)
    @ResponseBody
    public List<DataDownload> query(DataDownloadPage page) throws Exception {
        page.setOrderBy(DataDownload.fieldToColumn(page.getOrderBy()));
        return dataDownloadService.queryByList(page);
    }

    @RequestMapping(value = "/dataDownloads/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(DataDownloadPage page) throws Exception {
        page.setOrderBy(DataDownload.fieldToColumn(page.getOrderBy()));
        List<DataDownload> rows = dataDownloadService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/dataDownloads/{id}", method = GET)
    @ResponseBody
    public DataDownload find(@PathVariable Integer id) throws Exception {
        return dataDownloadService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/dataDownloads", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    @EnableAssignmentTime
    public DataDownload create(@RequestBody DataDownload dataDownload) throws Exception {
        dataDownloadService.insert(dataDownload);
        return dataDownload;
    }

    @RequestMapping(value = "/dataDownloads", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody DataDownload dataDownload) throws Exception {
        dataDownloadService.updateByPrimaryKeySelective(dataDownload);
    }

    @RequestMapping(value = "/dataDownloads/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        dataDownloadService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_DATA_DOWNLOAD where id = {}", id);
    }

}
