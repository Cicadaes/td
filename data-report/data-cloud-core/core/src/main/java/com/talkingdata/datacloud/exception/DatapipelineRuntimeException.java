package com.talkingdata.datacloud.exception;

/**
 * Created by hadoop on 2017/3/17.
 */
public class DatapipelineRuntimeException extends RuntimeException {
    private String nodeId;
    private String message;

    public DatapipelineRuntimeException(String message) {
        this.message = message;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getNodeId() {
        return nodeId;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
