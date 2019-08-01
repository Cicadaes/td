package com.talkingdata.marketing.core.entity.thirdmodel.push;

import java.util.Map;

/**
 * The type Message.
 * 该类不允许使用,与push的交互类
 * @author xiaoming.kang
 */
public class Message {
    /**"a" "b" "c" test
	*/
    private String groupOption;
    /**"a" "b" "c" (1-100) ab test 比例
	*/
    private Integer ratio;
    /**标题
	*/
    private String title;
    /**内容
	*/
    private String content;
    /** 铃声 0=不响铃 1=响铃
	*/
    private Integer sound;
    /**拓展参数
	*/
    private Map<String, String> ex;
    /**iOS 声音文件名称
	*/
    private String  soundName;
    /**iOS 角标 整数
	*/
    private Integer badge;
    /**iOS 0 dev 1 prod
	*/
    private Integer prod;
    	/**android 0=可删除 1=不可
	*/
    private Integer clearable;
    /**android 0=不振动 1=振动
	*/
    private Integer vibrate;
    /**android 0=不唤醒 1=唤醒
	*/
    private Integer wakeup;
    /**android 2 getui 5 jpush
	*/
    private Integer channel;
    /**android true 启动小米增强通道
	*/
    private Boolean xiaomi;
    /**android true 启动华为增强通道
	*/
    private Boolean huawei;
    /**缓存时间 单位小时
	*/
    private Integer ttl;
    /**0:android透传,ios静默推送  2:非透传
	*/
    private Integer action;

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
     * Gets content.
     *
     * @return the content
     */
    public String getContent() {
        return content;
    }

    /**
     * Sets content.
     *
     * @param content the content
     */
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * Gets ex.
     *
     * @return the ex
     */
    public Map<String, String> getEx() {
        return ex;
    }

    /**
     * Sets ex.
     *
     * @param ex the ex
     */
    public void setEx(Map<String, String> ex) {
        this.ex = ex;
    }

    /**
     * Gets sound.
     *
     * @return the sound
     */
    public Integer getSound() {
        return sound;
    }

    /**
     * Sets sound.
     *
     * @param sound the sound
     */
    public void setSound(Integer sound) {
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
     * Is xiaomi boolean.
     *
     * @return the boolean
     */
    public Boolean isXiaomi() {
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
     * Is huawei boolean.
     *
     * @return the boolean
     */
    public Boolean isHuawei() {
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
     * Gets ttl.
     *
     * @return the ttl
     */
    public Integer getTtl() {
        return ttl;
    }

    /**
     * Sets ttl.
     *
     * @param ttl the ttl
     */
    public void setTtl(Integer ttl) {
        this.ttl = ttl;
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
}
