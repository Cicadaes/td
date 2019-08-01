package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.yaml.snakeyaml.util.UriEncoder;
import td.enterprise.entity.CrossAnalysis;
import td.enterprise.page.CrossAnalysisPage;
import td.enterprise.service.CrossAnalysisService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.vm.ProjectSalesVolumnChartVM;

import java.util.List;


/**
 * CrossAnalysis 交叉分析接口
 */
@Controller
@RequestMapping("/api")
public class CrossAnalysisController extends BaseController {

    private final String BASE_URL = "/api/crossAnalysiss";

    public final static Logger logger = Logger.getLogger(CrossAnalysisController.class);

    @Autowired
    private CrossAnalysisService crossAnalysisService;

    /**
     * 获取所有的交叉分析
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "返回查询条件下所有交叉分析",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "返回查询条件下所有交叉分析")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/crossAnalysiss", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<CrossAnalysis>> query(CrossAnalysisPage page) throws Exception {
        if (page.getQ() != null && StringUtils.isNotBlank(page.getQ())) {
            page.setQ(UriEncoder.decode(page.getQ()));
        }
        List<CrossAnalysis> rows = crossAnalysisService.queryByList(page);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
        return new ResponseEntity<>(rows, headers, HttpStatus.OK);
    }

    /**
     * 删除交叉分析
     *
     * @param crossAnalysisId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "删除交叉分析",
            httpMethod = "DELETE",
            response = ResponseEntity.class,
            notes = "删除交叉分析")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/crossAnalysiss/{crossAnalysisId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Void> delete(@PathVariable String crossAnalysisId) throws Exception {
        CrossAnalysis crossAnalysis = crossAnalysisService.selectByPrimaryKey(crossAnalysisId);
        if (crossAnalysis == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        crossAnalysisService.delete(crossAnalysis);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("A crossAnalysis is deleted with identifier " + crossAnalysisId, crossAnalysisId)).build();
    }

    /**
     * 开始计算
     *
     * @param file
     * @param projectId
     * @param analysisName
     * @param xAxis
     * @param yAxis
     * @param startDate
     * @param endDate
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "开始计算",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "开始计算")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @PostMapping("/crossAnalysiss/startCompute")
    public ResponseEntity<ProjectSalesVolumnChartVM> startCompute(@RequestParam("file") MultipartFile file,
                                                                  @RequestParam("projectId") String projectId, @RequestParam("analysisName") String analysisName,
                                                                  @RequestParam("xAxis") String xAxis, @RequestParam("yAxis") String yAxis,
                                                                  @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate
    ) throws Exception {
        CrossAnalysisPage page = new CrossAnalysisPage();
        page.setProjectId(projectId);
        page.setAnalysisName(analysisName);
        page.setXAxis(xAxis);
        page.setYAxis(yAxis);
        page.setStartDate(startDate);
        page.setEndDate(endDate);

        ProjectSalesVolumnChartVM projectSalesVolumnChartVM = crossAnalysisService.startCompute(page, file);
        return new ResponseEntity<>(projectSalesVolumnChartVM, HttpStatus.OK);
    }

    /**
     * 保存结果
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "保存结果",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "保存结果")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/crossAnalysiss/saveResult", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<CrossAnalysis> saveResult(@RequestBody CrossAnalysisPage page) throws Exception {
        CrossAnalysis crossAnalysis = crossAnalysisService.saveResult(page);
        return new ResponseEntity<>(crossAnalysis, HttpStatus.OK);
    }

    /**
     * 查看结果
     *
     * @param crossAnalysisId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "查看结果",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "查看结果")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/crossAnalysiss/getResult/{crossAnalysisId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ProjectSalesVolumnChartVM> getResult(@PathVariable String crossAnalysisId, @RequestParam("projectIds") String projectIds) throws Exception {
        ProjectSalesVolumnChartVM projectSalesVolumnChartVM = crossAnalysisService.getResult(crossAnalysisId, projectIds);
        if (projectSalesVolumnChartVM == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(projectSalesVolumnChartVM, HttpStatus.OK);
        }
    }

}
