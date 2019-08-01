package com.talkingdata.marketing.web.security;

import org.springframework.security.core.AuthenticationException;

/**
 * @author chunyan.ji
 * This exception is throw in case of a not activated user trying to authenticate.
 */
public class UserNotActivatedException extends AuthenticationException {

    public UserNotActivatedException(String message) {
        super(message);
    }

    public UserNotActivatedException(String message, Throwable t) {
        super(message, t);
    }
}
