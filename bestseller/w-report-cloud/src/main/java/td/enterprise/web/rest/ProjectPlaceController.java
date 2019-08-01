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
import td.enterprise.entity.ProjectPlace;
import td.enterprise.page.ProjectPlacePage;
import td.enterprise.service.ProjectPlaceService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.util.UserInfoUtil;

import java.net.URI;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

/**
 * ProjectPlace 项目场地管理接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class ProjectPlaceController extends BaseController {

    private final String BASE_URL = "/api/projectPlaces";

    public final static Logger logger = Logger.getLogger(ProjectPlaceController.class);

    @Autowired
    private ProjectPlaceService projectPlaceService;

    /**
     * 获取查询条件下所有项目场地
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取查询条件下所有项目场地",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取查询条件下所有项目场地")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectPlaces", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<ProjectPlace>> query(ProjectPlacePage page) throws Exception {
        //支持模糊查询
        page.setTenantId(td.enterprise.web.util.UserInfoUtil.getUser().getTenantId() + "");
        List<ProjectPlace> rows = projectPlaceService.quickSearchByList(page);
        return new ResponseEntity<>(rows, PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL), HttpStatus.OK);
    }

    /**
     * 新建项目场地
     *
     * @param projectPlace
     * @return
     */
    @ApiOperation(value = "新建项目场地",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "新建项目场地")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectPlaces", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<ProjectPlace> create(@RequestBody ProjectPlace projectPlace) throws Exception {
        User user = UserInfoUtil.getUser();
        ProjectPlace pp = projectPlaceService.createProjectPlaceWithoutFile(projectPlace, user.getUmid(), UserInfoUtil.getCurrentUserTenantId());
        if (pp == null) {
            return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert("projectPlace", "exists", URLEncoder.encode("场地已经存在", "UTF-8")))
                    .body(null);
        } else {
            return ResponseEntity.created(new URI(BASE_URL))
                    .headers(HeaderUtil.createAlert("A projectPlace is created with identifier "
                            + pp.getId(), pp.getId() + ""))
                    .body(pp);
        }
    }

    /**
     * 新建项目场地
     *
     * @param page
     * @return
     */
    @ApiOperation(value = "新建项目场地",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "新建项目场地")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectPlaces", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<ProjectPlace> create(@RequestBody ProjectPlacePage page) throws Exception {
        ProjectPlace projectPlace = projectPlaceService.create(page);
        return ResponseEntity.created(new URI(BASE_URL))
                .headers(HeaderUtil.createAlert("A projectPlace is created with identifier "
                        + projectPlace.getId(), projectPlace.getId() + ""))
                .body(projectPlace);
    }

    /**
     * 更新项目场地排序
     *
     * @param ids
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "更新项目场地排序",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "更新项目场地排序")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectPlaces/updateOrderNumber", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateOrderNumber(@RequestBody String[] ids) {
        Map<String, Object> map = projectPlaceService.updateOrderNumber(ids);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert(String.format("orderNumbes are updated "
                        + map.toString()), map.toString()))
                .body(map);
    }

    /**
     * 更新项目场地
     *
     * @param projectPlace
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "更新项目场地",
            httpMethod = "PUT",
            response = ResponseEntity.class,
            notes = "更新项目场地")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectPlaces/{projectPlaceId}", method = RequestMethod.PUT, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<ProjectPlace> update(@RequestBody ProjectPlace projectPlace) throws Exception {
        projectPlace = projectPlaceService.updateProjectPlace(projectPlace, null);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert("A projectPlace is updated "
                        + projectPlace.toString(), projectPlace.toString()))
                .body(projectPlace);
    }

    /**
     * 删除项目场地
     *
     * @param projectPlaceId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "删除项目场地",
            httpMethod = "DELETE",
            response = ResponseEntity.class,
            notes = "删除项目场地")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectPlaces/{projectPlaceId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Void> delete(@PathVariable String projectPlaceId) throws Exception {
        ProjectPlace projectPlace = projectPlaceService.selectByPrimaryKey(projectPlaceId);
        if (projectPlace == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        projectPlaceService.delete(projectPlaceId);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("A projectPlace is deleted with identifier "
                + projectPlaceId, projectPlaceId)).build();
    }

    @RequestMapping(value="/projectPlaces/selectSingle", method=RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ProjectPlace> selectSingle (ProjectPlace queryprojectPlace) throws Exception{
        ProjectPlace projectPlace = null;
        List<ProjectPlace> list= projectPlaceService.selectByProjectId(queryprojectPlace);
        if(list.size()>0){
            projectPlace =list.get(0);
        }
        if(projectPlace == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }else {
            return new ResponseEntity<>(projectPlace, HttpStatus.OK);
        }
    }

}
