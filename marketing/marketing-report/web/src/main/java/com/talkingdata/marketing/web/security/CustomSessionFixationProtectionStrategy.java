package com.talkingdata.marketing.web.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.session.SessionFixationProtectionStrategy;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author chunyan.ji
 * Created by jgribonvald on 31/05/16.
 */
public class CustomSessionFixationProtectionStrategy extends SessionFixationProtectionStrategy {

    @Override
    public void onAuthentication(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        super.onAuthentication(authentication, request, response);
        ((AbstractAuthenticationToken)authentication).setDetails(new RememberWebAuthenticationDetails(request));
    }

}
