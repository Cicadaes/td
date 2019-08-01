package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.entity.CrowdBlackList;
import td.enterprise.page.CrowdBlackListPage;
import td.enterprise.service.CrowdBlackListService;
import td.enterprise.service.ProjectService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.CrowdBlackListFilterVM;
import td.enterprise.web.vm.CrowdBlackListVM;
import td.enterprise.web.vm.CrowdBlackResultVM;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * CrowdBlackList 人群黑名单接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class CrowdBlackListController extends BaseController {

    public final static Logger logger = Logger.getLogger(CrowdBlackListController.class);

    private final String BASE_URL = "/api/crowdBlackLists";

    @Autowired
    private CrowdBlackListService crowdBlackListService;

    @Autowired
    private ProjectService projectService;

    /**
     * 获取查询条件下所有人群黑名单(支持分页)
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "返回查询条件下所有人群黑名单",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "返回查询条件下所有人群黑名单")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/crowdBlackLists", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<CrowdBlackListVM>> query(CrowdBlackListPage page) throws Exception {
        page.setTenantId(UserInfoUtil.getUser().getTenantId() + "");
        List<CrowdBlackListVM> rows = crowdBlackListService.query(page);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
        return new ResponseEntity<>(rows, headers, HttpStatus.OK);
    }

    /**
     * 新建人群黑名单
     *
     * @param crowdBlackList
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "新建人群黑名单",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "新建人群黑名单")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/crowdBlackLists", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<CrowdBlackList> create(@RequestBody CrowdBlackList crowdBlackList) throws Exception {
        crowdBlackList.setTenantId(UserInfoUtil.getUser().getTenantId() + "");
        CrowdBlackList crowdBlackListUser = crowdBlackListService.create(crowdBlackList);
        return ResponseEntity.created(new URI(BASE_URL))
                .headers(HeaderUtil.createAlert("A crowdBlackList is created with identifier " + crowdBlackListUser.getId(), crowdBlackListUser.getId() + ""))
                .body(crowdBlackListUser);
    }

    /**
     * 更新人群黑名单
     *
     * @param crowdBlackList
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "更新人群黑名单",
            httpMethod = "PUT",
            response = ResponseEntity.class,
            notes = "更新人群黑名单")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/crowdBlackLists/{crowdBlackListId}", method = RequestMethod.PUT, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<CrowdBlackList> update(@RequestBody CrowdBlackList crowdBlackList) throws Exception {
        crowdBlackListService.updateByPrimaryKeySelective(crowdBlackList);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert("A crowdBlackList is updated " + crowdBlackList.toString(), crowdBlackList.toString()))
                .body(crowdBlackList);
    }

    /**
     * 删除人群黑名单
     *
     * @param crowdBlackListId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "删除人群黑名单",
            httpMethod = "DELETE",
            response = ResponseEntity.class,
            notes = "删除人群黑名单")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/crowdBlackLists/{crowdBlackListId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Void> delete(@PathVariable String crowdBlackListId) throws Exception {
        CrowdBlackList crowdBlackList = crowdBlackListService.selectByPrimaryKey(crowdBlackListId);
        if (crowdBlackList == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        crowdBlackListService.deleteByPrimaryKey(crowdBlackListId);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("A crowdBlackList is deleted with identifier " + crowdBlackListId, crowdBlackListId)).build();
    }

    /**
     * 根据规则过滤人群黑名单
     *
     * @param days
     * @param times
     * @param projectId
     * @return
     */
    @ApiOperation(value = "根据规则过滤人群黑名单",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "根据规则过滤人群黑名单")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/crowdBlackLists/filterByRules", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<CrowdBlackResultVM>> filterByRules(int days, int times, int projectId) {
        List<CrowdBlackResultVM> list = crowdBlackListService.filterByRules(days, times, projectId);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    /**
     * 项目过滤最长停留时长
     *
     * @param maxDuration
     * @param projectId
     * @return
     */
    @ApiOperation(value = "项目过滤最长停留时长",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "项目过滤最长停留时长")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/crowdBlackLists/filterByMaxDuration", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Map<String, Object>>> filterByMaxDuration(int maxDuration, int projectId) {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            //更新配置信息
            projectService.updateMaxDurationConfig(maxDuration, projectId);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * 批量导入人群黑名单
     *
     * @param file
     * @param projectId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "批量导入人群黑名单",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "批量导入人群黑名单")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/blackMakList/batchImport", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<List<String>> batchImport(MultipartFile file, @RequestParam(value = "projectId") String projectId) throws Exception {
        List<String> errorMsg = crowdBlackListService.batchImport(file, projectId);
        return new ResponseEntity<>(errorMsg, HttpStatus.OK);
    }

    /**
     * 获取项目人群黑名单过滤规则
     *
     * @param projectId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取项目人群黑名单过滤规则",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "通过projectId获取人群黑名单过滤规则")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/crowdBlackLists/getProjectRules/{projectId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<CrowdBlackListFilterVM> getProjectRules(@PathVariable String projectId) throws Exception {
        CrowdBlackListFilterVM crowdBlackListVM = crowdBlackListService.getProjectRules(projectId);
        if (crowdBlackListVM == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(crowdBlackListVM, HttpStatus.OK);
        }
    }

}
