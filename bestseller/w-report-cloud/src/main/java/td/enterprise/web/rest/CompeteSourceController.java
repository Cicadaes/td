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
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.entity.CompeteSource;
import td.enterprise.page.CompeteSourcePage;
import td.enterprise.service.CompeteSourceService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;

import java.net.URI;
import java.util.List;
 
/**
 * CompeteSource 竞品数据源表接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class CompeteSourceController extends BaseController {

	public final static Logger logger = Logger.getLogger(CompeteSourceController.class);

	private final String BASE_URL = "/api/competeSources";

	@Autowired
	private CompeteSourceService competeSourceService;

	/**
	 * 获取查询条件下所有竞品数据源表(支持分页)
	 *
	 * @param page
	 * @return
	 * @throws Exception
	 */
	@ApiOperation(value = "获取查询条件下所有竞品数据源表(支持分页)",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "获取查询条件下所有竞品数据源表(支持分页)")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/competeSources", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity <List <CompeteSource>> query(CompeteSourcePage page) throws Exception {
		List <CompeteSource> rows = competeSourceService.queryByList(page);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
		return new ResponseEntity <>(rows, headers, HttpStatus.OK);
	}

	/**
	 * 新建竞品数据源表
	 *
	 * @param competeSource
	 * @return
	 * @throws Exception
	 */
	@ApiOperation(value = "新建竞品数据源表",
			httpMethod = "POST",
			response = ResponseEntity.class,
			notes = "新建竞品数据源表")
	@ApiResponses({
			@ApiResponse(code = 201, message = "创建成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/competeSources", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity <CompeteSource> create(@RequestBody CompeteSource competeSource) throws Exception {
		if (competeSource.getId() != null) {
			return update(competeSource);
		} else {
			competeSourceService.create(competeSource);
			return ResponseEntity.created(new URI(BASE_URL + ReportConstants.Punctuation.SLASH + competeSource.getId()))
					.headers(HeaderUtil.createAlert("A competeSource is created with identifier " + competeSource.getId(), competeSource.getId() + ""))
					.body(competeSource);

		}
	}

	/**
	 * 通过主键获取某条竞品数据源表数据
	 *
	 * @param competeSourceId
	 * @return
	 * @throws Exception
	 */
	@ApiOperation(value = "通过主键获取某条竞品数据源表数据",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "通过主键获取某条竞品数据源表数据")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/competeSources/{competeSourceId}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity <CompeteSource> find(@PathVariable String competeSourceId) throws Exception {
		CompeteSource competeSource = competeSourceService.selectByPrimaryKey(competeSourceId);
		if (competeSource == null) {
			return new ResponseEntity <>(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity <>(competeSource, HttpStatus.OK);
		}
	}

	/**
	 * 更新竞品数据源表
	 *
	 * @param competeSource
	 * @return
	 * @throws Exception
	 */
	@ApiOperation(value = "更新竞品数据源表",
			httpMethod = "PUT",
			response = ResponseEntity.class,
			notes = "更新竞品数据源表")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/competeSources/{competeSourceId}", method = RequestMethod.PUT, consumes = "application/json")
	@ResponseBody
	public ResponseEntity <CompeteSource> update(@RequestBody CompeteSource competeSource) throws Exception {
		competeSourceService.update(competeSource);
		return ResponseEntity.ok()
				.headers(HeaderUtil.createAlert("A competeSource is updated " + competeSource.getId(), competeSource.getId() + ""))
				.body(competeSource);
	}

	/**
	 * 删除竞品数据源表
	 *
	 * @param competeSourceId
	 * @return
	 * @throws Exception
	 */
	@ApiOperation(value = "删除竞品数据源表",
			httpMethod = "DELETE",
			response = ResponseEntity.class,
			notes = "删除竞品数据源表")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/competeSources/{competeSourceId}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity <Void> delete(@PathVariable String competeSourceId) throws Exception {
		CompeteSource competeSource = competeSourceService.selectByPrimaryKey(competeSourceId);
		if (competeSource == null) {
			return new ResponseEntity <>(HttpStatus.NOT_FOUND);
		}
		competeSourceService.deleteByPrimaryKey(competeSourceId);
		return ResponseEntity.ok().headers(HeaderUtil.createAlert("A competeSource is deleted with identifier " + competeSourceId, competeSourceId)).build();
	}

	/**
	 * 竞品数据源导入
	 *
	 * @param file
	 * @param competeId
	 * @param fileType
	 * @return
	 * @throws Exception
	 */
	@ApiOperation(value = "竞品数据源导入",
			httpMethod = "POST",
			response = ResponseEntity.class,
			notes = "竞品数据源导入")
	@ApiResponses({
			@ApiResponse(code = 201, message = "创建成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/competeSources/batch-import", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity <List <String>> batchImport(MultipartFile file, @RequestParam(value = "competeId") String competeId, @RequestParam(value = "fileType") int fileType) throws Exception {
		List <String> errorMsg = competeSourceService.batchImport(file, competeId, fileType);
		return new ResponseEntity <>(errorMsg, HttpStatus.OK);
	}
}
