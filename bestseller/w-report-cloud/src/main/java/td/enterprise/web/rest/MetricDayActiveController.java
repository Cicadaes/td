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

import td.enterprise.entity.MetricDayActive;
import td.enterprise.page.MetricDayActivePage;
import td.enterprise.service.MetricDayActiveService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;

import java.net.URI;
import java.util.List;
 
/**
 * MetricDayActive 排行榜周表接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class MetricDayActiveController extends BaseController{
	
	public final static Logger logger = Logger.getLogger(MetricDayActiveController.class);

	private final String BASE_URL = "/api/metricDayActives";

	@Autowired
	private MetricDayActiveService metricDayActiveService;

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
	@RequestMapping(value = "/metricDayActives", method = RequestMethod.GET) 
	@ResponseBody
	public ResponseEntity<List<MetricDayActive>> query(MetricDayActivePage page) throws Exception {
		List<MetricDayActive> rows = metricDayActiveService.queryByList(page);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
		return new ResponseEntity<>(rows, headers, HttpStatus.OK);
	}

	/**
	* 新建排行榜周表
	* @param metricDayActive
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
	@RequestMapping(value = "/metricDayActives", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<MetricDayActive> create(@RequestBody MetricDayActive metricDayActive) throws Exception{
        metricDayActiveService.insert(metricDayActive);
		return ResponseEntity.created(new URI(BASE_URL+ "/" + metricDayActive.getId()) )
				.headers(HeaderUtil.createAlert("A metricDayActive is created with identifier " + metricDayActive.getId(), metricDayActive.getId() + ""))
				.body(metricDayActive);
    }

	/**
	* 通过主键获取某条排行榜周表数据
	* @param metricDayActiveId
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
    @RequestMapping(value="/metricDayActives/{metricDayActiveId}", method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<MetricDayActive> find(@PathVariable String metricDayActiveId) throws Exception{
		MetricDayActive metricDayActive = metricDayActiveService.selectByPrimaryKey(metricDayActiveId);
		if(metricDayActive == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}else {
			return new ResponseEntity<>(metricDayActive, HttpStatus.OK);
		}
    }

	/**
	* 更新排行榜周表
	* @param metricDayActive
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
    @RequestMapping(value="/metricDayActives/{metricDayActiveId}", method = RequestMethod.PUT, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<MetricDayActive> update(@RequestBody MetricDayActive metricDayActive) throws Exception{
        metricDayActiveService.updateByPrimaryKeySelective(metricDayActive);
		return ResponseEntity.ok()
				.headers(HeaderUtil.createAlert("A metricDayActive is updated " + metricDayActive.getId(), metricDayActive.getId() + ""))
				.body(metricDayActive);
	}

	/**
	* 删除排行榜周表
	* @param metricDayActiveId
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
    @RequestMapping(value="/metricDayActives/{metricDayActiveId}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<Void> delete(@PathVariable String metricDayActiveId) throws Exception{
		MetricDayActive metricDayActive = metricDayActiveService.selectByPrimaryKey(metricDayActiveId);
		if(metricDayActive == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		metricDayActiveService.deleteByPrimaryKey(metricDayActiveId);
			return ResponseEntity.ok().headers(HeaderUtil.createAlert( "A metricDayActive is deleted with identifier " + metricDayActiveId, metricDayActiveId)).build();
	}
}
