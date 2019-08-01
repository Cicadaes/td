package td.enterprise.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import td.enterprise.common.constant.CommonConstants;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.util.DateUtil;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.vm.TargetVM;
import td.olap.query.WiFiAnalyticsQuerService;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.*;

/**
 * <br>
 * <b>功能：指标对比service</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("targetCompareService")
public class TargetCompareService {

    @Autowired
    private ParamService paramService;

    @Autowired
    private ProjectExtendService projectExtendService;

    /**
     * 返回每天结果值
     *
     * @param projectId
     * @param start
     * @param end
     * @param dateLength
     * @param orderType
     * @param counter1
     * @param counter2
     * @return
     * @throws ParseException
     */
    public List<TargetVM> getDateKeyValue(Integer projectId, String start, String end, Long dateLength, String orderType, String counter1, String counter2) throws ParseException {
        Date startDate = DateUtil.format(start, CommonConstants.DATE_STRING);
        Date endDate = DateUtil.format(end, CommonConstants.DATE_STRING);
        Map<String, Integer> map1 = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterGroupByDate(projectId, start, end, counter1);
        String averageChildIds = projectExtendService.getDirectChildProjectIds(projectId + "");
        Map<String, Integer> map2 = new HashMap<String, Integer>();
        if (counter2 != null) {
            map2 = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryCounterGroupByDate(projectId, start, end, counter2);
        }

        int avgChildCount = averageChildIds.split(",").length;
        if (avgChildCount <= 0) {
            avgChildCount = 1;
        }
        List<TargetVM> resultList = new ArrayList<TargetVM>();
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
            String curDate = DateUtil.format(dateObj, CommonConstants.DATE_STRING);
            TargetVM vm = new TargetVM();
            if (counter2 == null) {
                Long value = map1.get(curDate) == null ? 0 : (long) map1.get(curDate);
                vm.setDate(curDate);
                Double divided = value * 10.0 / avgChildCount / 10.0;
                BigDecimal b = new BigDecimal(divided);
                int f = b.setScale(0, BigDecimal.ROUND_HALF_UP).intValue();
                vm.setValue(f + "");
            } else {
                if (map1.containsKey(curDate) && map2.containsKey(curDate)) {
                    Double divided = map2.get(curDate) > 0 ? map1.get(curDate) * 10.0 / map2.get(curDate) / 10.0 : 0.0;
                    BigDecimal b = new BigDecimal(divided);
                    double f = b.setScale(4, BigDecimal.ROUND_HALF_UP).doubleValue();
                    vm.setValue(f + "");
                } else {
                    vm.setValue("0");
                }
                vm.setDate(curDate);
            }
            resultList.add(vm);
        }
        return resultList;
    }
}
