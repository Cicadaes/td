package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import td.enterprise.service.PassengerTrendService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.vm.*;

@Controller
@RequestMapping("/api/passengerTrend")
@Slf4j
public class PassengerTrendController extends BaseController {

    private final String BASE_URL = "/api/passengerTrend";

    @Autowired
    private PassengerTrendService passengerTrendService;

    /**
     * 客流趋势-客流统计（第一排图表） map数据组成 key1：所选时期总客流 key2：新客占比 key3：峰值时段 key4：峰值时段客流比例
     * key5：客流到访时段
     */
    @ApiOperation(value = "客流趋势,所选时期总客流和客流到访时段等指标",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客流趋势,所选时期总客流和客流到访时段等指标")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/passengerTrendTopData", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<PassengerTrendTopDataVM> passengerTrendTopData(ProjectQueryVM projectQueryVM) throws Exception {
        Integer projectId = projectQueryVM.getProjectId();
        String start = projectQueryVM.getStartDate();
        String end = projectQueryVM.getEndDate();
        PassengerTrendTopDataVM topDataVM = passengerTrendService.getPassengnerTrendTopData(start, end, projectId);
        return new ResponseEntity<PassengerTrendTopDataVM>(topDataVM, HttpStatus.OK);
    }

    // 客流趋势-客流趋势（第二排图表）
    // 到访人数
    @ApiOperation(value = "客流趋势,到访人数汇总",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客流趋势,到访人数汇总")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/passengerActiveSummary", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<TrendCountTotalVM> passengerActiveSummary(ProjectQueryVM projectQueryVM) throws Exception {
        Integer projectId = projectQueryVM.getProjectId();
        String startDate = projectQueryVM.getStartDate();
        String endDate = projectQueryVM.getEndDate();
        TrendCountTotalVM countVM = passengerTrendService.getPassengerSummaryData(projectId, startDate, endDate, TrendTypeEnum.ACTIVE);
        return new ResponseEntity<TrendCountTotalVM>(countVM, HttpStatus.OK);
    }

    // 客流趋势-客流趋势（第二排图表）
    // 停留人数汇总
    @ApiOperation(value = "客流趋势,停留人数汇总",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客流趋势,停留人数汇总")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/passengerStaySummary", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<TrendCountTotalVM> passengerStaySummary(ProjectQueryVM projectQueryVM) throws Exception {
        Integer projectId = projectQueryVM.getProjectId();
        String startDate = projectQueryVM.getStartDate();
        String endDate = projectQueryVM.getEndDate();
        TrendCountTotalVM countVM = passengerTrendService.getPassengerSummaryData(projectId, startDate, endDate, TrendTypeEnum.STAY);
        return new ResponseEntity<TrendCountTotalVM>(countVM, HttpStatus.OK);
    }

    // 客流趋势-客流趋势（第二排图表）
    // 进店人数汇总
    @ApiOperation(value = "客流趋势,进店人数汇总",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客流趋势,进店人数汇总")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/passengerEnterSummary", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<TrendCountTotalVM> passengerEnterSummary(ProjectQueryVM projectQueryVM) throws Exception {
        Integer projectId = projectQueryVM.getProjectId();
        String startDate = projectQueryVM.getStartDate();
        String endDate = projectQueryVM.getEndDate();
        TrendCountTotalVM countVM = passengerTrendService.getPassengerSummaryData(projectId, startDate, endDate, TrendTypeEnum.ENTER);
        return new ResponseEntity<TrendCountTotalVM>(countVM, HttpStatus.OK);
    }


    // 客流趋势-客流趋势（第二排图表）
    // 到访人数列表
    @ApiOperation(value = "客流趋势,到访人数列表,有环比",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客流趋势,到访人数列表,有环比")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/passengerActiveList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<PassengerCompareVM> passengerActiveList(ProjectQueryVM projectQueryVM) throws Exception {
        Integer projectId = projectQueryVM.getProjectId();
        String startDate = projectQueryVM.getStartDate();
        String endDate = projectQueryVM.getEndDate();
        PassengerCompareVM countVM = passengerTrendService.getPassengerTrendDataList(projectId, startDate, endDate, TrendTypeEnum.ACTIVE);
        return new ResponseEntity<PassengerCompareVM>(countVM, HttpStatus.OK);
    }

    // 客流趋势-客流趋势（第二排图表）
    // 进店人数列表
    @ApiOperation(value = "客流趋势,进店人数列表,有环比",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客流趋势,进店人数列表,有环比")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/passengerEnterList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<PassengerCompareVM> passengerEnterList(ProjectQueryVM projectQueryVM) throws Exception {
        Integer projectId = projectQueryVM.getProjectId();
        String startDate = projectQueryVM.getStartDate();
        String endDate = projectQueryVM.getEndDate();
        PassengerCompareVM countVM = passengerTrendService.getPassengerTrendDataList(projectId, startDate, endDate, TrendTypeEnum.ENTER);
        return new ResponseEntity<PassengerCompareVM>(countVM, HttpStatus.OK);
    }


    // 客流趋势-客流趋势（第二排图表）
    // 停留人数列表
    @ApiOperation(value = "客流趋势,停留人数列表,有环比",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客流趋势,停留人数列表,有环比")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/passengerStayList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<PassengerCompareVM> passengerStayList(ProjectQueryVM projectQueryVM) throws Exception {
        Integer projectId = projectQueryVM.getProjectId();
        String startDate = projectQueryVM.getStartDate();
        String endDate = projectQueryVM.getEndDate();
        PassengerCompareVM countVM = passengerTrendService.getPassengerTrendDataList(projectId, startDate, endDate, TrendTypeEnum.STAY);
        return new ResponseEntity<PassengerCompareVM>(countVM, HttpStatus.OK);
    }


    // 客流趋势-客流趋势（第二排图表）
    // 停留率列表
    @ApiOperation(value = "客流趋势,停留率人数列表,有环比",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客流趋势,,停留率人数列表,有环比")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/passengerStayRateList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<PassengerCompareVM> passengerStayRateList(ProjectQueryVM projectQueryVM) throws Exception {
        Integer projectId = projectQueryVM.getProjectId();
        String startDate = projectQueryVM.getStartDate();
        String endDate = projectQueryVM.getEndDate();
        PassengerCompareVM countVM = passengerTrendService.getPassengerStayRateList(projectId, startDate, endDate);
        return new ResponseEntity<PassengerCompareVM>(countVM, HttpStatus.OK);
    }


    // 客流趋势-客流趋势（第二排图表）
    // 进店率列表
    @ApiOperation(value = "客流趋势,进店率人数列表,有环比",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客流趋势,进店率人数列表,有环比")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/passengerEnterRateList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<PassengerCompareVM> passengerEnterRateList(ProjectQueryVM projectQueryVM) throws Exception {
        Integer projectId = projectQueryVM.getProjectId();
        String startDate = projectQueryVM.getStartDate();
        String endDate = projectQueryVM.getEndDate();
        PassengerCompareVM countVM = passengerTrendService.getPassengerEnterRateList(projectId, startDate, endDate);
        return new ResponseEntity<PassengerCompareVM>(countVM, HttpStatus.OK);
    }

}
