package com.talkingdata.datacloud.visual.controller.report;


import com.alibaba.fastjson.JSONObject;
import com.talkingdata.datacloud.visual.service.report.PrivilegeService;
import com.tendcloud.enterprise.um.umic.entity.ExtResource;
import com.tendcloud.enterprise.um.umic.entity.User;
import com.tendcloud.enterprise.um.umic.rmi.BusinessException;
import com.tendcloud.enterprise.um.umic.rmi.SecurityService;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Ocean on 2017/1/9.
 */
@Controller
@RequestMapping("/user")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    /**
     * UM权限获取服务
     */
    private SecurityService securityService = UmRmiServiceFactory.getSecurityService();
    @Autowired
    private PrivilegeService privilegeService;
//    @Value("#{configProperties['typeList']}")
//    private String typeList;
//    @Value("#{configProperties['sso.client.casServerLogoutUrl']}")
//    private String logoutUrl;
//    @Value("#{configProperties['sso.client.casServerLoginUrl']}")
//    private String loginUrl;

    @Value(value = "${typeList}")
    private String typeList;
    @Value(value = "${cas.service.logout}")
    private String logoutUrl;
    @Value(value = "${cas.service.login}")
    String loginUrl;

    @RequestMapping(value="info",method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Map<String,Object> getUserSessionInfo(HttpServletRequest request) throws BusinessException {
        Map<String,Object> userSession = new HashMap<>();
        HttpSession session = request.getSession();
        String umid = request.getUserPrincipal().getName();
        User user = securityService.getUserByUmId(umid);
        List<ExtResource> privilegeList = (List<ExtResource>)session.getAttribute("menuList");
        List<ExtResource> buttonList = (List<ExtResource>)session.getAttribute("UserACL");
        userSession.put("loginUser",umid);
        userSession.put("userName",user.getUserName());
        userSession.put("userId",user.getId());
        userSession.put("privilegeList",privilegeList);
        userSession.put("buttonList",buttonList);
        return userSession;
    }

    @RequestMapping(value="logout",method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Map<String, String> getLogoutPrefix(HttpServletRequest request) {
        request.getSession().invalidate();
        Map<String, String> result = new HashMap<>();
        String context = request.getContextPath();
        result.put("logOutUrlPrefix",logoutUrl+"?service="+loginUrl+"?service=");
        result.put("redirect",context+"/j_spring_cas_security_check?spring-security-redirect=");
        return result ;
    }

    @RequestMapping(value="login",method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Map<String, String> getLoginPrefix(HttpServletRequest request) {
//        request
        Map<String, String> result = new HashMap<>();
        String context = request.getContextPath();
//        result.put("loginUrlPrefix",loginUrl+"?service=");
        result.put("service",loginUrl+"?service=");
        result.put("redirect",context+"/j_spring_cas_security_check?spring-security-redirect=");
        return result ;
    }


    @RequestMapping(value = "userPassword", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    @ResponseBody
    public Object editPassword(@RequestBody JSONObject jsonObject,HttpServletRequest request) throws Exception {
        String oldPassword = jsonObject.getString("oldPassword");
        String newPassword = jsonObject.getString("newPassword");
        securityService.changeUserPassword(privilegeService.getUserByRequest(request).getUmid(),oldPassword,newPassword);
        return new HashMap(){{put("status","ok");}};
    }
}
