package com.talkingdata.marketing.streaming.pipeline.exception;

/**
 * @author Created by tend on 2017/11/27.
 */
public class CrowdNotMatchException extends Exception {

    public CrowdNotMatchException(String message) {
        super(message);
    }

    public CrowdNotMatchException(String message, Throwable cause) {
        super(message, cause);
    }
}
