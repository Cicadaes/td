package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.PassengerDateUtil;
import td.enterprise.dao.CrowdDao;
import td.enterprise.entity.Crowd;
import td.enterprise.entity.Project;
import td.enterprise.page.BasePage;
import td.enterprise.page.CrowdPage;
import td.enterprise.page.ProjectPage;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.vm.*;
import td.olap.query.WiFiAnalyticsQuerService;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.util.*;

/**
 * <br>
 * <b>功能：</b>客流趋势Service<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
@Service("passengerTrendService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PassengerTrendService {
    public final static Logger logger = Logger.getLogger(PassengerTrendService.class);
    private static String numFormatterStr = "(?<=\\d)(?=(?:\\d{3})+$)";
    private final String dateStr = "yyyy-MM-dd";
    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectExtendService projectExtendService;

    @Autowired
    private CrowdDao crowdDao;

    @Autowired
    private ParamService paramService;

    /**
     * 客群概览-客流趋势-30天进店客流, 停留客流
     *
     * @param projectId
     * @param start
     * @param end
     * @param type
     * @return
     * @throws ParseException
     */
    public PassengerTrendCountListVM getPassengerTrendData(int projectId, String start, String end, TrendTypeEnum type) throws ParseException {
        PassengerTrendCountListVM listVM = new PassengerTrendCountListVM();
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        // 客流趋势，tips 显示数据
        // 最近进店
        List<Map<String, Object>> tipsDataList = null;
        switch (type) {
            case ENTER:
                tipsDataList = getEnterUserTipData(projectId, start, end, dateLength, "");
                break;
            case STAY:
                tipsDataList = getStayUserTipData(projectId, start, end, dateLength, "");
                break;
            case ACTIVE:
                tipsDataList = getActiveUserTipData(projectId, start, end, dateLength, "");
                break;
        }
        Long newUser = 0L;
        Long oldUser = 0L;
        List<PassengerCountVM> list = new ArrayList<PassengerCountVM>();

        for (Map<String, Object> map2 : tipsDataList) {
            Long newPerson = (Long) map2.get("newperson");
            if (newPerson != null) {
                newUser += newPerson;
            }
            Long oldPerson = (Long) map2.get("oldperson");
            if (oldPerson != null) {
                oldUser += oldPerson;
            }
        }
        Long allUser = newUser + oldUser;

        // 客流趋势，环比tips 显示数据
        List<Map<String, Object>> tipsDataListBefore = null;
        switch (type) {
            case ENTER:
                tipsDataListBefore = getEnterUserTipData(projectId, startBefore, endBefore, dateLength, "");
                break;
            case STAY:
                tipsDataListBefore = getStayUserTipData(projectId, startBefore, endBefore, dateLength, "");
                break;
            case ACTIVE:
                tipsDataListBefore = getActiveUserTipData(projectId, startBefore, endBefore, dateLength, "");
        }
        Long newUserBefore = 0L;
        Long oldUserBefore = 0L;
        List<PassengerCountVM> beforeList = new ArrayList<PassengerCountVM>();
        for (Map<String, Object> map2 : tipsDataListBefore) {
            PassengerCountVM vm = new PassengerCountVM();
            vm.setNewUsers("0");
            vm.setOldUsers("0");
            if (map2.get("newperson") != null) {
                newUserBefore += (Long) map2.get("newperson");
                vm.setNewUsers(map2.get("newperson") + "");
            }
            if (map2.get("oldperson") != null) {
                oldUserBefore += (Long) map2.get("oldperson");
                vm.setOldUsers(map2.get("oldperson") + "");
            }
            vm.setSumUsers((Integer.parseInt(vm.getNewUsers()) + Integer.parseInt(vm.getOldUsers())) + "");
            vm.setDate(map2.get("key_as_string") + "");
            beforeList.add(vm);
        }
        Long allUserBefore = newUserBefore + oldUserBefore;

        String totalStr = String.valueOf(allUser).replaceAll(numFormatterStr, ",");
        listVM.setTotal(totalStr);// 总数
        if (allUserBefore == 0) {
            listVM.setRate("0");
        } else {
            Double rate = (allUser - allUserBefore) * 10000 / allUserBefore / 100.0;
            listVM.setRate(Math.abs(rate) + "");
            listVM.setTrend(rate > 0 ? TrendEnum.UP : TrendEnum.DOWN);
        }

        int daily = (int) (allUser / dateLength);
        String dailyStr = String.valueOf(daily).replaceAll(numFormatterStr, ",");
        listVM.setDaily(dailyStr);// 日均
        if (allUser == 0) {
            listVM.setNewDaily("0");
        } else {
            listVM.setNewDaily(newUser * 10000 / allUser / 100.0 + "");
        }

        //计算百分比
        for (Map<String, Object> map2 : tipsDataList) {
            PassengerCountVM vm = new PassengerCountVM();
            vm.setNewUsers("0");
            vm.setOldUsers("0");
            long sumUsers = 0;//当天总客流
            Long newPerson = (Long) map2.get("newperson");
            if (newPerson != null) {
                newUser += newPerson;
            }
            Long oldPerson = (Long) map2.get("oldperson");
            if (oldPerson != null) {
                oldUser += oldPerson;
                sumUsers += oldPerson;
                vm.setOldUsers(oldPerson + "");
            }
            vm.setSumUsers(sumUsers + "");
            if (allUser == 0) {
                vm.setRate("0");
            } else {
                vm.setRate((Long) map2.get("sums") * 10000 / allUser / 100.0 + "");
            }
            vm.setDate(map2.get("key_as_string") + "");
            list.add(vm);
        }
        listVM.setList(list);
        listVM.setBeforeList(beforeList);
        return listVM;
    }

    /**
     * 客群概览-客流趋势-一段时间内汇总统计
     *
     * @param projectId
     * @param start
     * @param end
     * @param type
     * @return
     * @throws ParseException
     */
    public TrendCountTotalVM getPassengerSummaryData(int projectId, String start, String end, TrendTypeEnum type) throws ParseException {
        TrendCountTotalVM totalVM = new TrendCountTotalVM();
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        // 客流趋势，tips 显示数据
        // 最近进店
        Map<String, Integer> map = null;
        Map<String, Integer> newMap = null;
        switch (type) {
            case ENTER:
                map = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterTotalMap(projectId, start, end, "active");
                newMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterTotalMap(projectId, start, end, "enterNew");
                break;
            case STAY:
                map = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterTotalMap(projectId, start, end, "stay");
                newMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterTotalMap(projectId, start, end, "stayNew");
                break;
            case ACTIVE:
                map = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterTotalMap(projectId, start, end, "active");
                newMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterTotalMap(projectId, start, end, "activeNew");
                break;
        }
        Integer allUser = 0;
        if (null != map)
        allUser = map.get("default") == null ? 0 : map.get("default");

        // 客流趋势，环比tips 显示数据
        Map<String, Integer> beforeMap = null;
        switch (type) {
            case ENTER:
                beforeMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterTotalMap(projectId, startBefore, endBefore, "active");
                break;
            case STAY:
                beforeMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterTotalMap(projectId, startBefore, endBefore, "stay");
                break;
            case ACTIVE:
                beforeMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterTotalMap(projectId, startBefore, endBefore, "active");
        }
        Integer allUserBefore = 0;
        if (null != beforeMap)
        allUserBefore = beforeMap.get("default") == null ? 0 : beforeMap.get("default");

        String totalStr = String.valueOf(allUser).replaceAll(numFormatterStr, ",");
        totalVM.setTotal(totalStr);// 总数
        if (allUserBefore == 0) {
            totalVM.setRate("0");
            totalVM.setTrend(TrendEnum.DOWN);
        } else {
            Double rate = (allUser - allUserBefore) * 10000 / allUserBefore / 100.0;
            totalVM.setRate(Math.abs(rate) + "");
            totalVM.setTrend(rate > 0 ? TrendEnum.UP : TrendEnum.DOWN);
        }

        int daily = (int) (allUser / dateLength);
        String dailyStr = String.valueOf(daily).replaceAll(numFormatterStr, ",");
        totalVM.setDaily(dailyStr);// 日均
        int newUser = 0;
        if (null != newMap)
        newUser = newMap.get("default") == null ? 0 : newMap.get("default");
        if (allUser == 0) {
            totalVM.setNewDaily("0");
        } else {
            totalVM.setNewDaily(newUser * 10000 / allUser / 100.0 + "");
        }
        return totalVM;
    }


    /**
     * 客群概览-客流趋势-一段时间内列表，带有环比
     *
     * @param projectId
     * @param start
     * @param end
     * @param type
     * @return
     * @throws ParseException
     */
    public PassengerCompareVM getPassengerTrendDataList(int projectId, String start, String end, TrendTypeEnum type) throws ParseException {
        PassengerCompareVM listVM = new PassengerCompareVM();
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        // 客流趋势，tips 显示数据
        // 最近进店
        List<Map<String, Object>> tipsDataList = null;
        switch (type) {
            case ENTER:
                tipsDataList = getEnterUserTipData(projectId, start, end, dateLength, "");
                break;
            case STAY:
                tipsDataList = getStayUserTipData(projectId, start, end, dateLength, "");
                break;
            case ACTIVE:
                tipsDataList = getActiveUserTipData(projectId, start, end, dateLength, "");
                break;
        }
        Long newUser = 0L;
        Long oldUser = 0L;
        List<PassengerVM> list = new ArrayList<PassengerVM>();

        for (Map<String, Object> map2 : tipsDataList) {
            Long newPerson = (Long) map2.get("newperson");
            if (newPerson != null) {
                newUser += newPerson;
            }
            Long oldPerson = (Long) map2.get("oldperson");
            if (oldPerson != null) {
                oldUser += oldPerson;
            }
        }
        Long allUser = newUser + oldUser;

        // 客流趋势，环比tips 显示数据
        List<Map<String, Object>> tipsDataListBefore = null;
        switch (type) {
            case ENTER:
                tipsDataListBefore = getEnterUserTipData(projectId, startBefore, endBefore, dateLength, "");
                break;
            case STAY:
                tipsDataListBefore = getStayUserTipData(projectId, startBefore, endBefore, dateLength, "");
                break;
            case ACTIVE:
                tipsDataListBefore = getActiveUserTipData(projectId, startBefore, endBefore, dateLength, "");
        }
        List<PassengerVM> beforeList = new ArrayList<PassengerVM>();
        for (Map<String, Object> map2 : tipsDataListBefore) {
            PassengerVM vm = new PassengerVM();
            vm.setNewUsers("0");
            vm.setOldUsers("0");
            if (map2.get("newperson") != null) {
                vm.setNewUsers(map2.get("newperson") + "");
            }
            if (map2.get("oldperson") != null) {
                vm.setOldUsers(map2.get("oldperson") + "");
            }
            vm.setSumUsers((Integer.parseInt(vm.getNewUsers()) + Integer.parseInt(vm.getOldUsers())) + "");
            vm.setDate(map2.get("key_as_string") + "");
            beforeList.add(vm);
        }

        //计算百分比
        for (Map<String, Object> map2 : tipsDataList) {
            PassengerVM vm = new PassengerVM();
            long sumUsers = 0;//当天总客流
            long newUsers = 0;
            long oldUsers = 0;
            Long newPerson = (Long) map2.get("newperson");
            if (newPerson != null) {
                newUsers = newPerson;
            }
            Long oldPerson = (Long) map2.get("oldperson");
            if (oldPerson != null) {
                oldUsers =  oldPerson;
            }
            sumUsers = newUsers + oldUsers;
            vm.setNewUsers(newUsers + "");
            vm.setOldUsers(oldUsers + "");
            vm.setSumUsers(sumUsers + "");
            if (allUser == 0) {
                vm.setDayPercent("0");
            } else {
                vm.setDayPercent((Long) map2.get("sums") * 10000 / allUser / 100.0 + "");
            }
            vm.setDate(map2.get("key_as_string") + "");
            list.add(vm);
        }
        listVM.setList(list);
        listVM.setBeforeList(beforeList);
        return listVM;
    }

    /**
     * 返回某时间段内 进店率 数据
     *
     * @param projectId
     * @param start
     * @param end
     * @return
     * @throws ParseException
     */
    public EnterRateList getPassengerTrendEnterRateData(int projectId, String start, String end) throws ParseException {
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        // //客流趋势，tips 显示数据
        List<Map<String, Object>> tipsDataList = getEnterUserRoomRateTipData(projectId, start, end, dateLength, "");
        // 客流趋势，环比tips 显示数据
        List<Map<String, Object>> tipsDataListBefore = getEnterUserRoomRateTipData(projectId, startBefore, endBefore, dateLength, "");

        List<EnterRateVM> currentList = new ArrayList<EnterRateVM>();
        for (Map<String, Object> map : tipsDataList) {
            EnterRateVM vm = new EnterRateVM();
            vm.setDate(map.get("key_as_string") + "");
            vm.setEnterRate(map.get("enter_room_rate") + "");
            currentList.add(vm);
        }
        List<EnterRateVM> beforeList = new ArrayList<EnterRateVM>();
        for (Map<String, Object> map : tipsDataListBefore) {
            EnterRateVM vm = new EnterRateVM();
            vm.setDate(map.get("key_as_string") + "");
            vm.setEnterRate(map.get("enter_room_rate") + "");
            beforeList.add(vm);
        }
        EnterRateList list = new EnterRateList();
        list.setList(currentList);
        list.setBeforeList(beforeList);
        return list;
    }

    /**
     * 返回某时间段内 进店率 列表数据，带有环比
     *
     * @param projectId
     * @param start
     * @param end
     * @return
     * @throws ParseException
     */
    public PassengerCompareVM getPassengerEnterRateList(int projectId, String start, String end) throws ParseException {
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        PassengerCompareVM compareVM = new PassengerCompareVM();

        // //客流趋势，tips 显示数据
        List<Map<String, Object>> tipsDataList = getEnterUserRoomRateTipData(projectId, start, end, dateLength, "");
        // 客流趋势，环比tips 显示数据
        List<Map<String, Object>> tipsDataListBefore = getEnterUserRoomRateTipData(projectId, startBefore, endBefore, dateLength, "");

        List<PassengerVM> currentList = new ArrayList<PassengerVM>();
        for (Map<String, Object> map : tipsDataList) {
            PassengerVM vm = new PassengerVM();
            vm.setDate(map.get("key_as_string") + "");
            vm.setEnterRate(map.get("enter_room_rate") + "");
            vm.setActivePercent(map.get("activePercent") + "");
            vm.setActiveUsers(map.get("activeUsers") + "");
            vm.setEnterPercent(map.get("enterPercent") + "");
            vm.setEnterUsers(map.get("enterUsers") + "");
            currentList.add(vm);
        }
        List<PassengerVM> beforeList = new ArrayList<PassengerVM>();
        for (Map<String, Object> map : tipsDataListBefore) {
            PassengerVM vm = new PassengerVM();
            vm.setDate(map.get("key_as_string") + "");
            vm.setEnterRate(map.get("enter_room_rate") + "");
            vm.setActivePercent(map.get("activePercent") + "");
            vm.setActiveUsers(map.get("activeUsers") + "");
            vm.setEnterPercent(map.get("enterPercent") + "");
            vm.setEnterUsers(map.get("enterUsers") + "");
            beforeList.add(vm);
        }
        compareVM.setList(currentList);
        compareVM.setBeforeList(beforeList);
        return compareVM;
    }

    /**
     * 停留率
     *
     * @param projectId
     * @param start
     * @param end
     * @return
     * @throws ParseException
     */
    public StayRateList getPassengerStayTrendRate(int projectId, String start, String end) throws Exception {
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        // //客流趋势，tips 显示数据
        List<Map<String, Object>> tipsDataList = getStayUserRateTipData(projectId, start, end, dateLength, "");
        // 客流趋势，环比tips 显示数据
        List<Map<String, Object>> tipsDataListBefore = getStayUserRateTipData(projectId, startBefore, endBefore, dateLength, "");
        List<StayRateVM> currentList = new ArrayList<StayRateVM>();
        for (Map<String, Object> map : tipsDataList) {
            StayRateVM vm = new StayRateVM();
            vm.setDate(map.get("date") + "");
            vm.setStayRate(map.get("stayRate") + "");
            currentList.add(vm);
        }
        List<StayRateVM> beforeList = new ArrayList<StayRateVM>();
        for (Map<String, Object> map : tipsDataListBefore) {
            StayRateVM vm = new StayRateVM();
            vm.setDate(map.get("date") + "");
            vm.setStayRate(map.get("stayRate") + "");
            beforeList.add(vm);
        }
        StayRateList list = new StayRateList();
        list.setList(currentList);
        list.setBeforeList(beforeList);
        return list;
    }


    /**
     * 停留率列表，带环比
     *
     * @param projectId
     * @param start
     * @param end
     * @return
     * @throws ParseException
     */
    public PassengerCompareVM getPassengerStayRateList(int projectId, String start, String end) throws Exception {
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        PassengerCompareVM compareVM = new PassengerCompareVM();

        // //客流趋势，tips 显示数据
        List<Map<String, Object>> tipsDataList = getStayUserRateTipData(projectId, start, end, dateLength, "");
        // 客流趋势，环比tips 显示数据
        List<Map<String, Object>> tipsDataListBefore = getStayUserRateTipData(projectId, startBefore, endBefore, dateLength, "");
        List<PassengerVM> currentList = new ArrayList<PassengerVM>();
        for (Map<String, Object> map : tipsDataList) {
            PassengerVM vm = new PassengerVM();
            vm.setDate(map.get("date") + "");
            vm.setStayRate(map.get("stayRate") + "");
            vm.setEnterUsers(map.get("enterUsers") + "");
            vm.setEnterPercent(map.get("enterPercent") + "");
            vm.setStayUsers(map.get("stayUsers") + "");
            vm.setStayPercent(map.get("stayPercent") + "");
            currentList.add(vm);
        }
        List<PassengerVM> beforeList = new ArrayList<PassengerVM>();
        for (Map<String, Object> map : tipsDataListBefore) {
            PassengerVM vm = new PassengerVM();
            vm.setDate(map.get("date") + "");
            vm.setStayRate(map.get("stayRate") + "");
            vm.setEnterUsers(map.get("enterUsers") + "");
            vm.setEnterPercent(map.get("enterPercent") + "");
            vm.setStayUsers(map.get("stayUsers") + "");
            vm.setStayUsers(map.get("stayPercent") + "");
            beforeList.add(vm);
        }
        compareVM.setList(currentList);
        compareVM.setBeforeList(beforeList);
        return compareVM;
    }

    // 私有方法，获取客流趋势-客流趋势（下侧图表明细数据）
    public List<Map<String, Object>> getActiveUserTipData(Integer projectId, String start, String end, Long dateLength, String orderType) throws ParseException {
        Date startDate = DateUtil.format(start, dateStr);
        Date endDate = DateUtil.format(end, dateStr);
        Map<String, Integer> newUserTmp = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupByDate(projectId, start, end, true);
        Map<String, Integer> oldUserTmp = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupByDate(projectId, start, end, true);

        List<Map<String, Object>> key5 = new ArrayList<Map<String, Object>>();
        Calendar calendar = Calendar.getInstance();
        if ("desc".equals(orderType)) {
            calendar.setTime(endDate);
        } else {
            calendar.setTime(startDate);
        }
        for (int i = 0; i < dateLength; i++) {
            Date dateObj = calendar.getTime();
            if ("desc".equals(orderType)) {
                calendar.add(Calendar.HOUR, -24); // 数据按日期降序排序
            } else {
                calendar.add(Calendar.HOUR, +24); // 数据按日期升序排序
            }
            String curDate = DateUtil.format(dateObj, dateStr);
            Map<String, Object> mapTmp = new HashMap<String, Object>();

            Long newUesrCurDate = newUserTmp.get(curDate) == null ? 0 : (long) newUserTmp.get(curDate);
            Long oldUesrCurDate = oldUserTmp.get(curDate) == null ? 0 : (long) oldUserTmp.get(curDate);

            mapTmp.put("key_as_string", curDate);
            mapTmp.put("newperson", newUesrCurDate);
            mapTmp.put("oldperson", oldUesrCurDate);
            mapTmp.put("newpersonStr", String.valueOf(newUesrCurDate).replaceAll(numFormatterStr, ","));
            mapTmp.put("oldpersonStr", String.valueOf(oldUesrCurDate).replaceAll(numFormatterStr, ","));
            Long sums = newUesrCurDate + oldUesrCurDate;
            String sumsStr = String.valueOf(sums).replaceAll(numFormatterStr, ",");
            mapTmp.put("sumsStr", sumsStr);
            mapTmp.put("sums", sums);

            key5.add(mapTmp);
        }
        return key5;
    }

    /**
     * 返回 进店客流的每日tips详情数据以及环比数据
     *
     * @param projectId
     * @param start
     * @param end
     * @param dateLength
     * @param orderType
     * @return
     * @throws ParseException
     */
    public List<Map<String, Object>> getEnterUserTipData(Integer projectId, String start, String end, Long dateLength, String orderType) throws ParseException {
        Date startDate = DateUtil.format(start, dateStr);
        Date endDate = DateUtil.format(end, dateStr);
        String url = paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue();
        Map<String, Integer> newUserTmp = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getNewEnterUserDataGroupByDate(projectId, start, end, true);
        Map<String, Integer> oldUserTmp = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getOldEnterUserDataGroupByDate(projectId, start, end, true);

        List<Map<String, Object>> key5 = new ArrayList<Map<String, Object>>();
        Calendar calendar = Calendar.getInstance();
        if ("desc".equals(orderType)) {
            calendar.setTime(endDate);
        } else {
            calendar.setTime(startDate);
        }
        for (int i = 0; i < dateLength; i++) {
            Date dateObj = calendar.getTime();
            if ("desc".equals(orderType)) {
                calendar.add(Calendar.HOUR, -24); // 数据按日期降序排序
            } else {
                calendar.add(Calendar.HOUR, +24); // 数据按日期升序排序
            }
            String curDate = DateUtil.format(dateObj, dateStr);
            Map<String, Object> mapTmp = new HashMap<String, Object>();

            Long newUesrCurDate = newUserTmp.get(curDate) == null ? 0 : (long) newUserTmp.get(curDate);
            Long oldUesrCurDate = oldUserTmp.get(curDate) == null ? 0 : (long) oldUserTmp.get(curDate);

            mapTmp.put("key_as_string", curDate);
            mapTmp.put("newperson", newUesrCurDate);
            mapTmp.put("oldperson", oldUesrCurDate);
            mapTmp.put("newpersonStr", String.valueOf(newUesrCurDate).replaceAll(numFormatterStr, ","));
            mapTmp.put("oldpersonStr", String.valueOf(oldUesrCurDate).replaceAll(numFormatterStr, ","));
            Long sums = newUesrCurDate + oldUesrCurDate;
            String sumsStr = String.valueOf(sums).replaceAll(numFormatterStr, ",");
            mapTmp.put("sumsStr", sumsStr);
            mapTmp.put("sums", sums);

            key5.add(mapTmp);
        }
        return key5;
    }

    /**
     * 返回 每日进店率tips数据 有环比数据
     * <p>
     * 进店率=进店人数/客流人数
     *
     * @param projectId
     * @param start
     * @param end
     * @param dateLength
     * @param orderType
     * @return
     * @throws ParseException
     */
    public List<Map<String, Object>> getEnterUserRoomRateTipData(Integer projectId, String start, String end, Long dateLength, String orderType) throws ParseException {
        Date startDate = DateUtil.format(start, dateStr);
        Date endDate = DateUtil.format(end, dateStr);
        DecimalFormat decimalFormat = new DecimalFormat("0.00");

        // 到访客流-新客+老客
        Map<String, Integer> activeNewUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupByDate(projectId, start, end, true);
        Map<String, Integer> activeOldUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupByDate(projectId, start, end, true);

        // 进店客流-新客+老客
        Map<String, Integer> enterNewUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getNewEnterUserDataGroupByDate(projectId, start, end, true);
        Map<String, Integer> enterOldUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getOldEnterUserDataGroupByDate(projectId, start, end, true);

        int totalActiveUsers = 0;
        int totalEnterUsers = 0;


        Calendar timeCalendar = Calendar.getInstance();
        timeCalendar.setTime(endDate);
        //获取进店总数 到访总数
        for (int i = 0; i < dateLength; i++) {
            Date dateObj = timeCalendar.getTime();
            String curDate = DateUtil.format(dateObj, dateStr);

            if (enterNewUserMap.get(curDate) != null) {
                totalEnterUsers += enterNewUserMap.get(curDate);
            }
            if (enterOldUserMap.get(curDate) != null) {
                totalEnterUsers += enterOldUserMap.get(curDate);
            }
            if (activeNewUserMap.get(curDate) != null) {
                totalActiveUsers += activeNewUserMap.get(curDate);
            }
            if (activeOldUserMap.get(curDate) != null) {
                totalActiveUsers += activeOldUserMap.get(curDate);
            }
            timeCalendar.add(Calendar.HOUR, -24);
        }


        List<Map<String, Object>> key5 = new ArrayList<Map<String, Object>>();
        Calendar calendar = Calendar.getInstance();
        if ("desc".equals(orderType)) {
            calendar.setTime(endDate);
        } else {
            calendar.setTime(startDate);
        }
        for (int i = 0; i < dateLength; i++) {
            Date dateObj = calendar.getTime();
            if ("desc".equals(orderType)) {
                calendar.add(Calendar.HOUR, -24); // 数据按日期降序排序
            } else {
                calendar.add(Calendar.HOUR, +24); // 数据按日期升序排序
            }
            String curDate = DateUtil.format(dateObj, dateStr);
            Map<String, Object> mapTmp = new HashMap<String, Object>();
            mapTmp.put("key_as_string", curDate);
            Integer enterValue = 0;
            if (enterNewUserMap.get(curDate) != null) {
                enterValue += enterNewUserMap.get(curDate);
            }
            if (enterOldUserMap.get(curDate) != null) {
                enterValue += enterOldUserMap.get(curDate);
            }

            Integer activeValue = 0;
            if (activeNewUserMap.get(curDate) != null) {
                activeValue += activeNewUserMap.get(curDate);
            }
            if (activeOldUserMap.get(curDate) != null) {
                activeValue += activeOldUserMap.get(curDate);
            }

            Float enterCount = (float) enterValue;
            Float activeCount = (float) activeValue;

            String enterPercent = "0";
            String activePercent = "0";
            if (0 < totalEnterUsers) {
                enterPercent = decimalFormat.format(enterCount * 10000 / totalEnterUsers / 100.0);
            }
            if (0 < totalActiveUsers) {
                activePercent = decimalFormat.format(activeCount * 10000 / totalActiveUsers / 100.0);
            }


            Float rate = activeCount == 0 ? 0 : (enterCount / activeCount) * 100;
            mapTmp.put("sums", rate > 100 ? 100 + "%" : decimalFormat.format(rate) + "%");
            mapTmp.put("enter_room_rate", decimalFormat.format(rate)); // 进店率
            mapTmp.put("enterUsers", enterCount);
            mapTmp.put("activeUsers", activeCount);
            mapTmp.put("enterPercent", enterPercent);
            mapTmp.put("activePercent", activePercent);

            key5.add(mapTmp);
        }
        return key5;
    }

    /**
     * 停留率
     *
     * @param projectId
     * @param start
     * @param end
     * @param dateLength
     * @param orderType
     * @return
     * @throws ParseException
     */
    public List<Map<String, Object>> getStayUserRateTipData(Integer projectId, String start, String end, Long dateLength, String orderType) throws ParseException {
        Date startDate = DateUtil.format(start, dateStr);
        Date endDate = DateUtil.format(end, dateStr);
        DecimalFormat decimalFormat = new DecimalFormat("0.0");

        // 进店客流-新客+老客
        // 进店客流，带优化，可以直接取进店客流
        Map<String, Integer> enterNewUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getNewEnterUserDataGroupByDate(projectId, start, end, true);
        Map<String, Integer> enterOldUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getOldEnterUserDataGroupByDate(projectId, start, end, true);

        //停留客流
        Map<String, Integer> stayUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getStayUserDataGroupByDate(projectId, start, end, true);

        List<Map<String, Object>> key5 = new ArrayList<Map<String, Object>>();
        Calendar calendar = Calendar.getInstance();
        if ("desc".equals(orderType)) {
            calendar.setTime(endDate);
        } else {
            calendar.setTime(startDate);
        }

        int totalStayUsers = 0;
        int totalEnterUsers = 0;

        Map<String, Integer> stayUsersMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterTotalMap(projectId, start, end, "stay");
        Map<String, Integer> enterUsersMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterTotalMap(projectId, start, end, "active");
        totalStayUsers = stayUsersMap.get("default") != null ? stayUsersMap.get("default") : 0;
        totalEnterUsers = enterUsersMap.get("default") != null ? enterUsersMap.get("default") : 0;

        for (int i = 0; i < dateLength; i++) {
            Date dateObj = calendar.getTime();
            if ("desc".equals(orderType)) {
                calendar.add(Calendar.HOUR, -24); // 数据按日期降序排序
            } else {
                calendar.add(Calendar.HOUR, +24); // 数据按日期升序排序
            }
            String curDate = DateUtil.format(dateObj, dateStr);
            Map<String, Object> mapTmp = new HashMap<String, Object>();
            mapTmp.put("date", curDate);
            Integer enterValue = 0;
            if (enterNewUserMap.get(curDate) != null) {
                enterValue += enterNewUserMap.get(curDate);
            }
            if (enterOldUserMap.get(curDate) != null) {
                enterValue += enterOldUserMap.get(curDate);
            }

            Integer stayValue = 0;
            if (stayUserMap.get(curDate) != null) {
                stayValue += stayUserMap.get(curDate);
            }

            String enterPercent = "0";
            String stayPercent = "0";
            if (0 < totalEnterUsers) {
                enterPercent = decimalFormat.format(enterValue * 10000.0 / totalEnterUsers / 100.0);
            }
            if (0 < totalStayUsers) {
                stayPercent = decimalFormat.format(stayValue * 10000.0 / totalStayUsers / 100.0);
            }

            double rate = enterValue == 0 ? 0 : (stayValue *10.0 / enterValue / 10.0) * 100;
            mapTmp.put("sums", rate > 100 ? 100 + "%" : decimalFormat.format(rate) + "%");
            mapTmp.put("stayRate", decimalFormat.format(rate)); // 停留率
            mapTmp.put("enterUsers", enterValue);
            mapTmp.put("stayUsers", stayValue);
            mapTmp.put("enterPercent", enterPercent);//进店占比
            mapTmp.put("stayPercent", stayPercent);// 停留占比

            key5.add(mapTmp);
        }
        return key5;
    }

    /**
     * 获取 30日停留人数，tips数据 当日停留人数查询cube 往日停留人数查询offline-counter
     *
     * @param projectId
     * @param start
     * @param end
     * @param dateLength
     * @param orderType
     * @return
     * @throws ParseException
     */
    public List<Map<String, Object>> getStayUserTipData(Integer projectId, String start, String end, Long dateLength, String orderType) throws ParseException {
        Date startDate = DateUtil.format(start, dateStr);
        Date endDate = DateUtil.format(end, dateStr);

        Map<String, Integer> newUserTmp = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getNewStayUserDataGroupByDate(projectId, start, end, true);
        Map<String, Integer> oldUserTmp = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getOldStayUserDataGroupByDate(projectId, start, end, true);


        List<Map<String, Object>> key5 = new ArrayList<Map<String, Object>>();
        Calendar calendar = Calendar.getInstance();
        if ("desc".equals(orderType)) {
            calendar.setTime(endDate);
        } else {
            calendar.setTime(startDate);
        }
        for (int i = 0; i < dateLength; i++) {
            Date dateObj = calendar.getTime();
            if ("desc".equals(orderType)) {
                calendar.add(Calendar.HOUR, -24); // 数据按日期降序排序
            } else {
                calendar.add(Calendar.HOUR, +24); // 数据按日期升序排序
            }
            String curDate = DateUtil.format(dateObj, dateStr);
            Map<String, Object> mapTmp = new HashMap<String, Object>();

            Long newUesrCurDate = newUserTmp.get(curDate) == null ? 0 : Long.parseLong(newUserTmp.get(curDate) + "");
            Long oldUesrCurDate = oldUserTmp.get(curDate) == null ? 0 : Long.parseLong(oldUserTmp.get(curDate) + "");

            mapTmp.put("key_as_string", curDate);
            mapTmp.put("newperson", newUesrCurDate);
            mapTmp.put("newpersonStr", String.valueOf(newUesrCurDate).replaceAll(numFormatterStr, ","));
            mapTmp.put("oldperson", oldUesrCurDate);
            mapTmp.put("oldpersonStr", String.valueOf(oldUesrCurDate).replaceAll(numFormatterStr, ","));
            Long sums = newUesrCurDate + oldUesrCurDate;
            String sumsStr = String.valueOf(sums).replaceAll(numFormatterStr, ",");
            mapTmp.put("sumsStr", sumsStr);
            mapTmp.put("sums", sums);

            key5.add(mapTmp);
        }
        return key5;
    }

    /**
     * 客流趋势- 进店率明细
     *
     * @param start
     * @param end
     * @param projectId
     * @param page
     * @return
     * @throws ParseException
     */
    public List<Map<String, Object>> getPassengerTrendEnterRateDetailData(String start, String end, int projectId, BasePage page) throws ParseException {
        Date startDate = DateUtil.format(start, dateStr);
        Date endDate = DateUtil.format(end, dateStr);
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        // 统计总数
        Long activeNewUserCount = 0l;
        Long activeOldUserCount = 0l;

        activeNewUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupCount(projectId, start, end, true);
        activeOldUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupCount(projectId, start, end, true);

        Long activeUserCountSum = activeNewUserCount + activeOldUserCount;

        Long enterNewUserCount = 0l;
        Long enterOldUserCount = 0l;

        enterNewUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getNewEnterUserCount(projectId, start, end, true);
        enterOldUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getOldEnterUserCount(projectId, start, end, true);

        Long enterUserCountSum = enterNewUserCount + enterOldUserCount;

        Map<String, Integer> stayUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getStayUserDataGroupByDate(projectId, start, end, true);

        Long stayUserCountSum = 0L;
        for (String key : stayUserMap.keySet()) {
            stayUserCountSum += stayUserMap.get(key);
        }

        // 分页计算
        int count = Integer.valueOf(String.valueOf(dateLength));
        int currentPageNo = page.getPage();
        int pageSize = page.getPager().getPageSize();
        Map<String, Date> dateMap = new HashMap<>();
        dateMap = getPager2Bitmap(count, currentPageNo, pageSize, getDateList(endDate, Integer.valueOf(dateLength.toString())));
        startDate = dateMap.get("startDate");
        endDate = dateMap.get("endDate");
        start = DateUtil.format(startDate, dateStr);
        end = DateUtil.format(endDate, dateStr);
        dateLength = PassengerDateUtil.getDiffDaysStr(start, end);
        // 分页计算 END

        List<Map<String, Object>> key5 = getEnterRateDetailData(projectId, start, end, dateLength, activeUserCountSum, enterUserCountSum, stayUserCountSum, "desc");
        return key5;
    }

    /**
     * 返回进店率明细 客流人数、比例 进店人数、比例 进店率
     *
     * @param projectId
     * @param start
     * @param end
     * @param dateLength
     * @param orderType
     * @return
     * @throws ParseException
     */
    public List<Map<String, Object>> getEnterRateDetailData(Integer projectId, String start, String end, Long dateLength, Long activeUserCountSum, Long enterUserCountSum,
                                                            Long stayUserCountSum, String orderType) throws ParseException {
        Date startDate = DateUtil.format(start, dateStr);
        Date endDate = DateUtil.format(end, dateStr);
        // 到访客流-新客+老客
        Map<String, Integer> activeNewUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupByDate(projectId, start, end, true);
        Map<String, Integer> activeOldUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupByDate(projectId, start, end, true);

        // 进店客流-新客+老客
        Map<String, Integer> enterNewUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getNewEnterUserDataGroupByDate(projectId, start, end, true);
        Map<String, Integer> enterOldUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getOldEnterUserDataGroupByDate(projectId, start, end, true);

        // 停留客流

        Map<String, Integer> stayUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getStayUserDataGroupByDate(projectId, start, end, true);
        if (DateUtil.format(new Date(), dateStr).equalsIgnoreCase(end)) {
            Map<String, Integer> userToday = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getStayUserDataGroupByDate(projectId, end, end, true);
            // 把当日的数据set进map
            if (userToday.get(end) != null) {
                stayUserMap.put(end, userToday.get(end));
            }
        }

        List<Map<String, Object>> key5 = new ArrayList<Map<String, Object>>();
        Calendar calendar = Calendar.getInstance();
        if ("desc".equals(orderType)) {
            calendar.setTime(endDate);
        } else {
            calendar.setTime(startDate);
        }
        DecimalFormat decimalFormat = new DecimalFormat("0.0");

        for (int i = 0; i < dateLength; i++) {
            Date dateObj = calendar.getTime();
            if ("desc".equals(orderType)) {
                calendar.add(Calendar.HOUR, -24); // 数据按日期降序排序
            } else {
                calendar.add(Calendar.HOUR, +24); // 数据按日期升序排序
            }
            String curDate = DateUtil.format(dateObj, dateStr);
            Map<String, Object> mapTmp = new HashMap<String, Object>();
            mapTmp.put("date", curDate);
            // 客流
            Float activeNewUser = activeNewUserMap.get(curDate) == null ? 0 : Float.valueOf(String.valueOf(activeNewUserMap.get(curDate)));
            Float activeOldUser = activeOldUserMap.get(curDate) == null ? 0 : Float.valueOf(String.valueOf(activeOldUserMap.get(curDate)));
            mapTmp.put("activeUser", activeNewUser + activeOldUser);
            Float value = activeUserCountSum == 0 ? 0.0f : (activeNewUser + activeOldUser) * 100 / activeUserCountSum;
            mapTmp.put("activeUserPercent", decimalFormat.format(value));

            // 进店
            Float enterNewUser = enterNewUserMap.get(curDate) == null ? 0 : Float.valueOf(String.valueOf(enterNewUserMap.get(curDate)));
            Float enterOldUser = enterOldUserMap.get(curDate) == null ? 0 : Float.valueOf(String.valueOf(enterOldUserMap.get(curDate)));
            mapTmp.put("enterUser", enterNewUser + enterOldUser);
            Float value1 = enterUserCountSum == 0 ? 0.0f : (enterNewUser + enterOldUser) * 100 / enterUserCountSum;
            mapTmp.put("enterUserPercent", decimalFormat.format(value1));
            Float value2 = (activeNewUser + activeOldUser) == 0 ? 0.0f : (enterNewUser + enterOldUser) * 100 / (activeNewUser + activeOldUser);
            // 进店率
            mapTmp.put("enterPercent", decimalFormat.format(value2));

            // 停留
            Float stayUser = stayUserMap.get(curDate) == null ? 0 : Float.valueOf(String.valueOf(stayUserMap.get(curDate)));
            mapTmp.put("stayUser", stayUser);
            Float value3 = stayUserCountSum == 0 ? 0.0f : stayUser * 100 / stayUserCountSum;
            mapTmp.put("stayUserPercent", decimalFormat.format(value3));
            Float value4 = (enterNewUser + enterOldUser) == 0 ? 0.0f : stayUser * 100 / (enterNewUser + enterOldUser);
            // 停留率
            mapTmp.put("stayPercent", decimalFormat.format(value4));
            key5.add(mapTmp);

        }
        return key5;
    }

    /**
     * 把过10万的数字转为数字+文字组合
     *
     * @param num
     * @param map
     */
    public static void covertNum2Cn(Long num, Map<String, Object> map) {
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

    // 私有方法，格式化小时数据，补零
    private static String formatterHour(int hour) {
        String value = String.valueOf(hour);
        if (value.length() == 1) {
            return "0" + value;
        }
        return value;
    }

    /**
     * 根据结束日期，和总天数，计算出其实日期和结束日期
     *
     * @param endDate
     * @param days
     * @return
     */
    public static List<Date> getDateList(Date endDate, int days) {
        Calendar cal1 = Calendar.getInstance();
        cal1.setTime(endDate);
        cal1.add(Calendar.DATE, -days); // 降序
        Date startDate = cal1.getTime();
        // 计算分页（总天数）
        int count = daysBetween(startDate, endDate);

        List<Date> dateList = new ArrayList<>();
        Calendar cal = Calendar.getInstance();
        for (int i = 0; i < count; i++) {
            if (i == 0) {
                dateList.add(endDate);
            } else if (i == 1) {
                cal.setTime(endDate);
                cal.add(Calendar.DATE, -1);
                dateList.add(cal.getTime());
            } else {
                cal.add(Calendar.DATE, -1);
                dateList.add(cal.getTime());
            }
        }

        return dateList;
    }

    /**
     * 计算两个日期之间的间隔数
     *
     * @param early
     * @param late
     * @return
     */
    public static final int daysBetween(Date early, Date late) {
        Calendar calst = Calendar.getInstance();
        Calendar caled = Calendar.getInstance();
        calst.setTime(early);
        caled.setTime(late);
        // 设置时间为0时
        calst.set(Calendar.HOUR_OF_DAY, 0);
        calst.set(Calendar.MINUTE, 0);
        calst.set(Calendar.SECOND, 0);
        caled.set(Calendar.HOUR_OF_DAY, 0);
        caled.set(Calendar.MINUTE, 0);
        caled.set(Calendar.SECOND, 0);
        // 得到两个日期相差的天数
        int days = ((int) (caled.getTime().getTime() / 1000) - (int) (calst.getTime().getTime() / 1000)) / 3600 / 24;

        return days;
    }

    /**
     * 倒序（降序）获取分页后的起始计算日期和结束结算日期
     * <p>
     * 第一页（每页5条）：1-5 select * from table limit 0,5 //从0开始，取前5 select * from
     * table limit 5,5 //从5开始，取第6-10
     *
     * @param count
     * @param currentPageNo
     * @param pageSize
     * @param dateList
     * @return
     */
    public static Map<String, Date> getPager2Bitmap(int count, int currentPageNo, int pageSize, List<Date> dateList) {
        int startIndex = (currentPageNo - 1) * pageSize;
        int endIndex = 0;
        if (startIndex > count) {
            return new HashMap<>();
        }
        int pageNum = 0;
        if (count % pageSize != 0) {
            if (count > pageSize) {
                pageNum = count / pageSize + 1;
            } else {
                pageNum = 1;
            }
        } else {
            pageNum = count / pageSize;
        }
        if (currentPageNo < pageNum) {
            endIndex = pageSize * currentPageNo - 1;
        } else {
            endIndex = dateList.size() - 1;
        }
        Map<String, Date> map = new HashMap<>();
        Date endDate = dateList.get(startIndex);
        Date startDate = dateList.get(endIndex);
        map.put("startDate", startDate);
        map.put("endDate", endDate);
        return map;
    }

    // 私有方法，按日期获取客流趋势统计数据
    public Map<String, Object> getTrendCountByDate(Integer projectId, String start, String end) throws ParseException {

        Long newUser = 0l;
        Long oldUser = 0l;

        newUser = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupCount(projectId, start, end, true);
        oldUser = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupCount(projectId, start, end, true);

        Long allUser = newUser + oldUser;

        Map<String, Object> map = new HashMap<String, Object>();

        Map<String, Object> key1 = new HashMap<String, Object>();
        key1.put("key", allUser);
        key1.put("value", allUser);

        Map<String, Object> key2 = new HashMap<String, Object>();
        if (allUser == 0) {
            key2.put("key", new Double(0));
        } else {
            key2.put("key", newUser * 10000 / allUser / 100.0);
        }

        key2.put("value", 0);

        Project project = null;
        try {
            project = projectService.selectByPrimaryKey(projectId);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Integer openTimeInt = 0;
        Integer closingTimeInt = 24;
        if (project.getOpeningTime() != null) {
            try {
                openTimeInt = Integer.parseInt(project.getOpeningTime().substring(0, 2));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (project.getClosingTime() != null) {
            try {
                closingTimeInt = Integer.parseInt(project.getClosingTime().substring(0, 2));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        List<Map<String, Object>> key5 = new ArrayList<Map<String, Object>>();
        Map<String, Integer> resultMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryActiveUserHour2(projectId, start, end, true);
        String key = "";
        for (int i = openTimeInt; i <= closingTimeInt; i++) {
            Map tmpMap = new HashMap<>();
            key = formatterHour(i);
            tmpMap.put("key", key/* String.valueOf(i) */);
            if (resultMap.get(String.valueOf(i)) != null) {
                tmpMap.put("value", resultMap.get(String.valueOf(i)));
            } else {
                tmpMap.put("value", 0);
            }
            key5.add(tmpMap);

        }


        //查询每天总客流之和
        int totalHourUsers =  0 ;
        //店铺直接查询
        Map<String,Integer>  activeUsersMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterTotalMap(projectId, start, end, "active");
        totalHourUsers = activeUsersMap.get("default") == null ? 0 : activeUsersMap.get("default");

        Map<String, Object> mapBigger = null;
        //Integer hourAll = 0;
        for (Map<String, Object> map2 : key5) {
            //hourAll += (Integer) map2.get("value");
            if (mapBigger == null || (Integer) mapBigger.get("value") < (Integer) map2.get("value")) {
                mapBigger = map2;
            }
        }

        Map<String, Object> key3 = new HashMap<String, Object>();
        key3.put("key", mapBigger == null ? "--" : mapBigger.get("key") + ":00:00");
        key3.put("value", 0);

        Map<String, Object> key4 = new HashMap<String, Object>();

        Double key4Key = 0d;
        if (mapBigger != null && totalHourUsers != 0) {
            key4Key = (Integer) mapBigger.get("value") * 10000 / totalHourUsers / 100.0;
        }
        key4.put("key", key4Key);
        key4.put("value", 0);

        map.put("key1", key1);
        map.put("key2", key2);
        map.put("key3", key3);
        map.put("key4", key4);
        map.put("key5", key5);

        map.put("totalHourUsers",totalHourUsers);
        return map;
    }

    /**
     * 查询 客流趋势页面，头部数据区域数据 所选时期总客流、新客占比、峰值时段、比例、到访时段
     *
     * @param start
     * @param end
     * @param projectId
     * @return
     * @throws ParseException
     */
    public PassengerTrendTopDataVM getPassengnerTrendTopData(String start, String end, int projectId) throws ParseException {
        PassengerTrendTopDataVM topDataVM = new PassengerTrendTopDataVM();

        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        Map<String, Object> map = getTrendCountByDate(projectId, start, end);
        Map<String, Object> key1 = (Map<String, Object>) map.get("key1"); //
        Map<String, Object> key2 = (Map<String, Object>) map.get("key2");
        Map<String, Object> key3 = (Map<String, Object>) map.get("key3");
        Map<String, Object> key4 = (Map<String, Object>) map.get("key4");

        Map<String, Object> mapBefore = getTrendCountByDate(projectId, startBefore, endBefore);
        Map<String, Object> key1Before = (Map<String, Object>) mapBefore.get("key1");
        Map<String, Object> key2Before = (Map<String, Object>) mapBefore.get("key2");
        Map<String, Object> key4Before = (Map<String, Object>) mapBefore.get("key4");

        Long key1Int = (Long) key1.get("key");
        Long key1IntBefore = (Long) key1Before.get("key");
        DecimalFormat decimalFormat = new DecimalFormat(".00");
        key1.put("value", key1IntBefore == 0 ? "0" : decimalFormat.format((key1Int - key1IntBefore) * 10000 / key1IntBefore / 100.0));
        covertNum2Cn((Long) key1.get("key"), key1);
        key1.put("key", String.valueOf(key1.get("key")).replaceAll(numFormatterStr, ","));

        Double key2Int = (Double) key2.get("key");
        Double key2IntBefore = (Double) key2Before.get("key");
        key2.put("value", key2IntBefore == 0 ? "0" : decimalFormat.format((key2Int - key2IntBefore) * 10000 / key2IntBefore / 100.0));

        Double key4Int = (Double) key4.get("key");
        Double key4IntBefore = (Double) key4Before.get("key");
        key4.put("value", key4IntBefore == 0 ? "0" : decimalFormat.format((key4Int - key4IntBefore) * 10000 / key4IntBefore / 100.0));

        //所选时期总客流
        topDataVM.setTotalUsers(key1Int + "");
        topDataVM.setTotalUsersStr(key1.get("keyCn") + "");
        Double key1Value = Double.parseDouble(key1.get("value") + "");
        //环比
        topDataVM.setTotalUsersRate(Math.abs(key1Value) + "");
        //趋势 上升还是下降
        topDataVM.setTotalUsersTrend(key1Value > 0 ? TrendEnum.UP : TrendEnum.DOWN);

        //新客占比
        topDataVM.setNewUsersPercent(key2.get("key") + "");
        Double key2Value = Double.parseDouble(key2.get("value") + "");
        topDataVM.setNewUsersPercentRate(Math.abs(key2Value) + "");
        topDataVM.setNewUsersPercentTrend(key2Value > 0 ? TrendEnum.UP : TrendEnum.DOWN);

        //设置峰值时段
        topDataVM.setPeakHours(key3.get("key") + "");
        Double key4Value = Double.parseDouble(key4.get("value") + "");
        topDataVM.setPeakPercent(key4.get("key") + "");
        topDataVM.setPeakPercentRate(Math.abs(key4Value) + "");
        topDataVM.setPeakPercentTrend(key4Value > 0 ? TrendEnum.UP : TrendEnum.DOWN);

        //把key5 抓化为 对应值
        List<Map<String, Object>> hourValueList = (List<Map<String, Object>>) map.get("key5");
        List<HourUsersVM> list = new ArrayList<HourUsersVM>();
        for (Map<String, Object> tempMap : hourValueList) {
            HourUsersVM vm = new HourUsersVM();
            vm.setHour(tempMap.get("key") + "");
            vm.setUsers(tempMap.get("value") + "");
            list.add(vm);
        }
        topDataVM.setHourUsersList(list);
        int totalHourUsers = (Integer )map.get("totalHourUsers");
        topDataVM.setTotalHourUsers(totalHourUsers);
        return topDataVM;
    }


    /**
     * 查询 客流趋势页面，头部数据区域数据 所选时期总客流、新客占比、峰值时段、比例、到访时段
     *
     * @param start
     * @param end
     * @param projectId
     * @return
     * @throws ParseException
     */
    public Map<String, Object> getPassengnerTrendTopDataForExport(String start, String end, int projectId) throws ParseException {
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        Map<String, Object> map = getTrendCountByDate(projectId, start, end);
        Map<String, Object> key1 = (Map<String, Object>) map.get("key1"); //
        Map<String, Object> key2 = (Map<String, Object>) map.get("key2");
        Map<String, Object> key4 = (Map<String, Object>) map.get("key4");

        Map<String, Object> mapBefore = getTrendCountByDate(projectId, startBefore, endBefore);
        Map<String, Object> key1Before = (Map<String, Object>) mapBefore.get("key1");
        Map<String, Object> key2Before = (Map<String, Object>) mapBefore.get("key2");
        Map<String, Object> key4Before = (Map<String, Object>) mapBefore.get("key4");

        Long key1Int = (Long) key1.get("key");
        Long key1IntBefore = (Long) key1Before.get("key");
        DecimalFormat decimalFormat = new DecimalFormat(".00");
        key1.put("value", key1IntBefore == 0 ? "0" : decimalFormat.format((key1Int - key1IntBefore) * 10000 / key1IntBefore / 100.0));
        covertNum2Cn((Long) key1.get("key"), key1);
        key1.put("key", String.valueOf(key1.get("key")).replaceAll(numFormatterStr, ","));

        Double key2Int = (Double) key2.get("key");
        Double key2IntBefore = (Double) key2Before.get("key");
        key2.put("value", key2IntBefore == 0 ? "0" : decimalFormat.format((key2Int - key2IntBefore) * 10000 / key2IntBefore / 100.0));

        Double key4Int = (Double) key4.get("key");
        Double key4IntBefore = (Double) key4Before.get("key");
        key4.put("value", key4IntBefore == 0 ? "0" : decimalFormat.format((key4Int - key4IntBefore) * 10000 / key4IntBefore / 100.0));

        return map;
    }

    /**
     * 停留人数明细
     *
     * @param start
     * @param end
     * @param projectId
     * @param page
     * @return
     * @throws ParseException
     */
    public List<Map<String, Object>> getPassengerTrendStayDetailData(String start, String end, int projectId, BasePage page) throws ParseException {
        Date startDate = DateUtil.format(start, dateStr);
        Date endDate = DateUtil.format(end, dateStr);
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        // 统计总数
        Long newUserCount = 0l;
        Long oldUserCount = 0l;
        newUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getNewStayUserCount(projectId, start, end, true);
        oldUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getOldStayUserCount(projectId, start, end, true);
        Long sum = newUserCount + oldUserCount;

        // 分页计算
        int count = Integer.valueOf(String.valueOf(dateLength));
        int currentPageNo = page.getPage();
        int pageSize = page.getPager().getPageSize();
        Map<String, Date> dateMap = new HashMap<>();
        dateMap = getPager2Bitmap(count, currentPageNo, pageSize, getDateList(endDate, Integer.valueOf(dateLength.toString())));
        startDate = dateMap.get("startDate");
        endDate = dateMap.get("endDate");
        start = DateUtil.format(startDate, dateStr);
        end = DateUtil.format(endDate, dateStr);
        dateLength = PassengerDateUtil.getDiffDaysStr(start, end);
        // 分页计算 END
        List<Map<String, Object>> key5 = getStayUserTipData(projectId, start, end, dateLength, "desc");
        for (Map<String, Object> map2 : key5) {
            if (sum == 0) {
                map2.put("zzb", 0);
            } else {
                map2.put("zzb", (Long) map2.get("sums") * 10000 / sum / 100.0);
            }
        }
        return key5;
    }

    /**
     * 客流趋势- 停留率明细
     *
     * @param start
     * @param end
     * @param projectId
     * @param page
     * @return
     * @throws ParseException
     */
    public List<Map<String, Object>> getPassengerTrendStayRateDetailData(String start, String end, int projectId, BasePage page) throws ParseException {
        Date startDate = DateUtil.format(start, dateStr);
        Date endDate = DateUtil.format(end, dateStr);
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        // 统计总数
        Long activeNewUserCount = 0l;
        Long activeOldUserCount = 0l;

        activeNewUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupCount(projectId, start, end, true);
        activeOldUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupCount(projectId, start, end, true);

        Long activeUserCountSum = activeNewUserCount + activeOldUserCount;

        Long enterNewUserCount = 0l;
        Long enterOldUserCount = 0l;

        enterNewUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getNewEnterUserCount(projectId, start, end, true);
        enterOldUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getOldEnterUserCount(projectId, start, end, true);

        Long enterUserCountSum = enterNewUserCount + enterOldUserCount;

        Map<String, Integer> stayUserMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getStayUserDataGroupByDate(projectId, start, end, true);

        Long stayUserCountSum = 0L;
        for (String key : stayUserMap.keySet()) {
            stayUserCountSum += stayUserMap.get(key);
        }
        // 分页计算
        int count = Integer.valueOf(String.valueOf(dateLength));
        int currentPageNo = page.getPage();
        int pageSize = page.getPager().getPageSize();
        Map<String, Date> dateMap = new HashMap<>();
        dateMap = getPager2Bitmap(count, currentPageNo, pageSize, getDateList(endDate, Integer.valueOf(dateLength.toString())));
        startDate = dateMap.get("startDate");
        endDate = dateMap.get("endDate");
        start = DateUtil.format(startDate, dateStr);
        end = DateUtil.format(endDate, dateStr);
        dateLength = PassengerDateUtil.getDiffDaysStr(start, end);
        // 分页计算 END

        List<Map<String, Object>> key5 = getEnterRateDetailData(projectId, start, end, dateLength, activeUserCountSum, enterUserCountSum, stayUserCountSum, "desc");
        //转化为标准结构

        return key5;
    }

    /**
     * 客流趋势-进店客流明细
     *
     * @param start
     * @param end
     * @param projectId
     * @param page
     * @return
     * @throws ParseException
     */
    public List<Map<String, Object>> getPassengerTrendEnterDetailData(String start, String end, int projectId, BasePage page) throws ParseException {
        Date startDate = DateUtil.format(start, dateStr);
        Date endDate = DateUtil.format(end, dateStr);
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        // 统计总数
        Long newUserCount = 0l;
        Long oldUserCount = 0l;

        newUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getNewEnterUserCount(projectId, start, end, true);
        oldUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).getOldEnterUserCount(projectId, start, end, true);

        Long sum = newUserCount + oldUserCount;

        // 分页计算
        int count = Integer.valueOf(String.valueOf(dateLength));
        int currentPageNo = page.getPage();
        int pageSize = page.getPager().getPageSize();
        Map<String, Date> dateMap = new HashMap<>();
        dateMap = getPager2Bitmap(count, currentPageNo, pageSize, getDateList(endDate, Integer.valueOf(dateLength.toString())));
        startDate = dateMap.get("startDate");
        endDate = dateMap.get("endDate");
        start = DateUtil.format(startDate, dateStr);
        end = DateUtil.format(endDate, dateStr);
        dateLength = PassengerDateUtil.getDiffDaysStr(start, end);
        // 分页计算 END

        List<Map<String, Object>> key5 = getEnterUserTipData(projectId, start, end, dateLength, "desc");

        for (Map<String, Object> map2 : key5) {
            if (sum == 0) {
                map2.put("zzb", 0);
            } else {
                map2.put("zzb", (Long) map2.get("sums") * 10000 / sum / 100.0);
            }
        }
        return key5;
    }

    /**
     * 客流趋势-客流明细 查询
     *
     * @param start
     * @param end
     * @param projectId
     * @param page
     * @return
     * @throws ParseException
     */
    public List<Map<String, Object>> getPassengerTrendDetailDataByType(String start, String end, int projectId, BasePage page) throws ParseException {
        Date startDate = DateUtil.format(start, dateStr);
        Date endDate = DateUtil.format(end, dateStr);
        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        // 计算总数
        Long newUserCount = 0l;
        Long oldUserCount = 0l;

        newUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupCount(projectId, start, end, true);
        oldUserCount = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupCount(projectId, start, end, true);

        Long sum = newUserCount + oldUserCount;

        // 分页计算
        int count = Integer.valueOf(String.valueOf(dateLength));
        int currentPageNo = page.getPage();
        int pageSize = page.getPager().getPageSize();
        Map<String, Date> dateMap = new HashMap<>();
        dateMap = getPager2Bitmap(count, currentPageNo, pageSize, getDateList(endDate, Integer.valueOf(dateLength.toString())));
        startDate = dateMap.get("startDate");
        endDate = dateMap.get("endDate");
        start = DateUtil.format(startDate, dateStr);
        end = DateUtil.format(endDate, dateStr);
        dateLength = PassengerDateUtil.getDiffDaysStr(start, end);
        // 分页计算 END

        List<Map<String, Object>> key5 = getActiveUserTipData(projectId, start, end, dateLength, "desc");

        for (Map<String, Object> map2 : key5) {
            if (sum == 0) {
                map2.put("zzb", 0);
            } else {
                map2.put("zzb", (Long) map2.get("sums") * 10000 / sum / 100.0);
            }
        }

        return key5;
    }

    /**
     * 房店指标 客流明细
     *
     * @param startDate
     * @param endDate
     * @param projectId
     * @return
     */
    public List<ProjectSummaryVM> getSummaryDetail(String startDate, String endDate, int projectId) {

        List<ProjectSummaryVM> list = getDetailData(startDate, endDate, projectId);

        // 排序
        Collections.sort(list);
        return list;
    }

    /**
     * 客流明细
     *
     * @param startDate
     * @param endDate
     * @param projectId
     * @return
     */
    private List<ProjectSummaryVM> getDetailData(String startDate, String endDate, int projectId) {

        // 准备日期
        Long dateLength = PassengerDateUtil.getDiffDaysStr(startDate, endDate);

        Date startDateObj = DateUtil.format(startDate, dateStr);

        String childProjectIds = projectExtendService.getDirectChildProjectIds(projectId + "");

        // counter数据
        Map<String, Integer> enterMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(childProjectIds, startDate, endDate, "active");
        Map<String, Integer> stayMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(childProjectIds, startDate, endDate, "stay");

        // 环比日期
        int days = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
        Date chainStratDate = DateUtil.addDay2Date(-days, startDateObj);
        Date chainEndDate = DateUtil.addDay2Date(-1, startDateObj);

        String chainStratDateStr = DateUtil.format(chainStratDate, dateStr);
        String chainEndDateStr = DateUtil.format(chainEndDate, dateStr);

        // 环比数据
        Map<String, Integer> chainEnterMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(childProjectIds, chainStratDateStr, chainEndDateStr, "active");
        Map<String, Integer> chainStayMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(childProjectIds, chainStratDateStr, chainEndDateStr, "stay");

        // 取得所有子项目的总值
        Integer enterUserAll = 0;
        Integer stayUserAll = 0;

        List<Project> projectList = new ArrayList<Project>();
        ProjectPage projectPage = new ProjectPage();
        projectPage.setId(projectId);
        projectPage.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
        try {
            projectList = projectService.getDirectChildrenByParam(projectPage);
        } catch (Exception e) {
            e.printStackTrace();
        }

        //返回结果
        List<ProjectSummaryVM> resultList = new ArrayList<ProjectSummaryVM>();

        CrowdPage page1 = new CrowdPage();
        page1.setPageEnabled(false);
        page1.setType("AU");
        List<Crowd> rows1 = new ArrayList<Crowd>();
        try {
            rows1 = crowdDao.queryByList(page1);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Map<String, Crowd> crowdMap = new HashMap<>();
        for (Crowd crowd : rows1) {
            crowdMap.put(crowd.getAttr1(), crowd);
        }

        for (Project project : projectList) {
            ProjectSummaryVM summaryVM = new ProjectSummaryVM();
            //add begin by yunlong.wang at 20170313 for OFFLINE-1931
            summaryVM.setProjectId(project.getId());
            summaryVM.setProjectName(project.getProjectName());
            summaryVM.setLongitude(project.getLongitude());
            summaryVM.setLatitude(project.getLatitude());
            summaryVM.setCity(project.getCity());
            Crowd tmpCrowd = crowdMap.get(String.valueOf(project.getId()));
            if (tmpCrowd != null) {
                summaryVM.setDefaultCrowdId(tmpCrowd.getId());
            }
            summaryVM.setProjectType(project.getProjectType());
            //add end by yunlong.wang at 20170313 for OFFLINE-1931
            resultList.add(summaryVM);
        }

        // 统计总数，用于计算百分比
        for (ProjectSummaryVM project : resultList) {
            String projectIdKey = String.valueOf(project.getProjectId());
            Integer enterUser = 0;
            Integer stayUser = 0;

            if (enterMap.get(projectIdKey) != null) {
                enterUser += enterMap.get(projectIdKey);
            }

            if (stayMap.get(projectIdKey) != null) {
                stayUser += stayMap.get(projectIdKey);
            }

            project.setEnterUsers(enterUser);
            project.setStayUsers(stayUser);

            enterUserAll += enterUser;
            stayUserAll += stayUser;
        }

        for (ProjectSummaryVM project : resultList) {
            // 计算百分比
            Double stayPer = 0.0;
            // 计算百分比
            Double enterPer = 0.0;

            if (enterUserAll > 0) {
                enterPer = project.getEnterUsers() * 10000 / enterUserAll / 100.0;
            }

            if (stayUserAll > 0) {
                stayPer = project.getStayUsers() * 10000 / stayUserAll / 100.0;
            }

            // 计算日均
            if (project.getEnterUsers() > 0 && project.getEnterUsers() / dateLength.intValue() == 0) {
                project.setEnterUsers(1);
            } else {
                project.setEnterUsers(project.getEnterUsers() / dateLength.intValue());
            }
            if (project.getStayUsers() > 0 && project.getStayUsers() / dateLength.intValue() == 0) {
                project.setStayUsers(1);
            } else {
                project.setStayUsers(project.getStayUsers() / dateLength.intValue());
            }

            // 设置百分比
            project.setEnterPercent(enterPer + "");
            project.setStayPercent(stayPer + "");

            // 停留率
            if (project.getEnterUsers() != 0) {
                project.setStayRate(project.getStayUsers() * 10000 / project.getEnterUsers() / 100.0);
            } else {
                project.setStayRate(0D);
            }

            Integer tempProjectId = project.getProjectId();

            // 环比停留率
            if (chainStayMap.containsKey(tempProjectId + "") && chainEnterMap.containsKey(tempProjectId + "")) {
                Integer stay = chainStayMap.get(tempProjectId + "") == null ? 0 : chainStayMap.get(tempProjectId + "");
                Integer enter = chainEnterMap.get(tempProjectId + "") == null ? 0 : chainEnterMap.get(tempProjectId + "");
                stay = stay / dateLength.intValue();
                enter = enter / dateLength.intValue();
                Double d = enter == 0.0 ? 0.0 : (stay * 10000 / enter / 100.0);
                if (d > 100) {
                    d = 100.0;
                }
                Double stayPercent = Double.parseDouble(project.getStayPercent());
                DecimalFormat decimalFormat = new DecimalFormat("#.##");

//				project.setChainStayPercent(stayPercent - d); // 环比停留率为

                // 当前停留率-环比当日停留率
                project.setRelativeStayRate(decimalFormat.format(Math.abs(stayPercent - d)));
            } else {
                project.setRelativeStayRate("0");
            }
        }

        return resultList;
    }


    /**
     * 指标明细,新接口，指标更新
     *
     * @param startDate
     * @param endDate
     * @param projectId
     * @return
     */
    public List<ProjectAverageDetailVM> getAverageListData(String startDate, String endDate, int projectId) {

        Date startDateObj = DateUtil.format(startDate, dateStr);

        String childProjectIds = projectExtendService.getDirectChildProjectIds(projectId + "");

        // counter数据
        Map<String, Integer> oldMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(childProjectIds, startDate, endDate, WiFiAnalyticsQuerService.OLD);
        Map<String, Integer> newMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(childProjectIds, startDate, endDate, WiFiAnalyticsQuerService.NEW);
        Map<String, Integer> stayMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(childProjectIds, startDate, endDate, WiFiAnalyticsQuerService.STAY);
        Map<String, Integer> stayDurationMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(childProjectIds, startDate, endDate, WiFiAnalyticsQuerService.STAY_DURATION);

        // 环比日期
        int days = PassengerDateUtil.getDiffDaysStrInt(startDate, endDate);
        Date beforeDate = DateUtil.addDay2Date(-days, startDateObj);
        Date beforeEndDate = DateUtil.addDay2Date(-1, startDateObj);

        String beforeStartDateStr = DateUtil.format(beforeDate, dateStr);
        String beforeEndDateStr = DateUtil.format(beforeEndDate, dateStr);

        // 环比数据
        Map<String, Integer> beforeOldMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(childProjectIds, beforeStartDateStr, beforeEndDateStr, WiFiAnalyticsQuerService.OLD);
        Map<String, Integer> beforeNewMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(childProjectIds, beforeStartDateStr, beforeEndDateStr, WiFiAnalyticsQuerService.NEW);
        Map<String, Integer> beforeStayMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(childProjectIds, beforeStartDateStr, beforeEndDateStr, WiFiAnalyticsQuerService.STAY);
        Map<String, Integer> beforeStayDurationMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(childProjectIds, beforeStartDateStr, beforeEndDateStr, WiFiAnalyticsQuerService.STAY_DURATION);


        List<Project> projectList = new ArrayList<Project>();
        ProjectPage projectPage = new ProjectPage();
        projectPage.setId(projectId);
        projectPage.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
        projectList = projectService.getDirectChildrenByParam(projectPage);

        //返回结果
        List<ProjectAverageDetailVM> resultList = new ArrayList<ProjectAverageDetailVM>();


        for (Project project : projectList) {
            ProjectAverageDetailVM detailVM = new ProjectAverageDetailVM();
            detailVM.setProjectId(project.getId());
            detailVM.setProjectName(project.getProjectName());
            detailVM.setLongitude(project.getLongitude());
            detailVM.setLatitude(project.getLatitude());
            detailVM.setCity(project.getCity());
            detailVM.setDefaultCrowdId(project.getDefaultCrowd());
            detailVM.setProjectType(project.getProjectType());
            detailVM.setLatitude(project.getLatitude());
            detailVM.setLongitude(project.getLongitude());
            resultList.add(detailVM);
        }

        DecimalFormat format = new DecimalFormat("#.#");

        // 准备日期
        Long dateLength = PassengerDateUtil.getDiffDaysStr(startDate, endDate);

        for (ProjectAverageDetailVM detailVM : resultList) {
            String key = detailVM.getProjectId() + "";
            Integer oldUsers = oldMap.get(key) == null ? 0 : oldMap.get(key);
            Integer stayUsers = stayMap.get(key) == null ? 0 : stayMap.get(key);
            Integer newUsers = newMap.get(key) == null ? 0 : newMap.get(key);
            Integer activeUsers = oldUsers + newUsers;
            Integer stayDuration = stayDurationMap.get(key) == null ? 0 : stayDurationMap.get(key);
            Double stayRate = 0.0D;
            if (activeUsers != 0) {
                stayRate = stayUsers * 100.0 / activeUsers; //停留率
            }
            Integer averageStayDuration = 0;
            if (stayUsers != 0) {
                averageStayDuration = stayDuration / stayUsers;
            }

            Integer beforeOldUsers = beforeOldMap.get(key) == null ? 0 : beforeOldMap.get(key);
            Integer beforeStayUsers = beforeStayMap.get(key) == null ? 0 : beforeStayMap.get(key);
            Integer beforeNewUsers = beforeNewMap.get(key) == null ? 0 : beforeNewMap.get(key);
            Integer beforeActiveUsers = beforeNewUsers + beforeOldUsers;
            Integer beforeStayDuration = beforeStayDurationMap.get(key) == null ? 0 : beforeStayDurationMap.get(key);
            Double beforeStayRate = 0.0D;
            if (beforeActiveUsers != 0) {
                beforeStayRate = beforeStayUsers * 100.0 / beforeActiveUsers; //停留率
            }

            Integer beforeAverageStayDuration = 0;
            if (beforeStayUsers != 0) {
                beforeAverageStayDuration = beforeStayDuration / beforeStayUsers;
            }

            //除以天数
            detailVM.setActiveUsers(format.format(activeUsers * 10.0 / dateLength / 10.0));
            detailVM.setOldUsers(format.format(oldUsers * 10.0 / dateLength / 10.0));
            detailVM.setNewUsers(format.format(newUsers * 10.0 / dateLength / 10.0) );
            detailVM.setStayUsers(format.format(stayUsers * 10.0 / dateLength / 10.0) );
            detailVM.setStayRate(format.format(stayRate));
            detailVM.setAverageStayDuration(averageStayDuration + "");

            //趋势
            detailVM.setActiveTrend(activeUsers > beforeActiveUsers ? TrendEnum.UP : TrendEnum.DOWN);
            detailVM.setNewTrend(newUsers > beforeNewUsers ? TrendEnum.UP : TrendEnum.DOWN);
            detailVM.setOldTrend(oldUsers > beforeOldUsers ? TrendEnum.UP : TrendEnum.DOWN);
            detailVM.setStayTrend(stayUsers > beforeStayUsers ? TrendEnum.UP : TrendEnum.DOWN);
            detailVM.setAverageStayDurationTrend(averageStayDuration > beforeAverageStayDuration ? TrendEnum.UP : TrendEnum.DOWN);
            detailVM.setStayRateTrend(stayRate > beforeStayRate ? TrendEnum.UP : TrendEnum.DOWN);
        }

        return resultList;
    }


    /**
     * 指标明细,新接口，指标更新
     *
     * @param startDate
     * @param endDate
     * @param projectId
     * @return
     */
    public List<ProjectAverageHistoryDetailVM> getHistoryListData(String startDate, String endDate, int projectId) {
        // 准备日期
        Long dateLength = PassengerDateUtil.getDiffDaysStr(startDate, endDate);

        List<ProjectAverageHistoryDetailVM> list = new ArrayList<ProjectAverageHistoryDetailVM>();

        String start1 = PassengerDateUtil.getDateBefore(startDate, dateLength);
        String end1 = PassengerDateUtil.getDateBefore(endDate, dateLength);

        String start2 = PassengerDateUtil.getDateBefore(start1, dateLength);
        String end2 = PassengerDateUtil.getDateBefore(end1, dateLength);

        String start3 = PassengerDateUtil.getDateBefore(start2, dateLength);
        String end3 = PassengerDateUtil.getDateBefore(end2, dateLength);

        ProjectAverageHistoryDetailVM detailVM1 = getProjectHistoryListData(start1, end1, projectId);
        ProjectAverageHistoryDetailVM detailVM2 = getProjectHistoryListData(start2, end2, projectId);
        ProjectAverageHistoryDetailVM detailVM3 = getProjectHistoryListData(start3, end3, projectId);

        list.add(detailVM1);
        list.add(detailVM2);
        list.add(detailVM3);

        return list;
    }


    /**
     * 返回一段时间内统计数据
     *
     * @param startDate
     * @param endDate
     * @param projectId
     * @return
     */
    private ProjectAverageHistoryDetailVM getProjectHistoryListData(String startDate, String endDate, int projectId) {
        // 准备日期
        // counter数据
        Map<String, Integer> oldMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(projectId + "", startDate, endDate, WiFiAnalyticsQuerService.OLD);
        Map<String, Integer> newMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(projectId + "", startDate, endDate, WiFiAnalyticsQuerService.NEW);
        Map<String, Integer> stayMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(projectId + "", startDate, endDate, WiFiAnalyticsQuerService.STAY);
        Map<String, Integer> stayDurationMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryUserCounter(projectId + "", startDate, endDate, WiFiAnalyticsQuerService.STAY_DURATION);

        ProjectAverageHistoryDetailVM detailVM = new ProjectAverageHistoryDetailVM();

        String key = projectId + "";
        Integer oldUsers = oldMap.get(key) == null ? 0 : oldMap.get(key);
        Integer stayUsers = stayMap.get(key) == null ? 0 : stayMap.get(key);
        Integer newUsers = newMap.get(key) == null ? 0 : newMap.get(key);
        Integer activeUsers = oldUsers + newUsers;
        Integer stayDuration = stayDurationMap.get(key) == null ? 0 : stayDurationMap.get(key);
        Double stayRate = 0.0D;
        if (activeUsers != 0) {
            stayRate = stayUsers * 100.0 / activeUsers; //停留率
        }
        Integer averageStayDuration = 0;
        if (stayUsers != 0) {
            averageStayDuration = stayDuration / stayUsers;
        }

        // 准备日期
        Long dateLength = PassengerDateUtil.getDiffDaysStr(startDate, endDate);
        DecimalFormat format = new DecimalFormat("#.#");
        detailVM.setActiveUsers(format.format(activeUsers * 10.0 / dateLength / 10.0));
        detailVM.setOldUsers(format.format(oldUsers *10.0 / dateLength/10.0) );
        detailVM.setNewUsers(format.format(newUsers *10.0 / dateLength/10.0));
        detailVM.setStayUsers(format.format(stayUsers *10.0 / dateLength/10.0) );
        detailVM.setStayRate(format.format(stayRate));
        detailVM.setAverageStayDuration(averageStayDuration + "");
        detailVM.setStartDate(startDate);
        detailVM.setEndDate(endDate);

        return detailVM;
    }
}
