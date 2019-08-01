package com.talkingdata.datacloud.visual.security;

import com.talkingdata.datacloud.visual.service.report.PrivilegeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Project和DataPipeline权限判断，避免用户直接输链接访问
 * Created by tend on 2017/7/21.
 */
public class FactoryAuthenticationInterceptor extends HandlerInterceptorAdapter {

    private static final Logger logger = LoggerFactory.getLogger(FactoryAuthenticationInterceptor.class);

    @Autowired
    private PrivilegeService privilegeService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (privilegeService.isAdmin()) {
            return true;
        }
        return true;
    }



}
