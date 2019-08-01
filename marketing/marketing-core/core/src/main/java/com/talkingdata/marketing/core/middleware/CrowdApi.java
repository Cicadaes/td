package com.talkingdata.marketing.core.middleware;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.talkingdata.marketing.core.constant.CommonConstants;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdCalcStatus;
import com.talkingdata.marketing.core.constant.ParamConstants;
import com.talkingdata.marketing.core.constant.PushConstants;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdEstimateResp;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdInfoResp;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdResp;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition.Definition;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition.DefinitionBuilder;
import com.talkingdata.marketing.core.enums.PushMetric;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.campaign.CrowdPage;
import com.talkingdata.marketing.core.util.HttpClientUtil;
import com.talkingdata.marketing.core.util.JsonUtil;
import org.apache.commons.lang.StringUtils;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.zip.ZipInputStream;

/**
 * The type Crowd api.
 *
 * @author xiaoming.kang
 */
@Component public class CrowdApi {
    private static final String SNAPSHOT_CROWD_URL = "/dmp-rest/api/v4/crowd/crowds/snapshot?columns=crowd_id,version&values=%s";
    /**
     * The Create crowd api.
     */
    static String createCrowdApi = "/dmp-rest/api/v4/crowd/crowds/create/pc/%s/%s/%s/%s/%s";
    /**
     * The Create sub crowd api.
     */
    static String createSubCrowdApi = "/dmp-rest/api/v4/crowd/crowds/create/subCrowd";
    /**
     * The Recount crowd api.
     */
    static String recountCrowdApi = "/dmp-rest/api/v4/crowd/crowds/restart/%d";
    /**
     * The Get crowd estimate api.
     */
    static String getCrowdEstimateApi = "/dmp-rest/api/v4/crowd/crowds/queryCrowdCount/%d";
    /**
     * The Get crowd statu api.
     */
    static String getCrowdStatuApi = "/dmp-rest/api/v4/crowd/crowds/%d";
    /**
     * The Get crowd list api.
     */
    static String getCrowdListApi = "/dmp-rest/api/v4/crowd/crowds";
    /**
     * The Crowd download notice api.
     */
    static String crowdDownloadNoticeApi = "/dmp-rest/api/v4/crowd/crowds/download";
    /**
     * The Crowd download increment notice api.
     */
    static String crowdDownloadIncrementNoticeApi = "/dmp-rest/api/v4/crowd/crowds/incre/download";
    /**
     * The Crowd download notice with attr api.
     */
    static String crowdDownloadNoticeWithAttrApi = "/dmp-rest/api/v4/crowd/crowds/download/old_attributes";
    /**
     * The Crowd download check api.
     */
    static String crowdDownloadCheckApi = "/dmp-rest/api/v4/crowd/crowds/download/%d/status";
    /**
     * The Crowd download api.
     */
    static String crowdDownloadApi = "/dmp-rest/api/v4/crowd/crowds/download/%d";
    /**
     * The Event mapping api.
     */
    static String eventMappingApi = "/dmp-rest/api/v4/admin/metaObjects/mapping/phyTable/%s/%s";
    /**
     * The Write offset to hdfs.
     */
    static String writeOffsetToHdfs = "/dmp-rest/api/v4/crowd/crowds/hdfs/%s/%s/%s/%s/%s/%s";
    private static Map<String, String> eventMapping;
    @Autowired private ConfigApi configApi;
    @Autowired private HttpClientService httpClientService;
    @Autowired private ApiLog apiLog;
    @Autowired private ExceptionBuilder exceptionBuilder;
    private Logger logger = LoggerFactory.getLogger(getClass());

    /**
     * Create crowd integer.
     *
     * @param name     the name
     * @param fileTp   the file tp
     * @param fileData the file data
     * @param tenantId the tenant id
     * @return the integer
     */
    public Integer createCrowd(String name, String fileTp, String fileData, String tenantId, String loginName, String userName) {
        logger.info("调用用户管家接口创建人群.name={},fileTp={},tenantId={},loginName={},userName={}");
        String rootUrl = getRootUrl();
        String encodeName = null;
        try {
            encodeName = URLEncoder.encode(name, "UTF-8");
            loginName = URLEncoder.encode(loginName, "UTF-8");
            userName = URLEncoder.encode(userName, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        String url = rootUrl + String.format(createCrowdApi, fileTp, encodeName, tenantId,loginName,userName);
        String resp;
        try {
            resp = HttpClientUtil.post(url, fileData, "UTF-8");
        } catch (Exception e) {
            apiLog.printThirdApiLog("CrowdApi", "createCrowd", url, fileData, e);
            return null;
        }
        logger.info("createCrowd:" + resp + " name:" + name);
        return Integer.valueOf(resp);
    }

    /**
     * Gets root url.
     *
     * @param deployAddress the deploy address
     * @return the root url
     */
    public String getRootUrl(String... deployAddress) {
        String host = ParamConstants.DMP_HOST;
        String port = ParamConstants.DMP_PORT;

        String userCloudHost = configApi.getParam(host, ParamConstants.SYSTEM_CODE);
        String userCloudPort = configApi.getParam(port, ParamConstants.SYSTEM_CODE);
        String url = "";
        if (StringUtils.isEmpty(userCloudPort)) {
            url = userCloudHost;
        } else {
            url = userCloudHost + ":" + userCloudPort;
        }
        return url;
    }

    /**
     * Gets history crowd.
     *
     * @param page the page
     * @return the history crowd
     * @throws Exception the exception
     */
    public CrowdResp getHistoryCrowd(CrowdPage page) throws Exception {
        String[] sourceArray = new String[] {CommonConstants.REF_SOURCE_CROWD_BUILD, CommonConstants.REF_SOURCE_LABEL};
        String source = String.join(",", sourceArray);
        String param = String
            .format("?page=%d&pageSize=%d&status=%d&tenantId=%s&sourceList=%s", page.getPage(), page.getPageSize(), CrowdCalcStatus.STATUS_FINISH,
                page.getTenantId(), source);
        if (StringUtils.isNotBlank(page.getRefName())) {
            param = String.format("%s&name=%s", param, page.getRefName());
        }
        String url = getRootUrl() + getCrowdListApi + param;
        String resp;
        try {
            resp = HttpClientUtil.get(url);
        } catch (Exception e) {
            apiLog.printThirdApiLog("CrowdApi", "getHistoryCrowd", url, "", e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_CLOUD_GET_CROWD_LIST_ERROR);
        }
        return JsonUtil.toObject(resp, CrowdResp.class);
    }

    /**
     * Recount integer.
     *
     * @param crowdId the crowd id
     * @return the integer
     */
    public Integer recount(Integer crowdId) throws IOException {
        String rootUrl = getRootUrl();
        String url = rootUrl + String.format(recountCrowdApi, crowdId);
        String resp = HttpClientUtil.get(url);
        logger.info("recount:" + resp + " crowdId:" + crowdId);
        Map<String, Integer> m = JsonUtil.toObject(resp,HashMap.class);
        return m.get("status").intValue();
    }

    /**
     * Gets estimate by id.
     *
     * @param refId the ref id
     * @return the estimate by id
     */
    public CrowdEstimateResp getEstimateById(Integer refId) throws IOException {
        String rootUrl = getRootUrl();
        String url = rootUrl + String.format(getCrowdEstimateApi, refId);
        String resp = HttpClientUtil.get(url);
        logger.info("getEstimateById:" + resp + " refId:" + refId);
        return JsonUtil.toObject(resp, CrowdEstimateResp.class);
    }

    /**
     * Gets crowd info.
     *
     * @param refId the ref id
     * @return the crowd info
     */
    public CrowdInfoResp getCrowdInfo(Integer refId) throws IOException {
        String rootUrl = getRootUrl();
        String url = rootUrl + String.format(getCrowdStatuApi, refId);
        String resp;
        try {
            resp = HttpClientUtil.get(url);
        } catch (Exception e) {
            apiLog.printThirdApiLog("CrowdApi", "getCrowdInfo", url, "", e);
            /**确认此人群已经被删除，在DMP处*/
            String crowdNotGet = "未获取到人群信息";
            if (StringUtils.isNotBlank(e.getMessage()) && e.getMessage().contains(crowdNotGet)) {
                CrowdInfoResp delResult = new CrowdInfoResp();
                delResult.setStatus(-100);
                return delResult;
            }
            return null;
        }
        logger.info("getCrowdInfo:" + resp + " refId:" + refId);
        return JsonUtil.toObject(resp, CrowdInfoResp.class);
    }

    /**
     * Notice crowd download with version integer.
     * 全量下载通知
     *
     * @param refId        the ref id
     * @param crowdVersion the crowd version
     * @param tp           the tp
     * @return the integer
     */
    public Integer noticeCrowdDownloadWithVersion(Integer refId, String crowdVersion, String tp) {
        MultiValueMap<String, Object> param = new LinkedMultiValueMap();
        //crowd key pattern:$refId##$crowdVersion
        try {
            param.add("crowdKey", URLEncoder.encode(String.format("%d##%s", refId, crowdVersion), StandardCharsets.UTF_8.name()));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        param.add("type", tp);
        Integer taskId = noticeCrowdDownload(param, crowdDownloadNoticeApi);
        logger.info("noticeCrowdDownloadWithVersion taskId {}, refId {}, version {}", taskId, refId, crowdVersion);
        return taskId;
    }

    /**
     * Notice crowd download with increment integer.
     * 增量下载通知
     *
     * @param refId the ref id
     * @param tp    the tp
     * @return the integer
     */
    public Integer noticeCrowdDownloadWithIncrement(Integer refId, String tp) {
        MultiValueMap<String, Object> param = new LinkedMultiValueMap();
        param.add("crowdId", String.valueOf(refId));
        param.add("type", tp);
        Integer taskId = noticeCrowdDownload(param, crowdDownloadIncrementNoticeApi);
        logger.info("noticeCrowdDownloadWithIncrement taskId {}, refId {}", taskId, refId);
        return taskId;
    }

    /**
     * Notice crowd download integer.
     *
     * @param param the param
     * @param url   the url
     * @return the integer
     */
    public Integer noticeCrowdDownload(MultiValueMap<String, Object> param, String url) {
        String fullPath = getRootUrl() + url;
        String resp;
        try {
            resp = HttpClientUtil.post(fullPath, param, String.class);
        } catch (Exception e) {
            apiLog.printThirdApiLog("CrowdApi", "getCrowdDownloadTaskId", fullPath, param, e);
            return null;
        }
        return Integer.valueOf(resp);
    }

    /**
     * Crowd download check integer.
     *
     * @param calcId the calc id
     * @return the integer
     */
    public Integer crowdDownloadCheck(Integer calcId) {
        String rootUrl = getRootUrl();
        String url = rootUrl + String.format(crowdDownloadCheckApi, calcId);
        String resp;
        try {
            resp = HttpClientUtil.get(url);
        } catch (Exception e) {
            apiLog.printThirdApiLog("CrowdApi", "crowdDownloadCheck", url, "", e);
            return null;
        }
        Integer calcStatus = Integer.parseInt(resp);
        logger.info("crowdDownloadCheck:" + resp + " calcId:" + calcId + " calcStatus:" + calcStatus);
        return calcStatus;
    }

    /**
     * Download by calc id list.
     *
     * @param calcId the calc id
     * @return the list
     * @throws Exception the exception
     */
    public List<String> downloadByCalcId(Integer calcId) throws Exception {
        String url = getCrowdDownloadUrl(calcId);
        HttpGet httpget = new HttpGet(url);
        List<String> idList = new ArrayList();
        try (
            CloseableHttpClient httpclient = HttpClientBuilder.create().build();
            ZipInputStream zis = new ZipInputStream(httpclient.execute(httpget).getEntity().getContent());
        ) {
            zis.getNextEntry();
            Scanner sc = new Scanner(zis);
            while (sc.hasNextLine()) {
                String[] line = sc.nextLine().split(",");
                if (line.length <= 0) {
                    continue;
                }
                idList.add(line[0]);
            }
        } catch (Exception e) {
            apiLog.printThirdApiLog("CrowdApi", "getDownLoadInputStream", calcId.toString(), url, e);
        }
        return idList;
    }

    /**
     * Crowd check ready boolean.
     *
     * @param calcId the calc id
     * @return the boolean
     * @throws Exception the exception
     */
    public boolean crowdCheckReady(Integer calcId) throws Exception {
        logger.info("check crowd start,calcId:" + calcId);
        Integer calcStatus = crowdDownloadCheck(calcId);
        if (calcStatus == null) {
            throw new Exception("check crowd,calcStatus fail. calcId:" + calcId + " crowd calc status is null");
        }
        logger.info("check crowd, calcId:" + calcId + " calc status:" + calcStatus);
        if (CrowdCalcStatus.STATUS_FINISH == calcStatus) {
            logger.info("check crowd, calcId:" + calcId + " done.");
            return true;
        }
        if (!(CrowdCalcStatus.STATUS_IN_PROGRESS == calcStatus)) {
            throw new Exception("check crowd fail. calcId:" + calcId + " crowd calc status:" + calcStatus);
        }
        return false;
    }

    /**
     * Gets crowd download url.
     *
     * @param calcId the calc id
     * @return the crowd download url
     */
    public String getCrowdDownloadUrl(Integer calcId) {
        String rootUrl = getRootUrl();
        return rootUrl + String.format(crowdDownloadApi, calcId);
    }

    /**
     * Gets event mapping.
     *
     * @return the event mapping
     */
    public Map<String, String> getEventMapping() {
        String rootUrl = getRootUrl();
        String url = rootUrl + String.format(eventMappingApi, PushConstants.PUSH_LOG_TABLE, "event_type");
        Map<String, String> m;
        try {
            m = httpClientService.getMap(url);
        } catch (Exception e) {
            apiLog.printThirdApiLog("CrowdApi", "getEventMapping", url, "", e);
            return null;
        }
        return m;
    }

    /**
     * Create all sub crowd list.
     *
     * @param segmentName the segment name
     * @param userCloudId the user cloud id
     * @param pushMetrics the push metrics
     * @return the list
     */
    public List<CrowdInfoResp> createAllSubCrowd(String segmentName, Integer userCloudId, PushMetric... pushMetrics) throws IOException {
        eventMapping = getEventMapping();
        if (eventMapping == null) {
            logger.error("can not load event mapping,need contract to user cloud,userCloudId:" + userCloudId);
            return new ArrayList();
        }
        //为了拿到租户ID和账户ID类型
        CrowdInfoResp resp = getCrowdInfo(userCloudId);
        logger.info("crowd:touchPointType:" + resp.getTouchPointType() + ",tenantId:" + resp.getTenantId() + ",userCloudId:" + userCloudId);
        List<CrowdInfoResp> respList = new ArrayList();
        for (PushMetric pushMetric : pushMetrics) {
            String subCrowdName = String.format("%s-%s", segmentName, parseName(pushMetric.getValue()));
            String k = String.format("%s-%s-%s", resp.getTenantId(), resp.getTouchPointType(), pushMetric.getValue());
            String eventCode = eventMapping.get(k);
            if (eventCode == null) {
                continue;
            }
            Definition definition = DefinitionBuilder.buildDefinition(resp, eventCode);
            CrowdInfoResp r = createSubCrowd(userCloudId, subCrowdName, definition);
            if (r == null) {
                continue;
            }
            respList.add(r);
        }
        if (respList.size() == 0) {
            logger.error("respList.size() == 0,eventMapping:" + eventMapping);
        }
        return respList;
    }

    private String parseName(String name) {
        if (PushConstants.PUSH_SENT.contains(name)) {
            return "发送人群";
        }
        if (PushConstants.PUSH_CLICK.contains(name)) {
            return "点击人群";
        }
        if (PushConstants.PUSH_ARRIVALED.contains(name)) {
            return "到达人群";
        }
        if (PushConstants.PUSH_IMPRESSIONS.contains(name)) {
            return "展示人群";
        }
        return name;
    }

    /**
     * Create sub crowd crowd info resp.
     *
     * @param parentId   the parent id
     * @param name       the name
     * @param definition the definition
     * @return the crowd info resp
     */
    public CrowdInfoResp createSubCrowd(Integer parentId, String name, Definition definition) throws JsonProcessingException {
        String rootUrl = getRootUrl();
        String url = rootUrl + createSubCrowdApi;
        Map<String, Object> m = new HashMap(16);
        m.put("name", name);
        m.put("definition", definition);
        m.put("parentId", parentId.toString());
        CrowdInfoResp resp;
        try {
            resp = HttpClientUtil.post(url, m, CrowdInfoResp.class);
        } catch (Exception e) {
            apiLog.printThirdApiLog("CrowdApi", "createSubCrowd", url, JsonUtil.toJson(m), e);
            return null;
        }
        logger.info("createSubCrowd response:" + JsonUtil.toJson(resp));
        return resp;
    }

    /**
     * 保存版本人群数据
     *
     * @param crowdId 人群ID
     * @param version 版本号
     * @return true表示成功 ，false表示失败
     */
    public boolean snapshotCrowd(Integer crowdId, String version) {
        logger.info("[SNAPSHOT_CROWD]=========保存版本人群开始=============");
        logger.info("[SNAPSHOT_CROWD]入参：crowdId is {}, version is {}", String.valueOf(crowdId), version);
        String url = getRootUrl() + String.format(SNAPSHOT_CROWD_URL, String.valueOf(crowdId) + "," + version);
        logger.info("[SNAPSHOT_CROWD]调用URL IS : {}", url);
        Map<Integer, String> result = null;
        try {
            result = HttpClientUtil.post(url, "", Map.class);
            logger.info("[SNAPSHOT_CROWD]调用结果：{}", result.toString());
        } catch (Exception e) {
            logger.error("[SNAPSHOT_CROWD]保存版本人群发生异常", e);
            return false;
        } finally {
            logger.info("[SNAPSHOT_CROWD]=========保存版本人群结束=============");
        }
        final String successResult = "0";
        if (result.containsKey(successResult)) {
            return true;
        }
        return false;
    }

    /**
     * 将对应人群的offset保存至hdfs
     *
     * @param pipelineId     the pipeline id
     * @param crowdIds       the crowd ids
     * @param crowdRefId     the crowd ref id
     * @param idTypeCode     the id type code
     * @param hdfsOffsetPath the hdfs offset path
     * @param hdfsTablePath  the hdfs table path
     * @return string string
     */
    public String writeOffsetToHdfs(String pipelineId, String crowdIds, String crowdRefId, String idTypeCode, String hdfsOffsetPath,
        String hdfsTablePath) {
        String rootUrl = getRootUrl();
        String url = "";
        try {
            url = rootUrl + String.format(writeOffsetToHdfs, URLEncoder.encode(pipelineId, "UTF-8"), URLEncoder.encode(crowdIds, "UTF-8"),
                URLEncoder.encode(crowdRefId, "UTF-8"), URLEncoder.encode(idTypeCode, "UTF-8"), URLEncoder.encode(hdfsOffsetPath, "UTF-8"),
                URLEncoder.encode(hdfsTablePath, "UTF-8"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String resp;
        try {
            resp = HttpClientUtil.get(url);
        } catch (Exception e) {
            apiLog.printThirdApiLog("CrowdApi", "writeOffsetToHdfs", url, "", e);
            return null;
        }
        return resp;
    }

    /**
     * Gets download file stream.
     * 转换为zip file stream
     *
     * @param calcId the calc id
     * @return the download file stream
     * @throws IOException the io exception
     */
    public ZipInputStream getDownloadFileStream(Integer calcId) throws IOException {
        HttpGet httpget = new HttpGet(getCrowdDownloadUrl(calcId));
        InputStream inputStream = null;
        ZipInputStream zipInputStream = null;
        CloseableHttpClient httpclient = HttpClientBuilder.create().build();
        try {
            inputStream = httpclient.execute(httpget).getEntity().getContent();
            if (null != inputStream) {
                zipInputStream = new ZipInputStream(inputStream);
            }
        } catch (Exception e) {
            apiLog.printThirdApiLog("CrowdApi", "getDownloadFileStream", calcId.toString(), JsonUtil.toJson(inputStream), e);
            return null;
        }
        return zipInputStream;
    }


/*    public Integer getCrowdDownloadCalcId(Integer crowdId, String tp) {
        String rootUrl = getRootUrl();
        String url = rootUrl + crowdDownloadNoticeApi;
        MultiValueMap <String, Object> param = new LinkedMultiValueMap <String, Object>();
        param.add("crowdId", crowdId);
        param.add("type", tp);
        String resp = null;
        try {
            resp = HttpClientUtil.post(url, param, "UTF-8");
        } catch (Exception e) {
            apiLog.printThirdApiLog("CrowdApi", "getCrowdDownloadCalcId", url, resp, e);
            return null;
        }
        Integer calcId = Integer.valueOf(resp);
        logger.info("getCrowdDownloadCalcId:" + calcId + " crowdId:" + crowdId + " tp:" + tp);
        return calcId;
    }*/

    /**
     * Gets crowd download notice with parameter.
     * List <Map <String, String>> metaObjectMapList
     *
     * @param crowdId the crowd id
     * @param tp      the tp
     * @param json    the json
     * @return the crowd download notice with parameter
     */
    public Integer getCrowdDownloadNoticeWithParameter(Integer crowdId, String tp, String json) {
        String url = getRootUrl() + crowdDownloadNoticeWithAttrApi + String.format("?crowdId=%d&type=%s", crowdId, tp);
        // String url = "http://172.23.6.7:8084" + crowdDownloadNoticeWithAttrApi + String.format("?crowdId=%d&type=%s", crowdId, tp);
        String resp;
        try {
            resp = HttpClientUtil.post(url, json, "UTF-8");
        } catch (Exception e) {
            apiLog.printThirdApiLog("CrowdApi", "getCrowdDownloadNoticeWithParameter", url, "", e);
            return null;
        }
        Integer calcId = Integer.valueOf(resp);
        logger.info("getCrowdDownloadCalcId:" + calcId + " crowdId:" + crowdId + " tp:" + tp);
        return calcId;
    }

}
