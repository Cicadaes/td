package com.talkingdata.datacloud.visual.config;


import com.talkingdata.datacloud.visual.util.UserInfoUtil;
import com.tendcloud.enterprise.um.umic.entity.ExtResource;
import com.tendcloud.enterprise.um.umic.entity.Role;
import com.tendcloud.enterprise.um.umic.entity.Tenant;
import com.tendcloud.enterprise.um.umic.entity.User;
import com.tendcloud.enterprise.um.umic.rmi.BusinessException;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import com.tendcloud.enterprise.um.umic.util.MenuUtil;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.security.cas.authentication.CasAuthenticationToken;
import org.springframework.util.Assert;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.security.Principal;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * 菜单初始化 获取用户信息 获取资源类型信息，把权限信息放入session <br/>
 *
 *
 * session描述 <br/> key:user 用户在um上维护的详细信息 <br/> key:roleList 当前登陆用户在当前应用系统的角色信息 <br/> key:menuList
 * 系统的菜单详细信息 <br/> key:UserACL 系统的按钮信息 <br/> key:authList 登陆用户的权限信息 <br/>
 *
 *
 * application描述 <br/> appcode：系统编码 <br/> apptaken：系统令牌 <br/>
 *
 * filter的用户描述如下（上面的配置信息在web.xml中配置，所实现的全部功能都有配置）	 <br/> 配置可在部署项目的classpath下的文件sysConfig.properties中进行覆盖配置
 * key即为param-name；value为param-value，如果这个文件中配置会把web.xml中的配置给覆盖掉 1：appcode 必须配置 是在um系统中所维护的系统编码
 * <br/> 2：apptaken 必须配置 是在um系统中所维护的系统令牌	 <br/> 3：menu 必须配置 是在um系统中所维护的资源类型中菜单code	 <br/> 4：button
 * 必须配置 是在um系统中所维护的资源类型中按钮code	 <br/> 5：typeList 非必须配置 参数为在um系统中维护的资源类型编码
 * ，如果多个用英文“,”号隔开，配置后，系统会根据放在session中，key为资源类型编码， 如上：会在session中有MENU,BUTTON,TEST三个值	 <br/>
 *
 * @author changpengfei
 */
public class MenuFilter implements Filter {

  private static final String SESSION_USER_FLAG = "user";

  public static String dcdsdata;

  public static Logger logger = Logger.getLogger(MenuFilter.class);

  public String apptaken = "";

  public String appcode = "";

  public String typeList = "";

  public String menu = "";

  public String button;

  @Override
  public void destroy() {
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
      throws IOException, ServletException {
    HttpServletRequest request0 = (HttpServletRequest) request;
    Principal principal = request0.getUserPrincipal();
    HttpSession session = request0.getSession();
    User user = (User) session.getAttribute(SESSION_USER_FLAG);
    if (user == null && principal != null && principal instanceof CasAuthenticationToken) {

      CasAuthenticationToken p = (CasAuthenticationToken) principal;
      user = new User();
      //得到当前用户
      try {
        user = UmRmiServiceFactory.getSecurityService().getUserByUmId(
            p.getUserDetails().getUsername() == null ? null : p.getUserDetails().getUsername());
      } catch (BusinessException e) {
        e.printStackTrace();
        logger.error("获取用户失败");
      }
      //得到当前租户
      try {
        Tenant tenant = UmRmiServiceFactory.getSecurityService().getTenantByRId(user.getTenantId());
        session.setAttribute("tenant", tenant);
        if (tenant != null && user.getUmid().equals(tenant.getAdminEmail())) {
          user.setTenantAdmin(true);
        }
      } catch (BusinessException e) {
        e.printStackTrace();
        logger.error("获取租户失败");
      }
      session.setAttribute("user", user);
      session.setAttribute(UserInfoUtil.CURRENT_TENANT_ID, user.getTenantId());
      ServletContext application = request0.getSession().getServletContext();
      application.setAttribute("apptaken", apptaken);
      application.setAttribute("appcode", appcode);
      application.setAttribute("menu", menu);
      application.setAttribute("button", button);
    }

    // 获取用户资源，从login逻辑借鉴而来
    boolean isInited = session.getAttribute("isInited") == null ? false : (Boolean) session
        .getAttribute("isInited");
    int num = 0;
    //初始化菜单按钮，用户自定义type列表，用户拥有的角色，并放入session
    while (num < 3 && !isInited) {
      try {
        session.setAttribute("isInited", true);
        List<LinkedHashMap<String, Object>> list = UmRmiServiceFactory.getSecurityService()
            .getAuthMenu(appcode, menu, user.getUmid(), apptaken);
        List<LinkedHashMap<String, Object>> buttonlist = UmRmiServiceFactory.getSecurityService()
            .getAuthMenu(appcode, button, user.getUmid(), apptaken);
        MenuUtil.getTree(list, request0.getSession(), buttonlist);

        //用户自定义type列表 放入session
        if (!StringUtils.isBlank(typeList)) {
          String[] types = typeList.split(",");
          for (String type : types) {
            List<LinkedHashMap<String, Object>> typelist = UmRmiServiceFactory.getSecurityService()
                .getAuthMenu(appcode, type, user.getUmid(), apptaken);
            List<ExtResource> typeList2 = MenuUtil.formateToMenu(typelist);
            session.setAttribute(type, typeList2);
          }
        }

        //用户拥有的角色放入session
        List<Role> roleList = UmRmiServiceFactory.getSecurityService()
            .getRolesByUmid(user.getUmid(), appcode);
        session.setAttribute("roleList", roleList);
        isInited = true;
      } catch (Exception e) {
        break;
//                num++;
//                logger.error("系统菜单初始化失败",e);
      }

    }

    filterChain.doFilter(request, response);

  }


  @Override
  public void init(FilterConfig arg0) throws ServletException {

    this.apptaken = arg0.getInitParameter("apptaken");
    this.appcode = arg0.getInitParameter("appcode");
    this.menu = arg0.getInitParameter("menu");
    this.button = arg0.getInitParameter("button");
    this.typeList = arg0.getInitParameter("typeList");

    Assert.notNull(appcode, "web.xml或者sysConfig中appcode没有配置");
    Assert.notNull(apptaken, "web.xml或者sysConfig中apptaken没有配置");
    Assert.notNull(menu, "web.xml或者sysConfig中menu没有配置");
    Assert.notNull(button, "web.xml或者sysConfig中button没有配置");
  }

}
