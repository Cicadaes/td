package td.enterprise.web.rest;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tendcloud.enterprise.um.umic.entity.User;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.yaml.snakeyaml.util.UriEncoder;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.entity.BsUser;
import td.enterprise.entity.Project;
import td.enterprise.entity.Sensor;
import td.enterprise.page.ProjectPage;
import td.enterprise.page.SensorPage;
import td.enterprise.service.ProjectService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.*;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Project 项目接口
 */
@Controller
@RequestMapping("/api")
@Slf4j
public class ProjectController extends BaseController {

  private final String BASE_URL = "/api/projects";

  @Autowired
  private ProjectService projectService;

  @Value("${appcode}")
  private String appCode;

  @Value("${apptaken}")
  private String appToken;

  /**
   * 获取所有的project
   */
  @ApiOperation(value = "根据 shop_code 返回所有的店铺",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回所有的店铺")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/shopList4drawings", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<Project>> shopList4drawings(ProjectPage page) throws Exception {
    // 租户管理员可以看到全部，店长只能看到当前店铺的
    page = projectService.decodeUrl(page);
    page.setTenantId(UserInfoUtil.getCurrentTenantId());

    User user = UserInfoUtil.getUser();

    List<BsUser> bsUserList = projectService.getBsUserByUserId(user.getUmid());
    if (bsUserList.size() > 0) {
      String groupSignFlag = bsUserList.get(0).getGroupSign().trim();
      if ("N".equalsIgnoreCase(groupSignFlag)) {
        for (BsUser tmpBsUser : bsUserList) {
          if (!StringUtils.isBlank(tmpBsUser.getShopCode())) {
            page.getShopCodeList().add(tmpBsUser.getShopCode());
          } else {
            page.getCCityCnNameList().add(tmpBsUser.getLogicalCity());
          }
        }
      }
    }

    List<Project> result = projectService.queryByList(page);
    HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);

    return new ResponseEntity<>(result, headers, HttpStatus.OK);
  }

  /**
   * 获取所有的project
   */
  @ApiOperation(value = "返回所有的店铺",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回所有的店铺")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/shopList", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<Project>> shopPageList(ProjectPage page) throws Exception {
    page = projectService.decodeUrl(page);
    page.setTenantId(UserInfoUtil.getCurrentTenantId());
    if (page.getQ() != null && !"".equals(page.getQ())) {
      page.setQ(URLDecoder.decode(page.getQ(), "UTF8"));
    }
    List<Project> result = projectService.queryByListWithSingleParentName(page);
    HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);

    return new ResponseEntity<>(result, headers, HttpStatus.OK);
  }

  @ApiOperation(value = "返回所有的店铺",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回所有的店铺")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/shopListByCondition", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<ProjectListVM>> shopPageListByCondition(ProjectPage page)
      throws Exception {
    List<ProjectListVM> result = projectService.queryList4Shop(page);
    HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
    return new ResponseEntity<>(result, headers, HttpStatus.OK);
  }

  @ApiOperation(value = "通过店铺id更新店铺pic url",
      httpMethod = "POST",
      response = ResponseEntity.class,
      notes = "通过店铺id更新店铺pic url")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/updatePicUrl", method = RequestMethod.POST)
  @ResponseBody
  public ResponseEntity<String> updatePicUrlById(@RequestBody Project project)
      throws Exception {

    Map<String, Object> result = new HashMap<>();
    String msg = "当前用户不得上传图纸";
    String ProjectNum = projectService.selectByPrimaryKey(project.getId()).getProjectNum();
    boolean canUpload = isProjectOwner(ProjectNum);
    if (canUpload) {
      msg = projectService.updatePicUrlById(project);
    }
    result.put("msg", msg);
    result.put("state", canUpload);

    return ResponseEntity.ok()
        .headers(HeaderUtil
            .createAlert("A Project is updated " + project.toString(), project.toString()))
        .body(JSON.toJSONString(result));
  }

  private boolean isProjectOwner(String projectNum) {
    List<BsUser> bsUserList = projectService.getBsUserByUserId(UserInfoUtil.getUser().getUmid());
    if (!bsUserList.isEmpty()) {
      String groupSignFlag = bsUserList.get(0).getGroupSign().trim();
      if ("N".equalsIgnoreCase(groupSignFlag)) {
        for (BsUser tmpBsUser : bsUserList) {
          if (projectNum.equals(tmpBsUser.getShopCode())) {
            return true;
          }
        }
      } else if ("无".equalsIgnoreCase(groupSignFlag)) {
        return true;
      }
    }
    return false;
  }


  /**
   * 获取所有的project
   */
  @ApiOperation(value = "返回该用户可以获取的所有的项目",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回该用户可以获取的所有的项目")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<ProjectUserRelationVM>> queryByList(ProjectPage page)
      throws Exception {

    checkParams(page);

    List<ProjectUserRelationVM> result = projectService.findAllProject(page);

    HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);

    return new ResponseEntity<>(result, headers, HttpStatus.OK);
  }

  /**
   * 项目明细接口
   *
   * @param page 取代 Projectsandassenger
   * @return ResponseEntity
   */
  @ApiOperation(value = "返回项目列表以及一些指标信息",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回项目列表以及一些指标信息")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/details", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<ProjectIndexVM>> queryProjectListWithDetail(ProjectPage page)
      throws Exception {
    List<ProjectIndexVM> result = projectService.findAllProjectIndex(page);
    HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
    return new ResponseEntity<>(result, headers, HttpStatus.OK);
  }

  /**
   * 返回获取的单个项目详情
   */
  @ApiOperation(value = "返回获取的单个项目详情",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回获取的单个项目详情")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/{projectId}", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<ProjectAttributeVM> find(@PathVariable String projectId) throws Exception {

    ProjectAttributeVM projectAttributeVM = projectService.findOneWithDetail(projectId);

    if (projectAttributeVM == null) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    } else {
      return new ResponseEntity<>(projectAttributeVM, HttpStatus.OK);
    }

  }

  /**
   * 返回获取的单个项目详情
   */
  @ApiOperation(value = "返回获取的单个项目详情",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回获取的单个项目详情")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/find/{projectId}", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<Project> findSingle(@PathVariable String projectId) throws Exception {

    Project projectAttributeVM = projectService.findOneById(projectId);

    if (projectAttributeVM == null) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    } else {
      return new ResponseEntity<>(projectAttributeVM, HttpStatus.OK);
    }

  }

  @ApiOperation(value = "返回获取的单个项目详情",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回获取的单个项目详情")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projectsSingle/{projectId}", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<Project> findSimple(@PathVariable String projectId) throws Exception {

    Project project = projectService.selectByPrimaryKey(projectId);

    if (project == null) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    } else {
      return new ResponseEntity<>(project, HttpStatus.OK);
    }

  }

  @ApiOperation(value = "返回获取的单个项目详情,含上游和下游",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回获取的单个项目详情，含上游和下游")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/single/{projectId}", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<Project> getSingleWithParentAndChildren(@PathVariable String projectId)
      throws Exception {
    Project project = projectService.getSingleWithParentAndChildren(projectId);
    if (project == null) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    } else {
      return new ResponseEntity<>(project, HttpStatus.OK);
    }
  }

  @ApiOperation(value = "返回该项目的所有递归子类项目，不支持分页",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回该项目的所有递归子类项目，不支持分页")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/{projectId}/childProject", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<Project>> queryChildrenByParam(
      @ApiParam @PathVariable String projectId) throws Exception {
    List<Project> childrenList = projectService.queryChildrenByParam(projectId);
    return new ResponseEntity<>(childrenList, HttpStatus.OK);
  }

  @ApiOperation(value = "返回该项目的所有直接子类项目",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回该项目的所有直接子类项目")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/{projectId}/direct-children", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<ProjectChildrenVM>> queryDirectChildrenByParam(
      @ApiParam @PathVariable String projectId, int layer) throws Exception {
    List<ProjectChildrenVM> childrenList = projectService
        .queryDirectChildrenByParam(projectId, layer);
    return new ResponseEntity<>(childrenList, HttpStatus.OK);
  }

  /**
   * 新建项目
   */
  @ApiOperation(value = "新建项目",
      httpMethod = "POST",
      response = ResponseEntity.class,
      notes = "新建项目")
  @ApiResponses({
      @ApiResponse(code = 201, message = "创建成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })

  @RequestMapping(value = "/projects", method = RequestMethod.POST)
  @ResponseBody
  public ResponseEntity<?> createProject(@RequestBody ProjectPage page) throws Exception {
    User user = UserInfoUtil.getUser();
    ProjectPage pageNew = new ProjectPage();

    // 规定， 只有自定义项目才可以添加，其他类型的项目都是导入
    page.setProjectType(2);

    pageNew = new ProjectPage();
    pageNew.setId(page.getId());
    pageNew.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
    pageNew.setTenantId(UserInfoUtil.getCurrentUserTenantId());
    pageNew.setProjectName(page.getProjectName());

    // 根据用户、自定义项目等条件查询项目名称是否存在，如果存在，则不能添加
    List<Project> projects2 = projectService.getDao().findAll(pageNew);
    if (projects2 != null && projects2.size() != 0) {
      return ResponseEntity.badRequest()
          .headers(HeaderUtil
              .createFailureAlert("Project", "nameexists", URLEncoder.encode("项目名称已经存在", "UTF-8")))
          .body(null);
    }

    Project newProject = projectService.createProject(page);
    return ResponseEntity.created(new URI(BASE_URL + newProject.getId()))
        .headers(HeaderUtil
            .createAlert("A Project is created with identifier " + newProject.getId(),
                newProject.getId() + ""))
        .body(newProject);

  }

  /**
   * 更新项目
   *
   * 默认只能修改自定义类型 ，
   */
  @ApiOperation(value = "更新项目",
      httpMethod = "PUT",
      response = ResponseEntity.class,
      notes = "更新项目")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/{projectId}", method = RequestMethod.PUT)
  @ResponseBody
  public ResponseEntity<?> update(@RequestBody ProjectPage page) throws Exception {
    Project project = projectService.updateProject(page);
    return ResponseEntity.ok()
        .headers(HeaderUtil.createAlert("A project is updated with identifier " + project.getId(),
            project.getId() + ""))
        .body(project);
  }

  /**
   * 删除项目
   */
  @ApiOperation(value = "删除项目",
      httpMethod = "DELETE",
      response = ResponseEntity.class,
      notes = "删除项目")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/{projectId}", method = RequestMethod.DELETE)
  @ResponseBody
  public ResponseEntity<Void> delete(@PathVariable String projectId) throws Exception {
    Project project = projectService.selectByPrimaryKey(projectId);
    projectService.deleteProject(project);
    return ResponseEntity.ok().headers(HeaderUtil
        .createAlert("A project is deleted with identifier " + project.getProjectName(),
            project.getProjectName())).build();
  }

  /**
   * 检查参数
   */
  private void checkParams(ProjectPage page) throws MethodArgumentNotValidException {

  }

  @ApiOperation(value = "竞品项目，返回竞品项目列表",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "竞品项目，返回竞品项目列表")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/competeProjects", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<CompeteProjectVM>> queryComProject(ProjectPage page) throws Exception {
    if (page.getQ() != null && StringUtils.isNotBlank(page.getQ())) {
      page.setQ(UriEncoder.decode(page.getQ()));
    }
    List<CompeteProjectVM> rows = projectService.queryComProject(page, true);
    HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
    return new ResponseEntity<>(rows, headers, HttpStatus.OK);
  }

  @ApiOperation(value = "竞品库列表查询",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "竞品库列表查询")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/competeProjects/tenant", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<Project>> queryComProjectTenant(String relatedId) throws Exception {
    List<Project> rows = projectService.queryComProjectTenant(relatedId);

    HttpHeaders headers = new HttpHeaders();
    headers.add("X-Total-Count", "" + rows.size());
    return new ResponseEntity<>(rows, headers, HttpStatus.OK);
  }

  /**
   * 新建竞品项目
   */
  @ApiOperation(value = "新建竞品项目",
      httpMethod = "POST",
      response = ResponseEntity.class,
      notes = "新建竞品项目")
  @ApiResponses({
      @ApiResponse(code = 201, message = "创建成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/competeProjects", method = RequestMethod.POST)
  @ResponseBody
  public ResponseEntity<Project> createComProject(@RequestBody Project project) throws Exception {
    project = projectService.createOrUpdateComProject(project);
    return ResponseEntity.created(new URI("/api/competeProjects" + project.getId()))
        .headers(HeaderUtil
            .createAlert("A competeProject is created with identifier " + project.getId(),
                project.getId() + ""))
        .body(project);
  }

  /**
   *
   *
   * @param project
   * @return
   */
  @ApiOperation(value = "修改竞品项目",
      httpMethod = "PUT",
      response = ResponseEntity.class,
      notes = "修改竞品项目")
  @ApiResponses({
      @ApiResponse(code = 201, message = "创建成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/competeProjects/{projectId}", method = RequestMethod.PUT)
  @ResponseBody
  public ResponseEntity<Project> updateComProject(@RequestBody Project project,
      @PathVariable String projectId) throws Exception {
    project = projectService.createOrUpdateComProject(project);
    return ResponseEntity.created(new URI("/api/competeProjects" + project.getId()))
        .headers(HeaderUtil
            .createAlert("A competeProject is created with identifier " + project.getId(),
                project.getId() + ""))
        .body(project);
  }


  /**
   * 修改竞品项目关系
   */
  @ApiOperation(value = "修改竞品项目关系",
      httpMethod = "POST",
      response = ResponseEntity.class,
      notes = "修改竞品项目关系")
  @ApiResponses({
      @ApiResponse(code = 201, message = "创建成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/competeProjects/relation", method = RequestMethod.POST)
  @ResponseBody
  public ResponseEntity<?> updateComProject(@RequestBody ProjectPage page) throws Exception {
    projectService.updateComProject(page);
    return new ResponseEntity<>("{\"msg2\":\"保存成功\"}", HttpStatus.OK);
  }

  /**
   * 删除竞品项目
   */
  @ApiOperation(value = "删除竞品项目",
      httpMethod = "DELETE",
      response = ResponseEntity.class,
      notes = "删除竞品项目")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/competeProjects/{projectId}/{relatedId}", method = RequestMethod.DELETE)
  @ResponseBody
  public ResponseEntity<Void> deleteComProject(@PathVariable String projectId,
      @PathVariable String relatedId) throws Exception {
    Project project = projectService.selectByPrimaryKey(projectId);
    project.setRelatedId(Integer.parseInt(relatedId));
    projectService.deleteComProject(project);
    return ResponseEntity.ok().headers(HeaderUtil
        .createAlert("A competeProject is deleted with identifier " + project.getProjectName(),
            project.getProjectName())).build();
  }

  /**
   * 竞品批量导入
   */
  @ApiOperation(value = "竞品批量导入",
      httpMethod = "POST",
      response = ResponseEntity.class,
      notes = "竞品批量导入")
  @ApiResponses({
      @ApiResponse(code = 201, message = "创建成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/competeProjects/batchImport", method = RequestMethod.POST)
  @ResponseBody
  public ResponseEntity<List<String>> batchImportComProject(MultipartFile file,
      @RequestParam(value = "projectId") String projectId,
      @RequestParam(value = "filetype") int filetype) throws Exception {
    List<String> errorMsg = projectService.batchImportComProject(file, projectId, filetype);
    return new ResponseEntity<>(errorMsg, HttpStatus.OK);
  }

  /**
   * 店铺负责人信息导入
   *
   * @return errorMsg
   */
  @ApiOperation(value = "店铺负责人信息导入",
      httpMethod = "POST",
      response = ResponseEntity.class,
      notes = "店铺负责人信息导入")
  @ApiResponses({
      @ApiResponse(code = 201, message = "创建成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/competeProjects/batchImport/principal", method = RequestMethod.POST)
  @ResponseBody
  public ResponseEntity<List<String>> batchImportProjectPrincipal(MultipartFile file)
      throws Exception {
    List<String> errorMsg = projectService.batchImportPrincipal(file);
    return new ResponseEntity<>(errorMsg, HttpStatus.OK);
  }

  /**
   * 返回获取的单个项目责任人信息和探针报表
   */
  @ApiOperation(value = "返回获取的单个项目责任人信息和探针报表",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回获取的单个项目详情")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/project/detail/{projectId}", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<ProjectDetailVM> projectDetail(@PathVariable String projectId)
      throws Exception {
    ProjectDetailVM projectDetailVM = projectService.projectDetail(projectId);
    return new ResponseEntity<>(projectDetailVM, HttpStatus.OK);
  }

  /**
   * 返回获取的店铺信息，责任人信息
   *
   * @param page 查询对象
   */
  @ApiOperation(value = "返回获取的店铺信息，责任人信息",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回获取的店铺信息，责任人信息")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/project/principalList", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<ProjectDetailVM>> getProjectPrincipalList(ProjectPage page)
      throws Exception {
    List<ProjectDetailVM> projectDetailVM = projectService.getProjectPrincipalList(page);
    HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
    return new ResponseEntity<>(projectDetailVM, headers, HttpStatus.OK);
  }

  /**
   * 返回获取的探针信息，探针管理
   */
  @ApiOperation(value = "返回获取的探针信息，探针管理",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回获取的探针信息，探针管理")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/sensorList", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<Sensor>> getSensorProjectList(SensorPage page) throws Exception {
    List<Sensor> sensorList = projectService.getSensorProjectList(page);
    HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
    return new ResponseEntity<>(sensorList, headers, HttpStatus.OK);
  }

  /**
   * 返回城市所有店铺坐标服务
   */
  @ApiOperation(value = "返回城市所有店铺坐标服务",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "返回城市所有店铺坐标服务")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projects/latlng", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<ProjectLatLngVM>> projectLatLng(ProjectPage page) throws Exception {
    List<ProjectLatLngVM> projectLatLngVMList = projectService.projectLatLng(page);
    return new ResponseEntity<>(projectLatLngVMList, HttpStatus.OK);
  }
}

