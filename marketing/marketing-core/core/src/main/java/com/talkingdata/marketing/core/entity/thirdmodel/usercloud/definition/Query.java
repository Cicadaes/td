package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import java.io.Serializable;

/**
 * The type Query.
 * @author xiaoming.kang
 */
public class Query  implements Serializable {
    private BoolFilter bool;
    private SubQuery sub;

    /**
     * Instantiates a new Query.
     */
    public Query() {
    }

    /**
     * Instantiates a new Query.
     *
     * @param bool the bool
     */
    public Query(BoolFilter bool) {
        this.bool = bool;
    }

    /**
     * Gets bool.
     *
     * @return the bool
     */
    public BoolFilter getBool() {
        return bool;
    }

    /**
     * Sets bool.
     *
     * @param bool the bool
     */
    public void setBool(BoolFilter bool) {
        this.bool = bool;
    }

    /**
     * Gets sub.
     *
     * @return the sub
     */
    public SubQuery getSub() {
        return sub;
    }

    /**
     * Sets sub.
     *
     * @param sub the sub
     */
    public void setSub(SubQuery sub) {
        this.sub = sub;
    }
}
