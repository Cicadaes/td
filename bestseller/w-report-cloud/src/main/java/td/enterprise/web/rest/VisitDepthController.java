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
import td.enterprise.service.VisitDepthService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.vm.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/visitDepth")
@Slf4j
public class VisitDepthController extends BaseController {

    private final String BASE_URL = "/api/visitDepth";

    @Autowired
    private VisitDepthService visitDepthService;

    @ApiOperation(value = "到访深度,月均光顾日数,次数，停留率,停留时长",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "到访深度,月均光顾日数,次数，停留率,停留时长")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/depthSummary", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<DepthSummaryVM> depthSummary(ProjectQueryVM queryVM) throws Exception {

        Integer projectId = queryVM.getProjectId();
        String start = queryVM.getStartDate();
        String end = queryVM.getEndDate();

        DepthSummaryVM summaryVM = visitDepthService.getDepthSummary(projectId, start, end);

        return new ResponseEntity<DepthSummaryVM>(summaryVM, HttpStatus.OK);
    }


    @ApiOperation(value = "到访深度,驻留时长分布",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "到访深度,驻留时长分布")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/visitTimesDuration", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<VisitTimesDurationVM> visitTimesDuration(ProjectQueryVM queryVM) throws Exception {
        Integer projectId = queryVM.getProjectId();
        String start = queryVM.getStartDate();
        String end = queryVM.getEndDate();

        VisitTimesDurationVM durationVM = visitDepthService.visitTimesDuration(projectId, start, end);

        return new ResponseEntity<VisitTimesDurationVM>(durationVM, HttpStatus.OK);
    }

    @ApiOperation(value = "到访深度,人均停留时长趋势图",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "到访深度,人均停留时长趋势图")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/avarageStayDuration", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<PassengerDurationListVM> avarageStayDuration(ProjectQueryVM queryVM) throws Exception {
        Integer projectId = queryVM.getProjectId();
        String start = queryVM.getStartDate();
        String end = queryVM.getEndDate();
        PassengerDurationListVM list = visitDepthService.avarageStayDuration(projectId, start, end);
        return new ResponseEntity<PassengerDurationListVM>(list, HttpStatus.OK);
    }


    @ApiOperation(value = "到访深度,人均进店数量趋势图",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "到访深度,人均进店数量趋势图")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/avarageEnterRoomCount", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<EnterRoomCountListVM> avarageEnterRoomCount(ProjectQueryVM queryVM) throws Exception {
        Integer projectId = queryVM.getProjectId();
        String start = queryVM.getStartDate();
        String end = queryVM.getEndDate();
        EnterRoomCountListVM list = visitDepthService.avarageEnterRoomCount(projectId, start, end);
        return new ResponseEntity<EnterRoomCountListVM>(list, HttpStatus.OK);
    }


    @ApiOperation(value = "到访深度,不同深度客群比重 驻留时长和进店数量",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "到访深度,,不同深度客群比重 驻留时长和进店数量")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/enterRoomDegreeList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<KeyValueVM>> enterRoomDegreeList(DegreeQueryVM queryVM) throws Exception {
        Integer projectId = queryVM.getProjectId();
        String start = queryVM.getStartDate();
        String end = queryVM.getEndDate();
        Integer type = queryVM.getType();
        List<Map<Object, Object>> list = visitDepthService.enterRoomDegreeList(projectId, start, end, type);
        List<KeyValueVM> resultList = new ArrayList<KeyValueVM>();
        if (null != list) {
            for (Map<Object, Object> map : list) {
                KeyValueVM vm = new KeyValueVM();
                vm.setKey(map.get("key") + "");
                vm.setValue(map.get("value") + "");
                resultList.add(vm);
            }
            list.clear();
            list = null;
        }
        return new ResponseEntity<List<KeyValueVM>>(resultList, HttpStatus.OK);
    }

    /**
     * 客流趋势-人均停留时长详情
     */
    @ApiOperation(value = "到访深度,人均停留时长详情",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "到访深度,人均停留时长详情")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/avarageStayDurationDetail", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<PassengerDurationVM>> avarageStayDurationDetail(ProjectQueryVM queryVM) throws Exception {
        Integer projectId = queryVM.getProjectId();
        String start = queryVM.getStartDate();
        String end = queryVM.getEndDate();
        List<PassengerDurationVM> list = visitDepthService.avarageStayDurationDetail(projectId, start, end);
//        Integer startCount = 0;
//        Integer endCount = list.size();
//        if (queryVM.getPage() != null && queryVM.getRows() != null) {
//            startCount = (queryVM.getPage() - 1) * queryVM.getRows();
//            endCount = queryVM.getPage() * queryVM.getRows() > list.size() ? list.size() : queryVM.getPage() * queryVM.getRows();
//        }
//        queryVM.getPager().setRowCount(list.size());
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(queryVM, BASE_URL);
        return new ResponseEntity<List<PassengerDurationVM>>(list, HttpStatus.OK);
    }


    /**
     * 客流趋势-人均停留时长详情
     */
    @ApiOperation(value = "到访深度,访问深度明细",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "到访深度,访问深度明细")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryEnterShopList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<EnterShopCountVM>> queryEnterShopList(ProjectQueryVM queryVM) throws Exception {
        Integer projectId = queryVM.getProjectId();
        String start = queryVM.getStartDate();
        String end = queryVM.getEndDate();

        List<EnterShopCountVM> list = visitDepthService.queryEnterShopList(projectId, start, end,OrderEnum.DESC);
        return new ResponseEntity<List<EnterShopCountVM>>(list, HttpStatus.OK);
    }


}
