package com.talkingdata.datacloud.exception;

/**
 * Created by hadoop on 2017/3/17.
 */
public class DatapipelineException extends Exception {
    private String nodeId;
    private String parameterName;
    private String errorMessage;
    public DatapipelineException(String nodeId,String parameterName,String errorMessage){
        this.nodeId=nodeId;
        this.parameterName = parameterName;
        this.errorMessage = errorMessage;
    }

    public String getNodeId() {
        return nodeId;
    }

    public String getParameterName() {
        return parameterName;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}
