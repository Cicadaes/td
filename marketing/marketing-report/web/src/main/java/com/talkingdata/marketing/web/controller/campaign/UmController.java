package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.constant.SessionConstants;
import com.talkingdata.marketing.core.service.campaign.UmService;
import com.talkingdata.marketing.web.conf.SsoConf;
import com.talkingdata.marketing.web.model.PasswordParam;
import com.tendcloud.enterprise.um.umic.entity.App;
import com.tendcloud.enterprise.um.umic.entity.Role;
import com.tendcloud.enterprise.um.umic.entity.User;
import com.tendcloud.enterprise.um.umic.rmi.SecurityService;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import io.swagger.annotations.Api;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 * @author chunyan.ji
 */
@Controller
@RequestMapping(value = "/campaign")
@Api(tags = "um信息")
public class UmController extends BaseController {
    @Autowired
    private UmService umService;
    @Autowired
    private SsoConf ssoConf;

    private SecurityService securityService = UmRmiServiceFactory.getSecurityService();

    @RequestMapping(value = "/authApp", method = GET)
    @ResponseBody
    public ResponseEntity getAuthAppList(HttpServletRequest request) throws Exception {
        List<App> appList = umService.getAuthAppList(request);
        return new ResponseEntity(appList, HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/logout", method = GET)
    public ResponseEntity logout(HttpServletRequest request) throws Exception {
        String redirectUrl = getSignInURL();
        Map<String, String> result = new HashMap<>(16);
        result.put("redirectUrl", redirectUrl);
        request.getSession().invalidate();
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/rest/password", method = PUT)
    public ResponseEntity resetPassword(HttpServletRequest request, @RequestBody PasswordParam param) throws Exception {
        if (param == null || StringUtils.isBlank(param.getNewPassword()) || StringUtils.isBlank(param.getOldPassword())) {
            throw new Exception();
        }
        User user = (User) request.getSession().getAttribute(SessionConstants.SESSION_USER);
        securityService.changeUserPassword(user.getUmid(), param.getOldPassword(), param.getNewPassword());
        return new ResponseEntity(getSignInURL(), HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/user/info", method = GET)
    public ResponseEntity getUserInfo(HttpServletRequest request) throws Exception {
        User user = (User) request.getSession().getAttribute(SessionConstants.SESSION_USER);
        List<Role> roleList = (List<Role>) request.getSession().getAttribute(SessionConstants.SESSION_ROLE);
        Map<String, Object> result = new HashMap<>(16);
        if (null != user) {
            result.put("userName", user.getName());
            result.put("email", user.getEmail());
            result.put("roles", roleList);
            return new ResponseEntity(result, HttpStatus.OK);
        } else {
            return new ResponseEntity(result, HttpStatus.UNAUTHORIZED);
        }

    }

    /**
     * SSO登录URL
     *
     * @return
     * @throws UnsupportedEncodingException
     */
    private String getSignInURL() throws UnsupportedEncodingException {
        return ssoConf.getCasServerLogoutUrl() + "?service=" + URLEncoder
                .encode(ssoConf.getCasServerLoginUrl() + "?service=" + ssoConf.getSecurityUrl() + "?spring-security-redirect=", "UTF8");
    }
}
