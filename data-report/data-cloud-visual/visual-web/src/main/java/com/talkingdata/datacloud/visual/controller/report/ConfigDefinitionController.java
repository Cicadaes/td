package com.talkingdata.datacloud.visual.controller.report;

import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinition;
import com.talkingdata.datacloud.visual.page.report.ConfigDefinitionPage;
import com.talkingdata.datacloud.visual.service.report.ConfigDefinitionService;
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
public class ConfigDefinitionController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(ConfigDefinitionController.class);

    @Autowired
    private ConfigDefinitionService configDefinitionService;

    @RequestMapping(value = "/configDefinitions", method = GET)
    @ResponseBody
    public List<ConfigDefinition> query(ConfigDefinitionPage page) throws Exception {
        page.setOrderBy(ConfigDefinition.fieldToColumn(page.getOrderBy()));
        return configDefinitionService.queryByList(page);
    }

    @RequestMapping(value = "/configDefinitions/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(ConfigDefinitionPage page) throws Exception {
        page.setOrderBy(ConfigDefinition.fieldToColumn(page.getOrderBy()));
        List<ConfigDefinition> rows = configDefinitionService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/configDefinitions/{id}", method = GET)
    @ResponseBody
    public ConfigDefinition find(@PathVariable Integer id) throws Exception {
        return configDefinitionService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/configDefinitions", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ConfigDefinition create(@RequestBody ConfigDefinition configDefinition) throws Exception {
        configDefinitionService.insert(configDefinition);
        return configDefinition;
    }

    @RequestMapping(value = "/configDefinitions", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody ConfigDefinition configDefinition) throws Exception {
        configDefinitionService.updateByPrimaryKeySelective(configDefinition);
    }

    @RequestMapping(value = "/configDefinitions/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        configDefinitionService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_CONFIG_DEFINITION where id = {}", id);
    }

}
