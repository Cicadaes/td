package com.talkingdata.marketing.web.controller.campaign;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.talkingdata.marketing.core.util.AssignmentUtil;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.campaign.PipelineEquityConfigDefinition;
import com.talkingdata.marketing.core.page.campaign.PipelineEquityConfigDefinitionPage;
import com.talkingdata.marketing.core.service.campaign.PipelineEquityConfigDefinitionService;

import javax.servlet.http.HttpServletRequest;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class PipelineEquityConfigDefinitionController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(PipelineEquityConfigDefinitionController.class);

    @Autowired
    private PipelineEquityConfigDefinitionService pipelineEquityConfigDefinitionService;

    @RequestMapping(value = "/pipelineEquityConfigDefinitions", method = GET)
    @ResponseBody
    public List<PipelineEquityConfigDefinition> query(PipelineEquityConfigDefinitionPage page) throws Exception {
        page.setOrderBy(PipelineEquityConfigDefinition.fieldToColumn(page.getOrderBy()));
        return pipelineEquityConfigDefinitionService.queryByList(page);
    }

    @RequestMapping(value = "/pipelineEquityConfigDefinitions/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(PipelineEquityConfigDefinitionPage page) throws Exception {
        page.setOrderBy(PipelineEquityConfigDefinition.fieldToColumn(page.getOrderBy()));
        List<PipelineEquityConfigDefinition> rows = pipelineEquityConfigDefinitionService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/pipelineEquityConfigDefinitions/{id}", method = GET)
    @ResponseBody
    public PipelineEquityConfigDefinition find(@PathVariable Integer id) throws Exception {
        return pipelineEquityConfigDefinitionService.selectByPrimaryKey(id);
    }

    /**
     * 活动未开始的时候的 权益分配
     */
    @RequestMapping(value = "/pipelineEquityConfigDefinitions", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public PipelineEquityConfigDefinition create(@RequestBody PipelineEquityConfigDefinition pipelineEquityConfigDefinition,HttpServletRequest request) throws Exception {
        AssignmentUtil.setInfo(pipelineEquityConfigDefinition,request);
        pipelineEquityConfigDefinitionService.validAndInsert(pipelineEquityConfigDefinition);
        return pipelineEquityConfigDefinition;
    }

    @ApiOperation(value = "营销流程权益重配", notes = "需要将该活动下的全部流程的全部营销配置传入")
    @RequestMapping(value = "/pipelineEquityConfigDefinitions", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody List<PipelineEquityConfigDefinition> pipelineEquityConfigDefinitions,HttpServletRequest request) throws Exception {
        for (PipelineEquityConfigDefinition pipelineEquityConfigDefinition:pipelineEquityConfigDefinitions){
            pipelineEquityConfigDefinitionService.validEquityCount(pipelineEquityConfigDefinition);
        }
        pipelineEquityConfigDefinitionService.validOverflow(pipelineEquityConfigDefinitions);
        for (PipelineEquityConfigDefinition pipelineEquityConfigDefinition:pipelineEquityConfigDefinitions) {
            if (null == pipelineEquityConfigDefinition.getId()){
                pipelineEquityConfigDefinition.setCreateTime(new Date());
                AssignmentUtil.setInfo(pipelineEquityConfigDefinition,request);
            }else{
                pipelineEquityConfigDefinition.setUpdateTime(new Date());
                AssignmentUtil.setUpdateBasicInfo(pipelineEquityConfigDefinition,request);
            }
            pipelineEquityConfigDefinitionService.save(pipelineEquityConfigDefinition);
        }
    }

    @RequestMapping(value = "/pipelineEquityConfigDefinitions/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        pipelineEquityConfigDefinitionService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_PIPELINE_EQUITY_CONFIG_DEFINITION where id = {}", id);
    }

}
