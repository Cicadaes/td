package com.talkingdata.marketing.streaming.pipeline.exception;

/**
 * NodeOperatorException
 * Created by tend on 2017/9/28.
 * @author sheng.hong
 */
public class NodeOperatorException extends Exception {

    public NodeOperatorException(String message) {
        super(message);
    }

    public NodeOperatorException(String message, Throwable cause) {
        super(message, cause);
    }

}
