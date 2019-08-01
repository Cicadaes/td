package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import td.enterprise.entity.Project;
import td.enterprise.entity.ProjectAttachment;
import td.enterprise.entity.Threshold;
import td.enterprise.page.ProjectAttachmentPage;
import td.enterprise.page.ThresholdPage;
import td.enterprise.service.CrowdBlackListService;
import td.enterprise.service.CrowdSalesListService;
import td.enterprise.service.ProjectAttachmentService;
import td.enterprise.service.ProjectService;
import td.enterprise.service.ThresholdService;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.vm.ThresholdVM;

/**
 * Threshold 阈值表接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class ThresholdController extends BaseController{

	public final static Logger logger = Logger.getLogger(ThresholdController.class);

	private final String BASE_URL = "/api/thresholds";

	@Autowired
	private ThresholdService thresholdService;

	@Autowired
	private ProjectService projectService;

	@Autowired
    private CrowdBlackListService crowdBlackListService;

	@Autowired
    private CrowdSalesListService crowdSalesListService;

	@Autowired
    private ProjectAttachmentService attachmentService;

	/**
	* 获取查询条件下所有阈值表
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "获取查询条件下所有阈值表",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "获取查询条件下所有阈值表")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/thresholds/queryByProjectId", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<ThresholdVM>> queryByProjectId(String projectId) throws Exception {
		ThresholdPage page = new ThresholdPage();
		if (projectId != null && !"".equals(projectId)) {
			page.setProjectId(Integer.valueOf(projectId));
		}
		List<ThresholdVM> rows = thresholdService.queryThresholdByList(page);
		return new ResponseEntity<>(rows, HttpStatus.OK);
	}

	/**
	* 获取多个项目阈值设置
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "获取多个项目阈值设置",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "获取多个项目阈值设置")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/thresholds/queryByProjectIds", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<ThresholdVM>> queryByProjectIds(String projectId) throws Exception {
		List<ThresholdVM> rows = thresholdService.queryThresholdByProjectIds(projectId);
		return new ResponseEntity<>(rows, HttpStatus.OK);
	}

	/**
	* 获取查询条件下所有阈值表(支持分页)
	* @param page
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "获取查询条件下所有阈值表(支持分页)",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "获取查询条件下所有阈值表(支持分页)")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/thresholds", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<ThresholdVM>> query(ThresholdPage page) throws Exception {
		List<ThresholdVM> rows = thresholdService.queryThresholdByList(page);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
		return new ResponseEntity<>(rows, headers, HttpStatus.OK);
	}

	/**
	* 通过主键获取某条阈值表数据
	* @param thresholdId
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "通过主键获取某条阈值表数据",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "通过主键获取某条阈值表数据")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/thresholds/{thresholdId}", method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<Threshold> find(@PathVariable String thresholdId) throws Exception{
		Threshold threshold = thresholdService.selectByPrimaryKey(thresholdId);
		if(threshold == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}else {
			return new ResponseEntity<>(threshold, HttpStatus.OK);
		}
    }

	/**
     * 上传文件
     *
     * @param file
     * @param projectId
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "上传文件",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "上传文件")
    @ApiResponses({
            @ApiResponse(code = 201, message = "上传文件成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/thresholds/upload", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<List<?>> upload(MultipartFile file, @RequestParam(value = "projectId") String projectId, @RequestParam(value = "type") int type) throws Exception {
        // type : 0-黑名单 5-店员名单
    	List<ProjectAttachment> list = thresholdService.upload(file, projectId, type); //上传成功则返回附件ID
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    /**
     * 下载文件
     *
     * @param attachmentPath 文件路径
     * @return
     * @throws Exception
     */
    @SuppressWarnings("resource")
	@ApiOperation(value = "下载文件",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "下载文件")
    @ApiResponses({
            @ApiResponse(code = 201, message = "下载文件成功"),
            @ApiResponse(code = 404, message = "资源不存在"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/thresholds/download", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<byte[]> download(String attachmentPath) throws Exception {
    	if (StringUtils.isEmpty(attachmentPath)) {
    		return new ResponseEntity<byte[]>(null, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    	}
    	File file=new File(attachmentPath);
        //处理显示中文文件名的问题
        String fileName=new String(file.getName().getBytes("utf-8"),"ISO-8859-1");
        // 处理文件名  还原为原文件名
        String temp = fileName.substring(fileName.indexOf("_") + 1);
		fileName = temp.substring(temp.indexOf("_") + 1);
        //设置请求头内容,告诉浏览器代开下载窗口
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment",fileName);//告知浏览器以下载方式打开
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);//设置MIME类型

        FileInputStream fileInputStream = new FileInputStream(file);
        BufferedInputStream bufferedInputStream = new BufferedInputStream(
                fileInputStream);
        byte[] b = new byte[bufferedInputStream.available()];
        bufferedInputStream.read(b);
        return new ResponseEntity<byte[]>(b, headers, HttpStatus.CREATED);
    }

	/**
     * 创建阈值
     * <p>
     * 创建或更新阈值
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "创建阈值",
            httpMethod = "POST",
            response = ResponseEntity.class,
            notes = "创建阈值")
    @ApiResponses({
            @ApiResponse(code = 201, message = "创建成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })

    @RequestMapping(value = "/thresholds", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<?> create(@RequestBody ThresholdVM thresholdVM) throws Exception {

    	List<Threshold> resultList = new ArrayList<Threshold>();

    	String projectId = thresholdVM.getProjectIds();

    	if (projectId == null || "".equals(projectId)) {
    		return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert("Threshold", "projectId is null", URLEncoder.encode("店铺ID为空", "UTF-8")))
                    .body(null);
    	}

    	String[] projectIds = projectId.split(",");

    	if (projectIds.length > 0) {
	    	for (int i = 0; i < projectIds.length; i++) {
				// 上传店员名单
	    		Integer salesListId = thresholdVM.getSalesListId();
	    		if (salesListId != null && !"".equals(salesListId)) {
	    			ProjectAttachmentPage salesAttPage = new ProjectAttachmentPage();
	    			salesAttPage.setId(salesListId);
//	    			salesAttPage.setAttr2(projectIds[i]);
	    			ProjectAttachment attachment = attachmentService.getLastByProjectIdAndType(salesAttPage);
	    			if (attachment != null) {
	    				String filePath = attachment.getAttr4();
	    				if (filePath != null) {
	    					List<String> errorMsg = crowdSalesListService.batchImport(attachment, Integer.valueOf(projectIds[i]));
	    				}
	    			}
	    		}
	    		// 上传黑名单
	    		Integer blackListId = thresholdVM.getBlackListId();
	    		if (blackListId != null && !"".equals(blackListId)) {
	    			ProjectAttachmentPage blackAttPage = new ProjectAttachmentPage();
	    			blackAttPage.setId(blackListId);
//	    			blackAttPage.setAttr2(projectIds[i]);
	    			ProjectAttachment attachment = attachmentService.getLastByProjectIdAndType(blackAttPage);
	    			if (attachment != null) {
	    				String filePath = attachment.getAttr4();
	    				if (filePath != null) {
	    					List<String> errorMsg = crowdBlackListService.batchImport(attachment, Integer.valueOf(projectIds[i]));
	    				}
	    			}
	    		}
	    		if (!StringUtils.isEmpty(thresholdVM.getOpeningTime()) && !StringUtils.isEmpty(thresholdVM.getClosingTime())) {
    				Project project = new Project();
    				project.setId(Integer.valueOf(projectIds[i]));
    				project.setOpeningTime(thresholdVM.getOpeningTime());
    				project.setClosingTime(thresholdVM.getClosingTime());
    				projectService.updateByPrimaryKeySelective(project);
    			}
	    		ThresholdPage page = new ThresholdPage();
	    		page.setProjectId(Integer.valueOf(projectIds[i]));
	    		// 查询该店铺阈值
	    		List<Threshold> list = thresholdService.queryByList(page);
	    		if (list != null && list.size() > 0) {
	    			// 支持更新
	    			Threshold t = list.get(0);
	    			ThresholdVM vm = thresholdVM;
	    			vm.setId(t.getId());
	    			vm.setProjectId(t.getProjectId());
	    			Threshold threshold = thresholdService.update(vm);
	    			resultList.add(threshold);
	    		} else {
	    			// 保存阈值
	    			ThresholdVM vm = thresholdVM;
	    			vm.setProjectId(Integer.valueOf(projectIds[i]));
	    			Threshold threshold = thresholdService.create(vm);
	    			resultList.add(threshold);
	    		}
			}
    	}

    	if (resultList != null && resultList.size() == projectIds.length) {
    		return ResponseEntity.ok()
                    .headers(HeaderUtil.createAlert("project threshold is create & updated with identifier " + projectId, projectId + ""))
                    .body(resultList);
    	} else {
    		return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert("Threshold", "projectId is null", URLEncoder.encode("店铺ID为空", "UTF-8")))
                    .body(null);
    	}

    }

	/**
	* 更新阈值表
	* @param threshold
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "更新阈值表",
			httpMethod = "PUT",
			response = ResponseEntity.class,
			notes = "更新阈值表")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/thresholds/{thresholdId}", method = RequestMethod.PUT, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<Threshold> update(@RequestBody Threshold threshold) throws Exception{
        thresholdService.updateByPrimaryKeySelective(threshold);
		return ResponseEntity.ok()
				.headers(HeaderUtil.createAlert("A threshold is updated " + threshold.getId(), threshold.getId() + ""))
				.body(threshold);
	}

	/**
	* 删除阈值表
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "通过ProjectId删除阈值表",
			httpMethod = "DELETE",
			response = ResponseEntity.class,
			notes = "通过ProjectId删除阈值表")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/thresholds/{projectId}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<Void> deleteByProjectId(@PathVariable String projectId) throws Exception{
		if(projectId == null || "".equals(projectId)){
//			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			return ResponseEntity.ok().headers(HeaderUtil.createAlert("projectId is null", projectId)).build();
		}
		ThresholdPage page = new ThresholdPage();
		page.setProjectId(Integer.valueOf(projectId));
		Threshold threshold = thresholdService.queryBySingle(page);
		if(threshold == null){
//			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			return ResponseEntity.ok().headers(HeaderUtil.createAlert("The Project Threshold is not Found", projectId)).build();
		}
		Integer thresholdId = threshold.getId();
		thresholdService.deleteByPrimaryKey(thresholdId);
		return ResponseEntity.ok().headers(HeaderUtil.createAlert( "A threshold is deleted with identifier " + thresholdId, thresholdId + "")).build();
	}

}
