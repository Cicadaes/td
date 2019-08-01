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

import td.enterprise.entity.MetricMonthActive;
import td.enterprise.page.MetricMonthActivePage;
import td.enterprise.service.MetricMonthActiveService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;

import java.net.URI;
import java.util.List;
 
/**
 * MetricMonthActive 排行榜周表接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class MetricMonthActiveController extends BaseController{
	
	public final static Logger logger = Logger.getLogger(MetricMonthActiveController.class);

	private final String BASE_URL = "/api/metricMonthActives";

	@Autowired
	private MetricMonthActiveService metricMonthActiveService;

	/**
	* 获取查询条件下所有排行榜周表(支持分页)
	* @param page
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "获取查询条件下所有排行榜周表(支持分页)",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "获取查询条件下所有排行榜周表(支持分页)")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/metricMonthActives", method = RequestMethod.GET) 
	@ResponseBody
	public ResponseEntity<List<MetricMonthActive>> query(MetricMonthActivePage page) throws Exception {
		List<MetricMonthActive> rows = metricMonthActiveService.queryByList(page);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
		return new ResponseEntity<>(rows, headers, HttpStatus.OK);
	}

	/**
	* 新建排行榜周表
	* @param metricMonthActive
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "新建排行榜周表",
			httpMethod = "POST",
			response = ResponseEntity.class,
			notes = "新建排行榜周表")
	@ApiResponses({
			@ApiResponse(code = 201, message = "创建成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
			})
	@RequestMapping(value = "/metricMonthActives", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<MetricMonthActive> create(@RequestBody MetricMonthActive metricMonthActive) throws Exception{
        metricMonthActiveService.insert(metricMonthActive);
		return ResponseEntity.created(new URI(BASE_URL + "/" + metricMonthActive.getId()))
				.headers(HeaderUtil.createAlert("A metricMonthActive is created with identifier " + metricMonthActive.getId(), metricMonthActive.getId() + ""))
				.body(metricMonthActive);
    }

	/**
	* 通过主键获取某条排行榜周表数据
	* @param metricMonthActiveId
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "通过主键获取某条排行榜周表数据",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "通过主键获取某条排行榜周表数据")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/metricMonthActives/{metricMonthActiveId}", method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<MetricMonthActive> find(@PathVariable String metricMonthActiveId) throws Exception{
		MetricMonthActive metricMonthActive = metricMonthActiveService.selectByPrimaryKey(metricMonthActiveId);
		if(metricMonthActive == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}else {
			return new ResponseEntity<>(metricMonthActive, HttpStatus.OK);
		}
    }

	/**
	* 更新排行榜周表
	* @param metricMonthActive
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "更新排行榜周表",
			httpMethod = "PUT",
			response = ResponseEntity.class,
			notes = "更新排行榜周表")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/metricMonthActives/{metricMonthActiveId}", method = RequestMethod.PUT, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<MetricMonthActive> update(@RequestBody MetricMonthActive metricMonthActive) throws Exception{
        metricMonthActiveService.updateByPrimaryKeySelective(metricMonthActive);
		return ResponseEntity.ok()
				.headers(HeaderUtil.createAlert("A metricMonthActive is updated " + metricMonthActive.getId(), metricMonthActive.getId() + ""))
				.body(metricMonthActive);
	}

	/**
	* 删除排行榜周表
	* @param metricMonthActiveId
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "删除排行榜周表",
			httpMethod = "DELETE",
			response = ResponseEntity.class,
			notes = "删除排行榜周表")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/metricMonthActives/{metricMonthActiveId}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<Void> delete(@PathVariable String metricMonthActiveId) throws Exception{
		MetricMonthActive metricMonthActive = metricMonthActiveService.selectByPrimaryKey(metricMonthActiveId);
		if(metricMonthActive == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		metricMonthActiveService.deleteByPrimaryKey(metricMonthActiveId);
			return ResponseEntity.ok().headers(HeaderUtil.createAlert( "A metricMonthActive is deleted with identifier " + metricMonthActiveId, metricMonthActiveId)).build();
	}
}
