package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.constant.SessionConstants;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.tendcloud.enterprise.um.umic.entity.App;
import com.tendcloud.enterprise.um.umic.entity.User;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

/**
 * 用户管理权限服务
 * @author tao.yang
 */
@Service("umService")
public class UmService {
    private static final Logger logger = LoggerFactory.getLogger(UmService.class);

    @Autowired
    private ExceptionBuilder exceptionBuilder;

    /**
     * Gets auth app list.
     *
     * @param request the request
     * @return the auth app list
     * @throws Exception the exception
     */
    public List<App> getAuthAppList(ServletRequest request) throws Exception{
        HttpServletRequest request0=(HttpServletRequest) request;
        HttpSession session = request0.getSession();
        if (session == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UM_USER_NOT_LOGIN);
        }
        User user = (User) session.getAttribute(SessionConstants.SESSION_USER);
        if (user == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UM_USER_NOT_LOGIN);
        }
        List<App> authAppList = new ArrayList();
        try {

            List<App> allAuthAppList = UmRmiServiceFactory.getSecurityService().getAppByUmId(user.getUmid());
            for(App app : allAuthAppList){
                if("1".equals(app.getExtAttr3())){
                    authAppList.add(app);
                }
            }
            return authAppList;
        } catch (Exception e) {
            e.printStackTrace();
            throw exceptionBuilder.buildMktException(ExceptionMessage.UM_GET_APP_FAIL);
        }
    }
}
