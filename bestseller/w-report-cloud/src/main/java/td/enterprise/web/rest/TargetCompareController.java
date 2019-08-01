package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import td.enterprise.common.util.DateUtil;
import td.enterprise.service.TargetCompareService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.vm.TargetCompareVM;
import td.enterprise.web.vm.TargetQueryVM;
import td.enterprise.web.vm.TargetVM;
import td.olap.query.WiFiAnalyticsQuerService;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;


/**
 * 指标对比服务映射类
 */
@Controller
@RequestMapping("/api/targetCompare")
@Slf4j
public class TargetCompareController extends BaseController {

    @Autowired
    private TargetCompareService targetCompareService;


    @ApiOperation(value = "指标对比,进店客流",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "指标对比,进店客流")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/enterPassenger", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<TargetCompareVM>> enterPassenger(TargetQueryVM queryVM) throws Exception {
        //默认取当前月
        String date = queryVM.getStartMonth() + "-01";//转换成标准格式
        String startDate = DateUtil.getMonthStartDay(date.substring(0, 7));
        String endDate = DateUtil.getMonthEndDay(date.substring(0, 7));
        long dateLength = DateUtil.getDateLength(startDate, endDate);

        String counter = WiFiAnalyticsQuerService.OFFLINE_ACTIVE_USER_DAY_COUNTER;
        String orderType = "";

        List<TargetCompareVM> list = getTargetCompareVMs(queryVM, startDate, endDate, dateLength, counter, null, orderType);
        return new ResponseEntity<List<TargetCompareVM>>(list, HttpStatus.OK);
    }

    @ApiOperation(value = "指标对比,停留客流",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "指标对比,停留客流")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/stayPassenger", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<TargetCompareVM>> stayPassenger(TargetQueryVM queryVM) throws Exception {
        //默认取当前月
        String date = queryVM.getStartMonth() + "-01";//转换成标准格式
        String startDate = DateUtil.getMonthStartDay(date.substring(0, 7));
        String endDate = DateUtil.getMonthEndDay(date.substring(0, 7));
        long dateLength = DateUtil.getDateLength(startDate, endDate);

        String counter = WiFiAnalyticsQuerService.OFFLINE_STAY_USER_DAY_COUNTER;
        String orderType = "";

        List<TargetCompareVM> list = getTargetCompareVMs(queryVM, startDate, endDate, dateLength, counter, null, orderType);
        return new ResponseEntity<List<TargetCompareVM>>(list, HttpStatus.OK);
    }

    @ApiOperation(value = "指标对比,停留率",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "指标对比,停留率")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/stayRate", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<TargetCompareVM>> stayRate(TargetQueryVM queryVM) throws Exception {
        //默认取当前月
        String date = queryVM.getStartMonth() + "-01";//转换成标准格式
        String startDate = DateUtil.getMonthStartDay(date.substring(0, 7));
        String endDate = DateUtil.getMonthEndDay(date.substring(0, 7));
        long dateLength = DateUtil.getDateLength(startDate, endDate);

        String counter1 = WiFiAnalyticsQuerService.OFFLINE_STAY_USER_DAY_COUNTER;
        String counter2 = WiFiAnalyticsQuerService.OFFLINE_ACTIVE_USER_DAY_COUNTER;
        String orderType = "";

        List<TargetCompareVM> list = getTargetCompareVMs(queryVM, startDate, endDate, dateLength, counter1, counter2, orderType);
        return new ResponseEntity<List<TargetCompareVM>>(list, HttpStatus.OK);
    }

    @ApiOperation(value = "指标对比,人均停留时长",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "指标对比,人均停留时长")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/avgStayDuration", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<TargetCompareVM>> avgStayDuration(TargetQueryVM queryVM) throws Exception {
        //默认取当前月
        String date = queryVM.getStartMonth() + "-01";//转换成标准格式
        String startDate = DateUtil.getMonthStartDay(date.substring(0, 7));
        String endDate = DateUtil.getMonthEndDay(date.substring(0, 7));
        long dateLength = DateUtil.getDateLength(startDate, endDate);

        String counter1 = WiFiAnalyticsQuerService.OFFLINE_STAY_USER_DURATION_DAY_COUNTER;
        String counter2 = WiFiAnalyticsQuerService.OFFLINE_STAY_USER_TIMES_DAY_COUNTER;
        String orderType = "";

        List<TargetCompareVM> list = getTargetCompareVMs(queryVM, startDate, endDate, dateLength, counter1, counter2, orderType);
        return new ResponseEntity<List<TargetCompareVM>>(list, HttpStatus.OK);
    }

    /**
     * 公用查询方法
     */
    private List <TargetCompareVM> getTargetCompareVMs(TargetQueryVM queryVM, String startDate, String endDate, long dateLength, String counter1, String counter2, String orderType) throws ParseException {
        List <TargetCompareVM> list = new ArrayList <TargetCompareVM>();
        String childrenProjectIds = queryVM.getChildrenProjectIds();
        String parentProjectId = queryVM.getProjectId();
        if (StringUtils.isNotEmpty(childrenProjectIds) && !"null".equals(childrenProjectIds)) {
            String[] projectIdArray = childrenProjectIds.split(",");
            for (int i = 0; i < projectIdArray.length; i++) {
                Integer projectId = Integer.parseInt(projectIdArray[i]);
                TargetCompareVM compareVM = new TargetCompareVM();
                compareVM.setProjectId(Integer.parseInt(projectIdArray[i]));
                List <TargetVM> values = targetCompareService.getDateKeyValue(projectId, startDate, endDate, dateLength, orderType, counter1, counter2);
                compareVM.setValues(values);
                list.add(compareVM);
            }
        } else {
            Integer projectId = Integer.parseInt(parentProjectId);
            TargetCompareVM compareVM = new TargetCompareVM();
            compareVM.setProjectId(projectId);
            List <TargetVM> values = targetCompareService.getDateKeyValue(projectId, startDate, endDate, dateLength, orderType, counter1, counter2);
            compareVM.setValues(values);
            list.add(compareVM);
        }
        return list;
    }
}
