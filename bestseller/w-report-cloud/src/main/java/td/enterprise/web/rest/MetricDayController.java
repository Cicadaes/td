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

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import td.enterprise.page.MetricDayPage;
import td.enterprise.service.*;
import td.enterprise.web.util.BaseController;

import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.vm.MetricDayVM;


import javax.servlet.http.HttpSession;
import java.net.URLDecoder;
import java.util.List;


/**
 * InstallInfo 安装归属表接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class MetricDayController extends BaseController{
	
	public final static Logger logger = Logger.getLogger(MetricDayController.class);

	private final String BASE_URL = "/api/metricDay";

	@Autowired
	private MetricDayService metricDayService;

	@Autowired
	private MetricWeekService metricWeekService;

	@Autowired
	private MetricMonthService metricMonthService;

	/**
	* 获取查询条件下所有metricDay(支持分页)
	* @param page
	* @return
	* @throws Exception
	*/

	@ApiOperation(value = "获取查询条件下所有metricDay(支持分页)",
			httpMethod = "GET",
			response = ResponseEntity.class,
			notes = "获取查询条件下所有metricDay(支持分页)")
	@ApiResponses({
			@ApiResponse(code = 200, message = "成功"),
			@ApiResponse(code = 500, message = "服务器处理异常")
	})
	@RequestMapping(value = "/metricDay/pageList", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<MetricDayVM>> query(MetricDayPage page) throws Exception {
		List <MetricDayVM> metricDayS = null;

		if(page.getQ()!=null && !"".equals(page.getQ())){
			page.setQ(URLDecoder.decode(page.getQ(), "UTF8"));
		}

		HttpSession session = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest().getSession();
		String groupSign= (String)session.getAttribute("group_sign");

		List<String> cityCnNameList= (List<String>)session.getAttribute("logical_city");
		if("N".equals(groupSign)&&(page.getProjectType()==1||page.getProjectType()==11)){
			page.setCityCnNameList(cityCnNameList);
		}

		// 判断是 天范围查询 还是 周范围查询 或 月范围查询，
		// TODO 返回结果类型均为MetricDayVM ?
		if(page.getRangeQueryFlag()==0){ // 天范围查询，
			 metricDayS = metricDayService.queryByListWithChain(page);
		}else if(page.getRangeQueryFlag()==1){ // 周范围查询
			metricDayS = metricWeekService.queryByListWithChain(page);
		}else if(page.getRangeQueryFlag()==2){  // 月范围查询
			metricDayS = metricMonthService.queryByListWithChain(page);
		}
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
		return new ResponseEntity<>(metricDayS, headers, HttpStatus.OK);
	}

}
