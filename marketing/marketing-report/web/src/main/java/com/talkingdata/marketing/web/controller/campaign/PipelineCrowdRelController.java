package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.campaign.PipelineCrowdRel;
import com.talkingdata.marketing.core.page.campaign.PipelineCrowdRelPage;
import com.talkingdata.marketing.core.service.campaign.PipelineCrowdRelService;
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

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class PipelineCrowdRelController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(PipelineCrowdRelController.class);

    @Autowired
    private PipelineCrowdRelService pipelineCrowdRelService;

    @RequestMapping(value = "/pipelineCrowdRels", method = GET)
    @ResponseBody
    public List<PipelineCrowdRel> query(PipelineCrowdRelPage page) throws Exception {
        page.setOrderBy(PipelineCrowdRel.fieldToColumn(page.getOrderBy()));
        return pipelineCrowdRelService.queryByList(page);
    }

    @RequestMapping(value = "/pipelineCrowdRels/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(PipelineCrowdRelPage page) throws Exception {
        page.setOrderBy(PipelineCrowdRel.fieldToColumn(page.getOrderBy()));
        List<PipelineCrowdRel> rows = pipelineCrowdRelService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/pipelineCrowdRels/{id}", method = GET)
    @ResponseBody
    public PipelineCrowdRel find(@PathVariable Integer id) throws Exception {
        return pipelineCrowdRelService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/pipelineCrowdRels", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public PipelineCrowdRel create(@RequestBody PipelineCrowdRel pipelineCrowdRel) throws Exception {
        pipelineCrowdRelService.insert(pipelineCrowdRel);
        return pipelineCrowdRel;
    }

    @RequestMapping(value = "/pipelineCrowdRels", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody PipelineCrowdRel pipelineCrowdRel) throws Exception {
        pipelineCrowdRelService.updateByPrimaryKeySelective(pipelineCrowdRel);
    }

    @RequestMapping(value = "/pipelineCrowdRels/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        pipelineCrowdRelService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_PIPELINE_CROWD_REL where id = {}", id);
    }

}
