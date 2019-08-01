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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import td.enterprise.entity.Crowd;
import td.enterprise.page.CrowdPage;
import td.enterprise.service.CrowdService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.PaginationUtil;

import java.util.List;

/**
 * Crowd 人群管理接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class CrowdController extends BaseController {

    private final String BASE_URL = "/api/crowds";

    public final static Logger logger = Logger.getLogger(CrowdController.class);

    @Autowired
    private CrowdService crowdService;


    /**
     * 获取查询条件下所有人群
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取查询条件下所有人群",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取查询条件下所有人群")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/crowds", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Crowd>> query(CrowdPage page) throws Exception {
        page.setPageEnabled(false);
        List<Crowd> rows = crowdService.queryByList(page);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
        return new ResponseEntity<>(rows, headers, HttpStatus.OK);
    }

}
