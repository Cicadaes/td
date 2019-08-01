package com.talkingdata.marketing.core.vo.push;

/**
 *
 * @author armeng
 * @date 2018/01/03
 */
public class IOSAppPushPlan extends AbstractAppPushPlan {

    /**
     * 自定义声音
     */
    private String sound;

    /**
     * 应用包中声音文件名
     */
    private String soundName;

    /**
     * 数字角标
     */
    private Integer badge;

    /**
     * 推送通道 prod：APNS生产通道 dev：APNS 测试通道
     */
    private Integer prod;


    /**
     * Gets sound.
     *
     * @return the sound
     */
    public String getSound() {
        return sound;
    }

    /**
     * Sets sound.
     *
     * @param sound the sound
     */
    public void setSound(String sound) {
        this.sound = sound;
    }

    /**
     * Gets sound name.
     *
     * @return the sound name
     */
    public String getSoundName() {
        return soundName;
    }

    /**
     * Sets sound name.
     *
     * @param soundName the sound name
     */
    public void setSoundName(String soundName) {
        this.soundName = soundName;
    }

    /**
     * Gets badge.
     *
     * @return the badge
     */
    public Integer getBadge() {
        return badge;
    }

    /**
     * Sets badge.
     *
     * @param badge the badge
     */
    public void setBadge(Integer badge) {
        this.badge = badge;
    }

    /**
     * Gets prod.
     *
     * @return the prod
     */
    public Integer getProd() {
        return prod;
    }

    /**
     * Sets prod.
     *
     * @param prod the prod
     */
    public void setProd(Integer prod) {
        this.prod = prod;
    }
}
