package td.enterprise.web.rest;

import com.tendcloud.enterprise.um.umic.entity.User;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.PassengerDateUtil;
import td.enterprise.common.util.RunDateUtil;
import td.enterprise.entity.BehaviorCrowdResult;
import td.enterprise.entity.Crowd;
import td.enterprise.entity.TenantTagsCount;
import td.enterprise.page.BehaviorCrowdResultPage;
import td.enterprise.page.TenantTagsCountPage;
import td.enterprise.service.*;
import td.enterprise.service.DTO.Tag;
import td.enterprise.web.util.BaseController;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 客群画像指标数据
 */
@Controller
@RequestMapping("/api/passenger")
@Slf4j
public class PassengerController extends BaseController {

    @Autowired
    private CrowdService crowdService;
    @Autowired
    private WifiPixTagCountService wifiPixTagCountService;
    @Autowired
    private TenantTagsCountService tenantTagsCountService;
    @Autowired
    private BehaviorCrowdResultService behaviorCrowdResultService;
    @Autowired
    private PassengerService passengerService;

    @Autowired
    private TenantAppSignificanceService tenantAppSignificanceService;

    public static String pattern = "yyyy-MM-dd";

    /**
     * 获取消费能力
     *
     * @param filter
     * @param crowdId
     * @param startDate
     * @param endDate
     * @param shopcenterlimit
     * @param shopbrandlimit
     * @param restaurantbrandlimit
     * @param projectId
     * @return
     */
    private ConsumingAbilityVM getConsumingAbilityVM(Map<String, Object> filter, Integer crowdId, String startDate, String endDate, Integer shopcenterlimit, Integer shopbrandlimit, Integer restaurantbrandlimit, Integer projectId) {
        List<Tag> shopBrandList = getShopBrandList(filter, startDate, endDate, projectId, null, shopbrandlimit);
        List<Tag> shopCenterList = getShopCenterList(filter, startDate, endDate, projectId, null, shopcenterlimit);
        List<Tag> restaurantBrandList = getRestaurantBrandList(filter, startDate, endDate, projectId, null, restaurantbrandlimit);
        List<Tag> phoneBrandList = getPhoneBrandMap(filter, startDate, endDate, projectId, crowdId, false);
        List<Tag> phonePriceList = getPhonePriceMap(filter, startDate, endDate, projectId, crowdId, false);
        ConsumingAbilityVM abilityVM = new ConsumingAbilityVM();

        abilityVM.setCrowdId(crowdId);
        abilityVM.setProjectId(projectId);
        abilityVM.setPhoneBrandList(phoneBrandList);
        abilityVM.setShopBrandList(shopBrandList);
        abilityVM.setShopCenterList(shopCenterList);
        abilityVM.setRestaurantbrandList(restaurantBrandList);
        abilityVM.setPhonePriceList(phonePriceList);
        return abilityVM;
    }

    @ApiOperation(value = "客群画像,应用偏好覆盖度",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客群画像,,应用偏好覆盖度")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/selectForRadar", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<TenantTagsCount>> selectForRadar(TenantTagsCountPage page) throws Exception {
        Map params = new HashMap<>();
        params.put("projectId", page.getProjectId());
        params.put("crowdId", page.getCrowdId());
        // params.put("cycleStatistics", page.getCycleStatistics());
        String runDate = page.getRunDate();
        runDate = DateUtil.monthChange(runDate, pattern, 1);
        params.put("runDate", runDate);
        List<TenantTagsCount> result = tenantTagsCountService.selectForRadar(params);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ApiOperation(value = "客户围群,应用偏好覆盖度",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客户围群,,应用偏好覆盖度")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/selectForBehaviorRadar", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<BehaviorCrowdResult>> selectForBehaviorRadar(BehaviorCrowdResultPage page) throws Exception {
        Map params = new HashMap<>();
        params.put("projectId", page.getProjectId());
        params.put("execId", page.getExecId());
        List<BehaviorCrowdResult> result = behaviorCrowdResultService.selectForRadar(params);
        return new ResponseEntity<List<BehaviorCrowdResult>>(result, HttpStatus.OK);
    }

    /**
     * 应用偏好提升度 提升度：取城市整体人群的app覆盖度a作为基数，将特征人群的app覆盖度b与基数比较，b/a-1。 基数按周期更新，不用实时算
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客户围群,应用偏好提升度",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客户围群,应用偏好提升度")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/selectBehaviorAppPreference", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<BehaviorCrowdResult>> selectBehaviorAppPreference(BehaviorCrowdResultPage page) throws Exception {
        Map params = new HashMap<>();
        params.put("projectId", page.getProjectId());
        params.put("execId", page.getExecId());
        List<BehaviorCrowdResult> result = behaviorCrowdResultService.selectAppPreference(params);
        return new ResponseEntity<List<BehaviorCrowdResult>>(result, HttpStatus.OK);
    }

    /**
     * 应用偏好提升度 提升度：取城市整体人群的app覆盖度a作为基数，将特征人群的app覆盖度b与基数比较，b/a-1。 基数按周期更新，不用实时算
     *
     * @param page
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客群画像,应用偏好提升度",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客群画像,应用偏好提升度")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/selectAppPreference", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<TenantTagsCount>> selectAppPreference(TenantTagsCountPage page) throws Exception {
        Map params = new HashMap<>();
        params.put("tenantId", page.getTenantId());
        params.put("projectId", page.getProjectId());
        params.put("crowdId", page.getCrowdId());
        // params.put("cycleStatistics", page.getCycleStatistics());
        String runDate = page.getRunDate();
        runDate = DateUtil.monthChange(runDate, pattern, 1);
        params.put("runDate", runDate);
        List<TenantTagsCount> tenantTagsCountList = tenantTagsCountService.selectAppPreference(params);
        return new ResponseEntity<List<TenantTagsCount>>(tenantTagsCountList, HttpStatus.OK);
    }

    /**
     * 获取 常去餐饮店数据
     *
     * @param filter
     * @return
     */
    private List<Tag> getRestaurantBrandList(Map<String, Object> filter, String startDate, String endDate, Integer projectId, Integer cycleStatistics, int restaurantBrandlimit) {
        if (StringUtils.isNotEmpty(startDate)) {
            filter.put("startDate", startDate);
        }
        if (StringUtils.isNotEmpty(endDate)) {
            filter.put("endDate", endDate);
        }
        filter.put("projectId", projectId + "");
        if (cycleStatistics != null) {
            // filter.put("cycleStatistics", cycleStatistics + "");
        } else {
            try {
                int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
                dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
                // filter.put("cycleStatistics", dateLength);
            } catch (Exception e) {
                log.error(" 查询 人群消费数据  计算日期间隔，出错" + " , stratDate=" + startDate + " ,endDate=" + endDate);
            }
        }
        filter.put("type", 3); // 餐饮店
        filter.put("listLimit", restaurantBrandlimit);
        List<Tag> restaurantBrandList = wifiPixTagCountService.queryOften2Go(filter);
        return restaurantBrandList;
    }

    /**
     * @param filter
     * @param startDate
     * @param endDate
     * @param projectId
     * @param cycleStatistics
     * @param shopbrandlimit
     * @return
     */
    private List<Tag> getShopBrandList(Map<String, Object> filter, String startDate, String endDate, int projectId, Integer cycleStatistics, int shopbrandlimit) {
        if (StringUtils.isNotEmpty(startDate)) {
            filter.put("startDate", startDate);
        }
        if (StringUtils.isNotEmpty(endDate)) {
            filter.put("endDate", endDate);
        }
        filter.put("projectId", projectId + "");
        if (cycleStatistics != null) {
            // filter.put("cycleStatistics", cycleStatistics + "");
        } else {
            try {
                int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
                dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
                // filter.put("cycleStatistics", dateLength);
            } catch (Exception e) {
                log.error(" 查询 人群消费数据  计算日期间隔，出错" + " , stratDate=" + startDate + " ,endDate=" + endDate);
            }
        }
        filter.put("type", 2); // 品牌店
        filter.put("listLimit", shopbrandlimit);
        List<Tag> shopBrandList = wifiPixTagCountService.queryOften2Go(filter);
        return shopBrandList;
    }

    /**
     * 获取常去商业中心数据
     *
     * @param filter
     * @param startDate
     * @param endDate
     * @param projectId
     * @param cycleStatistics
     * @param shopcenterlimit
     * @return
     */
    private List<Tag> getShopCenterList(Map<String, Object> filter, String startDate, String endDate, Integer projectId, Integer cycleStatistics, int shopcenterlimit) {
        if (StringUtils.isNotEmpty(startDate)) {
            filter.put("startDate", startDate);
        }
        if (StringUtils.isNotEmpty(endDate)) {
            filter.put("endDate", endDate);
        }
        filter.put("projectId", projectId + "");
        if (cycleStatistics != null) {
            // filter.put("cycleStatistics", cycleStatistics + "");
        } else {
            try {
                int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
                dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
                // filter.put("cycleStatistics", dateLength);
            } catch (Exception e) {
                log.error(" 查询 人群消费数据  计算日期间隔，出错" + " , stratDate=" + startDate + " ,endDate=" + endDate);
            }
        }
        filter.put("listLimit", shopcenterlimit);
        filter.put("type", 1); // 商业中心
        List<Tag> shopCenterList = wifiPixTagCountService.queryOften2Go(filter);
        return shopCenterList;
    }

    /**
     * 获取手机品牌分布数据
     *
     * @param filter
     * @param startDate
     * @param endDate
     * @param projectId
     * @param crowdId
     * @param isAzkbanResult
     * @return
     */
    private List<Tag> getPhoneBrandMap(Map<String, Object> filter, String startDate, String endDate, Integer projectId, Integer crowdId, boolean isAzkbanResult) {
        List<Tag> phoneBrandList = new ArrayList<Tag>(); // 手机品牌
        Map<String, List<Tag>> phoneBrandMap = new HashMap<>();
        Map params = new HashMap<>();

        params.put("projectId", filter.get("projectId"));
        params.put("execId", filter.get("execId"));

        if (isAzkbanResult) {
            phoneBrandMap = crowdService.queryPhoneType(params, isAzkbanResult);
        } else {
            params.put("projectId", projectId);
            // int days = 1 + DateUtil.getDiffDays(DateUtil.format(startDate, DateUtil.PATTERN_DATE), DateUtil.format(endDate, DateUtil.PATTERN_DATE));
            // days = RunDateUtil.getInstance().getCycleStatistics(days);
            // params.put("cycleStatistics", days);
            endDate = DateUtil.monthChange(endDate, pattern, 1);
            params.put("runDate", endDate);
            params.put("crowdId", crowdId);
            phoneBrandMap = crowdService.queryPhoneType(params, isAzkbanResult);
        }
        phoneBrandList = phoneBrandMap.get("phonebrand") == null ? phoneBrandList : phoneBrandMap.get("phonebrand");
        return phoneBrandList;
    }

    /**
     * 获取手机价格排名数据
     *
     * @param filter
     * @param startDate
     * @param endDate
     * @param projectId
     * @param crowdId
     * @param isAzkabanResult
     * @return
     */
    private List<Tag> getPhonePriceMap(Map<String, Object> filter, String startDate, String endDate, Integer projectId, Integer crowdId, boolean isAzkabanResult) {
        Map<String, List<Tag>> phonePriceMap = new HashMap<>();
        List<Tag> phonePriceList = new ArrayList<>(); // 手机价格

        Map params = new HashMap<>();
        params.put("projectId", filter.get("projectId"));
        params.put("execId", filter.get("execId"));

        if (isAzkabanResult) {
            phonePriceMap = crowdService.queryPhonePrice(params, isAzkabanResult);
        } else {
            params.put("projectId", projectId);
            // int days = 1 + DateUtil.getDiffDays(DateUtil.format(startDate, DateUtil.PATTERN_DATE), DateUtil.format(endDate, DateUtil.PATTERN_DATE));
            // days = RunDateUtil.getInstance().getCycleStatistics(days);
            // params.put("cycleStatistics", days);
            // endDate = DateUtil.monthChange(endDate, pattern, 1);
            params.put("runDate", endDate);
            params.put("crowdId", crowdId);
            phonePriceMap = crowdService.queryPhonePrice(params, isAzkabanResult);
        }
        phonePriceList = phonePriceMap.get("phoneprice") == null ? phonePriceList : phonePriceMap.get("phoneprice");
        return phonePriceList;
    }

    /**
     * 客群概览- 按日查询客流数据 今日、7日、30日、累计总客,近30日新客  近30日客均停留时长
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客群概览,获取今日客流，近7日客流",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客群概览,获取今日客流，近7日客流")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/passengerOverview/passengerCount/{projectId}/{date}", method = RequestMethod.GET)
    @ResponseBody
    public HttpEntity<ProjectCountVM> queryPassengerCount(@PathVariable Integer projectId, @PathVariable String date) throws Exception {
        User user = UserInfoUtil.getUser();
        String tenantId = UserInfoUtil.getCurrentTenantId();
        Long dateTime = null;
        if (StringUtils.isEmpty(date)) {
            dateTime = System.currentTimeMillis();
        } else {
            dateTime = DateUtil.getTime(date);
        }
        ProjectCountVM projectCountVM = passengerService.queryPassengerCount(tenantId, projectId, dateTime);
        return new ResponseEntity<ProjectCountVM>(projectCountVM, HttpStatus.OK);
    }

    /**
     * 客群画像 性别比例
     *
     * @param queryVM
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客群画像,性别比例",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客群画像,性别比例")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/querySexRate", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<SexVM> querySexRate(CrowdQueryVM queryVM) throws Exception {
        String startDate = queryVM.getStartDate();
        Integer crowdId = queryVM.getCrowdId();
        Integer projectId = queryVM.getProjectId();
        String endDate = queryVM.getEndDate();
        SexVM sexVM = null;
        if (null == projectId || startDate == null || endDate == null || crowdId == null) {
            log.error("查询人口属性数据，查询参数为, startDate=" + startDate + ", endDate=" + endDate + ", 参数异常为null ");
        } else {
            Map params = new HashMap<>();
            params.put("projectId", projectId);
            // int days = 1 + DateUtil.getDiffDays(DateUtil.format(startDate, DateUtil.PATTERN_DATE), DateUtil.format(endDate, DateUtil.PATTERN_DATE));
            // days = RunDateUtil.getInstance().getCycleStatistics(days);
            // params.put("cycleStatistics", days);
            endDate = DateUtil.monthChange(endDate, pattern, 1);
            params.put("runDate", endDate);
            if (crowdId != null) {
                Crowd crowd = crowdService.selectByPrimaryKey(crowdId);
                if (crowd != null) {
                    params.put("crowdId", crowdId + "");
                    //性别比例
                    sexVM = crowdService.getSexRateVM(params);
                }
            }
        }
        return new ResponseEntity<SexVM>(sexVM, HttpStatus.OK);
    }


    /**
     * 客群画像 年龄分布
     *
     * @param queryVM
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客群画像,年龄分布",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客群画像,年龄分布")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryAgeDistribution", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<AgeDistributionVM> queryAgeDistribution(CrowdQueryVM queryVM) throws Exception {
        String startDate = queryVM.getStartDate();
        Integer crowdId = queryVM.getCrowdId();
        Integer projectId = queryVM.getProjectId();
        String endDate = queryVM.getEndDate();
        AgeDistributionVM ageDistributionVM = null;
        if (null == projectId || startDate == null || endDate == null || crowdId == null) {
            log.error("查询人口属性数据，查询参数为, startDate=" + startDate + ", endDate=" + endDate + ", 参数异常为null ");
        } else {
            Map params = new HashMap<>();
            params.put("projectId", projectId);
            // int days = 1 + DateUtil.getDiffDays(DateUtil.format(startDate, DateUtil.PATTERN_DATE), DateUtil.format(endDate, DateUtil.PATTERN_DATE));
            // days = RunDateUtil.getInstance().getCycleStatistics(days);
            // params.put("cycleStatistics", days);
            endDate = DateUtil.monthChange(endDate, pattern, 1);
            params.put("runDate", endDate);
            if (crowdId != null) {
                Crowd crowd = crowdService.selectByPrimaryKey(crowdId);
                if (crowd != null) {
                    params.put("crowdId", crowdId + "");
                    //性别比例
                    ageDistributionVM = crowdService.queryAgeDistribution(params);
                }
            }
        }
        return new ResponseEntity<AgeDistributionVM>(ageDistributionVM, HttpStatus.OK);
    }


    /**
     * 客群画像 已婚，育儿，有车
     *
     * @param queryVM
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客群画像,已婚,育儿,有车",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客群画像,已婚,育儿,有车")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryMarryCarChild", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<MarryCarChildVM> queryMarryCarChild(CrowdQueryVM queryVM) throws Exception {
        String startDate = queryVM.getStartDate();
        Integer crowdId = queryVM.getCrowdId();
        Integer projectId = queryVM.getProjectId();
        String endDate = queryVM.getEndDate();
        MarryCarChildVM marryCarChildVM = null;
        if (null == projectId || startDate == null || endDate == null || crowdId == null) {
            log.error("查询人口属性数据，查询参数为, startDate=" + startDate + ", endDate=" + endDate + ", 参数异常为null ");
        } else {
            Map params = new HashMap<>();
            params.put("projectId", projectId);
            // int days = 1 + DateUtil.getDiffDays(DateUtil.format(startDate, DateUtil.PATTERN_DATE), DateUtil.format(endDate, DateUtil.PATTERN_DATE));
            // days = RunDateUtil.getInstance().getCycleStatistics(days);
            // params.put("cycleStatistics", days);
            endDate = DateUtil.monthChange(endDate, pattern, 1);
            params.put("runDate", endDate);
            if (crowdId != null) {
                Crowd crowd = crowdService.selectByPrimaryKey(crowdId);
                if (crowd != null) {
                    params.put("crowdId", crowdId + "");
                    //性别比例
                    marryCarChildVM = crowdService.getMarryCarChild(params);
                }
            }
        }
        return new ResponseEntity<MarryCarChildVM>(marryCarChildVM, HttpStatus.OK);
    }


    /**
     * 客群画像 消费能力
     *
     * @param queryVM
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客群画像,消费能力 所用手机品牌",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客群画像,消费能力 所用手机品牌")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryPhoneBrandList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Tag>> queryPhoneBrandList(CrowdQueryVM queryVM) throws Exception {
        String startDate = queryVM.getStartDate();
        Integer crowdId = queryVM.getCrowdId();
        Integer projectId = queryVM.getProjectId();
        String endDate = queryVM.getEndDate();
        List<Tag> phoneBrandList = null;
        if (null == projectId || startDate == null || endDate == null || crowdId == null) {
            log.error("查询人口属性数据，查询参数为, startDate=" + startDate + ", endDate=" + endDate + ", 参数异常为null ");
        } else {
            Map params = new HashMap<>();
            params.put("projectId", projectId);
            // int days = 1 + DateUtil.getDiffDays(DateUtil.format(startDate, DateUtil.PATTERN_DATE), DateUtil.format(endDate, DateUtil.PATTERN_DATE));
            // days = RunDateUtil.getInstance().getCycleStatistics(days);
            // params.put("cycleStatistics", days);
            // endDate = DateUtil.monthChange(endDate, pattern, 1);
            params.put("runDate", endDate);
            if (crowdId != null) {
                Crowd crowd = crowdService.selectByPrimaryKey(crowdId);
                if (crowd != null) {
                    params.put("crowdId", crowdId + "");
                    phoneBrandList = getPhoneBrandMap(new HashMap<String, Object>(), startDate, endDate, projectId, crowdId, false);
                }
            }
        }
        return new ResponseEntity<List<Tag>>(phoneBrandList, HttpStatus.OK);
    }


    /**
     * 客群画像 消费能力
     *
     * @param queryVM
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客群画像,消费能力 所用手机价格",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客群画像,消费能力  所用手机价格")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryPhonePriceList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Tag>> queryPhonePriceList(CrowdQueryVM queryVM) throws Exception {
        String startDate = queryVM.getStartDate();
        Integer crowdId = queryVM.getCrowdId();
        Integer projectId = queryVM.getProjectId();
        String endDate = queryVM.getEndDate();
        List<Tag> phonePriceList = null;
        if (null == projectId || startDate == null || endDate == null || crowdId == null) {
            log.error("查询人口属性数据，查询参数为, startDate=" + startDate + ", endDate=" + endDate + ", 参数异常为null ");
        } else {
            Map params = new HashMap<>();
            params.put("projectId", projectId);
            // int days = 1 + DateUtil.getDiffDays(DateUtil.format(startDate, DateUtil.PATTERN_DATE), DateUtil.format(endDate, DateUtil.PATTERN_DATE));
            // days = RunDateUtil.getInstance().getCycleStatistics(days);
            // params.put("cycleStatistics", days);
            endDate = DateUtil.monthChange(endDate, pattern, 1);
            params.put("runDate", endDate);
            if (crowdId != null) {
                Crowd crowd = crowdService.selectByPrimaryKey(crowdId);
                if (crowd != null) {
                    params.put("crowdId", crowdId + "");
                    phonePriceList = getPhonePriceMap(new HashMap<String, Object>(), startDate, endDate, projectId, crowdId, false);
                }
            }
        }
        return new ResponseEntity<List<Tag>>(phonePriceList, HttpStatus.OK);
    }


    /**
     * 客群画像 消费能力
     *
     * @param queryVM
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客群画像,消费能力 Shoppingmall足迹",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客群画像,消费能力 Shoppingmall足迹")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryShopCenterList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Tag>> queryShopCenterList(CrowdQueryLimitVM queryVM) throws Exception {
        String startDate = queryVM.getStartDate();
        Integer crowdId = queryVM.getCrowdId();
        Integer projectId = queryVM.getProjectId();
        String endDate = queryVM.getEndDate();
        Map<String, Object> filter = new HashMap<>();
        filter.put("projectId", projectId);
        List<Tag> shopCenterList = null;
        if (null == projectId || startDate == null || endDate == null || crowdId == null) {
            log.error("查询人口属性数据，查询参数为, startDate=" + startDate + ", endDate=" + endDate + ", 参数异常为null ");
        } else {
            Map params = new HashMap<>();
            params.put("projectId", projectId);
            // int days = 1 + DateUtil.getDiffDays(DateUtil.format(startDate, DateUtil.PATTERN_DATE), DateUtil.format(endDate, DateUtil.PATTERN_DATE));
            // days = RunDateUtil.getInstance().getCycleStatistics(days);
            endDate = DateUtil.monthChange(endDate, pattern, 1);
            params.put("cycleStatistics", 30);
            params.put("runDate", endDate);
            if (crowdId != null) {
                Crowd crowd = crowdService.selectByPrimaryKey(crowdId);
                if (crowd != null) {
                    params.put("crowdId", crowdId + "");
                    filter.put("crowdId", crowdId);
                    shopCenterList = getShopCenterList(filter, startDate, endDate, projectId, null, queryVM.getLimit());
                }
            }
        }
        return new ResponseEntity<List<Tag>>(shopCenterList, HttpStatus.OK);
    }

    /**
     * 客群画像 消费能力
     *
     * @param queryVM
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客群画像,消费能力 Shoppingmall足迹",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客群画像,消费能力 Shoppingmall足迹")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryShopBrandList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Tag>> queryShopBrandList(CrowdQueryLimitVM queryVM) throws Exception {
        String startDate = queryVM.getStartDate();
        Integer crowdId = queryVM.getCrowdId();
        Integer projectId = queryVM.getProjectId();
        String endDate = queryVM.getEndDate();
        List<Tag> shopCenterList = null;
        Map<String, Object> filter = new HashMap<>();
        filter.put("projectId", projectId);
        if (null == projectId || startDate == null || endDate == null || crowdId == null) {
            log.error("查询人口属性数据，查询参数为, startDate=" + startDate + ", endDate=" + endDate + ", 参数异常为null ");
        } else {
            Map params = new HashMap<>();
            params.put("projectId", projectId);
            // int days = 1 + DateUtil.getDiffDays(DateUtil.format(startDate, DateUtil.PATTERN_DATE), DateUtil.format(endDate, DateUtil.PATTERN_DATE));
            // days = RunDateUtil.getInstance().getCycleStatistics(days);
            // params.put("cycleStatistics", days);
            endDate = DateUtil.monthChange(endDate, pattern, 1);
            params.put("runDate", endDate);
            if (crowdId != null) {
                Crowd crowd = crowdService.selectByPrimaryKey(crowdId);
                if (crowd != null) {
                    params.put("crowdId", crowdId + "");
                    filter.put("crowdId", crowdId);
                    shopCenterList = getShopBrandList(filter, startDate, endDate, projectId, null, queryVM.getLimit());
                }
            }
        }
        return new ResponseEntity<List<Tag>>(shopCenterList, HttpStatus.OK);
    }

    /**
     * 客群画像 消费能力
     *
     * @param queryVM
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客群画像,消费能力 品牌足迹餐饮",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客群画像,消费能力 品牌足迹餐饮")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryRestaurantBrandList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Tag>> queryRestaurantBrandList(CrowdQueryLimitVM queryVM) throws Exception {
        String startDate = queryVM.getStartDate();
        Integer crowdId = queryVM.getCrowdId();
        Integer projectId = queryVM.getProjectId();
        String endDate = queryVM.getEndDate();
        Map<String, Object> filter = new HashMap<>();
        filter.put("projectId", projectId);
        List<Tag> list = null;
        if (null == projectId || startDate == null || endDate == null || crowdId == null) {
            log.error("查询人口属性数据，查询参数为, startDate=" + startDate + ", endDate=" + endDate + ", 参数异常为null ");
        } else {
            Map params = new HashMap<>();
            params.put("projectId", projectId);
            // int days = 1 + DateUtil.getDiffDays(DateUtil.format(startDate, DateUtil.PATTERN_DATE), DateUtil.format(endDate, DateUtil.PATTERN_DATE));
            // days = RunDateUtil.getInstance().getCycleStatistics(days);
            // params.put("cycleStatistics", days);
            endDate = DateUtil.monthChange(endDate, pattern, 1);
            params.put("runDate", endDate);
            if (crowdId != null) {
                Crowd crowd = crowdService.selectByPrimaryKey(crowdId);
                if (crowd != null) {
                    params.put("crowdId", crowdId + "");
                    filter.put("crowdId", crowdId);
                    list = getRestaurantBrandList(filter, startDate, endDate, projectId, null, queryVM.getLimit());
                }
            }
        }
        return new ResponseEntity<List<Tag>>(list, HttpStatus.OK);
    }


    /**
     * 媒体触点
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客群画像,媒体触点 App使用作息",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客群画像,媒体触点 App使用作息")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryAppUseTimeList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Tag>> queryAppUseTimeList(CrowdQueryVM queryVM) throws Exception {
        Map<String, Object> filter = new HashMap<>();
        List<Tag> list = null;
        Integer crowdId = queryVM.getCrowdId();
        if (crowdId != null) {
            Crowd crowd = crowdService.selectByPrimaryKey(crowdId);
            if (crowd != null) {
                crowdId = crowd.getId();
                filter.put("crowdId", crowdId);
                list = getAppUseTimeList(filter, queryVM.getProjectId(), queryVM.getStartDate(), queryVM.getEndDate());
            }
        }
        return new ResponseEntity<List<Tag>>(list, HttpStatus.OK);
    }

    /**
     * 媒体触点-App列表
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客群画像,媒体触点 App列表",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客群画像,媒体触点 App列表")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryAppUseList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Tag>> queryAppUseList(AppCrowdVM queryVM) throws Exception {
        Map<String, Object> filter = new HashMap<>();
        List<Tag> list = null;
        Integer crowdId = queryVM.getCrowdId();
        if (crowdId != null) {
            Crowd crowd = crowdService.selectByPrimaryKey(crowdId);
            if (crowd != null) {
                crowdId = crowd.getId();
                filter.put("crowdId", crowdId);
                list = getAppUseList(filter, queryVM.getProjectId(), queryVM.getStartDate(), queryVM.getEndDate(), queryVM.getAppType(), queryVM.getHour(), queryVM.getApplistlimit(), queryVM.getAppTouchType());
            }
        }
        return new ResponseEntity<List<Tag>>(list, HttpStatus.OK);
    }


    /**
     * 客户围群 性别比例
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客户围群,性别比例",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客户围群,性别比例")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryBehaviorCrowdSexRate", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<SexVM> queryBehaviorCrowdSexRate(Integer projectId, Integer execId) throws Exception {
        Map params = new HashMap<>();
        params.put("projectId", projectId);
        params.put("execId", execId);
        SexVM sexVM = behaviorCrowdResultService.getSexRateVM(params);
        return new ResponseEntity<SexVM>(sexVM, HttpStatus.OK);
    }


    /**
     * 客户围群 年龄分布
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客户围群,年龄分布",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客户围群,年龄分布")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryBehaviorCrowdAgeDistribution", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<AgeDistributionVM> queryAgeDistribution(Integer projectId, Integer execId) throws Exception {
        Map params = new HashMap<>();
        params.put("projectId", projectId);
        params.put("execId", execId);

        AgeDistributionVM ageDistributionVM = behaviorCrowdResultService.queryAgeDistribution(params);

        return new ResponseEntity<AgeDistributionVM>(ageDistributionVM, HttpStatus.OK);
    }


    /**
     * 客户围群 已婚，育儿，有车
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客户围群,已婚,育儿,有车",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客户围群,已婚,育儿,有车")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryBehaviorCrowdMarryCarChild", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<MarryCarChildVM> queryBehaviorCrowdMarryCarChild(Integer projectId, Integer execId) throws Exception {
        Map params = new HashMap<>();
        params.put("projectId", projectId);
        params.put("execId", execId);
        MarryCarChildVM marryCarChildVM = behaviorCrowdResultService.getMarryCarChild(params);

        return new ResponseEntity<MarryCarChildVM>(marryCarChildVM, HttpStatus.OK);
    }


    /**
     * 客户围群 消费能力
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客户围群,消费能力 所用手机品牌",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客户围群,消费能力 所用手机品牌")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryBehaviorCrowdPhoneBrandList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Tag>> queryBehaviorCrowdPhoneBrandList(Integer projectId, Integer execId) throws Exception {
        Map params = new HashMap<>();
        params.put("projectId", projectId);
        params.put("execId", execId);
        List<Tag> phoneBrandList = getPhoneBrandMap(params, null, null, projectId, null, true);
        return new ResponseEntity<List<Tag>>(phoneBrandList, HttpStatus.OK);
    }


    /**
     * 客户围群 消费能力
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "客户围群,消费能力 所用手机价格",
            httpMethod = "GET",
            response = ResponseEntity.class,
            notes = "客户围群,消费能力  所用手机价格")
    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 500, message = "服务器处理异常")
    })
    @RequestMapping(value = "/queryBehaviorCrowdPhonePriceList", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Tag>> queryBehaviorCrowdPhonePriceList(Integer projectId, Integer execId) throws Exception {
        Map params = new HashMap<>();
        params.put("projectId", projectId);
        params.put("execId", execId);
        List<Tag> phonePriceList = getPhonePriceMap(params, null, null, projectId, null, true);
        return new ResponseEntity<List<Tag>>(phonePriceList, HttpStatus.OK);
    }


    /**
     * 查询 人群 媒体统计情况
     *
     * @param filter
     * @return
     */
    private List<Tag> getAppUseTimeList(Map<String, Object> filter, Integer projectId, String startDate, String endDate) {
        filter.put("projectId", projectId);
        filter.put("startDate", startDate);
        filter.put("endDate", endDate);
        int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
        // filter.put("cycleStatistics", dateLength);
        filter.put("hour", hourArray("0,23"));
        List<Tag> list = tenantAppSignificanceService.queryAppUseByList(filter);
        return list;
    }


    /**
     * 查询 人群 媒体统计情况
     *
     * @param filter
     * @return
     */
    private List<Tag> getAppUseList(Map<String, Object> filter, Integer projectId, String startDate, String endDate, String appType, String hour, Integer applistlimit, String appTouchType) {
        filter.put("projectId", projectId);
        filter.put("startDate", startDate);
        filter.put("endDate", endDate);
        int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
        // filter.put("cycleStatistics", dateLength);
        filter.put("appListLimit", 50);

        if (appType != null && !"".equals(appType)) {
            String[] array = appType.split(",");
            filter.put("appType", array);
        }
        if (hour != null && !"".equals(appType)) {
            filter.put("hour", hourArray(hour));
        } else {
            filter.put("hour", hourArray("0,23"));
        }
        if (applistlimit != null) {
            filter.put("appListLimit", applistlimit);
        }

        if (appTouchType != null && "appPreference".equals(appTouchType)) {
            return tenantAppSignificanceService.queryAppTagByList2(filter);
        } else {
            return tenantAppSignificanceService.queryAppTagByList(filter);
        }
    }

    private static String[] hourArray(String hours) {
        String[] hourArray = null;
        hourArray = hours.split(",");
        int startHour = Integer.valueOf(hourArray[0]);
        int endHour = Integer.valueOf(hourArray[1]);
        int index = 0;
        String[] result = new String[endHour - startHour + 1];
        for (int i = startHour; i < endHour + 1; i++) {
            result[index] = String.valueOf(i);
            index = index + 1;
        }
        return result;
    }

}
