package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.campaign.AppConfig;
import com.talkingdata.marketing.core.entity.dto.AppConfDto;
import com.talkingdata.marketing.core.entity.thirdmodel.push.AppConfReq;
import com.talkingdata.marketing.core.entity.thirdmodel.push.UploadPemResp;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.middleware.AppConfApi;
import com.talkingdata.marketing.core.page.campaign.AppConfigPage;
import com.talkingdata.marketing.core.service.campaign.AppConfigService;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.web.constraint.MktValidator;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping("/campaign")
public class AppConfigController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(AppConfigController.class);

    @Autowired
    private AppConfigService appConfigService;
    @Autowired
    private MktValidator mktValidator;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    @RequestMapping(value = "/appConfigs", method = GET)
    @ResponseBody
    public List<AppConfig> query(AppConfigPage page) throws Exception {
        page.setOrderBy(AppConfig.fieldToColumn(page.getOrderBy()));
        return appConfigService.queryByList(page);
    }

    @RequestMapping(value = "/appConfigs/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(AppConfigPage page) throws Exception {
        page.setOrderBy(AppConfig.fieldToColumn(page.getOrderBy()));
        List<AppConfig> rows = appConfigService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/appConfigs/{id}", method = GET)
    @ResponseBody
    public AppConfig find(@PathVariable Integer id) throws Exception {
        return appConfigService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/appConfigs", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public AppConfig create(@RequestBody AppConfig appConfig, HttpServletRequest request) throws Exception {
        AssignmentUtil.setInfo(appConfig,request);
        Date now = new Date();
        appConfig.setCreateTime(now);
        appConfig.setUpdateTime(now);
        if (!mktValidator.validateUnique(appConfig)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.APPCONFIG_APPID_OR_PID_DUP);
        }
        appConfigService.save(appConfig);
        return appConfig;
    }

    @RequestMapping(value = "/appConfigs", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody AppConfig appConfig, HttpServletRequest request) throws Exception {
        AssignmentUtil.setUpdateBasicInfo(appConfig,request);
        appConfig.setUpdateTime(new Date());
        if (!mktValidator.validateUnique(appConfig)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.APPCONFIG_APPID_OR_PID_DUP);
        }
        appConfigService.updateByPrimaryKeySelective(appConfig);
    }

    @RequestMapping(value = "/appConfigs/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        appConfigService.deleteByPrimaryKey(id);
        logger.info("delete from TD_MKT_APP_CONFIG where id = {}", id);
    }

    /**
     * curl http://localhost:1111/marketing-api/campaign/appConfigs/list
     */
    @RequestMapping(value = "/appConfigs/list", method = GET)
    @ResponseBody
    public List<AppConfig> getAppList() {
        return appConfigService.getList();
    }

    /**
     * curl http://localhost:1111/marketing-api/campaign/appConfs/pem/upload/A490FA2DB5FCA9012000233A3006235A/0
     * -F "file=@/home/zmy/newsda/Certificates.p12" -F "pwd=123"
     */
    @ApiOperation(value = "上传app ios证书", notes = "调用gateway上传证书接口")
    @ApiImplicitParam(name = "pwd", value = "pwd", required = true, dataType = "String")
    @RequestMapping(value = "/appConfs/pem/upload/{appId}/{prod}", method = RequestMethod.POST)
    public ResponseEntity uploadPem(@RequestParam("file") MultipartFile file, @RequestParam String pwd, @PathVariable String appId, @PathVariable int prod) throws Exception {
        UploadPemResp uploadPemResp = appConfigService.uploadPem(file, pwd, appId, prod);
        return new ResponseEntity(uploadPemResp, HttpStatus.OK);
    }

    /**
     * curl http://localhost:1111/marketing-api/campaign/appConfs/A490FA2DB5FCA9012000233A3006235A/3 -X PATCH
     */
    @ApiOperation(value = "极光和个推配置清空接口", notes = "极光和个推配置清空接口")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "app", value = "app", required = true, dataType = "String"),
            @ApiImplicitParam(name = "channel", value = "channel,3:getui;4:jpush", required = true, dataType = "Integer"),
    })
    @RequestMapping(value = "/appConfs/{appId}/{channel}", method = RequestMethod.PATCH)
    public ResponseEntity emptyGetuiJpush(@PathVariable String appId, @PathVariable Integer channel) throws Exception {
        appConfigService.emptyGetuiJpushConfig(appId, channel);
        return new ResponseEntity("success", HttpStatus.OK);
    }

    /**
     * curl http://localhost:1111/marketing-api/campaign/appConfs/thirdchannel/config
     * -H "Content-Type: application/json" -X PATCH -d "{\"app\":\"A490FA2DB5FCA9012000233A3006235A\",
     * \"pid\":3006235,\"source\":\"push\",\"channel\":4,\"thirdApp\":\"281c1dfbab3c0d95f7d1b5c9\",
     * \"thirdKey\":\"281c1dfbab3c0d95f7d1b5c9\",\"thirdSecret\":\"a43ca9db83ee90f708b47940\"}"
     */
    @ApiOperation(value = "更新app", notes = "第三方通道配置")
    @ApiImplicitParam(name = "req", value = "appConf", required = true, dataType = "AppConfReq")
    @RequestMapping(value = "/appConfs/thirdchannel/config", method = RequestMethod.PATCH, consumes = APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity thirdChannelConfigure(@RequestBody AppConfReq req) {
        String resp = appConfigService.thirdChannelConfigure(req);
        return new ResponseEntity(resp, HttpStatus.OK);
    }

    /**
     * http://localhost:1111/marketing-api/campaign/appConfigs/appId/5F450A0F299E4B322000233A3006321A
     */
    @RequestMapping(value = "/appConfigs/appId/{appId}", method = GET)
    @ResponseBody
    public ResponseEntity find(@PathVariable String appId) throws Exception {
        AppConfDto appConf = appConfigService.selectByAppId(appId);
        return new ResponseEntity(appConf,HttpStatus.OK);
    }
}
