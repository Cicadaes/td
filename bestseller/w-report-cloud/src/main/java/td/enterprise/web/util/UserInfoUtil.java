package td.enterprise.web.util;

import com.tendcloud.enterprise.um.umic.entity.AccreditUser;
import com.tendcloud.enterprise.um.umic.entity.Tenant;
import com.tendcloud.enterprise.um.umic.entity.User;
import com.tendcloud.enterprise.um.umic.rmi.BusinessException;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import javax.servlet.http.HttpSession;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import td.enterprise.common.constant.SessionConstant;

/**
 * @description: 用户登录信息工具类
 * @author: 2013-9-13
 * @version: 1.0
 * @modify:
 */
public class UserInfoUtil {

  public static HttpSession getSession() {
    HttpSession session = ((ServletRequestAttributes) RequestContextHolder
        .getRequestAttributes()).getRequest().getSession();
    return session;
  }

  /**
   * 将用户信息放到缓存中
   */
  public static void setUser(User user) {

  }

  /**
   * 获取缓存中的用户信息
   */
  public static User getUser() {
    User user = (User) getSession().getAttribute("user");
    return user;
  }

  public static Tenant getTenant() {
    return (Tenant) getSession().getAttribute("tenant");
  }

  public static Tenant getCurrentTenant() throws BusinessException {
    Integer currentTenantId = Integer.valueOf(getCurrentTenantId());
    return UmRmiServiceFactory.getSecurityService().getTenantByRId(currentTenantId);
  }

  public static void changeCurrentTenantId(String tenantId) {
    getSession().setAttribute(SessionConstant.CURRENT_TENANT_ID, tenantId);
  }

  public static String getCurrentTenantId() {
    Object currentTenantId = getSession().getAttribute(SessionConstant.CURRENT_TENANT_ID);
    if (currentTenantId != null) {
      return currentTenantId.toString();
    }
    Integer tenantId = getUser().getTenantId();
    if (tenantId != null) {
      return tenantId.toString();
    }
    return null;
  }

  public static String getCurrentUserTenantId() {
    return String.valueOf(getUser().getTenantId());
  }

  /**
   * 获取缓存中的accredit授权用户信息
   */
  public static AccreditUser getAccreditUser() {
    return (AccreditUser) getSession().getAttribute("accreditUser");
  }

  /**
   * 获取登录用户英文名
   */
  public static String getLoginName() {
    String loginName = "";
    User user = getUser();
    if (user != null) {
      loginName = user.getLoginName();
    }
    return loginName;
  }

  /**
   * 获取登录用户中文名
   */
  public static String getCNName() {
    String name = "";
    User user = getUser();
    if (user != null) {
      name = user.getName();
    }
    return name;
  }

  public static String getUserName() {
    String name = "";
    User user = getUser();
    if (user != null) {
      name = user.getUserName();
    }
    return name;
  }
}
