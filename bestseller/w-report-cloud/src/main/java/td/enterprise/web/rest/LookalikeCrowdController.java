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
import org.springframework.web.bind.annotation.*;
import td.enterprise.entity.LookalikeCrowd;
import td.enterprise.service.LookalikeCrowdService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.UserInfoUtil;

import java.net.URI;

/**
 * LookalikeCrowd 潜客挖掘-相似客群接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class LookalikeCrowdController extends BaseController {

    private final String BASE_URL = "/api/lookalikeCrowds";

    public final static Logger logger = Logger.getLogger(LookalikeCrowdController.class);

    @Autowired
    private LookalikeCrowdService lookalikeCrowdService;

    /**
     * 新建相似人群
     *
     * @param lookalikeCrowd
     * @return
     */
    @ApiOperation(value = "新建相似人群",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "新建相似人群")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/lookalikeCrowds", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<LookalikeCrowd> create(@RequestBody LookalikeCrowd lookalikeCrowd) throws Exception {
        lookalikeCrowd.setTenantId(UserInfoUtil.getUser().getTenantId() + "");
        lookalikeCrowd = lookalikeCrowdService.create(lookalikeCrowd);
        return ResponseEntity.created(new URI(BASE_URL))
                .headers(HeaderUtil.createAlert("A lookalikeCrowd is created with identifier " + lookalikeCrowd.getId(), lookalikeCrowd.getId() + ""))
                .body(lookalikeCrowd);
    }

    /**
     * 获取的单个相似人群
     *
     * @param lookalikeCrowdId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取的单个相似人群",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取的单个相似人群")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 400, message = "未授权获取资源"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/lookalikeCrowds/{lookalikeCrowdId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<LookalikeCrowd> find(@PathVariable String lookalikeCrowdId) throws Exception {
        LookalikeCrowd lookalikeCrowd = lookalikeCrowdService.find(lookalikeCrowdId);
        if (lookalikeCrowd == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(lookalikeCrowd, HttpStatus.OK);
        }
    }
}
