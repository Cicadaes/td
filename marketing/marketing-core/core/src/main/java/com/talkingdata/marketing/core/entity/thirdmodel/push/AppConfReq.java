package com.talkingdata.marketing.core.entity.thirdmodel.push;

/**
 * The type App conf req.
 * @author xiaoming.kang
 */
public class AppConfReq {
    private String app;
    private Integer channel;
    private String pid;
    private String thirdApp;
    private String thirdKey;
    private String thirdSecret;

    /**
     * Gets app.
     *
     * @return the app
     */
    public String getApp() {
        return app;
    }

    /**
     * Sets app.
     *
     * @param app the app
     */
    public void setApp(String app) {
        this.app = app;
    }

    /**
     * Gets channel.
     *
     * @return the channel
     */
    public Integer getChannel() {
        return channel;
    }

    /**
     * Sets channel.
     *
     * @param channel the channel
     */
    public void setChannel(Integer channel) {
        this.channel = channel;
    }

    /**
     * Gets pid.
     *
     * @return the pid
     */
    public String getPid() {
        return pid;
    }

    /**
     * Sets pid.
     *
     * @param pid the pid
     */
    public void setPid(String pid) {
        this.pid = pid;
    }

    /**
     * Gets third app.
     *
     * @return the third app
     */
    public String getThirdApp() {
        return thirdApp;
    }

    /**
     * Sets third app.
     *
     * @param thirdApp the third app
     */
    public void setThirdApp(String thirdApp) {
        this.thirdApp = thirdApp;
    }

    /**
     * Gets third key.
     *
     * @return the third key
     */
    public String getThirdKey() {
        return thirdKey;
    }

    /**
     * Sets third key.
     *
     * @param thirdKey the third key
     */
    public void setThirdKey(String thirdKey) {
        this.thirdKey = thirdKey;
    }

    /**
     * Gets third secret.
     *
     * @return the third secret
     */
    public String getThirdSecret() {
        return thirdSecret;
    }

    /**
     * Sets third secret.
     *
     * @param thirdSecret the third secret
     */
    public void setThirdSecret(String thirdSecret) {
        this.thirdSecret = thirdSecret;
    }
}
