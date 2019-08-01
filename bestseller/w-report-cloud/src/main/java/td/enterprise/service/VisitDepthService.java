package td.enterprise.service;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.PassengerDateUtil;
import td.enterprise.entity.*;
import td.enterprise.entity.type.ProjectTypeEnum;
import td.enterprise.page.OfflineCrossOldUserMonthPage;
import td.enterprise.page.ProjectPage;
import td.enterprise.page.ProjectParamPage;
import td.enterprise.page.TenantStayDurationPage;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.vm.*;
import td.olap.query.QueryServiceVisitDepth;
import td.olap.query.WiFiAnalyticsQuerService;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.util.*;

@Service("visitDepthService")
public class VisitDepthService {
    public static String pattern = "yyyy-MM-dd";
    public static String monthPattern = "yyyy-MM";

    private static String numFormatterStr = "(?<=\\d)(?=(?:\\d{3})+$)";
    public final static int HOUR = 3600;
    public final static int MIUNTE = 60;

    @Autowired
    private OfflineOlderUserMonthService offlineOlderUserMonthService;
    @Autowired
    private OfflineCrossOldUserMonthService offlineCrossOldUserMonthService;
    @Autowired
    private ProjectService projectService;

    @Autowired
    private TenantStayDurationService tenantStayDurationService;

    @Autowired
    private ProjectParamService projectParamService;

    @Autowired
    private ParamService paramService;

    public VisitDepthVM mainData(Integer projectId, String start, String end) throws Exception {
        VisitDepthVM visitDepthVM = new VisitDepthVM();
        Date endDate = DateUtil.format(end, pattern);
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        //oldUserMonthDays 老客月均光顾日数 olderUserMonthCount.getDays() / olderUserMonthCount.getOldUsers()
        //averageStayDuration人均停留时长 offline_active_user_duration_day_counter / offline_active_user_day_counter
        //averageOldUsers日均老客数量 offline_old_user_day_counter / dateLength
        //monthCrossUsers月均跨店老客数量 crossOldUserMonth.getCrossUsers()
        //monthOldUsers月均同店老客数量 offline_old_user_day_counter
        //averageDayUsers日均客流 offline_active_user_day_counter / dateLength --需新开发

        Date lastMonthDate = DateUtil.getCalculateMonthDay(endDate, -1); // 上个月
        Date lastMonthBeforeDate = DateUtil.getCalculateMonthDay(endDate, -2); // 上上个月
        String lastMonth = DateUtil.format(lastMonthDate, monthPattern);
        String lastMonthBefore = DateUtil.format(lastMonthBeforeDate, monthPattern);

        //oldUserMonthDays 老客月均光顾日数
        OfflineOlderUserMonth o = new OfflineOlderUserMonth();
        o.setProjectId(projectId);
        o.setMonth(lastMonth);
        OfflineOlderUserMonth olderUserMonthCount = offlineOlderUserMonthService.getDao().findOne(o);
        o.setMonth(lastMonthBefore);
        OfflineOlderUserMonth olderUserMonthCountBefore = offlineOlderUserMonthService.getDao().findOne(o);

        int olderUser = olderUserMonthCount == null || olderUserMonthCount.getOldUsers() == null ? 0 : olderUserMonthCount.getOldUsers();
        int dayCounterLong = olderUserMonthCount == null || olderUserMonthCount.getDays() == null ? 0 : olderUserMonthCount.getDays();

        int olderUser_Before = olderUserMonthCountBefore == null || olderUserMonthCountBefore.getOldUsers() == null ? 0 : olderUserMonthCountBefore.getOldUsers();
        int dayCounterLong_Before = olderUserMonthCountBefore == null || olderUserMonthCountBefore.getDays() == null ? 0 : olderUserMonthCountBefore.getDays();

        Double oldUserMonthDays = olderUser > 0 ? dayCounterLong * 10 / olderUser / 10.0 : 0.0;
        Double oldUserMonthDaysBefore = olderUser_Before > 0 ? dayCounterLong_Before * 10 / olderUser_Before / 10.0 : 0.0;

        Long offline_active_user_day_counter = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySum(projectId + "", start, end, "offline_active_user_day_counter");

        Long offline_active_user_day_counter_Before = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySum(projectId + "", startBefore, endBefore, "offline_active_user_day_counter");

        //averageStayDuration人均停留时长
        Long offline_stay_user_duration_day_counter = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySum(projectId + "", start, end, "offline_stay_user_duration_day_counter");
        Long offline_stay_user_day_counter = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySum(projectId + "", start, end, "offline_stay_user_day_counter");

        Long offline_stay_user_duration_day_counter_Before = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySum(projectId + "", startBefore, endBefore, "offline_stay_user_duration_day_counter");
        Long offline_stay_user_day_counter_Before = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySum(projectId + "", startBefore, endBefore, "offline_stay_user_day_counter");

        Double averageStayDuration = offline_stay_user_duration_day_counter > 0 ? offline_stay_user_duration_day_counter * 10 / offline_stay_user_day_counter / 10.0 : 0.0;
        Double averageStayDurationBefore = offline_stay_user_day_counter_Before > 0 ? offline_stay_user_duration_day_counter_Before * 10 / offline_stay_user_day_counter_Before / 10.0 : 0.0;
        BigDecimal b = new BigDecimal(averageStayDuration);
        averageStayDuration = b.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
        BigDecimal bf = new BigDecimal(averageStayDurationBefore);
        averageStayDurationBefore = bf.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();

        //averageOldUsers日均老客数量
        Long oldUserDate01 = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySum(projectId + "", start, end, "offline_old_user_day_counter");
        Long oldUserDate01Before = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySum(projectId + "", startBefore, endBefore, "offline_old_user_day_counter");

        Double averageOldUsers = dateLength > 0 ? oldUserDate01 * 10 / dateLength / 10.0 : 0.0;
        Double averageOldUsersBefore = dateLength > 0 ? oldUserDate01Before * 10 / dateLength / 10.0 : 0.0;

        //monthCrossUsers月均跨店老客数量
        OfflineCrossOldUserMonthPage crossPage = new OfflineCrossOldUserMonthPage();
        crossPage.setProjectId(projectId);
        crossPage.setMonth(lastMonth);
        OfflineCrossOldUserMonth crossOldUserMonth = offlineCrossOldUserMonthService.queryBySingle(crossPage);
        crossPage.setMonth(lastMonthBefore);
        OfflineCrossOldUserMonth crossOldUserMonthBefore = offlineCrossOldUserMonthService.queryBySingle(crossPage);

        int monthCrossUsers = 0;
        double crossUsersBefore = 0;
        if (null != crossOldUserMonth) {
            monthCrossUsers = crossOldUserMonth.getCrossUsers();
        }
        if (null != crossOldUserMonthBefore) {
            crossUsersBefore = crossOldUserMonthBefore.getCrossUsers();
        }
        double monthCrossUsersBefore = crossUsersBefore > 0 ? crossUsersBefore * 10 / crossUsersBefore / 10.0 : 0.0;

        //monthOldUsers月均同店老客数量
        String monthStart = DateUtil.getFirstDay(lastMonth); //月的第一天
        String monthEnd = DateUtil.getLastDay(lastMonth);
        //月的最后一天
        Long monthOldUsers = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySum(projectId + "", monthStart, monthEnd, "offline_old_user_day_counter");
        monthStart = DateUtil.getFirstDay(lastMonthBefore); //月的第一天
        monthEnd = DateUtil.getLastDay(lastMonthBefore);
        //月的最后一天
        Long sameOldUserDate01Before = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySum(projectId + "", monthStart, monthEnd, "offline_old_user_day_counter");
        double monthOldUsersBefore = sameOldUserDate01Before > 0 ? sameOldUserDate01Before * 10.0 / sameOldUserDate01Before / 10.0 : 0.0;

        //averageDayUsers日均客流 offline_active_user_day_counter / dateLength
        Double averageDayUsers = dateLength > 0 ? offline_active_user_day_counter * 10 / dateLength / 10.0 : 0.0;
        Double averageDayUsersBefore = dateLength > 0 ? offline_active_user_day_counter_Before * 10 / dateLength / 10.0 : 0.0;

        visitDepthVM.setOldUserMonthDays(oldUserMonthDays + "");
        visitDepthVM.setAverageStayDuration(averageStayDuration + "");
        visitDepthVM.setAverageOldUsers(averageOldUsers + "");
        visitDepthVM.setMonthCrossUsers(monthCrossUsers + "");
        visitDepthVM.setMonthOldUsers(monthOldUsers + "");
        visitDepthVM.setAverageDayUsers(averageDayUsers + "");

        //计算环比
        if (oldUserMonthDaysBefore == 0) {
            visitDepthVM.setOldUserMonthDaysRate("0");
        } else {
            BigDecimal bg = new BigDecimal((oldUserMonthDays - oldUserMonthDaysBefore) * 10000 / oldUserMonthDaysBefore / 100.0);
            Double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            visitDepthVM.setOldUserMonthDaysRate(f1 + "");
        }

        if (averageStayDurationBefore == 0) {
            visitDepthVM.setAverageStayDurationRate("0");
        } else {
            BigDecimal bg = new BigDecimal((averageStayDuration - averageStayDurationBefore) * 10000 / averageStayDurationBefore / 100.0);
            Double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            visitDepthVM.setAverageStayDurationRate(f1 + "");
        }

        if (averageOldUsersBefore == 0) {
            visitDepthVM.setAverageOldUsersRate("0");
        } else {
            BigDecimal bg = new BigDecimal((averageOldUsers - averageOldUsersBefore) * 10000 / averageOldUsersBefore / 100.0);
            Double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            visitDepthVM.setAverageOldUsersRate(f1 + "");
        }

        if (monthCrossUsersBefore == 0) {
            visitDepthVM.setMonthCrossUsersRate("0");
        } else {
            BigDecimal bg = new BigDecimal((monthCrossUsers - monthCrossUsersBefore) * 10000 / monthCrossUsersBefore / 100.0);
            Double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            visitDepthVM.setMonthCrossUsersRate(f1 + "");
        }

        if (monthOldUsersBefore == 0) {
            visitDepthVM.setMonthOldUsersRate("0");
        } else {
            BigDecimal bg = new BigDecimal((monthOldUsers - monthOldUsersBefore) * 10000 / monthOldUsersBefore / 100.0);
            Double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            visitDepthVM.setMonthOldUsersRate(f1 + "");
        }

        if (averageDayUsersBefore == 0) {
            visitDepthVM.setAverageDayUsersRate("0");
        } else {
            BigDecimal bg = new BigDecimal((averageDayUsers - averageDayUsersBefore) * 10000 / averageDayUsersBefore / 100.0);
            Double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            visitDepthVM.setAverageDayUsersRate(f1 + "");
        }

        return visitDepthVM;
    }


    /***
     * 月均光顾日数，月均光顾次数，停留率，次均停留时长
     * @param projectId
     * @param start
     * @param end
     * @return
     * @throws Exception
     */
    public DepthSummaryVM getDepthSummary(Integer projectId, String start, String end) throws Exception {
        DepthSummaryVM summaryVM = new DepthSummaryVM();
        Date endDate = DateUtil.format(end, pattern);
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        //先计算月均统计
        Date lastMonthDate = DateUtil.getCalculateMonthDay(endDate, -1); // 上个月
        Date lastMonthBeforeDate = DateUtil.getCalculateMonthDay(endDate, -2); // 上上个月
        Date lastYearMonthDate = DateUtil.getCalculateYearDay(lastMonthDate, -1);// 去年的时间

        String lastMonth = DateUtil.format(lastMonthDate, monthPattern);
        String lastMonthBefore = DateUtil.format(lastMonthBeforeDate, monthPattern);
        //月的最后一天

        String lastYearMonth = DateUtil.format(lastYearMonthDate, monthPattern);

        //月均光顾日数
        Double lastMonthVisitDays = getMonthAverageVisitDays(lastMonth, projectId);
        //上上个月光顾日数
        Double beforeLastMonthVisitDays = getMonthAverageVisitDays(lastMonthBefore, projectId);
        //去年光顾日数
        Double lastYearMonthVisitDays = getMonthAverageVisitDays(lastYearMonth, projectId);

        Double averageDaysMonthRate = 0.0;
        if (beforeLastMonthVisitDays > 0) {
            averageDaysMonthRate = (lastMonthVisitDays - beforeLastMonthVisitDays) / beforeLastMonthVisitDays;
        }
        Double averageDaysYearRate = 0.0;
        if (lastYearMonthVisitDays > 0) {
            averageDaysYearRate = (lastMonthVisitDays - lastYearMonthVisitDays) / lastYearMonthVisitDays;
        }

        DecimalFormat format = new DecimalFormat("0.#");
        summaryVM.setMonthAverageDays(format.format(lastMonthVisitDays));
        summaryVM.setAverageDaysMonthRate(format.format(Math.abs(averageDaysMonthRate)));
        summaryVM.setAverageDaysMonthTrend(averageDaysMonthRate > 0 ? TrendEnum.UP : TrendEnum.DOWN);
        summaryVM.setAverageDaysYearRate(format.format(Math.abs(averageDaysYearRate)));
        summaryVM.setAverageDaysYearTrend(averageDaysYearRate > 0 ? TrendEnum.UP : TrendEnum.DOWN);


        //月均光顾次数
        Double lastMonthVisitTimes = getMonthAverageVisitTimesDays(lastMonth, projectId);
        //上上个月光顾次数
        Double beforeLastMonthVisitTimes = getMonthAverageVisitTimesDays(lastMonthBefore, projectId);
        //去年光顾次数
        Double lastYearMonthVisitTimes = getMonthAverageVisitTimesDays(lastYearMonth, projectId);

        Double averageTimeMonthRate = 0.0;
        if (beforeLastMonthVisitTimes > 0) {
            averageTimeMonthRate = (lastMonthVisitTimes - beforeLastMonthVisitTimes) / beforeLastMonthVisitTimes;
        }
        Double averageTimeYearRate = 0.0;
        if (lastYearMonthVisitTimes > 0) {
            averageTimeYearRate = (lastMonthVisitTimes - lastYearMonthVisitTimes) / lastYearMonthVisitTimes;
        }

        summaryVM.setMonthAverageTimes(format.format(lastMonthVisitTimes));
        summaryVM.setAverageTimesMonthRate(format.format(Math.abs(averageTimeMonthRate)));
        summaryVM.setAverageTimesMonthTrend(averageTimeMonthRate > 0 ? TrendEnum.UP : TrendEnum.DOWN);
        summaryVM.setAverageTimesYearRate(format.format(Math.abs(averageDaysYearRate)));
        summaryVM.setAverageTimesYearTrend(averageTimeYearRate > 0 ? TrendEnum.UP : TrendEnum.DOWN);


        //停留率
        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        Date startDate = DateUtil.format(end, pattern);
        Date startYearBeforeDate = DateUtil.getCalculateYearDay(startDate, -1);// 去年开始时间
        Date endYearBeforeDate = DateUtil.getCalculateYearDay(endDate, -1);    // 去年结束时间

        String startYearBefore = DateUtil.format(startYearBeforeDate, pattern);
        String endYearBefore = DateUtil.format(endYearBeforeDate, pattern);

        Double stayRate = getProjectStayRate(start, end, projectId);
        Double stayRateBefore = getProjectStayRate(startBefore, endBefore, projectId);
        Double stayRateYearBefore = getProjectStayRate(startYearBefore, endYearBefore, projectId);

        Double stayRateMonthRate = 0.0;

        if (stayRateBefore > 0) {
            stayRateMonthRate = (stayRate - stayRateBefore) / stayRateBefore;
        }
        Double stayRateYearRate = 0.0;
        if (stayRateYearBefore > 0) {
            stayRateYearRate = (stayRate - stayRateYearBefore) / stayRateYearBefore;
        }

        summaryVM.setStayRate(format.format(stayRate));
        summaryVM.setStayRateMonthRate(format.format(Math.abs(stayRateMonthRate)));
        summaryVM.setStayRateMonthTrend(stayRateMonthRate > 0 ? TrendEnum.UP : TrendEnum.DOWN);
        summaryVM.setStayRateYearRate(format.format(Math.abs(stayRateMonthRate)));
        summaryVM.setStayRateYearTrend(stayRateYearRate > 0 ? TrendEnum.UP : TrendEnum.DOWN);

        //停留时长
        Integer stayTimesDuration = getProjectStayTimesDurationRate(start, end, projectId);
        Integer stayTimesDurationBefore = getProjectStayTimesDurationRate(startBefore, endBefore, projectId);
        Integer stayTimesDurationYearBefore = getProjectStayTimesDurationRate(startYearBefore, endYearBefore, projectId);

        Double stayTimesDurationMonthRate = 0.0;

        if (stayTimesDurationBefore > 0) {
            stayTimesDurationMonthRate = (stayTimesDuration - stayTimesDurationBefore) * 10.0 / stayTimesDurationBefore / 10.0;
        }
        Double stayTimesDuratioYearRate = 0.0;
        if (stayTimesDurationYearBefore > 0) {
            stayTimesDuratioYearRate = (stayTimesDuration - stayTimesDurationYearBefore) * 10.0 / stayTimesDurationYearBefore / 10.0;
        }

        summaryVM.setStayTimesDuration(stayTimesDuration + "");
        summaryVM.setStayTimesDurationMonthRate(format.format(Math.abs(stayTimesDurationMonthRate)));
        summaryVM.setStayTimesDurationMonthTrend(stayTimesDurationMonthRate > 0 ? TrendEnum.UP : TrendEnum.DOWN);
        summaryVM.setStayTimesDurationYearRate(format.format(Math.abs(stayTimesDuratioYearRate)));
        summaryVM.setStayTimesDurationYearTrend(stayTimesDuratioYearRate > 0 ? TrendEnum.UP : TrendEnum.DOWN);

        return summaryVM;
    }


    /**
     * 返回月均光顾日数，这段时间的光顾日数
     *
     * @param month
     * @param projectId
     * @return
     */
    private Double getMonthAverageVisitDays(String month, Integer projectId) {
        String days = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryMonthCounter(projectId, month, WiFiAnalyticsQuerService.MONTH_DAYS);
        if (StringUtils.isNotBlank(days)) {
            return Double.parseDouble(days);
        }
        return 0.0D;
    }


    /**
     * 返回月均光顾次数
     *
     * @param month
     * @param projectId
     * @return
     */
    private Double getMonthAverageVisitTimesDays(String month, Integer projectId) {
        String days = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryMonthCounter(projectId, month, WiFiAnalyticsQuerService.MONTH_TIMES);
        if (StringUtils.isNotBlank(days)) {
            return Double.parseDouble(days);
        }
        return 0.0D;
    }


    /**
     * 停留率
     *
     * @param startDate
     * @param endDate
     * @param projectId
     * @return
     */
    private Double getProjectStayRate(String startDate, String endDate, Integer projectId) {
        //总到访人数
        Map <String, Integer> activeUsersMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(projectId + "", startDate, endDate, WiFiAnalyticsQuerService.ACTIVE);
        //总停留人数
        Map <String, Integer> stayUsersMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(projectId + "", startDate, endDate, WiFiAnalyticsQuerService.STAY);

        int activeUsers = activeUsersMap.get(projectId + "") == null ? 0 : activeUsersMap.get(projectId + "");
        int stayUsers = stayUsersMap.get(projectId + "") == null ? 0 : stayUsersMap.get(projectId + "");

        if (activeUsers > 0) {
            return stayUsers * 100.0 / activeUsers;
        }

        return 0.0D;
    }


    /**
     * 次均停留时长
     *
     * @param startDate
     * @param endDate
     * @param projectId
     * @return
     */
    private Integer getProjectStayTimesDurationRate(String startDate, String endDate, Integer projectId) {
        //总停留次数
        Map <String, Integer> stayTimesMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(projectId + "", startDate, endDate, WiFiAnalyticsQuerService.STAY_TIMES);
        //总停留时间
        Map <String, Integer> stayDurationMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(projectId + "", startDate, endDate, WiFiAnalyticsQuerService.STAY_DURATION);

        int stayTimes = stayTimesMap.get(projectId + "") == null ? 0 : stayTimesMap.get(projectId + "");
        int stayDuration = stayDurationMap.get(projectId + "") == null ? 0 : stayDurationMap.get(projectId + "");

        if (stayTimes > 0) {
            return stayDuration / stayTimes;
        }
        return 0;
    }


    //进店次数分布
    public List <Map <Object, Object>> enterRoomDegreeList(Integer projectId, String start, String end, Integer type) throws Exception {

        List <Map <Object, Object>> list = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryEnterUserDegreeList(projectId, start, end, type);

        return list;
    }

    /**
     * 驻留时长分布
     *
     * @param projectId
     * @param start
     * @param end
     * @return
     * @throws Exception
     */
    public VisitTimesDurationVM visitTimesDuration(Integer projectId, String start, String end) throws Exception {
        VisitTimesDurationVM durationVM;
        //驻留时长分布
        //添加驻留时长分布接口
        //分钟15，30，60，100（默认）
        //小时30，60，120，240，999
        ProjectParamPage page = new ProjectParamPage();
        page.setProjectId(projectId);
        page.setKey(ReportConstants.ProjectParamKey.PROJECT_STAYTIMEDISTRIBUTION_UNIT);
        ProjectParam projectParam = projectParamService.queryBySingle(page);
        String paramValue = "";
        if (projectParam != null && StringUtils.isNotBlank(projectParam.getValue())) {
            paramValue = projectParam.getValue();
        } else {
            paramValue = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_PROJECT_THRESHOLDTIME_UNIT).getParamValue();
        }

        Map <String, Integer> map = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryEnterDurationDistributeCounter(projectId, start, end);
        if (paramValue.equals(String.valueOf(HOUR))) {
            // if (map.get("999") != null) {//数据库也有小时的区间，其他都取分钟
                durationVM = getHourVisitTimesDurationVM(map);
            // } else {
            //     durationVM = getMinuteVisitTimesDurationVM(map);
            // }
        } else {
            // if (map.get("100") != null) {//只有数据库没有分钟的区间时，才取小时
                durationVM = getMinuteVisitTimesDurationVM(map);
            // } else {
            //     durationVM = getHourVisitTimesDurationVM(map);
            // }
        }
        return durationVM;
    }

    /**
     * 小时分布
     *
     * @param map
     * @return
     */
    private VisitTimesDurationVM getHourVisitTimesDurationVM(Map <String, Integer> map) {
        VisitTimesDurationVM visitTimesDurationVM = new VisitTimesDurationVM();
        if (null != map) {
            for (String key : map.keySet()) {
                Integer value = map.get(key);
                switch (key) {
                    case "0.5":
                        visitTimesDurationVM.setHour30(value);
                        break;
                    case "1":
                        visitTimesDurationVM.setHour60(value);
                        break;
                    case "2":
                        visitTimesDurationVM.setHour120(value);
                        break;
                    case "4":
                        visitTimesDurationVM.setHour240(value);
                        break;
                    case "999":
                        visitTimesDurationVM.setHour999(value);
                        break;
                }
            }
        }
        visitTimesDurationVM.setType(HOUR);
        return visitTimesDurationVM;
    }

    /**
     * 分钟分布
     *
     * @param map
     * @return
     */
    private VisitTimesDurationVM getMinuteVisitTimesDurationVM(Map <String, Integer> map) {
        VisitTimesDurationVM visitTimesDurationVM = new VisitTimesDurationVM();
        if (null != map) {
            for (String key : map.keySet()) {
                Integer value = map.get(key);
                switch (key) {
                    case "15":
                        visitTimesDurationVM.setMinute15(value);
                        break;
                    case "30":
                        visitTimesDurationVM.setMinute30(value);
                        break;
                    case "60":
                        visitTimesDurationVM.setMinute60(value);
                        break;
                    case "100":
                        visitTimesDurationVM.setMinute100(value);
                        break;
                }
            }
        }
        visitTimesDurationVM.setType(MIUNTE);
        return visitTimesDurationVM;
    }

    /**
     * 人均停留时长
     *
     * @param projectId
     * @param start
     * @param end
     * @return
     * @throws Exception
     */
    public PassengerDurationListVM avarageStayDuration(int projectId, String start, String end) throws Exception {
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);
        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        List <Map <String, Object>> key5 = getKey5ByeDateForChain(projectId, start, end, dateLength, "", 0);

        Double newUser = 0.0;
        Double oldUser = 0.0;
        Double total = 0.0;//总人均
        for (Map <String, Object> map2 : key5) {
            if (map2.get("newperson") != null) {
                newUser += (Double) map2.get("newperson");
            }
            if (map2.get("oldperson") != null) {
                oldUser += (Double) map2.get("oldperson");
            }
            if (map2.get("type2Value") != null) {
                total += Double.parseDouble(map2.get("type2Value") + "");
            }
        }
        Double allUser = newUser + oldUser;
        ProjectPage page = new ProjectPage();
        page.setId(projectId);

        List <Map <String, Object>> key5Before = null;
        key5Before = getKey5ByeDateForChain(projectId, startBefore, endBefore, dateLength, "", 0);
        Double totalBefore = 0.0;//总人均
        for (Map <String, Object> map2 : key5Before) {
            if (map2.get("type2Value") != null) {
                totalBefore += Double.parseDouble(map2.get("type2Value") + "");
            }
        }

        Double dailyBefore = 0.0;

        //每天平均加起来，除以天数
        dailyBefore = totalBefore / dateLength;

        BigDecimal bg0 = new BigDecimal(allUser);
        Double f0 = bg0.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();

        String totalStr = String.valueOf(f0).replaceAll(numFormatterStr, ",");
        PassengerDurationListVM listVM = new PassengerDurationListVM();
        listVM.setTotal(totalStr); // 总数
        listVM.setTrend(TrendEnum.DOWN);

        //每天平均
        Double daily = 0.0;

        //每天平均加起来，除以天数
        daily = total / dateLength;
        BigDecimal bg = new BigDecimal(daily);
        Double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
        DecimalFormat decimalFormat = new DecimalFormat("0.00");
        String dailyStr = String.valueOf(f1).replaceAll(numFormatterStr, ",");
        listVM.setDaily(dailyStr); // 日均
        if (allUser == 0) {
            listVM.setNewDaily("0");
        } else {
            listVM.setNewDaily(decimalFormat.format(newUser * 10000.0 / allUser / 100.0));
        }

        //计算环比
        if (dailyBefore == 0) {
            listVM.setRate("0");
        } else {
            bg = new BigDecimal((daily - dailyBefore) * 10000 / dailyBefore / 100.0);
            f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            listVM.setRate(Math.abs(f1) + "" );//环比
            listVM.setTrend(f1 > 0 ? TrendEnum.UP : TrendEnum.DOWN);
        }

        //映射到VM中
        List <PassengerDurationVM> list = new ArrayList <PassengerDurationVM>();
        for (Map <String, Object> map : key5) {
            PassengerDurationVM tmp = new PassengerDurationVM();
            tmp.setDate(map.get("key_as_string") + "");
            tmp.setAvarageNewDuration(map.get("newpersonStr") + "");
            tmp.setAvarageOldDuration(map.get("oldpersonStr") + "");
            tmp.setAvarageDuration(decimalFormat.format(map.get("type2Value")));
            double avarageDuration = (Double) map.get("type2Value");
            double beforeAvarageDuration = 0.0;
            for (Map <String, Object> mapBefore : key5Before) {
                if (PassengerDateUtil.getDateBefore((String) map.get("key_as_string"), dateLength).equals(mapBefore.get("key_as_string"))) {
                    beforeAvarageDuration = (Double) mapBefore.get("type2Value");
                }
            }
            if (beforeAvarageDuration == 0) {
                tmp.setMonthRate("0.0");
            } else {
                BigDecimal monthRateBd = new BigDecimal((avarageDuration - beforeAvarageDuration) * 10000 / beforeAvarageDuration / 100.0);
                Double monthRate = monthRateBd.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
                tmp.setMonthRate(Math.abs(monthRate) + "");
            }
            tmp.setTrend(f1 > 0 ? TrendEnum.UP : TrendEnum.DOWN);
            list.add(tmp);
        }

        //映射到VM中
        List <PassengerDurationVM> beforeList = new ArrayList <PassengerDurationVM>();
        for (Map <String, Object> map : key5Before) {
            PassengerDurationVM tmp = new PassengerDurationVM();
            tmp.setDate(map.get("key_as_string") + "");
            tmp.setAvarageNewDuration(map.get("newpersonStr") + "");
            tmp.setAvarageOldDuration(map.get("oldpersonStr") + "");
            tmp.setAvarageDuration(decimalFormat.format(map.get("type2Value")));
            beforeList.add(tmp);
        }

        //置空
        key5.clear();
        key5Before.clear();
        key5 = null;
        key5Before = null;

        listVM.setList(list);
        listVM.setBeforeList(beforeList);
        return listVM;
    }


    /**
     * 人均进店数量
     *
     * @param projectId
     * @param start
     * @param end
     * @return
     * @throws Exception
     */
    public EnterRoomCountListVM avarageEnterRoomCount(int projectId, String start, String end) throws Exception {
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);
        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        List <EnterShopCountVM> key5 = queryEnterShopList(projectId, start, end, OrderEnum.ASC);

        Double newUser = 0.0;
        Double oldUser = 0.0;
        Double total = 0.0;//总人均
        for (EnterShopCountVM countVM : key5) {
            newUser += Double.parseDouble(countVM.getNewCount());
            oldUser += Double.parseDouble(countVM.getOldCount());
            total += Double.parseDouble(countVM.getActiveCount());
        }

        Double allUser = newUser + oldUser;

        List <EnterShopCountVM> key5Before = null;
        key5Before = queryEnterShopList(projectId, startBefore, endBefore, OrderEnum.ASC);
        Double totalBefore = 0.0;//总人均
        for (EnterShopCountVM countVM : key5Before) {
            totalBefore += Double.parseDouble(countVM.getActiveCount());
        }

        BigDecimal bg0 = new BigDecimal(allUser);
        Double f0 = bg0.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();

        String totalStr = String.valueOf(f0).replaceAll(numFormatterStr, ",");
        EnterRoomCountListVM listVM = new EnterRoomCountListVM();
        listVM.setTotal(totalStr); // 总数
        listVM.setTrend(TrendEnum.DOWN);

        //每天平均
        Double daily = 0.0;

        //每天平均加起来，除以天数
        daily = total / dateLength;
        BigDecimal bg = new BigDecimal(daily);
        Double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();

        String dailyStr = String.valueOf(f1).replaceAll(numFormatterStr, ",");
        listVM.setDaily(dailyStr); // 日均
        if (allUser == 0) {
            listVM.setNewDaily("0");
        } else {
            DecimalFormat decimalFormat = new DecimalFormat("0.00");
            listVM.setNewDaily(decimalFormat.format(newUser * 10000 / allUser / 100.0));
        }

        Double dailyBefore = 0.0;

        dailyBefore = totalBefore / dateLength;
        if (dailyBefore == 0) {
            listVM.setRate("0");
        } else {
            bg = new BigDecimal((daily - dailyBefore) * 10000 / dailyBefore / 100.0);
            f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            listVM.setRate(Math.abs(f1) + "");//环比
            listVM.setTrend(f1 > 0 ? TrendEnum.UP : TrendEnum.DOWN);
        }

        List <EnterRoomCountVM> list = new ArrayList <EnterRoomCountVM>();
        //映射到VM中
        for (EnterShopCountVM countVM : key5) {
            EnterRoomCountVM tmp = new EnterRoomCountVM();
            tmp.setNewCount(countVM.getNewCount());
            tmp.setOldCount(countVM.getOldCount());
            tmp.setTotalCount(countVM.getActiveCount());
            tmp.setDate(countVM.getDate());
            list.add(tmp);
        }

        List <EnterRoomCountVM> beforeList = new ArrayList <EnterRoomCountVM>();
        //映射到VM中
        for (EnterShopCountVM countVM : key5Before) {
            EnterRoomCountVM tmp = new EnterRoomCountVM();
            tmp.setNewCount(countVM.getNewCount());
            tmp.setOldCount(countVM.getOldCount());
            tmp.setTotalCount(countVM.getActiveCount());
            tmp.setDate(countVM.getDate());
            beforeList.add(tmp);
        }

        //置空
        key5.clear();
        key5Before.clear();
        key5 = null;
        key5Before = null;

        listVM.setList(list);
        listVM.setBeforeList(beforeList);
        return listVM;
    }


    public Map <String, Object> chartData2(int projectId, String start, String end, int dataType) throws Exception {

        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);
        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);
        Map <String, Object> map = new HashMap <String, Object>();

        List <Map <String, Object>> key5 = null;

        key5 = getKey5ByeDateForChain(projectId, start, end, dateLength, "", dataType);

        Double newUser = 0.0;
        Double oldUser = 0.0;
        Double type2ValueTotal = 0.0;//总人均
        for (Map <String, Object> map2 : key5) {
            if (map2.get("newperson") != null) {
                newUser += (Double) map2.get("newperson");
            }
            if (map2.get("oldperson") != null) {
                oldUser += (Double) map2.get("oldperson");
            }
            if (map2.get("type2Value") != null) {
                type2ValueTotal += Integer.parseInt(map2.get("type2Value") + "");
            }
        }
        Double allUser = newUser + oldUser;
        ProjectPage page = new ProjectPage();
        page.setId(projectId);
        Project project = projectService.queryBySingle(page);
        boolean isHisense = false;
        if (project != null && project.getProjectType() != null) {
            int type = project.getProjectType();
            if (type == 7 || type == 8 || type == 9) {
                isHisense = true;
            }
        }
        if (dataType == 2 && !isHisense) {
            allUser = allUser / 60;
        }

        List <Map <String, Object>> key5Before = null;
        key5Before = getKey5ByeDateForChain(projectId, startBefore, endBefore, dateLength, "", dataType);
        Double newUserBefore = 0.0;
        Double oldUserBefore = 0.0;
        for (Map <String, Object> map2 : key5Before) {
            if (map2.get("newperson") != null) {
                newUserBefore += (Double) map2.get("newperson");
            }
            if (map2.get("oldperson") != null) {
                oldUserBefore += (Double) map2.get("oldperson");
            }
        }
        Double allUserBefore = newUserBefore + oldUserBefore;

        BigDecimal bg0 = new BigDecimal(allUser);
        Double f0 = bg0.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();

        String totalStr = String.valueOf(f0).replaceAll(numFormatterStr, ",");
        map.put("total", /* allUser */ totalStr); // 总数
        if (allUserBefore == 0) {
            map.put("chain", new Double(0));
        } else {

            BigDecimal bg = new BigDecimal((allUser - allUserBefore) * 10000 / allUserBefore / 100.0);
            Double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();

            map.put("chain", f1);
        }
        Double daily = (allUser * 100 / dateLength / 100.0);
        daily = type2ValueTotal / dateLength;
        BigDecimal bg = new BigDecimal(daily);
        Double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();

        String dailyStr = String.valueOf(f1).replaceAll(numFormatterStr, ",");
        map.put("daily", /* allUser/dateLength */ dailyStr); // 日均

        if (allUser == 0) {
            map.put("newdaily", 0d);
        } else {
            map.put("newdaily", newUser * 10000 / allUser / 100.0);
        }

        map.put("tlistCycle", key5);
        map.put("_tlistCycle", key5Before);

        return map;
    }

    public List <Map <String, Object>> getKey5ByeDateForChain(Integer projectId, String start, String end, Long dateLength, String orderType, int dataType) throws ParseException {

        Date startDate = DateUtil.format(start, pattern);
        Date endDate = DateUtil.format(end, pattern);
        Map newUserTmp = null;
        Map oldUserTmp = null;

        Map newUserBase = null;
        Map oldUserBase = null;

        TenantStayDurationPage stayPage = new TenantStayDurationPage();
        stayPage.setProjectId(projectId);
        stayPage.setStart(start);
        stayPage.setEnd(end);
        List <TenantStayDuration> list = tenantStayDurationService.queryList(stayPage);
        oldUserTmp = new HashMap <String, String>();
        newUserTmp = new HashMap <String, String>();
        oldUserBase = new HashMap <String, String>();
        newUserBase = new HashMap <String, String>();
        for (TenantStayDuration t : list) {
            oldUserTmp.put(t.getDate(), t.getOldDuration() == null ? null : t.getOldDuration() + "");
            oldUserBase.put(t.getDate(), t.getOldUsers() == null ? null : t.getOldUsers() + "");

            newUserTmp.put(t.getDate(), t.getNewDuration() == null ? null : t.getNewDuration() + "");
            newUserBase.put(t.getDate(), t.getNewUsers() == null ? null : t.getNewUsers() + "");
        }

        List <Map <String, Object>> key5 = new ArrayList <Map <String, Object>>();
        Calendar calendar = Calendar.getInstance();
        if ("desc".equals(orderType)) {
            calendar.setTime(endDate);
        } else {
            calendar.setTime(startDate);
        }
        DecimalFormat decimalFormat = new DecimalFormat("0.00");
        for (int i = 0; i < dateLength; i++) {
            Date dateObj = calendar.getTime();
            if ("desc".equals(orderType)) {
                calendar.add(Calendar.HOUR, -24); // 数据按日期降序排序
            } else {
                calendar.add(Calendar.HOUR, +24); // 数据按日期升序排序
            }
            String curDate = DateUtil.format(dateObj, pattern);
            Map <String, Object> mapTmp = new HashMap <String, Object>();

            Long newUesrCurDateTop = newUserTmp.get(curDate) == null ? 0 : Long.parseLong((String) newUserTmp.get(curDate));
            Long oldUesrCurDateTop = oldUserTmp.get(curDate) == null ? 0 : Long.parseLong((String) oldUserTmp.get(curDate));

            Long newUesrCurDateBase = newUserBase.get(curDate) == null ? 0 : Long.parseLong((String) newUserBase.get(curDate));
            Long oldUesrCurDateBase = oldUserBase.get(curDate) == null ? 0 : Long.parseLong((String) oldUserBase.get(curDate));

            Double newUesrCurDate = newUesrCurDateBase > 0 ? newUesrCurDateTop * 10 / newUesrCurDateBase / 10.0 : 0.0;
            Double oldUesrCurDate = oldUesrCurDateBase > 0 ? oldUesrCurDateTop * 10 / oldUesrCurDateBase / 10.0 : 0.0;

            mapTmp.put("key_as_string", curDate);
            mapTmp.put("newperson", newUesrCurDate);
            mapTmp.put("oldperson", oldUesrCurDate);

            mapTmp.put("newpersonStr", decimalFormat.format(newUesrCurDate));
            mapTmp.put("oldpersonStr", decimalFormat.format(oldUesrCurDate));
            Double sums = newUesrCurDate + oldUesrCurDate;
            long totalUsers = newUesrCurDateBase + oldUesrCurDateBase;
            long totalStayMinutes = newUesrCurDateTop + oldUesrCurDateTop;
            if (totalUsers == 0) {
                mapTmp.put("type2Value", 0.0);
            } else {
                mapTmp.put("type2Value", totalStayMinutes * 10.0 / totalUsers / 10.0);
            }

            BigDecimal bg = new BigDecimal(sums);
            sums = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            String sumsStr = String.valueOf(sums).replaceAll(numFormatterStr, ",");
            mapTmp.put("sumsStr", sumsStr);
            mapTmp.put("sums", sums);

            key5.add(mapTmp);
        }
        return key5;
    }

    /**
     * 人均停留时长详情
     *
     * @param projectId
     * @param start
     * @param end
     * @return
     * @throws ParseException
     */
    public List <PassengerDurationVM> avarageStayDurationDetail(int projectId, String start, String end) throws ParseException {
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);
        List <PassengerDurationVM> resultList = new ArrayList <PassengerDurationVM>();
        List <Map <String, Object>> list = null;
        list = getKey5ByeDateForChain(projectId, start, end, dateLength, "desc", 2);

        //计算环比使用
        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        List <Map <String, Object>> beforeList = getKey5ByeDateForChain(projectId, startBefore, endBefore, dateLength, "desc", 2);

        //环比格式化
        DecimalFormat decimalFormat = new DecimalFormat("0.00");

        for (int i = 0; i < list.size(); i++) {
            Map <String, Object> map = list.get(i);
            Map <String, Object> beforeMap = beforeList.get(i);
            PassengerDurationVM durationVM = new PassengerDurationVM();
            durationVM.setDate(map.get("key_as_string") + "");
            durationVM.setAvarageNewDuration(map.get("newpersonStr") + "");
            durationVM.setAvarageOldDuration(map.get("oldpersonStr") + "");
            durationVM.setAvarageDuration(decimalFormat.format(map.get("type2Value")));

            //计算环比
            Double averageDuration = Double.parseDouble(map.get("type2Value") + "");
            Double averageDurationBefore = Double.parseDouble(beforeMap.get("type2Value") + "");
            double monthRate = 0;
            if (0 != averageDurationBefore) {
                monthRate = (averageDuration - averageDurationBefore) * 100 / averageDurationBefore;
            }
            durationVM.setTrend(monthRate > 0 ? TrendEnum.UP : TrendEnum.DOWN);
            BigDecimal bg = new BigDecimal(monthRate);
            double monthRateValue = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            durationVM.setMonthRate(decimalFormat.format(Math.abs(monthRate)));
            durationVM.setMonthRateValue(monthRateValue);
            resultList.add(durationVM);
        }
        return resultList;
    }


    /**
     * 客均进店数量
     *
     * @param projectId
     * @param start
     * @param end
     * @return
     * @throws ParseException
     */
    public List <EnterShopCountVM> queryEnterShopList(int projectId, String start, String end, OrderEnum orderType) throws ParseException {
        List <EnterShopCountVM> list = new ArrayList <EnterShopCountVM>();
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);
        Date endDate = DateUtil.format(end, pattern);
        Date startDate = DateUtil.format(start, pattern);
        Calendar calendar = Calendar.getInstance();
        if (OrderEnum.DESC.getValue() == orderType.getValue()) {
            calendar.setTime(endDate);
        } else {
            calendar.setTime(startDate);
        }

        Project project = projectService.selectByPrimaryKey(projectId);
        List <Project> projectList = new ArrayList <>();
        if (project.getProjectType().equals(ProjectTypeEnum.PROJECT_ERROR.getCode())) {
            //查询店组下 对应店铺项目列表
            ProjectPage page = new ProjectPage();
            page.setPageEnabled(false);
            page.getPager().setPageEnabled(false);
            page.setId(projectId);
            page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
            page.setProjectType(ProjectTypeEnum.PROJECT_SHOP.getCode());
            projectList = projectService.getDirectChildrenByParam(page);
        } else if (project.getProjectType().equals(ProjectTypeEnum.PROJECT_SHOP.getCode())) {
            //如果是店铺 则查本项目
            projectList.add(project);
        }

        StringBuffer buffer = new StringBuffer();
        //拼凑项目ID列表
        if (null != projectList) {
            for (Project pr : projectList) {
                buffer.append(pr.getId()).append(",");
            }
            if (buffer.length() > 0) {
                buffer.deleteCharAt(buffer.length() - 1);
            }
        }

        String projectIds = buffer.toString();

        //计算环比使用
        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        //每天排重后到访人数 新客
        Map <String, Integer> newMap = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySumFromCubeByDate(projectIds, start, end, WiFiAnalyticsQuerService.NEW);
        Map <String, Integer> oldMap = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySumFromCubeByDate(projectIds, start, end, WiFiAnalyticsQuerService.OLD);

        Map <String, Integer> newCounterMap = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySumFromCounterByDate(projectIds, start, end, WiFiAnalyticsQuerService.NEW);
        Map <String, Integer> oldCounterMap = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySumFromCounterByDate(projectIds, start, end, WiFiAnalyticsQuerService.OLD);

        //历史记录 到访人数
        Map <String, Integer> newMapBefore = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySumFromCubeByDate(projectIds, startBefore, endBefore, WiFiAnalyticsQuerService.NEW);
        Map <String, Integer> oldMapBefore = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySumFromCubeByDate(projectIds, startBefore, endBefore, WiFiAnalyticsQuerService.OLD);

        Map <String, Integer> newCounterMapBefore = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySumFromCounterByDate(projectIds, startBefore, endBefore, WiFiAnalyticsQuerService.NEW);
        Map <String, Integer> oldCounterMapBefore = QueryServiceVisitDepth.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySumFromCounterByDate(projectIds, startBefore, endBefore, WiFiAnalyticsQuerService.OLD);

        //环比格式化
        DecimalFormat decimalFormat = new DecimalFormat("0.#");

        for (int i = 0; i < dateLength; i++) {
            Date dateObj = calendar.getTime();
            if (OrderEnum.DESC.getValue() == orderType.getValue()) {
                calendar.add(Calendar.HOUR, -24); // 数据按日期降序排序
            } else {
                calendar.add(Calendar.HOUR, +24); // 数据按日期升序排序
            }
            String curDate = DateUtil.format(dateObj, pattern);
            String curDateBefore = PassengerDateUtil.getDateBefore(curDate, dateLength);
            EnterShopCountVM countVM = new EnterShopCountVM();

            int newCubeCount = newMap.get(curDate) == null ? 0 : newMap.get(curDate);
            int oldCubeCount = oldMap.get(curDate) == null ? 0 : oldMap.get(curDate);
            int activeCubeCount = newCubeCount + oldCubeCount;

            int newCounterCount = newCounterMap.get(curDate) == null ? 0 : newCounterMap.get(curDate);
            int oldCounterCount = oldCounterMap.get(curDate) == null ? 0 : oldCounterMap.get(curDate);
            int activeCounterCount = newCounterCount + oldCounterCount;

            int newCubeBefore = newMapBefore.get(curDateBefore) == null ? 0 : newMapBefore.get(curDateBefore);
            int oldCubeBefore = oldMapBefore.get(curDateBefore) == null ? 0 : oldMapBefore.get(curDateBefore);
            int activeCubeBefore = newCubeBefore + oldCubeBefore;

            int newCounterCountBefore = newCounterMapBefore.get(curDateBefore) == null ? 0 : newCounterMapBefore.get(curDateBefore);
            int oldCounterCountBefore = oldCounterMapBefore.get(curDateBefore) == null ? 0 : oldCounterMapBefore.get(curDateBefore);
            int activeCounterCountBefore = newCounterCountBefore + oldCounterCountBefore;

            //客均进店数量
            double activeEnterCount = 0.0;
            if (activeCubeCount != 0) {
                activeEnterCount = activeCounterCount * 10.0 / activeCubeCount / 10.0;
            }

            //新客进店数量
            double newEnterCount = 0.0;
            if (newCubeCount != 0) {
                newEnterCount = newCounterCount * 10.0 / newCubeCount / 10.0;
            }
            //老客进店数量
            double oldEnterCount = 0.0;
            if (oldCubeCount != 0) {
                oldEnterCount = oldCounterCount * 10.0 / oldCubeCount / 10.0;
            }
            //历史进店数量
            double activeEnterBefore = 0.0;
            if (activeCubeBefore != 0) {
                activeEnterBefore = activeCounterCountBefore * 10.0 / activeCubeBefore / 10.0;
            }
            //环比
            double monthRate = 0.0;
            if (activeEnterBefore != 0) {
                monthRate = (activeEnterCount - activeEnterBefore) * 1000.0 / (activeEnterBefore * 10.0);
            }
            countVM.setDate(curDate);
            countVM.setActiveCount(decimalFormat.format(activeEnterCount));
            countVM.setNewCount(decimalFormat.format(newEnterCount));
            countVM.setOldCount(decimalFormat.format(oldEnterCount));
            countVM.setMonthRate(decimalFormat.format(Math.abs(monthRate)));
            BigDecimal bg = new BigDecimal(monthRate);
            double monthRateValue = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            countVM.setMonthRateValue(monthRateValue);
            countVM.setTrend(monthRate > 0 ? TrendEnum.UP : TrendEnum.DOWN);
            list.add(countVM);
        }

        return list;
    }

}
