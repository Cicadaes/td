package com.talkingdata.marketing.core.middleware;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.google.common.reflect.TypeToken;
import com.talkingdata.marketing.core.config.UmConfig;
import com.talkingdata.marketing.core.entity.dto.AuditLogDto;
import com.talkingdata.marketing.core.entity.thirdmodel.config.ConfigPage;
import com.talkingdata.marketing.core.entity.thirdmodel.config.EmailServer;
import com.talkingdata.marketing.core.entity.thirdmodel.config.EmailTemplate;
import com.talkingdata.marketing.core.entity.thirdmodel.config.Param;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.util.HttpClientUtil;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author alibaba_auto_add
 * @author xiaoming.kang
 */
@Component
public class ConfigApi {
    private static final Logger logger = LoggerFactory.getLogger(ConfigApi.class);
    private static final String AUDIT_LOG_URL = "/admin/auditLogs";
    @Autowired
    private UmConfig umConfig;
    @Autowired
    private ApiLog apiLog;

    /**
     * 获取当前key对应的value
     *
     * @param paramKey
     * @param systemCode
     * @return
     */
    @Cacheable(value="getDefault",sync = true)
    public String getParam(String paramKey, String systemCode) {
        String res;
        String url = umConfig.getUrl() + "/admin/param?paramKey={paramKey}&systemCode={systemCode}";
        Map<String, Object> queryParam = new HashMap<>(16);
        queryParam.put("paramKey", paramKey);
        queryParam.put("systemCode", systemCode);
        try {
            String resp = HttpClientUtil.get(url, queryParam, "UTF-8");
            List<Param> params = JsonUtil.toObject(resp, new TypeReference<List<Param>>() {});
            if (params.size() == 0) {
                logger.warn("not found config,paramKey:"+paramKey);
                return null;
            }
            res = params.get(0).getParamValue();
        } catch (Exception e) {
            apiLog.printThirdApiLog("ConfigApi", "getParam", url, queryParam, e);
            return null;
        }
        return res;
    }

    @Cacheable(value="getDefault",sync = true)
    public EmailServer getEmailServerConfig(String code) {
        String url = umConfig.getUrl() + "/admin/emailServerConfigs?code={code}";
        Map<String, Object> queryParam = new HashMap<>(16);
        queryParam.put("code", code);
        EmailServer emailServer;
        try {
            String resp = HttpClientUtil.get(url, queryParam, "UTF-8");
            ConfigPage<EmailServer> emailServerConfigPage = JsonUtil.toObject(resp, new TypeReference<ConfigPage<EmailServer>>() {
            });
            emailServer = emailServerConfigPage.getRows().get(0);
        } catch (Exception e) {
            apiLog.printThirdApiLog("ConfigApi", "getEmailServerConfig", url, queryParam, e);
            return null;
        }
        return emailServer;
    }

    @Cacheable(value="getDefault",sync = true)
    public EmailTemplate getEmailTemplate(String code) {
        EmailTemplate emailTemplate = null;
        String url = umConfig.getUrl() + "/admin/emailTemplates?code={code}";
        Map<String, Object> queryParam = new HashMap<>(16);
        queryParam.put("code", code);
        try {
            String resp = HttpClientUtil.get(url, queryParam, "UTF-8");
            ConfigPage<EmailTemplate> emailTemplateConfigPage = JsonUtil.toObject(resp, new TypeReference<ConfigPage<EmailTemplate>>() {
            });
            if(null != emailTemplateConfigPage && CollectionUtils.isNotEmpty(emailTemplateConfigPage.getRows())){
                emailTemplate = emailTemplateConfigPage.getRows().get(0);
            }
        } catch (Exception e) {
            apiLog.printThirdApiLog("ConfigApi", "getEmailTemplate", url, queryParam, e);
            return null;
        }
        return emailTemplate;
    }

    public void saveAuditLog(AuditLogDto auditLog) throws JsonProcessingException {
        String url = umConfig.getUrl() + AUDIT_LOG_URL;
        String resp =null;
        try {
            resp = HttpClientUtil.post(url, JsonUtil.toJson(auditLog), "UTF-8");
        } catch (Exception e) {
            apiLog.printThirdApiLog("ConfigApi", "saveAuditLog", url, auditLog, e);
        }
        logger.info("AuditLogDto:" + resp + " auditLog:" + JsonUtil.toJson(auditLog));
    }

}
