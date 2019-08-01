package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.entity.dto.AnalysisItemDto;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube.CubeDetail;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube.CubeResultDto;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube.CubeSelectModelMeasure;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.middleware.UserCloudApi;
import com.talkingdata.marketing.core.util.JsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

/**
 * The type Analysis service.
 * @author armeng
 */
@Service("analysisService")
public class AnalysisService {
    private static final Logger logger = LoggerFactory.getLogger(AnalysisService.class);
    @Autowired
    private UserCloudApi userCloudApi;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    /**
     * Gets actual value.
     *
     * @param campaignId the campaign id
     * @param code       the code
     * @param begin      the begin
     * @param end        the end
     * @return the actual value
     * @throws Exception the exception
     */
    public Long getActualValue(Integer campaignId, Integer code, String begin, String end) throws Exception{
        CubeDetail cubeDetail = getCubeDetailById(code);
        if (cubeDetail == null) {
            return 0L;
        }
        String cubeCode = getCubeCodeByDetail(cubeDetail);
        if (cubeCode == null) {
            return 0L;
        }
        String sql = String.format("select * from enterprise.%s where campaign_id=%d and start_time>=%s and start_time<=%s;", cubeCode, campaignId, begin, end);
        CubeResultDto result = userCloudApi.postSqlToGetCubeResult(sql);

        if (result.getResults().size() == 0) {
            return 0L;
        }
        try {
            return Long.parseLong(result.getResults().get(0).get("value"));
        } catch(Exception e) {
            return 0L;
        }
    }

    /**
     * Gets trend.
     *
     * @param campaignId the campaign id
     * @param code       the code
     * @param begin      the begin
     * @param end        the end
     * @return the trend
     * @throws Exception the exception
     */
    public Map<String, Long> getTrend(Integer campaignId, Integer code, String begin, String end) throws Exception{
        CubeDetail cubeDetail = getCubeDetailById(code);
        if (cubeDetail == null) {
            return Collections.emptyMap();
        }
        String cubeCode = getCubeCodeByDetail(cubeDetail);
        if (cubeCode == null) {
            return Collections.emptyMap();
        }
        String sql = String.format("select * from enterprise.%s where campaign_id=%d and start_time>=%s and start_time<=%s group by start_time;", cubeCode, campaignId, begin, end);
        CubeResultDto results = userCloudApi.postSqlToGetCubeResult(sql);

        Map<String, Long> sortedMap = new TreeMap(
                new Comparator<String>() {
                    @Override
                    public int compare(String o1, String o2) {
                        return o1.compareTo(o2);
                    }
                }
        );

        List<Map<String, String>> resultList = results.getResults();
        for (Map<String, String> m : resultList) {
            String date = m.get("key");
            Long value = Long.parseLong(m.get("value"));
            sortedMap.put(date, value);
        }
        return sortedMap;
    }

    /**
     * Gets analysis count.
     *
     * @param campaignId the campaign id
     * @param code       the code
     * @return the analysis count
     * @throws Exception the exception
     */
    public Integer getAnalysisCount(Integer campaignId, Integer code) throws Exception{
        CubeDetail cubeDetail = getCubeDetailById(code);
        if (cubeDetail == null) {
            return 0;
        }
        String cubeCode = getCubeCodeByDetail(cubeDetail);
        if (cubeCode == null) {
            return 0;
        }
        String cubeColumn = getColumnByDetail(cubeDetail);
        if (cubeColumn == null) {
            return 0;
        }
        String sql = String.format("select * from enterprise.%s group by `%s`;", cubeCode, cubeColumn);
        CubeResultDto results = userCloudApi.postSqlToGetCubeResult(sql);
        return results.getResults().size();
    }

    /**
     * Gets comparing trend.
     *
     * @param campaignId the campaign id
     * @param code       the code
     * @param begin      the begin
     * @param end        the end
     * @param topN       the top n
     * @return the comparing trend
     * @throws Exception the exception
     */
    public Map<String, List<AnalysisItemDto>> getComparingTrend(Integer campaignId, Integer code, String begin, String end, int topN) throws Exception{
        CubeDetail cubeDetail = getCubeDetailById(code);
        if (cubeDetail == null) {
            return Collections.emptyMap();
        }
        String cubeCode = getCubeCodeByDetail(cubeDetail);
        if (cubeCode == null) {
            return Collections.emptyMap();
        }
        String cubeColumn = getColumnByDetail(cubeDetail);
        if (cubeColumn == null) {
            return Collections.emptyMap();
        }
        Set<String> topNSet = getTopN(campaignId,cubeCode, cubeColumn,begin,end, topN);
        String sql = String.format("select * from enterprise.%s where campaign_id=%d and start_time>=%s and start_time<=%s group by start_time,`%s`;", cubeCode, campaignId, begin, end, cubeColumn);
        CubeResultDto results = userCloudApi.postSqlToGetCubeResult(sql);

        List<Map<String, String>> resultList = results.getResults();
        //map的key是date, value是topN 无序的渠道实际值列表
        Map<String, List<AnalysisItemDto>> sortedMap = generateSortedMap();

        for (Map<String, String> m : resultList) {
            String[] v = m.get("key").split(",");
            if (v.length != 2) {
                continue;
            }
            String date = v[0];
            List<AnalysisItemDto> l = sortedMap.get(date);
            if (l == null) {
                l = new ArrayList();
            }
            //如果当前渠道不属于topN中的渠道，则丢弃
            if (!topNSet.contains(v[1])) {
                continue;
            }
            AnalysisItemDto item = new AnalysisItemDto();
            item.setName(v[1]);
            item.setValue(Long.parseLong(m.get("value")));
            l.add(item);
            sortedMap.put(date, l);
        }

        // 保证topN元素在sortedAnalysisItems中,没有对item排序
        for (Map.Entry<String, List<AnalysisItemDto>> entry : sortedMap.entrySet()) {
            entry.setValue(getCompleteList(entry.getValue(), topNSet));
        }
        return sortedMap;
    }

    /**取到前topN的渠道
     *
     * @param campaignId
     * @param cubeCode
     * @param column
     * @param begin
     * @param end
     * @param topN
     * @return
     * @throws Exception
     */
    private Set<String> getTopN(Integer campaignId, String cubeCode, String column, String begin, String end, int topN) throws Exception{
        String sql = String.format("select * from enterprise.%s where campaign_id=%d and start_time>=%s and start_time<=%s group by `%s`;", cubeCode, campaignId, begin, end, column);
        CubeResultDto results = userCloudApi.postSqlToGetCubeResult(sql);
        Map<Integer, String> convertedSortedMap = new TreeMap(
                new Comparator<Integer>() {
                    @Override
                    public int compare(Integer o1, Integer o2) {
                        return o1 - o2 >= 0 ?-1:1;
                    }
                }
        );

        List<Map<String, String>> resultList = results.getResults();
        for (Map<String, String> m : resultList) {
            String key = m.get("key");
            Integer value = Integer.parseInt(m.get("value"));
            convertedSortedMap.put(value, key);
        }

        Set<String> s = new HashSet();
        //已取得的总数
        int total = 0;
        //如果前一个和当前渠道数量相等，放到set中
        int prev = 0;
        for (Map.Entry<Integer, String> entry : convertedSortedMap.entrySet()) {
            // if next value == previous, we need put to set.
            if (total >= topN && entry.getKey() != prev) {
                break;
            }
            total++;
            prev = entry.getKey();
            s.add(entry.getValue());
        }
        return s;
    }

    /**
     * Gets chart.
     *
     * @param campaignId the campaign id
     * @param code       the code
     * @param begin      the begin
     * @param end        the end
     * @return the chart
     * @throws Exception the exception
     */
    public Map<String, Long> getChart(Integer campaignId, Integer code, String begin, String end) throws Exception{
        CubeDetail cubeDetail = getCubeDetailById(code);
        if (cubeDetail == null) {
            return Collections.emptyMap();
        }
        String cubeCode = getCubeCodeByDetail(cubeDetail);
        if (cubeCode == null) {
            return Collections.emptyMap();
        }
        String cubeColumn = getColumnByDetail(cubeDetail);
        if (cubeColumn == null) {
            return Collections.emptyMap();
        }
        String sql = String.format("select * from enterprise.%s where campaign_id=%d and start_time>=%s and start_time<=%s group by `%s`;", cubeCode, campaignId, begin, end, cubeColumn);
        CubeResultDto results = userCloudApi.postSqlToGetCubeResult(sql);
        Map<String, Long> sourceMap = new HashMap(16);
        List<Map<String, String>> resultList = results.getResults();
        for (Map<String, String> m : resultList) {
            String key = m.get("key");
            Long value = Long.parseLong(m.get("value"));
            sourceMap.put(key, value);
        }
        return sourceMap;
    }

    private CubeDetail getCubeDetailById(Integer indexId) throws Exception {
        CubeDetail cubeDetail = userCloudApi.getCubeDetailApi(indexId);
        if (cubeDetail == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_CLOUD_CUBE_NOT_EXIST);
        }
        logger.info("get cube detail:"+ JsonUtil.toJson(cubeDetail));
        return cubeDetail;
    }

    private String getCubeCodeByDetail(CubeDetail cubeDetail) {
        return cubeDetail.getCubeInfo().getCubeCode();
    }

    private String getColumnByDetail(CubeDetail cubeDetail) {
        List<CubeSelectModelMeasure> dimensionList = cubeDetail.getMeasure().getMeasures();
        if (dimensionList == null || dimensionList.size() == 0) {
            return null;
        }
        return dimensionList.get(0).getColumnCode();
    }

    private Map<String, List<AnalysisItemDto>> generateSortedMap() {
        return new TreeMap(
                new Comparator<String>() {
                    @Override
                    public int compare(String o1, String o2) {
                        return o1.compareTo(o2);
                    }
                }
        );
    }

    /**保证topN元素在sortedAnalysisItems中,没有对item排序
     *
     * @param items
     * @param topNSet
     * @return
     */
    private List<AnalysisItemDto> getCompleteList(List<AnalysisItemDto> items, Set<String> topNSet) {
        Map<String, Long> itemMap = new HashMap(16);
        for (AnalysisItemDto item : items) {
            itemMap.put(item.getName(), item.getValue());
        }

        for (String str : topNSet) {
            if (!itemMap.containsKey(str)) {
                itemMap.put(str, 0L);
            }
        }

        List<AnalysisItemDto> sortedAnalysisItems = new ArrayList();
        for (Map.Entry<String, Long> entry : itemMap.entrySet()) {
            AnalysisItemDto item = new AnalysisItemDto();
            item.setName(entry.getKey());
            item.setValue(entry.getValue());
            sortedAnalysisItems.add(item);
        }
        return sortedAnalysisItems;
    }
}
