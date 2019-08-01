package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import java.io.Serializable;
import java.util.Map;

/**
 * The type Qualifier.
 * @author xiaoming.kang
 */
public class Qualifier  implements Serializable {
    private Map<String, OperatorValue> term;
    private Map<String, OperatorValue> range;

    /**
     * Instantiates a new Qualifier.
     */
    public Qualifier() {
    }

    /**
     * Instantiates a new Qualifier.
     *
     * @param term the term
     */
    public Qualifier(Map<String, OperatorValue> term) {
        this.term = term;
    }

    /**
     * Gets term.
     *
     * @return the term
     */
    public Map<String, OperatorValue> getTerm() {
        return term;
    }

    /**
     * Sets term.
     *
     * @param term the term
     */
    public void setTerm(Map<String, OperatorValue> term) {
        this.term = term;
    }

    /**
     * Gets range.
     *
     * @return the range
     */
    public Map<String, OperatorValue> getRange() {
        return range;
    }

    /**
     * Sets range.
     *
     * @param range the range
     */
    public void setRange(Map<String, OperatorValue> range) {
        this.range = range;
    }
}
