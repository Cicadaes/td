package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import td.enterprise.entity.ReceiveConfig;
import td.enterprise.page.ReceiveConfigPage;
import td.enterprise.service.ReceiveConfigService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.util.UserInfoUtil;

import java.net.URI;
import java.util.List;

/**
 * ReceiveConfig 接收配置接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class ReceiveConfigController extends BaseController {

    private final String BASE_URL = "/api/receiveConfigs";

    public final static Logger logger = Logger.getLogger(ReceiveConfigController.class);

    @Autowired
    private ReceiveConfigService receiveConfigService;

    /**
     * 获取查询条件下所有接收配置
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取查询条件下所有接收配置",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取查询条件下所有接收配置")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/receiveConfigs", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<ReceiveConfig>> query(ReceiveConfigPage page) throws Exception {
        page.setUniqueId(UserInfoUtil.getUser().getTenantId() + "");
        List<ReceiveConfig> rows = receiveConfigService.queryByList(page);
        return new ResponseEntity<>(rows, PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL), HttpStatus.OK);
    }

    /**
     * 新建接收配置
     *
     * @param receiveConfig
     * @return
     */
    @ApiOperation(value = "新建接收配置",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "新建接收配置")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/receiveConfigs", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<ReceiveConfig> create(@RequestBody ReceiveConfig receiveConfig) throws Exception {
        receiveConfig.setUniqueId(UserInfoUtil.getUser().getTenantId() + "");
        receiveConfig = receiveConfigService.create(receiveConfig);
        return ResponseEntity.created(new URI(BASE_URL))
                .headers(HeaderUtil.createAlert("A receiveConfig is created with identifier "
                        + receiveConfig.getId(), receiveConfig.getId() + ""))
                .body(receiveConfig);
    }

    /**
     * 获取的单个接收配置
     *
     * @param receiveConfigId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取的单个接收配置",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取的单个接收配置")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/receiveConfigs/{receiveConfigId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ReceiveConfig> find(@PathVariable String receiveConfigId) throws Exception {
        ReceiveConfig receiveConfig = receiveConfigService.selectByPrimaryKey(receiveConfigId);
        if (receiveConfig == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(receiveConfig, HttpStatus.OK);
        }
    }

    /**
     * 更新接收配置
     *
     * @param receiveConfig
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "更新接收配置",
            httpMethod = "PUT",
            response = ResponseEntity.class,
            notes = "更新接收配置")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/receiveConfigs/{receiveConfigId}", method = RequestMethod.PUT, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<ReceiveConfig> update(@RequestBody ReceiveConfig receiveConfig) throws Exception {
        receiveConfigService.updateByPrimaryKeySelective(receiveConfig);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert("A receiveConfig is updated "
                        + receiveConfig.toString(), receiveConfig.toString()))
                .body(receiveConfig);
    }

    /**
     * 删除接收配置
     *
     * @param receiveConfigId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "删除接收配置",
            httpMethod = "DELETE",
            response = ResponseEntity.class,
            notes = "删除接收配置")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/receiveConfigs/{receiveConfigId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Void> delete(@PathVariable String receiveConfigId) throws Exception {
        ReceiveConfig receiveConfig = receiveConfigService.selectByPrimaryKey(receiveConfigId);
        if (receiveConfig == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        receiveConfigService.deleteByPrimaryKey(receiveConfigId);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("A receiveConfig is deleted with identifier "
                + receiveConfigId, receiveConfigId)).build();
    }
}
