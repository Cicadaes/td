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
import td.enterprise.entity.StoreBlackList;
import td.enterprise.page.StoreBlackListPage;
import td.enterprise.service.StoreBlackListService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.util.UserInfoUtil;

import java.net.URI;
import java.net.URLEncoder;
import java.util.List;

/**
 * StoreBlackList 店铺黑名单接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class StoreBlackListController extends BaseController {

    private final String BASE_URL = "/api/storeBlackLists";

    public final static Logger logger = Logger.getLogger(StoreBlackListController.class);

    @Autowired
    private StoreBlackListService storeBlackListService;

    /**
     * 获取查询条件下所有店铺黑名单
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取查询条件下所有店铺黑名单",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取查询条件下所有店铺黑名单")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/storeBlackLists", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<StoreBlackList>> query(StoreBlackListPage page) throws Exception {
        page.setTenantId(UserInfoUtil.getUser().getTenantId() + "");
        List<StoreBlackList> rows = storeBlackListService.queryByList(page);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
        return new ResponseEntity<>(rows, headers, HttpStatus.OK);
    }

    /**
     * 新建店铺黑名单
     *
     * @param storeBlackList
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "新建店铺黑名单",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "新建店铺黑名单")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/storeBlackLists", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<StoreBlackList> create(@RequestBody StoreBlackList storeBlackList) throws Exception {
        StoreBlackListPage page = new StoreBlackListPage();
        page.setProjectId(storeBlackList.getProjectId());
        page.setStoreName(storeBlackList.getStoreName());
        page.setStatus(1);
        List<StoreBlackList> list = storeBlackListService.queryByList(page);

        if (list != null && list.size() > 0) {
            return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert("StoreBlackList", "UniqueFieldsExists", URLEncoder.encode("该项目下此店铺已存在", "UTF-8")))
                    .body(null);
        } else {

            storeBlackList = storeBlackListService.create(storeBlackList);
            return ResponseEntity.created(new URI(BASE_URL))
                    .headers(HeaderUtil.createAlert("A storeBlackList is created with identifier " + storeBlackList.getId(), storeBlackList.getId() + ""))
                    .body(storeBlackList);
        }

    }

    /**
     * 删除店铺黑名单
     *
     * @param storeBlackListId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "删除店铺黑名单",
            httpMethod = "DELETE",
            response = ResponseEntity.class,
            notes = "删除店铺黑名单")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/storeBlackLists/{storeBlackListId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Void> delete(@PathVariable String storeBlackListId) throws Exception {
        StoreBlackList storeBlackList = storeBlackListService.selectByPrimaryKey(storeBlackListId);
        if (storeBlackList == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        storeBlackListService.deleteByPrimaryKey(storeBlackListId);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("A storeBlackList is deleted with identifier " + storeBlackListId, storeBlackListId)).build();
    }

    /**
     * 批量导入店铺黑名单
     *
     * @param file
     * @param projectId
     * @param storeType
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "批量导入店铺黑名单",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "批量导入店铺黑名单")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/blackStoreList/batchImport", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<List<String>> batchImport(MultipartFile file, @RequestParam(value = "projectId") String projectId, @RequestParam(value = "storeType") int storeType) throws Exception {
        List<String> errorMsg = storeBlackListService.batchImport(file, projectId, storeType);
        return new ResponseEntity<>(errorMsg, HttpStatus.OK);
    }
}
