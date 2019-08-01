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
import td.enterprise.common.constant.CommonConstants;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.entity.CustomCrowd;
import td.enterprise.page.CustomCrowdPage;
import td.enterprise.service.CustomCrowdService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CustomCrowd 定制客群接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class CustomCrowdController extends BaseController {

    private final String BASE_URL = "/api/customCrowds";

    public final static Logger logger = Logger.getLogger(CustomCrowdController.class);

    @Autowired
    private CustomCrowdService customCrowdService;

    /**
     * 获取所有的定制客群
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "返回查询条件下所有定制客群",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "返回查询条件下所有定制客群")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/customCrowds", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<CustomCrowd>> query(CustomCrowdPage page) throws Exception {
        List<CustomCrowd> rows = customCrowdService.queryByList(page);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
        return new ResponseEntity<>(rows, headers, HttpStatus.OK);
    }

    /**
     * 删除定制客群
     *
     * @param customCrowdId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "删除定制客群",
            httpMethod = "DELETE",
            response = ResponseEntity.class,
            notes = "删除定制客群")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/customCrowds/{customCrowdId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Void> delete(@PathVariable String customCrowdId) throws Exception {
        CustomCrowd customCrowd = customCrowdService.selectByPrimaryKey(customCrowdId);
        if (customCrowd == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        customCrowdService.deleteByPrimaryKey(customCrowdId);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("A customCrowd is deleted with identifier " + customCrowdId, customCrowdId)).build();

    }


    /**
     * 获取所有的定制客群
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "根据项目ID查看计算成功的人群",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "根据项目ID查看计算成功的人群")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/customCrowds/{projectId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<CustomCrowd>> queryCustomCrowdById(@PathVariable Integer projectId) throws Exception {
        CustomCrowdPage page = new CustomCrowdPage();
        page.setPageEnabled(false);
        page.setProjectId(projectId);
        page.setStatus(ReportConstants.CustomCrowd.STATUS_AVALIABLE);
        page.setCalcStatus(ReportConstants.CustomCrowd.CALC_STATUS_COUNT_SUCESS);
        List<CustomCrowd> rows = customCrowdService.queryByList(page);
        return new ResponseEntity<>(rows, HttpStatus.OK);
    }

}
