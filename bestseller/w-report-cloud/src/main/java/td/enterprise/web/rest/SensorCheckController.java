package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import td.enterprise.entity.SensorCheck;
import td.enterprise.service.SensorCheckService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;

import java.net.URI;

/**
 * 探针信号强度实时检测接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class SensorCheckController extends BaseController {

	public final static Logger logger = Logger.getLogger(CrowdBlackListController.class);

	private final String BASE_URL = "/api/sensorChecks";
	
	@Autowired
	private SensorCheckService sensorCheckService;

	@Value("${appcode}")
	private String appCode;

	@Value("${apptaken}")
	private String appToken;

	@ApiOperation(value = "创建需要检测的探针",
			httpMethod = "POST",
			response = ResponseEntity.class,
			notes = "创建需要检测的探针")
	@ApiResponses({
			@ApiResponse(code = 201, message = "创建成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/sensorChecks", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<?> create(@RequestBody SensorCheck sensorCheck) throws Exception{
        sensorCheckService.insert(sensorCheck);
		return ResponseEntity.created(new URI(BASE_URL + sensorCheck.getId()))
				.headers(HeaderUtil.createAlert("A sensorcheck is created with identifier " + sensorCheck.getId(), sensorCheck.getId() + ""))
				.body(sensorCheck);
    }

	@ApiOperation(value = "删除检测的探针",
			httpMethod = "DELETE",
			response = ResponseEntity.class,
			notes = "删除检测的探针")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/sensorChecks/{sensorCheckId}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<Void> delete(@PathVariable String sensorCheckId) throws Exception{
        sensorCheckService.deleteByPrimaryKey(sensorCheckId);
		return ResponseEntity.ok().headers(HeaderUtil.createAlert("A sensorcheck is deleted :  " + sensorCheckId, sensorCheckId)).build();

	}
}
