package com.talkingdata.marketing.streaming.pipeline.definition.node;

/**
 * @author Created by zmy on 9/19/2017.
 */
public class Branch {
    /**
     * 分支名称
     */
    private String name;
    /**
     * 人数最小值
     */
    private Long min;
    /**
     * 人数最大值
     */
    private Long max;
    /**
     * 分支占比
     */
    private Integer percent;
    /**
     * 维度code
     */
    private String optionCode;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getMin() {
        return min;
    }

    public void setMin(Long min) {
        this.min = min;
    }

    public Long getMax() {
        return max;
    }

    public void setMax(Long max) {
        this.max = max;
    }

    public Integer getPercent() {
        return percent;
    }

    public void setPercent(Integer percent) {
        this.percent = percent;
    }

    public String getOptionCode() {
        return optionCode;
    }

    public void setOptionCode(String optionCode) {
        this.optionCode = optionCode;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("Branch{");
        sb.append("name='").append(name).append('\'');
        sb.append(", min=").append(min);
        sb.append(", max=").append(max);
        sb.append(", percent=").append(percent);
        sb.append(", optionCode='").append(optionCode).append('\'');
        sb.append('}');
        return sb.toString();
    }
}