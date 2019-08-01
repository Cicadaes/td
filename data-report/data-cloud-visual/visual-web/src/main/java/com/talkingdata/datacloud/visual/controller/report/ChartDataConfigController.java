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
import com.talkingdata.datacloud.visual.entity.report.ChartDataConfig;
import com.talkingdata.datacloud.visual.page.report.ChartDataConfigPage;
import com.talkingdata.datacloud.visual.service.report.ChartDataConfigService;

@Controller
@RequestMapping("/report")
public class ChartDataConfigController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(ChartDataConfigController.class);

    @Autowired
    private ChartDataConfigService chartDataConfigService;

    @RequestMapping(value = "/chartDataConfigs", method = GET)
    @ResponseBody
    public List<ChartDataConfig> query(ChartDataConfigPage page) throws Exception {
        page.setOrderBy(ChartDataConfig.fieldToColumn(page.getOrderBy()));
        return chartDataConfigService.queryByList(page);
    }

    @RequestMapping(value = "/chartDataConfigs/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(ChartDataConfigPage page) throws Exception {
        page.setOrderBy(ChartDataConfig.fieldToColumn(page.getOrderBy()));
        List<ChartDataConfig> rows = chartDataConfigService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/chartDataConfigs/{id}", method = GET)
    @ResponseBody
    public ChartDataConfig find(@PathVariable Integer id) throws Exception {
        return chartDataConfigService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/chartDataConfigs", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ChartDataConfig create(@RequestBody ChartDataConfig chartDataConfig) throws Exception {
        chartDataConfigService.insert(chartDataConfig);
        return chartDataConfig;
    }

    @RequestMapping(value = "/chartDataConfigs", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody ChartDataConfig chartDataConfig) throws Exception {
        chartDataConfigService.updateByPrimaryKeySelective(chartDataConfig);
    }

    @RequestMapping(value = "/chartDataConfigs/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        chartDataConfigService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_VISUAL_CHART_DATA_CONFIG where id = {}", id);
    }

}
