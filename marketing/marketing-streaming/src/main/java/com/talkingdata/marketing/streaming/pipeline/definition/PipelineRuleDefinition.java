package com.talkingdata.marketing.streaming.pipeline.definition;


import com.talkingdata.marketing.streaming.pipeline.definition.rule.PipelineEnterRuleDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.rule.PipelineForbiddenRuleDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.rule.PipelineTerminationRuleDefinition;

/**
 * pipeline rules 封装类
 *
 * @create 2017-08-21-下午2:32
 * @since JDK 1.8
 * @author sheng.hong
 */
public class PipelineRuleDefinition {

    /**全局提前终止规则*/
    private PipelineTerminationRuleDefinition pipelineTerminationRuleDefinition;
    /**全局进入规则*/
    private PipelineEnterRuleDefinition pipelineEnterRuleDefinition;
    /**全局禁止规则*/
    private PipelineForbiddenRuleDefinition pipelineForbiddenRuleDefinition;

    public PipelineTerminationRuleDefinition getPipelineTerminationRuleDefinition() {
        return pipelineTerminationRuleDefinition;
    }

    public void setPipelineTerminationRuleDefinition(PipelineTerminationRuleDefinition pipelineTerminationRuleDefinition) {
        this.pipelineTerminationRuleDefinition = pipelineTerminationRuleDefinition;
    }

    public PipelineEnterRuleDefinition getPipelineEnterRuleDefinition() {
        return pipelineEnterRuleDefinition;
    }

    public void setPipelineEnterRuleDefinition(PipelineEnterRuleDefinition pipelineEnterRuleDefinition) {
        this.pipelineEnterRuleDefinition = pipelineEnterRuleDefinition;
    }

    public PipelineForbiddenRuleDefinition getPipelineForbiddenRuleDefinition() {
        return pipelineForbiddenRuleDefinition;
    }

    public void setPipelineForbiddenRuleDefinition(PipelineForbiddenRuleDefinition pipelineForbiddenRuleDefinition) {
        this.pipelineForbiddenRuleDefinition = pipelineForbiddenRuleDefinition;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("PipelineRuleDefinition{");
        sb.append("pipelineTerminationRuleDefinition=").append(pipelineTerminationRuleDefinition);
        sb.append(", pipelineEnterRuleDefinition=").append(pipelineEnterRuleDefinition);
        sb.append(", pipelineForbiddenRuleDefinition=").append(pipelineForbiddenRuleDefinition);
        sb.append('}');
        return sb.toString();
    }
}
