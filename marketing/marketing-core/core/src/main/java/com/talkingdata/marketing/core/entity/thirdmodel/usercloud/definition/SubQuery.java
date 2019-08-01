package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import java.io.Serializable;
import java.util.Map;

/**
 * The type Sub query.
 * @author xiaoming.kang
 */
public class SubQuery  implements Serializable {
    private Query query;
    private Map<String, Aggregation> aggs;

    /**
     * Gets query.
     *
     * @return the query
     */
    public Query getQuery() {
        return query;
    }

    /**
     * Sets query.
     *
     * @param query the query
     */
    public void setQuery(Query query) {
        this.query = query;
    }

    /**
     * Gets aggs.
     *
     * @return the aggs
     */
    public Map<String, Aggregation> getAggs() {
        return aggs;
    }

    /**
     * Sets aggs.
     *
     * @param aggs the aggs
     */
    public void setAggs(Map<String, Aggregation> aggs) {
        this.aggs = aggs;
    }
}
