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
import td.enterprise.entity.TargetManagement;
import td.enterprise.page.TargetManagementPage;
import td.enterprise.service.TargetManagementService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.util.UserInfoUtil;

import java.net.URI;
import java.util.List;

/**
 * TargetManagement 目标管理接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class TargetManagementController extends BaseController {

    private final String BASE_URL = "/api/targetManagements";

    public final static Logger logger = Logger.getLogger(TargetManagementController.class);

    @Autowired
    private TargetManagementService targetManagementService;


//==============================================================================================================================
    /**
     * page 需要带的参数   【tenantId】【 projectId】                    【是否为历史】
     */
    /**
     * 获取查询条件下所有目标管理
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取查询条件下所有目标管理",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取查询条件下所有目标管理")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/targetManagements", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<TargetManagement>> query(TargetManagementPage page) throws Exception {
        page.setTenantId(UserInfoUtil.getUser().getTenantId() + "");
        List<TargetManagement> rows = targetManagementService.query(page);
        return new ResponseEntity<>(rows, PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL), HttpStatus.OK);
    }

//==============================================================================================================================

    /**
     * 新建目标管理
     *
     * @param targetManagement
     * @return
     */
    @ApiOperation(value = "新建目标管理",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "新建目标管理")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/targetManagements", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<TargetManagement> create(@RequestBody TargetManagement targetManagement) throws Exception {
        targetManagement.setTenantId(UserInfoUtil.getUser().getTenantId() + "");
        targetManagement = targetManagementService.create(targetManagement);
        return ResponseEntity.created(new URI(BASE_URL))
                .headers(HeaderUtil.createAlert("A targetManagement is created with identifier "
                        + targetManagement.getId(), targetManagement.getId() + ""))
                .body(targetManagement);
    }
//==============================================================================================================================

    /**
     * 更新方法，需要额外的参数：是否为置顶 	StickyPost
     *
     * @param targetManagement
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "更新方法，需要额外的参数：是否为置顶 \tStickyPost",
            httpMethod = "PUT",
            response = ResponseEntity.class,
            notes = "更新方法，需要额外的参数：是否为置顶 \tStickyPost")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/targetManagements/{targetManagementId}", method = RequestMethod.PUT, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<TargetManagement> update(@RequestBody TargetManagement targetManagement) throws Exception {
        targetManagement = targetManagementService.update(targetManagement);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert("A targetManagement is updated "
                        + targetManagement.toString(), targetManagement.toString()))
                .body(targetManagement);
    }
//==============================================================================================================================

    /**
     * 停止按钮触发的方法，参数TargetManagement
     *
     * @param targetManagement
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "停止按钮触发的方法，参数TargetManagement",
            httpMethod = "PUT",
            response = ResponseEntity.class,
            notes = "停止按钮触发的方法，参数TargetManagement")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/targetManagementsStop", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<TargetManagement> stop(@RequestBody TargetManagement targetManagement) throws Exception {
        targetManagement = targetManagementService.stop(targetManagement);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert("A targetManagement is stopped "
                        + targetManagement.toString(), targetManagement.toString()))
                .body(targetManagement);
    }
//==============================================================================================================================

    /**
     * 删除目标管理
     *
     * @param targetManagementId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "删除目标管理",
            httpMethod = "DELETE",
            response = ResponseEntity.class,
            notes = "删除目标管理")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/targetManagements/{targetManagementId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Void> delete(@PathVariable String targetManagementId) throws Exception {
        TargetManagement targetManagement = targetManagementService.selectByPrimaryKey(targetManagementId);
        if (targetManagement == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        targetManagementService.deleteByPrimaryKey(targetManagementId);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("A targetManagement is deleted with identifier "
                + targetManagementId, targetManagementId)).build();
    }
}
