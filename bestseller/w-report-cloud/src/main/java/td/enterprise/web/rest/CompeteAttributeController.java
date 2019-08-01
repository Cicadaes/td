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

import td.enterprise.entity.CompeteAttribute;
import td.enterprise.page.CompeteAttributePage;
import td.enterprise.service.CompeteAttributeService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;

import java.net.URI;
import java.util.List;
 
/**
 * CompeteAttribute 竞品项目属性接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class CompeteAttributeController extends BaseController{
	
	public final static Logger logger = Logger.getLogger(CompeteAttributeController.class);

	private final String BASE_URL = "/api/competeAttributes";

	@Autowired
	private CompeteAttributeService competeAttributeService;

	/**
	* 获取查询条件下所有竞品项目属性(支持分页)
	* @param page
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "获取查询条件下所有竞品项目属性(支持分页)",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "获取查询条件下所有竞品项目属性(支持分页)")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/competeAttributes", method = RequestMethod.GET) 
	@ResponseBody
	public ResponseEntity<List<CompeteAttribute>> query(CompeteAttributePage page) throws Exception {
		List<CompeteAttribute> rows = competeAttributeService.queryByList(page);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
		return new ResponseEntity<>(rows, headers, HttpStatus.OK);
	}

	/**
	* 新建竞品项目属性
	* @param competeAttribute
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "新建竞品项目属性",
			httpMethod = "POST",
			response = ResponseEntity.class,
			notes = "新建竞品项目属性")
	@ApiResponses({
			@ApiResponse(code = 201, message = "创建成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
			})
	@RequestMapping(value = "/competeAttributes", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<CompeteAttribute> create(@RequestBody CompeteAttribute competeAttribute) throws Exception{
		if (competeAttribute.getId() != null) {
			return update(competeAttribute);
		} else {
			competeAttributeService.create(competeAttribute);
			return ResponseEntity.created(new URI(BASE_URL + "/" + competeAttribute.getId()))
					.headers(HeaderUtil.createAlert("A competeAttribute is created with identifier " + competeAttribute.getId(), competeAttribute.getId() + ""))
					.body(competeAttribute);
		}
    }

	/**
	* 通过主键获取某条竞品项目属性数据
	* @param competeAttributeId
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "通过主键获取某条竞品项目属性数据",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "通过主键获取某条竞品项目属性数据")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/competeAttributes/{competeAttributeId}", method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<CompeteAttribute> find(@PathVariable String competeAttributeId) throws Exception{
		CompeteAttribute competeAttribute = competeAttributeService.selectByPrimaryKey(competeAttributeId);
		if(competeAttribute == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}else {
			return new ResponseEntity<>(competeAttribute, HttpStatus.OK);
		}
    }

	/**
	* 更新竞品项目属性
	* @param competeAttribute
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "更新竞品项目属性",
			httpMethod = "POST",
			response = ResponseEntity.class,
			notes = "更新竞品项目属性")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/competeAttributes/update", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<CompeteAttribute> update(@RequestBody CompeteAttribute competeAttribute) throws Exception{
        competeAttributeService.updateDispose(competeAttribute);
		return ResponseEntity.ok()
				.headers(HeaderUtil.createAlert("A competeAttribute is updated " + competeAttribute.getId(), competeAttribute.getId() + ""))
				.body(competeAttribute);
	}

	/**
	* 删除竞品项目属性
	* @param competeAttributeId
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "删除竞品项目属性",
			httpMethod = "DELETE",
			response = ResponseEntity.class,
			notes = "删除竞品项目属性")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/competeAttributes/{competeAttributeId}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<Void> delete(@PathVariable String competeAttributeId) throws Exception{
		CompeteAttribute competeAttribute = competeAttributeService.selectByPrimaryKey(competeAttributeId);
		if(competeAttribute == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		competeAttributeService.deleteByPrimaryKey(competeAttributeId);
			return ResponseEntity.ok().headers(HeaderUtil.createAlert( "A competeAttribute is deleted with identifier " + competeAttributeId, competeAttributeId)).build();
	}
}
