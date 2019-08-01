package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import td.enterprise.entity.SensorCheckLog;
import td.enterprise.page.SensorCheckLogPage;
import td.enterprise.service.SensorCheckLogService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.PaginationUtil;

import java.util.List;

/**
 * 探针信号强度实时检测接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class SensorCheckLogController extends BaseController {
	
	public final static Logger logger = Logger.getLogger(SensorCheckLogController.class);
	private final String BASE_URL = "/api/sensorCheckLogs";

	@Autowired
	private SensorCheckLogService sensorCheckLogService;


	@Value("${appcode}")
	private String appCode;

	@Value("${apptaken}")
	private String appToken;

	@ApiOperation(value = "返回所有需要检测的探针日志",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "返回所有需要检测的探针日志")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/sensorCheckLogs", method = RequestMethod.GET) 
	@ResponseBody
	public ResponseEntity<List<SensorCheckLog>> query(SensorCheckLogPage page) throws Exception {
		List<SensorCheckLog> rows = sensorCheckLogService.queryByList(page);
		page.getPager().setRowCount(rows.size());
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
		return new ResponseEntity<>(rows, headers, HttpStatus.OK);
	}
}
