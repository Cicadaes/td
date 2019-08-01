package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.PushConstants;
import com.talkingdata.marketing.core.constant.SegmentTaskCalcObjectRecordConstant;
import com.talkingdata.marketing.core.dao.campaign.PushReachReportDao;
import com.talkingdata.marketing.core.dao.campaign.SegmentTaskCalcObjectRecordDao;
import com.talkingdata.marketing.core.entity.campaign.PushReachReport;
import com.talkingdata.marketing.core.entity.campaign.SegmentTaskCalcObjectRecord;
import com.talkingdata.marketing.core.enums.PushMetric;
import com.talkingdata.marketing.core.page.campaign.PushReachReportPage;
import com.talkingdata.marketing.core.page.campaign.SegmentTaskCalcObjectRecordPage;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.core.util.ExcelUtil;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_PUSH_REACH_REPORT PushReachReportService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-02-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("pushReachReportService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PushReachReportService extends BaseService<PushReachReport, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(PushReachReportService.class);

    @Autowired
    private PushReachReportDao dao;

    @Autowired
    private SegmentService segmentService;

    @Autowired
    private SegmentTaskCalcObjectRecordDao segmentTaskCalcObjectRecordDao;

    @Override
    public PushReachReportDao getDao() {
        return dao;
    }

    /**
     * 获取投放效果报告列表数据.
     *
     * @param segmentId 投放ID
     * @param date      日期
     * @return 报告列表数据
     * @throws Exception the exception
     */
    public List<Map<String, Integer>> getBySegmentId(Integer segmentId, String date, String all) throws Exception {
        String contentOfAll = "1";
        List<PushReachReport> pushReachReports;

        PushReachReportPage page = new PushReachReportPage();
        page.setPageSize(Integer.MAX_VALUE);
        page.setSegmentId(segmentId.toString());
        if (contentOfAll.equals(all) || date == null || StringUtils.isBlank(date)){
            pushReachReports = dao.queryByList(page);
        } else {
            page.setReportDate(date);
            pushReachReports = dao.queryByList(page);
        }

        Map<String, Integer> metricMap = buildMetric(pushReachReports);
        List<Map<String, Integer>> list = new ArrayList<>();
        list.add(metricMap);

        return list;
    }

    /**
     * 通过pipelineId和pipelineNodeId获取投放效果报告列表数据.
     * @param pipelineId 活动流程ID
     * @param pipelineNodeId 活动流程节点ID
     * @param date 日期
     * @return 投放报告列表
     * @throws Exception 异常
     */
    public List<Map<String, Integer>> getByPipelineId(Integer pipelineId, String pipelineNodeId, String date, String all) throws Exception {
        String contentOfAll = "1";
        List<PushReachReport> pushReachReports;
        if (contentOfAll.equals(all) || StringUtils.isBlank(date) || StringUtils.isEmpty(date)){
            pushReachReports = getDao().findByPipelineId(pipelineId, pipelineNodeId);
            logger.debug("The date is empty {}", date);
        } else {
            pushReachReports = getDao().findByPipelineIdAndDate(pipelineId, pipelineNodeId, date);
            logger.debug("The date is not empty {}", date);
        }
        Map<String, Integer> metricMap = buildMetric(pushReachReports);
        List<Map<String, Integer>> list = new ArrayList<>();
        list.add(metricMap);

        return list;
    }

    /**
     * 获取投放效果报告折线图数据
     */
    public List<Map<String, Integer>> getTrendBySegmentId(Integer segmentId, String date, Integer hours, String tp, String all) throws Exception {
        String contentOfAll = "1";
        Date startTimeInDay = null;
        List<PushReachReport> pushReachReports = getDao().findTrendBySegmentId(segmentId);
        List<Map<String, Integer>> list = new ArrayList<>();
        if (pushReachReports == null || pushReachReports.size() == 0 ) {
            return list;
        }
        startTimeInDay = getStartTimeInDay(date, all, pushReachReports);

        Map<String, Integer> metricMap = buildTrendMap(startTimeInDay, hours, pushReachReports, tp);

        list.add(metricMap);

        return list;
    }

    private Date getStartTimeInDay(String date, String all, List<PushReachReport> pushReachReports) throws ParseException {
        Date startTimeInDay;
        String contentOfAll = "1";
        if (contentOfAll.equals(all) || date == null || StringUtils.isBlank(date)){
            startTimeInDay = DateUtil.string2Date(DateUtil.TIMEAXIS_PATTERN, pushReachReports.get(0).getReportDate());
            startTimeInDay = DateUtils.addHours(startTimeInDay, pushReachReports.get(0).getReportHour());
        } else {
            Date time = DateUtil.string2Date(DateUtil.TIMEAXIS_PATTERN, date);
            startTimeInDay = DateUtil.getStartTimeInDay(time);
        }
        return startTimeInDay;
    }

    /**
     * 通过pipelineId和pipelineNodeId获取投放效果报告趋势.
     * @param pipelineId 活动流程ID
     * @param pipelineNodeId 活动流程节点ID
     * @param date 日期
     * @return 投放报告列表
     * @throws Exception 异常
     */
    public List<Map<String, Integer>> getTrendByPipelineId(Integer pipelineId, String pipelineNodeId,
            String date, Integer hours, String tp, String all) throws Exception {
        List<PushReachReport> pushReachReports = getDao().findTrendByPipelineId(pipelineId, pipelineNodeId);;
        List<Map<String, Integer>> list = new ArrayList<>();
        if (pushReachReports == null || pushReachReports.size() == 0 ) {
            return list;
        }

        Date startTimeInDay = getStartTimeInDay(date, all, pushReachReports);
        Map<String, Integer> map = buildTrendMap(startTimeInDay, hours, pushReachReports, tp);

        list.add(map);

        return list;
    }

    /**
     * 构建报告列表
     * @param pushReachReportList 推送报告
     * @return 报告列表
     */
    private Map<String, Integer> buildMetric(List<PushReachReport> pushReachReportList) {
        Map<String, Integer> m = initMetricMap();
        for (PushReachReport pushReachReport:pushReachReportList) {
            if (pushReachReport == null) {
                return m;
            }
            Integer totalSendCount = m.get(PushConstants.PUSH_SENT);
            if (totalSendCount != null) {
                m.put(PushConstants.PUSH_SENT, totalSendCount + pushReachReport.getSendCount());
            }
            Integer totalReachCount = m.get(PushConstants.PUSH_ARRIVALED);
            if (totalReachCount != null) {
                m.put(PushConstants.PUSH_ARRIVALED, totalReachCount + pushReachReport.getReachCount());
            }
            Integer totalDisplayCount = m.get(PushConstants.PUSH_IMPRESSIONS);
            if (totalDisplayCount != null) {
                m.put(PushConstants.PUSH_IMPRESSIONS, totalDisplayCount + pushReachReport.getDisplayCount());
            }
            Integer totalClickCount = m.get(PushConstants.PUSH_CLICK);
            if (totalClickCount != null) {
                m.put(PushConstants.PUSH_CLICK, totalClickCount + pushReachReport.getClickCount());
            }
        }
        return m;
    }

    private Map<String, Integer> initMetricMap() {
        Map<String, Integer> m = new HashMap<>(16);
        for (PushMetric e : PushMetric.values()) {
            m.put(e.getValue(), 0);
        }
        return m;
    }

    /**
     * Build trend map map.
     *
     * @param start      the start
     * @param hours      the hours
     * @param pushReachReportList the pushReachReport list
     * @return the map
     * @throws Exception the exception
     */
    public Map<String, Integer> buildTrendMap(Date start, Integer hours, List<PushReachReport> pushReachReportList, String tp) throws Exception {
        Map<String, Integer> map = buildPeriodDateMap(start, hours);
        for (PushReachReport m : pushReachReportList) {
            if (m == null) {
                return sortMapByKey(map);
            }
            String k = m.getReportDate() + m.getReportHour();
            if (map.containsKey(k)) {
                Integer v = map.get(k);
                if (tp.equals(PushConstants.PUSH_SENT)) {
                    map.put(k, v + m.getSendCount());
                }
                if (tp.equals(PushConstants.PUSH_ARRIVALED)) {
                    map.put(k, v + m.getReachCount());
                }
                if (tp.equals(PushConstants.PUSH_IMPRESSIONS)) {
                    map.put(k, v + m.getDisplayCount());
                }
                if (tp.equals(PushConstants.PUSH_CLICK)) {
                    map.put(k, v + m.getClickCount());
                }
            }
        }
        return sortMapByKey(map);
    }


    /**
     * Build trend map map.
     *
     * @param start      the start
     * @param hours      the hours
     * @param pushReachReportList the pushReachReport list
     * @return the map
     * @throws Exception the exception
     */
    public Map<String, Integer[]> buildTrendMap(Date start, Integer hours, List<PushReachReport> pushReachReportList) throws Exception {
        Map<String, Integer[]> map = buildPeriodDateDataArrayMap(start, hours);
        for (PushReachReport report : pushReachReportList) {
            if (report == null) {
                return sortMapByKey(map);
            }

            String k = report.getReportDate() + report.getReportHour();
            if (map.containsKey(k)) {
                Integer[] v = map.get(k);
                v[0] = v[0] + report.getSendCount();
                v[1] = v[1] + report.getReachCount();
                v[2] = v[2] + report.getDisplayCount();
                v[3] = v[3] + report.getClickCount();
                map.put(k, v);
            }
        }
        return sortMapByKey(map);
    }

    private Map<String, Integer[]> buildPeriodDateDataArrayMap(Date start, Integer hours) throws Exception {
        Map<String, Integer[]> m = new HashMap<>(16);
        Date d = start;
        Date deadline = DateUtils.addHours(d, hours);
        while (d.getTime() < deadline.getTime()) {
            Integer[] arrs = new Integer[4];
            Arrays.fill(arrs,0);
            m.put(DateUtil.date2String("yyyyMMddHH", d), arrs);
            d = DateUtils.addHours(d, 1);
        }
        return m;
    }


    private Map<String, Integer> buildPeriodDateMap(Date start, Integer hours) throws Exception {
        Map<String, Integer> m = new HashMap<>(16);
        Date d = start;
        Date deadline = DateUtils.addHours(d, hours);
        while (d.getTime() < deadline.getTime()) {
            m.put(DateUtil.date2String("yyyyMMddHH", d), 0);
            d = DateUtils.addHours(d, 1);
        }
        return m;
    }

    private Map sortMapByKey(Map m) {
        Map<String, Object> treeMap = new TreeMap<>((o1, o2) -> {
            Long l1 = Long.valueOf(o1);
            Long l2 = Long.valueOf(o2);
            return l1.compareTo(l2);
        });
        treeMap.putAll(m);
        return treeMap;
    }

    /**
     * Generate stat excel input stream.
     *
     * @param page the  pushReachReport page
     * @param date      the date
     * @param hours     the hours
     * @param all       the all
     * @return the input stream
     * @throws Exception the exception
     */
    public InputStream generateStatExcel(PushReachReportPage page, String date, Integer hours, String all) throws Exception{
        List<List<String>> excelRows;
        final String totalFlag = "1";
        if (totalFlag.equals(all)) {
            excelRows = buildTotalPushExcelRows(page, hours);
        } else {
            excelRows = buildPushExcelRows(page, date, hours);
        }

        return ExcelUtil.writeExcelContent(excelRows, "趋势表");
    }

    /**
     * Build total push excel rows list.
     *
     * @param page the page
     * @param hours     the hours
     * @return the list
     * @throws Exception the exception
     */
    public List<List<String>> buildTotalPushExcelRows(PushReachReportPage page, Integer hours) throws Exception {
        List<PushReachReport> pushReachReports = getDao().findTrendByPage(page);
        List<List<String>> rows = buildRows(hours, pushReachReports);
        return rows;
    }


    private List<List<String>> buildRows(Integer hours, List<PushReachReport> pushReachReports) throws Exception {
        // build excel body
        List<List<String>> rows = new ArrayList();
        List<String> headerRow = new ArrayList();
        headerRow.add("日期");
        headerRow.add("时间");
        headerRow.add("发送数");
        headerRow.add("到达数");
        headerRow.add("展示数");
        headerRow.add("点击数");
        rows.add(headerRow);

        List<String> footerRow = new ArrayList<>();
        footerRow.add("合计");
        footerRow.add("");
        Integer[] totalRow = new Integer[4];
        Arrays.fill(totalRow,0);

        Date startTimeInDay = getStartTimeInDay(null, "1", pushReachReports);
        Map<String, Integer[]> m = buildTrendMap(startTimeInDay,hours,pushReachReports);
        for (Map.Entry<String, Integer[]> entry : m.entrySet()) {
            List<String> row = new ArrayList();
            String key = entry.getKey();
            Integer[] value = entry.getValue();
            row.add(StringUtils.substring(key, 0, 8));
            row.add(String.format("推送%s小时后",StringUtils.substring(key,8)));
            for(int i =0;i<value.length;i++){
                row.add(String.valueOf(value[i]));
                totalRow[i] = totalRow[i]+value[i];
            }
            rows.add(row);
        }
        for(Integer total : totalRow){
            footerRow.add(String.valueOf(total));
        }
        rows.add(footerRow);
        return rows;
    }

    /**
     * Build push excel rows list.
     *
     * @param page
     * @param date      the date
     * @param hours     the hours
     * @return the list
     * @throws Exception the exception
     */
    public List<List<String>> buildPushExcelRows(PushReachReportPage page,String date, Integer hours) throws Exception {
        List<List<String>> rows = new ArrayList();
        List<Map<String, Integer>> sendMetric = getTrendByParam(page, date, hours, PushMetric.PUSH_SEND_NUMBER.getValue());
        List<Map<String, Integer>> arriveMetric = getTrendByParam(page, date, hours, PushMetric.PUSH_ARRIVALED_NUMBER.getValue());
        List<Map<String, Integer>> impressionMetric = getTrendByParam(page, date, hours, PushMetric.PUSH_IMPRESSIONS_NUMBER.getValue());
        List<Map<String, Integer>> clickMetric = getTrendByParam(page, date, hours, PushMetric.PUSH_CLICK_NUMBER.getValue());

        if (sendMetric.size() < 1) {
            return Collections.emptyList();
        }

        // build excel header
        List<String> headerRow = new ArrayList();
        headerRow.add("时间");
        if (sendMetric.size() == 1) {
            headerRow.add("发送数");
            headerRow.add("到达数");
            headerRow.add("展示数");
            headerRow.add("点击数");
        } else {
            headerRow = buildPushMetricHeader(sendMetric, "发送数", headerRow);
            headerRow = buildPushMetricHeader(sendMetric, "到达数", headerRow);
            headerRow = buildPushMetricHeader(sendMetric, "展示数", headerRow);
            headerRow = buildPushMetricHeader(sendMetric, "点击数", headerRow);
        }
        rows.add(headerRow);

        // build excel body
        Map<String, Integer> m = sendMetric.get(0);
        for (Map.Entry<String, Integer> entry : m.entrySet()) {
            List<String> row = new ArrayList();
            String key = entry.getKey();
            row.add(DateUtil.transferDateFormat(key));

            row = buildPushMetricList(sendMetric, key, row);
            row = buildPushMetricList(arriveMetric, key, row);
            row = buildPushMetricList(impressionMetric, key, row);
            row = buildPushMetricList(clickMetric, key, row);
            rows.add(row);
        }
        return rows;
    }

    private final int planBLeastSize = 2;
    private final int planCLeastSize = 3;
    private List<String> buildPushMetricHeader(List<Map<String, Integer>> metricList, String metricValue, List<String> row) {
        row.add(String.format("A方案%s",metricValue));

        if (metricList.size() >= planBLeastSize) {
            row.add(String.format("B方案%s",metricValue));
        }
        if (metricList.size() >= planCLeastSize) {
            row.add(String.format("C方案%s",metricValue));
        }
        row.add(String.format("总计%s",metricValue));
        return row;
    }

    private List<String> buildPushMetricList(List<Map<String, Integer>> metricList, String day, List<String> row) {
        Integer aGroupTotal = parseNumber(metricList.get(0).get(day));
        int total = aGroupTotal;
        row.add(String.valueOf(aGroupTotal));
        if (metricList.size() >= planBLeastSize) {
            Integer bGroupTotal = parseNumber(metricList.get(1).get(day));
            total += bGroupTotal;
            row.add(String.valueOf(bGroupTotal));
        }
        if (metricList.size() >= planCLeastSize) {
            Integer cGroupTotal = parseNumber(metricList.get(1).get(day));
            total += cGroupTotal;
            row.add(String.valueOf(cGroupTotal));
        }
        if (metricList.size() != 1) {
            row.add(String.valueOf(total));
        }
        return row;
    }

    /**
     * Gets trend by param.
     *
     * @param page the PushReachReportPage
     * @param date      the date
     * @param hours     the hours
     * @param tp        the tp
     * @return the trend by param
     * @throws Exception the exception
     */
    public List<Map<String, Integer>> getTrendByParam(PushReachReportPage page,String date, Integer hours, String tp) throws Exception {
        SegmentTaskCalcObjectRecordPage calcPage = new SegmentTaskCalcObjectRecordPage();
        calcPage.setSegmentId(page.getSegmentId());
        calcPage.setPipelineId(page.getPipelineId());
        calcPage.setPipelineNodeId(page.getPipelineNodeId());
        calcPage.setType(SegmentTaskCalcObjectRecordConstant.Type.SEGMENT_CALC_TYPE_STAT+"");
        List<Map<String, Integer>> trendList = new ArrayList();
        Date startTime = null;
        Date endTime = null;
        if (date != null) {
            startTime = DateUtil.string2Date("yyyyMMdd", date);
            endTime = DateUtils.addDays(startTime, 1);
        }

        List<SegmentTaskCalcObjectRecord> recordList = segmentTaskCalcObjectRecordDao.queryByPage(calcPage, startTime, endTime);

        int maxAbTestSize = 3;
        if (recordList.size() > maxAbTestSize) {
            logger.error("ab test 最多有三条");
            return Collections.emptyList();
        }

        for (SegmentTaskCalcObjectRecord r : recordList) {
            page.setAttr1(r.getId().toString());
            page.getPager().setPageEnabled(false);
            Map<String, Integer>  m = buildTrendMap(r.getStartTime(), hours, dao.queryByList(page),tp);
            trendList.add(m);
        }
        return trendList;
    }

    private Integer parseNumber(Integer total) {
        if (total == null) {
            return 0;
        }
        return total;
    }
}
