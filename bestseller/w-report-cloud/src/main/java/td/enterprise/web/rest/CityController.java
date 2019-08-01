package td.enterprise.web.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import td.enterprise.entity.City;
import td.enterprise.entity.Project;
import td.enterprise.page.CityPage;
import td.enterprise.page.InstallInfoPage;
import td.enterprise.service.CityService;
import td.enterprise.service.InstallInfoService;
import td.enterprise.service.ProjectService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.HeaderUtil;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.vm.InstallInfoWithInfoVM;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * InstallInfo 安装归属表接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class CityController extends BaseController{
	
	public final static Logger logger = Logger.getLogger(CityController.class);

	private final String BASE_URL = "/api/city";

	@Autowired
	private CityService cityService;

	/**
	 * 获取查询条件下所有City(支持分页)
	 * @param page
	 * @return
	 * @throws Exception
	 */

	@ApiOperation(value = "获取查询条件下所有City(支持分页)",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "获取查询条件下所有City(支持分页)")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/pageList", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<City>> query(CityPage page) throws Exception {
		List <City> CityS = cityService.queryByList(page);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
		return new ResponseEntity<>(CityS, headers, HttpStatus.OK);
	}



	@ApiOperation(value = "通过省份名称查询该省份下的城市等级合集",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "通过省份名称查询该省份下的城市等级合集")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 400, message = "未授权获取资源"),
			@ApiResponse(code = 404, message = "资源不存在"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value="/getSonLevel", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String> selectSonLevel(City city) throws Exception{
		ObjectMapper om = new ObjectMapper();
		String msg = cityService.selectSonLevel(URLDecoder.decode(city.getProvince(), "UTF8"));

		final Map<String, String> transMap = new HashMap<String, String>();
		transMap.put("1","一线城市");
		transMap.put("2","二线城市");
		transMap.put("3","三线城市");
		transMap.put("-1","其他");

		List<Object> appConfig = new ArrayList<Object>();
		String[] arrs = msg.split(",");
		for(String tmp:arrs){
			Map<String, String> innerMap = new HashMap<String, String>();
			innerMap.put("type",tmp);
			innerMap.put("levelName",transMap.get(tmp));

			appConfig.add(innerMap);
		}
		String json = "";
		try {
			json = om.writeValueAsString(appConfig);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok()
				.headers(HeaderUtil.createAlert("A cityLevel get " + msg, msg))
				.body(json);
	}
}
