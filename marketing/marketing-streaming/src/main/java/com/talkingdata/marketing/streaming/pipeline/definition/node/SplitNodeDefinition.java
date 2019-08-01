package com.talkingdata.marketing.streaming.pipeline.definition.node;


import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;

import java.util.List;

/**
 * 组件-分流
 *
 * @create 2017-08-16-下午6:54
 * @since JDK 1.8
 * @author sheng.hong
 */
public class SplitNodeDefinition extends AbstractNodeDefinition {
    /**
     * 分流类型 人数
     */
    public final static int NODE_SPLIT_TYPE_NUMBER = 1;
    /**
     * 分流类型  占比
     */
    public final static int NODE_SPLIT_TYPE_PERCENT = 2;
    /**
     * 分流类型  维度
     */
    public final static int NODE_SPLIT_TYPE_DIMENSION = 3;
    /**
     * 类型 人数：1，占比：2，维度：3
     */
    private Integer splitType;
    /**
     * 分支数量
     */
    private Integer count;
    /**
     * 维度Code
     */
    private String dimensionCode;
    /**
     * 分支列表
     */
    private List<Branch> branchList;

    public Integer getSplitType() {
        return splitType;
    }

    public void setSplitType(Integer splitType) {
        this.splitType = splitType;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public String getDimensionCode() {
        return dimensionCode;
    }

    public void setDimensionCode(String dimensionCode) {
        this.dimensionCode = dimensionCode;
    }

    public List<Branch> getBranchList() {
        return branchList;
    }

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
