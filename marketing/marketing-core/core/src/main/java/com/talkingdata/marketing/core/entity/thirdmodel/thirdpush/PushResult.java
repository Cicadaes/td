package com.talkingdata.marketing.core.entity.thirdmodel.thirdpush;

/**
 * The type Push result.
 * @author xiaoming.kang
 */
public class PushResult {
    private Boolean status;
    private String pushid;
    private String errorInfo;

    /**
     * Gets status.
     *
     * @return the status
     */
    public Boolean getStatus() {
        return status;
    }

    /**
     * Sets status.
     *
     * @param status the status
     */
    public void setStatus(Boolean status) {
        this.status = status;
    }

    /**
     * Gets pushid.
     *
     * @return the pushid
     */
    public String getPushid() {
        return pushid;
    }

    /**
     * Sets pushid.
     *
     * @param pushid the pushid
     */
    public void setPushid(String pushid) {
        this.pushid = pushid;
    }

    /**
     * Gets error info.
     *
     * @return the error info
     */
    public String getErrorInfo() {
        return errorInfo;
    }

    /**
     * Sets error info.
     *
     * @param errorInfo the error info
     */
    public void setErrorInfo(String errorInfo) {
        this.errorInfo = errorInfo;
    }
}
