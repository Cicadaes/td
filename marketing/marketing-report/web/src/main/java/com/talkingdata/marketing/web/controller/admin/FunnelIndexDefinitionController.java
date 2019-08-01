package com.talkingdata.marketing.web.controller.admin;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.annotation.EnableAssignmentTime;
import com.talkingdata.marketing.core.constant.SessionConstants;
import com.talkingdata.marketing.core.entity.admin.FunnelIndexDefinition;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.admin.FunnelIndexDefinitionPage;
import com.talkingdata.marketing.core.service.admin.FunnelIndexDefinitionService;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.tendcloud.enterprise.um.umic.entity.Tenant;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
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
public class FunnelIndexDefinitionController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(FunnelIndexDefinitionController.class);

    @Autowired
    private FunnelIndexDefinitionService funnelIndexDefinitionService;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    @RequestMapping(value = "/funnelIndexDefinitions", method = GET)
    @ResponseBody
    public List<FunnelIndexDefinition> query(FunnelIndexDefinitionPage page, HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        page.setTenantId(tenant.getCaCode());
        page.setOrderBy(FunnelIndexDefinition.fieldToColumn(page.getOrderBy()));
        return funnelIndexDefinitionService.queryByList(page);
    }

    @RequestMapping(value = "/funnelIndexDefinitions/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(FunnelIndexDefinitionPage page, HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        page.setTenantId(tenant.getCaCode());
        page.setOrderBy(FunnelIndexDefinition.fieldToColumn(page.getOrderBy()));
        List<FunnelIndexDefinition> rows = funnelIndexDefinitionService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/funnelIndexDefinitions/{id}", method = GET)
    @ResponseBody
    public FunnelIndexDefinition find(@PathVariable Integer id) throws Exception {
        return funnelIndexDefinitionService.selectByPrimaryKey(id);
    }

    @EnableAssignmentTime
    @RequestMapping(value = "/funnelIndexDefinitions", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public FunnelIndexDefinition create(@RequestBody FunnelIndexDefinition funnelIndexDefinition, HttpServletRequest request) throws Exception {
        AssignmentUtil.setInfo(funnelIndexDefinition, request);
        funnelIndexDefinitionService.insert(funnelIndexDefinition);
        return funnelIndexDefinition;
    }

    @RequestMapping(value = "/funnelIndexDefinitions", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody FunnelIndexDefinition funnelIndexDefinition, HttpServletRequest request) throws Exception {
        AssignmentUtil.setUpdateBasicInfo(funnelIndexDefinition, request);
        funnelIndexDefinitionService.updateByPrimaryKeySelective(funnelIndexDefinition);
    }

    @RequestMapping(value = "/funnelIndexDefinitions/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        funnelIndexDefinitionService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_FUNNEL_INDEX_DEFINITION where id = {}", id);
    }

    @RequestMapping(value = "/funnelIndexDefinitions/show/new", method = GET)
    @ResponseBody
    public List<FunnelIndexDefinition> findNewDefinitions(HttpServletRequest request) throws Exception {
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        return funnelIndexDefinitionService.findNewDefinitions(tenant.getCaCode());
    }

    @ApiOperation(value = "检查漏斗事件状态", notes = "需要对漏斗事件定义进行改变操作前调用此接口")
    @ApiImplicitParams({
            @ApiImplicitParam(name ="eventId", value = "漏斗事件KEY", required = true, dataType = "string", paramType = "path")
    })
    @RequestMapping(value = "/funnelIndexDefinitions/status/{eventId}", method = GET)
    @ResponseBody
    public Boolean checkStatus(HttpServletRequest request, @PathVariable String eventId) throws Exception {
        if (StringUtils.isBlank(eventId)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
        }
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        try {
            return funnelIndexDefinitionService.changeAble(tenant.getCaCode(), eventId);
        } catch (Exception e) {
            logger.error("检查漏斗事件状态发生异常发生异常：{}", e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
        }
    }
}
