package td.enterprise.web.rest;

import com.tendcloud.enterprise.um.umic.entity.User;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.util.PassengerDateUtil;
import td.enterprise.page.InstallInfoPage;
import td.enterprise.service.InstallInfoService;
import td.enterprise.service.PassengerDistService;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.*;
import td.olap.query.WiFiAnalyticsQuerService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/passengerDist")
@Slf4j
public class PassengerDistController extends BaseController {

    private final String BASE_URL = "/api/passengerDist";

    @Autowired
    private InstallInfoService installInfoService;
    @Autowired
    private PassengerDistService passengerDistService;

    @Autowired
    private ParamService paramService;

    public final static String pattern = "yyyy-MM-dd";

    @ApiOperation(value = "客流分布,总客流，日均到访，日均新客，日均老客",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客流分布,总客流，日均到访，日均新客，日均老客")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    // 客流分布-客流统计
    @RequestMapping(value = "/passengerDistributionCount", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<DistributionCountVM> passengerDistributionCount(ProjectQueryVM queryVM) throws Exception {
        Integer projectId = queryVM.getProjectId();
        String start = queryVM.getStartDate();
        String end = queryVM.getEndDate();
        Map<String, Map<String, Object>> map = passengerDistService.getPassengerDistributionDataByDate(start, end, projectId);
        DistributionCountVM countVM = new DistributionCountVM();
        Map<String, Object> key1Map = map.get("key1");
        Map<String, Object> key2Map = map.get("key2");
        Map<String, Object> key3Map = map.get("key3");
        Map<String, Object> key4Map = map.get("key4");

        CountVM totalVM = new CountVM();
        totalVM.setValue(key1Map.get("key") + "");
        totalVM.setValueStr(key1Map.get("keyCn") + "");
        totalVM.setTrend(Double.parseDouble(key1Map.get("val") + "") > 0 ? TrendEnum.UP : TrendEnum.DOWN);
        totalVM.setRate(Math.abs(Double.parseDouble(key1Map.get("val") + "")) + "");

        CountVM dayVM = new CountVM();
        dayVM.setValue(key2Map.get("key") + "");
        dayVM.setValueStr(key2Map.get("keyCn") + "");
        dayVM.setTrend(Double.parseDouble(key2Map.get("val") + "") > 0 ? TrendEnum.UP : TrendEnum.DOWN);
        dayVM.setRate(Math.abs(Double.parseDouble(key2Map.get("val") + "")) + "");


        CountVM newVM = new CountVM();
        newVM.setValue(key3Map.get("key") + "");
        newVM.setValueStr(key3Map.get("keyCn") + "");
        newVM.setTrend(Double.parseDouble(key3Map.get("val") + "") > 0 ? TrendEnum.UP : TrendEnum.DOWN);
        newVM.setRate(Math.abs(Double.parseDouble(key3Map.get("val") + "")) + "");


        CountVM oldVM = new CountVM();
        oldVM.setValue(key4Map.get("key") + "");
        oldVM.setValueStr(key4Map.get("keyCn") + "");
        oldVM.setTrend(Double.parseDouble(key4Map.get("val") + "") > 0 ? TrendEnum.UP : TrendEnum.DOWN);
        oldVM.setRate(Math.abs(Double.parseDouble(key4Map.get("val") + "")) + "");

        countVM.setTotalVM(totalVM);
        countVM.setDayVM(dayVM);
        countVM.setNewVM(newVM);
        countVM.setOldVM(oldVM);
        return new ResponseEntity<DistributionCountVM>(countVM, HttpStatus.OK);
    }

    @ApiOperation(value = "客流分布,探针数据",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客流分布,探针数据")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/installInfosNew", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<InstallInfoWithInfoVM>> queryNew(InstallInfoPage page) throws Exception {
        page.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
        List<InstallInfoWithInfoVM> rowsOrgin = installInfoService.queryByListWithInfo(page);
        List<InstallInfoWithInfoVM> rows = new ArrayList<>();
        for (InstallInfoWithInfoVM sensorInstallInfo : rowsOrgin) {
            if (sensorInstallInfo.getLatitude() != null && !"".equals(sensorInstallInfo.getLatitude()) && !"0".equals(sensorInstallInfo.getLatitude()) && sensorInstallInfo.getLongitude() != null
                    && !"".equals(sensorInstallInfo.getLongitude()) && !"0".equals(sensorInstallInfo.getLongitude())) {
                rows.add(sensorInstallInfo);
            }
        }

        String maxSensor = paramService.queryByParamKey("passengerDistributionMaxSensor").getParamValue();
        Integer maxCount = 50;
        if (maxSensor != null && !"".equals(maxSensor)) {
            maxCount = Integer.parseInt(maxSensor);
        }
        if (rows.size() <= maxCount) {
            Integer projectId = page.getProjectId();
            String start = page.getStartDate();
            String end = page.getEndDate();

            Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

            String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
            String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

            User user = UserInfoUtil.getUser();
            Map<String, Integer> resultMapNew;
            Map<String, Integer> resultMapOld;
            Map<String, Integer> resultMap2New;
            Map<String, Integer> resultMap2Old;
            if(page.getRelatedType() != null && page.getRelatedType().equals(ReportConstants.InstallInfoType.PROJECT)){
                String tenantId = UserInfoUtil.getCurrentTenantId();
                
                resultMapNew = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryProjectNew(tenantId, start, end, true);
                resultMapOld = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryProjectOld(tenantId, start, end, true);
                resultMap2New = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryProjectNew(tenantId, startBefore, endBefore, true);
                resultMap2Old = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryProjectOld(tenantId, startBefore, endBefore, true);

            }else {
                resultMapNew = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorNew(projectId, page.getProjectPlaceId(), start, end, true);
                resultMapOld = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorOld(projectId, page.getProjectPlaceId(), start, end, true);
                resultMap2New = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorNew(projectId, page.getProjectPlaceId(), startBefore, endBefore, true);
                resultMap2Old = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorOld(projectId, page.getProjectPlaceId(), startBefore, endBefore, true);
            }
            for (InstallInfoWithInfoVM sensorInstallInfo : rows) {

                Integer countNew = resultMapNew.get(String.valueOf(sensorInstallInfo.getRelatedId())) != null ? resultMapNew.get(String.valueOf(sensorInstallInfo.getRelatedId())) : 0;
                Integer countOld = resultMapOld.get(String.valueOf(sensorInstallInfo.getRelatedId())) != null ? resultMapOld.get(String.valueOf(sensorInstallInfo.getRelatedId())) : 0;

                Map basisMap = new HashMap<>();
                basisMap.put("newPeople", countNew / dateLength);
                basisMap.put("oldpeople", countOld / dateLength);
                basisMap.put("radius", 0);
                basisMap.put("allcount", (countNew + countOld) / dateLength);
                sensorInstallInfo.setBasis(basisMap);

                Integer countNew2 = resultMap2New.get(String.valueOf(sensorInstallInfo.getRelatedId())) != null ? resultMap2New.get(String.valueOf(sensorInstallInfo.getRelatedId())) : 0;
                Integer countOld2 = resultMap2Old.get(String.valueOf(sensorInstallInfo.getRelatedId())) != null ? resultMap2Old.get(String.valueOf(sensorInstallInfo.getRelatedId())) : 0;

                Map linkMap = new HashMap<>();
                linkMap.put("newPeople", countNew2 / dateLength);
                linkMap.put("oldpeople", countOld2 / dateLength);
                linkMap.put("radius", 0);
                linkMap.put("allcount", (countNew2 + countOld2) / dateLength);
                sensorInstallInfo.setLink(linkMap);
            }
        } else {
            for (InstallInfoWithInfoVM sensorInstallInfo : rows) {
                Map basisMap = new HashMap<>();
                basisMap.put("newPeople", 0);
                basisMap.put("oldpeople", 0);
                basisMap.put("radius", 0);
                basisMap.put("allcount", 0);
                sensorInstallInfo.setBasis(basisMap);

                Map linkMap = new HashMap<>();
                linkMap.put("newPeople", 0);
                linkMap.put("oldpeople", 0);
                linkMap.put("radius", 0);
                linkMap.put("allcount", 0);
                sensorInstallInfo.setLink(linkMap);
            }
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
        return new ResponseEntity<List<InstallInfoWithInfoVM>>(rows, headers, HttpStatus.OK);
    }

    @ApiOperation(value = "安装详情",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "安装详情")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/installInfosNewById", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<InstallInfoWithInfoVM> queryNewById(InstallInfoPage page) throws Exception {
        Integer projectId = page.getProjectId();
        String start = page.getStartDate();
        String end = page.getEndDate();

        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        InstallInfoWithInfoVM sensorInstallInfo = new InstallInfoWithInfoVM();
        sensorInstallInfo.setId(page.getId());

        Map<String, Integer> resultMapNew;
        Map<String, Integer> resultMapOld;
        Map<String, Integer> resultMap2New;
        Map<String, Integer> resultMap2Old;
        if (page.getRelatedType()!=null && page.getRelatedType().equals(ReportConstants.InstallInfoType.PROJECT)) {
            resultMapNew = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryProjectNewById(start, end, page.getId(), true);
            resultMapOld = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryProjectOldById(start, end, page.getId(), true);
            resultMap2New = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryProjectNewById(startBefore, endBefore, page.getId(), true);
            resultMap2Old = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryProjectOldById(startBefore, endBefore, page.getId(), true);

        } else {
            resultMapNew = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorNewById(projectId, page.getProjectPlaceId(), start, end, page.getId(), true);
            resultMapOld = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorOldById(projectId, page.getProjectPlaceId(), start, end, page.getId(), true);
            resultMap2New = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorNewById(projectId, page.getProjectPlaceId(), startBefore, endBefore, page.getId(), true);
            resultMap2Old = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorOldById(projectId, page.getProjectPlaceId(), startBefore, endBefore, page.getId(), true);
        }

        Integer countNew = resultMapNew.get("default") != null ? resultMapNew.get("default") : 0;
        Integer countOld = resultMapOld.get("default") != null ? resultMapOld.get("default") : 0;

        Map basisMap = new HashMap<>();
        basisMap.put("newPeople", countNew / dateLength);
        basisMap.put("oldpeople", countOld / dateLength);
        basisMap.put("radius", 0);
        basisMap.put("allcount", (countNew + countOld) / dateLength);
        sensorInstallInfo.setBasis(basisMap);

        Integer countNew2 = resultMap2New.get("default") != null ? resultMap2New.get("default") : 0;
        Integer countOld2 = resultMap2Old.get("default") != null ? resultMap2Old.get("default") : 0;

        Map linkMap = new HashMap<>();
        linkMap.put("newPeople", countNew2 / dateLength);
        linkMap.put("oldpeople", countOld2 / dateLength);
        linkMap.put("radius", 0);
        linkMap.put("allcount", (countNew2 + countOld2) / dateLength);
        sensorInstallInfo.setLink(linkMap);

        return new ResponseEntity<InstallInfoWithInfoVM>(sensorInstallInfo, HttpStatus.OK);
    }

}
