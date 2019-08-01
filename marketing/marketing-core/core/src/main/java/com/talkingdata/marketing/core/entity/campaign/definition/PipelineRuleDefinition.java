package com.talkingdata.marketing.core.entity.campaign.definition;

import com.talkingdata.marketing.core.entity.campaign.definition.rule.PipelineEnterRuleDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.rule.PipelineForbiddenRuleDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.rule.PipelineTerminationRuleDefinition;

/**
 * pipeline rules 封装类
 * @author tao.yang
 * @create 2017 -08-21-下午2:32
 * @since JDK 1.8
 */
public class PipelineRuleDefinition {

    /**全局提前终止规则*/
    private PipelineTerminationRuleDefinition pipelineTerminationRuleDefinition;
    /**全局进入规则*/
    private PipelineEnterRuleDefinition pipelineEnterRuleDefinition;
    /**全局禁止规则*/
    private PipelineForbiddenRuleDefinition pipelineForbiddenRuleDefinition;

    /**
     * Gets pipeline termination rule definition.
     *
     * @return the pipeline termination rule definition
     */
    public PipelineTerminationRuleDefinition getPipelineTerminationRuleDefinition() {
        return pipelineTerminationRuleDefinition;
    }

    /**
     * Sets pipeline termination rule definition.
     *
     * @param pipelineTerminationRuleDefinition the pipeline termination rule definition
     */
    public void setPipelineTerminationRuleDefinition(PipelineTerminationRuleDefinition pipelineTerminationRuleDefinition) {
        this.pipelineTerminationRuleDefinition = pipelineTerminationRuleDefinition;
    }

    /**
     * Gets pipeline enter rule definition.
     *
     * @return the pipeline enter rule definition
     */
    public PipelineEnterRuleDefinition getPipelineEnterRuleDefinition() {
        return pipelineEnterRuleDefinition;
    }

    /**
     * Sets pipeline enter rule definition.
     *
     * @param pipelineEnterRuleDefinition the pipeline enter rule definition
     */
    public void setPipelineEnterRuleDefinition(PipelineEnterRuleDefinition pipelineEnterRuleDefinition) {
        this.pipelineEnterRuleDefinition = pipelineEnterRuleDefinition;
    }

    /**
     * Gets pipeline forbidden rule definition.
     *
     * @return the pipeline forbidden rule definition
     */
    public PipelineForbiddenRuleDefinition getPipelineForbiddenRuleDefinition() {
        return pipelineForbiddenRuleDefinition;
    }

    /**
     * Sets pipeline forbidden rule definition.
     *
     * @param pipelineForbiddenRuleDefinition the pipeline forbidden rule definition
     */
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
