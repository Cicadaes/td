package com.talkingdata.marketing.web.controller.admin;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.annotation.EnableAssignmentTime;
import com.talkingdata.marketing.core.constant.SessionConstants;
import com.talkingdata.marketing.core.entity.admin.EffectIndexDefinition;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.admin.EffectIndexDefinitionPage;
import com.talkingdata.marketing.core.service.admin.EffectIndexDefinitionService;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.tendcloud.enterprise.um.umic.entity.Tenant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/admin")
public class EffectIndexDefinitionController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(EffectIndexDefinitionController.class);

    @Autowired
    private EffectIndexDefinitionService effectIndexDefinitionService;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    @RequestMapping(value = "/effectIndexDefinitions", method = GET)
    @ResponseBody
    public List<EffectIndexDefinition> query(EffectIndexDefinitionPage page, HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        page.setTenantId(tenant.getCaCode());
        page.setOrderBy(EffectIndexDefinition.fieldToColumn(page.getOrderBy()));
        return effectIndexDefinitionService.queryByList(page);
    }

    @RequestMapping(value = "/effectIndexDefinitions/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(EffectIndexDefinitionPage page, HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        page.setTenantId(tenant.getCaCode());
        page.setOrderBy(EffectIndexDefinition.fieldToColumn(page.getOrderBy()));
        List<EffectIndexDefinition> rows = effectIndexDefinitionService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/effectIndexDefinitions/{id}", method = GET)
    @ResponseBody
    public EffectIndexDefinition find(@PathVariable Integer id) throws Exception {
        return effectIndexDefinitionService.selectByPrimaryKey(id);
    }

    @EnableAssignmentTime
    @RequestMapping(value = "/effectIndexDefinitions", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public EffectIndexDefinition create(@RequestBody EffectIndexDefinition effectIndexDefinition, HttpServletRequest request) throws Exception {
        AssignmentUtil.setInfo(effectIndexDefinition, request);
        effectIndexDefinition.setCreateTime(new Date());
        effectIndexDefinitionService.insert(effectIndexDefinition);
        return effectIndexDefinition;
    }

    @RequestMapping(value = "/effectIndexDefinitions", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody EffectIndexDefinition effectIndexDefinition, HttpServletRequest request) throws Exception {
        AssignmentUtil.setUpdateBasicInfo(effectIndexDefinition, request);
        effectIndexDefinitionService.updateByPrimaryKeySelective(effectIndexDefinition);
    }

    @RequestMapping(value = "/effectIndexDefinitions/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        effectIndexDefinitionService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_EFFECT_INDEX_DEFINITION where id = {}", id);
    }

    @RequestMapping(value = "/effectIndexDefinitions/show/new", method = GET)
    @ResponseBody
    public List<EffectIndexDefinition> findNewDefinitions(HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        return effectIndexDefinitionService.findNewDefinitions(tenant.getCaCode());
    }

    @RequestMapping(value = "/effectIndexDefinitions/query/own", method = GET)
    @ResponseBody
    public Map<Integer, List<EffectIndexDefinition>> queryOwnDefinitions(HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        if (tenant == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_NOT_EXIST);
        }
        return effectIndexDefinitionService.getOwnDefinitions(tenant.getCaCode());
    }

}
