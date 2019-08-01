package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import java.io.Serializable;

/**
 * The type Condition.
 * @author xiaoming.kang
 */
public class Condition implements Serializable {
    private Indice indice;
    private Query query;

    /**
     * Instantiates a new Condition.
     */
    public Condition() {
    }

    /**
     * Instantiates a new Condition.
     *
     * @param indice the indice
     * @param query  the query
     */
    public Condition(Indice indice, Query query) {
        this.indice = indice;
        this.query = query;
    }

    /**
     * Gets indice.
     *
     * @return the indice
     */
    public Indice getIndice() {
        return indice;
    }

    /**
     * Sets indice.
     *
     * @param indice the indice
     */
    public void setIndice(Indice indice) {
        this.indice = indice;
    }

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
}
