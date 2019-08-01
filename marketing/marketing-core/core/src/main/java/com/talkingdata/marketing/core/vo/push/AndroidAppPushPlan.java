package com.talkingdata.marketing.core.vo.push;

/**
 *
 * @author armeng
 * @date 2018/01/03
 */
public class AndroidAppPushPlan extends AbstractAppPushPlan {

    /**
     * 震动提示
     */
    private Integer vibrate;
    /**
     * 唤醒屏幕
     */
    private Integer wakeup;
    /**
     * 消息标题
     */
    private String title;
    /**
     * 小米增强通道
     */
    private Boolean xiaomi;
    /**
     * 华为增强通道
     */
    private Boolean huawei;
    /**
     * App推送渠道编码  td：TD推送
     */
    private String appPushChannelCode;

    /**
     * 让本条推送消息可删除   0是不可删除,1是可删除
     */
    private Integer clearable;

    /**
     * Gets clearable.
     *
     * @return the clearable
     */
    public Integer getClearable() {
        return clearable;
    }

    /**
     * Sets clearable.
     *
     * @param clearable the clearable
     */
    public void setClearable(Integer clearable) {
        this.clearable = clearable;
    }

    /**
     * Gets vibrate.
     *
     * @return the vibrate
     */
    public Integer getVibrate() {
        return vibrate;
    }

    /**
     * Sets vibrate.
     *
     * @param vibrate the vibrate
     */
    public void setVibrate(Integer vibrate) {
        this.vibrate = vibrate;
    }

    /**
     * Gets wakeup.
     *
     * @return the wakeup
     */
    public Integer getWakeup() {
        return wakeup;
    }

    /**
     * Sets wakeup.
     *
     * @param wakeup the wakeup
     */
    public void setWakeup(Integer wakeup) {
        this.wakeup = wakeup;
    }

    /**
     * Gets title.
     *
     * @return the title
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets title.
     *
     * @param title the title
     */
    public void setTitle(String title) {
        this.title = title;
    }


    /**
     * Gets xiaomi.
     *
     * @return the xiaomi
     */
    public Boolean getXiaomi() {
        return xiaomi;
    }

    /**
     * Sets xiaomi.
     *
     * @param xiaomi the xiaomi
     */
    public void setXiaomi(Boolean xiaomi) {
        this.xiaomi = xiaomi;
    }

    /**
     * Gets huawei.
     *
     * @return the huawei
     */
    public Boolean getHuawei() {
        return huawei;
    }

    /**
     * Sets huawei.
     *
     * @param huawei the huawei
     */
    public void setHuawei(Boolean huawei) {
        this.huawei = huawei;
    }


    /**
     * Gets app push channel code.
     *
     * @return the app push channel code
     */
    public String getAppPushChannelCode() {
        return appPushChannelCode;
    }

    /**
     * Sets app push channel code.
     *
     * @param appPushChannelCode the app push channel code
     */
    public void setAppPushChannelCode(String appPushChannelCode) {
        this.appPushChannelCode = appPushChannelCode;
    }
}
