package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.ExtResource;
import com.tendcloud.enterprise.um.umic.entity.Role;
import com.tendcloud.enterprise.um.umic.entity.Tenant;
import com.tendcloud.enterprise.um.umic.entity.User;
import com.tendcloud.enterprise.um.umic.rmi.SecurityService;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.inject.Inject;
import javax.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.multipart.MultipartFile;
import org.yaml.snakeyaml.util.UriEncoder;
import td.enterprise.common.azkaban.AzkabanRestUtil;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.constant.SessionConstant;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.ExcelUtil;
import td.enterprise.common.util.JSONUtil;
import td.enterprise.common.util.OJDBCGetHaixin;
import td.enterprise.common.util.StringUtil;
import td.enterprise.dao.BsUserDao;
import td.enterprise.dao.ProjectDao;
import td.enterprise.entity.*;
import td.enterprise.entity.type.CrowdTypeEnum;
import td.enterprise.entity.type.ProjectTypeEnum;
import td.enterprise.page.CompeteAttributePage;
import td.enterprise.page.InstallInfoPage;
import td.enterprise.page.ProjectAttachmentPage;
import td.enterprise.page.ProjectAttributePage;
import td.enterprise.page.ProjectIndexPage;
import td.enterprise.page.ProjectPage;
import td.enterprise.page.ProjectParamPage;
import td.enterprise.page.ProjectRelationPage;
import td.enterprise.page.SensorPage;
import td.enterprise.page.mapper.ProjectMapper;
import td.enterprise.service.DTO.FilterMacConfig;
import td.enterprise.service.manager.ParamService;
import td.enterprise.service.manager.SysAuditLogService;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.CompeteProjectVM;
import td.enterprise.web.vm.ProjectAttributeVM;
import td.enterprise.web.vm.ProjectChildrenVM;
import td.enterprise.web.vm.ProjectDetailVM;
import td.enterprise.web.vm.ProjectIndexVM;
import td.enterprise.web.vm.ProjectLatLngVM;
import td.enterprise.web.vm.ProjectListVM;
import td.enterprise.web.vm.ProjectUserRelationVM;
import td.enterprise.web.vm.SensorDetailVM;

/**
 * <br> <b>功能：</b>项目 ProjectService<br> <b>作者：</b>code generator<br> <b>日期：</b> 2016-04-12 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Slf4j
@Service("projectService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ProjectService extends BaseService<Project> {

  public final static Logger logger = Logger.getLogger(ProjectService.class);

  private final String PROJECT = "Project";
  private final String ALL_PROJECT = "AllProject";
  private final String PROJECT_TYPE = "projectType";

  @Autowired
  private ProjectDao dao;

  @Autowired
  private BsUserDao bsUserDao;

  @Autowired
  private ProjectPlaceService projectPlaceService;

  @Autowired
  private InstallInfoService installInfoService;

  @Autowired
  private SensorService sensorService;

  @Autowired
  private ProjectParamService projectParamService;

  @Autowired
  private ProjectIndexService projectIndexService;

  @Autowired
  private ProjectRelationService projectRelationService;

  @Autowired
  private CrowdService crowdService;

  @Autowired
  private ProjectBatchConfigService projectBatchConfigService;

  @Autowired
  private ParamService paramService;

  @Autowired
  private ProjectAttachmentService attachmentService;

  @Autowired
  private RoomCategoryService roomCategoryService;

  @Autowired
  private RoomCategoryRelService roomCategoryRelService;

  @Inject
  private ProjectMapper projectMapper;

  @Autowired
  private ProjectAttributeService projectAttributeService;

  @Value("${appcode}")
  private String appCode;

  @Value("${apptaken}")
  private String appToken;

  @Inject
  private SysAuditLogService auditLogService;

  @Inject
  private AzkabanRestUtil azkabanRestUtil;

  @Autowired
  private CompeteSourceService competeSourceService;

  @Autowired
  private CompeteAttributeService competeAttributeService;

  @Autowired
  private ThresholdService thresholdService;


  public ProjectDao getDao() {
    return dao;
  }

  // 根据项目id返回单个项目的详情，并包含上游和下游名称
  public Project getSingleWithParentAndChildren(String projectId) {
    Project project = getDao().selectWithParentNameByPrimaryKey(projectId);
    if (project != null) {
      ProjectPage projectPage = new ProjectPage();
      projectPage.setId(Integer.valueOf(projectId));
      // 查询所有的子项目，并呈现
      List<Project> projectChildren = getDirectChildrenByParam(projectPage);
      StringBuffer buffer = new StringBuffer();
      for (Project tmp : projectChildren) {
        buffer.append(",").append(tmp.getProjectName());
      }

      // 有可能没有下游
      if (buffer.toString().length() > 1) {
        // 设置下游名称
        project.setProjectChildrenNames(buffer.toString().substring(1));
      }

      //            查询上游
      //            List <Project> projectParent =  dao.getParentProjectByParam(projectPage);
      //            if(projectParent!=null && projectParent.size()>0){
      //                // 设置下游名称
      //                project.setProjectParentName(projectParent.get(0).getProjectName());
      //            }

    }
    return project;
  }

  public List<BsUser> getBsUserByUserId(String userId) {
    Map<String, Object> map = new HashMap<String, Object>();
    map.put("userId", userId);
    List<BsUser> bsUserList = bsUserDao.queryListByUserId(map);
    return bsUserList;
  }

  public ProjectPage decodeUrl(ProjectPage page) {
    try {
      if (page.getProjectName() != null && StringUtils.isNotBlank(page.getProjectName())) {
        page.setProjectName(URLDecoder.decode(page.getProjectName(), "UTF8"));
      }
      if (page.getCity() != null && StringUtils.isNotBlank(page.getCity())) {
        page.setCity(URLDecoder.decode(page.getCity(), "UTF8"));
      }
      if (page.getBrand() != null && StringUtils.isNotBlank(page.getBrand())) {
        page.setBrand(URLDecoder.decode(page.getBrand(), "UTF8"));
      }
      if (page.getRegion() != null && StringUtils.isNotBlank(page.getRegion())) {
        page.setRegion(URLDecoder.decode(page.getRegion(), "UTF8"));
      }
      if (page.getProvince() != null && StringUtils.isNotBlank(page.getProvince())) {
        page.setProvince(URLDecoder.decode(page.getProvince(), "UTF8"));
      }
      if (page.getChannel() != null && StringUtils.isNotBlank(page.getChannel())) {
        page.setChannel(URLDecoder.decode(page.getChannel(), "UTF8"));
      }
      if (page.getMall() != null && StringUtils.isNotBlank(page.getMall())) {
        page.setMall(URLDecoder.decode(page.getMall(), "UTF8"));
      }
      if (page.getProjectNum() != null && StringUtils.isNotBlank(page.getProjectNum())) {
        page.setProjectNum(URLDecoder.decode(page.getProjectNum(), "UTF8"));
      }
      if (page.getQ() != null && !"".equals(page.getQ())) {
        page.setQ(URLDecoder.decode(page.getQ(), "UTF8"));
      }
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    }
    return page;
  }

  public List<ProjectListVM> queryList4Shop(ProjectPage page) {
    page = decodeUrl(page);
    page.setTenantId(UserInfoUtil.getCurrentTenantId());
    Integer rowCount = getDao().queryCount4Shop(page);
    page.getPager().setRowCount(rowCount);
    List<ProjectListVM> list = getDao().queryList4Shop(page);
    list.forEach(p -> setDefaultThreshold(p, ThresholdService.paramMap));
    return list;
  }

  private static Map<String, String> map = new HashMap<>();

  static {
    map.put("crowdCome", ParamConstants.ACTIVE_USER_VISIT_MINUTES);
    map.put("strengthCrowdBefore", ParamConstants.DEFAULT_BEFORE_RSSI);
    map.put("blackConsecutiveDay", ParamConstants.BLACK_CONSECUTIVE_DAYS);
    map.put("blackComeDay", ParamConstants.BLACK_COME_DAYS);
  }

  private void setDefaultThreshold(ProjectListVM project, Map<String, Param> thresholdParams) {
    map.forEach((fieldName, thresholdParam) -> {
      try {
        Field field = ProjectListVM.class.getDeclaredField(fieldName);
        field.setAccessible(true);
        Object FieldValue = ReflectionUtils.getField(field, project);
        if (FieldValue == null) {
          ReflectionUtils.setField(field, project,
              thresholdParams.get(thresholdParam).getParamValue());
        }
      } catch (Exception e) {
        throw new RuntimeException(e);
      }
    });

    if (StringUtils.isBlank(project.getStrengthCrowdCome())) {
      project.setStrengthCrowdCome(
          thresholdService.getDefaultStrengthCrowdCome(project.getShopSize()));
    }

  }

  public List<Project> queryByListWithSingleParentName(ProjectPage page) {
    //      转换中文
    page = decodeUrl(page);

    page.setTenantId(UserInfoUtil.getCurrentTenantId());

    Integer rowCount = getDao().queryByCountWithSingleParentName(page);
    page.getPager().setRowCount(rowCount);
    List<Project> result = new ArrayList<>();
    if (page.getProjectType() == ProjectTypeEnum.PROJECT_PHYSICAL_CITY.getCode() && StringUtil
        .isNotEmpty(page.getChannel())) {
      page.setProjectType(null);
      List<Project> list = getDao().queryByListWithSingleParentName(page);
      Set<String> districtCityName = new HashSet<>();
      for (Project p : list) {
        if (StringUtils.isNotEmpty(p.getCity())) {
          if (!districtCityName.contains(p.getCity())) {
            result.add(p);
            districtCityName.add(p.getCity());
          }
        }
      }
    } else {
      result = getDao().queryByListWithSingleParentName(page);
    }
    return result;
  }

  public String updatePicUrlById(Project page) {

    getDao().updatePicUrlById(page);

    // 当前业务逻辑中需要检测表 TD_PROJECT_PLACE 中是否存在记录，
    // 存在是修改，
    // 不存在是添加
    page.setTenantId(UserInfoUtil.getCurrentUserTenantId());

    ProjectPlace projectPlace = new ProjectPlace();
    projectPlace.setProjectId(page.getId());
    List<ProjectPlace> list = projectPlaceService.selectByProjectId(projectPlace);

    String msg = "更新成功";
    if (list.size() > 0) {
      getDao().updatePicUrlByProId(page);
    } else {
      User user = UserInfoUtil.getUser();

      projectPlace.setCreateBy(user.getUmid());
      projectPlace.setCreator(user.getUmid());
      projectPlace.setTenantId(UserInfoUtil.getCurrentUserTenantId());
      projectPlace.setStatus(ReportConstants.ProjectPlaceStatus.AVALIABLE);
      projectPlace.setPicUrl(page.getPicUrl());

      projectPlaceService.insert(projectPlace);
      msg = "添加成功";
    }
    return msg;
  }

  /**
   * 根据用户角色配置的权限来 过滤用户能访问的项目， 注： 项目类型只能选择一种。
   */
  public Map<String, Project> findAllPermissionProject() throws Exception {

    Param param = paramService
        .queryByParamKey(ReportConstants.DefaultParamKey.DEFAULT_PROJECT_PERMISSION_LEVEL);
    int level = 1;

    String levelStr = param.getParamValue();
    if (StringUtil.isNotEmpty(levelStr) && StringUtil.isNumeric(levelStr)) {
      level = Integer.parseInt(levelStr);
    }

    User user = UserInfoUtil.getUser();
    // page.setTenantId(String.valueOf(user.getTenantId()));
    //
    // //全部权限项目
    // List<String> result = dao.queryByListIds(page);

    //TODO 如何和UM集成获取project项目, 学波UM将会支持分页  @Yan

    String umid = user.getUmid();

    boolean isTenantAdmin = false;
    if (level == 0) {
      isTenantAdmin = true;
    } else if (level == 1) {
      isTenantAdmin = user.isTenantAdmin();
    }
    List<ExtResource> extResourcesList = getExtResourceListByUmid(umid, PROJECT);
    List<String> projectNameList = new ArrayList<>();
    // List <String> projectTypeList = new ArrayList <>();
    ProjectPage projectPage = new ProjectPage();
    projectPage.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
    projectPage.setTenantId(UserInfoUtil.getCurrentUserTenantId());
    projectPage.setPageEnabled(false);
    List<Project> direct = new ArrayList<>();
    int resourceType = 0;

    if (!isTenantAdmin) {
      // 租户管理员，显示所有项目
      //     direct = dao.queryByListIds(projectPage);
      // } else {
      //用户配置的项目资源唯一，不会同时勾选不同类型项目资源
      //资源权限 按照优先级来处理：所有项目>案场>商业>指定
      if (extResourcesList.size() != 0) {
        for (ExtResource resource : extResourcesList) {
          // if (ALL_PROJECT.equalsIgnoreCase(resource.getResourceCode())) {    //所有项目
          //     resourceType = -1;
          // //     break;
          // // } else if (PROJECT.equalsIgnoreCase(resource.getParentId())) {
          // //     projectNameList.add(resource.getResourceName());    //指定项目
          // } else {
          resourceType = -2;
          // String extAttr4 = resource.getExtAttr4();
          // if (!extAttr4.isEmpty() && extAttr4.indexOf(PROJECT_TYPE) != -1) {
          //     String projectType = extAttr4.split("=")[1];
          //     projectTypeList.add(projectType);//ReportConstants.ProjectType.FIELD_PROJECT;
          // }
          if ("Project".equalsIgnoreCase(resource.getParentId())) { //指定项目
            projectNameList.add(resource.getResourceName());
          }
        }
      } else {
        resourceType = -3;//没有任何资源
      }
    }

    //指定项目
    if (resourceType != 0) {
      //把指定项目，和类型项目去重之后合并。
      // for (ExtResource resource : extResourcesList) {
      //     if ("Project".equalsIgnoreCase(resource.getParentId())) {  //指定项目
      //         nameList.add(resource.getResourceName());
      //     }
      // }
      // 指定类型
      // direct = queryByProjectTypes(projectTypeList, String.valueOf(user.getTenantId()));
      // List <String> names = new ArrayList <>();
      // Map <String, String> projectNameMap = new HashMap <>();
      // for (Project project : direct) {
      //     if (!projectNameMap.containsKey(project.getProjectName())) {
      //         projectNameMap.put(project.getProjectName(), project.getProjectName());
      //     }
      // }
      // for (String name : projectNameList) {
      // if (!projectNameMap.containsKey(name)) {
      //     names.add(name);  //指定项目中，不包括在list中的项目名称放到names中，用来检索指定项目
      // }
      // }
      if (projectNameList.size() > 0) {
        List<Project> projectList = queryByProjectNames(projectNameList,
            UserInfoUtil.getCurrentUserTenantId());
        direct.addAll(projectList);
      }
    } else {//是管理员 或 者有全部项目权限且没有指定项目
      direct = dao.queryByListIds(projectPage);
    }
    // else if (projectNameList.size() != 0) {
    //     direct = queryByProjectNames(projectNameList, String.valueOf(user.getTenantId()));
    // }

    //        //直接子项目
    //        Map <String, Project> directMaps = new HashMap <>();
    //        for (Project project : direct) {
    //            directMaps.put(project.getId() + "", project);
    //        }
    //
    //        //递归查询所有子项目
    Map<String, Project> projectMaps = new HashMap<>();
    //        for (Map.Entry <String, Project> stringProjectEntry : directMaps.entrySet()) {
    //            ProjectPage page = new ProjectPage();
    //            page.setId(Integer.parseInt(stringProjectEntry.getKey()));
    //            page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
    //            projectMaps.putAll(queryAllChildrenByParam(page, new HashMap <>()));
    //        }
    //        projectMaps.putAll(directMaps);

    return projectMaps;
  }

  /**
   * 根据用户角色配置的权限来 过滤用户能访问的项目，并添加用户信息 注： 项目类型只能选择一种。
   */
  public List<ProjectUserRelationVM> findAllProject(ProjectPage page) throws Exception {
    String umid = UserInfoUtil.getUser().getUmid();
    return findAllProjectCache(page, umid);
  }

  /**
   * 根据用户角色配置的权限来 过滤用户能访问的项目，并添加用户信息 注： 项目类型只能选择一种。 缓存
   */
  @Cacheable(key = "#projectUmid")
  public List<ProjectUserRelationVM> findAllProjectCache(ProjectPage page, String projectUmid)
      throws Exception {

    Map<String, Project> allPermissionProject = findAllPermissionProject();
    List<String> projectIds = new ArrayList<>(allPermissionProject.keySet());
    if (page.getQ() != null && StringUtils.isNotBlank(page.getQ())) {
      page.setQ(UriEncoder.decode(page.getQ()));
    }
    page.setProjectIds(projectIds);
    page.setUmid(projectUmid);

    List<ProjectUserRelationVM> projectUserRelationVMs = queryByListWithUserRelation(page);

    return projectUserRelationVMs;
  }

  /**
   * 获取项目列表以及一些指标
   */
  public List<ProjectIndexVM> findAllProjectIndex(ProjectPage page) throws Exception {
    String umid = UserInfoUtil.getUser().getUmid();
    return findAllProjectIndexCache(page, umid);
  }

  /**
   * 获取项目列表以及一些指标 缓存
   */
  @Cacheable(key = "#projectIndexUmid")
  public List<ProjectIndexVM> findAllProjectIndexCache(ProjectPage page, String projectIndexUmid)
      throws Exception {

    Map<String, Project> allPermissionProject = findAllPermissionProject();
    List<String> projectIds = new ArrayList<>(allPermissionProject.keySet());
    ProjectIndexPage projectIndexPage = new ProjectIndexPage();
    projectIndexPage.setProjectIds(projectIds);
    projectIndexPage.setUserRelationType(page.getUserRelationType());
    projectIndexPage.setUmid(projectIndexUmid);
    projectIndexPage.setPage(page.getPage());
    projectIndexPage.setRows(page.getRows());

    //筛选条件
    projectIndexPage.setProjectType(page.getProjectType());
    projectIndexPage.setProjectName(page.getProjectName());
    projectIndexPage.setProjectNum(page.getProjectNum());
    projectIndexPage.setStatus(page.getStatus());
    if (page.getQ() != null && StringUtils.isNotBlank(page.getQ())) {
      projectIndexPage.setQ(UriEncoder.decode(page.getQ()));
    }

    String sort = page.getSort();
    String order = page.getOrder();

    List<ProjectIndexVM> projectIndexVMList;

    page.getPager()
        .setRowCount(projectIndexService.queryByListWithUserRelationCount(projectIndexPage));

    if (sort != null && order != null) {//有自定义排序
      projectIndexPage
          .setSort(StringUtil.camelToUnderline(sort) + " +  0 ");//对于7天环比，30天环比 进行加0，mysql会做自动转化
      projectIndexPage.setOrder(StringUtil.camelToUnderline(order));
      projectIndexVMList = projectIndexService.queryByListWithUserRelation(projectIndexPage);

    } else {//无自定义排序(按照置顶顺序)
      projectIndexVMList = projectIndexService.queryByListWithUserRelation(projectIndexPage);
    }

    return projectIndexVMList;
  }

  public Project findOneById(String projectId) throws Exception {

    Project project = selectByPrimaryKey(projectId);
    return project;
  }

  /**
   * 查询某项目的详细信息
   */
  public ProjectAttributeVM findOneWithDetail(String projectId) throws Exception {

    Project project = selectByPrimaryKey(projectId);
    if (project == null) {
      return null;
    }

    //TODO 是否具体查看权限，目前有，未来可能需要做一个统一的filter @Yan //已做判断 @RAN
    //查找所有权限的项目
    // User user = UserInfoUtil.getUser();
    // ProjectPage page = new ProjectPage();
    // page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
    // page.setPageEnabled(false);
    // page.setTenantId(user.getTenantId() + "");
    Map<String, Project> allPermissionProject = findAllPermissionProject();

    //封装返回体
    ProjectAttributeVM projectAttributeVM = projectMapper.projectToProjectAttributeVM(project);

    //递归得到当前项目的所有父项目
    Set<Project> parentSet = queryParentProjectByProjectId(projectId);
    //查询当前项目的直接子项目
    ProjectPage childPage = new ProjectPage();
    childPage.setId(Integer.parseInt(projectId));
    childPage.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
    // Map <String, Project> projects = queryAllChildrenByParam(childPage, new HashMap());//递归得到当前项目的所有子项目
    // List <Project> childSet = new ArrayList();
    // for (String key : projects.keySet()) {
    //     childSet.add(projects.get(key));
    // }
    List<Project> childList = getDirectChildrenByParam(childPage);
    projectAttributeVM.setChildProjectList(new ArrayList(childList));

    Map<String, String> parentMap = new HashMap<String, String>();
    Map<String, String> childMap = new HashMap<String, String>();
    for (Project parentProject : parentSet) {
      parentMap.put(parentProject.getId() + "", parentProject.getId() + "");
    }
    for (Project parentProject : childList) {
      childMap.put(parentProject.getId() + "", parentProject.getId() + "");
    }
    List<ParentChildProject> projectList = new ArrayList<>();
    boolean projectPermissionFlag = false;
    for (Map.Entry<String, Project> stringProjectEntry : allPermissionProject.entrySet()) {
      if (!parentMap.containsKey(stringProjectEntry.getKey()) && !childMap
          .containsKey(stringProjectEntry.getKey()) && null != projectId
          && !projectId.equals(stringProjectEntry.getKey())) {
        ParentChildProject parentChildProject = projectMapper
            .proejctToParentChildProject(stringProjectEntry.getValue());
        parentChildProject.setProjectId(projectId);
        projectList.add(parentChildProject);
      }
      if (stringProjectEntry.getKey().equals(projectId)) {//判断是否有本项目权限
        projectPermissionFlag = true;
      }
    }
    if (!projectPermissionFlag) {//没有本项目权限
      return null;
    }
    projectAttributeVM.setProjectList(projectList);

    ProjectParamPage paramPage = new ProjectParamPage();
    paramPage.setProjectId(Integer.parseInt(projectId));
    List<ProjectParam> projectParams = projectParamService.queryByList(paramPage);
    for (ProjectParam projectParam : projectParams) {
      if (ReportConstants.ProjectParamKey.ACTIVE_USER_VISIT_MINUTES.equals(projectParam.getKey())) {
        projectAttributeVM.setActiveUserVisitMinutes(projectParam.getValue());
      }
      if (ReportConstants.ProjectParamKey.PROJECT_STAY_USER_MINUTES.equals(projectParam.getKey())) {
        projectAttributeVM.setProjectStayUserMinutes(projectParam.getValue());
      }
      if (ReportConstants.ProjectParamKey.PROJECT_STAY_TIMEOUT_MINUTES
          .equals(projectParam.getKey())) {
        projectAttributeVM.setProjectTimeoutMinutes(projectParam.getValue());
      }
      if (ReportConstants.ProjectParamKey.PROJECT_THRESHOLDTIME_UNIT
          .equals(projectParam.getKey())) {
        projectAttributeVM.setThresholdTimeUnit(projectParam.getValue());
      }
      if (ReportConstants.ProjectParamKey.PROJECT_STAYTIMEDISTRIBUTION_UNIT
          .equals(projectParam.getKey())) {
        projectAttributeVM.setStayTimeDistributionUnit(projectParam.getValue());
      }
    }

    //添加项目属性信息
    ProjectAttributePage projectAttributePage = new ProjectAttributePage();
    projectAttributePage.setProjectId(project.getId());
    projectAttributePage.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
    ProjectAttribute projectAttribute = projectAttributeService.queryBySingle(projectAttributePage);
    if (projectAttribute != null) {
      projectAttributeVM.setPrincipal(projectAttribute.getPrincipal());
      projectAttributeVM.setPosition(projectAttribute.getPosition());
      projectAttributeVM.setDepartment(projectAttribute.getDepartment());
      projectAttributeVM.setEmail(projectAttribute.getEmail());
      projectAttributeVM.setPhone1(projectAttribute.getPhone1());
      projectAttributeVM.setPhone2(projectAttribute.getPhone2());
    }

    return projectAttributeVM;
  }

  /**
   * 创建项目
   */
  public Project createProject(ProjectPage page) throws BusinessException {

    User user = UserInfoUtil.getUser();

    //设置排序
    if (page.getOrderline() == null) {
      page.setOrderline(ReportConstants.ProjectOrder.OTHER);
    }

    //插入项目
    Project project = projectMapper.projectPageToProject(page);
    project.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
    project.setTenantId(UserInfoUtil.getCurrentUserTenantId());
    project.setCreateBy(user.getUmid());
    project.setCreator(user.getName());
    // TODO
    int downNums = 0;
    if (page.getProjectChildrenId() != null && !"".equals(page.getProjectChildrenId())) {
      downNums = page.getProjectChildrenId().split("@").length;
    }
    project.setDownNums(downNums);
    dao.insert(project);

    //创建项目对应客群标签
    List<String> crowdTypeList = new ArrayList<>();
    //新客，老客，到访客群
    crowdTypeList.add(CrowdTypeEnum.AU.toString());
    crowdTypeList.add(CrowdTypeEnum.OU.toString());
    crowdTypeList.add(CrowdTypeEnum.NU.toString());
    int defaultCrowd = crowdService
        .createDefaultCrowdsByTypeList(crowdTypeList, String.valueOf(project.getId()),
            UserInfoUtil.getCurrentUserTenantId(),
            user.getUmid());
    //更新project的默认人群
    project.setDefaultCrowd(defaultCrowd + "");
    dao.updateByPrimaryKeySelective(project);

    //店组将此项目的子节点加入TD_PROJECT_RELATION与TD_INSTALL_INFO部署表
    if (StringUtils.isNotEmpty(page.getProjectChildrenId())) {
      String[] projectChildArr = page.getProjectChildrenId().split("@");
      List<String> childrenIds = Arrays.asList(projectChildArr);
      saveChildrenProjectRelations(user, project.getId(), childrenIds);
    }

    //设置project 参数表
    Map<String, Object> projectParamMap = new HashMap<>();
    projectParamMap.put(ReportConstants.ProjectParamMapKey.ACTIVE_USER_VISIT_MINUTES_MAP,
        page.getActiveUserVisitMinutes());
    projectParamMap.put(ReportConstants.ProjectParamMapKey.PROJECT_STAY_USER_MINUTES_MAP,
        page.getProjectStayUserMinutes());
    projectParamMap.put(ReportConstants.ProjectParamMapKey.PROJECT_STAY_TIMEOUT_MINUTES_MAP,
        page.getProjectTimeoutMinutes());
    projectParamMap.put(ReportConstants.ProjectParamMapKey.PROJECT_THRESHOLDTIME_UNIT_MAP,
        page.getThresholdTimeUnit());
    projectParamMap.put(ReportConstants.ProjectParamMapKey.PROJECT_STAYTIMEDISTRIBUTION_UNIT_MAP,
        page.getStayTimeDistributionUnit());
    projectParamMap.put(ReportConstants.ProjectParamMapKey.RSSI_MAP, page.getRssi());
    if (projectParamMap != null && projectParamMap.size() > 0) {
      setProjectParamByProjectId(project, user.getUmid(), true, projectParamMap);
    }

    //同步插入指标项目
    ProjectIndex projectIndex = ProjectMapper.proejctToProjectIndex(project);
    projectIndexService.insert(projectIndex);

    //同步添加默认批量设置项目
    projectBatchConfigService.checkAndCreate(project);

    //同步um资源
    try {
      syncProjectResource(project);
    } catch (Exception e) {
      e.printStackTrace();
    }

    //添加审计日志
    auditLogService
        .insertAuditLong(project.getId(), ReportConstants.AuditLog.OPERATION_TYPE_CREATE, "Project",
            "",
            ReportConstants.AuditLog.OPERATION_RESULT_SUCESS, "创建项目记录", null, project);

    return project;
  }

  /**
   * 更新项目
   */
  public Project updateProject(ProjectPage page) throws BusinessException {
    User user = UserInfoUtil.getUser();

    Project oldProject;
    try {
      oldProject = selectByPrimaryKey(page.getId() + "");
    } catch (Exception e) {
      e.printStackTrace();
      throw new BusinessException("项目没有找到: " + page.toString());
    }

    Project newProject = projectMapper.projectPageToProject(page);

    newProject.setOrderline(ReportConstants.ProjectOrder.OTHER);
    newProject.setUpdateBy(user.getUmid());
    newProject.setUpdater(user.getName());
    // 设置下游数量
    newProject.setDownNums(page.getProjectChildrenId().split("@").length);

    try {
      dao.updateByPrimaryKeySelective(newProject);
    } catch (Exception e) {
      e.printStackTrace();
      throw new BusinessException("更新项目失败" + newProject.toString());
    }

    //同步um资源
    try {
      syncProjectResource(newProject);
    } catch (Exception e) {
      e.printStackTrace();
    }

    //自定义更新
    if (newProject.getProjectType() == ProjectTypeEnum.PROJECT_CUSTOM.getCode()) {
      //原子项目
      ProjectPage parentPage = new ProjectPage();
      parentPage.setId(newProject.getId());
      parentPage.setStatus(ReportConstants.ProjectStatus.AVALIABLE);//排除竞品，真正删除的项目存在，因为删除时已经删除关系
      List<Project> oldChildrenProjects = getDirectChildrenByParam(parentPage);
      List<String> oldChildrenIds = new ArrayList<>();
      List<String> needDelete = new ArrayList<>();
      for (Project project : oldChildrenProjects) {
        oldChildrenIds.add(project.getId() + "");
        needDelete.add(project.getId() + "");
      }
      //新子项目
      String[] newProjectChildArr = page.getProjectChildrenId().split("@");
      List<String> newChildrenIds = Arrays.asList(newProjectChildArr);
      List<String> needSave = new ArrayList(
          Arrays.asList(newProjectChildArr));//needSave可用newChildrenIds，但要new ArrayList
      //需要删除
      if (needDelete != null && needDelete.size() != 0) {
        needDelete.removeAll(newChildrenIds);
        for (String deleteId : needDelete) {//可支持批量删除提高性能
          ProjectRelationPage projectRelationPage = new ProjectRelationPage();
          projectRelationPage.setProjectParentId(newProject.getId() + "");
          projectRelationPage.setProjectId(deleteId);
          List<ProjectRelation> projectRelations = projectRelationService
              .queryByList(projectRelationPage);
          for (ProjectRelation projectRelation : projectRelations) {
            projectRelationService.deleteByPrimaryKey(projectRelation.getId());//删除关系
            //添加审计日志
            auditLogService
                .insertAuditLong(newProject.getId(), ReportConstants.AuditLog.OPERATION_TYPE_DELETE,
                    "ProjectRelation", "",
                    ReportConstants.AuditLog.OPERATION_RESULT_SUCESS, "删除项目关系记录", projectRelation,
                    null);

          }
          installInfoService.deleteProjectInstall(newProject, Integer.parseInt(deleteId));//删除部署
        }
      }
      //需要添加
      if (needSave != null && needSave.size() != 0) {
        needSave.removeAll(oldChildrenIds);
        if (needSave != null && needSave.size() > 0) {
          saveChildrenProjectRelations(user, newProject.getId(), needSave);//添加关系与部署
        }
      }
    }

    //更新project param参数表
    Map<String, Object> projectParamMap = new HashMap<>();
    projectParamMap.put(ReportConstants.ProjectParamMapKey.ACTIVE_USER_VISIT_MINUTES_MAP,
        page.getActiveUserVisitMinutes());
    projectParamMap.put(ReportConstants.ProjectParamMapKey.PROJECT_STAY_USER_MINUTES_MAP,
        page.getProjectStayUserMinutes());
    projectParamMap.put(ReportConstants.ProjectParamMapKey.PROJECT_STAY_TIMEOUT_MINUTES_MAP,
        page.getProjectTimeoutMinutes());
    projectParamMap.put(ReportConstants.ProjectParamMapKey.PROJECT_THRESHOLDTIME_UNIT_MAP,
        page.getThresholdTimeUnit());
    projectParamMap.put(ReportConstants.ProjectParamMapKey.PROJECT_STAYTIMEDISTRIBUTION_UNIT_MAP,
        page.getStayTimeDistributionUnit());
    projectParamMap.put(ReportConstants.ProjectParamMapKey.RSSI_MAP, page.getRssi());
    if (projectParamMap != null && projectParamMap.size() > 0) {
      setProjectParamByProjectId(newProject, user.getUmid(), true, projectParamMap);
    }

    //更新指标项目
    ProjectIndexPage projectIndexPage = new ProjectIndexPage();
    projectIndexPage.setProjectId(newProject.getId());
    ProjectIndex projectIndex = projectIndexService.queryBySingle(projectIndexPage);
    if (projectIndex != null) {
      int projectIndexId = projectIndex.getId();
      ProjectIndex newProjectIndex = ProjectMapper.proejctToProjectIndex(newProject);
      newProjectIndex.setId(projectIndexId);
      projectIndexService.updateByPrimaryKeySelective(newProjectIndex);
    }

    //同步更新批量设置项目属性
    ProjectBatchConfig projectBatchConfig = new ProjectBatchConfig();
    projectBatchConfig.setProjectId(newProject.getId() + "");
    projectBatchConfig.setProjectName(newProject.getProjectName());
    projectBatchConfig.setProjectNum(newProject.getProjectNum());
    projectBatchConfig.setCity(newProject.getCity());
    projectBatchConfigService.updateByProjectId(projectBatchConfig);

    //添加审计日志
    auditLogService
        .insertAuditLong(newProject.getId(), ReportConstants.AuditLog.OPERATION_TYPE_UPDATE,
            "Project", "",
            ReportConstants.AuditLog.OPERATION_RESULT_SUCESS, "更新指定项目记录", oldProject, newProject);

    return newProject;
  }

  /**
   * 查找项目类型
   */
  public List<Project> queryByProjectTypes(List<String> typeList, String tenantId) {
    List<Project> projectList = new ArrayList<>();
    ProjectPage page = new ProjectPage();
    page.setTenantId(tenantId);
    page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
    page.setPageEnabled(false);
    for (String type : typeList) {
      page.setProjectType(Integer.valueOf(type));
      projectList.addAll(dao.queryByList(page));
    }
    return projectList;
  }

  /**
   * 通过名称查找项目
   */
  public List<Project> queryByProjectNames(List<String> nameList, String tenantId) {
    ProjectPage paramObj = new ProjectPage();
    paramObj.setPageEnabled(false);
    paramObj.setTenantId(tenantId);
    paramObj.setProjectNameList(nameList);
    paramObj.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
    List<Project> projectList = dao.findAll(paramObj);
    return projectList;
  }

  /**
   * 删除项目， 更新所有探针安装记录状态 TODO 最好有个回滚机制
   */
  public void deleteProject(Project project) throws BusinessException {

    //逻辑删除
    project.setStatus(ReportConstants.ProjectStatus.NO_AVALIABLE);
    dao.updateByPrimaryKeySelective(project);

    //把项目下所有探针 设置为无效
    InstallInfoPage installInfoPage = new InstallInfoPage();
    installInfoPage.setProjectId(project.getId());
    installInfoPage.setTenantId(project.getTenantId());
    //更新sensor
    try {
      List<InstallInfo> list = installInfoService.queryByList(installInfoPage);
      //
      for (InstallInfo info : list) {
        Sensor sensor = sensorService.selectByPrimaryKey(info.getRelatedId());
        if (sensor != null) {
          sensor.setStatus(ReportConstants.SensorStatus.NO_AVALIABLE);
          sensorService.updateByPrimaryKeySelective(sensor);
        }

        //更新探针安装信息
        info.setStatus(ReportConstants.InstallInfoStatus.DELETE);
        installInfoService.updateByPrimaryKeySelective(info);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    //更新指标项目
    ProjectIndexPage projectIndexPage = new ProjectIndexPage();
    projectIndexPage.setProjectId(project.getId());
    ProjectIndex projectIndex = projectIndexService.queryBySingle(projectIndexPage);
    if (projectIndex != null && projectIndex.getId() != null && projectIndex.getId() != 0) {
      int projectIndexId = projectIndex.getId();
      projectIndexService.deleteByPrimaryKey(projectIndexId);
    }

    //同步删除批量设置
    ProjectBatchConfig projectBatchConfig = new ProjectBatchConfig();
    projectBatchConfig.setProjectId(project.getId() + "");
    projectBatchConfig.setStatus(ReportConstants.DefaultStatus.NO_AVALIABLE);
    projectBatchConfigService.updateByProjectId(projectBatchConfig);

    //删除项目关系表
    ProjectRelationPage prp = new ProjectRelationPage();
    prp.setProjectParentId(project.getId() + "");
    projectRelationService.deleteByParentId(prp);
    projectRelationService.deleteByChildId(project.getId() + "");

    //删除部署信息
    installInfoService.deleteProjectInstall(project, null);

    //删除项目属性信息
    //        if (project.getProjectType().equals(ProjectTypeEnum.PROJECT_STORE.getCode())) {
    if (project.getProjectType().equals(ProjectTypeEnum.PROJECT_ERROR.getCode())) {
      ProjectAttributePage projectAttributePage = new ProjectAttributePage();
      projectAttributePage.setProjectId(project.getId());
      List<ProjectAttribute> projectAttributes = projectAttributeService
          .queryByList(projectAttributePage);
      for (ProjectAttribute projectAttribute : projectAttributes) {
        projectAttributeService.deleteByPrimaryKey(projectAttribute.getId());
      }
    }

    //同步um资源
    HttpSession session = UserInfoUtil.getSession();
    List<Role> roleList = (List<Role>) session.getAttribute("roleList");
    Tenant tenant = (Tenant) session.getAttribute(SessionConstant.SESSION_TENANT);
    String tenantCode = tenant.getCaCode();
    try {
      syncProjectResource(project, roleList, tenantCode, "DELETE");
    } catch (BusinessException e) {
      e.printStackTrace();
      throw new BusinessException("同步um资源出错");
    }

    //删除类型
    roomCategoryRelService.deleteRelByRoomId(project.getId());

    //添加审计日志
    auditLogService.insertAuditLong(Integer.valueOf(project.getId()),
        ReportConstants.AuditLog.OPERATION_TYPE_DELETE, "Project", "",
        ReportConstants.AuditLog.OPERATION_RESULT_SUCESS, "删除指定项目记录", project, null);

  }

  /**
   * 更新黑名单规则,如果没有进行添加
   */

  public void updateBlackMacConfig(int totalDays, int occurenceNumber, int projectId)
      throws Exception {
    ProjectParamPage page = new ProjectParamPage();
    page.setProjectId(projectId);
    page.setKey(ReportConstants.ProjectParamKey.FILTER_MAC_CONFIG);
    if (occurenceNumber > totalDays || totalDays <= 1) {
      throw new Exception("参数设置不合理！");
    }
    ProjectParam pp = projectParamService.queryBySingle(page);
    if (pp == null) {
      ProjectParam param = new ProjectParam();
      param.setKey(ReportConstants.ProjectParamKey.FILTER_MAC_CONFIG);
      param.setProjectId(projectId);
      FilterMacConfig config = new FilterMacConfig();
      config.setTotalDays(totalDays);
      config.setOccurenceNumber(occurenceNumber);
      String value = JSONUtil.objToJsonFormat(config);
      param.setValue(value);
      projectParamService.insert(param);
    } else {
      FilterMacConfig config = new FilterMacConfig();
      config.setTotalDays(totalDays);
      config.setOccurenceNumber(occurenceNumber);
      String value = JSONUtil.objToJsonFormat(config);
      pp.setValue(value);
      projectParamService.updateByPrimaryKeySelective(pp);
    }
  }

  /**
   * 不分页获取直接子项目
   */
  public List<Project> getDirectChildrenByParam(ProjectPage page) {
    page.setPageEnabled(false);//用service查询子项目时不分页
    return dao.getDirectChildrenByParam(page);
  }

  /**
   * 创建项目参数
   */
  public static ProjectParam getProjectParam(String umid, Project project, String desc, String key,
      Object value) {
    ProjectParam projectParam = new ProjectParam();
    projectParam.setCreateBy(umid);
    projectParam.setCreator(umid);
    projectParam.setProjectId(project.getId());
    projectParam.setDescription(project.getProjectName() + ":" + desc);
    projectParam.setKey(key);
    projectParam.setValue((String) value);
    return projectParam;
  }

  /**
   * @param umid
   * @param extResourceType
   * @return
   */
  private List<ExtResource> getExtResourceListByUmid(String umid, String extResourceType) {
    List<ExtResource> list = new ArrayList<>();
    try {
      SecurityService securityService = UmRmiServiceFactory.getSecurityService();
      String type = extResourceType;
      List<ExtResource> extResourcesList = securityService
          .getExtResourcesByTypeAndUmid(appCode, appToken, type, umid);
      for (ExtResource resource : extResourcesList) {
        if (!"root".equalsIgnoreCase(resource.getResourceCode())) {
          list.add(resource);
        }
      }
    } catch (Exception e) {
      logger.error("根据用户umid、appCode、appTaken，查询用户资源权限，异常" + e.getMessage());
    }
    return list;
  }

  /**
   * 同步um资源
   */
  private void syncProjectResource(Project project) throws BusinessException {
    HttpSession session = UserInfoUtil.getSession();
    List<Role> roleList = (List<Role>) session.getAttribute("roleList");
    Tenant tenant = (Tenant) session.getAttribute(SessionConstant.SESSION_TENANT);
    String tenentCode = tenant.getCaCode();
    try {
      //            if (project.getProjectType() == ProjectTypeEnum.PROJECT_GROUP.getCode()) {
      //                syncProjectResource(project, roleList, tenentCode, "", ProjectTypeEnum.PROJECT_GROUP.getCode());
      //            } else if (project.getProjectType() == ProjectTypeEnum.PROJECT_STORE.getCode()) {
      //                syncProjectResource(project, roleList, tenentCode, "", ProjectTypeEnum.PROJECT_STORE.getCode());

      if (project.getProjectType() == ProjectTypeEnum.PROJECT_ERROR.getCode()) {
        syncProjectResource(project, roleList, tenentCode, "",
            ProjectTypeEnum.PROJECT_ERROR.getCode());
      } else if (project.getProjectType() == ProjectTypeEnum.PROJECT_ERROR.getCode()) {
        syncProjectResource(project, roleList, tenentCode, "",
            ProjectTypeEnum.PROJECT_ERROR.getCode());
      } else {
        syncProjectResource(project, roleList, tenentCode, "");
      }
    } catch (BusinessException e1) {
      e1.printStackTrace();
      throw new BusinessException("项目添加失败" + project.toString());
    }
  }

  /**
   * 创建、修改项目，同步更新 系统资源
   */
  private void syncProjectResource(Project project, List<Role> roleList, String tenentCode,
      String syncType, int projectType)
      throws BusinessException {
    try {

      SecurityService securityService = UmRmiServiceFactory.getSecurityService();

      //添加项目管理员模板与普通用户模板的项目信息同步
      User user = UserInfoUtil.getUser();
      String opUmid = user.getUmid();
      String tenantId = UserInfoUtil.getCurrentUserTenantId();
      List<Role> roleListeByAppcodeAndTenantId = securityService
          .getRoleByTenantAndAppID(tenantId, appCode);
      for (Role role : roleListeByAppcodeAndTenantId) {
        String adminRoleName = appCode + "_管理员模板";
        String userRoleName = appCode + "_普通用户模板";
        if (role.getRoleName() != null && (role.getRoleName().equals(adminRoleName) || role
            .getRoleName().equals(userRoleName))) {
          roleList.add(role);
        }
      }

      String resourceTypeEstateProject = "Project"; //在UM中配置的项目资源类型
      Project oldProject = selectByPrimaryKey(project.getId());
      String resourceName = oldProject.getProjectName();//project.getProjectName();
      String resourceCode = appCode + "_" + oldProject.getProjectName() + "_" + project.getId();
      String resourceDesc = appCode + "_" + oldProject.getProjectName() + "_" + project.getId();
      String parentResourceCode = "Project";

      ExtResource extResource = securityService
          .getResourceByCode(appCode, parentResourceCode, resourceCode);
      String resourceRid = extResource == null ? "" : extResource.getRid().toString();
      int resourceRidInt = extResource == null ? 0 : extResource.getRid();
      if (extResource != null) {
        if ("DELETE".equals(syncType)) {
          //删除权限
          //删除项目，同步删除权限，但不删除项目资源记录
          List<Role> list = securityService
              .getRoleByTenantAndAppID(UserInfoUtil.getCurrentUserTenantId(), appCode);
          for (Role role : list) {
            logger.info(
                "### 删除项目，同时遍历所有角色删除项目资源权限，删除角色（" + role.getRoleName() + "），参数(" + resourceRid + ","
                    + role.getRid() + ") #####");
            securityService.deleteResourceRoleByRoleRid(resourceRid, role.getRid());
          }
        } else {
          //update
          //更新项目，同步更新原资源对象数据
          resourceName = project.getProjectName();
          resourceCode = appCode + "_" + project.getProjectName() + "_" + project.getId();
          resourceDesc = appCode + "_" + project.getProjectName() + "_" + project.getId();
          logger.info(
              "#### 更新项目" + project.getProjectName() + " ,参数(" + resourceRidInt + "," + appCode
                  + "," + appToken + "," + tenentCode
                  + "," + resourceTypeEstateProject + "," + resourceName + "," + resourceCode + ","
                  + resourceDesc + ","
                  + parentResourceCode + ") #####");
          securityService.updateResource(resourceRidInt, appCode, appToken, tenentCode,
              resourceTypeEstateProject, resourceName,
              resourceCode, resourceDesc, parentResourceCode);
        }
      } else {
        logger.info(
            "#### 自动创建资源对象:" + resourceName + " ,参数(" + appCode + "," + appToken + "," + tenentCode
                + "," + resourceTypeEstateProject
                + "," + resourceName + "," + resourceCode + "," + resourceDesc + ","
                + parentResourceCode + ") #####");
        int num;
        //                if (projectType == ProjectTypeEnum.PROJECT_GROUP.getCode() || projectType == ProjectTypeEnum.PROJECT_STORE.getCode()) {
        if (projectType == ProjectTypeEnum.PROJECT_ERROR.getCode()
            || projectType == ProjectTypeEnum.PROJECT_ERROR.getCode()) {
          num = securityService
              .addResource(appCode, appToken, tenentCode, resourceTypeEstateProject, resourceName,
                  resourceCode,
                  resourceDesc, parentResourceCode, PROJECT_TYPE + "=" + projectType);
        } else {
          num = securityService
              .addResource(appCode, appToken, tenentCode, resourceTypeEstateProject, resourceName,
                  resourceCode,
                  resourceDesc, parentResourceCode);
        }
        if (num > 0) {
          ExtResource extResource1 = securityService
              .getResourceByCode(appCode, parentResourceCode, resourceCode);
          String extResource1Rid = extResource1 == null ? "" : extResource1.getRid().toString();
          int roleRid = 0;
          for (Role role : roleList) {
            roleRid = role.getRid();
            logger.info(
                "##### 创建资源对象后进行授权:" + resourceName + " ,参数：(" + extResource1Rid + "," + roleRid
                    + "," + opUmid + ")#####");
            securityService.saveResourceRole(extResource1Rid, roleRid, opUmid);
          }
          //添加权限,判断是否为租户管理员，否，则需要给租户管理员同步权限
          if (!user.isTenantAdmin()) {
            List<Role> list = securityService
                .getRoleByAppcodeAndTenantId(UserInfoUtil.getCurrentUserTenantId(), appCode);
            for (Role role : list) {
              logger.info(
                  "##### 创建资源对象后给租户管理员授权:" + resourceName + " ,参数：(" + extResource1Rid + "," + role
                      .getRid() + "," + opUmid
                      + ")#####");
              securityService.saveResourceRole(extResource1Rid, role.getRid(), opUmid);
            }
          }
        } else {
          logger.error("##### 自动创建资源对象:" + resourceName + " 异常!!! #####");
        }
      }

    } catch (Exception e) {
      throw new BusinessException("同步UM资源数据异常", e);
    }
  }

  /**
   * 创建、修改项目，同步更新 系统资源
   */
  private void syncProjectResource(Project project, List<Role> roleList, String tenentCode,
      String syncType) throws BusinessException {
    try {
      SecurityService securityService = UmRmiServiceFactory.getSecurityService();

      //添加项目管理员模板与普通用户模板的项目信息同步
      User user = UserInfoUtil.getUser();
      String opUmid = user.getUmid();
      String tenantId = UserInfoUtil.getCurrentUserTenantId();
      List<Role> roleByAppcodeAndTenantId = securityService
          .getRoleByTenantAndAppID(tenantId, appCode);
      for (Role role : roleByAppcodeAndTenantId) {
        String adminRoleName = appCode + "_管理员模板";
        String userRoleName = appCode + "_普通用户模板";
        if (role.getRoleName() != null && (role.getRoleName().equals(adminRoleName) || role
            .getRoleName().equals(userRoleName))) {
          roleList.add(role);
        }
      }

      String resourceTypeEstateProject = "Project"; //在UM中配置的项目资源类型
      Project oldProject = selectByPrimaryKey(project.getId());
      String resourceName = oldProject.getProjectName();//project.getProjectName();
      String resourceCode = appCode + "_" + oldProject.getProjectName() + "_" + project.getId();
      String resourceDesc = appCode + "_" + oldProject.getProjectName() + "_" + project.getId();
      String parentResourceCode = "Project";

      ExtResource extResource = securityService
          .getResourceByCode(appCode, parentResourceCode, resourceCode);
      String resourceRid = extResource == null ? "" : extResource.getRid().toString();
      int resourceRidInt = extResource == null ? 0 : extResource.getRid();
      if (extResource != null) {
        if ("DELETE".equals(syncType)) {
          //删除权限
          //删除项目，同步删除权限，但不删除项目资源记录
          List<Role> list = securityService
              .getRoleByTenantAndAppID(UserInfoUtil.getCurrentUserTenantId(), appCode);
          for (Role role : list) {
            logger.info(
                "### 删除项目，同时遍历所有角色删除项目资源权限，删除角色（" + role.getRoleName() + "），参数(" + resourceRid + ","
                    + role.getRid() + ") #####");
            securityService.deleteResourceRoleByRoleRid(resourceRid, role.getRid());
          }
        } else {
          //update
          //更新项目，同步更新原资源对象数据
          resourceName = project.getProjectName();
          resourceCode = appCode + "_" + project.getProjectName() + "_" + project.getId();
          resourceDesc = appCode + "_" + project.getProjectName() + "_" + project.getId();
          logger.info(
              "#### 更新项目" + project.getProjectName() + " ,参数(" + resourceRidInt + "," + appCode
                  + "," + appToken + "," + tenentCode
                  + "," + resourceTypeEstateProject + "," + resourceName + "," + resourceCode + ","
                  + resourceDesc + ","
                  + parentResourceCode + ") #####");
          securityService.updateResource(resourceRidInt, appCode, appToken, tenentCode,
              resourceTypeEstateProject, resourceName,
              resourceCode, resourceDesc, parentResourceCode);
        }
      } else {
        logger.info(
            "#### 自动创建资源对象:" + resourceName + " ,参数(" + appCode + "," + appToken + "," + tenentCode
                + "," + resourceTypeEstateProject
                + "," + resourceName + "," + resourceCode + "," + resourceDesc + ","
                + parentResourceCode + ") #####");
        int num = securityService
            .addResource(appCode, appToken, tenentCode, resourceTypeEstateProject, resourceName,
                resourceCode,
                resourceDesc, parentResourceCode);
        if (num > 0) {
          ExtResource extResource1 = securityService
              .getResourceByCode(appCode, parentResourceCode, resourceCode);
          String extResource1Rid = extResource1 == null ? "" : extResource1.getRid().toString();
          int roleRid = 0;
          for (Role role : roleList) {
            roleRid = role.getRid();
            logger.info(
                "##### 创建资源对象后进行授权:" + resourceName + " ,参数：(" + extResource1Rid + "," + roleRid
                    + "," + opUmid + ")#####");
            securityService.saveResourceRole(extResource1Rid, roleRid, opUmid);
          }
          //添加权限,判断是否为租户管理员，否，则需要给租户管理员同步权限
          if (!user.isTenantAdmin()) {
            List<Role> list = securityService
                .getRoleByAppcodeAndTenantId(UserInfoUtil.getCurrentUserTenantId(), appCode);
            for (Role role : list) {
              logger.info(
                  "##### 创建资源对象后给租户管理员授权:" + resourceName + " ,参数：(" + extResource1Rid + "," + role
                      .getRid() + "," + opUmid
                      + ")#####");
              securityService.saveResourceRole(extResource1Rid, role.getRid(), opUmid);
            }
          }
        } else {
          logger.error("##### 自动创建资源对象:" + resourceName + " 异常!!! #####");
        }
      }

    } catch (Exception e) {
      throw new BusinessException("同步UM资源数据异常", e);
    }
  }

  /**
   * 根据project type 判断是否有下层节点
   */
  private boolean isParentProject(Project project) {
    //TODO Yan, 从dictitem service里获取
    return false;
  }

  /**
   * 递归获取所有去重子项目id封装成ProjectChildrenVM
   */
  public List<Project> queryChildrenByParam(String projectId) throws Exception {
    ProjectPage page = new ProjectPage();//需要时可以将参数改为page，支持多种筛选条件
    page.setId(Integer.parseInt(projectId));
    page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);//有效项目，不包括竞品
    Map<String, Project> projects = queryAllChildrenByParam(page, new HashMap());
    List<Project> newList = new ArrayList<Project>();
    for (String key : projects.keySet()) {
      newList.add(projects.get(key));
    }
    return newList;
  }

  /**
   * 递归获取直接子项目id封装成ProjectChildrenVM
   */
  public List<ProjectChildrenVM> queryDirectChildrenByParam(String projectId, int layer)
      throws Exception {
    List<ProjectChildrenVM> newList = new ArrayList<>();
    ProjectPage page = new ProjectPage();//需要时可以将参数改为page，支持多种筛选条件
    page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);//有效项目，不包括竞品
    page.setPageEnabled(false);//不分页
    int parentId = Integer.parseInt(projectId);
    List<Project> projects = new ArrayList<>();
    if (parentId != -1) {//从某一项目开始查询
      page.setId(parentId);
      projects = getDirectChildrenByParam(page);
    } else {//查询最顶级项目
      List<String> allTopParentProjectIds = projectRelationService
          .getAllTopParentProjectIds(new ProjectRelationPage());
      Map<String, Project> allPermissionProject = findAllPermissionProject();
      Set<String> allPermissionProjectIds = allPermissionProject.keySet();
      allTopParentProjectIds.retainAll(allPermissionProjectIds);//与有权限的项目ID取交集
      page.setChildProjectIdList(allTopParentProjectIds);
      projects = dao.queryByList(page);
    }
    for (Project allTopParentProject : projects) {
      newList.add(projectMapper.projectToProjectChildrenVM(allTopParentProject, projectId, layer));
    }
    return newList;
  }

  /**
   * 递归获取所有去重子项目id TODO 如果量大，可以建一个冗余表，跨越层级维护父子关系
   */
  public Map<String, Project> queryAllChildrenByParam(ProjectPage page,
      Map<String, Project> projectsMap) {
    List<Project> result = getDirectChildrenByParam(page);
    if (result != null && result.size() > 0) {
      for (Project project : result) {
        if (!projectsMap.containsKey(project.getId() + "")) {
          projectsMap.put(project.getId() + "", project);
          //是店组才递归，虽然写死了，但是如果在确保只有店组才有子项目的前提下，可以提高性能
          //                    if (project.getProjectType() == ProjectTypeEnum.PROJECT_GROUP.getCode()) {
          if (project.getProjectType() == ProjectTypeEnum.PROJECT_ERROR.getCode()) {
            page.setId(project.getId());
            queryAllChildrenByParam(page, projectsMap);

          }
        }
      }
    }
    return projectsMap;
  }

  /**
   * 查找竞品项目
   */
  public List<CompeteProjectVM> queryComProject(ProjectPage page, boolean detail) throws Exception {
    ProjectPage comPage = new ProjectPage();
    comPage.setId(page.getRelatedId());
    //        comPage.setProjectType(ProjectTypeEnum.PROJECT_COMPETE.getCode());
    comPage.setProjectType(ProjectTypeEnum.PROJECT_ERROR.getCode());
    comPage.setTenantId(UserInfoUtil.getUser().getTenantId() + "");
    comPage.setStatus(ReportConstants.ProjectStatus.NO_AVALIABLE);
    if (page.getQ() != null && StringUtils.isNotBlank(page.getQ())) {
      comPage.setQ(UriEncoder.decode(page.getQ()));
    }
    comPage.setPage(page.getPage());
    comPage.setRows(page.getRows());

    Integer count = dao.getChildrenByParamCount(comPage);
    comPage.getPager().setRowCount(count);
    page.getPager().setRowCount(count);

    List<Project> childrenProjects = dao.getChildrenByParam(comPage);

    ArrayList<CompeteProjectVM> competeProjectVMs = new ArrayList<>();
    for (Project project : childrenProjects) {
      CompeteProjectVM competeProjectVM = projectMapper.projectToCompeteProjectVM(project);
      String dataSources = "";
      //            if (detail) {
      //                int projectId = project.getId();
      //                ProjectPage roomPage = new ProjectPage();
      //                roomPage.setId(projectId);
      //                roomPage.setProjectType(ProjectTypeEnum.PROJECT_COMPETE.getCode());
      //                roomPage.setCategory(ProjectTypeEnum.PROJECT_COMPETE.getCode() + "");
      //                int roomCount = getDirectChildrenByParam(roomPage).size();
      //                competeProjectVM.setRoomCount(roomCount);
      //                SensorPage ssidPage = new SensorPage();
      //                ssidPage.setProjectId(projectId);
      //                int ssidCount = sensorService.queryByCount(ssidPage);
      //                competeProjectVM.setSsidCount(ssidCount);
      //            }
      CompeteAttributePage competeAttributePage = new CompeteAttributePage();
      competeAttributePage.setCompeteId(project.getId());
      CompeteAttribute competeAttribute = competeAttributeService
          .queryBySingle(competeAttributePage);
      competeProjectVM.setRelatedId(page.getRelatedId());
      if (null != competeAttribute) {
        competeProjectVM.setDataSources(competeAttribute.getDataSources());
        competeProjectVM.setStartDate(competeAttribute.getStartDate());
        competeProjectVM.setEndDate(competeAttribute.getEndDate());
      }
      competeProjectVMs.add(competeProjectVM);
    }
    return competeProjectVMs;
  }

  /**
   * 新建/更新竞品项目
   */
  public Project createOrUpdateComProject(Project project) throws Exception {
    Integer relatedId = project.getRelatedId();
    project.setRelatedId(null);
    User user = UserInfoUtil.getUser();
    if (relatedId != null && relatedId != 0 && StringUtils.isNotBlank(relatedId + "")) {
      Integer comProjectId = project.getId();

      //新增
      if (comProjectId == null || comProjectId == 0 || StringUtils.isBlank(comProjectId + "")) {

        ProjectPage projectPage = new ProjectPage();
        projectPage.setProjectName(project.getProjectName());//不同项目可以关联同一名称的竞品项目
        projectPage.setTenantId(UserInfoUtil.getCurrentUserTenantId());
        //                projectPage.setProjectType(ProjectTypeEnum.PROJECT_COMPETE.getCode());
        projectPage.setProjectType(ProjectTypeEnum.PROJECT_ERROR.getCode());
        List<Project> competeProjects = dao.queryByList(projectPage);

        if (competeProjects == null || competeProjects.size() == 0) {
          project.setTenantId(UserInfoUtil.getCurrentUserTenantId());
          //                    project.setProjectType(ProjectTypeEnum.PROJECT_COMPETE.getCode());
          project.setProjectType(ProjectTypeEnum.PROJECT_ERROR.getCode());
          project.setStatus(ReportConstants.ProjectStatus.NO_AVALIABLE);//页面不显示
          project.setOpeningTime("");
          project.setClosingTime("");
          project.setCreateBy(user.getUmid());
          project.setCreator(user.getName());
          dao.insert(project);

          //创建项目对应客群标签
          List<String> crowdTypeList = new ArrayList<>();
          crowdTypeList.add(CrowdTypeEnum.TU.toString());//竞品项目
          int defaultCrowd = crowdService
              .createDefaultCrowdsByTypeList(crowdTypeList, String.valueOf(project.getId()),
                  UserInfoUtil.getCurrentUserTenantId(), user.getUmid());
          //更新project的默认人群
          project.setDefaultCrowd(defaultCrowd + "");
        } else {
          //如果已存在则更新
          project.setId(competeProjects.get(0).getId());//如果是多个，只能选择其中一个更新
          project.setUpdateBy(user.getUmid());
          project.setUpdater(user.getUmid());

          ProjectRelationPage page = new ProjectRelationPage();
          page.setProjectId(project.getId() + "");
          page.setProjectParentId(relatedId + "");
          List<ProjectRelation> projectRelations = projectRelationService.queryByList(page);
          for (ProjectRelation projectRelation : projectRelations) {
            projectRelationService.deleteByPrimaryKey(projectRelation.getId());//有则删除，无则不删，保证此关系唯一性
          }
        }
        dao.updateByPrimaryKeySelective(project);

        ProjectRelation projectRelation = new ProjectRelation();
        projectRelation.setProjectId(project.getId() + "");
        projectRelation.setProjectParentId(relatedId + "");
        projectRelationService.insert(projectRelation);

      } else {//更新
        project.setUpdateBy(user.getUmid());
        project.setUpdater(user.getUmid());
        dao.updateByPrimaryKeySelective(project);
      }
    }
    return project;
  }

  /**
   * 删除竞品项目
   */
  public void deleteComProject(Project project) throws BusinessException {
    ProjectRelationPage projectRelationPage = new ProjectRelationPage();
    projectRelationPage.setProjectParentId(project.getRelatedId() + "");//项目id
    projectRelationPage.setProjectId(project.getId() + "");//竞品id
    List<ProjectRelation> projectRelations = projectRelationService
        .queryByList(projectRelationPage);
    User user = UserInfoUtil.getUser();
    String umid = user.getUmid();
    String name = user.getName();
    for (ProjectRelation projectRelation : projectRelations) {
      projectRelationService.deleteByPrimaryKey(projectRelation.getId());//只删除关系
    }
    projectRelationPage.setProjectParentId(null);
    int count = projectRelationService.queryByCount(projectRelationPage);
    if (count == 0) {
      project.setStatus(ReportConstants.ProjectStatus.NO_COMPETE);//无效竞品项目
      dao.updateByPrimaryKeySelective(project);

      CompeteSource competeSource = new CompeteSource();
      competeSource.setProjectId(project.getId());
      competeSource.setStatus(ReportConstants.ProjectStatus.NO_AVALIABLE);
      competeSource.setUpdateBy(umid);
      competeSource.setUpdater(name);
      competeSourceService.updateById(competeSource);//逻辑删除竞品数据源

      CompeteAttribute competeAttribute = new CompeteAttribute();
      competeAttribute.setCompeteId(project.getId());
      competeAttribute.setStatus(ReportConstants.ProjectStatus.NO_AVALIABLE);
      competeAttribute.setUpdateBy(umid);
      competeAttribute.setUpdater(name);
      competeAttributeService.updateById(competeAttribute);//逻辑删除竞品属性表

      Crowd record = new Crowd();
      record.setAttr1(project.getId() + "");
      record.setStatus(ReportConstants.ProjectStatus.NO_AVALIABLE);
      record.setUpdateBy(umid);
      crowdService.updateCrowdsById(record);
    }
  }

  /**
   * 竞品房间分配
   */
  public void saveRoomChange(String roomList, String roomChooseList, String roomListtemp,
      String roomChooseListtemp, Integer project_id)
      throws Exception {

    List<String> tosave = new ArrayList<>();
    List<String> toremove = new ArrayList<>();

    String[] split = roomList.split(",");
    String[] split3 = roomListtemp.split(",");
    String[] split2 = roomChooseList.split(",");
    String[] split4 = roomChooseListtemp.split(",");
    for (String room : split2) {
      boolean have = false;
      for (String roomin : split4) {
        if (room.equals(roomin)) {
          have = true;
        }
      }
      if (!have) {
        tosave.add(room);
      }
    }
    for (String room : split) {
      boolean have = false;
      for (String roomin : split3) {
        if (room.equals(roomin)) {
          have = true;
        }
      }
      if (!have) {
        toremove.add(room);
      }
    }
    for (String roomStr : tosave) {
      if (roomStr == null || "".equals(roomStr.trim())) {
      } else {
        int parseInt = Integer.parseInt(roomStr);
        Room room = new Room();
        room.setId(parseInt);
        room.setProjectId(project_id);
        // roomService.updateAllotRooms(room);
      }
    }
    for (String roomStr : toremove) {
      if (roomStr == null || "".equals(roomStr.trim())) {
      } else {
        int parseInt = Integer.parseInt(roomStr);
        Room room = new Room();
        room.setId(parseInt);
        room.setProjectId(null);
        // roomService.updateAllotRooms(room);
      }
    }
  }

  /**
   * 竞品批量导入
   */
  public List<String> batchImportComProject(MultipartFile file, String projectId, int filetype)
      throws Exception {

    User user = UserInfoUtil.getUser();
    List<String> errMsgList = new ArrayList<>();
    String tenantId = UserInfoUtil.getCurrentUserTenantId();
    if (file != null) {
      logger.info("competeProject.batchImport.file=" + file.getOriginalFilename() + " ,size=" + file
          .getSize() + " ,filetype=" + filetype);

      if (errMsgList.size() == 0) {
        try {
          ProjectAttachment attachment = attachmentService
              .addProjectAttachment(user.getUmid(), projectId, tenantId, file, filetype);
          // 调用azkaban接口，启动任务
          if (attachment != null && attachment != null) {
            logger.info("调用azkaban接口，启动任务");
            Map<String, Object> paramMap = new HashMap<>();
            ProjectAttachmentPage projectAttachmentPage = new ProjectAttachmentPage();
            projectAttachmentPage.setAttr2(projectId);
            projectAttachmentPage.setStatus(ReportConstants.DefaultStatus.AVALIABLE);

            if (filetype == 1) {//房间

              projectAttachmentPage.setType(2);
              ProjectAttachment lastByProjectIdAndType = attachmentService
                  .getLastByProjectIdAndType(projectAttachmentPage);
              if (lastByProjectIdAndType != null && lastByProjectIdAndType.getId() != null) {
                paramMap.put("roomUsersAttachId", lastByProjectIdAndType.getId().toString());
              } else {
                paramMap.put("roomUsersAttachId", "");
              }
              paramMap.put("projectRoomAttachId", attachment.getId().toString());

            } else if (filetype == 2) {//客流
              projectAttachmentPage.setType(1);
              ProjectAttachment lastByProjectIdAndType = attachmentService
                  .getLastByProjectIdAndType(projectAttachmentPage);
              if (lastByProjectIdAndType != null && lastByProjectIdAndType.getId() != null) {
                paramMap.put("projectRoomAttachId", lastByProjectIdAndType.getId().toString());
              } else {
                paramMap.put("projectRoomAttachId", "");
              }
              paramMap.put("roomUsersAttachId", attachment.getId().toString());
            }
            paramMap.put("projectId", attachment.getAttr2());
            azkabanRestUtil
                .callAzkabanRestAPI(paramMap, "LoadProjectDataFromDB", "LoadProjectDataFromDB");
          } else {
            throw new BusinessException("创建attachment记录异常");
          }
        } catch (Exception e) {
          throw new BusinessException("竞品数据导入异常", e);
        }
      }
    }
    return errMsgList;
  }

  /**
   * 返回获取的单个项目责任人信息和探针报表
   */
  public ProjectDetailVM projectDetail(String projectId) {
    ProjectDetailVM projectDetailVM = new ProjectDetailVM();
    ProjectPage page = new ProjectPage();
    page.setStatus(Integer.valueOf(ReportConstants.ProjectStatus.AVALIABLE));
    page.setId(Integer.parseInt(projectId));
    page.setPageEnabled(false);
    List<ProjectDetailVM> list = dao.queryProjectPrincipalList(page);
    projectDetailVM = list.get(0);

    //探针数
    SensorPage sensorPage = new SensorPage();
    sensorPage.setProjectId(Integer.parseInt(projectId));
    sensorPage.setStatus(ReportConstants.SensorStatus.AVALIABLE);
    sensorPage.setPageEnabled(false);
    List<Sensor> sensors = sensorService.queryByList(sensorPage);

    if (sensors != null && sensors.size() != 0) {
      //探针七日图表
      ArrayList<SensorDetailVM> sensorDetailVMS = new ArrayList<>();
      for (Sensor sensor : sensors) {

        SensorDetailVM sensorDetailVM = new SensorDetailVM();
        sensorDetailVM.setProjectId(Integer.parseInt(projectId));
        sensorDetailVM.setSensorMac(sensor.getSensorMac());
        sensorDetailVM.setId(sensor.getId());
        sensorDetailVM.setSensorCode(sensor.getSensorCode());
        sensorDetailVM.setSensorName(sensor.getSensorName());

        //取出今天及往前7天的日期
        List<Date> dates = new ArrayList<>();
        Date currentDate = new Date();
        for (int i = 0; i < 30; i++) {
          Date date = DateUtil.addDay2Date(-i, currentDate);
          dates.add(date);
        }

        //探针mac数
        sensorDetailVM = sensorService.macs(sensorDetailVM, dates);

        //探针log数
        sensorDetailVM = sensorService.logs(sensorDetailVM, dates);

        sensorDetailVMS.add(sensorDetailVM);
      }
      projectDetailVM.setSensorDetailVMS(sensorDetailVMS);
    } else {
      projectDetailVM.setSensorNum(0);
      projectDetailVM.setHealthRate(0.0);
      projectDetailVM.setNoLogDuration(0.0);
      projectDetailVM.setThirtyNoLogDuration(0.0);
      ArrayList<SensorDetailVM> sensorDetailVMS = new ArrayList<>();
      projectDetailVM.setSensorDetailVMS(sensorDetailVMS);
    }

    return projectDetailVM;
  }

  /**
   * 递归得到当前项目的所有父项目
   */
  private Set<Project> queryParentProjectByProjectId(String projectId) {
    Map<String, String> map = new HashMap<String, String>();
    Set<Project> parentList = new HashSet<>();
    if (projectId != null) {
      ProjectPage page = new ProjectPage();
      page.setId(Integer.parseInt(projectId));
      page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
      List<Project> list = dao.getParentProjectByParam(page);
      for (Project parentProject : list) {
        if (!map.containsKey(parentProject.getId() + "")) {
          map.put(parentProject.getId() + "", parentProject.getId() + "");
          parentList.add(parentProject);
        }
      }
    }
    return parentList;
  }

  private Project setProjectParamByProjectId(Project project, String umid, boolean isSetValue,
      Map<String, Object> projectParamMap)
      throws BusinessException {
    ProjectParamPage page = new ProjectParamPage();
    page.setProjectId(project.getId());
    try {
      List<ProjectParam> list = projectParamService.queryByList(page);
      if (isSetValue) {
        //更新projectParam记录
        page.setKey(ReportConstants.ProjectParamKey.RSSI);
        ProjectParam param = projectParamService.queryBySingle(page);
        if (param != null) {
          if (projectParamMap.containsKey(ReportConstants.ProjectParamMapKey.RSSI_MAP)
              && projectParamMap.get(ReportConstants.ProjectParamMapKey.RSSI_MAP) != null
              && !"null".equals(projectParamMap.get(ReportConstants.ProjectParamMapKey.RSSI_MAP))) {
            //                        param.setValue(SensorRssiUtil.distance2Rssi(Double.valueOf((String) projectParamMap.get(ReportConstants.ProjectParamMapKey.RSSI_MAP))));
            param.setValue(
                (String) projectParamMap.get(ReportConstants.ProjectParamMapKey.RSSI_MAP));
          }
          projectParamService.updateByPrimaryKeySelective(param);
        } else if (projectParamMap != null && projectParamMap
            .containsKey(ReportConstants.ProjectParamMapKey.RSSI_MAP)
            && projectParamMap.get(ReportConstants.ProjectParamMapKey.RSSI_MAP) != null
            && !"null".equals(projectParamMap.get(ReportConstants.ProjectParamMapKey.RSSI_MAP))) {
          ProjectParam projectParam = getProjectParam(umid, project,
              ReportConstants.ProjectParamDesc.RSSI_DESC,
              ReportConstants.ProjectParamKey.RSSI,
              projectParamMap.get(ReportConstants.ProjectParamMapKey.RSSI_MAP));
          projectParamService.insert(projectParam);
        }

        boolean thresholdFlag1 = checkThreshold(page, projectParamMap,
            ReportConstants.ProjectParamKey.ACTIVE_USER_VISIT_MINUTES,
            ReportConstants.ProjectParamMapKey.ACTIVE_USER_VISIT_MINUTES_MAP,
            ReportConstants.DefaultParamKey.DEFAULT_ACTIVE_USER_VISIT_MINUTES,
            ReportConstants.ProjectParamDesc.ACTIVE_USER_VISIT_MINUTES_DESC, umid, project);
        boolean thresholdFlag2 = checkThreshold(page, projectParamMap,
            ReportConstants.ProjectParamKey.PROJECT_STAY_USER_MINUTES,
            ReportConstants.ProjectParamMapKey.PROJECT_STAY_USER_MINUTES_MAP,
            ReportConstants.DefaultParamKey.DEFAULT_PROJECT_STAY_USER_MINUTES,
            ReportConstants.ProjectParamDesc.PROJECT_STAY_USER_MINUTES_DESC, umid, project);
        boolean thresholdFlag3 = checkThreshold(page, projectParamMap,
            ReportConstants.ProjectParamKey.PROJECT_STAY_TIMEOUT_MINUTES,
            ReportConstants.ProjectParamMapKey.PROJECT_STAY_TIMEOUT_MINUTES_MAP,
            ReportConstants.DefaultParamKey.DEFAULT_PROJECT_STAY_TIMEOUT_MINUTES,
            ReportConstants.ProjectParamDesc.PROJECT_STAY_TIMEOUT_MINUTES_DESC, umid, project);
        boolean thresholdFlag4 = checkThreshold(page, projectParamMap,
            ReportConstants.ProjectParamKey.PROJECT_THRESHOLDTIME_UNIT,
            ReportConstants.ProjectParamMapKey.PROJECT_THRESHOLDTIME_UNIT_MAP,
            ReportConstants.DefaultParamKey.DEFAULT_PROJECT_THRESHOLDTIME_UNIT,
            ReportConstants.ProjectParamDesc.PROJECT_THRESHOLDTIME_UNIT_DESC, umid, project);
        boolean thresholdFlag5 = checkThreshold(page, projectParamMap,
            ReportConstants.ProjectParamKey.PROJECT_STAYTIMEDISTRIBUTION_UNIT,
            ReportConstants.ProjectParamMapKey.PROJECT_STAYTIMEDISTRIBUTION_UNIT_MAP,
            ReportConstants.DefaultParamKey.DEFAULT_PROJECT_STAYTIMEDISTRIBUTION_UNIT,
            ReportConstants.ProjectParamDesc.PROJECT_STAYTIMEDISTRIBUTION_UNIT_DESC, umid, project);
        //更新批量设置阀值
        if (thresholdFlag1 || thresholdFlag2 || thresholdFlag3 || thresholdFlag4
            || thresholdFlag5) {
          ProjectBatchConfig projectBatchConfig = projectBatchConfigService.checkAndCreate(project);
          projectBatchConfig.setThresholdValue(ReportConstants.DefaultStatus.AVALIABLE + "");
          projectBatchConfigService.updateByProjectId(projectBatchConfig);
        }

        //设置默认主题
        checkThreshold(page, projectParamMap, ReportConstants.ProjectParamKey.PROJECT_THEME, "",
            ReportConstants.DefaultParamKey.DEFAULT_PROJECT_THEME,
            ReportConstants.ProjectParamDesc.PROJECT_THEME_DESC, umid, project);

      }
    } catch (Exception e) {
      throw new BusinessException("获取项目信号强度值异常", e);
    }
    return project;
  }

  /**
   * 校验保存项目参数值
   */
  private boolean checkThreshold(ProjectParamPage page, Map projectParamMap, String paramKey,
      String mapKey, String defaultKey, String desc,
      String umid, Project project) {
    boolean thresholdFlag = false;
    page.setKey(paramKey);
    ProjectParam param = projectParamService.queryBySingle(page);
    if (param != null) {
      param.setValue((String) projectParamMap.get(mapKey));
      projectParamService.updateByPrimaryKeySelective(param);
    } else {
      ProjectParam projectParam;
      if (projectParamMap != null && projectParamMap.containsKey(mapKey)
          && projectParamMap.get(mapKey) != null
          && !"null".equals(projectParamMap.get(mapKey))) {
        projectParam = getProjectParam(umid, project, desc, paramKey, projectParamMap.get(mapKey));
        thresholdFlag = true;
      } else {
        String value = paramService.queryByParamKey(defaultKey).getParamValue();
        projectParam = getProjectParam(umid, project, desc, paramKey, value);
      }
      projectParamService.insert(projectParam);
    }
    return thresholdFlag;
  }

  public int querySumAreaByProjectIds(List<String> projectIds) {
    return dao.querySumAreaByProjectIds(projectIds);
  }

  public List<ProjectUserRelationVM> queryByListWithUserRelation(ProjectPage page) {
    int count = dao.queryByListWithUserRelationCount(page);
    page.getPager().setRowCount(count);
    List<ProjectUserRelationVM> projectUserRelationVMS = dao.queryByListWithUserRelation(page);
    return projectUserRelationVMS;
  }

  /**
   * 通过项目id得到所有竞品项目
   */
  public List<Project> findAllCompetitiveProjectByRelatedId(String projectId) {
    ProjectPage project = new ProjectPage();
    project.setRelatedId(Integer.parseInt(projectId));
    project.setStatus(ReportConstants.ProjectStatus.NO_AVALIABLE);
    //        project.setProjectType(ProjectTypeEnum.PROJECT_COMPETE.getCode());
    project.setProjectType(ProjectTypeEnum.PROJECT_ERROR.getCode());
    return dao.findAll(project);
  }

  /**
   * 根据id填充店铺信息
   */
  public String storeInformationByProjectNum(String projectNum) throws Exception {
    OJDBCGetHaixin ojdbcGetHaixin = null;
    try {
      ojdbcGetHaixin = new OJDBCGetHaixin();
      String selectprojectbyshopcode = null;
      HashMap<String, String> hashMap = new HashMap<>();
      try {
        selectprojectbyshopcode = ojdbcGetHaixin.selectprojectbyshopcode(projectNum);
        String[] split = selectprojectbyshopcode.split(",");
        hashMap.put("projectName", split[1]);
        hashMap.put("projectPosition", split[4] + split[5] + split[6] + split[7]);
        hashMap.put("city", split[5]);
      } catch (Exception e) {
        logger.error("查询海信数据库失败", e);
        return null;
      }
      selectprojectbyshopcode = JSONUtil.objectToJsonStr(hashMap);
      return selectprojectbyshopcode;
    } catch (Exception e) {
      logger.error("数据库连接失败");
      return null;
    } finally {
      try {
        if (ojdbcGetHaixin != null) {
          ojdbcGetHaixin.close();
        }
      } catch (Exception e) {
        logger.error("数据库关闭失败");
      }
    }
  }

  /**
   * 项目过滤时长参数
   */
  public void updateMaxDurationConfig(int maxDuration, int projectId) throws Exception {
    ProjectParamPage page = new ProjectParamPage();
    page.setProjectId(projectId);
    page.setKey(ReportConstants.ProjectParamKey.PROJECT_MAX_DURATION);
    if (maxDuration == 1) {
      throw new Exception("最长停留参不能为0！");
    }
    ProjectParam pp = projectParamService.queryBySingle(page);
    if (pp == null) {
      ProjectParam param = new ProjectParam();
      param.setKey(ReportConstants.ProjectParamKey.PROJECT_MAX_DURATION);
      param.setProjectId(projectId);
      param.setValue(maxDuration + "");
      projectParamService.insert(param);
    } else {
      pp.setValue(maxDuration + "");
      projectParamService.updateByPrimaryKeySelective(pp);
    }
  }

  /**
   * 将此项目的子节点加入TD_PROJECT_RELATION表
   */
  private void saveChildrenProjectRelations(User user, Integer parentId,
      List<String> projectChildArr) {
    Map<String, String> map = new HashMap<>();
    for (String childId : projectChildArr) {
      Project childProject = dao.selectByPrimaryKey(childId);
      if (childProject != null && !String.valueOf(parentId).equals(childId)) {
        if (map.get(childId) == null) {//防止重复
          ProjectRelation projectRelation = new ProjectRelation();
          projectRelation.setProjectParentId(parentId + "");
          projectRelation.setProjectId(childId);
          projectRelationService.insert(projectRelation);
          //添加审计日志
          auditLogService.insertAuditLong(parentId, ReportConstants.AuditLog.OPERATION_TYPE_CREATE,
              "ProjectRelation", "",
              ReportConstants.AuditLog.OPERATION_RESULT_SUCESS, "添加项目关系记录", null, projectRelation);

          installInfoService.saveProjectInstall(user, parentId, Integer.parseInt(childId));
          map.put(childId, childId);
        }
      }
    }
  }

  /**
   * 导入店铺负责人信息
   */
  public List<String> batchImportPrincipal(MultipartFile file) throws Exception {
    User user = UserInfoUtil.getUser();
    List<String> errMsgList = new ArrayList<>();
    String tenantId = UserInfoUtil.getCurrentUserTenantId();
    String errorMsg = "";
    if (file != null) {
      logger.info(
          "comProjectPrincipal.batchImport.file=" + file.getOriginalFilename() + " ,size=" + file
              .getSize());
      InputStream is = file.getInputStream();

      String sheetName = "Sheet1";
      int startRowNum = 1;
      int cellNum = 9;
      List<String[]> datas = ExcelUtil.readSheetDataByParam(is, sheetName, startRowNum, cellNum);
      if (null == datas || datas.size() == 0) {
        errMsgList.add("导入模板数据为空");
        return errMsgList;
      }
      int updataTemp = 0;
      int insertTemp = 0;
      for (String[] strArray : datas) {
        if (null == strArray[0]
            || strArray[0].isEmpty()
            || (strArray[3].isEmpty() && strArray[4].isEmpty() && strArray[5].isEmpty()
            && strArray[6].isEmpty() && strArray[7].isEmpty() && strArray[8]
            .isEmpty())) {
          continue;
        }
        try {
          ProjectAttribute projectAttribute = new ProjectAttribute();
          ProjectAttributePage projectAttributePage = new ProjectAttributePage();
          projectAttributePage.setProjectId(Integer.parseInt(strArray[0]));
          projectAttributePage.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
          ProjectAttribute projectAttributeDao = projectAttributeService
              .queryBySingle(projectAttributePage);
          if (projectAttributeDao != null) {
            projectAttribute.setId(projectAttributeDao.getId());
            projectAttribute.setProjectId(Integer.parseInt(strArray[0]));
            projectAttribute.setPrincipal(strArray[3]);
            projectAttribute.setPosition(strArray[4]);
            projectAttribute.setDepartment(strArray[5]);
            projectAttribute.setEmail(strArray[6]);
            projectAttribute.setPhone1(strArray[7]);
            projectAttribute.setPhone2(strArray[8]);
            projectAttribute.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
            projectAttribute.setUpdater(user.getUmid());
            projectAttribute.setUpdateBy(user.getUmid());
            projectAttributeService.updateByPrimaryKey(projectAttribute);
            updataTemp++;
            logger.info("更新店铺信息：" + updataTemp + " 项目ID:" + strArray[0]);
          } else {
            projectAttribute.setProjectId(Integer.parseInt(strArray[0]));
            projectAttribute.setPrincipal(strArray[3]);
            projectAttribute.setPosition(strArray[4]);
            projectAttribute.setDepartment(strArray[5]);
            projectAttribute.setEmail(strArray[6]);
            projectAttribute.setPhone1(strArray[7]);
            projectAttribute.setPhone2(strArray[8]);
            projectAttribute.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
            projectAttribute.setCreateBy(user.getUmid());
            projectAttribute.setCreator(user.getUmid());
            projectAttributeService.insert(projectAttribute);
            insertTemp++;
            logger.info("新增店铺信息：" + insertTemp + " 项目ID:" + strArray[0]);
          }

        } catch (Exception e) {
          errMsgList.add(strArray[0]);
          logger.error("导入错误条数：" + errMsgList.size() + " 导入错误项目ID:" + strArray[0] + "  " + e);
        }
      }
    }
    return errMsgList;

  }

  public List<ProjectDetailVM> getProjectPrincipalList(ProjectPage page) throws Exception {
    page.setTenantId(UserInfoUtil.getCurrentTenantId());
    page.setStatus(Integer.valueOf(ReportConstants.ProjectStatus.AVALIABLE));
    page.setProjectType(ProjectTypeEnum.PROJECT_SHOP.getCode());

    if (page.getQ() != null) {
      page.setQ(URLDecoder.decode(page.getQ(), "UTF-8"));
    }
    page.setOrder(StringUtil.camelToUnderline(page.getOrder()));
    page.setSort(StringUtil.camelToUnderline(page.getSort()));

    List<ProjectDetailVM> list = queryProjectPrincipalList(page);

    return list;
  }

  public List<ProjectDetailVM> queryProjectPrincipalList(ProjectPage page) {
    int rows = dao.getProjectPrincipalCount(page);
    page.getPager().setRowCount(rows);
    List<ProjectDetailVM> list = dao.queryProjectPrincipalList(page);
    return list;
  }

  public List<Sensor> getSensorProjectList(SensorPage page) throws Exception {
    // TODO 下面注释掉的为设计权限的，未测2.0版本正确与否
//        Map<String, Project> projectMap = findAllPermissionProject();
//        List<String> projectIds = new ArrayList<>(projectMap.keySet());
    //todo 不考虑权限，暂时替代上面两行
    List<String> projectIds = new ArrayList<>();
    page.setProjectIds(projectIds);
    page.setTenantId(UserInfoUtil.getCurrentTenantId());
    page.setStatus(Integer.valueOf(ReportConstants.ProjectStatus.AVALIABLE));
    page.setOrder(StringUtil.camelToUnderline(page.getOrder()));
    page.setSort(StringUtil.camelToUnderline(page.getSort()));
    if (null != page.getSort() && "log_hours".equals(page.getSort().trim())) {
      page.setSort("CAST(log_hours AS signed)");
    }
    if (page.getQ() != null) {
      page.setQ(URLDecoder.decode(page.getQ(), "UTF-8"));
    }
    //探针数
    List<Sensor> sensors = sensorService.querySensorProjectByList(page);
    return sensors;

  }

  public void updateComProject(ProjectPage page) {
    String projectId = page.getId() + "";
    String relatedIds = page.getRelatedIds();
    if (null == projectId || null == relatedIds) {
      return;
    }
    User user = UserInfoUtil.getUser();

    String[] str = relatedIds.split(ReportConstants.Punctuation.COMMA);
    //        ProjectRelationPage page = new ProjectRelationPage();
    //        page.setProjectParentId(projectId);
    //        projectRelationService.deleteByParentId(page);

    for (String id : str) {

      Integer relatedId = Integer.parseInt(id);
      if (relatedId != null && relatedId != 0 && StringUtils.isNotBlank(relatedId + "")) {
        ProjectRelation projectRelation = new ProjectRelation();
        projectRelation.setProjectId(relatedId + "");

        projectRelation.setProjectParentId(projectId + "");
        projectRelationService.insert(projectRelation);

      } else {
        continue;
      }
    }
    //更新
    Project project = new Project();
    project.setId(Integer.parseInt(projectId));
    project.setUpdateBy(user.getUmid());
    project.setUpdater(user.getUmid());
    dao.updateByPrimaryKeySelective(project);

  }

  public List<Project> queryComProjectTenant(String relatedId) {
    ProjectPage comPage = new ProjectPage();

    //        comPage.setProjectType(ProjectTypeEnum.PROJECT_COMPETE.getCode());
    comPage.setProjectType(ProjectTypeEnum.PROJECT_ERROR.getCode());
    comPage.setStatus(ReportConstants.ProjectStatus.NO_AVALIABLE);
    comPage.setPageEnabled(false);
    comPage.setTenantId(UserInfoUtil.getUser().getTenantId() + "");
    comPage.setId(Integer.parseInt(relatedId));

    List<Project> childrenProjects = dao.getNotDirectChildrenByParam(comPage);
    return childrenProjects;
  }

  /**
   * 获取城市下店铺坐标
   */
  public List<ProjectLatLngVM> projectLatLng(ProjectPage page) {
    Project project = dao.selectByPrimaryKey(page.getId());
    if (null == project) {
      return new ArrayList<ProjectLatLngVM>();
    }
    ProjectPage params = new ProjectPage();
    params.setStatus(Integer.valueOf(ReportConstants.ProjectStatus.AVALIABLE));
    params.setPageEnabled(false);

    if (project.getProjectType() == ProjectTypeEnum.PROJECT_SHOP.getCode()) {
      params.setId(project.getId());
    } else if (project.getProjectType() == ProjectTypeEnum.PROJECT_LOGICAL_CITY.getCode()) {
      params.setLogicalCity(project.getLogicalCity());
      params.setProjectType(ProjectTypeEnum.PROJECT_SHOP.getCode());
    } else if (project.getProjectType() == ProjectTypeEnum.PROJECT_BRAND_REGION.getCode()) {
      params.setRegion(project.getRegion());
      params.setProjectType(ProjectTypeEnum.PROJECT_LOGICAL_CITY.getCode());
    } else if (project.getProjectType() == ProjectTypeEnum.PROJECT_BRANDS.getCode()) {
      params.setBrand(project.getBrand());
      params.setProjectType(ProjectTypeEnum.PROJECT_BRAND_REGION.getCode());
    } else {
      //如果传参错误，返回当前ID坐标
      params.setId(project.getId());
      log.error("projectLatLng params error,id:{},projectType:{}", page.getId(),
          params.getProjectType());
    }

    return dao.queryProjectLatLngList(page);
  }
}
