package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import java.io.Serializable;
import java.util.Map;

/**
 * The type Definition.
 * @author xiaoming.kang
 */
public class Definition  implements Serializable {
    private Filter filter;
    private Map<String, Condition> condition;

    /**
     * Instantiates a new Definition.
     */
    public Definition() {
    }

    /**
     * Instantiates a new Definition.
     *
     * @param filter    the filter
     * @param condition the condition
     */
    public Definition(Filter filter, Map<String, Condition> condition) {
        this.filter = filter;
        this.condition = condition;
    }

    /**
     * Gets filter.
     *
     * @return the filter
     */
    public Filter getFilter() {
        return filter;
    }

    /**
     * Sets filter.
     *
     * @param filter the filter
     */
    public void setFilter(Filter filter) {
        this.filter = filter;
    }

    /**
     * Gets condition.
     *
     * @return the condition
     */
    public Map<String, Condition> getCondition() {
        return condition;
    }

    /**
     * Sets condition.
     *
     * @param condition the condition
     */
    public void setCondition(Map<String, Condition> condition) {
        this.condition = condition;
    }
}
