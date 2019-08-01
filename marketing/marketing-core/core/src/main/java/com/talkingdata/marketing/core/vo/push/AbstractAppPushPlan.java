package com.talkingdata.marketing.core.vo.push;

import java.util.List;

/**
 *
 * @author armeng
 * @date 2018/01/03
 */
public abstract class AbstractAppPushPlan {
    /**
     * 静默推送/透传消息
     */
    private Integer action;
    /**
     * 推送内容：A/B/C
     */
    private String groupOption;
    /**
     * 流量比
     */
    private Integer ratio;

    /**
     * 离线用户存活时间
     */
    private Integer timeToLive;

    /**
     * 扩展属性
     */
    private List<ExtendAttribute> extendAttr;

    /**
     * 消息内容
     */
    private String message;

    /**
     * Gets message.
     *
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * Sets message.
     *
     * @param message the message
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * Gets action.
     *
     * @return the action
     */
    public Integer getAction() {
        return action;
    }

    /**
     * Sets action.
     *
     * @param action the action
     */
    public void setAction(Integer action) {
        this.action = action;
    }

    /**
     * Gets group option.
     *
     * @return the group option
     */
    public String getGroupOption() {
        return groupOption;
    }

    /**
     * Sets group option.
     *
     * @param groupOption the group option
     */
    public void setGroupOption(String groupOption) {
        this.groupOption = groupOption;
    }

    /**
     * Gets ratio.
     *
     * @return the ratio
     */
    public Integer getRatio() {
        return ratio;
    }

    /**
     * Sets ratio.
     *
     * @param ratio the ratio
     */
    public void setRatio(Integer ratio) {
        this.ratio = ratio;
    }

    /**
     * Gets time to live.
     *
     * @return the time to live
     */
    public Integer getTimeToLive() {
        return timeToLive;
    }

    /**
     * Sets time to live.
     *
     * @param timeToLive the time to live
     */
    public void setTimeToLive(Integer timeToLive) {
        this.timeToLive = timeToLive;
    }

    /**
     * Gets extend attr.
     *
     * @return the extend attr
     */
    public List<ExtendAttribute> getExtendAttr() {
        return extendAttr;
    }

    /**
     * Sets extend attr.
     *
     * @param extendAttr the extend attr
     */
    public void setExtendAttr(List<ExtendAttribute> extendAttr) {
        this.extendAttr = extendAttr;
    }
}
