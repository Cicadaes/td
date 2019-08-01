package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import java.io.Serializable;

/**
 * The type Operator value.
 * @author xiaoming.kang
 */
public class OperatorValue  implements Serializable {

    private Object eq;
    private Object ne;
    private Object gt;
    private Object gte;
    private Object lt;
    private Object lte;
    private Object like;

    /**
     * Instantiates a new Operator value.
     */
    public OperatorValue() {
    }

    /**
     * Instantiates a new Operator value.
     *
     * @param eq the eq
     */
    public OperatorValue(Object eq) {
        this.eq = eq;
    }

    /**
     * Gets eq.
     *
     * @return the eq
     */
    public Object getEq() {
        return eq;
    }

    /**
     * Sets eq.
     *
     * @param eq the eq
     */
    public void setEq(Object eq) {
        this.eq = eq;
    }

    /**
     * Gets ne.
     *
     * @return the ne
     */
    public Object getNe() {
        return ne;
    }

    /**
     * Sets ne.
     *
     * @param ne the ne
     */
    public void setNe(Object ne) {
        this.ne = ne;
    }

    /**
     * Gets gt.
     *
     * @return the gt
     */
    public Object getGt() {
        return gt;
    }

    /**
     * Sets gt.
     *
     * @param gt the gt
     */
    public void setGt(Object gt) {
        this.gt = gt;
    }

    /**
     * Gets gte.
     *
     * @return the gte
     */
    public Object getGte() {
        return gte;
    }

    /**
     * Sets gte.
     *
     * @param gte the gte
     */
    public void setGte(Object gte) {
        this.gte = gte;
    }

    /**
     * Gets lt.
     *
     * @return the lt
     */
    public Object getLt() {
        return lt;
    }

    /**
     * Sets lt.
     *
     * @param lt the lt
     */
    public void setLt(Object lt) {
        this.lt = lt;
    }

    /**
     * Gets lte.
     *
     * @return the lte
     */
    public Object getLte() {
        return lte;
    }

    /**
     * Sets lte.
     *
     * @param lte the lte
     */
    public void setLte(Object lte) {
        this.lte = lte;
    }

    /**
     * Gets like.
     *
     * @return the like
     */
    public Object getLike() {
        return like;
    }

    /**
     * Sets like.
     *
     * @param like the like
     */
    public void setLike(Object like) {
        this.like = like;
    }
}
