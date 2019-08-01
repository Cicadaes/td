package com.talkingdata.datacloud.visual.util;

/**
 * Created by alvin on 17-2-9.
 */
public class ValidateResult {
    public final boolean status;
    public final String errorMsg;
    public final String parameterName;

    public ValidateResult(boolean status, String parameterName, String errorMsg) {
        this.status = status;
        this.errorMsg = errorMsg;
        this.parameterName=parameterName;
    }

    public static ValidateResult success() {
        return new ValidateResult(true,null, null);
    }

    public static ValidateResult failed(String parameteName, String msg) {
        return new ValidateResult(false, parameteName,msg);
    }
}
