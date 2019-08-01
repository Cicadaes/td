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

import td.enterprise.common.constant.ReportConstants;
import td.enterprise.entity.SensorTest;
import td.enterprise.page.SensorPage;
import td.enterprise.page.SensorTestPage;
import td.enterprise.service.SensorTestService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.vm.SensorTestVM;

import java.net.URI;
import java.util.List;
 
/**
 * SensorTest 探针信号强度测试表接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class SensorTestController extends BaseController{
	
	public final static Logger logger = Logger.getLogger(SensorTestController.class);

	private final String BASE_URL = "/api/sensorTests";

	@Autowired
	private SensorTestService sensorTestService;

	/**
	* 获取查询条件下所有探针信号强度测试表(支持分页)
	* @param page
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "获取查询条件下所有探针信号强度测试表(支持分页)",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "获取查询条件下所有探针信号强度测试表(支持分页)")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/sensorTests", method = RequestMethod.GET) 
	@ResponseBody
	public ResponseEntity<List<SensorTest>> query(SensorTestPage page) throws Exception {
		List<SensorTest> rows = sensorTestService.queryByList(page);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
		return new ResponseEntity<>(rows, headers, HttpStatus.OK);
	}

	/**
	* 新建探针信号强度测试表
	* @param sensorTest
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "新建探针信号强度测试表",
			httpMethod = "POST",
			response = ResponseEntity.class,
			notes = "新建探针信号强度测试表")
	@ApiResponses({
			@ApiResponse(code = 201, message = "创建成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
			})
	@RequestMapping(value = "/sensorTests", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<SensorTest> create(@RequestBody SensorTest sensorTest) throws Exception{
		if (sensorTest.getId() != null){
            return update(sensorTest);
		}else{

            sensorTestService.create(sensorTest);
            return ResponseEntity.created(new URI(BASE_URL + sensorTest.getId()))
                    .headers(HeaderUtil.createAlert("A sensorTest is created with identifier " + sensorTest.getId(), sensorTest.getId() + ""))
                    .body(sensorTest);
        }
    }

	/**
	* 通过主键获取某条探针信号强度测试表数据
	* @param sensorTestId
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "通过主键获取某条探针信号强度测试表数据",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "通过主键获取某条探针信号强度测试表数据")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/sensorTests/{sensorTestId}", method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<SensorTest> find(@PathVariable String sensorTestId) throws Exception{
		SensorTest sensorTest = sensorTestService.selectByPrimaryKey(sensorTestId);
		if(sensorTest == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}else {
			return new ResponseEntity<>(sensorTest, HttpStatus.OK);
		}
    }

	/**
	* 更新探针信号强度测试表
	* @param sensorTest
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "更新探针信号强度测试表",
			httpMethod = "PUT",
			response = ResponseEntity.class,
			notes = "更新探针信号强度测试表")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/sensorTests/{sensorTestId}", method = RequestMethod.PUT, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<SensorTest> update(@RequestBody SensorTest sensorTest) throws Exception{
        sensorTestService.update(sensorTest);
		return ResponseEntity.ok()
				.headers(HeaderUtil.createAlert("A sensorTest is updated " + sensorTest.getId(), sensorTest.getId()+""))
				.body(sensorTest);
	}

	/**
	* 删除探针信号强度测试表
	* @param sensorTestId
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "删除探针信号强度测试表",
			httpMethod = "DELETE",
			response = ResponseEntity.class,
			notes = "删除探针信号强度测试表")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/sensorTests/{sensorTestId}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<Void> delete(@PathVariable String sensorTestId) throws Exception{
		SensorTest sensorTest = sensorTestService.selectByPrimaryKey(sensorTestId);
		if(sensorTest == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		sensorTestService.deleteByPrimaryKey(sensorTestId);
			return ResponseEntity.ok().headers(HeaderUtil.createAlert( "A sensorTest is deleted with identifier " + sensorTestId, sensorTestId)).build();
	}

	@ApiOperation(value = "测试报告调取",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "返回获取测试报告")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/sensorTests/{projectId}/{sensorId}/history", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity <SensorTest> getSensorTests(@PathVariable String projectId , @PathVariable String sensorId ) throws Exception {
		SensorTestPage page = new SensorTestPage();
		page.setSensorId(Integer.parseInt(sensorId));
		page.setProjectId(Integer.parseInt(projectId));
		page.setStatus(ReportConstants.SensorStatus.AVALIABLE);
		SensorTest rows =  sensorTestService.queryBySingle(page);
		return new ResponseEntity<>(rows, HttpStatus.OK);
	}


}
