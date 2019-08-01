package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import java.io.Serializable;
import java.util.List;

/**
 * The type Bool filter.
 * @author xiaoming.kang
 */
public class BoolFilter implements Serializable {
    private List<Qualifier> must;
    private List<Qualifier> mustNot;

    /**
     * Instantiates a new Bool filter.
     */
    public BoolFilter() {
    }

    /**
     * Instantiates a new Bool filter.
     *
     * @param must the must
     */
    public BoolFilter(List<Qualifier> must) {
        this.must = must;
    }

    /**
     * Gets must.
     *
     * @return the must
     */
    public List<Qualifier> getMust() {
        return must;
    }

    /**
     * Sets must.
     *
     * @param must the must
     */
    public void setMust(List<Qualifier> must) {
        this.must = must;
    }

    /**
     * Gets must not.
     *
     * @return the must not
     */
    public List<Qualifier> getMustNot() {
        return mustNot;
    }

    /**
     * Sets must not.
     *
     * @param mustNot the must not
     */
    public void setMustNot(List<Qualifier> mustNot) {
        this.mustNot = mustNot;
    }
}
