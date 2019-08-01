package td.enterprise.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.constant.CommonConstants.ServiceInterfaceCallLogStatus;
import td.enterprise.dao.CrowdDao;
import td.enterprise.dao.ProjectDao;
import td.enterprise.dao.ServiceConfDao;
import td.enterprise.dao.ServiceInterfaceCallLogDao;
import td.enterprise.entity.Crowd;
import td.enterprise.entity.Project;
import td.enterprise.entity.ServiceConf;
import td.enterprise.entity.ServiceInterfaceCallLog;
import td.enterprise.page.ServiceInterfaceCallLogPage;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>服务接口调用日志 ServiceInterfaceCallLogService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("serviceInterfaceCallLogService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ServiceInterfaceCallLogService extends BaseService<ServiceInterfaceCallLog> {
    public final static Logger logger = Logger.getLogger(ServiceInterfaceCallLogService.class);

    @Autowired
    private ServiceConfDao serviceConfDao;

    @Autowired
    private ServiceInterfaceCallLogDao dao;

    @Autowired
    private ProjectDao projectDao;

    @Autowired
    private CrowdDao crowdDao;

    public ServiceInterfaceCallLogDao getDao() {
        return dao;
    }

    /**
     * 服务调用开始之前调用
     *
     * @return ServiceInterfaceCallLog
     */
    public ServiceInterfaceCallLog createServiceInterfaceCallLog(String serviceCode, String runDate, String tenantId, Integer projectId,
                                                                 Integer crowdId, Map<String, String> param, String azkabanExecId, String type) throws Exception {
        ServiceConf serviceConf = serviceConfDao.findServiceConfByCode(serviceCode);
        ServiceInterfaceCallLog serviceInterfaceCallLog = new ServiceInterfaceCallLog();
        serviceInterfaceCallLog.setServiceCode(serviceConf.getCode());
        serviceInterfaceCallLog.setServiceName(serviceConf.getName());
        serviceInterfaceCallLog.setType(type);
        serviceInterfaceCallLog.setAzkabanExecId(azkabanExecId);
        serviceInterfaceCallLog.setRunDate(runDate);
        serviceInterfaceCallLog.setTenantId(tenantId);
        Project project = projectDao.selectByPrimaryKey(projectId);
        if (null != project) {
            serviceInterfaceCallLog.setProjectName(project.getProjectName());
            serviceInterfaceCallLog.setProjectId(projectId);
            serviceInterfaceCallLog.setCrowdId(crowdId);
        }
        Crowd crowd = crowdDao.selectByPrimaryKey(crowdId);
        if (null != crowd) {
            serviceInterfaceCallLog.setCrowdName(crowd.getName());
            serviceInterfaceCallLog.setStartTime(new Date());
        }
        serviceInterfaceCallLog.setStatus(ServiceInterfaceCallLogStatus.INIT_STATUS);
        ObjectMapper mapper = new ObjectMapper();
        serviceInterfaceCallLog.setParam(mapper.writeValueAsString(param));

        dao.insert(serviceInterfaceCallLog);
        return serviceInterfaceCallLog;
    }

    /**
     * 服务调用成功,INVOKE_SERVICE_SUCCESS
     *
     * @param id
     * @param taskId
     */
    public void invokeServiceSuccess(Integer id, String taskId) {
        ServiceInterfaceCallLog serviceInterfaceCallLog = new ServiceInterfaceCallLog();
        serviceInterfaceCallLog.setId(id);
        serviceInterfaceCallLog.setTaskId(taskId);
        serviceInterfaceCallLog.setStatus(ServiceInterfaceCallLogStatus.INVOKE_SERVICE_SUCCESS);
        dao.updateByPrimaryKeySelective(serviceInterfaceCallLog);
    }

    /**
     * 服务调用成功,状态为：TASK_EXECUTE_SUCCESS INVOKE_DOWNLOAD_SUCCESS
     *
     * @param id
     * @param status
     */
    public void invokeServiceSuccess(Integer id, String taskId, int status) {
        ServiceInterfaceCallLog serviceInterfaceCallLog = new ServiceInterfaceCallLog();
        serviceInterfaceCallLog.setId(id);
        serviceInterfaceCallLog.setStatus(status);
        serviceInterfaceCallLog.setTaskId(taskId);
        serviceInterfaceCallLog.setFinishTime(new Date());
        dao.updateByPrimaryKeySelective(serviceInterfaceCallLog);
    }

    /**
     * 服务调用成功,状态为：TASK_EXECUTE_SUCCESS INVOKE_DOWNLOAD_SUCCESS
     *
     * @param id
     * @param status
     */
    public void invokeServiceSuccess(Integer id, int status) {
        ServiceInterfaceCallLog serviceInterfaceCallLog = new ServiceInterfaceCallLog();
        serviceInterfaceCallLog.setId(id);
        serviceInterfaceCallLog.setStatus(status);
        serviceInterfaceCallLog.setFinishTime(new Date());
        dao.updateByPrimaryKeySelective(serviceInterfaceCallLog);
    }

    /**
     * 服务调用失败, 状态为：INVOKE_SERVICE_EXCEPTION,TASK_EXECUTE_EXCEPTION,INVOKE_DOWNLOAD_EXCEPTION
     *
     * @param id
     * @param status
     * @param e
     */
    public void invokeServiceException(Integer id, int status, String taskId, Exception e) {
        ServiceInterfaceCallLog serviceInterfaceCallLog = new ServiceInterfaceCallLog();
        serviceInterfaceCallLog.setId(id);
        serviceInterfaceCallLog.setStatus(status);
        serviceInterfaceCallLog.setTaskId(taskId);
        serviceInterfaceCallLog.setErrorInfo(e.getMessage());
        serviceInterfaceCallLog.setFinishTime(new Date());
        dao.updateByPrimaryKeySelective(serviceInterfaceCallLog);
    }


    /**
     * 如果没有发生错误，那么记录正常运行的日志
     */
    public void invokeServiceInfoToLog(Integer id, String taskId, String info) {
        ServiceInterfaceCallLog serviceInterfaceCallLog = new ServiceInterfaceCallLog();
        serviceInterfaceCallLog.setId(id);

        ServiceInterfaceCallLog selectByPrimaryKey = dao.selectByPrimaryKey(id);
        String errorInfo = selectByPrimaryKey.getErrorInfo();
        if (errorInfo == null) {
            errorInfo = "";
        }
        serviceInterfaceCallLog.setErrorInfo(errorInfo + info + "<br>");
        serviceInterfaceCallLog.setFinishTime(new Date());
        dao.updateByPrimaryKeySelective(serviceInterfaceCallLog);
    }

    /**
     * 获取最后一次
     *
     * @return
     */
    public String getLastIDMappingTaskId(String runDate, String tenantId, Integer projectId,
                                         Integer crowdId, String azkabanExecId) {
        ServiceInterfaceCallLog serviceLog = new ServiceInterfaceCallLog();
        serviceLog.setRunDate(runDate);
        serviceLog.setTenantId(tenantId);
        serviceLog.setProjectId(projectId);
        serviceLog.setCrowdId(crowdId);
        serviceLog.setAzkabanExecId(azkabanExecId);
        ServiceInterfaceCallLog result = dao.getLastIDMappingTaskId(serviceLog);
        if (null != result) {
            String taskId = result.getTaskId();
            if (StringUtils.isNotEmpty(taskId)) {
                return taskId;
            }
        }
        logger.error("----------Get getLastIDMappingTaskId is null  runDate=" + runDate + "tenantId=" + tenantId + "projectId=" + projectId + "crowdId=" + crowdId + "azkabanExecId=" + azkabanExecId);
        return null;
    }

    /**
     * 查询列表
     *
     * @param page
     * @return
     */
    public List<ServiceInterfaceCallLog> queryByList(ServiceInterfaceCallLogPage page) {
        if (page.getStartTimeLong() != 0) {
            page.setBeginTime(new Date(page.getStartTimeLong()));
        }
        if (page.getFinishTimeLong() != 0) {
            page.setEndTime(new Date(page.getFinishTimeLong()));
        }
        int rowCount = dao.queryByCount(page);
        page.getPager().setRowCount(rowCount);
        List<ServiceInterfaceCallLog> list = dao.queryByList(page);
        return list;
    }
}
