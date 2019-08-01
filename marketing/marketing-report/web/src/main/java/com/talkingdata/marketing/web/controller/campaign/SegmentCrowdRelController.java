package com.talkingdata.marketing.web.controller.campaign;

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
import com.talkingdata.marketing.core.entity.campaign.SegmentCrowdRel;
import com.talkingdata.marketing.core.page.campaign.SegmentCrowdRelPage;
import com.talkingdata.marketing.core.service.campaign.SegmentCrowdRelService;

/**
 * @author xiaoming.kang
 * 2018-03-05
 */
@Controller
@RequestMapping("/campaign")
public class SegmentCrowdRelController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(SegmentCrowdRelController.class);

    @Autowired
    private SegmentCrowdRelService segmentCrowdRelService;

    @RequestMapping(value = "/segmentCrowdRels", method = GET)
    @ResponseBody
    public List<SegmentCrowdRel> query(SegmentCrowdRelPage page) throws Exception {
        page.setOrderBy(SegmentCrowdRel.fieldToColumn(page.getOrderBy()));
        return segmentCrowdRelService.queryByList(page);
    }

    @RequestMapping(value = "/segmentCrowdRels/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(SegmentCrowdRelPage page) throws Exception {
        page.setOrderBy(SegmentCrowdRel.fieldToColumn(page.getOrderBy()));
        List<SegmentCrowdRel> rows = segmentCrowdRelService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/segmentCrowdRels/{id}", method = GET)
    @ResponseBody
    public SegmentCrowdRel find(@PathVariable Integer id) throws Exception {
        return segmentCrowdRelService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/segmentCrowdRels", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public SegmentCrowdRel create(@RequestBody SegmentCrowdRel segmentCrowdRel) throws Exception {
        segmentCrowdRelService.insert(segmentCrowdRel);
        return segmentCrowdRel;
    }

    @RequestMapping(value = "/segmentCrowdRels", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody SegmentCrowdRel segmentCrowdRel) throws Exception {
        segmentCrowdRelService.updateByPrimaryKeySelective(segmentCrowdRel);
    }

    @RequestMapping(value = "/segmentCrowdRels/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        segmentCrowdRelService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_SEGMENT_CROWD_REL where id = {}", id);
    }

}
