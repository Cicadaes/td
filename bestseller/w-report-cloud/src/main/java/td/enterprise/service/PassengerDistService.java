package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.util.PassengerDateUtil;
import td.enterprise.service.manager.ParamService;
import td.olap.query.WiFiAnalyticsQuerService;

import java.util.HashMap;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>客流分布 指标数据Service<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
@Service("passengerDistService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PassengerDistService {
    public final static Logger logger = Logger.getLogger(PassengerDistService.class);
    public final String dateStr = "yyyy-MM-dd";
    private static String numFormatterStr = "(?<=\\d)(?=(?:\\d{3})+$)";

    @Autowired
    private ParamService paramService;

    public Map<String, Map<String, Object>> getPassengerDistributionDataByDate(String start, String end, int projectId) {
        Long newUser = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupCount(projectId, start, end, true);
        Long oldUser = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupCount(projectId, start, end, true);

        Long allUser = newUser + oldUser;

        Long dateLength = PassengerDateUtil.getDiffDaysStr(start, end);

        String startBefore = PassengerDateUtil.getDateBefore(start, dateLength);
        String endBefore = PassengerDateUtil.getDateBefore(end, dateLength);

        Long newUserBefore = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNewUserGroupCount(projectId, startBefore, endBefore, true);
        Long oldUserBefore = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryOldUserGroupCount(projectId, startBefore, endBefore, true);
        Long allUserBefore = newUserBefore + oldUserBefore;

        Map<String, Map<String, Object>> map = new HashMap<String, Map<String, Object>>();

        Map<String, Object> key1 = new HashMap<String, Object>();
        key1.put("key", allUser);
        covertNum2Cn(allUser, key1);
        if (allUserBefore == 0) {
            key1.put("val", new Double(0));
        } else {
            key1.put("val", (allUser - allUserBefore) * 10000 / allUserBefore / 100.0);
        }

        Map<String, Object> key2 = new HashMap<String, Object>();
        Long value2 = allUser / dateLength;
        key2.put("key", value2);
        covertNum2Cn(value2, key2);
        if (allUserBefore == 0) {
            key2.put("val", new Double(0));
        } else {
            key2.put("val", (allUser - allUserBefore) * 10000 / allUserBefore / 100.0);
        }

        Map<String, Object> key3 = new HashMap<String, Object>();
        Long value3 = newUser / dateLength;
        key3.put("key", value3);
        covertNum2Cn(value3, key3);
        if (newUserBefore == 0) {
            key3.put("val", new Double(0));
        } else {
            key3.put("val", (newUser - newUserBefore) * 10000 / newUserBefore / 100.0);
        }

        Map<String, Object> key4 = new HashMap<String, Object>();
        Long value4 = oldUser / dateLength;
        key4.put("key", value4);
        covertNum2Cn(value4, key4);
        if (oldUserBefore == 0) {
            key4.put("val", new Double(0));
        } else {
            key4.put("val", (oldUser - oldUserBefore) * 10000 / oldUserBefore / 100.0);
        }

        map.put("key1", key1);
        map.put("key2", key2);
        map.put("key3", key3);
        map.put("key4", key4);

        return map;
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
}
