package td.enterprise.web.rest;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.yaml.snakeyaml.util.UriEncoder;
import td.enterprise.common.constant.CommonConstants;
import td.enterprise.entity.Project;
import td.enterprise.page.ProjectPage;
import td.enterprise.service.PassengerTrendService;
import td.enterprise.service.ProjectDistService;
import td.enterprise.service.ProjectService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.vm.*;
import td.enterprise.web.vm.comparator.ProjectAverageDetailVMComparator;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 房店指标查询类
 */
@Controller
@RequestMapping("/api/projectDist")
@Slf4j
public class ProjectDistController extends BaseController {

    private static final String BASE_URL = "/api/projectDist";

    @Autowired
    private ProjectDistService projectDistService;

    @Autowired
    private PassengerTrendService passengerTrendService;

    @Autowired
    private ProjectService projectService;

    /**
     * TOP10 店铺指标
     */
    @ApiOperation(value = "房店指标,进店客流",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "房店指标,进店客流")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryTop", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<ProjectTopVM>> queryTop(RoomQueryVM queryVM) throws Exception {
        Integer projectId = queryVM.getProjectId();
        String startDate = queryVM.getStartDate();
        String endDate = queryVM.getEndDate();
        String chartType = queryVM.getChartType();
        String chartCatagory = queryVM.getChartCatagory();
        /**
         * top10 店铺
         */
        List<ProjectTopVM> list = null;

        list = projectDistService.getRoomTopFlowDataForChain(startDate, endDate, projectId, chartType, chartCatagory);

        return new ResponseEntity<List<ProjectTopVM>>(list, HttpStatus.OK);

    }

    @ApiOperation(value = "房店指标,停留率top10",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "房店指标,停留率top10")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryTopRate", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<ProjectTopRateVM>> queryNewRate(RoomQueryVM queryVM) throws Exception {
        Integer projectId = queryVM.getProjectId();
        String startDate = queryVM.getStartDate();
        String endDate = queryVM.getEndDate();
        String chartType = queryVM.getChartType();
        String chartCatagory = queryVM.getChartCatagory();
        //停留率
        List<ProjectTopRateVM> list = projectDistService.getChainTopRateFlowData(startDate, endDate, projectId, chartType, chartCatagory);
        return new ResponseEntity<List<ProjectTopRateVM>>(list, HttpStatus.OK);
    }

    @ApiOperation(value = "房店指标,坪效指标,客流密度，停留客流密度",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "房店指标,坪效指标,客流密度，停留客流密度")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryDensity", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<ProjectDensityVM>> queryDensity(DesityVM queryVM) throws Exception {
        Integer projectId = queryVM.getProjectId();
        String startDate = queryVM.getStartDate();
        String endDate = queryVM.getEndDate();
        String chartType = queryVM.getChartType();
        List<ProjectDensityVM> list = projectDistService.getProjectDensityData(projectId, startDate, endDate, chartType);
        return new ResponseEntity<List<ProjectDensityVM>>(list, HttpStatus.OK);
    }

    @ApiOperation(value = "房店指标,指标明细",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "房店指标,指标明细")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryAverageDetail", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<ProjectAverageDetailVM>> queryAverageDetail(ProjectPageQueryVM queryVM) throws Exception {
        Integer projectId = queryVM.getProjectId();
        String startDate = queryVM.getStartDate();
        String endDate = queryVM.getEndDate();

        List<ProjectAverageDetailVM> list = passengerTrendService.getAverageListData(startDate, endDate, projectId);

        //项目名称搜索功能
        String q = queryVM.getQ();
        if (q != null && StringUtils.isNotBlank(q)) {
            List<ProjectAverageDetailVM> result = new ArrayList<>();
            q = UriEncoder.decode(q);
            for (ProjectAverageDetailVM projectAverageDetailVM : list) {
                if (projectAverageDetailVM.getProjectName().indexOf(q) != -1) {
                    result.add(projectAverageDetailVM);
                }
            }
            list = result;
        }
        //进行排序
        if(StringUtils.isNotEmpty(queryVM.getOrder()) && StringUtils.isNotEmpty(queryVM.getSort())){
            Collections.sort(list, new ProjectAverageDetailVMComparator(queryVM.getSort(),queryVM.getOrder()));
        }
        queryVM.getPager().setRowCount(list.size());
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(queryVM, BASE_URL);
        Integer rowCount = queryVM.getRows();
        Integer pageCount = queryVM.getPage();
        if (list.size() >= pageCount * rowCount) {
            list = list.subList((pageCount - 1) * rowCount, pageCount * rowCount);
        } else {
            list = list.subList((pageCount - 1) * rowCount, list.size());
        }
        return new ResponseEntity<List<ProjectAverageDetailVM>>(list, headers, HttpStatus.OK);
    }


    @ApiOperation(value = "房店指标,指标详情",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "房店指标,指标明细")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryProjectAverageDetail", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<ProjectAverageHistoryDetailVM>> queryProjectAverageDetail(ProjectQueryVM queryVM) throws Exception {
        Integer projectId = queryVM.getProjectId();
        String startDate = queryVM.getStartDate();
        String endDate = queryVM.getEndDate();

        List<ProjectAverageHistoryDetailVM> list = passengerTrendService.getHistoryListData(startDate, endDate, projectId);

        return new ResponseEntity<List<ProjectAverageHistoryDetailVM>>(list, HttpStatus.OK);
    }


    // 用于竞品概览，图表2
    @ApiOperation(value = "竞品概览 TOP店铺排名",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "竞品概览 TOP店铺排名")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryTopRoomList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<RoomVM>> queryTopRoomList(String projectIds) throws Exception {

        SimpleDateFormat sdf = new SimpleDateFormat(CommonConstants.DATE_STRING);

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, -1);
        calendar.set(Calendar.DAY_OF_MONTH, 1);

        Calendar calendar2 = Calendar.getInstance();
        calendar2.set(Calendar.DAY_OF_MONTH, 1);
        calendar2.add(Calendar.DATE, -1);

        String startDate = sdf.format(calendar.getTime());
        String endDate = sdf.format(calendar2.getTime());

        String[] idsStr = projectIds.split(",");

        Map<String, Project> projectMap = new HashMap<String, Project>();

        //查询竞品项目下房间
        for (String idstr : idsStr) {
            ProjectPage page = new ProjectPage();
            page.setPageEnabled(false);
            page.setId(Integer.parseInt(idstr));

            List<Project> rows = projectService.getDirectChildrenByParam(page);
            for (Project project : rows) {
                projectMap.put(String.valueOf(project.getId()), project);
            }
        }


        List<RoomVM> bigList = new ArrayList<RoomVM>();
        for (String idstr : idsStr) {
            List<TopRoomVM> roomNameList = projectDistService.getRoomTopFlowData2(startDate, endDate, Integer.parseInt(idstr));

            for (TopRoomVM vm : roomNameList) {

                String roomId = vm.getRoomId();
                if (projectMap.get(roomId) != null && projectMap.get(roomId).getProjectName() != null && !"".equals(projectMap.get(roomId).getProjectName())) {
                    vm.setRoomName(projectMap.get(roomId).getProjectName());
                } else if (!"0".equals(roomId)) {
                    vm.setRoomName("房间 " + roomId);
                } else {
                    vm.setRoomName("无");
                }
            }

            RoomVM roomVM = new RoomVM();
            roomVM.setProjectId(idstr);
            roomVM.setList(roomNameList);
            bigList.add(roomVM);
        }
        return new ResponseEntity<List<RoomVM>>(bigList, HttpStatus.OK);
    }


}
