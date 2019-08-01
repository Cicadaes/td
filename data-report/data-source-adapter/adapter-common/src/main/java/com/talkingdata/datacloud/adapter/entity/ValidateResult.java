package com.talkingdata.datacloud.adapter.entity;

/**
 * Created by alvin on 17-2-9.
 */
public class ValidateResult {
    public final boolean status;
    public final String msg;
    public final String parameterName;

    public ValidateResult(boolean status, String parameterName, String errorMsg) {
        this.status = status;
        this.msg = errorMsg;
        this.parameterName=parameterName;
    }

    public static ValidateResult success(String msg) {
        return new ValidateResult(true,null, msg);
    }

    public static ValidateResult failed(String parameteName, String msg) {
        return new ValidateResult(false, parameteName,msg);
    }
}
