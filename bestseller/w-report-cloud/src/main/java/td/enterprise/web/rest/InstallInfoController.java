package td.enterprise.web.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import td.enterprise.entity.BsUser;
import td.enterprise.entity.Project;
import td.enterprise.page.InstallInfoPage;
import td.enterprise.service.InstallInfoService;
import td.enterprise.service.ProjectService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.InstallInfoWithInfoVM;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * InstallInfo 安装归属表接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class InstallInfoController extends BaseController{
	
	public final static Logger logger = Logger.getLogger(InstallInfoController.class);

	private final String BASE_URL = "/api/installInfos";

	@Autowired
	private InstallInfoService installInfoService;

	@Autowired
	private ProjectService projectService;
	/**
	* 获取查询条件下所有安装归属表(支持分页)
	* @param page
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "获取查询条件下所有安装归属表(支持分页)",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "获取查询条件下所有安装归属表(支持分页)")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/installInfos", method = RequestMethod.GET) 
	@ResponseBody
	public ResponseEntity<List<InstallInfoWithInfoVM>> query(InstallInfoPage page) throws Exception {
		List <InstallInfoWithInfoVM> installInfoWithInfoVMS = installInfoService.queryByListWithInfo(page);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
		return new ResponseEntity<>(installInfoWithInfoVMS, headers, HttpStatus.OK);
	}

	@ApiOperation(value = "获取查询条件下所有安装归属表(支持分页)",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "获取查询条件下所有安装归属表(支持分页)")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})

	@RequestMapping(value = "/installInfos/sensor4Shop", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<InstallInfoWithInfoVM>> querySensor4Shop(InstallInfoPage page) throws Exception {
		List <InstallInfoWithInfoVM> installInfoWithInfoVMS = installInfoService.queryByListSensor4Shop(page);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
		return new ResponseEntity<>(installInfoWithInfoVMS, headers, HttpStatus.OK);
	}

	/**
	* 更新安装归属表新方法
	* @param installInfo
	* @return
	* @throws Exception
	*/
	@ApiOperation(value = "更新安装归属表",
			httpMethod = "PUT",
			response = ResponseEntity.class,
			notes = "更新安装归属表")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
    @RequestMapping(value="/installInfos/updateNew", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<String> updateNew(@RequestBody Map installInfo) throws Exception{
		ObjectMapper om = new ObjectMapper();
		String msg = installInfoService.updateNew(installInfo);

		Map<String, Object> appConfig = new HashMap<String, Object>();
		appConfig.put("msg", msg);

		String json = "";
		try {
			json = om.writeValueAsString(appConfig);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok()
				.headers(HeaderUtil.createAlert("A installInfo is updated " + installInfo.toString(), installInfo.toString()))
				.body(json);
	}


	@ApiOperation(value = "清空店铺信息表中的图片信息，删除探针部署信息中关于该店铺的信息",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "清空店铺信息表中的图片信息，删除探针部署信息中关于该店铺的信息")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})

	@RequestMapping(value = "/installInfos/restore", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String> restore(Project project) throws Exception{
		boolean updateFlag = false;
		String msg ="当前用户不得清空图纸";
		String ProjectNum = projectService.selectByPrimaryKey(project.getId()).getProjectNum();

		User user = UserInfoUtil.getUser();

		List<BsUser> bsUserList = projectService.getBsUserByUserId(user.getUmid());
		if(bsUserList.size()>0){
			String groupSignFlag = bsUserList.get(0).getGroupSign().trim();
			if("N".equalsIgnoreCase(groupSignFlag)){
				for(BsUser tmpBsUser:bsUserList){
					if(ProjectNum.equals(tmpBsUser.getShopCode())){
						updateFlag = true;
						break;
					}
				}
			}else if("无".equalsIgnoreCase(groupSignFlag)){
				updateFlag = true;
			}
		}

		ObjectMapper om = new ObjectMapper();
		if(updateFlag){
			// 清空店铺信息表中的图片信息，删除探针部署信息中关于该店铺的信息
			project.setPicUrl(null);
			msg = projectService.updatePicUrlById(project);

			// CLEAR  TD_INSTALL_INFO 表中属于当前店铺的信息
			installInfoService.cleanInstallOfShop(project);
		}

		Map<String, Object> appConfig = new HashMap<String, Object>();
		appConfig.put("msg", msg);
		String json = "";
		try {
			json = om.writeValueAsString(appConfig);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok()
				.headers(HeaderUtil.createAlert("A Project is updated " + project.toString(), project.toString()))
				.body(json);
	}

}
