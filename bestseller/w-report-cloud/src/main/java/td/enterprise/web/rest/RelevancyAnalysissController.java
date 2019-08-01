package td.enterprise.web.rest;

import com.tendcloud.enterprise.um.umic.entity.User;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.net.URI;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.yaml.snakeyaml.util.UriEncoder;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.util.StringUtil;
import td.enterprise.entity.Project;
import td.enterprise.entity.RelevancyAnalysiss;
import td.enterprise.page.RelevancyAnalysissPage;
import td.enterprise.service.ProjectService;
import td.enterprise.service.RelevancyAnalysissService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.util.UserInfoUtil;

/**
 * RelevancyAnalysiss 路径分析表接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class RelevancyAnalysissController extends BaseController {

  public final static Logger logger = Logger.getLogger(RelevancyAnalysissController.class);

  private final String BASE_URL = "/api/relevancy-analysisss";

  @Autowired
  private RelevancyAnalysissService relevancyAnalysissService;

  @Autowired
  private ProjectService projectService;

  /**
   * 获取查询条件下所有路径分析表(支持分页)
   */
  @ApiOperation(value = "获取查询条件下所有路径分析表(支持分页)",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "获取查询条件下所有路径分析表(支持分页)")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/relevancy-analysisss", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<RelevancyAnalysiss>> query(RelevancyAnalysissPage page)
      throws Exception {
    //排序
    String sort = page.getSort();
    if (sort != null && !"".equals(sort)) {
      page.setSort(StringUtil.camelToUnderline(sort));
    }
    //模糊查询
    if (page.getQ() != null && !"".equals(page.getQ())) {
      page.setQ(UriEncoder.decode(page.getQ()));
    }
    List<RelevancyAnalysiss> rows = relevancyAnalysissService.queryByList(page);
    HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
    return new ResponseEntity<>(rows, headers, HttpStatus.OK);
  }

  /**
   * 新建路径分析表
   */
  @ApiOperation(value = "新建路径分析表",
      httpMethod = "POST",
      response = ResponseEntity.class,
      notes = "新建路径分析表")
  @ApiResponses({
      @ApiResponse(code = 201, message = "创建成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/relevancy-analysisss", method = RequestMethod.POST, consumes = "application/json")
  @ResponseBody
  public ResponseEntity<RelevancyAnalysiss> create(
      @RequestBody RelevancyAnalysiss relevancyAnalysiss) throws Exception {
    User user = UserInfoUtil.getUser();
    relevancyAnalysiss.setTenantId(Integer.valueOf(UserInfoUtil.getCurrentUserTenantId()));
    relevancyAnalysiss.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
    relevancyAnalysiss.setCreateBy(user.getUmid());
    relevancyAnalysiss.setCreator(user.getName());
    relevancyAnalysiss.setUpdateBy(user.getUmid());
    relevancyAnalysiss.setUpdater(user.getName());
    Set<String> projectIdSet = new HashSet<>();
    //获取店组的子项目Id加到set
    if (relevancyAnalysiss.getStoreGroupIds() != null && !""
        .equals(relevancyAnalysiss.getStoreGroupIds())) {
      for (String str : relevancyAnalysiss.getStoreGroupIds().split(",")) {
        List<Project> projectList = projectService.queryChildrenByParam(str);
        for (Project project : projectList) {
          projectIdSet.add(project.getId() + "");
        }
      }
    }
    //将店铺的项目ID加入到set
    if (relevancyAnalysiss.getStoreIds() != null && !"".equals(relevancyAnalysiss.getStoreIds())) {
      for (String str : relevancyAnalysiss.getStoreIds().split(",")) {
        projectIdSet.add(str);
      }
    }
    //将set中的projectID存放在projectIds中
    StringBuilder sb = new StringBuilder();
    for (String projectId : projectIdSet) {
      sb.append(projectId).append(",");
    }
    if (sb.length() > 0) {
      relevancyAnalysiss.setAnalysissProjectIds(sb.substring(0, sb.length() - 1));
    }
    if (projectIdSet.size() > 50) {
      return ResponseEntity.badRequest()
          .headers(HeaderUtil.createFailureAlert("RelevancyAnalysiss", "projectIdTooMany",
              URLEncoder.encode("最多可选50个店铺,现已选择" + projectIdSet.size() + "个店铺.", "UTF-8")))
          .body(null);
    } else {
      relevancyAnalysissService.insert(relevancyAnalysiss);
      relevancyAnalysissService.projectTracksTaskSchedule(relevancyAnalysiss.getId());
      return ResponseEntity.created(new URI(BASE_URL + "/" + relevancyAnalysiss.getId()))
          .headers(HeaderUtil.createAlert(
              "A relevancyAnalysiss is created with identifier " + relevancyAnalysiss.getId(),
              relevancyAnalysiss.getId() + ""))
          .body(relevancyAnalysiss);
    }
  }


  /**
   * 删除路径分析表
   */
  @ApiOperation(value = "删除路径分析表",
      httpMethod = "DELETE",
      response = ResponseEntity.class,
      notes = "删除路径分析表")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/relevancy-analysisss/{relevancyAnalysissId}", method = RequestMethod.DELETE)
  @ResponseBody
  public ResponseEntity<Void> delete(@PathVariable String relevancyAnalysissId) throws Exception {
    RelevancyAnalysiss relevancyAnalysiss = relevancyAnalysissService
        .selectByPrimaryKey(relevancyAnalysissId);
    if (relevancyAnalysiss == null) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    relevancyAnalysissService.deleteByPrimaryKey(relevancyAnalysissId);
    return ResponseEntity.ok().headers(HeaderUtil
        .createAlert("A relevancyAnalysiss is deleted with identifier " + relevancyAnalysissId,
            relevancyAnalysissId)).build();
  }


  /**
   * 通过主键获取某条路径分析表数据
   */
  @ApiOperation(value = "获取关联分析某个项目的上下游数据",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "获取关联分析某个项目的上下游数据")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/relevancy-analysisss/updown/{relevancyAnalysissId}", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<Map> queryProjectTracks(String analysissId, String projectId, String type)
      throws Exception {
    String tenantId = UserInfoUtil.getCurrentTenantId();
    Map map = relevancyAnalysissService
        .getProjectTracksList(analysissId, tenantId, projectId, type);
    return new ResponseEntity<>(map, HttpStatus.OK);
  }

  /**
   * 通过主键获取路径分析选择的店铺列表
   */
  @ApiOperation(value = "通过主键获取路径分析选择的店铺列表",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "通过主键获取路径分析选择的店铺列表")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/relevancy-analysisss/project/{analysissId}", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<Project>> queryProjectTracks(String analysissId) throws Exception {
    User user = UserInfoUtil.getUser();
    String tenantId = UserInfoUtil.getCurrentTenantId();
    //得到项目ID与项目名称的对应关系
    Map<String, String> projectMap = relevancyAnalysissService.getProjectMap(tenantId);

    RelevancyAnalysiss relevancyAnalysiss = relevancyAnalysissService
        .selectByPrimaryKey(analysissId);
    String[] projectIdArr = relevancyAnalysiss.getAnalysissProjectIds().split(",");
    List<Project> projectList = new ArrayList<>();
    for (String projectId : projectIdArr) {
      Project project = new Project();
      project.setId(Integer.valueOf(projectId));
      project.setProjectName(projectMap.get(projectId));
      projectList.add(project);
    }
    return new ResponseEntity<>(projectList, HttpStatus.OK);
  }

}
