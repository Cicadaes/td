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
import com.talkingdata.marketing.core.entity.admin.FunnelStepDefinition;
import com.talkingdata.marketing.core.page.admin.FunnelStepDefinitionPage;
import com.talkingdata.marketing.core.service.admin.FunnelStepDefinitionService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/admin")
public class FunnelStepDefinitionController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(FunnelStepDefinitionController.class);

    @Autowired
    private FunnelStepDefinitionService funnelStepDefinitionService;

    @RequestMapping(value = "/funnelStepDefinitions", method = GET)
    @ResponseBody
    public List<FunnelStepDefinition> query(FunnelStepDefinitionPage page) throws Exception {
        page.setOrderBy(FunnelStepDefinition.fieldToColumn(page.getOrderBy()));
        return funnelStepDefinitionService.queryByList(page);
    }

    @RequestMapping(value = "/funnelStepDefinitions/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(FunnelStepDefinitionPage page) throws Exception {
        page.setOrderBy(FunnelStepDefinition.fieldToColumn(page.getOrderBy()));
        List<FunnelStepDefinition> rows = funnelStepDefinitionService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/funnelStepDefinitions/{id}", method = GET)
    @ResponseBody
    public FunnelStepDefinition find(@PathVariable Integer id) throws Exception {
        return funnelStepDefinitionService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/funnelStepDefinitions", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public FunnelStepDefinition create(@RequestBody FunnelStepDefinition funnelStepDefinition) throws Exception {
        funnelStepDefinitionService.insert(funnelStepDefinition);
        return funnelStepDefinition;
    }

    @RequestMapping(value = "/funnelStepDefinitions", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody FunnelStepDefinition funnelStepDefinition) throws Exception {
        funnelStepDefinitionService.updateByPrimaryKeySelective(funnelStepDefinition);
    }

    @RequestMapping(value = "/funnelStepDefinitions/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        funnelStepDefinitionService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_FUNNEL_STEP_DEFINITION where id = {}", id);
    }

}
