package com.talkingdata.marketing.core.entity.dto;

import java.util.List;

/**
 * Created by zmy on 9/21/2017.
 * @author xiaoming.kang
 */
public class NodeCheckDto {
    private String nodeId;
    private List<String> errMsg;

    /**
     * Instantiates a new Node check dto.
     */
    public NodeCheckDto() {
    }

    /**
     * Instantiates a new Node check dto.
     *
     * @param nodeId the node id
     * @param errMsg the err msg
     */
    public NodeCheckDto(String nodeId, List<String> errMsg) {
        this.nodeId = nodeId;
        this.errMsg = errMsg;
    }

    /**
     * Gets node id.
     *
     * @return the node id
     */
    public String getNodeId() {
        return nodeId;
    }

    /**
     * Sets node id.
     *
     * @param nodeId the node id
     */
    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    /**
     * Gets err msg.
     *
     * @return the err msg
     */
    public List<String> getErrMsg() {
        return errMsg;
    }

    /**
     * Sets err msg.
     *
     * @param errMsg the err msg
     */
    public void setErrMsg(List<String> errMsg) {
        this.errMsg = errMsg;
    }
}
