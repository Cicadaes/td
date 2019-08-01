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
import com.talkingdata.datacloud.visual.entity.report.ReportPageChartRel;
import com.talkingdata.datacloud.visual.page.report.ReportPageChartRelPage;
import com.talkingdata.datacloud.visual.service.report.ReportPageChartRelService;

@Controller
@RequestMapping("/report")
public class ReportPageChartRelController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(ReportPageChartRelController.class);

    @Autowired
    private ReportPageChartRelService reportPageChartRelService;

    @RequestMapping(value = "/reportPageChartRels", method = GET)
    @ResponseBody
    public List<ReportPageChartRel> query(ReportPageChartRelPage page) throws Exception {
        page.setOrderBy(ReportPageChartRel.fieldToColumn(page.getOrderBy()));
        return reportPageChartRelService.queryByList(page);
    }

    @RequestMapping(value = "/reportPageChartRels/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(ReportPageChartRelPage page) throws Exception {
        page.setOrderBy(ReportPageChartRel.fieldToColumn(page.getOrderBy()));
        List<ReportPageChartRel> rows = reportPageChartRelService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/reportPageChartRels/{id}", method = GET)
    @ResponseBody
    public ReportPageChartRel find(@PathVariable Integer id) throws Exception {
        return reportPageChartRelService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/reportPageChartRels", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ReportPageChartRel create(@RequestBody ReportPageChartRel reportPageChartRel) throws Exception {
        reportPageChartRelService.insert(reportPageChartRel);
        return reportPageChartRel;
    }

    @RequestMapping(value = "/reportPageChartRels", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody ReportPageChartRel reportPageChartRel) throws Exception {
        reportPageChartRelService.updateByPrimaryKeySelective(reportPageChartRel);
    }

    @RequestMapping(value = "/reportPageChartRels/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        reportPageChartRelService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_VISUAL_REPORT_PAGE_CHART_REL where id = {}", id);
    }

}
