package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import java.io.Serializable;

/**
 * The type Aggregation field.
 * @author xiaoming.kang
 */
public class AggregationField implements Serializable {
    private String field;
    private String alias;

    /**
     * Gets field.
     *
     * @return the field
     */
    public String getField() {
        return field;
    }

    /**
     * Sets field.
     *
     * @param field the field
     */
    public void setField(String field) {
        this.field = field;
    }

    /**
     * Gets alias.
     *
     * @return the alias
     */
    public String getAlias() {
        return alias;
    }

    /**
     * Sets alias.
     *
     * @param alias the alias
     */
    public void setAlias(String alias) {
        this.alias = alias;
    }
}
