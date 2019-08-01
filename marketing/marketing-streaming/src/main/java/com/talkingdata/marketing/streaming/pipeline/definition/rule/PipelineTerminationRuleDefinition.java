package com.talkingdata.marketing.streaming.pipeline.definition.rule;


import com.talkingdata.marketing.streaming.pipeline.definition.AbstractRuleDefinition;

/**
 * pipeline 全局提前终止规则
 * @author sheng.hong
 * @create 2017-08-21-上午11:50
 * @since JDK 1.8
 */
public class PipelineTerminationRuleDefinition extends AbstractRuleDefinition {

    /**规则表达式*/
    private String expression;

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("PipelineTerminationRuleDefinition{");
        sb.append("expression='").append(expression).append('\'');
        sb.append(", AbstractRuleDefinition=").append(super.toString());
        sb.append('}');
        return sb.toString();
    }
}
