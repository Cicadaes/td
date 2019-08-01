package com.talkingdata.datacloud.visual.util;

import com.tendcloud.enterprise.um.umic.entity.Tenant;
import com.tendcloud.enterprise.um.umic.entity.User;
import com.tendcloud.enterprise.um.umic.rmi.BusinessException;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import javax.servlet.http.HttpSession;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class UserInfoUtil {

  public final static String USER = "user";
  public final static String TENANT = "tenant";
  public final static String CURRENT_TENANT_ID = "currentTenantId";

  public static HttpSession getSession() {
    HttpSession session = ((ServletRequestAttributes) RequestContextHolder
        .getRequestAttributes()).getRequest().getSession();
    return session;
  }

  public static User getUser() {
    User user = (User) getSession().getAttribute(USER);
    return user;
  }

  public static void changeCurrentTenantId(String tenantId) {
    getSession().setAttribute(CURRENT_TENANT_ID, tenantId);
  }

  public static Tenant getTenant() {
    return (Tenant) getSession().getAttribute(TENANT);
  }

  public static Tenant getCurrentTenant() throws BusinessException {
    Integer currentTenantId = Integer.valueOf(getCurrentTenantId());
    return UmRmiServiceFactory.getSecurityService().getTenantByRId(currentTenantId);
  }

  public static String getCurrentTenantId() {
    Object currentTenantId = getSession().getAttribute(CURRENT_TENANT_ID);
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

}
