package com.talkingdata.marketing.streaming.pipeline.definition.rule;

import com.talkingdata.marketing.streaming.pipeline.definition.AbstractRuleDefinition;

/**
 * pipeline 全局禁止规则
 *
 * @create 2017-08-21-上午11:51
 * @since JDK 1.8
 * @author sheng.hong
 */
public class PipelineForbiddenRuleDefinition extends AbstractRuleDefinition {

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
        final StringBuffer sb = new StringBuffer("PipelineForbiddenRuleDefinition{");
        sb.append("expression='").append(expression).append('\'');
        sb.append(", AbstractRuleDefinition=").append(super.toString());
        sb.append('}');
        return sb.toString();
    }
}
