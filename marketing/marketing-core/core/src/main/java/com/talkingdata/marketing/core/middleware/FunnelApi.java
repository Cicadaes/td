package com.talkingdata.marketing.core.middleware;

import com.talkingdata.marketing.core.entity.admin.FunnelStepConditionDefinition;
import com.talkingdata.marketing.core.entity.admin.FunnelStepDefinition;
import com.talkingdata.marketing.core.entity.dto.FunnelConvertOverviewEventStepItem;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdInfoResp;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube.CubeResultDto;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.util.CommonUtil;
import com.talkingdata.marketing.core.util.DateUtil;
import java.math.BigDecimal;
import java.util.*;
import org.apache.commons.lang.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * The type Funnel api.
 * @author xiaoming.kang
 */
@Component
public class FunnelApi {
    private static final Logger logger = LoggerFactory.getLogger(FunnelApi.class);
    @Autowired
    private CrowdApi crowdApi;
    @Autowired
    private UserCloudApi userCloudApi;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    /**
     * Gets convert overview.
     *
     * @param steps       the steps
     * @param definitions the definitions
     * @return the convert overview
     * @throws Exception the exception
     */
    public List<FunnelConvertOverviewEventStepItem> getConvertOverview(List<FunnelStepDefinition> steps, List<FunnelStepConditionDefinition> definitions) throws Exception{
        String eventStr = parseToStr(definitions);
        String funnelSql = String.format("select * from bitmap_hbase.funnel_index_bitmap where object_id in (%s) group by object_id;", eventStr);
        CubeResultDto cubeResultDto = userCloudApi.postSqlToGetCubeResult(funnelSql);
        return parseToConvertOverview(steps, definitions, cubeResultDto);
    }

    /**
     * Gets crowd convert overview.
     *
     * @param steps            the steps
     * @param definitions      the definitions
     * @param userCloudCrowdId the user cloud crowd id
     * @return the crowd convert overview
     * @throws Exception the exception
     */
    public List<FunnelConvertOverviewEventStepItem> getCrowdConvertOverview(List<FunnelStepDefinition> steps, List<FunnelStepConditionDefinition> definitions, Integer userCloudCrowdId) throws Exception{
        CrowdInfoResp crowdInfoResp = crowdApi.getCrowdInfo(userCloudCrowdId);
        if (crowdInfoResp == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_CLOUD_GET_CROWD_ERROR);
        }
        String crowdBitmapSql = buildQueryCrowdBitmapSql(crowdInfoResp);
        String eventStr = parseToStr(definitions);
        String funnelSql = String.format("r2=select * from bitmap_hbase.funnel_index_bitmap where object_id in (%s) group by object_id;", eventStr);
        String uniteSql = String.format("%s %s r3=unite(r2,r1);r3.subkey(0)", crowdBitmapSql, funnelSql);
        CubeResultDto cubeResultDto = userCloudApi.postSqlToGetCubeResult(uniteSql);
        return parseToConvertOverview(steps, definitions, cubeResultDto);
    }

    private List<FunnelConvertOverviewEventStepItem> parseToConvertOverview(List<FunnelStepDefinition> steps, List<FunnelStepConditionDefinition> definitions, CubeResultDto cubeResultDto) {
        List<Map<String, String>> results = cubeResultDto.getResults();
        Map<Integer, String> eventFunnelNameMapper = buildEventFunnelNameMapper(steps);
        Map<String, String> convertMap = new HashMap(16);
        for (Map<String, String> m : results) {
            String key = m.get("key");
            String val = m.get("value");
            String[] subKey = parseKeyToArray(key);
            if (subKey.length <= 0) {
                continue;
            }
            convertMap.put(subKey[0], val);
        }

        List<FunnelConvertOverviewEventStepItem> items = new ArrayList();
        Long preVal = -1L;
        Long firstStepVal = -1L;
        int step = 1;
        for (int i = 0; i < definitions.size(); i++) {
            String val = convertMap.get(definitions.get(i).getKey());
            FunnelConvertOverviewEventStepItem item = new FunnelConvertOverviewEventStepItem();
            item.setEventName(definitions.get(i).getValue());
            item.setEventId(definitions.get(i).getKey());
            item.setStepName(eventFunnelNameMapper.get(definitions.get(i).getFunnelStepDefinitionId()));
            item.setStepOrder(step);
            if (val == null) {
                item.setVal(0L);
            } else {
                item.setVal(Long.parseLong(val));
            }
            BigDecimal ratio;
            BigDecimal totalRatio;
            if (firstStepVal == -1) {
                // first step
                firstStepVal = item.getVal();
                if (item.getVal() == 0) {
                    ratio = new BigDecimal("0.00");
                    totalRatio = new BigDecimal("0.00");
                } else {
                    ratio = new BigDecimal("100.00");
                    totalRatio = new BigDecimal("100.00");
                }
            } else {
                //not first step
                if (preVal == 0) {
                    ratio = new BigDecimal("0.00");
                } else {
                    ratio = CommonUtil.getPercent(item.getVal(), preVal);
                }
                if (firstStepVal == 0) {
                    totalRatio = new BigDecimal("0.00");
                } else {
                    totalRatio = CommonUtil.getPercent(item.getVal(), firstStepVal);
                }
            }
            preVal = item.getVal();
            item.setTotalConvertRate(totalRatio);
            item.setConvertRate(ratio);
            step++;
            items.add(item);
        }
        return items;
    }

    private Map<Integer, String> buildEventFunnelNameMapper(List<FunnelStepDefinition> steps) {
        Map<Integer, String> mapper = new HashMap(16);
        for (FunnelStepDefinition stepDefinition : steps) {
            mapper.put(stepDefinition.getId(), stepDefinition.getName());
        }
        return mapper;
    }

    /**
     * Gets convert trend.
     *
     * @param beginDate   the begin date
     * @param endDate     the end date
     * @param granularity the granularity
     * @param eventIds    the event ids
     * @return the convert trend
     * @throws Exception the exception
     */
    public List<Map<String, BigDecimal>> getConvertTrend(Date beginDate, Date endDate, int granularity, List<String> eventIds) throws Exception{
        Map<String, Long> event1Trend = getEventTrend(beginDate, endDate, granularity, eventIds.get(0));
        Map<String, Long> event2Trend = getEventTrend(beginDate, endDate, granularity, eventIds.get(1));
        return parseConvertTrend(event1Trend, event2Trend);
    }

    /**
     * Gets crowd convert trend.
     *
     * @param beginDate        the begin date
     * @param endDate          the end date
     * @param granularity      the granularity
     * @param eventIds         the event ids
     * @param userCloudCrowdId the user cloud crowd id
     * @return the crowd convert trend
     * @throws Exception the exception
     */
    public List<Map<String, BigDecimal>> getCrowdConvertTrend(Date beginDate, Date endDate, int granularity, List<String> eventIds, Integer userCloudCrowdId) throws Exception{
        Map<String, Long> event1Trend = getCrowdEventTrend(beginDate, endDate, granularity, eventIds.get(0), userCloudCrowdId);
        Map<String, Long> event2Trend = getCrowdEventTrend(beginDate, endDate, granularity, eventIds.get(1), userCloudCrowdId);
        return parseConvertTrend(event1Trend, event2Trend);
    }

    private List<Map<String, BigDecimal>> parseConvertTrend(Map<String, Long> event1Trend, Map<String, Long> event2Trend) {
        List<Map<String, BigDecimal>> eventConvertTrend = new ArrayList();
        for (Map.Entry<String, Long> entry : event1Trend.entrySet()) {
            Long event1Val = entry.getValue();
            Long event2Val = event2Trend.get(entry.getKey());
            Map<String, BigDecimal> item = new HashMap(16);
            if (event2Val == null || event1Val == 0) {
                item.put(entry.getKey(), new BigDecimal("0.00"));
            } else {
                item.put(entry.getKey(), CommonUtil.getPercent(event2Val, event1Val));
            }
            eventConvertTrend.add(item);
        }
        return eventConvertTrend;
    }

    /**
     * Gets event finish trend.
     *
     * @param beginDate   the begin date
     * @param endDate     the end date
     * @param granularity the granularity
     * @param eventId     the event id
     * @return the event finish trend
     * @throws Exception the exception
     */
    public List<Map<String, Long>> getEventFinishTrend(Date beginDate, Date endDate, int granularity, String eventId) throws Exception{
        Map<String, Long> eventTrend = getEventTrend(beginDate, endDate, granularity, eventId);
        return parseEventFinishTrend(eventTrend);
    }

    /**
     * Gets crowd event finish trend.
     *
     * @param beginDate        the begin date
     * @param endDate          the end date
     * @param granularity      the granularity
     * @param eventId          the event id
     * @param userCloudCrowdId the user cloud crowd id
     * @return the crowd event finish trend
     * @throws Exception the exception
     */
    public List<Map<String, Long>> getCrowdEventFinishTrend(Date beginDate, Date endDate, int granularity, String eventId, Integer userCloudCrowdId) throws Exception{
        Map<String, Long> eventTrend = getCrowdEventTrend(beginDate, endDate, granularity, eventId, userCloudCrowdId);
        return parseEventFinishTrend(eventTrend);
    }

    /**
     * Parse event finish trend list.
     *
     * @param eventTrend the event trend
     * @return the list
     * @throws Exception the exception
     */
    public List<Map<String, Long>> parseEventFinishTrend(Map<String, Long> eventTrend) throws Exception{

        List<Map<String, Long>> eventConvertTrend = new ArrayList();
        Long prev = 0L;
        for (Map.Entry<String, Long> entry : eventTrend.entrySet()) {
            Map<String, Long> item = new HashMap(16);
            item.put(entry.getKey(), prev + entry.getValue());
            prev = prev + entry.getValue();
            eventConvertTrend.add(item);
        }
        return eventConvertTrend;
    }

    /**
     * Gets event trend.
     *
     * @param beginDate   the begin date
     * @param endDate     the end date
     * @param granularity the granularity
     * @param eventId     the event id
     * @return the event trend
     * @throws Exception the exception
     */
    public Map<String, Long> getEventTrend(Date beginDate, Date endDate, int granularity, String eventId) throws Exception{
        String funnelSql = String.format("select * from bitmap_hbase.funnel_index_bitmap where object_id=%s group by object_id,object_type;", eventId);
        CubeResultDto cubeResultDto = userCloudApi.postSqlToGetCubeResult(funnelSql);
        return parseEventTrend(beginDate, endDate, granularity, cubeResultDto);
    }

    /**
     * Gets crowd event trend.
     *
     * @param beginDate        the begin date
     * @param endDate          the end date
     * @param granularity      the granularity
     * @param eventId          the event id
     * @param userCloudCrowdId the user cloud crowd id
     * @return the crowd event trend
     * @throws Exception the exception
     */
    public Map<String, Long> getCrowdEventTrend(Date beginDate, Date endDate, int granularity, String eventId, Integer userCloudCrowdId) throws Exception{
        CrowdInfoResp crowdInfoResp = crowdApi.getCrowdInfo(userCloudCrowdId);
        if (crowdInfoResp == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_CLOUD_GET_CROWD_ERROR);
        }
        String crowdBitmapSql = buildQueryCrowdBitmapSql(crowdInfoResp);
        String funnelSql = String.format("r2=select * from bitmap_hbase.funnel_index_bitmap where object_id=%s group by object_id,object_type;", eventId);
        String unionSql = String.format("%s %s r3=unite(r2,r1);r3.subkey(0);", crowdBitmapSql, funnelSql);
        CubeResultDto cubeResultDto = userCloudApi.postSqlToGetCubeResult(unionSql);
        return parseEventTrend(beginDate, endDate, granularity, cubeResultDto);
    }

    private Map<String, Long> parseEventTrend(Date beginDate, Date endDate, int granularity, CubeResultDto cubeResultDto) throws Exception{
        Map<String, Long> dateMap = generateSortedMap(beginDate, endDate, granularity);
        List<Map<String, String>> results = cubeResultDto.getResults();
        for (Map<String, String> m : results) {
            String key = m.get("key");
            String val = m.get("value");
            String[] subKey = parseKeyToArray(key);
            if (subKey.length < 2) {
                continue;
            }
            Date d = DateUtil.string2Date("yyyy-MM-dd", subKey[1]);
            int date = Integer.parseInt(DateUtil.date2String("yyyyMMdd", d));
            if (granularity == Calendar.MONTH || granularity == Calendar.WEEK_OF_YEAR) {
                date = DateUtil.getSpecificDate(d, granularity);
            }
            Long v = dateMap.get(String.valueOf(date));
            if (v != null && val != null) {
                dateMap.put(String.valueOf(date), v+Integer.parseInt(val));
            }
        }
        return dateMap;
    }

    /**
     * Gets funnel detail.
     *
     * @param definitions the definitions
     * @return the funnel detail
     * @throws Exception the exception
     */
    public List<List<String>> getFunnelDetail(List<FunnelStepConditionDefinition> definitions) throws Exception{
        String eventStr = parseToStr(definitions);
        String funnelSql = String.format("select * from bitmap_hbase.funnel_index_bitmap where object_id in (%s) group by object_id,object_type;", eventStr);
        CubeResultDto cubeResultDto = userCloudApi.postSqlToGetCubeResult(funnelSql);
        Map<String, Map<String, String>> dateDetailMap = parseFunnelDetail(cubeResultDto);
        return buildDetail(dateDetailMap, definitions);
    }

    /**
     * Gets crowd funnel detail.
     *
     * @param definitions      the definitions
     * @param userCloudCrowdId the user cloud crowd id
     * @return the crowd funnel detail
     * @throws Exception the exception
     */
    public List<List<String>> getCrowdFunnelDetail(List<FunnelStepConditionDefinition> definitions, Integer userCloudCrowdId) throws Exception{
        CrowdInfoResp crowdInfoResp = crowdApi.getCrowdInfo(userCloudCrowdId);
        if (crowdInfoResp == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_CLOUD_GET_CROWD_ERROR);
        }
        String crowdBitmapSql = buildQueryCrowdBitmapSql(crowdInfoResp);
        String eventStr = parseToStr(definitions);
        String funnelSql = String.format("r2=select * from bitmap_hbase.funnel_index_bitmap where object_id in (%s) group by object_id,object_type;", eventStr);
        String unionSql = String.format("%s %s r3=unite(r2,r1);r3.subkey(0);", crowdBitmapSql, funnelSql);
        CubeResultDto cubeResultDto = userCloudApi.postSqlToGetCubeResult(unionSql);
        Map<String, Map<String, String>> dateDetailMap = parseFunnelDetail(cubeResultDto);
        return buildDetail(dateDetailMap, definitions);
    }

    /**parse to sorted map,example: map<20170506 map<event_id 100>>
     *
     * @param cubeResultDto
     * @return
     */
    private Map<String, Map<String, String>> parseFunnelDetail(CubeResultDto cubeResultDto) {
        Map<String, Map<String, String>> dateDetailMap = new TreeMap(Comparator.naturalOrder());

        List<Map<String, String>> results = cubeResultDto.getResults();
        for (Map<String, String> m : results) {
            String key = m.get("key");
            String val = m.get("value");
            String[] subKey = parseKeyToArray(key);
            if (subKey.length < 2) {
                continue;
            }
            Map<String, String> detailMap = dateDetailMap.get(subKey[1]);
            if (detailMap == null) {
                detailMap = new HashMap(16);
            }
            detailMap.put(subKey[0], val);
            dateDetailMap.put(subKey[1], detailMap);
        }
        return dateDetailMap;
    }

    /**the prev function get the sorted map,like this: map<20170506 map<event_id 100>>
     * then iterator the sorted map, build the table column row by row.
     * @param dateDetailMap
     * @param definitions
     * @return
     */
    private List<List<String>> buildDetail(Map<String, Map<String, String>> dateDetailMap, List<FunnelStepConditionDefinition> definitions) {
        List<List<String>> detailList = new ArrayList();
        for (Map.Entry<String, Map<String, String>> entry : dateDetailMap.entrySet()) {
            List<String> cellList = new ArrayList();
            cellList.add(entry.getKey());
            Map<String, String> m = entry.getValue();
            //record the first event value,set -1 default.
            Long firstVal = -1L;
            for (FunnelStepConditionDefinition definition : definitions) {
                // get the event value
                String eventValue = m.get(definition.getKey());
                Long val = 0L;
                if (eventValue != null) {
                    val = Long.parseLong(m.get(definition.getKey()));
                }
                BigDecimal ratio;
                if (firstVal == -1) {
                    if (val != 0) {
                        ratio = new BigDecimal("100.00");
                    } else {
                        ratio = new BigDecimal("0.00");
                    }
                    firstVal = val;
                } else {
                    if (firstVal == 0) {
                        ratio = new BigDecimal("0.00");
                    } else {
                        ratio = CommonUtil.getPercent(val, firstVal);
                    }
                }
                String cell = String.format("%d | %s%%", val, ratio);
                cellList.add(cell);
            }
            detailList.add(cellList);
        }
        return detailList;
    }

    private String buildQueryCrowdBitmapSql(CrowdInfoResp crowdInfoResp) {
        String rowKey = String.format("%s_biz_tag_%d_%s", crowdInfoResp.getTenantId(), crowdInfoResp.getId(), crowdInfoResp.getTouchPointType());
        return String.format("r1=select * from bitmap_hbase.crowd_bitmap where rowkey=\"%s\";", rowKey);
    }

    private String parseToStr(List<FunnelStepConditionDefinition> definitions) {
        List<String> eventList = new ArrayList();
        for (FunnelStepConditionDefinition funnelStepConditionDefinition : definitions) {
            eventList.add(funnelStepConditionDefinition.getKey());
        }
        if (eventList.size() == 1) {
            return eventList.get(0);
        }
        return String.join(",", eventList);
    }

    private String[] parseKeyToArray(String key) {
        if (key == null) {
            return new String[]{};
        }
        return key.split(",");
    }

    /** pre generate sorted map by the given begin and end date
    * it will generate continuous value in a period of time
    * if granularity == Calendar.WEEK_OF_YEAR or DAY_OF_MONTH, return <14,0><15,0>....
    * but if day, return <20170203,0>,<20170204,0>...
     */
    private Map<String, Long> generateSortedMap(Date beginDate, Date endDate, int granularity) {
        Map<String, Long> treeMap = new TreeMap(
                new Comparator<String>() {
                    @Override
                    public int compare(String o1, String o2) {
                        Integer begin = Integer.parseInt(o1);
                        Integer end = Integer.parseInt(o2);
                        return begin - end;
                    }
                }
        );
        // granularity is day
        if (granularity != Calendar.MONTH && granularity != Calendar.WEEK_OF_YEAR) {
            while (beginDate.getTime() <= endDate.getTime()) {
                treeMap.put(DateUtil.date2String("yyyyMMdd", beginDate), 0L);
                beginDate = DateUtils.addHours(beginDate, 24);
            }
            return treeMap;
        }

        int begin = DateUtil.getSpecificDate(beginDate, granularity);
        int end = DateUtil.getSpecificDate(endDate, granularity);
        while (begin <= end) {
            treeMap.put(String.valueOf(begin), 0L);
            begin++;
        }
        return treeMap;
    }
}