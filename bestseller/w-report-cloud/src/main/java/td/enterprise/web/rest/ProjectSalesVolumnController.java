package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import td.enterprise.page.ProjectSalesVolumnPage;
import td.enterprise.service.ProjectSalesVolumnService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.vm.ProjectSalesVolumnChartVM;

import java.util.List;

/**
 * ProjectSalesVolumn 项目销售额接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class ProjectSalesVolumnController extends BaseController {

    private final String BASE_URL = "/api/projectSalesVolumns";

    public final static Logger logger = Logger.getLogger(ProjectSalesVolumnController.class);

    @Autowired
    private ProjectSalesVolumnService projectSalesVolumnService;

    /**
     * 批量导入项目销售额
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "批量导入项目销售额",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "批量导入项目销售额")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectSalesVolumns/check", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<List<String>> batchImport(ProjectSalesVolumnPage page) throws Exception {
        List<String> errorMsg = projectSalesVolumnService.batchImport(page);
        return new ResponseEntity<>(errorMsg, HttpStatus.OK);
    }

    /**
     * 销售客流指标
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "销售客流指标",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "销售客流指标")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectSalesVolumns/coordinateInfo", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ProjectSalesVolumnChartVM> getCoordinateInfo(ProjectSalesVolumnPage page) throws Exception {
        ProjectSalesVolumnChartVM coordinateInfo = projectSalesVolumnService.getCoordinateInfo(page);
        return new ResponseEntity<>(coordinateInfo, HttpStatus.OK);
    }

}
