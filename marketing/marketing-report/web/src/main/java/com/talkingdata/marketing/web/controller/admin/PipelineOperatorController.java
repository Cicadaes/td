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
import com.talkingdata.marketing.core.entity.admin.PipelineOperator;
import com.talkingdata.marketing.core.page.admin.PipelineOperatorPage;
import com.talkingdata.marketing.core.service.admin.PipelineOperatorService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/admin")
public class PipelineOperatorController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(PipelineOperatorController.class);

    @Autowired
    private PipelineOperatorService pipelineOperatorService;

    @RequestMapping(value = "/pipelineOperators", method = GET)
    @ResponseBody
    public List<PipelineOperator> query(PipelineOperatorPage page) throws Exception {
        page.setOrderBy(PipelineOperator.fieldToColumn(page.getOrderBy()));
        return pipelineOperatorService.queryByList(page);
    }

    @RequestMapping(value = "/pipelineOperators/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(PipelineOperatorPage page) throws Exception {
        page.setOrderBy(PipelineOperator.fieldToColumn(page.getOrderBy()));
        List<PipelineOperator> rows = pipelineOperatorService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/pipelineOperators/{id}", method = GET)
    @ResponseBody
    public PipelineOperator find(@PathVariable Integer id) throws Exception {
        return pipelineOperatorService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/pipelineOperators", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public PipelineOperator create(@RequestBody PipelineOperator pipelineOperator) throws Exception {
        pipelineOperatorService.insert(pipelineOperator);
        return pipelineOperator;
    }

    @RequestMapping(value = "/pipelineOperators", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody PipelineOperator pipelineOperator) throws Exception {
        pipelineOperatorService.updateByPrimaryKeySelective(pipelineOperator);
    }

    @RequestMapping(value = "/pipelineOperators/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        pipelineOperatorService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_PIPELINE_OPERATOR where id = {}", id);
    }

}
