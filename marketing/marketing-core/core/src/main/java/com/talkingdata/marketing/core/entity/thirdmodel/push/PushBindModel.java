package com.talkingdata.marketing.core.entity.thirdmodel.push;

/**
 * The type Push bind model.
 * @author xiaoming.kang
 */
public class PushBindModel {
    private Integer ratio;
    private String groupName;
    private String push;

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
     * Gets group name.
     *
     * @return the group name
     */
    public String getGroupName() {
        return groupName;
    }

    /**
     * Sets group name.
     *
     * @param groupName the group name
     */
    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    /**
     * Gets push.
     *
     * @return the push
     */
    public String getPush() {
        return push;
    }

    /**
     * Sets push.
     *
     * @param push the push
     */
    public void setPush(String push) {
        this.push = push;
    }
}
