package com.talkingdata.marketing.core.vo.push;

import java.util.List;

/**
 *
 * @author armeng
 * @date 2018/01/03
 */
public class AppPushData extends AbstractPushData{

    /**
     * 平台：ios或android
     */
    private String platform;
    /**
     * App id
     */
    private String appid;
    /**
     * App编码
     */
    private String appCode;
    /**
     * Android推送数据集合
     */
    private List<AndroidAppPushPlan> androidData;
    /**
     * Ios推送数据集合
     */
    private List<IOSAppPushPlan> iosData;


    /**
     * Gets platform.
     *
     * @return the platform
     */
    public String getPlatform() {
        return platform;
    }

    /**
     * Sets platform.
     *
     * @param platform the platform
     */
    public void setPlatform(String platform) {
        this.platform = platform;
    }

    /**
     * Gets appid.
     *
     * @return the appid
     */
    public String getAppid() {
        return appid;
    }

    /**
     * Sets appid.
     *
     * @param appid the appid
     */
    public void setAppid(String appid) {
        this.appid = appid;
    }

    /**
     * Gets app code.
     *
     * @return the app code
     */
    public String getAppCode() {
        return appCode;
    }

    /**
     * Sets app code.
     *
     * @param appCode the app code
     */
    public void setAppCode(String appCode) {
        this.appCode = appCode;
    }

    /**
     * Gets android data.
     *
     * @return the android data
     */
    public List<AndroidAppPushPlan> getAndroidData() {
        return androidData;
    }

    /**
     * Sets android data.
     *
     * @param androidData the android data
     */
    public void setAndroidData(List<AndroidAppPushPlan> androidData) {
        this.androidData = androidData;
    }

    /**
     * Gets ios data.
     *
     * @return the ios data
     */
    public List<IOSAppPushPlan> getIosData() {
        return iosData;
    }

    /**
     * Sets ios data.
     *
     * @param iosData the ios data
     */
    public void setIosData(List<IOSAppPushPlan> iosData) {
        this.iosData = iosData;
    }
}

