package td.enterprise.web.rest;

import com.tendcloud.enterprise.um.umic.entity.User;
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
import td.enterprise.entity.RoomCategory;
import td.enterprise.page.RoomCategoryPage;
import td.enterprise.service.RoomCategoryService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.util.UserInfoUtil;

import java.net.URI;
import java.util.List;

/**
 * RoomCategory 房间分类接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class RoomCategoryController extends BaseController {

    private final String BASE_URL = "/api/roomCategories";

    public final static Logger logger = Logger.getLogger(RoomCategoryController.class);

    @Autowired
    private RoomCategoryService roomCategoryService;

    /**
     * 获取查询条件下所有房间分类
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取查询条件下所有房间分类",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取查询条件下所有房间分类")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/roomCategories", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<RoomCategory>> query(RoomCategoryPage page) throws Exception {
        page.setTenantId(UserInfoUtil.getUser().getTenantId() + "");
        page.setPageEnabled(false);
        List<RoomCategory> rows = roomCategoryService.queryByList(page);
        return new ResponseEntity<>(rows, PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL), HttpStatus.OK);
    }

    /**
     * 新建房间分类
     *
     * @param roomCategory
     * @return
     */
    @ApiOperation(value = "新建房间分类",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "新建房间分类")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/roomCategories", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<RoomCategory> create(@RequestBody RoomCategory roomCategory) throws Exception {
        User user = UserInfoUtil.getUser();
        roomCategory.setCreateBy(user.getUmid());
        roomCategory.setTenantId(UserInfoUtil.getCurrentUserTenantId());
        roomCategory.setCreator(user.getUmid());
        roomCategory.setCode(UserInfoUtil.getCurrentUserTenantId() + "_" + roomCategory.getName());
        roomCategoryService.insert(roomCategory);
        return ResponseEntity.created(new URI(BASE_URL))
                .headers(HeaderUtil.createAlert("A roomCategory is created with identifier "
                        + roomCategory.getId(), roomCategory.getId() + ""))
                .body(roomCategory);
    }
}
