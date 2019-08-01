package td.enterprise.common.azkaban;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.Header;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.message.BasicHeader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import td.enterprise.common.azkaban.entity.*;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.entity.Param;
import td.enterprise.service.manager.ParamService;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.io.IOException;
import java.util.Map;

/**
 * @author tao.yang
 * @date 2015年7月6日
 */
@Slf4j
@Component
public class AzkabanRestUtil implements SchedulerService {

    /**
     * azkaban url路径
     */
    private String azkabanUrl;

    private String azkabanUserName;

    private String azkabanPassword;

    @Autowired
    private ParamService paramService;

    @Inject
    private RestTemplate restTemplate;


    @PostConstruct
    public void init() {
        azkabanUrl = paramService.queryByParamKey(ParamConstants.BATCHMANAGER_SERVER_URL).getParamValue();
        azkabanUserName = paramService.queryByParamKey(ParamConstants.BATCHMANAGER_SERVER_USERNAME).getParamValue();
        azkabanPassword = paramService.queryByParamKey(ParamConstants.BATCHMANAGER_SERVER_PASSWD).getParamValue();
    }


    /**
     * 登录,azkaban登录
     *
     * @return AzkabanLoginResponse
     * @throws IOException
     * @throws BusinessException
     * @throws ClientProtocolException
     */
    public AzkabanLoginResponse login() {
        String url = azkabanUrl + "/?action=login&username=%s&password=%s";

        //判断调用azkaban是否加密
        Param param = paramService.queryByParamKey("batchmanager.server.passwd.encode");
        String paramValue = param.getParamValue();
        try {
            if("Y".equals(paramValue)){
                url = String.format(url, azkabanUserName, AzkabanPasswordBase64.encode(azkabanPassword));
            }else{
                url = String.format(url, azkabanUserName, azkabanPassword);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        Map<?, ?> returnMap = restTemplate.postForObject(url, getHeaders(), Map.class);

        AzkabanLoginResponse response = new AzkabanLoginResponse();
        response.setSessionId((String) returnMap.get("session.id"));
        response.setStatus((String) returnMap.get("status"));
        log.info(response.getSessionId());
        log.info(response.getStatus());
        return response;
    }

//    public AzkabanLoginResponse loginNotEncode() throws ClientProtocolException, BusinessException, IOException {
//        String url = azkabanUrl + "/?action=login&username=%s&password=%s";
//        url = String.format(url, azkabanUserName, azkabanPassword);
//        Map<?, ?> returnMap = restTemplate.postForObject(url, getHeaders(), Map.class);
//
//        AzkabanLoginResponse response = new AzkabanLoginResponse();
//        response.setSessionId((String) returnMap.get("session.id"));
//        response.setStatus((String) returnMap.get("status"));
//        log.info(response.getSessionId());
//        log.info(response.getStatus());
//        return response;
//    }

    /* (non-Javadoc)
     * @see td.enterprise.batchmanager.core.service.azkaban.SchedulerService#executeCalculation(td.enterprise.batchmanager.core.service.azkaban.AzkabanExecuteFlowRequest)
     */
    public AzkabanExecuteFlowResponse executeCalculation(AzkabanExecuteFlowRequest request) throws BusinessException {
        AzkabanExecuteFlowResponse response = restTemplate.getForObject(azkabanUrl + request.parse(), AzkabanExecuteFlowResponse.class);
        return response;
    }

    public AzkabanCancelFlowResponse cancelCalculation(AzkabanCancelFlowRequest request) {
        AzkabanCancelFlowResponse response = restTemplate.getForObject(azkabanUrl + request.parse(), AzkabanCancelFlowResponse.class, request.parse());
        return response;
    }

    /* (non-Javadoc)
     * @see td.enterprise.dmp.common.azkaban.SchedulerService#fetchExecFlow(td.enterprise.dmp.common.azkaban.entity.AzkabanFetchExecFlowRequest)
     */
    public AzkabanFetchExecFlowResponse fetchExecFlow(AzkabanFetchExecFlowRequest request) {
        AzkabanFetchExecFlowResponse response = restTemplate.getForObject(azkabanUrl + request.parse(), AzkabanFetchExecFlowResponse.class, request.parse());
        return response;
    }

//	public AzkabanCreateProjectResponse createProject(AzkabanCreateProjectRequest request) throws ClientProtocolException, BusinessException, IOException {
//		AzkabanCreateProjectResponse response = restTemplate.postForObject(azkabanUrl + request.parse(), null, getHeaders(), AzkabanCreateProjectResponse.class);
//		return response;
//	}

    public AzkabanDeleteProjectResponse deleteProject(AzkabanDeleteProjectRequest request) {
        AzkabanDeleteProjectResponse response = restTemplate.getForObject(azkabanUrl + request.parse(), AzkabanDeleteProjectResponse.class, request.parse());
        return response;
    }

    public AzkabanScheduleFlowResponse scheduleJob(AzkabanScheduleFlowRequest request) {
        AzkabanScheduleFlowResponse response = restTemplate.getForObject(azkabanUrl + request.parse(), AzkabanScheduleFlowResponse.class, request.parse());
        return response;
    }

    public AzkabanFetchRunningFlowResponse fetchRunningFlow(AzkabanFetchRunningFlowRequest request) {
        AzkabanFetchRunningFlowResponse response = restTemplate.getForObject(azkabanUrl + request.parse(), AzkabanFetchRunningFlowResponse.class, request.parse());
        return response;
    }

    public AzkabanFetchFlowsofProjectResponse fetchFlowsofProject(AzkabanFetchFlowsofProjectRequest request) {
        AzkabanFetchFlowsofProjectResponse response = restTemplate.getForObject(azkabanUrl + request.parse(), AzkabanFetchFlowsofProjectResponse.class, request.parse());
        return response;
    }


    /**
     * 获取 HttpEntity<Object>
     *
     * @return HttpEntity<Object>
     */
    private Header[] getHeaders() {
        Header[] headers = new BasicHeader[3];
        headers[0] = new BasicHeader("Accept", "application/json");
        headers[1] = new BasicHeader("Content-Type", "application/x-www-form-urlencoded");
        headers[2] = new BasicHeader("X-Requested-With", "XMLHttpRequest");
        return headers;
    }

    /**
     * 调用azkaban任务
     *
     * @param paramMap
     * @param project
     * @param flow
     * @return
     */
    public String callAzkabanRestAPI(Map<String, Object> paramMap, String project, String flow) throws BusinessException {
            String execId = "";
            AzkabanLoginResponse loginResponse = login();
            AzkabanExecuteFlowRequest request = new AzkabanExecuteFlowRequest();
            request.setFlowOverride(paramMap);
            request.setProject(project);
            request.setFlow(flow);
            request.setSessionId(loginResponse.getSessionId());
            AzkabanExecuteFlowResponse response = null;
            response = executeCalculation(request);
            if (response.failure() || "".equals(response.getExecid()) || response.getExecid() == null) {
                log.error(" 发起任务失败，error : " + response.getError() + " message : " + response.getMessage());
            } else {
                execId = response.getExecid();
            }
            return execId;

    }

    /**
     * 取消azkaban任务
     *
     * @param execid
     * @throws Exception
     */
    public boolean cancel(String execid) throws Exception {
        AzkabanCancelFlowResponse response = null;
        AzkabanRestUtil azkabanRestUtil = new AzkabanRestUtil();
        AzkabanCancelFlowRequest request = new AzkabanCancelFlowRequest();
        AzkabanLoginResponse loginResponse = azkabanRestUtil.login();
        request.setSessionId(loginResponse.getSessionId());
        request.setExecid(execid);
        boolean result = true;
        try {
            response = azkabanRestUtil.cancelCalculation(request);
            if (response.failure()) {
                result = false;
                throw new Exception("中止flow失败，execid=" + execid + " error : " + response.getError() + " message : " + response.getMessage());
            }
        } catch (Exception e) {
            throw new BusinessException("任务终止异常", e);
        }
        return result;
    }
}
