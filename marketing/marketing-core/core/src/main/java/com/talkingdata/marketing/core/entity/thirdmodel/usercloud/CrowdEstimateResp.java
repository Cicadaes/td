package com.talkingdata.marketing.core.entity.thirdmodel.usercloud;

/**
 * The type Crowd estimate resp.
 * @author xiaoming.kang
 */
public class CrowdEstimateResp {
    private Integer phoneNum;
    private Integer IMEI;
    private Integer tdId;
    private Integer AndroidId;
    private Integer MAC;
    private Integer IDFA;

    /**
     * Gets phone num.
     *
     * @return the phone num
     */
    public Integer getPhoneNum() {
        return phoneNum;
    }

    /**
     * Sets phone num.
     *
     * @param phoneNum the phone num
     */
    public void setPhoneNum(Integer phoneNum) {
        this.phoneNum = phoneNum;
    }

    /**
     * Gets imei.
     *
     * @return the imei
     */
    public Integer getIMEI() {
        return IMEI;
    }

    /**
     * Sets imei.
     *
     * @param IMEI the imei
     */
    public void setIMEI(Integer IMEI) {
        this.IMEI = IMEI;
    }

    /**
     * Gets td id.
     *
     * @return the td id
     */
    public Integer getTdId() {
        return tdId;
    }

    /**
     * Sets td id.
     *
     * @param tdId the td id
     */
    public void setTdId(Integer tdId) {
        this.tdId = tdId;
    }

    /**
     * Gets android id.
     *
     * @return the android id
     */
    public Integer getAndroidId() {
        return AndroidId;
    }

    /**
     * Sets android id.
     *
     * @param androidId the android id
     */
    public void setAndroidId(Integer androidId) {
        AndroidId = androidId;
    }

    /**
     * Gets mac.
     *
     * @return the mac
     */
    public Integer getMAC() {
        return MAC;
    }

    /**
     * Sets mac.
     *
     * @param MAC the mac
     */
    public void setMAC(Integer MAC) {
        this.MAC = MAC;
    }

    /**
     * Gets idfa.
     *
     * @return the idfa
     */
    public Integer getIDFA() {
        return IDFA;
    }

    /**
     * Sets idfa.
     *
     * @param IDFA the idfa
     */
    public void setIDFA(Integer IDFA) {
        this.IDFA = IDFA;
    }
}
