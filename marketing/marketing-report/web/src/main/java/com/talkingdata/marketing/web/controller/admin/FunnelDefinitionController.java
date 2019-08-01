package com.talkingdata.marketing.web.controller.admin;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

import java.util.List;
import java.util.Map;

import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.dto.CreateFunnelDto;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.web.constraint.MktValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.admin.FunnelDefinition;
import com.talkingdata.marketing.core.page.admin.FunnelDefinitionPage;
import com.talkingdata.marketing.core.service.admin.FunnelDefinitionService;

import javax.servlet.http.HttpServletRequest;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/admin")
public class FunnelDefinitionController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(FunnelDefinitionController.class);

    @Autowired
    private FunnelDefinitionService funnelDefinitionService;
    @Autowired
    private MktValidator mktValidator;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    @RequestMapping(value = "/funnelDefinitions", method = GET)
    @ResponseBody
    public List<FunnelDefinition> query(FunnelDefinitionPage page) throws Exception {
        page.setOrderBy(FunnelDefinition.fieldToColumn(page.getOrderBy()));
        return funnelDefinitionService.queryByList(page);
    }

    @RequestMapping(value = "/funnelDefinitions/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(FunnelDefinitionPage page) throws Exception {
        page.setOrderBy(FunnelDefinition.fieldToColumn(page.getOrderBy()));
        List<FunnelDefinition> rows = funnelDefinitionService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/funnelDefinitions/{id}", method = GET)
    @ResponseBody
    public CreateFunnelDto find(@PathVariable Integer id) throws Exception {
        return funnelDefinitionService.getFunnelDetail(id);
    }

    @RequestMapping(value = "/funnelDefinitions", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public FunnelDefinition create(@RequestBody FunnelDefinition funnelDefinition) throws Exception {
        funnelDefinitionService.insert(funnelDefinition);
        return funnelDefinition;
    }

    @RequestMapping(value = "/funnelDefinitions", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Integer update(@RequestBody CreateFunnelDto funnelDto, HttpServletRequest request) throws Exception {
        AssignmentUtil.setUpdateBasicInfo(funnelDto, request);
        if (funnelDto.getCampaignFunnelConfigId() == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FUNNEL_DEFINITION_CONFIG_ID_NOT_EXIST);
        }
        if (!mktValidator.validateUnique(funnelDto)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FUNNEL_DEFINITION_NAME_DUP);
        }
        return funnelDefinitionService.updateFunnel(funnelDto);
    }

    @RequestMapping(value = "/funnelDefinitions/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        funnelDefinitionService.deleteFunnelAndRelatedStep(id);
        logger.info("delete from TD_MKT_FUNNEL_DEFINITION where id = {}", id);
    }
    @RequestMapping(value = "/funnelDefinitions/createFunnel", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Integer createFunnel(@RequestBody CreateFunnelDto createFunnelDto, HttpServletRequest request) throws Exception {
        AssignmentUtil.setInfo(createFunnelDto, request);
        if (!mktValidator.validateUnique(createFunnelDto)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FUNNEL_DEFINITION_NAME_DUP);
        }
        return funnelDefinitionService.createFunnel(createFunnelDto);
    }
}
