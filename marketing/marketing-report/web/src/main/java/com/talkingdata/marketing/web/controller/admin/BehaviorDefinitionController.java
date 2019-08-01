package com.talkingdata.marketing.web.controller.admin;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.talkingdata.marketing.core.constant.SessionConstants;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.campaign.extend.BehaviorDefinitionExtendPage;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.web.constraint.MktValidator;
import com.tendcloud.enterprise.um.umic.entity.Tenant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.admin.BehaviorDefinition;
import com.talkingdata.marketing.core.page.admin.BehaviorDefinitionPage;
import com.talkingdata.marketing.core.service.admin.BehaviorDefinitionService;

import javax.servlet.http.HttpServletRequest;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/admin")
public class BehaviorDefinitionController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(BehaviorDefinitionController.class);

    @Autowired
    private BehaviorDefinitionService behaviorDefinitionService;
    @Autowired
    private MktValidator mktValidator;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    @RequestMapping(value = "/behaviorDefinitions", method = GET)
    @ResponseBody
    public List<BehaviorDefinitionExtendPage> query(BehaviorDefinitionPage page, HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        page.setOrderBy(BehaviorDefinition.fieldToColumn(page.getOrderBy()));
        page.setTenantId(tenant.getCaCode());
        return behaviorDefinitionService.queryPageByList(page);
    }

    @RequestMapping(value = "/behaviorDefinitions/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(BehaviorDefinitionPage page) throws Exception {
        page.setOrderBy(BehaviorDefinition.fieldToColumn(page.getOrderBy()));
        List<BehaviorDefinitionExtendPage> rows = behaviorDefinitionService.queryPageByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/behaviorDefinitions/{id}", method = GET)
    @ResponseBody
    public ResponseEntity find(@PathVariable Integer id) throws Exception {
        BehaviorDefinitionExtendPage definitionExtendPage = behaviorDefinitionService.getByKey(id);
        return new ResponseEntity(definitionExtendPage,HttpStatus.OK);
    }

    @RequestMapping(value = "/behaviorDefinitions", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public BehaviorDefinition create(@RequestBody BehaviorDefinitionExtendPage behaviorDefinitionExtendPage, HttpServletRequest request) throws Exception {
        AssignmentUtil.setInfo(behaviorDefinitionExtendPage, request);
        behaviorDefinitionExtendPage.setCreateTime(new Date());
        if (!mktValidator.validateUnique(behaviorDefinitionExtendPage)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.BEHAVIOR_DEFINITION_NAME_DUP);
        }
        BehaviorDefinition behaviorDefinition = behaviorDefinitionService.save(behaviorDefinitionExtendPage);
        return behaviorDefinition;
    }

    @RequestMapping(value = "/behaviorDefinitions", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody BehaviorDefinitionExtendPage behaviorDefinitionExtendPage, HttpServletRequest request) throws Exception {
        AssignmentUtil.setUpdateBasicInfo(behaviorDefinitionExtendPage,request);
        if (!mktValidator.validateUnique(behaviorDefinitionExtendPage)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.BEHAVIOR_DEFINITION_NAME_DUP);
        }
        behaviorDefinitionService.updateByBehaviorDefinitionExtendPage(behaviorDefinitionExtendPage);
    }

    @RequestMapping(value = "/behaviorDefinitions/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        behaviorDefinitionService.delete(id);
        logger.info("delete from TD_MKT_BEHAVIOR_DEFINITION where id = {}", id);
    }

}
