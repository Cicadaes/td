package com.talkingdata.marketing.streaming.pipeline.definition.node;

import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;

import java.util.List;

/**
 * 组件-过滤器
 *
 * @author 2017-08-16-下午5:38
 * @since JDK 1.8
 */
public class FilterNodeDefinition extends AbstractNodeDefinition {
    /**
     * 过滤表达式
     */
    private List<String> tagRowKeyList;

    /**
     * 过滤条件之间的关系
     */
    private String relation;

    public List<String> getTagRowKeyList() {
        return tagRowKeyList;
    }

    public void setTagRowKeyList(List<String> tagRowKeyList) {
        this.tagRowKeyList = tagRowKeyList;
    }

    public String getRelation() {
        return relation;
    }

    public void setRelation(String relation) {
        this.relation = relation;
    }

    @Override
    public String toString() {
        return "FilterNodeDefinition{" +
                "tagRowKeyList=" + tagRowKeyList +
                ", relation='" + relation + '\'' +
                '}';
    }
}
