package com.talkingdata.marketing.core.middleware;

import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.tag.AttributeTagResp;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.tag.TagResp;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.util.HttpClientUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Created by zmy on 9/6/2017.
 * @author xiaoming.kang
 */
@Component
public class TagApi {
    /**
     * The Tag api.
     * //自定义标签  聚合标签 算法标签
     */
    static String tagApi = "/dmp-rest/api/v4/tag/tags?rows=%d&tenantId=%s";
    /**
     * The Attribute tag api.
     * //属性标签
     */
    static String attributeTagApi = "/dmp-rest/api/v4/tag/baseTags?rows=%d&tenantId=%s";
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private ApiLog apiLog;
    @Autowired
    private CrowdApi crowdApi;

    /**
     * Find tag tag resp.
     *
     * @param tenantId the tenant id
     * @return the tag resp
     */
    public TagResp findTag(String tenantId) throws IOException {
        //todo 用户管家的测试环境被别的分支占用  暂时只用开发环境
        String rootUrl = crowdApi.getRootUrl("dev");
        String url = rootUrl + String.format(tagApi,Integer.MAX_VALUE,tenantId);
        ResponseEntity<String> exchange = null;
        String resp;
        try {
            resp = HttpClientUtil.get(url);
        } catch (Exception e) {
            apiLog.printThirdApiLog("TagApi", "findTag", url, "", e);
            return null;
        }
        logger.info("findEvents:" + resp);
        TagResp tagResp = null;
        if (!StringUtils.isEmpty(resp)){
            tagResp = JsonUtil.toObject(resp, TagResp.class);
        }
        return tagResp;
    }

    /**
     * Find attribute tag attribute tag resp.
     *
     * @param tenantId the tenant id
     * @return the attribute tag resp
     */
    public AttributeTagResp findAttributeTag(String tenantId) throws IOException {
        //todo 用户管家的测试环境被别的分支占用  暂时只用开发环境
        String rootUrl = crowdApi.getRootUrl("dev");
        String attributeUrl = rootUrl + String.format(attributeTagApi,Integer.MAX_VALUE,tenantId);
        ResponseEntity<String> attributeExchange = null;
        String attributeResp;
        try {
            attributeResp = HttpClientUtil.get(attributeUrl);
        } catch (Exception e) {
            apiLog.printThirdApiLog("TagApi", "findAttributeTag", attributeUrl, "", e);
            return null;
        }
        logger.info("findAttributeTag:" + attributeResp);
        AttributeTagResp attributeTagResp = null;
        if (!StringUtils.isEmpty(attributeResp)){
            attributeTagResp = JsonUtil.toObject(attributeResp, AttributeTagResp.class);
        }
        return attributeTagResp;
    }
}
