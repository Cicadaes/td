package td.enterprise.web.rest;

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
import td.enterprise.common.util.DateUtil;
import td.enterprise.entity.*;
import td.enterprise.page.*;
import td.enterprise.service.*;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.PaginationUtil;
import td.enterprise.web.vm.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Custom 自定义接口
 */
@Slf4j
@Controller
@RequestMapping("/api")
public class CustomController extends BaseController {

    private final String BASE_URL = "/api/tenantSurroundingAreaCountsNew";

    @Autowired
    private ProjectPlaceService projectPlaceService;

    @Autowired
    private TenantCorrelationCountService tenantCorrelationCountService;

    @Autowired
    private TenantHousingCoverageCountService tenantHousingCoverageCountService;

    @Autowired
    private TenantJobHousingCountService tenantJobHousingCountService;

    @Autowired
    private ProjectAppTypesService projectAppTypesService;

    @Autowired
    private TenantLookalikeJobHousingCountService tenantLookalikeJobHousingCountService;

    @Autowired
    private TenantRegionCountService tenantRegionCountService;

    @Autowired
    private CityRegionService cityRegionService;

    @Autowired
    private TenantSurroundingAreaCountService tenantSurroundingAreaCountService;

    @Autowired
    private TenantTopAreaCountService tenantTopAreaCountService;

    public static String pattern = "yyyy-MM-dd";

    @ApiOperation(value = "竞品概览,关联度指标",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "竞品概览,关联度指标")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/tenantCorrelationCounts/relevancyIndex", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<RelativeVM>> queryRelevancyIndex(String projectIds, String projectId) {
        TenantCorrelationCountPage tenantCorrelationCountPage = new TenantCorrelationCountPage();
        tenantCorrelationCountPage.setProjectId(projectId);
        tenantCorrelationCountPage.setProjectIds(projectIds.split(","));
        List<RelativeVM> list = tenantCorrelationCountService.queryRelevancyIndex(tenantCorrelationCountPage);
        return new ResponseEntity<List<RelativeVM>>(list, HttpStatus.OK);
    }

    @ApiOperation(value = "竞品概览,客群辐射",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "竞品概览,客群辐射")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/tenantHousingCoverageCounts/customerDistribution", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<TenantHousingCoverageCountVM>> queryCustomerDistribution(String projectIds, int type) {
        TenantHousingCoverageCountPage tenantHousingCoverageCountPage = new TenantHousingCoverageCountPage();
        tenantHousingCoverageCountPage.setProjectIds(projectIds.split(","));
        tenantHousingCoverageCountPage.setHourType(type);
        List<TenantHousingCoverageCountVM> list = tenantHousingCoverageCountService.queryCustomerDistribution(tenantHousingCoverageCountPage);
        return new ResponseEntity<List<TenantHousingCoverageCountVM>>(list, HttpStatus.OK);
    }

    @ApiOperation(value = "职住来源,工作地,居住地热点",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "职住来源,工作地,居住地热点")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/tenantJobHousingCounts", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<TenantJobHousingCount>> tenantJobHousingCounts(TenantJobHousingCountPage page) throws Exception {
        List<TenantJobHousingCount> rows = tenantJobHousingCountService.querySumByList(page);
        return new ResponseEntity<List<TenantJobHousingCount>>(rows, HttpStatus.OK);
    }

    /**
     * 获取查询条件下所有App类型
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "获取查询条件下所有App类型",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "获取查询条件下所有App类型")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/projectAppTypess", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<ProjectAppTypes>> query(ProjectAppTypesPage page) throws Exception {
        List<ProjectAppTypes> rows = projectAppTypesService.queryByList(page);
        return new ResponseEntity<>(rows, PaginationUtil.generatePaginationHttpHeaders(page, "/api/projectAppTypess"), HttpStatus.OK);
    }

    @ApiOperation(value = "潜客详情,职住来源",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "潜客详情,职住来源")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/tenantLookalikeJobHousingCounts", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<TenantLookalikeJobHousingCount>> query(TenantLookalikeJobHousingCountPage page) throws Exception {
        List<TenantLookalikeJobHousingCount> rows = tenantLookalikeJobHousingCountService.querySumByList(page);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, BASE_URL);
        return new ResponseEntity<List<TenantLookalikeJobHousingCount>>(rows, PaginationUtil.generatePaginationHttpHeaders(page, "/api/tenantLookalikeJobHousingCounts"), HttpStatus.OK);
    }

    @ApiOperation(value = "职住来源,TOP20小区",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "职住来源,TOP20小区")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/tenantTopAreaCounts", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<TenantTopAreaCount>> tenantTopAreaCounts(TenantTopAreaCountPage page) throws Exception {
        List<TenantTopAreaCount> rows = tenantTopAreaCountService.queryTopByListNew(page);
        return new ResponseEntity<List<TenantTopAreaCount>>(rows, HttpStatus.OK);
    }

    @ApiOperation(value = "区域来源",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "区域来源")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/tenantRegionCountsNew", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<RegionVM> queryNew(TenantRegionCountPage page) throws Exception {
        page.setRunDate(DateUtil.monthChange(page.getRunDate(), pattern, 1));

        RegionVM regionVM = new RegionVM();

        List<Map> rows = tenantRegionCountService.querySumByList(page);
        BigDecimal countAll = new BigDecimal(0);
        //计算总数
        for (Map map : rows) {
            BigDecimal count = (BigDecimal) map.get("count");
            countAll = countAll.add(count);
        }

        List<RegionRateVM> rateList = new ArrayList<RegionRateVM>();
        for (Map map : rows) {
            BigDecimal count = (BigDecimal) map.get("count");
            RegionRateVM rateVM = new RegionRateVM();
            rateVM.setName(map.get("name") + "");
            rateVM.setRate(count.longValue() * 10000 / countAll.longValue() / 100.0);
            rateList.add(rateVM);
        }

        RegionRateVM rate = null;
        //排序算法，哈哈，终于看懂了
        for (int i = rateList.size() - 1; i > 0; --i) {
            for (int j = 0; j < i; ++j) {
                if (rateList.get(j + 1).getRate() > rateList.get(j).getRate()) {
                    rate = rateList.get(j);
                    rateList.set(j, rateList.get(j + 1));
                    rateList.set(j + 1, rate);
                }
            }
        }

        regionVM.setRegionRateList(rateList); //Top 区域分布占比

        regionVM.setTotal(page.getPager().getRowCount());

        return new ResponseEntity<RegionVM>(regionVM, HttpStatus.OK);
    }

    @ApiOperation(value = "区域来源",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "区域来源")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/getRegionCountList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<RegionVM> getRegionCountList(TenantRegionCountPage page) throws Exception {
        RegionVM regionVM = new RegionVM();

        CityRegionPage cityRegionPage = new CityRegionPage();
        cityRegionPage.setPageEnabled(false);
        cityRegionPage.setCityName(page.getCityName());
        cityRegionPage.setRegionType(String.valueOf(page.getRegionType()));
        List<Map> rowsGeo = cityRegionService.querySumByList(cityRegionPage);

        List<RegionCountVM> countList = new ArrayList<RegionCountVM>();

        for (Map map2 : rowsGeo) {
            RegionCountVM countVM = new RegionCountVM();
            countVM.setName(map2.get("name") + "");
            countVM.setCount(Integer.parseInt(map2.get("count") + ""));
            countList.add(countVM);
        }

        regionVM.setRegionCountList(countList); //Top 区域分布占比

        return new ResponseEntity<RegionVM>(regionVM, HttpStatus.OK);
    }

    @ApiOperation(value = "区域来源，坐标点",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "区域来源，坐标点")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/cityRegionsNew", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<CityRegionVM> queryNew(CityRegionPage page) throws Exception {
        List<CityRegion> rows = cityRegionService.queryByList(page);
        List<Object> result = new ArrayList<>();

        Map<String, List<String[]>> bigMap = new HashMap<>();
        for (CityRegion cityRegion : rows) {
            bigMap.get(cityRegion.getRegionName());
            String key = cityRegion.getRegionName();

            if (bigMap.get(key) == null) {
                List<String[]> list = new ArrayList<>();
                bigMap.put(key, list);
                list.add(new String[]{cityRegion.getLongitudeBd(), cityRegion.getLatitudeBd()});
            } else {
                List<String[]> list = bigMap.get(key);
                list.add(new String[]{cityRegion.getLongitudeBd(), cityRegion.getLatitudeBd()});
            }
        }

        List<CityRegionNameVM> list = new ArrayList<CityRegionNameVM>();
        for (String key : bigMap.keySet()) {
            CityRegionNameVM nameVM = new CityRegionNameVM();
            nameVM.setName(key);
            nameVM.setList(bigMap.get(key));
            list.add(nameVM);
        }

        CityRegionVM regionVM = new CityRegionVM();
        regionVM.setTotal(page.getPager().getRowCount());
        regionVM.setList(list);

        return new ResponseEntity<CityRegionVM>(regionVM, HttpStatus.OK);
    }
}
