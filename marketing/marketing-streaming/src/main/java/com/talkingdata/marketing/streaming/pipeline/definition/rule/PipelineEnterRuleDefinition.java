package com.talkingdata.marketing.streaming.pipeline.definition.rule;


import com.talkingdata.marketing.streaming.pipeline.definition.AbstractRuleDefinition;

/**
 * pipeline 全局进入规则
 *
 * @create 2017-08-21-上午11:51
 * @since JDK 1.8
 * @author sheng.hong
 */
public class PipelineEnterRuleDefinition extends AbstractRuleDefinition {

    /**
     * 是否受限,默认无限制
     * 1.如果受限则,限制条件为频率和次数
     * 2.限制的对象为同一用户
     */
    private Boolean unlimited = true;
    /**频率限制(单位：天)*/
    private Integer lessThanDays;
    /**次数限制*/
    private Integer lessThanTimes;

    public Boolean getUnlimited() {
        return unlimited;
    }

    public void setUnlimited(Boolean unlimited) {
        this.unlimited = unlimited;
    }

    public Integer getLessThanDays() {
        return lessThanDays;
    }

    public void setLessThanDays(Integer lessThanDays) {
        this.lessThanDays = lessThanDays;
    }

    public Integer getLessThanTimes() {
        return lessThanTimes;
    }

    public void setLessThanTimes(Integer lessThanTimes) {
        this.lessThanTimes = lessThanTimes;
    }


    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("PipelineEnterRuleDefinition{");
        sb.append("unlimited=").append(unlimited);
        sb.append(", lessThanDays=").append(lessThanDays);
        sb.append(", lessThanTimes=").append(lessThanTimes);
        sb.append(", AbstractRuleDefinition=").append(super.toString());
        sb.append('}');
        return sb.toString();
    }
}
