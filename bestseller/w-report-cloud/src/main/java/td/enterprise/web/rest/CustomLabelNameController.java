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
import td.enterprise.entity.CustomLabelName;
import td.enterprise.page.CustomLabelNamePage;
import td.enterprise.service.CustomLabelNameService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.PaginationUtil;

import java.util.List;

/**
 * CustomLabelName 用户自定义标签名接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class CustomLabelNameController extends BaseController {

    private final String BASE_URL = "/api/customLabelNames";

    public final static Logger logger = Logger.getLogger(CustomLabelNameController.class);

    @Autowired
    private CustomLabelNameService customLabelNameService;

    /**
     * 获取查询条件下所有用户自定义标签名
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取查询条件下所有用户自定义标签名",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取查询条件下所有用户自定义标签名")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/customLabelNames", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<CustomLabelName>> query(CustomLabelNamePage page) throws Exception {
        page.setPageEnabled(false);
        List<CustomLabelName> rows = customLabelNameService.query(page);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
        return new ResponseEntity<>(rows, headers, HttpStatus.OK);
    }
}
