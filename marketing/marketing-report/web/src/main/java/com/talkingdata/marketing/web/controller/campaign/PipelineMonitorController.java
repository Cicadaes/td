package com.talkingdata.marketing.web.controller.campaign;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

import java.util.List;
import java.util.Map;

import com.talkingdata.marketing.core.entity.dto.PipelineMonitorDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.campaign.PipelineMonitor;
import com.talkingdata.marketing.core.page.campaign.PipelineMonitorPage;
import com.talkingdata.marketing.core.service.campaign.PipelineMonitorService;

@Controller
@RequestMapping("/campaign")
public class PipelineMonitorController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(PipelineMonitorController.class);

    @Autowired
    private PipelineMonitorService pipelineMonitorService;

    @RequestMapping(value = "/pipelineMonitors", method = GET)
    @ResponseBody
    public List<PipelineMonitor> query(PipelineMonitorPage page) throws Exception {
        page.setOrderBy(PipelineMonitor.fieldToColumn(page.getOrderBy()));
        return pipelineMonitorService.queryByList(page);
    }

    @RequestMapping(value = "/pipelineMonitors/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(PipelineMonitorPage page) throws Exception {
        page.setOrderBy(PipelineMonitor.fieldToColumn(page.getOrderBy()));
        List<PipelineMonitor> rows = pipelineMonitorService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/pipelineMonitors/{id}", method = GET)
    @ResponseBody
    public PipelineMonitor find(@PathVariable Integer id) throws Exception {
        return pipelineMonitorService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/pipelineMonitors", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public PipelineMonitor create(@RequestBody PipelineMonitor pipelineMonitor) throws Exception {
        pipelineMonitorService.insert(pipelineMonitor);
        return pipelineMonitor;
    }

    @RequestMapping(value = "/pipelineMonitors", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody PipelineMonitor pipelineMonitor) throws Exception {
        pipelineMonitorService.updateByPrimaryKeySelective(pipelineMonitor);
    }

    @RequestMapping(value = "/pipelineMonitors/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        pipelineMonitorService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_PIPELINE_MONITOR where id = {}", id);
    }

    @RequestMapping(value = "/pipelineMonitors/query/{pipelineId}", method = GET)
    @ResponseBody
    public ResponseEntity findMetricValueByPipelineId(@PathVariable Integer pipelineId) throws Exception {
        logger.info("query from TD_MKT_PIPELINE_MONITOR where pipelineId = {}", pipelineId);
        PipelineMonitorDto pipelineMonitorDto = pipelineMonitorService.findMetricValueByPipelineId(pipelineId);
        return new ResponseEntity(pipelineMonitorDto, HttpStatus.OK);
    }

}
