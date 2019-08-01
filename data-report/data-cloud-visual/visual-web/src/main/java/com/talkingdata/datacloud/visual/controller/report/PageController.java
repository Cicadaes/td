package com.talkingdata.datacloud.visual.controller.report;

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

import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.visual.entity.report.Page;
import com.talkingdata.datacloud.visual.page.report.PagePage;
import com.talkingdata.datacloud.visual.service.report.PageService;

@Controller
@RequestMapping("/report")
public class PageController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(PageController.class);

    @Autowired
    private PageService pageService;

    @RequestMapping(value = "/pages", method = GET)
    @ResponseBody
    public List<Page> query(PagePage page) throws Exception {
        page.setOrderBy(Page.fieldToColumn(page.getOrderBy()));
        return pageService.queryByList(page);
    }

    @RequestMapping(value = "/pages/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(PagePage page) throws Exception {
        page.setOrderBy(Page.fieldToColumn(page.getOrderBy()));
        List<Page> rows = pageService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/pages/{id}", method = GET)
    @ResponseBody
    public Page find(@PathVariable Integer id) throws Exception {
        return pageService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/pages", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Page create(@RequestBody Page page) throws Exception {
        pageService.insert(page);
        return page;
    }

    @RequestMapping(value = "/pages", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody Page page) throws Exception {
        pageService.updateByPrimaryKeySelective(page);
    }

    @RequestMapping(value = "/pages/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        pageService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_VISUAL_PAGE where id = {}", id);
    }

}
