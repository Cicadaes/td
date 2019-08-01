package td.enterprise.web.rest;

import com.tendcloud.enterprise.um.umic.entity.User;
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

import td.enterprise.common.constant.ReportConstants;
import td.enterprise.entity.WarningConfig;
import td.enterprise.page.WarningConfigPage;
import td.enterprise.service.WarningConfigService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.util.UserInfoUtil;

import java.net.URI;
import java.util.List;
 
/**
 * WarningConfig 预警通知接收设置表接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class WarningConfigController extends BaseController{
	
	public final static Logger logger = Logger.getLogger(WarningConfigController.class);

	private final String BASE_URL = "/api/warningConfigs";

	@Autowired
	private WarningConfigService warningConfigService;


	/**
	 * 更新预警通知接收设置表
	 * @param warningConfig
	 * @return
	 * @throws Exception
	 */
	@ApiOperation(value = "创建预警通知接收设置表",
			httpMethod = "POST",
			response = ResponseEntity.class,
			notes = "更新预警通知接收设置表")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value="/warningConfigs", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<WarningConfig> create(@RequestBody WarningConfig warningConfig) throws Exception{
		if (warningConfig.getId() != null){
			warningConfigService.update(warningConfig);
		}else {
			warningConfigService.create(warningConfig);
		}
		return ResponseEntity.ok()
				.headers(HeaderUtil.createAlert("A warningConfig is updated " + warningConfig.getId(), warningConfig.getId()+""))
				.body(warningConfig);
	}

	/**
	* 通过主键获取某条预警通知接收设置表数据
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "通过主键获取某条预警通知接收设置表数据",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "通过主键获取某条预警通知接收设置表数据")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/warningConfigs", method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<WarningConfig> find() throws Exception{
		WarningConfigPage page = new WarningConfigPage();
		page.setTenantId(UserInfoUtil.getCurrentTenantId());
		WarningConfig warningConfig = warningConfigService.queryBySingle(page);
		return new ResponseEntity<>(warningConfig, HttpStatus.OK);
    }

	/**
	* 更新预警通知接收设置表
	* @param warningConfig
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "更新预警通知接收设置表",
			httpMethod = "PUT",
			response = ResponseEntity.class,
			notes = "更新预警通知接收设置表")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/warningConfigs/{warningConfigId}", method = RequestMethod.PUT, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<WarningConfig> update(@RequestBody WarningConfig warningConfig,@PathVariable String warningConfigId) throws Exception{
		if (warningConfig.getId() != null){
			 warningConfigService.update(warningConfig);
		}else {
			warningConfigService.create(warningConfig);
		}
		return ResponseEntity.ok()
				.headers(HeaderUtil.createAlert("A warningConfig is updated " + warningConfig.getId(), warningConfig.getId()+""))
				.body(warningConfig);
	}

	/**
	* 删除预警通知接收设置表
	* @param warningConfigId
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "删除预警通知接收设置表",
			httpMethod = "DELETE",
			response = ResponseEntity.class,
			notes = "删除预警通知接收设置表")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/warningConfigs/{warningConfigId}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<Void> delete(@PathVariable String warningConfigId) throws Exception{
		WarningConfig warningConfig = warningConfigService.selectByPrimaryKey(warningConfigId);
		if(warningConfig == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		warningConfigService.deleteByPrimaryKey(warningConfigId);
			return ResponseEntity.ok().headers(HeaderUtil.createAlert( "A warningConfig is deleted with identifier " + warningConfigId, warningConfigId)).build();
	}
}
