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
import com.talkingdata.marketing.core.entity.admin.SysJobConfig;
import com.talkingdata.marketing.core.page.admin.SysJobConfigPage;
import com.talkingdata.marketing.core.service.admin.SysJobConfigService;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/admin")
public class SysJobConfigController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(SysJobConfigController.class);

    @Autowired
    private SysJobConfigService sysJobConfigService;

    @RequestMapping(value = "/sysJobConfigs", method = GET)
    @ResponseBody
    public List<SysJobConfig> query(SysJobConfigPage page) throws Exception {
        page.setOrderBy(SysJobConfig.fieldToColumn(page.getOrderBy()));
        return sysJobConfigService.queryByList(page);
    }

    @RequestMapping(value = "/sysJobConfigs/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(SysJobConfigPage page) throws Exception {
        page.setOrderBy(SysJobConfig.fieldToColumn(page.getOrderBy()));
        List<SysJobConfig> rows = sysJobConfigService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/sysJobConfigs/{id}", method = GET)
    @ResponseBody
    public SysJobConfig find(@PathVariable Integer id) throws Exception {
        return sysJobConfigService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/sysJobConfigs", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public SysJobConfig create(@RequestBody SysJobConfig sysJobConfig) throws Exception {
        sysJobConfigService.insert(sysJobConfig);
        return sysJobConfig;
    }

    @RequestMapping(value = "/sysJobConfigs", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody SysJobConfig sysJobConfig) throws Exception {
        sysJobConfigService.updateByPrimaryKeySelective(sysJobConfig);
    }

    @RequestMapping(value = "/sysJobConfigs/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        sysJobConfigService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_SYS_JOB_CONFIG where id = {}", id);
    }

}
