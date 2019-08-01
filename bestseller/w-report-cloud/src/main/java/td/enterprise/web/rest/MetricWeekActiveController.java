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

import td.enterprise.entity.MetricWeekActive;
import td.enterprise.page.MetricWeekActivePage;
import td.enterprise.service.MetricWeekActiveService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;

import java.net.URI;
import java.util.List;
 
/**
 * MetricWeekActive 排行榜周表接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class MetricWeekActiveController extends BaseController{
	
	public final static Logger logger = Logger.getLogger(MetricWeekActiveController.class);

	private final String BASE_URL = "/api/metricWeekActives";

	@Autowired
	private MetricWeekActiveService metricWeekActiveService;

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
	@RequestMapping(value = "/metricWeekActives", method = RequestMethod.GET) 
	@ResponseBody
	public ResponseEntity<List<MetricWeekActive>> query(MetricWeekActivePage page) throws Exception {
		List<MetricWeekActive> rows = metricWeekActiveService.queryByList(page);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
		return new ResponseEntity<>(rows, headers, HttpStatus.OK);
	}

	/**
	* 新建排行榜周表
	* @param metricWeekActive
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
	@RequestMapping(value = "/metricWeekActives", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<MetricWeekActive> create(@RequestBody MetricWeekActive metricWeekActive) throws Exception{
        metricWeekActiveService.insert(metricWeekActive);
		return ResponseEntity.created(new URI(BASE_URL + "/" + metricWeekActive.getId()))
				.headers(HeaderUtil.createAlert("A metricWeekActive is created with identifier " + metricWeekActive.getId(), metricWeekActive.getId() + ""))
				.body(metricWeekActive);
    }

	/**
	* 通过主键获取某条排行榜周表数据
	* @param metricWeekActiveId
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
    @RequestMapping(value="/metricWeekActives/{metricWeekActiveId}", method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<MetricWeekActive> find(@PathVariable String metricWeekActiveId) throws Exception{
		MetricWeekActive metricWeekActive = metricWeekActiveService.selectByPrimaryKey(metricWeekActiveId);
		if(metricWeekActive == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}else {
			return new ResponseEntity<>(metricWeekActive, HttpStatus.OK);
		}
    }

	/**
	* 更新排行榜周表
	* @param metricWeekActive
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
    @RequestMapping(value="/metricWeekActives/{metricWeekActiveId}", method = RequestMethod.PUT, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<MetricWeekActive> update(@RequestBody MetricWeekActive metricWeekActive) throws Exception{
        metricWeekActiveService.updateByPrimaryKeySelective(metricWeekActive);
		return ResponseEntity.ok()
				.headers(HeaderUtil.createAlert("A metricWeekActive is updated " + metricWeekActive.getId(), metricWeekActive.getId() + ""))
				.body(metricWeekActive);
	}

	/**
	* 删除排行榜周表
	* @param metricWeekActiveId
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
    @RequestMapping(value="/metricWeekActives/{metricWeekActiveId}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<Void> delete(@PathVariable String metricWeekActiveId) throws Exception{
		MetricWeekActive metricWeekActive = metricWeekActiveService.selectByPrimaryKey(metricWeekActiveId);
		if(metricWeekActive == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		metricWeekActiveService.deleteByPrimaryKey(metricWeekActiveId);
			return ResponseEntity.ok().headers(HeaderUtil.createAlert( "A metricWeekActive is deleted with identifier " + metricWeekActiveId, metricWeekActiveId)).build();
	}
}
