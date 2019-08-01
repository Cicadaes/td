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
import com.talkingdata.marketing.core.entity.admin.ChannelDefinition;
import com.talkingdata.marketing.core.page.admin.ChannelDefinitionPage;
import com.talkingdata.marketing.core.service.admin.ChannelDefinitionService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/admin")
public class ChannelDefinitionController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(ChannelDefinitionController.class);

    @Autowired
    private ChannelDefinitionService channelDefinitionService;

    @RequestMapping(value = "/channelDefinitions", method = GET)
    @ResponseBody
    public List<ChannelDefinition> query(ChannelDefinitionPage page) throws Exception {
        page.setOrderBy(ChannelDefinition.fieldToColumn(page.getOrderBy()));
        return channelDefinitionService.queryByList(page);
    }

    @RequestMapping(value = "/channelDefinitions/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(ChannelDefinitionPage page) throws Exception {
        page.setOrderBy(ChannelDefinition.fieldToColumn(page.getOrderBy()));
        List<ChannelDefinition> rows = channelDefinitionService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/channelDefinitions/{id}", method = GET)
    @ResponseBody
    public ChannelDefinition find(@PathVariable Integer id) throws Exception {
        return channelDefinitionService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/channelDefinitions", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ChannelDefinition create(@RequestBody ChannelDefinition channelDefinition) throws Exception {
        channelDefinitionService.insert(channelDefinition);
        return channelDefinition;
    }

    @RequestMapping(value = "/channelDefinitions", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody ChannelDefinition channelDefinition) throws Exception {
        channelDefinitionService.updateByPrimaryKeySelective(channelDefinition);
    }

    @RequestMapping(value = "/channelDefinitions/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        channelDefinitionService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_CHANNEL_DEFINITION where id = {}", id);
    }

}
