package td.enterprise.wanalytics.etl.util.azkaban;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.Header;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.message.BasicHeader;
import td.enterprise.wanalytics.etl.common.error.BusinessException;
import td.enterprise.wanalytics.etl.util.HttpClient;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.azkaban.entity.*;

import java.io.IOException;
import java.util.Map;


/**
 * @author tao.yang
 * @date 2015年7月6日
 */
@Slf4j
public class AzkabanRestUtil implements SchedulerService {

	/**
	 * azkaban url路径
	 */
	private String azkabanUrl;

	private String azkabanUserName;
	
	private String azkabanPassword;
	
	
	/**
	 * 登录,azkaban登录
	 * @return AzkabanLoginResponse
	 * @throws IOException 
	 * @throws BusinessException 
	 * @throws ClientProtocolException 
	 */
	public AzkabanLoginResponse login() throws BusinessException, IOException {
		String url = getAzkabanUrl() + "/?action=login&username=%s&password=%s";
		url = String.format(url, getAzkabanUserName(), AzkabanPasswordBase64.encode(getAzkabanPassword()));
		Map<?, ?> returnMap = HttpClient.post(url, null, getHeaders(), Map.class);
		
		AzkabanLoginResponse response = new AzkabanLoginResponse();
		response.setSessionId((String) returnMap.get("session.id"));
		response.setStatus((String) returnMap.get("status"));
		log.info(response.getSessionId());
		log.info(response.getStatus());
		return response;
	}
	
	public AzkabanLoginResponse loginNotEncode() throws BusinessException, IOException {
		String url = getAzkabanUrl() + "/?action=login&username=%s&password=%s";
		url = String.format(url, getAzkabanUserName(), getAzkabanPassword());
		Map<?, ?> returnMap = HttpClient.post(url, null, getHeaders(), Map.class);
		
		AzkabanLoginResponse response = new AzkabanLoginResponse();
		response.setSessionId((String) returnMap.get("session.id"));
		response.setStatus((String) returnMap.get("status"));
		log.info(response.getSessionId());
		log.info(response.getStatus());
		return response;
	}

	/* (non-Javadoc)
	 * @see td.enterprise.batchmanager.core.service.azkaban.SchedulerService#executeCalculation(td.enterprise.batchmanager.core.service.azkaban.AzkabanExecuteFlowRequest)
	 */
	public AzkabanExecuteFlowResponse executeCalculation(AzkabanExecuteFlowRequest request) {
		AzkabanExecuteFlowResponse response = HttpClient.get(getAzkabanUrl(), request.parse(), AzkabanExecuteFlowResponse.class);
		return response;
	}
	
	public AzkabanCancelFlowResponse cancelCalculation(AzkabanCancelFlowRequest request) {
		AzkabanCancelFlowResponse response = HttpClient.get(getAzkabanUrl(), request.parse(), AzkabanCancelFlowResponse.class);
		return response;
	}

    /* (non-Javadoc)
     * @see SchedulerService#fetchExecFlow(AzkabanFetchExecFlowRequest)
     */
    public AzkabanFetchExecFlowResponse fetchExecFlow(AzkabanFetchExecFlowRequest request) {
    	AzkabanFetchExecFlowResponse response = HttpClient.get(getAzkabanUrl(), request.parse(), AzkabanFetchExecFlowResponse.class);
	    return response;
    }
    
	public AzkabanCreateProjectResponse createProject(AzkabanCreateProjectRequest request) throws BusinessException, IOException {
		AzkabanCreateProjectResponse response = HttpClient.post(getAzkabanUrl() + request.parse(), null, getHeaders(), AzkabanCreateProjectResponse.class);
		return response;
	}
	
	public AzkabanDeleteProjectResponse deleteProject(AzkabanDeleteProjectRequest request) {
		AzkabanDeleteProjectResponse response = HttpClient.get(getAzkabanUrl(), request.parse(), AzkabanDeleteProjectResponse.class);
		return response;
	}
	
	public AzkabanUploadProjectZipResponse uploadJobZip(AzkabanUploadProjectZipRequest request) throws Exception {
		AzkabanUploadProjectZipResponse response = request.post(getAzkabanUrl(),AzkabanUploadProjectZipResponse.class);
		return response;
	}
	
	public AzkabanScheduleFlowResponse scheduleJob(AzkabanScheduleFlowRequest request) {
		AzkabanScheduleFlowResponse response = HttpClient.get(getAzkabanUrl() , request.parse(), AzkabanScheduleFlowResponse.class);
		return response;
	}

	public AzkabanFetchRunningFlowResponse fetchRunningFlow(AzkabanFetchRunningFlowRequest request) {
		AzkabanFetchRunningFlowResponse response = HttpClient.get(getAzkabanUrl() , request.parse(), AzkabanFetchRunningFlowResponse.class);
		return response;
	}
	
	public AzkabanFetchFlowsofProjectResponse fetchFlowsofProject(AzkabanFetchFlowsofProjectRequest request) {
		AzkabanFetchFlowsofProjectResponse response = HttpClient.get(getAzkabanUrl(), request.parse(), AzkabanFetchFlowsofProjectResponse.class);
		return response;
	}

	/**
	 * 调用azkaban任务
	 *
	 * @param paramMap
	 * @param project
	 * @param flow
	 * @return
	 */
	public String callAzkabanRestAPI(Map<String, Object> paramMap, String project, String flow) throws Exception {
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
	 * 获取 HttpEntity<Object>
	 * @return HttpEntity<Object>
	 */
	private Header[] getHeaders() {
		Header[] headers = new BasicHeader[3];
		headers[0] = new BasicHeader("Accept", "application/json");
		headers[1] = new BasicHeader("Content-Type", "application/x-www-form-urlencoded");
		headers[2] = new BasicHeader("X-Requested-With", "XMLHttpRequest");
		return headers;
	}
	
    public String getAzkabanUrl() {
		if (azkabanUrl == null || "".equals(azkabanUrl)){
			azkabanUrl = HttpUtil.getParamFromConfigServer("batchmanager.server.url");
			if (azkabanUrl.endsWith("/")){
				azkabanUrl = azkabanUrl.substring(0, azkabanUrl.length() -1);
			}
		}
		return azkabanUrl;
	}

	public String getAzkabanUserName() {
		if (azkabanUserName == null || "".equals(azkabanUserName)){
			azkabanUserName = HttpUtil.getParamFromConfigServer("batchmanager.server.username");
		}
		return azkabanUserName;
	}

	public String getAzkabanPassword() {
		if (azkabanPassword == null || "".equals(azkabanPassword)){
			azkabanPassword = HttpUtil.getParamFromConfigServer("batchmanager.server.passwd");
		}
		return azkabanPassword;
	}

}
