package com.talkingdata.datacloud.visual.controller.report;

import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinitionField;
import com.talkingdata.datacloud.visual.page.report.ConfigDefinitionFieldPage;
import com.talkingdata.datacloud.visual.service.report.ConfigDefinitionFieldService;
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
public class ConfigDefinitionFieldController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(ConfigDefinitionFieldController.class);

    @Autowired
    private ConfigDefinitionFieldService configDefinitionFieldService;

    @RequestMapping(value = "/configDefinitionFields", method = GET)
    @ResponseBody
    public List<ConfigDefinitionField> query(ConfigDefinitionFieldPage page) throws Exception {
        page.setOrderBy(ConfigDefinitionField.fieldToColumn(page.getOrderBy()));
        return configDefinitionFieldService.queryByList(page);
    }

    @RequestMapping(value = "/configDefinitionFields/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(ConfigDefinitionFieldPage page) throws Exception {
        page.setOrderBy(ConfigDefinitionField.fieldToColumn(page.getOrderBy()));
        List<ConfigDefinitionField> rows = configDefinitionFieldService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/configDefinitionFields/{id}", method = GET)
    @ResponseBody
    public ConfigDefinitionField find(@PathVariable Integer id) throws Exception {
        return configDefinitionFieldService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/configDefinitionFields", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ConfigDefinitionField create(@RequestBody ConfigDefinitionField configDefinitionField) throws Exception {
        configDefinitionFieldService.insert(configDefinitionField);
        return configDefinitionField;
    }

    @RequestMapping(value = "/configDefinitionFields", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody ConfigDefinitionField configDefinitionField) throws Exception {
        configDefinitionFieldService.updateByPrimaryKeySelective(configDefinitionField);
    }

    @RequestMapping(value = "/configDefinitionFields/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        configDefinitionFieldService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_CONFIG_DEFINITION_FIELD where id = {}", id);
    }

}
