package com.talkingdata.marketing.core.entity.campaign.definition.node;

/**
 *
 * @author zmy
 * @date 9/19/2017
 */
public class Branch {
    /**分支名称
     */
    private String name;
    /**人数最小值
     */
    private Long min;
    /**人数最大值
     */
    private Long max;
    /**    分支占比
     */
    private Integer percent;
    /**维度code
     */
    private String optionCode;

    /**
     * Gets name.
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets name.
     *
     * @param name the name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets min.
     *
     * @return the min
     */
    public Long getMin() {
        return min;
    }

    /**
     * Sets min.
     *
     * @param min the min
     */
    public void setMin(Long min) {
        this.min = min;
    }

    /**
     * Gets max.
     *
     * @return the max
     */
    public Long getMax() {
        return max;
    }

    /**
     * Sets max.
     *
     * @param max the max
     */
    public void setMax(Long max) {
        this.max = max;
    }

    /**
     * Gets percent.
     *
     * @return the percent
     */
    public Integer getPercent() {
        return percent;
    }

    /**
     * Sets percent.
     *
     * @param percent the percent
     */
    public void setPercent(Integer percent) {
        this.percent = percent;
    }

    /**
     * Gets option code.
     *
     * @return the option code
     */
    public String getOptionCode() {
        return optionCode;
    }

    /**
     * Sets option code.
     *
     * @param optionCode the option code
     */
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