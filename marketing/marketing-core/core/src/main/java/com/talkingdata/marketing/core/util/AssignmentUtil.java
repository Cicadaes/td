package com.talkingdata.marketing.core.util;

import com.talkingdata.marketing.core.constant.SessionConstants;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.tendcloud.enterprise.um.umic.entity.Tenant;
import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.commons.lang.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;

/**
 * The type Assignment util.
 * @author hongsheng
 */
public class AssignmentUtil {

    /**
     * Sets info.
     *
     * @param <T>     the type parameter
     * @param obj     the obj
     * @param request the request
     * @return the info
     * @throws Exception the exception
     */
    public static <T> T setInfo(T obj, HttpServletRequest request) throws Exception {
        ExceptionBuilder exceptionBuilder = (ExceptionBuilder)SpringContextUtil.getBean("exceptionBuilder");
        User user = (User) request.getSession().getAttribute(SessionConstants.SESSION_USER);
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        if (user == null || tenant == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_NOT_EXIST);
        }
        Class clazz = obj.getClass();
        Method fieldSetTenantId = clazz.getMethod("setTenantId", String.class);
        if (StringUtils.isEmpty(tenant.getCaCode())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_TENANT_NOT_EXIST);
        }
        fieldSetTenantId.invoke(obj, tenant.getCaCode());
        Method fieldSetCreator = clazz.getMethod("setCreator", String.class);
        if (StringUtils.isEmpty(user.getUserName())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_EMAIL_NOT_EXIST);
        }
        fieldSetCreator.invoke(obj, user.getUserName());
        Method fieldSetCreateBy = clazz.getMethod("setCreateBy", String.class);
        if (StringUtils.isEmpty(user.getUmid())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_NAME_NOT_EXIST);
        }
        fieldSetCreateBy.invoke(obj, user.getUmid());
        return obj;
    }

    /**
     * Sets update basic info.
     *
     * @param <T>     the type parameter
     * @param t       the t
     * @param request the request
     * @throws Exception the exception
     */
    public static <T> void setUpdateBasicInfo(T t, HttpServletRequest request) throws Exception{
        ExceptionBuilder exceptionBuilder = (ExceptionBuilder)SpringContextUtil.getBean("exceptionBuilder");
        User user = (User) request.getSession().getAttribute(SessionConstants.SESSION_USER);
        Tenant tenant = (Tenant) request.getSession().getAttribute(SessionConstants.SESSION_TENANT);
        if (user == null || tenant == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_NOT_EXIST);
        }
        Class clazz = t.getClass();
        Method fieldSetTenantId = clazz.getMethod("setTenantId", String.class);
        if (StringUtils.isEmpty(tenant.getCaCode())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_TENANT_NOT_EXIST);
        }
        fieldSetTenantId.invoke(t, tenant.getCaCode());
        Method fieldSetCreator = clazz.getMethod("setUpdater", String.class);
        if (StringUtils.isEmpty(user.getUserName())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_EMAIL_NOT_EXIST);
        }
        fieldSetCreator.invoke(t, user.getUserName());
        Method fieldSetCreateBy = clazz.getMethod("setUpdateBy", String.class);
        if (StringUtils.isEmpty(user.getUmid())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_NAME_NOT_EXIST);
        }
        fieldSetCreateBy.invoke(t, user.getUmid());

    }

}
