package com.talkingdata.marketing.core.entity.campaign.definition.node;

import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;

import java.util.List;

/**
 * 组件-分流
 *
 * @author armeng
 * @create 2017 -08-16-下午6:54
 * @since JDK 1.8
 */
public class SplitNodeDefinition extends AbstractNodeDefinition {
    /**类型 人数：1，占比：2，维度：3*/
    private Integer splitType;
    /**分支数量*/
    private Integer count;
    /**维度code*/
    private String dimensionCode;
    /**分支列表*/
    private List<Branch> branchList;

    /**
     * Gets split type.
     *
     * @return the split type
     */
    public Integer getSplitType() {
        return splitType;
    }

    /**
     * Sets split type.
     *
     * @param splitType the split type
     */
    public void setSplitType(Integer splitType) {
        this.splitType = splitType;
    }

    /**
     * Gets count.
     *
     * @return the count
     */
    public Integer getCount() {
        return count;
    }

    /**
     * Sets count.
     *
     * @param count the count
     */
    public void setCount(Integer count) {
        this.count = count;
    }

    /**
     * Gets dimension code.
     *
     * @return the dimension code
     */
    public String getDimensionCode() {
        return dimensionCode;
    }

    /**
     * Sets dimension code.
     *
     * @param dimensionCode the dimension code
     */
    public void setDimensionCode(String dimensionCode) {
        this.dimensionCode = dimensionCode;
    }

    /**
     * Gets branch list.
     *
     * @return the branch list
     */
    public List<Branch> getBranchList() {
        return branchList;
    }

    /**
     * Sets branch list.
     *
     * @param branchList the branch list
     */
    public void setBranchList(List<Branch> branchList) {
        this.branchList = branchList;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("SplitNodeDefinition{");
        sb.append("splitType=").append(splitType);
        sb.append(", count=").append(count);
        sb.append(", dimensionCode='").append(dimensionCode).append('\'');
        sb.append(", branchList=").append(branchList);
        sb.append('}');
        return sb.toString();
    }
}
