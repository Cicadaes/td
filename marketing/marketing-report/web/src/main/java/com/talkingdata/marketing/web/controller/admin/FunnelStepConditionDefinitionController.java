package com.talkingdata.marketing.web.controller.admin;

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

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.admin.FunnelStepConditionDefinition;
import com.talkingdata.marketing.core.page.admin.FunnelStepConditionDefinitionPage;
import com.talkingdata.marketing.core.service.admin.FunnelStepConditionDefinitionService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/admin")
public class FunnelStepConditionDefinitionController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(FunnelStepConditionDefinitionController.class);

    @Autowired
    private FunnelStepConditionDefinitionService funnelStepConditionDefinitionService;

    @RequestMapping(value = "/funnelStepConditionDefinitions", method = GET)
    @ResponseBody
    public List<FunnelStepConditionDefinition> query(FunnelStepConditionDefinitionPage page) throws Exception {
        page.setOrderBy(FunnelStepConditionDefinition.fieldToColumn(page.getOrderBy()));
        return funnelStepConditionDefinitionService.queryByList(page);
    }

    @RequestMapping(value = "/funnelStepConditionDefinitions/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(FunnelStepConditionDefinitionPage page) throws Exception {
        page.setOrderBy(FunnelStepConditionDefinition.fieldToColumn(page.getOrderBy()));
        List<FunnelStepConditionDefinition> rows = funnelStepConditionDefinitionService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/funnelStepConditionDefinitions/{id}", method = GET)
    @ResponseBody
    public FunnelStepConditionDefinition find(@PathVariable Integer id) throws Exception {
        return funnelStepConditionDefinitionService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/funnelStepConditionDefinitions", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public FunnelStepConditionDefinition create(@RequestBody FunnelStepConditionDefinition funnelStepConditionDefinition) throws Exception {
        funnelStepConditionDefinitionService.insert(funnelStepConditionDefinition);
        return funnelStepConditionDefinition;
    }

    @RequestMapping(value = "/funnelStepConditionDefinitions", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody FunnelStepConditionDefinition funnelStepConditionDefinition) throws Exception {
        funnelStepConditionDefinitionService.updateByPrimaryKeySelective(funnelStepConditionDefinition);
    }

    @RequestMapping(value = "/funnelStepConditionDefinitions/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        funnelStepConditionDefinitionService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_FUNNEL_STEP_CONDITION_DEFINITION where id = {}", id);
    }

}
