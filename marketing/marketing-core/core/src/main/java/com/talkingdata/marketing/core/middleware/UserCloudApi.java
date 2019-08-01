package com.talkingdata.marketing.core.middleware;

import com.talkingdata.marketing.core.constant.ParamConstants;
import com.talkingdata.marketing.core.entity.thirdmodel.config.FunnelEventParam;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdInfoResp;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube.CubeDetail;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube.CubeResultDto;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition.CampaignTargetCube;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition.CampaignTargetCubeItem;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition.FunnelEvent;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.util.HttpClientUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * The type User cloud api.
 * @author xiaoming.kang
 */
@Component
public class UserCloudApi {

    private static final Logger logger = LoggerFactory.getLogger(UserCloudApi.class);

    private static final String GET_CAMPAIGN_TARGET_CUBE_API = "/dmp-rest/api/v4/meta/reportCubes";

    private static final String GET_FUNNEL_EVENT_API = "/dmp-rest/api/v4/admin/metaObjects/bizAttributeValueMeta";

    private static final String GET_CAMPAIGN_TARGET_CUBE_DETAIL_API = "/dmp-rest/api/v4/meta/reportCubes/%d";

    private static final String TARGET_RESULT_QUERY_API = "/dmp-rest/api/v4/admin/meta/cube/result";

    private static final String QUERY_ENGINE_API = "/dmp-queryengine/api/query";

    @Autowired
    private ConfigApi configApi;

    @Autowired
    private FunnelEventParam funnelEventParam;
    @Autowired
    private CrowdApi crowdApi;
    @Autowired
    private ApiLog apiLog;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    /**
     * Gets campaign target cube.
     *
     * @param tenantId the tenant id
     * @return the campaign target cube
     * @throws Exception the exception
     */
    public List<CampaignTargetCubeItem> getCampaignTargetCube(String tenantId) throws Exception {
        String rootUrl = crowdApi.getRootUrl();
        String url = rootUrl + GET_CAMPAIGN_TARGET_CUBE_API + "?tenantId=%s&rows=1000";
        String urlFormat = String.format(url, tenantId);

        logger.info("用户管家计划目标指标接口URL:" + urlFormat);
        CampaignTargetCube campaignTargetCubes;
        String resp;
        try {
            resp = HttpClientUtil.get(urlFormat);
            campaignTargetCubes = JsonUtil.toObject(resp, CampaignTargetCube.class);
        } catch (Exception e) {
            apiLog.printThirdApiLog("UserCloudApi", "getCampaignTargetCube", urlFormat, tenantId, e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_CLOUD_API_ERROR);
        }
        logger.info("用户管家计划目标指标接口返回数据：" + campaignTargetCubes);
        return campaignTargetCubes.getRows();
    }

    /**
     * Gets funnel event api.
     *http://172.23.5.128/dmp-rest/api/v4/meta/reportCubes?tenantId=talking131&rows=1000
     * @param tenantId the tenant id
     * @return the funnel event api
     * @throws Exception the exception
     */
    public List<FunnelEvent> getFunnelEventApi(String tenantId) throws Exception {
        String rootUrl = crowdApi.getRootUrl();
        String url = rootUrl + GET_FUNNEL_EVENT_API + "?phyTableCode=%s&phyTableColumn=%s&tenantId=%s";
        String urlFormat = String.format(url, funnelEventParam.getPhyTableCode(), funnelEventParam.getPhyTableColumn(), tenantId);
        logger.info("用户管家事件名称接口UR：" + urlFormat);
        String resp = HttpClientUtil.get(urlFormat);
        List <LinkedHashMap> list = JsonUtil.toObject(resp, List.class);
        logger.info("用户管家事件名称接口UR：返回数据：" + list);
        return convert(list, FunnelEvent.class);
    }

    /**
     * Gets cube detail api.
     *
     * @param cubeId the cube id
     * @return the cube detail api
     * @throws Exception the exception
     */
    public CubeDetail getCubeDetailApi(Integer cubeId) throws Exception {
        String rootUrl = crowdApi.getRootUrl();
        String url = rootUrl + String.format(GET_CAMPAIGN_TARGET_CUBE_DETAIL_API, cubeId);
        CubeDetail cubeDetail;
        String resp;
        try {
            resp = HttpClientUtil.get(url);
            cubeDetail = JsonUtil.toObject(resp, CubeDetail.class);
        } catch (Exception e) {
            apiLog.printThirdApiLog("UserCloudApi", "getCubeDetailApi", url, "", e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_CLOUD_GET_CUBE_DEF_ERROR);
        }
        return cubeDetail;
    }

    /**
     * Gets crowd count with version api.
     *
     * @param refId        the ref id
     * @param crowdVersion the crowd version
     * @return the crowd count with version api
     */
    public Integer getCrowdCountWithVersionApi(Integer refId, String crowdVersion) throws IOException {
        CrowdInfoResp crowdInfoResp = crowdApi.getCrowdInfo(refId);
        if (crowdInfoResp == null) {
            logger.info("getCrowdCountWithVersionApi.根据人群id查询用户管家返回为null.refId={}",refId);
            return 0;
        }
        String rowKey = String.format("%s_%s_%s", refId, crowdVersion, crowdInfoResp.getTouchPointType());
        String sql = String.format("select * from bitmap_hbase.mkt_crowd_bitmap where rowkey=%s;", rowKey);
        try {
            CubeResultDto cubeResultDto = postSqlToGetCubeResult(sql);
            if (cubeResultDto == null) {
                logger.info("getCrowdCountWithVersionApi.cubeResultDto=null.sql={}",sql);
                return 0;
            }
            logger.info("getCrowdCountWithVersionApi.cubeResultDto={}", JsonUtil.toJson(cubeResultDto));
            List<Map<String, String>> results = cubeResultDto.getResults();
            if (results == null || results.size() == 0) {
                return 0;
            }
            Map<String, String> m = results.get(0);
            if (m == null) {
                return 0;
            }
            final String valueKey = "value";
            if (!m.containsKey(valueKey)) {
                return 0;
            }
            return Integer.parseInt(m.get(valueKey));
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Gets trend by campaign api.
     *
     * @param cubeDetail the cube detail
     * @param campaignId the campaign id
     * @return the trend by campaign api
     * @throws Exception the exception
     */
    public Map<String, Long> getTrendByCampaignApi(CubeDetail cubeDetail, Integer campaignId) throws Exception {
        String code = getCubeCode(cubeDetail);
        return getTrendByMetric(code, "campaign_id", campaignId);
    }

    /**
     * Gets trend by segment api.
     *
     * @param cubeDetail the cube detail
     * @param segmentId  the segment id
     * @return the trend by segment api
     * @throws Exception the exception
     */
    public Map<String, Long> getTrendBySegmentApi(CubeDetail cubeDetail, Integer segmentId) throws Exception {
        String code = getCubeCode(cubeDetail);
        return getTrendByMetric(code, "segment_id", segmentId);
    }

    private Map<String, Long> getTrendByMetric(String code, String metricKey, Integer metricVal) throws Exception{
        String sql = String.format("select * from enterprise.%s where %s=%d group by start_time;", code, metricKey, metricVal);
        CubeResultDto cubeResultDto = postSqlToGetCubeResult(sql);
        Map<String, Long> sortedMap = generateSortedMap();
        sortedMap.putAll(parseToResultMap(cubeResultDto));

        //add up value
        Long prevValue = 0L;
        for (Map.Entry<String, Long> entry : sortedMap.entrySet()) {
            Long currValue = entry.getValue();
            Long value = currValue + prevValue;
            entry.setValue(value);
            prevValue = value;
        }
        return sortedMap;
    }

    private Map<String, Long> generateSortedMap() {
        return new TreeMap(Comparator.naturalOrder());
    }

    /**
     * Gets unit effect api by segments.
     *
     * @param cubeDetail the cube detail
     * @param segmentIds the segment ids
     * @return the unit effect api by segments
     * @throws Exception the exception
     */
    public Map<String, Long> getUnitEffectApiBySegments(CubeDetail cubeDetail, List <Integer> segmentIds) throws Exception {
        String code = getCubeCode(cubeDetail);
        String[] unitArray = listToArray(segmentIds);
        if (unitArray.length <= 0) {
            logger.info("unitIds length is 0");
            return new HashMap(16);
        }
        String unitIdStr = String.join(",", unitArray);
        String sql = String.format("select * from enterprise.%s where segment_id in (%s) group by segment_id;", code, unitIdStr);
        CubeResultDto cubeResultDto = postSqlToGetCubeResult(sql);
        return parseToResultMap(cubeResultDto);
    }

    /**
     * Gets effect api.
     *
     * @param cubeDetail  the cube detail
     * @param campaignIds the campaign ids
     * @return the effect api
     * @throws Exception the exception
     */
    public Map<String, Long>  getEffectApi(CubeDetail cubeDetail, List<Integer> campaignIds) throws Exception {
        String code = getCubeCode(cubeDetail);
        String[] campaignArray = listToArray(campaignIds);
        if (campaignArray.length <= 0) {
            logger.info("campaignIds length is 0");
            return new HashMap(16);
        }
        String campaignIdStr = String.join(",", campaignArray);
        String sql = String.format("select * from enterprise.%s where campaign_id in (%s) group by `campaign_id`;", code, campaignIdStr);
        CubeResultDto cubeResultDto = postSqlToGetCubeResult(sql);
        return parseToResultMap(cubeResultDto);
    }

    private String[] listToArray(List<Integer> ids) {
        String[] arr = new String[ids.size()];
        for (int i = 0; i < ids.size(); i++) {
            arr[i] = String.valueOf(ids.get(i));
        }
        return arr;
    }

    /**
     * Gets unit effect api.
     *
     * @param cubeDetail the cube detail
     * @param unitIds    the unit ids
     * @return the unit effect api
     * @throws Exception the exception
     */
    public Map<String, Long> getUnitEffectApi(CubeDetail cubeDetail, List<Integer> unitIds) throws Exception {
        String code = getCubeCode(cubeDetail);
        String[] unitArray = listToArray(unitIds);
        if (unitArray.length <= 0) {
            logger.info("unitIds length is 0");
            return new HashMap(16);
        }
        String unitIdStr = String.join(",", unitArray);
        String sql = String.format("select * from enterprise.%s where campaign_launch_unit_id in (%s) group by campaign_launch_unit_id;", code, unitIdStr);
        CubeResultDto cubeResultDto = postSqlToGetCubeResult(sql);
        return parseToResultMap(cubeResultDto);
    }

    /**
     * Gets segment effect api.
     *
     * @param cubeDetail the cube detail
     * @param segmentIds the segment ids
     * @return the segment effect api
     * @throws Exception the exception
     */
    public Map<String, Long> getSegmentEffectApi(CubeDetail cubeDetail, List<Integer> segmentIds) throws Exception {
        String code = getCubeCode(cubeDetail);
        String[] segArray = listToArray(segmentIds);
        if (segArray.length <= 0) {
            logger.info("segmentIds length is 0");
            return new HashMap(16);
        }
        String segmentIdStr = String.join(",", segArray);
        String sql = String.format("select * from enterprise.%s where segment_id in (%s) group by segment_id;", code, segmentIdStr);
        CubeResultDto cubeResultDto = postSqlToGetCubeResult(sql);
        return parseToResultMap(cubeResultDto);
    }

    private String getCubeCode(CubeDetail cubeDetail) {
        return cubeDetail.getCubeInfo().getCubeCode();
    }

    /**
     * Post sql to get cube result cube result dto.
     *
     * @param sql the sql
     * @return the cube result dto
     * @throws Exception the exception
     */
    public CubeResultDto postSqlToGetCubeResult(String sql) throws Exception{
        String url = getQueryEngineUrl() + QUERY_ENGINE_API;
        logger.info(String.format("get cube result, sql:%s\nurl:%s", sql,url));
        CubeResultDto cubeResultDto = null;
        try {
            cubeResultDto = HttpClientUtil.post(url, sql, "UTF-8", CubeResultDto.class);
        } catch (Exception e) {
            apiLog.printThirdApiLog("UserCloudApi", "postSqlToGetCubeResult", url, sql, e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_CLOUD_GET_CUBE_RESULT_ERROR);
        }
        logger.info(String.format("get cube result, sql:%s,result:%s", sql, cubeResultDto.toString()));
        return cubeResultDto;
    }

    private Map<String, Long> parseToResultMap(CubeResultDto cubeResultDto) {
        List<Map<String, String>> results = cubeResultDto.getResults();
        Map<String, Long> resultMap = new HashMap(16);
        if (results == null) {
            return resultMap;
        }
        for (Map<String, String> m : results) {
            String segmentId = m.get("key");
            Long val = Long.parseLong(m.get("value"));
            resultMap.put(segmentId, val);
        }
        return resultMap;
    }

    private List<FunnelEvent> convert(final List<LinkedHashMap> list, Class<FunnelEvent> clazz) throws IllegalAccessException, InstantiationException {
        Map<String, String> tmp = new HashMap<>(16);
        List<FunnelEvent> result = new ArrayList<>();
        for (LinkedHashMap map : list) {
            Iterator iter = map.entrySet().iterator();
            FunnelEvent funnelEvent = clazz.newInstance();
            while (iter.hasNext()) {
                Map.Entry entry = (Map.Entry) iter.next();
                if ("attributeValue".equalsIgnoreCase((String) entry.getKey())) {
                    String value = (String) entry.getValue();
                    if (isNotExist(tmp, value)) {
                        funnelEvent.setAttributeValue(value);
                        tmp.put(value, value);
                    } else {
                        continue;
                    }
                }
                if ("tenantId".equalsIgnoreCase((String) entry.getKey())) {
                    funnelEvent.setTenantId((String) entry.getValue());
                }
            }
            if (funnelEvent.getAttributeValue() != null) {
                result.add(funnelEvent);
            }
        }
        return result == null ? Collections.EMPTY_LIST : result;
    }

    private boolean isNotExist(Map<String, String> tmp, String value) {
        return tmp.get(value) == null ? true : false;
    }


    /**
     * Gets query engine url.
     *
     * @return the query engine url
     */
    public String getQueryEngineUrl() {
        String host = ParamConstants.QUERYENGINE_HOST;
        String port = ParamConstants.QUERYENGINE_PORT;
        String queryEngineHost = configApi.getParam(host, ParamConstants.SYSTEM_CODE);
        String queryEnginePort = configApi.getParam(port, ParamConstants.SYSTEM_CODE);
        return queryEngineHost + ":" + queryEnginePort;
    }
}
