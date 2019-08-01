package com.talkingdata.marketing.core.entity.admin.extend;

import com.talkingdata.marketing.core.entity.admin.FunnelStepConditionDefinition;
import com.talkingdata.marketing.core.entity.admin.FunnelStepDefinition;
import java.util.List;

/**
 * The type Funnel step definition ext.
 * @author tao.yang
 * @create 2017 -05-02-下午2:26
 * @since JDK 1.8
 */
public class FunnelStepDefinitionExt extends FunnelStepDefinition {

    private List<FunnelStepConditionDefinition> funnelStepConditionDefinitions;

    /**
     * Gets funnel step condition definitions.
     *
     * @return the funnel step condition definitions
     */
    public List<FunnelStepConditionDefinition> getFunnelStepConditionDefinitions() {
        return funnelStepConditionDefinitions;
    }

    /**
     * Sets funnel step condition definitions.
     *
     * @param funnelStepConditionDefinitions the funnel step condition definitions
     */
    public void setFunnelStepConditionDefinitions(List<FunnelStepConditionDefinition> funnelStepConditionDefinitions) {
        this.funnelStepConditionDefinitions = funnelStepConditionDefinitions;
    }
}
