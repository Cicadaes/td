package td.enterprise.service;

import com.alibaba.fastjson.JSON;
import com.tendcloud.enterprise.um.umic.entity.User;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.inject.Inject;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.dao.DO.SensorDO;
import td.enterprise.dao.InstallInfoDao;
import td.enterprise.entity.BsUser;
import td.enterprise.entity.InstallInfo;
import td.enterprise.entity.Project;
import td.enterprise.entity.Sensor;
import td.enterprise.entity.type.ProjectTypeEnum;
import td.enterprise.page.InstallInfoPage;
import td.enterprise.page.ProjectPage;
import td.enterprise.page.ProjectPlacePage;
import td.enterprise.page.SensorPage;
import td.enterprise.service.manager.SysAuditLogService;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.InstallInfoWithInfoVM;

/**
 * <br>
 * <b>功能：</b>安装归属表 InstallInfoService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-05-11 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("installInfoService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class InstallInfoService extends BaseService<InstallInfo> {

  public final static Logger logger = Logger.getLogger(InstallInfoService.class);

  @Autowired
  private InstallInfoDao dao;

  @Autowired
  private SensorService sensorService;

  @Autowired
  private ProjectService projectService;

  @Autowired
  private ProjectPlaceService projectPlaceService;

  @Inject
  private SysAuditLogService auditLogService;

  public InstallInfoDao getDao() {
    return dao;
  }

  public List<Sensor> query(SensorPage page) throws Exception {

    List<Sensor> rows = new ArrayList<>();
    List<SensorDO> rows2 = sensorService.queryByUnion(page);
    for (SensorDO sensorDO : rows2) {

      if (sensorDO.getProjectPlaceId() != null) {
        rows.add(sensorDO);
      } else if (sensorDO.getRoomId() == null) {
        rows.add(sensorDO);
      }
    }
    return rows;
  }

  /**
   * 更新安装信息
   */
  public String updateNew(Map installInfo) throws Exception {
    User user = UserInfoUtil.getUser();
    Integer projectId = (Integer) installInfo.get("pid");

    boolean updateFlag = false;
    String msg ="当前用户不得保存拖动探针";
    String ProjectNum = projectService.selectByPrimaryKey(projectId).getProjectNum();

    List<BsUser> bsUserList = projectService.getBsUserByUserId(user.getUmid());
    if(bsUserList.size()>0){
      String groupSignFlag = bsUserList.get(0).getGroupSign().trim();
      if("N".equalsIgnoreCase(groupSignFlag)){
        for(BsUser tmpBsUser:bsUserList){
          if(ProjectNum.equals(tmpBsUser.getShopCode())){
            updateFlag = true;
            break;
          }
        }
      }else if("无".equalsIgnoreCase(groupSignFlag)){
        updateFlag = true;
      }
    }

    // 没有操作权限
    if(!updateFlag){
      return msg;
    }

    // 场地id 从后台获取，在绫致项目中 场地和店铺是一对一的。
    ProjectPlacePage projectPlacePage = new ProjectPlacePage();
    projectPlacePage.setProjectId(projectId);
    ;

//    // 通过id 和 店铺编码，user_id 判断是否是店长，如果是店长，才可以修改
//    Map<String, Object> littleMap = new HashMap<>();
//    littleMap.put("project_id", projectId);
//    littleMap.put("user_id", user.getUmid());
//
//    int cnt4Flag = dao.getCount4JudgeUpdatePermissions(littleMap);
//
//    if (cnt4Flag <= 0) {
//      return "非当前店铺成员不可修改！";
//    }

    String datastr = (String) installInfo.get("datastr");
    List list = (List) JSON.parse(datastr);

    Map<String, Map<String, Object>> bigMap = new HashMap<>();
    for (Object object : list) {
      Map map = (Map) object;
      bigMap.put((String) map.get("id"), map);
    }

    Integer projectPlaceId = projectPlaceService.queryByList(projectPlacePage).get(0).getId();

    //准备探针列表
    InstallInfoPage installInfoPage = new InstallInfoPage();
    installInfoPage.setProjectId(projectId);
    installInfoPage.setProjectPlaceId(projectPlaceId);
    installInfoPage.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
    installInfoPage.setPageEnabled(false);
    List<InstallInfo> installInfos = dao.queryByList(installInfoPage);

    Map<String, InstallInfo> infoMap = new HashMap<>();
    InstallInfo oldInfo = new InstallInfo();
    for (InstallInfo info : installInfos) {
      oldInfo = info;
      infoMap.put(info.getRelatedId().toString(), info);
      if (bigMap.get(info.getRelatedId().toString()) != null) {//更新部署信息
        Map<String, Object> map = bigMap.get(info.getRelatedId().toString());
        info.setLatitude(map.get("y").toString());
        info.setLongitude(map.get("x").toString());
        info.setProjectPlaceId(projectPlaceId);

        dao.updateByPrimaryKey(info);
        auditLogService
            .insertAuditLong(info.getProjectId(), ReportConstants.AuditLog.OPERATION_TYPE_UPDATE,
                "InstallInfo", oldInfo.getId().toString(),
                ReportConstants.AuditLog.OPERATION_RESULT_SUCESS,
                "场地（id：" + projectPlaceId + ")部署，更新安装信息", oldInfo, info);
      } else {//更新为未部署
        info.setProjectPlaceId(null);
        info.setLatitude("0");
        info.setLongitude("0");

        dao.updateByPrimaryKey(info);
        auditLogService
            .insertAuditLong(info.getProjectId(), ReportConstants.AuditLog.OPERATION_TYPE_DELETE,
                "InstallInfo", oldInfo.getId().toString(),
                ReportConstants.AuditLog.OPERATION_RESULT_SUCESS,
                "场地（id：" + projectPlaceId + ")部署，删除安装信息", oldInfo, info);
      }
    }

    //创建部署信息
    for (Object object : list) {
      Map map = (Map) object;
      //之前未部署过
      if (infoMap.get(map.get("id")) == null) {
        Integer relatedId = Integer.parseInt((String) map.get("id"));
        Integer relatedType = Integer.parseInt((String) map.get("type"));

        InstallInfoPage installInfoPage1 = new InstallInfoPage();
        installInfoPage1.setProjectId(projectId);
        installInfoPage1.setRelatedId(relatedId);
        installInfoPage1.setRelatedType(relatedType);
        InstallInfo infoNew = queryBySingle(installInfoPage1);
        boolean exist = true;
        if (infoNew == null) {
          infoNew = new InstallInfo();
          exist = false;
        }
        infoNew.setProjectId(projectId);
        infoNew.setStatus(ReportConstants.DefaultStatus.AVALIABLE);

        if (relatedType == ReportConstants.InstallInfoType.SENSOR) {

          SensorPage page2 = new SensorPage();
          page2.setId(relatedId);
          Sensor sensor = sensorService.queryBySingle(page2);

          if (sensor != null) {
            infoNew.setRelatedAttribute(sensor.getSensorMac());
            infoNew.setProjectId(sensor.getProjectId());
            infoNew.setTenantId(sensor.getTenantId());
            infoNew.setStatus(sensor.getStatus());
          }
        } else if (relatedType == ReportConstants.InstallInfoType.PROJECT) {

          ProjectPage page2 = new ProjectPage();
          page2.setId(relatedId);
          Project project = projectService.queryBySingle(page2);

          if (project != null) {
            infoNew.setTenantId(project.getTenantId());
            infoNew.setStatus(project.getStatus());
          }
        }
        infoNew.setProjectPlaceId(projectPlaceId);
        infoNew.setLatitude((String) map.get("y"));
        infoNew.setLongitude((String) map.get("x"));
        infoNew.setRelatedType(relatedType);

        if (exist) {
          dao.updateByPrimaryKeySelective(infoNew);
        } else {
          infoNew.setCreateBy(user.getUmid());
          infoNew.setCreator(user.getName());
          dao.insert(infoNew);
        }

        auditLogService
            .insertAuditLong(infoNew.getProjectId(), ReportConstants.AuditLog.OPERATION_TYPE_CREATE,
                "InstallInfo", "", ReportConstants.AuditLog.OPERATION_RESULT_SUCESS,
                "场地（id：" + projectPlaceId + ")部署，创建安装信息", null, infoNew);
      }
    }
    msg = "更新成功";
    return msg;
  }

  public List<InstallInfoWithInfoVM> queryByListWithInfo(InstallInfoPage page) {
    return dao.queryByListWithInfo(page);
  }

  public List<InstallInfoWithInfoVM> queryByListSensor4Shop(InstallInfoPage page) {
    page.setTenantId(UserInfoUtil.getCurrentTenantId());
    return dao.queryByListSensor4Shop(page);
  }

  /**
   * 保存探针部署
   */
  public void saveSensorInstall(User user, Sensor sensor, String customizedInfo) {
    InstallInfo installInfo = new InstallInfo();
    installInfo.setTenantId(sensor.getTenantId());

    installInfo.setRelatedId(sensor.getId());
    installInfo.setRelatedType(ReportConstants.InstallInfoType.SENSOR);
    installInfo.setRelatedAttribute(sensor.getSensorMac());

    installInfo.setProjectId(sensor.getProjectId());

    installInfo.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
    installInfo.setLatitude("0");
    installInfo.setLongitude("0");

    installInfo.setCustomizedInfo(customizedInfo);

    installInfo.setCreateBy(user.getUmid());
    installInfo.setCreator(user.getName());

    dao.insert(installInfo);
  }

  /**
   * 删除探针部署
   */
  public void deleteSensorInstall(Sensor sensor) {
    InstallInfoPage page = new InstallInfoPage();
    page.setRelatedId(sensor.getId());
    page.setRelatedType(ReportConstants.InstallInfoType.SENSOR);
    page.setPageEnabled(false);
    List<InstallInfo> installInfos = dao.queryByList(page);
    for (InstallInfo installInfo : installInfos) {
      dao.deleteByPrimaryKey(installInfo.getId());
    }
  }

  /**
   * 保存项目部署
   */
  public void saveProjectInstall(User user, Integer projectId, Integer relatedId) {
    InstallInfo installInfo = new InstallInfo();
    installInfo.setTenantId(UserInfoUtil.getCurrentUserTenantId());

    installInfo.setRelatedId(relatedId);
    installInfo.setRelatedType(ReportConstants.InstallInfoType.PROJECT);

    installInfo.setProjectId(projectId);

    installInfo.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
    installInfo.setLatitude("0");
    installInfo.setLongitude("0");

    installInfo.setCreateBy(user.getUmid());
    installInfo.setCreator(user.getName());

    dao.insert(installInfo);
  }

  /**
   * 删除项目部署
   *
   * @param relatedId 店铺id
   */
  public void deleteProjectInstall(Project project, Integer relatedId) {
    InstallInfoPage page = new InstallInfoPage();
    page.setProjectId(project.getId());
    page.setPageEnabled(false);
    if (project != null && project.getProjectType() == ProjectTypeEnum.PROJECT_SHOP.getCode()
        && relatedId != null) {
      page.setRelatedType(ReportConstants.InstallInfoType.PROJECT);
      page.setRelatedId(relatedId);
    }
    List<InstallInfo> installInfos = dao.queryByList(page);
    for (InstallInfo installInfo : installInfos) {
      dao.deleteByPrimaryKey(installInfo.getId());
    }
  }

  public void cleanInstallOfShop(Project project) {
    dao.cleanInstallOfShop(project);
  }
}

