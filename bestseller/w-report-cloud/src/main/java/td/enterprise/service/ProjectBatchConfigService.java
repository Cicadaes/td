package td.enterprise.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.yaml.snakeyaml.util.UriEncoder;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.util.JSONUtil;
import td.enterprise.dao.ProjectBatchConfigDao;
import td.enterprise.entity.CustomLabelName;
import td.enterprise.entity.Project;
import td.enterprise.entity.ProjectBatchConfig;
import td.enterprise.entity.ProjectParam;
import td.enterprise.page.CustomLabelNamePage;
import td.enterprise.page.ProjectBatchConfigPage;
import td.enterprise.page.ProjectParamPage;
import td.enterprise.service.DTO.FilterMacConfig;
import td.enterprise.service.DTO.ThresholdValueDTO;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.CrowdBlackListFilterVM;
import td.enterprise.web.vm.ProjectBatchConfigVM;
import td.enterprise.web.vm.ProjectParamVM;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>批量设置 ProjectBatchConfigService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-19 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("projectBatchConfigService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectBatchConfigService extends BaseService <ProjectBatchConfig> {

    public final static Logger logger = Logger.getLogger(ProjectBatchConfigService.class);

    private final static String ALL_PARAM_KEYS = "PROJECT.THEME,PROJECT.THRESHOLDTIME.UNIT";//主题、时间单位

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectParamService projectParamService;

    @Autowired
    private CustomLabelNameService customLabelNameService;

    @Autowired
    private ParamService paramService;

    @Autowired
    private ProjectBatchConfigDao dao;

    public ProjectBatchConfigDao getDao() {
        return dao;
    }

    /**
     * 初始化并查询
     *
     * @param page
     * @return
     * @throws Exception
     */
    public List <ProjectBatchConfig> query(ProjectBatchConfigPage page) throws Exception {
        if (page.getQ() != null && StringUtils.isNotBlank(page.getQ())) {
            page.setQ(UriEncoder.decode(page.getQ()));
        }

        //权限
        Map <String, Project> allPermissionProject = projectService.findAllPermissionProject();
        List <String> allPermissionProjects = new ArrayList <>(allPermissionProject.keySet());

        //分页查询权限项目
        page.setProjectIds(allPermissionProjects);
        List <ProjectBatchConfig> rows = queryByListWithProjectIds(page);

        //补数（后期可删）
        page.setPageEnabled(false);
        List <ProjectBatchConfig> all = queryByListWithProjectIds(page);

        if (all.size() < allPermissionProject.size()) {
            for (Map.Entry <String, Project> stringProjectEntry : allPermissionProject.entrySet()) {
                checkAndCreate(stringProjectEntry.getValue());
            }
            page.setPageEnabled(true);
            rows = queryByListWithProjectIds(page);
        }
        return rows;
    }

    /**
     * 检查某个项目是否有默认设置，并创建
     *
     * @param project
     * @return
     */
    public ProjectBatchConfig checkAndCreate(Project project) {

        ProjectBatchConfig projectBatchConfig = new ProjectBatchConfig();
        if (project != null && project.getId() != null) {
            ProjectBatchConfigPage page = new ProjectBatchConfigPage();
            page.setProjectId(project.getId() + "");
            List <ProjectBatchConfig> projectBatchConfigs = dao.queryByList(page);
            if (projectBatchConfigs == null || projectBatchConfigs.size() != 1) {
                if (projectBatchConfigs != null && projectBatchConfigs.size() > 1) {
                    for (ProjectBatchConfig pbc : projectBatchConfigs) {
                        dao.deleteByPrimaryKey(pbc.getId());
                    }
                }
                projectBatchConfig.setProjectId(project.getId() + "");
                projectBatchConfig.setProjectName(project.getProjectName());
                projectBatchConfig.setProjectNum(project.getProjectNum());
                projectBatchConfig.setCity(project.getCity());
                projectBatchConfig.setCustomLabel(ReportConstants.DefaultStatus.DEFAULT + "");
                projectBatchConfig.setBlackList(ReportConstants.DefaultStatus.DEFAULT + "");
                projectBatchConfig.setThresholdValue(ReportConstants.DefaultStatus.DEFAULT + "");
                projectBatchConfig.setTheme(ReportConstants.DefaultStatus.DEFAULT + "");
                User user = UserInfoUtil.getUser();
                projectBatchConfig.setCreateBy(user.getUmid());
                projectBatchConfig.setCreator(user.getName());
                projectBatchConfig.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
                insert(projectBatchConfig);
            } else {
                projectBatchConfig = projectBatchConfigs.get(0);
            }
            logger.info(projectBatchConfig.toString());
        }

        return projectBatchConfig;
    }

    /**
     * 通过项目ID更新批量设置值
     *
     * @param projectBatchConfig
     * @return
     */
    public int updateByProjectId(ProjectBatchConfig projectBatchConfig) {
        int update = 0;
        if (projectBatchConfig != null && projectBatchConfig.getProjectId() != null) {
            User user = UserInfoUtil.getUser();
            projectBatchConfig.setUpdateBy(user.getUmid());
            projectBatchConfig.setUpdater(user.getName());
            update = dao.updateByProjectId(projectBatchConfig);
        }
        return update;
    }

    /**
     * 批量获取项目设置详情
     *
     * @param projectIds
     * @return
     * @throws Exception
     */
    public List <ProjectBatchConfigVM> getBatchConfigDetail(String projectIds) throws Exception {
        String[] projectIdArr = projectIds.split("&");
        List <ProjectBatchConfigVM> projectBatchConfigVMs = new ArrayList <>();
        User user = UserInfoUtil.getUser();

        //默认标签
        CustomLabelNamePage customLabelNamePage = new CustomLabelNamePage();
        customLabelNamePage.setStatus(ReportConstants.DefaultStatus.DEFAULT + "");
        customLabelNamePage.setPageEnabled(false);
        List <CustomLabelName> defaultCustomLabelNames = customLabelNameService.queryByList(customLabelNamePage);
        if (null == defaultCustomLabelNames) {
            logger.info("未获取到默认标签！");
            defaultCustomLabelNames = new ArrayList <>();
        }

        for (String projectIdStr : projectIdArr) {
            int projectId = Integer.parseInt(projectIdStr);
            ProjectBatchConfigVM projectBatchConfigVM = new ProjectBatchConfigVM();

            //项目信息
            Project project = projectService.selectByPrimaryKey(projectId);
            projectBatchConfigVM.setProjectId(projectId + "");
            projectBatchConfigVM.setProjectName(project.getProjectName());
            projectBatchConfigVM.setProjectNum(project.getProjectNum());
            //城市
            projectBatchConfigVM.setCity(project.getCity());

            //自定义标签
            customLabelNamePage.setProjectId(projectId + "");
            customLabelNamePage.setStatus(ReportConstants.DefaultStatus.AVALIABLE + "");
            List <CustomLabelName> customLabelNames = customLabelNameService.queryByList(customLabelNamePage);
            if (null == customLabelNames) {
                customLabelNames = new ArrayList <>();
            }
            for (CustomLabelName defaultCustomLabelName : defaultCustomLabelNames) {
                String defaultLabel = defaultCustomLabelName.getLabel();
                boolean flag = false;
                for (CustomLabelName customLabelName : customLabelNames) {
                    String label = customLabelName.getLabel();
                    if (defaultLabel.equals(label)) {
                        flag = true;
                    }
                }
                if (!flag) {
                    defaultCustomLabelName.setStatus(ReportConstants.DefaultStatus.AVALIABLE + "");
                    customLabelNames.add(defaultCustomLabelName);
                }
            }
            Map <String, String> customLabelData = new HashMap <>();
            for (CustomLabelName customLabelName : customLabelNames) {
                customLabelData.put(customLabelName.getLabel(), customLabelName.getName());
            }
            projectBatchConfigVM.setCustomLabelData(customLabelData);

            //黑名单、阀值、主题
            ProjectParamPage projectParamPage = new ProjectParamPage();
            projectParamPage.setProjectId(projectId);
            List <ProjectParam> result = projectParamService.queryByList(projectParamPage);
            CrowdBlackListFilterVM crowdBlackListVM = new CrowdBlackListFilterVM();
            ThresholdValueDTO thresholdValueDTO = new ThresholdValueDTO();
            String themeData = "";

            //检查
            boolean filterMacConfigFlag = false;
            boolean maxDurationFlag = false;
            boolean activeUserVisitMinutesFlag = false;
            boolean projectStayUserMinutesFlag = false;
            boolean projectTimeoutMinutesFlag = false;
            boolean projectThresholdtimeUnitFlag = false;
            boolean projectStaytimedistributionUnitFlag = false;
            boolean themeDataFlag = false;
            for (ProjectParam projectParam : result) {
                String value = projectParam.getValue();

                if (projectParam.getKey().equalsIgnoreCase(ReportConstants.ProjectParamKey.FILTER_MAC_CONFIG)) {
                    if (StringUtils.isNotEmpty(value) && !value.equalsIgnoreCase("null")) {
                        crowdBlackListVM.setFilterMacConfig((FilterMacConfig) JSONUtil.jsonToBean(value, FilterMacConfig.class));
                        filterMacConfigFlag = true;
                    }
                } else if (projectParam.getKey().equalsIgnoreCase(ReportConstants.ProjectParamKey.PROJECT_MAX_DURATION)) {
                    if (StringUtils.isNotEmpty(value) && !value.equalsIgnoreCase("null")) {
                        crowdBlackListVM.setMaxDuration(Integer.parseInt(value));
                        maxDurationFlag = true;
                    }
                } else if (projectParam.getKey().equalsIgnoreCase(ReportConstants.ProjectParamKey.ACTIVE_USER_VISIT_MINUTES)) {
                    if (StringUtils.isNotEmpty(value) && !value.equalsIgnoreCase("null")) {
                        thresholdValueDTO.setActiveUserVisitMinutes(Integer.parseInt(value));
                        activeUserVisitMinutesFlag = true;
                    }
                } else if (projectParam.getKey().equalsIgnoreCase(ReportConstants.ProjectParamKey.PROJECT_STAY_USER_MINUTES)) {
                    if (StringUtils.isNotEmpty(value) && !value.equalsIgnoreCase("null")) {
                        thresholdValueDTO.setProjectStayUserMinutes(Integer.parseInt(value));
                        projectStayUserMinutesFlag = true;
                    }
                } else if (projectParam.getKey().equalsIgnoreCase(ReportConstants.ProjectParamKey.PROJECT_STAY_TIMEOUT_MINUTES)) {
                    if (StringUtils.isNotEmpty(value) && !value.equalsIgnoreCase("null")) {
                        thresholdValueDTO.setProjectTimeoutMinutes(Integer.parseInt(value));
                        projectTimeoutMinutesFlag = true;
                    }
                } else if (projectParam.getKey().equalsIgnoreCase(ReportConstants.ProjectParamKey.PROJECT_THRESHOLDTIME_UNIT)) {
                    if (StringUtils.isNotEmpty(value) && !value.equalsIgnoreCase("null")) {
                        thresholdValueDTO.setThresholdTimeUnit(Integer.parseInt(value));
                        projectThresholdtimeUnitFlag = true;
                    }
                } else if (projectParam.getKey().equalsIgnoreCase(ReportConstants.ProjectParamKey.PROJECT_STAYTIMEDISTRIBUTION_UNIT)) {
                    if (StringUtils.isNotEmpty(value) && !value.equalsIgnoreCase("null")) {
                        thresholdValueDTO.setStayTimeDistributionUnit(Integer.parseInt(value));
                        projectStaytimedistributionUnitFlag = true;
                    }
                } else if (projectParam.getKey().equalsIgnoreCase(ReportConstants.ProjectParamKey.PROJECT_THEME)) {
                    if (StringUtils.isNotEmpty(value) && !value.equalsIgnoreCase("null")) {
                        themeData = value;
                        themeDataFlag = true;
                    }
                }
            }
            //保存
            if (!filterMacConfigFlag) {
                String value = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_FILTER_MAC_CONFIG).getParamValue();
                ProjectParam projectParamNew = ProjectService.getProjectParam(user.getUmid(), project, ReportConstants.ProjectParamDesc.FILTER_MAC_CONFIG_DESC, ReportConstants.ProjectParamKey.FILTER_MAC_CONFIG, value);
                projectParamService.insert(projectParamNew);
                crowdBlackListVM.setFilterMacConfig((FilterMacConfig) JSONUtil.jsonToBean(value, FilterMacConfig.class));
            }
            if (!maxDurationFlag) {
                String value = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_PROJECT_MAX_DURATION).getParamValue();
                ProjectParam projectParamNew = ProjectService.getProjectParam(user.getUmid(), project, ReportConstants.ProjectParamDesc.PROJECT_MAX_DURATION_DESC, ReportConstants.ProjectParamKey.PROJECT_MAX_DURATION, value);
                projectParamService.insert(projectParamNew);
                crowdBlackListVM.setMaxDuration(Integer.parseInt(value));
            }
            if (!activeUserVisitMinutesFlag) {
                String value = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_ACTIVE_USER_VISIT_MINUTES).getParamValue();
                ProjectParam projectParamNew = ProjectService.getProjectParam(user.getUmid(), project, ReportConstants.ProjectParamDesc.ACTIVE_USER_VISIT_MINUTES_DESC, ReportConstants.ProjectParamKey.ACTIVE_USER_VISIT_MINUTES, value);
                projectParamService.insert(projectParamNew);
                thresholdValueDTO.setActiveUserVisitMinutes(Integer.parseInt(value));
            }
            if (!projectStayUserMinutesFlag) {
                String value = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_PROJECT_STAY_USER_MINUTES).getParamValue();
                ProjectParam projectParamNew = ProjectService.getProjectParam(user.getUmid(), project, ReportConstants.ProjectParamDesc.PROJECT_STAY_USER_MINUTES_DESC, ReportConstants.ProjectParamKey.PROJECT_STAY_USER_MINUTES, value);
                projectParamService.insert(projectParamNew);
                thresholdValueDTO.setProjectStayUserMinutes(Integer.parseInt(value));
            }
            if (!projectTimeoutMinutesFlag) {
                String value = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_PROJECT_STAY_TIMEOUT_MINUTES).getParamValue();
                ProjectParam projectParamNew = ProjectService.getProjectParam(user.getUmid(), project, ReportConstants.ProjectParamDesc.PROJECT_STAY_TIMEOUT_MINUTES_DESC, ReportConstants.ProjectParamKey.PROJECT_STAY_TIMEOUT_MINUTES, value);
                projectParamService.insert(projectParamNew);
                thresholdValueDTO.setProjectTimeoutMinutes(Integer.parseInt(value));
            }
            if (!projectThresholdtimeUnitFlag) {
                String value = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_PROJECT_THRESHOLDTIME_UNIT).getParamValue();
                ProjectParam projectParamNew = ProjectService.getProjectParam(user.getUmid(), project, ReportConstants.ProjectParamDesc.PROJECT_THRESHOLDTIME_UNIT_DESC, ReportConstants.ProjectParamKey.PROJECT_THRESHOLDTIME_UNIT, value);
                projectParamService.insert(projectParamNew);
                thresholdValueDTO.setThresholdTimeUnit(Integer.parseInt(value));
            }
            if (!projectStaytimedistributionUnitFlag) {
                String value = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_PROJECT_STAYTIMEDISTRIBUTION_UNIT).getParamValue();
                ProjectParam projectParamNew = ProjectService.getProjectParam(user.getUmid(), project, ReportConstants.ProjectParamDesc.PROJECT_STAYTIMEDISTRIBUTION_UNIT_DESC, ReportConstants.ProjectParamKey.PROJECT_STAYTIMEDISTRIBUTION_UNIT, value);
                projectParamService.insert(projectParamNew);
                thresholdValueDTO.setStayTimeDistributionUnit(Integer.parseInt(value));
            }
            if (!themeDataFlag) {
                String value = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_PROJECT_THEME).getParamValue();
                ProjectParam projectParamNew = ProjectService.getProjectParam(user.getUmid(), project, ReportConstants.ProjectParamDesc.PROJECT_THEME_DESC, ReportConstants.ProjectParamKey.PROJECT_THEME, value);
                projectParamService.insert(projectParamNew);
                themeData = value;
            }

            //设置
            projectBatchConfigVM.setCrowdBlackListData(crowdBlackListVM);
            projectBatchConfigVM.setThresholdValueData(thresholdValueDTO);
            projectBatchConfigVM.setThemeData(themeData);

            projectBatchConfigVMs.add(projectBatchConfigVM);
        }
        return projectBatchConfigVMs;
    }

    /**
     * 批量保存已修改的项目设置详情
     *
     * @param projectBatchConfigVM
     * @return
     * @throws Exception
     */
    public List <ProjectBatchConfig> setBatchConfig(ProjectBatchConfigVM projectBatchConfigVM) throws Exception {
        String projectIds = projectBatchConfigVM.getProjectId();
        String[] projectIdArr = projectIds.split("&");
        List <ProjectBatchConfig> projectBatchConfigs = new ArrayList <>();
        for (String projectIdStr : projectIdArr) {
            int projectId = Integer.parseInt(projectIdStr);
            Project project = projectService.selectByPrimaryKey(projectId);
            User user = UserInfoUtil.getUser();
            ProjectBatchConfig projectBatchConfig = checkAndCreate(project);

            //设置城市
            String city = projectBatchConfigVM.getCity();
            if (StringUtils.isNotBlank(city)) {
                project.setCity(city);
                projectService.updateByPrimaryKey(project);

                projectBatchConfig.setCity(city);
            }

            //设置自定义标签
            Map <String, String> customLabelData = projectBatchConfigVM.getCustomLabelData();
            boolean customLabelFlag = false;
            if (customLabelData != null) {
                for (Map.Entry <String, String> entry : customLabelData.entrySet()) {
                    CustomLabelNamePage customLabelNamePage = new CustomLabelNamePage();
                    customLabelNamePage.setProjectId(projectId + "");
                    customLabelNamePage.setLabel(entry.getKey());
                    CustomLabelName customLabelName = customLabelNameService.queryBySingle(customLabelNamePage);
                    if (customLabelName != null) {//数据库有
                        if (StringUtils.isNotEmpty(entry.getValue())) {
                            customLabelName.setName(entry.getValue());
                            customLabelNameService.updateByPrimaryKeySelective(customLabelName);//更新
                            customLabelFlag = true;
                        }
                    } else {//数据库没有
                        CustomLabelName customLabelNameNew = new CustomLabelName();
                        customLabelNameNew.setLabel(entry.getKey());

                        String name = null;
                        if (StringUtils.isNotEmpty(entry.getValue())) {
                            name = entry.getValue();//用户自定义
                        } else {
                            CustomLabelNamePage customLabelNamePageNew = new CustomLabelNamePage();
                            customLabelNamePageNew.setStatus(ReportConstants.DefaultStatus.DEFAULT + "");
                            customLabelNamePageNew.setLabel(entry.getKey());
                            CustomLabelName customLabelNameDefault = customLabelNameService.queryBySingle(customLabelNamePageNew);
                            if (customLabelNameDefault != null) {
                                name = customLabelNameDefault.getName();//默认值
                            }
                        }
                        customLabelNameNew.setName(name);

                        customLabelNameNew.setProjectId(projectId + "");
                        customLabelNameNew.setStatus(ReportConstants.DefaultStatus.AVALIABLE + "");
                        customLabelNameNew.setCreateBy(user.getUmid());
                        customLabelNameNew.setCreator(user.getUmid());
                        customLabelNameService.insert(customLabelNameNew);//新增
                    }
                }
            }
            if (customLabelFlag) {
                projectBatchConfig.setCustomLabel(ReportConstants.DefaultStatus.AVALIABLE + "");
            }

            //项目参数
            ProjectParamPage projectParamPage = new ProjectParamPage();
            projectParamPage.setProjectId(projectId);

            //设置黑名单
            CrowdBlackListFilterVM crowdBlackListData = projectBatchConfigVM.getCrowdBlackListData();
            if (crowdBlackListData != null) {
                boolean crowdBlackListFlag = false;
                projectParamPage.setKey(ReportConstants.ProjectParamKey.FILTER_MAC_CONFIG);
                ProjectParam param = projectParamService.queryBySingle(projectParamPage);
                FilterMacConfig filterMacConfig = (FilterMacConfig) JSONUtil.jsonToBean(param.getValue(), FilterMacConfig.class);
                boolean blackListFlag = false;
                if (crowdBlackListData.getFilterMacConfig() != null) {
                    if (crowdBlackListData.getFilterMacConfig().getTotalDays() != null) {
                        filterMacConfig.setTotalDays(crowdBlackListData.getFilterMacConfig().getTotalDays());
                        blackListFlag = true;
                    }
                    if (crowdBlackListData.getFilterMacConfig().getOccurenceNumber() != null) {
                        filterMacConfig.setOccurenceNumber(crowdBlackListData.getFilterMacConfig().getOccurenceNumber());
                        blackListFlag = true;
                    }
                    if (blackListFlag) {
                        String value = JSONUtil.objToJsonFormat(filterMacConfig);
                        param.setValue(value);
                        projectParamService.updateByPrimaryKey(param);
                        crowdBlackListFlag = true;
                    }
                }

                if (crowdBlackListData.getMaxDuration() != null) {
                    updateOrCreateProjectParam(projectParamPage, user, project, ReportConstants.ProjectParamDesc.PROJECT_MAX_DURATION_DESC, ReportConstants.ProjectParamKey.PROJECT_MAX_DURATION, crowdBlackListData.getMaxDuration() + "");
                    crowdBlackListFlag = true;
                }

                if (crowdBlackListFlag) {
                    projectBatchConfig.setBlackList(ReportConstants.DefaultStatus.AVALIABLE + "");
                }
            }

            //设置阀值
            ThresholdValueDTO thresholdValueData = projectBatchConfigVM.getThresholdValueData();
            if (thresholdValueData != null) {
                boolean thresholdFlag = false;
                Integer activeUserVisitMinutes = thresholdValueData.getActiveUserVisitMinutes();
                if (activeUserVisitMinutes != null) {
                    updateOrCreateProjectParam(projectParamPage, user, project, ReportConstants.ProjectParamDesc.ACTIVE_USER_VISIT_MINUTES_DESC, ReportConstants.ProjectParamKey.ACTIVE_USER_VISIT_MINUTES, activeUserVisitMinutes + "");
                    thresholdFlag = true;
                }
                Integer projectStayUserMinutes = thresholdValueData.getProjectStayUserMinutes();
                if (projectStayUserMinutes != null) {
                    updateOrCreateProjectParam(projectParamPage, user, project, ReportConstants.ProjectParamDesc.PROJECT_STAY_USER_MINUTES_DESC, ReportConstants.ProjectParamKey.PROJECT_STAY_USER_MINUTES, projectStayUserMinutes + "");
                    thresholdFlag = true;
                }
                Integer projectTimeoutMinutes = thresholdValueData.getProjectTimeoutMinutes();
                if (projectTimeoutMinutes != null) {
                    updateOrCreateProjectParam(projectParamPage, user, project, ReportConstants.ProjectParamDesc.PROJECT_STAY_TIMEOUT_MINUTES_DESC, ReportConstants.ProjectParamKey.PROJECT_STAY_TIMEOUT_MINUTES, projectTimeoutMinutes + "");
                    thresholdFlag = true;
                }
                Integer thresholdTimeUnit = thresholdValueData.getThresholdTimeUnit();
                if (thresholdTimeUnit != null) {
                    updateOrCreateProjectParam(projectParamPage, user, project, ReportConstants.ProjectParamDesc.PROJECT_THRESHOLDTIME_UNIT_DESC, ReportConstants.ProjectParamKey.PROJECT_THRESHOLDTIME_UNIT, thresholdTimeUnit + "");
                    thresholdFlag = true;
                }
                Integer stayTimeDistributionUnit = thresholdValueData.getStayTimeDistributionUnit();
                if (stayTimeDistributionUnit != null) {
                    updateOrCreateProjectParam(projectParamPage, user, project, ReportConstants.ProjectParamDesc.PROJECT_STAYTIMEDISTRIBUTION_UNIT_DESC, ReportConstants.ProjectParamKey.PROJECT_STAYTIMEDISTRIBUTION_UNIT, stayTimeDistributionUnit + "");
                    thresholdFlag = true;
                }

                if (thresholdFlag) {
                    projectBatchConfig.setThresholdValue(ReportConstants.DefaultStatus.AVALIABLE + "");
                }
            }

            //设置主题
            String themeData = projectBatchConfigVM.getThemeData();
            if (StringUtils.isNotEmpty(themeData)) {
                updateOrCreateProjectParam(projectParamPage, user, project, ReportConstants.ProjectParamDesc.PROJECT_THEME_DESC, ReportConstants.ProjectParamKey.PROJECT_THEME, themeData);
                projectBatchConfig.setTheme(ReportConstants.DefaultStatus.AVALIABLE + "");
            }

            //统一更新批量设置
            dao.updateByProjectId(projectBatchConfig);
            projectBatchConfigs.add(projectBatchConfig);
        }
        return projectBatchConfigs;
    }

    /**
     * 获取所有用户下有权限的项目参数
     *
     * @return
     * @throws Exception
     */
    public List <ProjectParamVM> getAllProjectParams() throws Exception {
        Map <String, Project> allPermissionProject = projectService.findAllPermissionProject();
        List <String> allPermissionProjects = new ArrayList <>(allPermissionProject.keySet());
        long end = System.currentTimeMillis();

        //方法一：可优化
        List <ProjectParamVM> projectParamVMS = new ArrayList <>();
        for (String projectId : allPermissionProjects) {
            ProjectParamVM projectParamVM = new ProjectParamVM();
            projectParamVM.setProjectId(projectId);
            String projectParams = getProjectParams(projectId, ALL_PARAM_KEYS);
            projectParamVM.setProjectParams(projectParams);
            projectParamVMS.add(projectParamVM);
        }

        //方法二：
        /**
         * 先从数据库查出所有有权限项目的所需参数（project left join projectParam），转换成对象VM
         * 查询出所需参数的默认值
         * 判断VM中的参数是否为空，若为空赋予默认值
         * 将补全的VM保存之数据库中（可批量）
         * 返回VM
         */

        return projectParamVMS;
    }

    /**
     * 批量获取项目参数
     *
     * @param projectId
     * @param paramKeys
     * @return
     * @throws Exception
     */
    public String getProjectParams(String projectId, String paramKeys) throws Exception {
        Map <String, Object> appConfig = new HashMap <>();
        String[] paramKeyArr = paramKeys.split(",");
        for (String paramKey : paramKeyArr) {
            String value = getProjectParam(projectId, paramKey);
            appConfig.put(paramKey, value);
        }

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonObject = "";
        try {
            jsonObject = objectMapper.writeValueAsString(appConfig);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }

    /**
     * 获取项目参数
     *
     * @param projectId
     * @return
     * @throws Exception
     */
    private String getProjectParam(String projectId, String paramKey) throws Exception {
        String paramValue = "";
        ProjectParamPage page = new ProjectParamPage();
        page.setProjectId(Integer.parseInt(projectId));
        page.setKey(paramKey);
        List <ProjectParam> projectParams = projectParamService.getDao().queryByList(page);
        if (projectParams == null || projectParams.size() == 0) {
            Project project = projectService.selectByPrimaryKey(projectId);
            User user = UserInfoUtil.getUser();
            if (paramKey.equals(ReportConstants.ProjectParamKey.PROJECT_THEME)) {
                paramValue = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_PROJECT_THEME).getParamValue();
                if (paramValue != null && StringUtils.isNotEmpty(paramValue) && project != null) {
                    ProjectParam projectParamNew = ProjectService.getProjectParam(user.getUmid(), project, ReportConstants.ProjectParamDesc.PROJECT_THEME_DESC, ReportConstants.ProjectParamKey.PROJECT_THEME, paramValue);
                    projectParamService.insert(projectParamNew);
                }
            } else if (paramKey.equals(ReportConstants.ProjectParamKey.PROJECT_THRESHOLDTIME_UNIT)) {
                paramValue = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_PROJECT_THRESHOLDTIME_UNIT).getParamValue();
                if (paramValue != null && StringUtils.isNotEmpty(paramValue) && project != null) {
                    ProjectParam projectParamNew = ProjectService.getProjectParam(user.getUmid(), project, ReportConstants.ProjectParamDesc.PROJECT_THRESHOLDTIME_UNIT_DESC, ReportConstants.ProjectParamKey.PROJECT_THRESHOLDTIME_UNIT, paramValue);
                    projectParamService.insert(projectParamNew);
                }
            } else if (paramKey.equals(ReportConstants.ProjectParamKey.PROJECT_STAYTIMEDISTRIBUTION_UNIT)) {
                paramValue = paramService.queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_PROJECT_STAYTIMEDISTRIBUTION_UNIT).getParamValue();
                if (paramValue != null && StringUtils.isNotEmpty(paramValue) && project != null) {
                    ProjectParam projectParamNew = ProjectService.getProjectParam(user.getUmid(), project, ReportConstants.ProjectParamDesc.PROJECT_STAYTIMEDISTRIBUTION_UNIT_DESC, ReportConstants.ProjectParamKey.PROJECT_STAYTIMEDISTRIBUTION_UNIT, paramValue);
                    projectParamService.insert(projectParamNew);
                }
            }
        } else {
            paramValue = projectParams.get(0).getValue();
        }

        return paramValue;
    }

    /**
     * 查询并创建或更新项目参数
     *
     * @param projectParamPage
     * @param user
     * @param project
     * @param desc
     * @param key
     * @param value
     */
    private void updateOrCreateProjectParam(ProjectParamPage projectParamPage, User user, Project project, String desc, String key, String value) {
        projectParamPage.setKey(key);
        ProjectParam param = projectParamService.queryBySingle(projectParamPage);
        if (param != null) {
            param.setValue(value);
            projectParamService.updateByPrimaryKey(param);
        } else {
            ProjectParam projectParam = ProjectService.getProjectParam(user.getUmid(), project, desc, key, value);
            projectParamService.insert(projectParam);
        }
    }

    private List <ProjectBatchConfig> queryByListWithProjectIds(ProjectBatchConfigPage page) {
        int count = dao.queryByListWithProjectIdsCount(page);
        page.getPager().setRowCount(count);
        List <ProjectBatchConfig> projectBatchConfigs = dao.queryByListWithProjectIds(page);
        return projectBatchConfigs;
    }

}
