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
import td.enterprise.entity.Target;
import td.enterprise.page.TargetPage;
import td.enterprise.service.TargetService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.PaginationUtil;

import java.util.List;

/**
 * Target 目标管理标签接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class TargetController extends BaseController {

    private final String BASE_URL = "/api/targets";

    public final static Logger logger = Logger.getLogger(TargetController.class);

    @Autowired
    private TargetService targetService;

    /**
     * 获取查询条件下所有目标管理标签
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取查询条件下所有目标管理标签",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取查询条件下所有目标管理标签")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/targets", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Target>> query(TargetPage page) throws Exception {
        List<Target> rows = targetService.queryByList(page);
        return new ResponseEntity<>(rows, PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL), HttpStatus.OK);
    }
}
