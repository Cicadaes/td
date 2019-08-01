package td.enterprise.web.rest;

import com.alibaba.fastjson.JSONObject;
import com.tendcloud.enterprise.um.umic.rmi.BusinessException;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.UserInfoUtil;

@Slf4j
@Controller
@RequestMapping("/api")
public class SystemController extends BaseController {

  public final static Logger logger = Logger.getLogger(SystemController.class);

  @ApiOperation(value = "切换当前租户ID",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "切换当前租户ID")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/changeTenant/{tenantId}", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity changeTenantId(@PathVariable("tenantId") String tenantId) {
    String before = UserInfoUtil.getCurrentTenantId();
    UserInfoUtil.changeCurrentTenantId(tenantId);
    JSONObject result = new JSONObject();
    result.put("before", before);
    result.put("after", tenantId);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @ApiOperation(value = "获取当前租户",
      httpMethod = "GET",
      response = ResponseEntity.class,
      notes = "获取当前租户")
  @ApiResponses({
      @ApiResponse(code = 200, message = "成功"),
      @ApiResponse(code = 500, message = "服务器处理异常")
  })
  @RequestMapping(value = "/getCurrentTenant", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity getCurrentTenant() throws BusinessException {
    return new ResponseEntity<>(UserInfoUtil.getCurrentTenant(), HttpStatus.OK);
  }

}
