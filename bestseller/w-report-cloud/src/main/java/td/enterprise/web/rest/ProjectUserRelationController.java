package td.enterprise.web.rest;

import com.tendcloud.enterprise.um.umic.entity.User;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import td.enterprise.entity.ProjectUserRelation;
import td.enterprise.page.ProjectUserRelationPage;
import td.enterprise.service.ProjectUserRelationService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.util.UserInfoUtil;

import java.net.URI;
import java.util.List;

/**
 * ProjectUserRelation 用户项目关系接口
 */
@Controller
@RequestMapping("/api")
public class ProjectUserRelationController extends BaseController {

    private final String BASE_URL = "/api/projectUserRelations";

    public final static Logger logger = Logger.getLogger(ProjectUserRelationController.class);

    @Autowired
    private ProjectUserRelationService projectUserRelationService;

    /**
     * 新建用户项目关系
     *
     * @param projectUserRelation
     * @return
     */
    @ApiOperation(value = "新建用户项目关系",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "新建用户项目关系")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectUserRelations", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<ProjectUserRelation> create(@RequestBody ProjectUserRelation projectUserRelation) throws Exception {
        projectUserRelation = projectUserRelationService.create(projectUserRelation);
        return ResponseEntity.created(new URI(BASE_URL))
                .headers(HeaderUtil.createAlert("A projectUserRelation is created with identifier " + projectUserRelation.getId(), projectUserRelation.getId() + ""))
                .body(projectUserRelation);
    }

    /**
     * 更新用户项目关系
     *
     * @param projectUserRelation
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "更新用户项目关系",
            httpMethod = "PUT",
            response = ResponseEntity.class,
            notes = "更新用户项目关系")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectUserRelations/{projectUserRelationId}", method = RequestMethod.PUT, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<ProjectUserRelation> update(@RequestBody ProjectUserRelation projectUserRelation) throws Exception {
        projectUserRelation = projectUserRelationService.update(projectUserRelation);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert("A projectUserRelation is updated " + projectUserRelation.toString(), projectUserRelation.toString()))
                .body(projectUserRelation);
    }

    /**
     * 删除用户项目关系
     *
     * @param projectId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "删除用户项目关系",
            httpMethod = "DELETE",
            response = ResponseEntity.class,
            notes = "删除用户项目关系")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectUserRelations/{projectId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Void> delete(@PathVariable String projectId) throws Exception {

        ProjectUserRelationPage projectUserRelationPage = new ProjectUserRelationPage();
        projectUserRelationPage.setLogin(UserInfoUtil.getUser().getUmid());
        projectUserRelationPage.setProjectId(projectId);

        List<ProjectUserRelation> projectUserRelationList= projectUserRelationService.queryByList(projectUserRelationPage);

        if (projectUserRelationList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        projectUserRelationService.deleteByPrimaryKey(projectUserRelationList.get(0).getId());
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("A projectUserRelation is deleted with identifier "
                + projectId, projectId)).build();
    }

    /**
     * 查找某个用户的一个历史页面记录
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "查找某个用户的一个历史页面记录",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "查找某个用户的一个历史页面记录")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectUserRelations/queryForIndex", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ProjectUserRelation> queryForIndex(ProjectUserRelationPage page) throws Exception {
        ProjectUserRelation projectUserRelation = projectUserRelationService.queryForIndex(page);
        return new ResponseEntity<>(projectUserRelation, PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL), HttpStatus.OK);
    }

}
