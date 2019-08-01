package td.enterprise.service.manager;

import com.tendcloud.enterprise.um.umic.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import td.enterprise.entity.AuditLog;
import td.enterprise.web.util.JsonUtils;
import td.enterprise.web.util.UserInfoUtil;

import javax.inject.Inject;

/**
 * Created by Yan on 2017/3/6.
 */
@Service
@Slf4j
public class SysAuditLogService {

    @Inject
    private RestTemplate restTemplate;

    @Value("${dmp-console-url}")
    private String dmpConsoleUrl;


    @Value("${systemcode}")
    private String systemcode;

    public void insertAuditLong(int projectId, String operationtype, String targettype, String targetId,
                                boolean result, String description, Object beforeObj, Object afterObj) {

        String postUrl = dmpConsoleUrl + "/auditLogs";

        User user = UserInfoUtil.getUser();
        AuditLog auditLog = new AuditLog();
        auditLog.setSystemCode(systemcode);
        auditLog.setTargetId(UserInfoUtil.getCurrentUserTenantId());
        auditLog.setProjectId(projectId + "");
        auditLog.setOperationType(operationtype);
        auditLog.setTargetType(targettype);
        auditLog.setTargetId(targetId);
        auditLog.setResult(result + "");
        auditLog.setDescription(description);
        try {
            auditLog.setBeforeValue(JsonUtils.objectToJsonStr(beforeObj));
            auditLog.setAfterValue(JsonUtils.objectToJsonStr(afterObj));
        } catch (Exception e) {
            e.printStackTrace();
        }
        auditLog.setActorUmId(user.getUmid());
        auditLog.setActorName(user.getName());

        try {
            HttpHeaders headers = new HttpHeaders();
            MediaType type = MediaType.parseMediaType("application/json; charset=UTF-8");
            headers.setContentType(type);
            headers.add("Accept", MediaType.APPLICATION_JSON.toString());
            HttpEntity <String> formEntity = new HttpEntity <String>(JsonUtils.objectToJsonStr(auditLog), headers);
            String restResult = restTemplate.postForObject(postUrl, formEntity, String.class);

            log.info("审计日志：" + JsonUtils.objectToJsonStr(auditLog) + "， 返回结果：" + restResult);

        } catch (Exception e) {
            log.error("查询dmp-console接口：" + postUrl + "出错，错误码：" + e.getMessage());
            e.printStackTrace();
        }
    }

}
