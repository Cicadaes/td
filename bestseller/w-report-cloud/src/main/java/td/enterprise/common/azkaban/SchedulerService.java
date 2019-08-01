package td.enterprise.common.azkaban;


import td.enterprise.common.azkaban.entity.AzkabanExecuteFlowRequest;
import td.enterprise.common.azkaban.entity.AzkabanExecuteFlowResponse;
import td.enterprise.common.azkaban.entity.AzkabanFetchExecFlowRequest;
import td.enterprise.common.azkaban.entity.AzkabanFetchExecFlowResponse;
import td.enterprise.common.exception.BusinessException;

public interface SchedulerService {

//	/**
//	 * 创建一个调度工程计算对象
//	 * @param request
//	 * @return AzkabanCreateResponse
//	 */
//	public AzkabanCreateResponse createCalculation(AzkabanCreateRequest request);

//	/**
//	 * 删除一个调度工程计算对象
//	 * @param request
//	 * @return AzkabanDeleteResponse
//	 */
//	public AzkabanDeleteResponse deleteCalculation(AzkabanDeleteRequest request);

//	/**
//	 * @param request
//	 * @return
//	 */
//	public AzkabanUploadResponse uploadCalculationZip(AzkabanUploadRequest request);
//
//	/**
//	 * 设置调度信息
//	 * @param request
//	 * @return
//	 */
//	public AzkabanScheduleFlowResponse scheduleCalculation(AzkabanScheduleFlowRequest request);
//
//	/**
//	 * 删除调度信息
//	 * /schedule?action=removeSched
//	 * @param request
//	 * @return
//	 */
//	public AzkabanRemoveSchedResponse removeCalculation(AzkabanRemoveSchedRequest request);
//

    /**
     * 执行计算
     *
     * @param request
     * @return
     * @throws Exception
     */
    AzkabanExecuteFlowResponse executeCalculation(AzkabanExecuteFlowRequest request) throws BusinessException;

//	/**
//	 * 暂停计算
//	 * @param request
//	 * @return AzkabanPauseFlowResponse
//	 */
//	public AzkabanPauseFlowResponse pauseCalculation(AzkabanPauseFlowRequest request);

//	/**
//	 * 恢复计算
//	 * @param request
//	 * @return AzkabanResumeFlowResponse
//	 */
//	public AzkabanResumeFlowResponse resumeCalculation(AzkabanResumeFlowRequest request);

//	/**
//	 * 取消计算
//	 * @param request
//	 * @return AzkabanCancelFlowResponse
//	 */
//	public AzkabanCancelFlowResponse cancelCalculation(AzkabanCancelFlowRequest request);

//	/**
//	 * @see CalculationAzkabanManager#fetchExecJobLogsCalculation(Integer, String)
//	 * @param request
//	 * @return
//	 */
//	@Deprecated
//	public AzkabanFetchExecJobLogsResponse fetchExecJobLogsCalculation(AzkabanFetchExecJobLogsRequest request);

    /**
     * @param request
     * @return
     */
    AzkabanFetchExecFlowResponse fetchExecFlow(AzkabanFetchExecFlowRequest request);

}
