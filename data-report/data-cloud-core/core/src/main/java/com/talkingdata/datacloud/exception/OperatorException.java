package com.talkingdata.datacloud.exception;

/**
 * Created by hadoop on 2017/3/17.
 */
public class OperatorException extends Exception {
    private String errorMessage ;

    public OperatorException(String errorMessage){
        this.errorMessage = errorMessage;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}
