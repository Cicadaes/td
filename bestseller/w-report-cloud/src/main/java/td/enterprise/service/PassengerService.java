package td.enterprise.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.util.DateUtil;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.vm.CountVM;
import td.enterprise.web.vm.ProjectCountVM;
import td.enterprise.web.vm.TrendEnum;
import td.olap.query.WiFiAnalyticsQuerService;

import java.text.DecimalFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>指标类接口service<br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("passengerService")
@Slf4j
public class PassengerService {

    private static String datePattern = "yyyy-MM-dd";
    private static String numFormatterStr = "(?<=\\d)(?=(?:\\d{3})+$)";

    @Autowired
    private ParamService paramService;

    /**
     * 客群概览指标接口
     *
     * @param projectId
     * @param dateTime
     * @return
     */
    public ProjectCountVM queryPassengerCount(String tenantId, Integer projectId, Long dateTime) {
        ProjectCountVM projectCountVM = new ProjectCountVM();
        //今日客流
        CountVM todayUsersVM = new CountVM();
        Map<String, Object> today = queryTodayActivePassenger(tenantId, projectId, dateTime);
        todayUsersVM.setValue(today.containsKey("key") ? today.get("key") + "" : "0");
        todayUsersVM.setValueStr(today.containsKey("keyCn") ? today.get("keyCn") + "" : "0");
        todayUsersVM.setRate(today.get("absValue") + "");//今日客流，今日客流环比
        todayUsersVM.setTrend(Double.parseDouble(today.get("value") + "") > 0 ? TrendEnum.UP : TrendEnum.DOWN);//趋势

        //近7日客流
        CountVM weekUsersVM = new CountVM();
        Map<String, Object> week = queryPassengerCountByDays(tenantId, projectId, 7, dateTime);
        weekUsersVM.setValue(week.get("key") + "");
        weekUsersVM.setValueStr(week.get("keyCn") + "");
        weekUsersVM.setRate(week.get("absValue") + "");
        weekUsersVM.setTrend(Double.parseDouble(week.get("value") + "") > 0 ? TrendEnum.UP : TrendEnum.DOWN);//趋势

        //近30日客流
        CountVM monthUsersVM = new CountVM();
        Map<String, Object> month = queryPassengerCountByDays(tenantId, projectId, 30, dateTime);
        monthUsersVM.setValue(month.get("key") + "");
        monthUsersVM.setValueStr(month.get("keyCn") + "");
        monthUsersVM.setRate(month.get("absValue") + "");
        monthUsersVM.setTrend(Double.parseDouble(month.get("value") + "") > 0 ? TrendEnum.UP : TrendEnum.DOWN);//趋势

        //累计额客流
        Map<String, Object> sum = queryAllPassengerCount(tenantId, projectId);
        projectCountVM.setTotalUsers(sum.get("keyCn") + "");

        //近30日新客
        CountVM monthNewUsersVM = new CountVM();
        Map<String, Object> monthNewUsersMap = queryNewPassengerCountByDays(tenantId, projectId, 30, dateTime);
        monthNewUsersVM.setValue(monthNewUsersMap.get("key") + "");
        monthNewUsersVM.setValueStr(monthNewUsersMap.get("keyCn") + "");
        monthNewUsersVM.setRate(monthNewUsersMap.get("absValue") + "");
        monthNewUsersVM.setTrend(Double.parseDouble(monthNewUsersMap.get("value") + "") > 0 ? TrendEnum.UP : TrendEnum.DOWN);//趋势

        //近30日次均停留时长
        CountVM monthAverageStayDurationVM = new CountVM();
        Map<String, Object> duationMap = queryAvarageByDays(tenantId, projectId, 30, dateTime);
        monthAverageStayDurationVM.setValue(duationMap.get("key") + "");
        monthAverageStayDurationVM.setValueStr(duationMap.get("key") + "");//停留时长不转换单位
        monthAverageStayDurationVM.setRate(duationMap.get("absValue") + "");
        monthAverageStayDurationVM.setTrend(Double.parseDouble(duationMap.get("value") + "") > 0 ? TrendEnum.UP : TrendEnum.DOWN);//趋势

        projectCountVM.setTodayUsersVM(todayUsersVM);
        projectCountVM.setWeekUsersVM(weekUsersVM);
        projectCountVM.setMonthUsersVM(monthUsersVM);
        projectCountVM.setMonthNewUsersVM(monthNewUsersVM);
        projectCountVM.setMonthAverageStayDurationVM(monthAverageStayDurationVM);

        return projectCountVM;
    }

    /**
     * 当天客流人数（活跃）
     *
     * @param tenantId
     * @param projectId
     * @return
     */
    private Map<String, Object> queryTodayActivePassenger(String tenantId, int projectId, Long dateTime) {
        Date date = new Date();
        if (null != dateTime) {
            date.setTime(dateTime);
        }
        Date startBefore = DateUtil.addDay2Date(-1, date);
        Date endBefore = DateUtil.addDay2Date(-1, date);

        String startDate = DateUtil.format(date, datePattern);
        String endDate = DateUtil.format(date, datePattern);
        Long newUser0 = new Long(WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupCount(projectId, startDate, endDate, true));
        Long oldUser0 = new Long(WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupCount(projectId, startDate, endDate, true));
        Long allUser = newUser0 + oldUser0;

        Map<String, Object> map = new HashMap<String, Object>();
        Map<String, Object> key1 = new HashMap<String, Object>();
        key1.put("key", allUser);
        key1.put("value", 0);
        Long newUser = new Long(WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupCount(projectId, DateUtil.format(startBefore, datePattern), DateUtil.format(endBefore, datePattern), true));
        Long oldUser = new Long(WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupCount(projectId, DateUtil.format(startBefore, datePattern), DateUtil.format(endBefore, datePattern), true));
        Long allUser1 = newUser + oldUser;
        Map<String, Object> key1Before = new HashMap<String, Object>();
        key1Before.put("key", allUser1);
        key1Before.put("value", 0);

        Long key1Int = (Long) key1.get("key");
        Long key1IntBefore = (Long) key1Before.get("key");
        DecimalFormat decimalFormat = new DecimalFormat(".00");
        Float value = 0f;
        if (key1IntBefore != 0) {
            value = (float) ((key1Int - key1IntBefore) * 100 / key1IntBefore);
        }
        key1.put("value", key1IntBefore == 0 ? 0 : decimalFormat.format(value));
        key1.put("absValue", key1IntBefore == 0 ? 0 : decimalFormat.format(Math.abs(value)));
        covertNum2Cn((Long) key1.get("key"), key1);
        return key1;
    }

    /**
     * 查询累计总客数量
     *
     * @param tenantId
     * @param projectId
     * @return
     */
    private Map<String, Object> queryAllPassengerCount(String tenantId, int projectId) {
        Long newUser = new Long(WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupCount( projectId, true));
        Long oldUser = new Long(WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupCount( projectId, true));
        Long allUser = newUser + oldUser;
        Map<String, Object> key1 = new HashMap<String, Object>();
        key1.put("key", allUser);
        key1.put("value", 0);
        DecimalFormat decimalFormat = new DecimalFormat(".00");
        covertNum2Cn((Long) key1.get("key"), key1);
        return key1;
    }

    /**
     * 把过10万的数字转为数字+文字组合
     *
     * @param num
     * @param map
     */
    private static void covertNum2Cn(Long num, Map<String, Object> map) {
        if (String.valueOf(num).length() > 5) {
            // DecimalFormat decimalFormat = new DecimalFormat(".00");
            // String val = decimalFormat.format((float) num / 10000);
            long val = num / 10000;
            map.put("keyCn", val + "万");
            map.put("tipsShow", true);
        } else {
            map.put("keyCn", String.valueOf(num).replaceAll(numFormatterStr, ","));
            map.put("tipsShow", false);
        }

    }

    /**
     * 查询日期区间内客均停留时长
     *
     * @param tenantId
     * @param projectId
     * @return
     */
    private Map<String, Object> queryAvarageByDays(String tenantId, int projectId, int days, Long dateTime) {
        Date date = new Date();
        if (null != date) {
            date.setTime(dateTime);
        }
        Date startDate = DateUtil.addDay2Date(-days - 1, date);
        Date endDate = DateUtil.addDay2Date(-1, date);
        Date startBefore = DateUtil.addDay2Date(-2 * days, date);
        Date endBefore = DateUtil.addDay2Date(-days, date);
        String start = DateUtil.format(startDate, datePattern);
        String end = DateUtil.format(endDate, datePattern);

        String startBefore1 = DateUtil.format(startBefore, datePattern);
        String endBefore1 = DateUtil.format(endBefore, datePattern);
        log.info("############# days=" + days + " ," + start + "~~~~" + end + " ###############");
        int duration = 0;

        //近30日停留时长
        duration = avarageDuration(projectId, start, end);
        int durationBefore = avarageDuration(projectId, startBefore1, endBefore1);

        Map<String, Object> key1 = new HashMap<String, Object>();
        key1.put("key", duration);

        DecimalFormat decimalFormat = new DecimalFormat(".00");
        Float value = 0f;
        if (durationBefore != 0) {
            value = (float) (duration - durationBefore) * 100 / durationBefore;
        }
        key1.put("value", duration == 0 ? 0 : decimalFormat.format(value));
        key1.put("absValue", duration == 0 ? 0 : decimalFormat.format(Math.abs(value)));
        key1.put("keyCn", duration);
        return key1;
    }

    /**
     * @param projectId
     * @param startDate
     * @param endDate
     * @return
     */
    private int avarageDuration(int projectId, String startDate, String endDate) {
        Map<String, Integer> stayDurationMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(projectId + "", startDate, endDate, "duration", false);
        Map<String, Integer> stayTimesMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounter(projectId + "", startDate, endDate, "stay_times", false);
        if (null != stayTimesMap && !stayTimesMap.isEmpty()) {
            if (null != stayDurationMap && !stayDurationMap.isEmpty()) {
                int duration = 0;
                for (String key : stayDurationMap.keySet()) {
                    Integer stayUsers = stayTimesMap.get(key);
                    Integer durations = stayDurationMap.get(key);
                    if(0 != stayUsers){
                        duration = durations / stayUsers;
                    }
                    return duration;
                }
            }
        }
        return 0;
    }

    /**
     * 查询日期区间内的客流数据
     *
     * @param tenantId
     * @param projectId
     * @return
     */
    private Map<String, Object> queryNewPassengerCountByDays(String tenantId, int projectId, int days, Long dateTime) {
        Date date = new Date();
        if (null != dateTime) {
            date.setTime(dateTime);
        }
        Date startDate = DateUtil.addDay2Date(-days + 1, date);
        Date endDate = new Date();
        Date startBefore = DateUtil.addDay2Date(-2 * days + 1, date);
        Date endBefore = DateUtil.addDay2Date(-days, date);
        String start = DateUtil.format(startDate, datePattern);
        String end = DateUtil.format(endDate, datePattern);
        log.info("############# days=" + days + " ," + start + "~~~~" + end + " ###############");
        Long newUser = 0l;
        // 需要查询当日实时数据
        newUser = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupCount(projectId, start, end, true);

        Long allUser = newUser;
        Map<String, Object> key1 = new HashMap<String, Object>();
        key1.put("key", allUser);
        key1.put("value", allUser);
        Long newUser1 = new Long(WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupCount(projectId, DateUtil.format(startBefore, datePattern), DateUtil.format(endBefore, datePattern), true));
        Long allUser1 = newUser1;
        Map<String, Object> key1Before = new HashMap<String, Object>();
        key1Before.put("key", allUser1);

        Long key1Int = (Long) key1.get("key");
        Long key1IntBefore = (Long) key1Before.get("key");
        DecimalFormat decimalFormat = new DecimalFormat(".00");
        Float value = 0f;
        if (key1IntBefore != 0) {
            value = (float) (key1Int - key1IntBefore) * 100 / key1IntBefore;
        }
        key1.put("value", key1IntBefore == 0 ? 0 : decimalFormat.format(value));
        key1.put("absValue", key1IntBefore == 0 ? 0 : decimalFormat.format(Math.abs(value)));
        covertNum2Cn((Long) key1.get("key"), key1);
        return key1;
    }


    /**
     * 查询日期区间内的客流数据
     *
     * @param tenantId
     * @param projectId
     * @return
     */
    private Map<String, Object> queryPassengerCountByDays(String tenantId, int projectId, int days, Long dateTime) {
        Date date = new Date();
        if (null != dateTime) {
            date.setTime(dateTime);
        }
        Date startDate = DateUtil.addDay2Date(-days + 1, date);
        Date endDate = new Date();
        Date startBefore = DateUtil.addDay2Date(-2 * days + 1, date);
        Date endBefore = DateUtil.addDay2Date(-days, date);
        String start = DateUtil.format(startDate, datePattern);
        String end = DateUtil.format(endDate, datePattern);
        log.info("############# days=" + days + " ," + start + "~~~~" + end + " ###############");
        Long newUser = 0l;
        Long oldUser = 0l;
        // 需要查询当日实时数据
        newUser = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupCount(projectId, start, end, true);
        oldUser = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupCount(projectId, start, end, true);

        Long allUser = newUser + oldUser;
        Map<String, Object> map = new HashMap<String, Object>();
        Map<String, Object> key1 = new HashMap<String, Object>();
        key1.put("key", allUser);
        key1.put("value", 0);
        Long newUser1 = new Long(WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupCount(projectId, DateUtil.format(startBefore, datePattern), DateUtil.format(endBefore, datePattern), true));
        Long oldUser1 = new Long(WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupCount(projectId, DateUtil.format(startBefore, datePattern), DateUtil.format(endBefore, datePattern), true));
        Long allUser1 = newUser1 + oldUser1;
        Map<String, Object> key1Before = new HashMap<String, Object>();
        key1Before.put("key", allUser1);
        key1Before.put("value", 0);

        Long key1Int = (Long) key1.get("key");
        Long key1IntBefore = (Long) key1Before.get("key");
        DecimalFormat decimalFormat = new DecimalFormat(".00");
        Float value = 0f;
        if (key1IntBefore != 0) {
            value = (float) (key1Int - key1IntBefore) * 100 / key1IntBefore;
        }
        key1.put("value", key1IntBefore == 0 ? 0
                : decimalFormat.format(/* Math.abs(value) */value));
        key1.put("absValue", key1IntBefore == 0 ? 0 : decimalFormat.format(Math.abs(value)));
        covertNum2Cn((Long) key1.get("key"), key1);
        return key1;
    }

}
