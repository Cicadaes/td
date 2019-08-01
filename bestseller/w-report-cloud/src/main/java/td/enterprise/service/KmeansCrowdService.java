package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import java.util.HashMap;
import java.util.Map;
import javax.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.azkaban.AzkabanRestUtil;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.dao.KmeansCrowdDao;
import td.enterprise.entity.CustomCrowd;
import td.enterprise.entity.KmeansCrowd;
import td.enterprise.page.CustomCrowdPage;
import td.enterprise.web.util.UserInfoUtil;

/**
 * <br>
 * <b>功能：</b>聚类客群参数表 KmeansCrowdService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-03 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("kmeansCrowdService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
@Slf4j
public class KmeansCrowdService extends BaseService<KmeansCrowd> {

  public final static Logger logger = Logger.getLogger(KmeansCrowdService.class);

  @Autowired
  private KmeansCrowdDao dao;

  @Autowired
  private CustomCrowdService customCrowdService;
  @Autowired
  private KmeansCrowdResultService kmeansCrowdResultService;

  @Inject
  AzkabanRestUtil azkabanRestUtil;

  public KmeansCrowdDao getDao() {
    return dao;
  }

  /**
   * 创建聚类客群参数
   */
  public KmeansCrowd create(KmeansCrowd kmeansCrowd) throws BusinessException {
    User user = UserInfoUtil.getUser();
    kmeansCrowd.setCreator(user.getUmid());
    kmeansCrowd.setTenantId(Integer.valueOf(UserInfoUtil.getCurrentUserTenantId()));
    dao.insert(kmeansCrowd);

    Map<String, Object> paramMap = new HashMap<>();
    paramMap.put("taskId", kmeansCrowd.getId().toString());
    String execId = azkabanRestUtil.callAzkabanRestAPI(paramMap, "KmeansCluster", "KmeansCluster");
    if (StringUtils.isBlank(execId)) {
      log.error("发起azkaban 失败！");
    }
    kmeansCrowd.setExecId(Integer.valueOf(execId));
    dao.updateByPrimaryKeySelective(kmeansCrowd);

    //同步写入CustomCrowd 记录
    CustomCrowd customCrowd = new CustomCrowd();
    customCrowd.setProjectId(kmeansCrowd.getProjectId());
    customCrowd.setCrowdRecordId(kmeansCrowd.getId());
    customCrowd.setCalcStatus(ReportConstants.CustomCrowd.CALC_STATUS_COUNT_ING);
    customCrowd.setCreator(user.getUmid());
    customCrowd.setCrowdName(kmeansCrowd.getCrowdName());
    customCrowd.setExecId(Integer.valueOf(execId));
    customCrowd.setRecordType(ReportConstants.CustomCrowd.CROWD_TYPE_KMEANS);
    customCrowd.setStatus(ReportConstants.CustomCrowd.STATUS_AVALIABLE);
    customCrowdService.insert(customCrowd);

    return kmeansCrowd;
  }

  /**
   * 删除聚类客群参数
   */
  public void delete(String kmeansCrowdId, KmeansCrowd kmeansCrowd) throws Exception {
    CustomCrowdPage page = new CustomCrowdPage();
    page.setCrowdRecordId(kmeansCrowd.getId());
    page.setRecordType(ReportConstants.CustomCrowd.CROWD_TYPE_KMEANS);
    CustomCrowd customCrowd = customCrowdService.queryBySingle(page);
    if (customCrowd != null) {
      customCrowd.setCalcStatus(ReportConstants.CustomCrowd.CALC_STATUS_NO_COUNT);
      customCrowd.setStatus(ReportConstants.CustomCrowd.STATUS_DELETE);
      customCrowdService.updateByPrimaryKeySelective(customCrowd);
    }

    //删除 结果记录
    kmeansCrowdResultService.deleteByKmeansCrowdId(kmeansCrowd.getId());
  }

  /**
   * 取消azkaban任务
   */
  public boolean cancelAzkabanTask(String kmeansCrowdId) throws Exception {
    boolean result = true;
    KmeansCrowd crowd = dao.selectByPrimaryKey(kmeansCrowdId);
    try {
      dao.deleteByPrimaryKey(kmeansCrowdId);
      if (crowd != null && crowd.getExecId() != null) {
        CustomCrowdPage page = new CustomCrowdPage();
        page.setCrowdRecordId(crowd.getId());
        CustomCrowd customCrowd = customCrowdService.queryBySingle(page);
        if (null != customCrowd) {
          customCrowdService.deleteByPrimaryKey(customCrowd.getId());
        }

        azkabanRestUtil.cancel(crowd.getExecId().toString());
      }
    } catch (Exception e) {
      log.error("取消失败", e);
    }
    return result;
  }


}
