package td.enterprise.web.rest;

import com.alibaba.fastjson.JSON;

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

import td.enterprise.entity.ProjectHeatMap;
import td.enterprise.page.ProjectHeatMapPage;
import td.enterprise.service.ProjectHeatMapService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

/**
 * ProjectHeatMap 人群热力图接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class ProjectHeatMapController extends BaseController {

  public final static Logger logger = Logger.getLogger(ProjectHeatMapController.class);

  private final String BASE_URL = "/api/projectHeatMaps";

  @Autowired
  private ProjectHeatMapService projectHeatMapService;

  /**
   * 获取查询条件下所有人群热力图(支持分页)
   */
  @ApiOperation(value = "获取查询条件下所有人群热力图(支持分页)",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "获取查询条件下所有人群热力图(支持分页)")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projectHeatMaps", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<ProjectHeatMap>> query(ProjectHeatMapPage page) throws Exception {
    page.setPageEnabled(false);
    List<ProjectHeatMap> rows = projectHeatMapService.queryByList(page);
    HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
    return new ResponseEntity<>(rows, headers, HttpStatus.OK);
  }

  private static List<ProjectHeatMap> createHeatMap() {
    String s = "[\n" +
        "{\"x\":12.11,\"y\":11.11},\n" +
        "{\"x\":12.12,\"y\":11.12},\n" +
        "{\"x\":12.13,\"y\":11.13},\n" +
        "{\"x\":12.14,\"y\":11.14},\n" +
        "{\"x\":12.15,\"y\":11.15},\n" +
        "{\"x\":12.16,\"y\":11.16},\n" +
        "{\"x\":12.17,\"y\":11.17},\n" +
        "{\"x\":12.18,\"y\":11.18},\n" +
        "{\"x\":12.19,\"y\":11.19},\n" +
        "{\"x\":30.11,\"y\":30.11},\n" +
        "{\"x\":30.12,\"y\":30.12},\n" +
        "{\"x\":30.13,\"y\":30.13},\n" +
        "{\"x\":30.14,\"y\":30.14},\n" +
        "{\"x\":30.15,\"y\":30.15},\n" +
        "{\"x\":30.16,\"y\":30.16},\n" +
        "{\"x\":30.17,\"y\":30.17},\n" +
        "{\"x\":30.18,\"y\":30.18},\n" +
        "{\"x\":30.19,\"y\":30.19},\n" +
        "{\"x\":35.11,\"y\":35.11},\n" +
        "{\"x\":35.12,\"y\":35.12},\n" +
        "{\"x\":35.13,\"y\":35.13},\n" +
        "{\"x\":35.14,\"y\":35.14},\n" +
        "{\"x\":35.15,\"y\":35.15},\n" +
        "{\"x\":35.16,\"y\":35.16},\n" +
        "{\"x\":35.17,\"y\":35.17},\n" +
        "{\"x\":35.18,\"y\":35.18},\n" +
        "{\"x\":35.19,\"y\":35.19},\n" +
        "{\"x\":44.11,\"y\":44.11},\n" +
        "{\"x\":44.12,\"y\":44.12},\n" +
        "{\"x\":44.13,\"y\":44.13},\n" +
        "{\"x\":44.14,\"y\":44.14},\n" +
        "{\"x\":44.15,\"y\":44.15},\n" +
        "{\"x\":44.16,\"y\":44.16},\n" +
        "{\"x\":44.17,\"y\":44.17},\n" +
        "{\"x\":44.18,\"y\":44.18},\n" +
        "{\"x\":44.19,\"y\":44.19},\n" +
        "{\"x\":50.11,\"y\":50.11},\n" +
        "{\"x\":50.12,\"y\":50.12},\n" +
        "{\"x\":50.13,\"y\":50.13},\n" +
        "{\"x\":50.14,\"y\":50.14},\n" +
        "{\"x\":50.15,\"y\":50.15},\n" +
        "{\"x\":50.16,\"y\":50.16},\n" +
        "{\"x\":50.17,\"y\":50.17},\n" +
        "{\"x\":50.18,\"y\":50.18},\n" +
        "{\"x\":50.19,\"y\":50.19}\n" +
        "]";
    List<ProjectHeatMap> list = JSON.parseArray(s, ProjectHeatMap.class);
    return list;
  }

  public static void main(String[] args) {
    String s = "[\n" +
        "{\"x\":12.11,\"y\":11.11},\n" +
        "{\"x\":12.12,\"y\":11.12},\n" +
        "{\"x\":12.13,\"y\":11.13},\n" +
        "{\"x\":12.14,\"y\":11.14},\n" +
        "{\"x\":12.15,\"y\":11.15},\n" +
        "{\"x\":12.16,\"y\":11.16},\n" +
        "{\"x\":12.17,\"y\":11.17},\n" +
        "{\"x\":12.18,\"y\":11.18},\n" +
        "{\"x\":12.19,\"y\":11.19},\n" +
        "{\"x\":30.11,\"y\":30.11},\n" +
        "{\"x\":30.12,\"y\":30.12},\n" +
        "{\"x\":30.13,\"y\":30.13},\n" +
        "{\"x\":30.14,\"y\":30.14},\n" +
        "{\"x\":30.15,\"y\":30.15},\n" +
        "{\"x\":30.16,\"y\":30.16},\n" +
        "{\"x\":30.17,\"y\":30.17},\n" +
        "{\"x\":30.18,\"y\":30.18},\n" +
        "{\"x\":30.19,\"y\":30.19},\n" +
        "{\"x\":35.11,\"y\":35.11},\n" +
        "{\"x\":35.12,\"y\":35.12},\n" +
        "{\"x\":35.13,\"y\":35.13},\n" +
        "{\"x\":35.14,\"y\":35.14},\n" +
        "{\"x\":35.15,\"y\":35.15},\n" +
        "{\"x\":35.16,\"y\":35.16},\n" +
        "{\"x\":35.17,\"y\":35.17},\n" +
        "{\"x\":35.18,\"y\":35.18},\n" +
        "{\"x\":35.19,\"y\":35.19},\n" +
        "{\"x\":44.11,\"y\":44.11},\n" +
        "{\"x\":44.12,\"y\":44.12},\n" +
        "{\"x\":44.13,\"y\":44.13},\n" +
        "{\"x\":44.14,\"y\":44.14},\n" +
        "{\"x\":44.15,\"y\":44.15},\n" +
        "{\"x\":44.16,\"y\":44.16},\n" +
        "{\"x\":44.17,\"y\":44.17},\n" +
        "{\"x\":44.18,\"y\":44.18},\n" +
        "{\"x\":44.19,\"y\":44.19},\n" +
        "{\"x\":50.11,\"y\":50.11},\n" +
        "{\"x\":50.12,\"y\":50.12},\n" +
        "{\"x\":50.13,\"y\":50.13},\n" +
        "{\"x\":50.14,\"y\":50.14},\n" +
        "{\"x\":50.15,\"y\":50.15},\n" +
        "{\"x\":50.16,\"y\":50.16},\n" +
        "{\"x\":50.17,\"y\":50.17},\n" +
        "{\"x\":50.18,\"y\":50.18},\n" +
        "{\"x\":50.19,\"y\":50.19}\n" +
        "]";

    List<ProjectHeatMap> maps = new ArrayList<>();
    List<ProjectHeatMap> maps1 = JSON.parseArray(s, ProjectHeatMap.class);
  }

  /**
   * 新建人群热力图
   */
  @ApiOperation(value = "新建人群热力图",
      httpMethod = "POST",
      response = ResponseEntity.class,
      notes = "新建人群热力图")
  @ApiResponses({
      @ApiResponse(code = 201, message = "创建成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projectHeatMaps", method = RequestMethod.POST, consumes = "application/json")
  @ResponseBody
  public ResponseEntity<ProjectHeatMap> create(@RequestBody ProjectHeatMap projectHeatMap) throws Exception {
    projectHeatMapService.insert(projectHeatMap);
    return ResponseEntity.created(new URI(BASE_URL)) // + "/" + projectHeatMap.getId()
        .headers(HeaderUtil.createAlert("A projectHeatMap is created with identifier " + projectHeatMap.getId(), projectHeatMap.getId() + ""))
        .body(projectHeatMap);
  }

  /**
   * 通过主键获取某条人群热力图数据
   */
  @ApiOperation(value = "通过主键获取某条人群热力图数据",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "通过主键获取某条人群热力图数据")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projectHeatMaps/{projectHeatMapId}", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<ProjectHeatMap> find(@PathVariable String projectHeatMapId) throws Exception {
    ProjectHeatMap projectHeatMap = projectHeatMapService.selectByPrimaryKey(projectHeatMapId);
    if (projectHeatMap == null) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    } else {
      return new ResponseEntity<>(projectHeatMap, HttpStatus.OK);
    }
  }

  /**
   * 更新人群热力图
   */
  @ApiOperation(value = "更新人群热力图",
      httpMethod = "PUT",
      response = ResponseEntity.class,
      notes = "更新人群热力图")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projectHeatMaps/{projectHeatMapId}", method = RequestMethod.PUT, consumes = "application/json")
  @ResponseBody
  public ResponseEntity<ProjectHeatMap> update(@RequestBody ProjectHeatMap projectHeatMap) throws Exception {
    projectHeatMapService.updateByPrimaryKeySelective(projectHeatMap);
    return ResponseEntity.ok()
        .headers(HeaderUtil.createAlert("A projectHeatMap is updated " + projectHeatMap.getId(), projectHeatMap.getId() + ""))
        .body(projectHeatMap);
  }

  /**
   * 删除人群热力图
   */
  @ApiOperation(value = "删除人群热力图",
      httpMethod = "DELETE",
      response = ResponseEntity.class,
      notes = "删除人群热力图")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 400, message = "未授权获取资源"),
      @ApiResponse(code = 404, message = "资源不存在"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/projectHeatMaps/{projectHeatMapId}", method = RequestMethod.DELETE)
  @ResponseBody
  public ResponseEntity<Void> delete(@PathVariable String projectHeatMapId) throws Exception {
    ProjectHeatMap projectHeatMap = projectHeatMapService.selectByPrimaryKey(projectHeatMapId);
    if (projectHeatMap == null) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    projectHeatMapService.deleteByPrimaryKey(projectHeatMapId);
    return ResponseEntity.ok().headers(HeaderUtil.createAlert("A projectHeatMap is deleted with identifier " + projectHeatMapId, projectHeatMapId)).build();
  }
}
