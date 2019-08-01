package com.talkingdata.datacloud.visual.controller.report;

import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinitionCategroup;
import com.talkingdata.datacloud.visual.page.report.ConfigDefinitionCategroupPage;
import com.talkingdata.datacloud.visual.service.report.ConfigDefinitionCategroupService;
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
public class ConfigDefinitionCategroupController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(ConfigDefinitionCategroupController.class);

    @Autowired
    private ConfigDefinitionCategroupService configDefinitionCategroupService;

    /**
     * 获取图表分类组信息
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/configDefinitionCateGroups", method = GET)
    @ResponseBody
    public List<ConfigDefinitionCategroup> query(ConfigDefinitionCategroupPage page) throws Exception {
        page.setOrderBy(ConfigDefinitionCategroup.fieldToColumn(page.getOrderBy()));
        page.setPageSize(100);
        return configDefinitionCategroupService.queryByList(page);
    }

    @RequestMapping(value = "/configDefinitionCategroups/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(ConfigDefinitionCategroupPage page) throws Exception {
        page.setOrderBy(ConfigDefinitionCategroup.fieldToColumn(page.getOrderBy()));
        List<ConfigDefinitionCategroup> rows = configDefinitionCategroupService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/configDefinitionCategroups/{id}", method = GET)
    @ResponseBody
    public ConfigDefinitionCategroup find(@PathVariable Integer id) throws Exception {
        return configDefinitionCategroupService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/configDefinitionCategroups", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ConfigDefinitionCategroup create(@RequestBody ConfigDefinitionCategroup configDefinitionCategroup) throws Exception {
        configDefinitionCategroupService.insert(configDefinitionCategroup);
        return configDefinitionCategroup;
    }

    @RequestMapping(value = "/configDefinitionCategroups", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody ConfigDefinitionCategroup configDefinitionCategroup) throws Exception {
        configDefinitionCategroupService.updateByPrimaryKeySelective(configDefinitionCategroup);
    }

    @RequestMapping(value = "/configDefinitionCategroups/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        configDefinitionCategroupService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_CONFIG_DEFINITION_CATEGROUP where id = {}", id);
    }

}
