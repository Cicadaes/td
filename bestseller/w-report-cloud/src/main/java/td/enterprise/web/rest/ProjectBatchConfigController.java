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
import td.enterprise.entity.ProjectBatchConfig;
import td.enterprise.entity.ProjectParam;
import td.enterprise.page.ProjectBatchConfigPage;
import td.enterprise.page.ProjectParamPage;
import td.enterprise.service.ProjectBatchConfigService;
import td.enterprise.service.ProjectParamService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.vm.ProjectBatchConfigVM;
import td.enterprise.web.vm.ProjectParamVM;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ProjectBatchConfig 批量设置接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class ProjectBatchConfigController extends BaseController {

    public final static Logger logger = Logger.getLogger(ProjectBatchConfigController.class);

    private final String BASE_URL = "/api/projectBatchConfigs";

    @Autowired
    private ProjectBatchConfigService projectBatchConfigService;

    @Autowired
    private ProjectParamService projectParamService;

    /**
     * 获取查询条件下所有批量设置
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取查询条件下所有批量设置",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取查询条件下所有批量设置")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectBatchConfigs", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<ProjectBatchConfig>> query(ProjectBatchConfigPage page) throws Exception {
        List<ProjectBatchConfig> rows = projectBatchConfigService.query(page);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
        return new ResponseEntity<>(rows, headers, HttpStatus.OK);
    }

    /**
     * 批量获取项目设置详情
     *
     * @param projectIds
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "批量获取项目设置详情",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "批量获取项目设置详情")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectBatchConfigs/getBatchConfigDetail", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<ProjectBatchConfigVM>> getBatchConfigDetail(@RequestParam("projectIds") String projectIds) throws Exception {
        List<ProjectBatchConfigVM> rows = projectBatchConfigService.getBatchConfigDetail(projectIds);
        return new ResponseEntity<>(rows, HttpStatus.OK);
    }

    /**
     * 批量保存已修改的项目设置详情
     *
     * @param projectBatchConfigVM
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "批量保存已修改的项目设置详情",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "批量保存已修改的项目设置详情")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectBatchConfigs/setBatchConfig", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<List<ProjectBatchConfig>> setBatchConfig(@RequestBody ProjectBatchConfigVM projectBatchConfigVM) throws Exception {
        List<ProjectBatchConfig> projectBatchConfigs = projectBatchConfigService.setBatchConfig(projectBatchConfigVM);
        return new ResponseEntity<>(projectBatchConfigs, HttpStatus.OK);
    }

    /**
     * 获取所有有权限的项目参数
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取项目参数",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取项目参数")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/getAllProjectParams_old", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List <ProjectParamVM>> getAllProjectParams_old() throws Exception {
        List <ProjectParamVM> projectParamVMS = projectBatchConfigService.getAllProjectParams();
        return new ResponseEntity<>(projectParamVMS, HttpStatus.OK);
    }

    @ApiOperation(value = "获取项目参数",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取项目参数")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/getAllProjectParams", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Map<Integer, String>>> getAllProjectParams() throws Exception {

        Map<String, Map<Integer, String>> resultMap =  new HashMap<>();

        Map<Integer, String> themeMap = new HashMap<>();
        Map<Integer, String> unitMap = new HashMap<>();

        ProjectParamPage page = new ProjectParamPage();
        page.setPageEnabled(false);
        page.setKey("PROJECT.THEME");
        List <ProjectParam> projectParamsTheme = projectParamService.getDao().queryByList(page);
        for (int i = 0; i <projectParamsTheme.size(); i++) {
            ProjectParam param = projectParamsTheme.get(i);
            themeMap.put(param.getProjectId(), param.getValue());
        }

        page.setKey("PROJECT.THRESHOLDTIME.UNIT");
        List <ProjectParam> projectParamsUnit = projectParamService.getDao().queryByList(page);
        for (int i = 0; i <projectParamsUnit.size(); i++) {
            ProjectParam param = projectParamsUnit.get(i);
            unitMap.put(param.getProjectId(), param.getValue());
        }

        resultMap.put("PROJECT.THEME", themeMap);
        resultMap.put("PROJECT.THRESHOLDTIME.UNIT", unitMap);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
}
