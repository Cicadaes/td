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
import td.enterprise.entity.KmeansCrowd;
import td.enterprise.service.KmeansCrowdService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.UserInfoUtil;

import java.net.URI;

/**
 * KmeansCrowd 聚类客群参数接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class KmeansCrowdController extends BaseController {

    private final String BASE_URL = "/api/kmeansCrowds";

    public final static Logger logger = Logger.getLogger(KmeansCrowdController.class);

    @Autowired
    private KmeansCrowdService kmeansCrowdService;

    /**
     * 新建聚类客群参数
     *
     * @param kmeansCrowd
     * @return
     */
    @ApiOperation(value = "新建聚类客群参数",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "新建聚类客群参数")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/kmeansCrowds", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<KmeansCrowd> create(@RequestBody KmeansCrowd kmeansCrowd) throws Exception {
        kmeansCrowd.setTenantId(UserInfoUtil.getUser().getTenantId());
        kmeansCrowdService.create(kmeansCrowd);
        return ResponseEntity.created(new URI(BASE_URL))
                .headers(HeaderUtil.createAlert("A kmeansCrowd is created with identifier " + kmeansCrowd.getId(), kmeansCrowd.getId() + ""))
                .body(kmeansCrowd);
    }

    /**
     * 返回获取的单个聚类客群参数
     *
     * @param kmeansCrowdId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "返回获取的单个聚类客群参数",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "返回获取的单个聚类客群参数")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/kmeansCrowds/{kmeansCrowdId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<KmeansCrowd> find(@PathVariable String kmeansCrowdId) throws Exception {
        KmeansCrowd kmeansCrowd = kmeansCrowdService.selectByPrimaryKey(kmeansCrowdId);
        if (kmeansCrowd == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(kmeansCrowd, HttpStatus.OK);
        }
    }

    /**
     * 取消azkaban任务
     *
     * @param kmeansCrowdId
     * @return
     */
    @ApiOperation(value = "取消azkaban任务",
            httpMethod = "DELETE",
            response = ResponseEntity.class,
            notes = "取消azkaban任务")
    @ApiResponses({
            @ApiResponse(code = 200, message = "取消成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/kmeansCrowds/cancelAzkabanTask/{kmeansCrowdId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Boolean> cancelAzkabanTask(@PathVariable String kmeansCrowdId) throws Exception {
        Boolean result = kmeansCrowdService.cancelAzkabanTask(kmeansCrowdId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
