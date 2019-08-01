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
import com.talkingdata.datacloud.visual.entity.report.ChartStyleConfig;
import com.talkingdata.datacloud.visual.page.report.ChartStyleConfigPage;
import com.talkingdata.datacloud.visual.service.report.ChartStyleConfigService;

@Controller
@RequestMapping("/report")
public class ChartStyleConfigController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(ChartStyleConfigController.class);

    @Autowired
    private ChartStyleConfigService chartStyleConfigService;

    @RequestMapping(value = "/chartStyleConfigs", method = GET)
    @ResponseBody
    public List<ChartStyleConfig> query(ChartStyleConfigPage page) throws Exception {
        page.setOrderBy(ChartStyleConfig.fieldToColumn(page.getOrderBy()));
        return chartStyleConfigService.queryByList(page);
    }

    @RequestMapping(value = "/chartStyleConfigs/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(ChartStyleConfigPage page) throws Exception {
        page.setOrderBy(ChartStyleConfig.fieldToColumn(page.getOrderBy()));
        List<ChartStyleConfig> rows = chartStyleConfigService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/chartStyleConfigs/{id}", method = GET)
    @ResponseBody
    public ChartStyleConfig find(@PathVariable Integer id) throws Exception {
        return chartStyleConfigService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/chartStyleConfigs", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ChartStyleConfig create(@RequestBody ChartStyleConfig chartStyleConfig) throws Exception {
        chartStyleConfigService.insert(chartStyleConfig);
        return chartStyleConfig;
    }

    @RequestMapping(value = "/chartStyleConfigs", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody ChartStyleConfig chartStyleConfig) throws Exception {
        chartStyleConfigService.updateByPrimaryKeySelective(chartStyleConfig);
    }

    @RequestMapping(value = "/chartStyleConfigs/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        chartStyleConfigService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_VISUAL_CHART_STYLE_CONFIG where id = {}", id);
    }

}
