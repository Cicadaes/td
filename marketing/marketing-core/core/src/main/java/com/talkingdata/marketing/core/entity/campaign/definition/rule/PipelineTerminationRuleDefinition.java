package com.talkingdata.marketing.core.entity.campaign.definition.rule;

import com.talkingdata.marketing.core.entity.campaign.definition.AbstractRuleDefinition;

/**
 * pipeline 全局提前终止规则
 *
 * @author armeng
 * @create 2017 -08-21-上午11:50
 * @since JDK 1.8
 */
public class PipelineTerminationRuleDefinition extends AbstractRuleDefinition {

    /**规则表达式*/
    private String expression;

    /**
     * Gets expression.
     *
     * @return the expression
     */
    public String getExpression() {
        return expression;
    }

    /**
     * Sets expression.
     *
     * @param expression the expression
     */
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
