package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import td.enterprise.entity.BehaviorCrowd;
import td.enterprise.service.BehaviorCrowdService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;

import java.net.URI;

/**
 * BehaviorCrowd 自定义客群接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class BehaviorCrowdController extends BaseController {

    private final String BASE_URL = "/api/behaviorCrowds";

    public final static Logger logger = Logger.getLogger(BehaviorCrowdController.class);

    @Autowired
    private BehaviorCrowdService behaviorCrowdService;

    /**
     * 新建自定义客群
     *
     * @param behaviorCrowd
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "新建自定义客群",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "新建自定义客群")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/behaviorCrowds/create", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<BehaviorCrowd> createCrowds(@RequestBody BehaviorCrowd behaviorCrowd) throws Exception {
        behaviorCrowd = behaviorCrowdService.createCrowds(behaviorCrowd);
        return ResponseEntity.created(new URI(BASE_URL)).headers(HeaderUtil.createAlert("A behaviorCrowd is created with identifier " + behaviorCrowd.getId(), behaviorCrowd.getId() + "")).body(behaviorCrowd);
    }

}
