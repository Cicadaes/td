package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import td.enterprise.common.azkaban.AzkabanRestUtil;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.common.util.ExcelUtil;
import td.enterprise.common.util.JSONUtil;
import td.enterprise.dao.CrowdBlackListDao;
import td.enterprise.entity.*;
import td.enterprise.page.CrowdBlackListPage;
import td.enterprise.page.ProjectParamPage;
import td.enterprise.page.mapper.CrowdBlackListMapper;
import td.enterprise.service.DTO.FilterMacConfig;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.CrowdBlackListFilterVM;
import td.enterprise.web.vm.CrowdBlackListVM;
import td.enterprise.web.vm.CrowdBlackResultVM;

import javax.inject.Inject;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>人群黑名单 CrowdBlackListService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("crowdBlackListService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CrowdBlackListService extends BaseService<CrowdBlackList> {
    public final static Logger logger = Logger.getLogger(CrowdBlackListService.class);

    @Autowired
    private CrowdBlackListDao dao;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private ProjectAttachmentService attachmentService;
    @Autowired
    private ProjectParamService projectParamService;
    @Autowired
    private ParamService paramService;
    @Autowired
    private ProjectBatchConfigService projectBatchConfigService;
    @Autowired
    private CrowdBlackListMapper crowdBlackListMapper;
    @Inject
    private AzkabanRestUtil azkabanRestUtil;

    public CrowdBlackListDao getDao() {
        return dao;
    }

    /**
     * 通过参数和用户的tenantId获取黑名单
     *
     * @param page
     * @return
     */
    public List<CrowdBlackListVM> query(CrowdBlackListPage page) {
        //暂时不从user中取
//		User user = UserInfoUtil.getUser();
//		String tenantId = user.getTenantId().toString();
//		page.setTenantId(tenantId);

        List<CrowdBlackList> crowdBlackLists = queryByList(page);
        List<CrowdBlackListVM> crowdBlackListVMs = new ArrayList<>();

        for(CrowdBlackList crowdBlackList : crowdBlackLists){
            CrowdBlackListVM crowdBlackListVM = crowdBlackListMapper.entityToVM(crowdBlackList);
            crowdBlackListVMs.add(crowdBlackListVM);
        }
        return crowdBlackListVMs;
    }

    /**
     * 创建带用户信息的黑名单
     *
     * @param crowdBlackList
     * @return
     * @throws Exception
     */
    public CrowdBlackList create(CrowdBlackList crowdBlackList) throws Exception {
        User user = UserInfoUtil.getUser();
        crowdBlackList.setTenantId(UserInfoUtil.getCurrentUserTenantId());
        crowdBlackList.setCreateBy(user.getUmid());
        crowdBlackList.setCreator(user.getUmid());
        crowdBlackList.setStatus(1);
        crowdBlackList.setSource(ReportConstants.CrowdBlackListType.ADD_BY_HAND);
        dao.insert(crowdBlackList);
        return crowdBlackList;
    }

    /**
     * 根据规则过滤黑名单
     *
     * @param days
     * @param times
     * @param projectId
     * @return
     */
    public List<CrowdBlackResultVM> filterByRules(int days, int times, int projectId) {
        List<CrowdBlackResultVM> result = new ArrayList<>();
        CrowdBlackResultVM crowdBlackResult = new CrowdBlackResultVM();
        try {
            //更新配置信息
            projectService.updateBlackMacConfig(days, times, projectId);

//			List<Project> projectList = projectService.queryByList(page);
            Project project = projectService.selectByPrimaryKey(projectId);
            Map<String, Object> paramMap = null;
//			for(Project project : projectList){
            paramMap = new HashMap<>();
            paramMap.put("totalDays", days);
            paramMap.put("days", times);
            paramMap.put("projectId", projectId);
            try {
                azkabanRestUtil.callAzkabanRestAPI(paramMap, "FilterBlackMacTask", "FilterBlackMacTask");
                crowdBlackResult.setResult(true);
                crowdBlackResult.setProjectName(project.getProjectName());
                logger.info("项目id=" + project.getId().toString() + ",项目名称=" + project.getProjectName() + ",调用azkaban任务【成功】，按照规则过滤mac： 天数=" + days + " ,次数=" + times);
                result.add(crowdBlackResult);
            } catch (Exception e) {
                e.printStackTrace();
                crowdBlackResult.setResult(false);
                crowdBlackResult.setProjectName(project.getProjectName());
                logger.info("项目id=" + project.getId().toString() + ",项目名称=" + project.getProjectName() + ",调用azkaban任务【失败】，按照规则过滤mac： 天数=" + days + " ,次数=" + times);
                result.add(crowdBlackResult);
            }
//			}
        } catch (Exception e) {
            e.printStackTrace();
        }

        //更新批量设置阀值
        Project project = projectService.selectByPrimaryKey(projectId);
        ProjectBatchConfig projectBatchConfig = projectBatchConfigService.checkAndCreate(project);
        projectBatchConfig.setBlackList(ReportConstants.DefaultStatus.AVALIABLE + "");
        projectBatchConfigService.updateByProjectId(projectBatchConfig);
        return result;
    }

    /**
     * 批量导入黑名单
     *
     * @param file
     * @param projectId
     * @return
     * @throws Exception
     */
    public List<String> batchImport(MultipartFile file, String projectId) throws Exception {
        User user = UserInfoUtil.getUser();
        List<String> errMsgList = new ArrayList<>();
        String errorMsg = "";
        String tenantId = String.valueOf(UserInfoUtil.getCurrentUserTenantId());
        if (file != null) {
            logger.info("black.mac.batchImport.file=" + file.getOriginalFilename() + " ,size=" + file.getSize());
            InputStream is = file.getInputStream();

            String sheetName = "Sheet1";
            int startRowNum = 1;
            List<String[]> datas = ExcelUtil.readSheetDataByParam(is, sheetName, startRowNum);
            if (datas.size() == 0) {
                errMsgList.add("导入模板数据为空");
            }
            for (String[] strArray : datas) {
                if (strArray.length == 0 ||
                        strArray[0] == null) {  //mac ,为null，跳到下条记录
                    continue;
                }
                errorMsg = ExcelUtil.checkExcelMacValid(strArray[0]);
                if (!errorMsg.isEmpty()) {
                    logger.error(errorMsg);
                    errMsgList.add(errorMsg);
                }
            }
            if (errMsgList.size() == 0) {
                try {
                    ProjectAttachment attachment = attachmentService.addProjectAttachment(user.getUmid(), projectId, tenantId, file, 0);
                    //调用azkaban接口，启动任务
                    if (attachment != null) {
                        logger.info("调用azkaban接口，启动任务");
                        Map<String, Object> paramMap = new HashMap<>();
                        paramMap.put("a", attachment.getId().toString());
                        paramMap.put("p", attachment.getAttr2());
                        azkabanRestUtil.callAzkabanRestAPI(paramMap, "blackListSync", "blackListSync");
                    } else {
                        throw new BusinessException("创建attachment记录异常");
                    }
                } catch (Exception e) {
                    throw new BusinessException("黑名单导入异常", e);
                }
            }
        }
        return errMsgList;
    }

    /**
     * 获取项目黑名单过滤规则
     *
     * @param projectId
     * @return
     * @throws Exception
     */
    public CrowdBlackListFilterVM getProjectRules(String projectId) throws Exception {
        ProjectParamPage page = new ProjectParamPage();
        page.setProjectId(Integer.parseInt(projectId));
        page.setKey(ReportConstants.ProjectParamKey.FILTER_MAC_CONFIG);
        ProjectParam pp = projectParamService.queryBySingle(page);
        CrowdBlackListFilterVM config = new CrowdBlackListFilterVM();
        if (pp != null && pp.getValue() != null) {
            config.setFilterMacConfig((FilterMacConfig) JSONUtil.jsonToBean(pp.getValue(), FilterMacConfig.class));
        }

        //TODO filter.mac.config

        if (null == pp) {
            String configStr = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_FILTER_MAC_CONFIG).getParamValue();
            config.setFilterMacConfig((FilterMacConfig) JSONUtil.jsonToBean(configStr, FilterMacConfig.class));
        }

        //获取项目最长时长停留，超过了会被过滤掉
        page.setProjectId(Integer.parseInt(projectId));
        page.setKey(ReportConstants.ProjectParamKey.PROJECT_MAX_DURATION);
        pp = projectParamService.queryBySingle(page);
        if (null != pp) {
            config.setMaxDuration(Integer.parseInt(pp.getValue()));
        } else {
            String duration = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_PROJECT_MAX_DURATION).getParamValue();
            config.setMaxDuration(Integer.parseInt(duration));
        }
        return config;
    }
    
    /**
     * 批量导入文件
     *
     * @param projectId
     * @return
     * @throws Exception
     */
    @SuppressWarnings("unused")
	public List<String> batchImport(ProjectAttachment attachment, Integer projectId) throws Exception {
        User user = UserInfoUtil.getUser();
        List<String> errMsgList = new ArrayList<>();
        String errorMsg = "";
        String tenantId = String.valueOf(UserInfoUtil.getCurrentUserTenantId());
        String filePath = attachment.getAttr4();
        if (attachment != null && filePath != null) {
            logger.info("mac.batchImport.file=" + filePath);
            InputStream is = new FileInputStream(new File(filePath));;

            String sheetName = "Sheet1";
            int startRowNum = 1;
            List<String[]> datas = ExcelUtil.readSheetDataByParam(is, sheetName, startRowNum);
            if (datas.size() == 0) {
                errMsgList.add("导入模板数据为空");
            }
            for (String[] strArray : datas) {
                if (strArray.length == 0 ||
                        strArray[0] == null) {  //mac ,为null，跳到下条记录
                    continue;
                    
                }
                errorMsg = ExcelUtil.checkExcelMacValid(strArray[0]);
                if (!errorMsg.isEmpty()) {
                    logger.error(errorMsg);
                    errMsgList.add(errorMsg);
                } else {
            		CrowdBlackList crowdBlackList = new CrowdBlackList();
            		crowdBlackList.setProjectId(projectId);
            		crowdBlackList.setDeviceMac(strArray[0]);
            		crowdBlackList.setCreateBy(user.getUmid());
            		crowdBlackList.setCreator(user.getUmid());
            		crowdBlackList.setStatus(1);
            		crowdBlackList.setTenantId(UserInfoUtil.getCurrentUserTenantId());
            		crowdBlackList.setSource(ReportConstants.CrowdBlackListType.ADD_BY_BATCH_IMPORT);
                    dao.insert(crowdBlackList);
                }
            }
            
        }
        return errMsgList;
    }

}
