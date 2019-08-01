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
import com.talkingdata.datacloud.visual.entity.report.Chart;
import com.talkingdata.datacloud.visual.page.report.ChartPage;
import com.talkingdata.datacloud.visual.service.report.ChartService;

@Controller
@RequestMapping("/report")
public class ChartController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(ChartController.class);

    @Autowired
    private ChartService chartService;

    @RequestMapping(value = "/charts", method = GET)
    @ResponseBody
    public List<Chart> query(ChartPage page) throws Exception {
        page.setOrderBy(Chart.fieldToColumn(page.getOrderBy()));
        return chartService.queryByList(page);
    }

    @RequestMapping(value = "/charts/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(ChartPage page) throws Exception {
        page.setOrderBy(Chart.fieldToColumn(page.getOrderBy()));
        List<Chart> rows = chartService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/charts/{id}", method = GET)
    @ResponseBody
    public Chart find(@PathVariable Integer id) throws Exception {
        return chartService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/charts", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Chart create(@RequestBody Chart chart) throws Exception {
        chartService.insert(chart);
        return chart;
    }

    @RequestMapping(value = "/charts", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody Chart chart) throws Exception {
        chartService.updateByPrimaryKeySelective(chart);
    }

    @RequestMapping(value = "/charts/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        chartService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_VISUAL_CHART where id = {}", id);
    }

}
