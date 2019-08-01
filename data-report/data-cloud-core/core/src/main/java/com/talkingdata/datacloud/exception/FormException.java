package com.talkingdata.datacloud.exception;

/**
 * Created by hadoop on 2017/4/10.
 */
public class FormException extends Exception {

    private String errorField;

    private String errorMessage ;

    public FormException(String errorField,String errorMessage){
        this.errorField = errorField;
        this.errorMessage = errorMessage;
    }

    public String getErrorField() {
        return errorField;
    }
    
    @Override
    public String getMessage() {
        return errorMessage;
    }

}