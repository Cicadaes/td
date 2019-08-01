package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import java.lang.reflect.Field;
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
import org.springframework.util.ReflectionUtils;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.common.util.StringUtil;
import td.enterprise.dao.ProjectDao;
import td.enterprise.dao.ThresholdDao;
import td.enterprise.entity.Param;
import td.enterprise.entity.ProjectAttachment;
import td.enterprise.entity.Threshold;
import td.enterprise.entity.type.ShopSizeEnum;
import td.enterprise.page.ProjectPage;
import td.enterprise.page.ThresholdPage;
import td.enterprise.page.mapper.ThresholdMapper;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.ThresholdVM;

/**
 * <br>
 * <b>功能：</b>阈值表 ThresholdService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("thresholdService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ThresholdService extends BaseService<Threshold> {

  public final static Logger logger = Logger.getLogger(ThresholdService.class);

  /**
   * 存放系统参数
   */
  public static HashMap<String, Param> paramMap = new HashMap<String, Param>();

  @Autowired
  private ProjectAttachmentService attachmentService;

  @Inject
  private ThresholdMapper thresholdMapper;

  @Autowired
  private ParamService paramService;

  @Autowired
  private ThresholdDao dao;

  @Autowired
  private ProjectDao projectDao;

  public ThresholdDao getDao() {
    return dao;
  }

  /**
   * 参数初始化
   */
  public void start() {
    paramMap = (HashMap<String, Param>) this.queryThresholdParams();
  }

  public Threshold create(ThresholdVM thresholdVM) {
    Threshold threshold = thresholdMapper.thresholdVMToThreshold(thresholdVM);
    User user = UserInfoUtil.getUser();
    String umid = user.getUmid();
    threshold.setCreateBy(umid);
    threshold.setCreator(user.getName());
    threshold.setUpdater(umid);
    threshold.setUpdateBy(user.getName());
    dao.insert(threshold);
    return threshold;
  }

  public Threshold update(ThresholdVM thresholdVM) {
    Threshold threshold = thresholdMapper.thresholdVMToThreshold(thresholdVM);
    User user = UserInfoUtil.getUser();
    String umid = user.getUmid();
    threshold.setUpdater(umid);
    threshold.setUpdateBy(user.getName());
    dao.updateByPrimaryKeySelective(threshold);
    return threshold;
  }

  /**
   * 上传文件
   */
  public List<ProjectAttachment> upload(MultipartFile file, String projectId, int type)
      throws Exception {
    User user = UserInfoUtil.getUser();
    String tenantId = UserInfoUtil.getCurrentUserTenantId();
    if (file != null) {
      logger.info("file=" + file.getOriginalFilename() + " ,size=" + file.getSize());
      try {
        List<ProjectAttachment> attachment = attachmentService
            .addMultiProjectAttachment(user.getUmid(), projectId, tenantId, file, type);
        return attachment;
      } catch (Exception e) {
        throw new BusinessException("上传文件异常", e);
      }
    } else {
      return null;
    }
  }

  /**
   * 查询阈值设置
   */
  public List<ThresholdVM> queryThresholdByList(ThresholdPage page) {
    List<ThresholdVM> thresholdPages = dao.queryThresholdByList(page);
    if (thresholdPages == null || thresholdPages.size() == 0) {
      thresholdPages = new ArrayList<>();
      thresholdPages.add(new ThresholdVM());
    }
    thresholdPages
        .forEach(thresholdVM -> {
          setDefaultThreshold(thresholdVM, paramMap, page.getProjectId());
        });
    return thresholdPages;
  }

  /**
   * 查询阈值设置
   */
  public List<ThresholdVM> queryThresholdByProjectIds(String projectId) {
    String[] projectIds = projectId.split(",");
    Map<String, Object> params = new HashMap<>();
    params.put("projectIds", projectIds);
    List<ThresholdVM> thresholdPages = dao.queryThresholdByProjectIds(params);
    thresholdPages.forEach(thresholdVM -> {
      setDefaultThreshold(thresholdVM, paramMap, thresholdVM.getProjectId());
    });
    return thresholdPages;
  }

  /**
   * 查询阈值参数
   *
   * @return Map<String,Param>
   * @author yinglei.li
   */
  public Map<String, Param> queryThresholdParams() {
    Map<String, Param> map = new HashMap<String, Param>();
    /**客流阈值*/
    map.put(ParamConstants.ACTIVE_USER_VISIT_MINUTES,
        paramService.queryByParamKey(ParamConstants.ACTIVE_USER_VISIT_MINUTES));
    map.put(ParamConstants.JUMP_USER_VISIT_MINUTES,
        paramService.queryByParamKey(ParamConstants.JUMP_USER_VISIT_MINUTES));
    map.put(ParamConstants.PROJECT_STAY_USER_MINUTES,
        paramService.queryByParamKey(ParamConstants.PROJECT_STAY_USER_MINUTES));
    map.put(ParamConstants.HIGH_ACTIVE_BEGIN_USER_DAYS,
        paramService.queryByParamKey(ParamConstants.HIGH_ACTIVE_BEGIN_USER_DAYS));
    map.put(ParamConstants.HIGH_ACTIVE_END_USER_DAYS,
        paramService.queryByParamKey(ParamConstants.HIGH_ACTIVE_END_USER_DAYS));
    map.put(ParamConstants.MEDIUM_ACTIVE_BEGIN_USER_DAYS,
        paramService.queryByParamKey(ParamConstants.MEDIUM_ACTIVE_BEGIN_USER_DAYS));
    map.put(ParamConstants.MEDIUM_ACTIVE_END_USER_DAYS,
        paramService.queryByParamKey(ParamConstants.MEDIUM_ACTIVE_END_USER_DAYS));
    map.put(ParamConstants.LOW_ACTIVE_BEGIN_USER_DAYS,
        paramService.queryByParamKey(ParamConstants.LOW_ACTIVE_BEGIN_USER_DAYS));
    map.put(ParamConstants.LOW_ACTIVE_END_USER_DAYS,
        paramService.queryByParamKey(ParamConstants.LOW_ACTIVE_END_USER_DAYS));
    map.put(ParamConstants.SLEEP_USER_DAYS,
        paramService.queryByParamKey(ParamConstants.SLEEP_USER_DAYS));
    /**强度阈值*/
    map.put(ParamConstants.DEFAULT_BEFORE_RSSI,
        paramService.queryByParamKey(ParamConstants.DEFAULT_BEFORE_RSSI));
    map.put(ParamConstants.DEFAULT_RSSI, paramService.queryByParamKey(ParamConstants.DEFAULT_RSSI));
    map.put(ParamConstants.DEFAULT_LARGE_RSSI,
        paramService.queryByParamKey(ParamConstants.DEFAULT_LARGE_RSSI));
    map.put(ParamConstants.DEFAULT_MIDDLE_RSSI,
        paramService.queryByParamKey(ParamConstants.DEFAULT_MIDDLE_RSSI));
    map.put(ParamConstants.DEFAULT_SMALL_RSSI,
        paramService.queryByParamKey(ParamConstants.DEFAULT_SMALL_RSSI));
    /**次数阈值*/
    map.put(ParamConstants.PROJECT_STAY_TIMEOUT_MINUTES,
        paramService.queryByParamKey(ParamConstants.PROJECT_STAY_TIMEOUT_MINUTES));
    /**店员阈值*/
    map.put(ParamConstants.SALES_CONSECUTIVE_DAYS,
        paramService.queryByParamKey(ParamConstants.SALES_CONSECUTIVE_DAYS));
    map.put(ParamConstants.SALES_COME_DAYS,
        paramService.queryByParamKey(ParamConstants.SALES_COME_DAYS));
    map.put(ParamConstants.SALES_MAX_DURATION_HOURS,
        paramService.queryByParamKey(ParamConstants.SALES_MAX_DURATION_HOURS));
    /**黑名单阈值*/
    map.put(ParamConstants.BLACK_CONSECUTIVE_DAYS,
        paramService.queryByParamKey(ParamConstants.BLACK_CONSECUTIVE_DAYS));
    map.put(ParamConstants.BLACK_COME_DAYS,
        paramService.queryByParamKey(ParamConstants.BLACK_COME_DAYS));
    map.put(ParamConstants.BLACK_MAX_DURATION,
        paramService.queryByParamKey(ParamConstants.BLACK_MAX_DURATION));
    /**营业时间*/
    map.put(ParamConstants.OPENING_TIME, paramService.queryByParamKey(ParamConstants.OPENING_TIME));
    map.put(ParamConstants.CLOSING_TIME, paramService.queryByParamKey(ParamConstants.CLOSING_TIME));
    return map;
  }

  private static Map<String, String> map = new HashMap<>();

  static {
    map.put("crowdCome", ParamConstants.ACTIVE_USER_VISIT_MINUTES);
    map.put("crowdCome", ParamConstants.ACTIVE_USER_VISIT_MINUTES);
    map.put("crowdBounce", ParamConstants.JUMP_USER_VISIT_MINUTES);
    map.put("crowdStay", ParamConstants.PROJECT_STAY_USER_MINUTES);
    map.put("crowdSleep", ParamConstants.SLEEP_USER_DAYS);
    map.put("crowdActiveHighBegin", ParamConstants.HIGH_ACTIVE_BEGIN_USER_DAYS);
    map.put("crowdActiveHighEnd", ParamConstants.HIGH_ACTIVE_END_USER_DAYS);
    map.put("crowdActiveMediumBegin", ParamConstants.MEDIUM_ACTIVE_BEGIN_USER_DAYS);
    map.put("crowdActiveMediumEnd", ParamConstants.MEDIUM_ACTIVE_END_USER_DAYS);
    map.put("crowdActiveLowBegin", ParamConstants.LOW_ACTIVE_BEGIN_USER_DAYS);
    map.put("crowdActiveLowEnd", ParamConstants.LOW_ACTIVE_END_USER_DAYS);
    map.put("strengthCrowdBefore", ParamConstants.DEFAULT_BEFORE_RSSI);
    map.put("strengthCrowdCome", ParamConstants.DEFAULT_RSSI);
    map.put("frequencyIntervalTime", ParamConstants.PROJECT_STAY_TIMEOUT_MINUTES);
    map.put("salesConsecutiveDay", ParamConstants.SALES_CONSECUTIVE_DAYS);
    map.put("salesComeDay", ParamConstants.SALES_COME_DAYS);
    map.put("salesStayTime", ParamConstants.SALES_MAX_DURATION_HOURS);
    map.put("blackConsecutiveDay", ParamConstants.BLACK_CONSECUTIVE_DAYS);
    map.put("blackComeDay", ParamConstants.BLACK_COME_DAYS);
    map.put("blackStayTime", ParamConstants.BLACK_MAX_DURATION);
    map.put("openingTime", ParamConstants.OPENING_TIME);
    map.put("closingTime", ParamConstants.CLOSING_TIME);
  }

  private void setDefaultThreshold(ThresholdVM thresholdVM, Map<String, Param> thresholdParams,
      Integer projectId) {
    if (thresholdVM.getStrengthCrowdCome() == null) {
      ProjectPage projectPage = ProjectPage.builder().id(projectId).build();
      String shopSize = projectDao.queryByList(projectPage).get(0).getShopSize();
      thresholdVM.setStrengthCrowdCome(
          Integer.valueOf(getDefaultStrengthCrowdCome(shopSize)));
    }

    map.forEach((fieldName, thresholdParam) -> {
      try {
        Field field = getDeclaredField(ThresholdVM.class, fieldName);
        field.setAccessible(true);
        Object FieldValue = ReflectionUtils.getField(field, thresholdVM);
        if (FieldValue == null) {
          String value = thresholdParams.get(thresholdParam).getParamValue();
          Object fieldValue = value;
          if (field.getType() == Integer.class) {
            fieldValue = Integer.valueOf(value);
          }
          ReflectionUtils.setField(field, thresholdVM, fieldValue);
        }
      } catch (Exception e) {
        throw new RuntimeException(e);
      }
    });

  }

  private Field getDeclaredField(Class baseClass, String fieldName) {
    Class tmpClass = baseClass;
    while (tmpClass != null) {
      Field result = null;
      try {
        result = tmpClass.getDeclaredField(fieldName);
      } catch (NoSuchFieldException e) {
      }
      if (result != null) {
        return result;
      }
      tmpClass = tmpClass.getSuperclass();
    }
    throw new RuntimeException(baseClass + " no such field");
  }

  public String getDefaultStrengthCrowdCome(String shopSize) {
    String result = null;
    if (StringUtil.isNotBlank(shopSize)) {
      ShopSizeEnum shopSizeEnum = ShopSizeEnum.of(shopSize);
      result = paramMap.get(shopSizeEnum.getParamKey()).getParamValue();
    }
    if (StringUtil.isBlank(result)) {
      result = paramMap.get(ParamConstants.DEFAULT_RSSI).getParamValue();
    }
    return result;
  }
}
