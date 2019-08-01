package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;
import java.io.Serializable;
import java.util.List;

/**
 * The type Filter.
 * @author xiaoming.kang
 */
public class Filter implements Serializable {
    private List<Filter> and;
    private List<Filter> or;
    private Filter not;
    private String condition;

    /**
     * Instantiates a new Filter.
     */
    public Filter() {
    }

    /**
     * Instantiates a new Filter.
     *
     * @param and the and
     */
    public Filter(List<Filter> and) {
        this.and = and;
    }

    /**
     * Instantiates a new Filter.
     *
     * @param and the and
     * @param or  the or
     */
    public Filter(List<Filter> and, List<Filter> or) {
        this.and = and;
        this.or = or;
    }

    /**
     * Gets and.
     *
     * @return the and
     */
    public List<Filter> getAnd() {
        return and;
    }

    /**
     * Sets and.
     *
     * @param and the and
     */
    public void setAnd(List<Filter> and) {
        this.and = and;
    }

    /**
     * Gets or.
     *
     * @return the or
     */
    public List<Filter> getOr() {
        return or;
    }

    /**
     * Sets or.
     *
     * @param or the or
     */
    public void setOr(List<Filter> or) {
        this.or = or;
    }

    /**
     * Gets not.
     *
     * @return the not
     */
    public Filter getNot() {
        return not;
    }

    /**
     * Sets not.
     *
     * @param not the not
     */
    public void setNot(Filter not) {
        this.not = not;
    }

    /**
     * Gets condition.
     *
     * @return the condition
     */
    public String getCondition() {
        return condition;
    }

    /**
     * Sets condition.
     *
     * @param condition the condition
     */
    public void setCondition(String condition) {
        this.condition = condition;
    }
}
