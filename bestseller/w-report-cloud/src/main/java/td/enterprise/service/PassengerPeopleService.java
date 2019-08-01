package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.util.PassengerDateUtil;
import td.enterprise.common.util.RunDateUtil;
import td.enterprise.entity.Crowd;
import td.enterprise.service.DTO.Tag;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>客群画像 相关指标数据Service<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
@Service("passengerPeopleService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PassengerPeopleService {
    public final static Logger logger = Logger.getLogger(PassengerPeopleService.class);
    public static String numFormatterStr = "(?<=\\d)(?=(?:\\d{3})+$)";
    public static String dateStr = "yyyy-MM-dd";

    @Autowired
    public WifiPixTagCountService wifiPixTagCountService;
    @Autowired
    public CrowdService crowdService;
    @Autowired
    public TagsInfoService tagsInfoService;
    @Autowired
    public TenantAppSignificanceService tenantAppSignificanceService;

    public static String[] hourArray(String hours) {
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

    /**
     * 媒体触点，只查询 客群app使用时段分布的数据（不包括时段下所用applist数据）
     *
     * @param crowdId
     * @param tenantId
     * @param projectId
     * @param startDate
     * @param endDate
     * @param appType
     * @return
     */
    public Map<String, List<Tag>> queryMediaTouchListByCrowd(String crowdId, String tenantId, int projectId, String startDate, String endDate, String appType) {
        Map<String, List<Tag>> appData = new HashMap<>();
        Map<String, Object> filter = new HashMap<>();
        filter.put("crowdId", crowdId);
        filter.put("tenantId", tenantId);
        filter.put("projectId", String.valueOf(projectId));
        filter.put("startDate", startDate);
        filter.put("endDate", endDate);

        filter.put("appType", appType);
        int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
        dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
        // filter.put("cycleStatistics", dateLength);
        filter.put("appListLimit", 50);
        filter.put("hour", hourArray("0,23"));
        appData.put("appuse", tenantAppSignificanceService.queryAppUseByList(filter));
        return appData;
    }

    /**
     * 获取 常去餐饮店数据
     *
     * @param crowd
     * @param tenantId
     * @param projectId
     * @return
     */
    public Map<String, List<Tag>> getRestaurantbrandList(Crowd crowd, String tenantId, int projectId, String startDate, String endDate, int restaurantbrandlimit) {
        Map<String, Object> filter = new HashMap<>();
        if (crowd != null) {
            filter.put("crowdId", crowd.getId());
            filter.put("crowdType", crowd.getType());
        }
        if (startDate != null && !startDate.isEmpty()) {
            filter.put("startDate", startDate);
        }
        if (endDate != null && !endDate.isEmpty()) {
            filter.put("endDate", endDate);
        }
        filter.put("projectId", String.valueOf(projectId));
        filter.put("tenantId", tenantId);
        int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
        dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
        // filter.put("cycleStatistics", dateLength);
        filter.put("type", 3); // 餐饮店
        filter.put("listLimit", restaurantbrandlimit);
        List<Tag> restaurantbrandList = wifiPixTagCountService.queryOften2Go(filter);
        Map<String, List<Tag>> resultMap = new HashMap<>();
        resultMap.put("restaurantbrand", restaurantbrandList);
        return resultMap;
    }

    /**
     * 获取常去品牌店 数据
     *
     * @param crowd
     * @param tenantId
     * @param projectId
     * @return
     */
    public Map<String, List<Tag>> getShopbrandList(Crowd crowd, String tenantId, int projectId, String startDate, String endDate, int shopbrandlimit) {
        Map<String, Object> filter = new HashMap<>();
        if (crowd != null) {
            filter.put("crowdId", crowd.getId());
            filter.put("crowdType", crowd.getType());
        }
        if (startDate != null && !startDate.isEmpty()) {
            filter.put("startDate", startDate);
        }
        if (endDate != null && !endDate.isEmpty()) {
            filter.put("endDate", endDate);
        }
        filter.put("projectId", String.valueOf(projectId));
        filter.put("tenantId", tenantId);
        int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
        dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
        // filter.put("cycleStatistics", dateLength);
        filter.put("type", 2); // 品牌店
        filter.put("listLimit", shopbrandlimit);
        List<Tag> shopbrandList = wifiPixTagCountService.queryOften2Go(filter);
        Map<String, List<Tag>> resultMap = new HashMap<>();
        resultMap.put("shopbrand", shopbrandList);
        return resultMap;
    }

    /**
     * 获取常去商业中心数据
     *
     * @param crowd
     * @param tenantId
     * @param projectId
     * @return
     */
    public Map<String, List<Tag>> getShopCenterList(Crowd crowd, String tenantId, int projectId, String startDate, String endDate, int shopcenterlimit) {
        Map<String, Object> filter = new HashMap<>();
        if (crowd != null) {
            filter.put("crowdId", crowd.getId());
            filter.put("crowdType", crowd.getType());
        }
        if (startDate != null && !startDate.isEmpty()) {
            filter.put("startDate", startDate);
        }
        if (endDate != null && !endDate.isEmpty()) {
            filter.put("endDate", endDate);
        }
        filter.put("projectId", String.valueOf(projectId));
        filter.put("tenantId", tenantId);
        int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
        dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
        // filter.put("cycleStatistics", dateLength);
        filter.put("listLimit", shopcenterlimit);
        filter.put("type", 1); // 商业中心
        List<Tag> shopCenterList = wifiPixTagCountService.queryOften2Go(filter);
        Map<String, List<Tag>> resultMap = new HashMap<>();
        resultMap.put("shopcenter", shopCenterList);
        return resultMap;
    }

    /**
     * 获取手机品牌分布数据
     *
     * @param crowd
     * @param tenantId
     * @param projectId
     * @return
     */
    @SuppressWarnings("unchecked")
    public Map<String, List<Tag>> getPhonebrandMap(Crowd crowd, String tenantId, int projectId, String startDate, String endDate) {
        String crowdType = crowd.getType();
        String crowdId = String.valueOf(crowd.getId());
        List<Tag> phonebrandList = new ArrayList<>(); // 手机品牌
        Map<String, List<Tag>> phonebrandMap = new HashMap<>();
        Map params = new HashMap<>();
        params.put("projectId", projectId);
        params.put("tenantId", tenantId);
        int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
        dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
        // params.put("cycleStatistics", dateLength);
        params.put("runDate", endDate);
        params.put("crowdId", crowdId);
        phonebrandMap = crowdService.queryPhoneType(params, false);
        phonebrandList = phonebrandMap.get("phonebrand") == null ? phonebrandList : phonebrandMap.get("phonebrand");
        Map<String, List<Tag>> resultMap = new HashMap<>();
        resultMap.put("phonebrand", phonebrandList);
        return resultMap;
    }

    /**
     * 获取手机价格排名数据
     *
     * @param crowd
     * @param tenantId
     * @param projectId
     * @return
     */
    public Map<String, List<Tag>> getPhonepriceMap(Crowd crowd, String tenantId, int projectId, String startDate, String endDate) {
        String crowdType = crowd.getType();
        String crowdId = crowd.getId().toString();
        Map<String, List<Tag>> phonepriceMap = new HashMap<>();
        List<Tag> phonepriceList = new ArrayList<>(); // 手机价格

        Map params = new HashMap<>();
        params.put("projectId", projectId);
        params.put("tenantId", tenantId);
        int dateLength = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
        dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
        // params.put("cycleStatistics", dateLength);
        // params.put("startDate", startDate);
        // params.put("endDate", endDate);
        params.put("runDate", endDate);
        params.put("crowdId", crowdId);
        phonepriceMap = crowdService.queryPhonePrice(params, false);
        phonepriceList = phonepriceMap.get("phoneprice") == null ? phonepriceList : phonepriceMap.get("phoneprice");
        Map<String, List<Tag>> resultMap = new HashMap<>();
        resultMap.put("phoneprice", phonepriceList);
        return resultMap;
    }

}
