package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import java.io.Serializable;

/**
 * The type Indice.
 * @author xiaoming.kang
 */
public class Indice  implements Serializable {
    private String domain;
    private String objectIdType;
    private String objectCode;
    private String objectType;

    /**
     * Instantiates a new Indice.
     */
    public Indice() {
    }

    /**
     * Instantiates a new Indice.
     *
     * @param objectIdType the object id type
     * @param objectCode   the object code
     * @param objectType   the object type
     */
    public Indice(String objectIdType, String objectCode, String objectType) {
        this.objectIdType = objectIdType;
        this.objectCode = objectCode;
        this.objectType = objectType;
    }

    /**
     * Gets domain.
     *
     * @return the domain
     */
    public String getDomain() {
        return domain;
    }

    /**
     * Sets domain.
     *
     * @param domain the domain
     */
    public void setDomain(String domain) {
        this.domain = domain;
    }

    /**
     * Gets object id type.
     *
     * @return the object id type
     */
    public String getObjectIdType() {
        return objectIdType;
    }

    /**
     * Sets object id type.
     *
     * @param objectIdType the object id type
     */
    public void setObjectIdType(String objectIdType) {
        this.objectIdType = objectIdType;
    }

    /**
     * Gets object code.
     *
     * @return the object code
     */
    public String getObjectCode() {
        return objectCode;
    }

    /**
     * Sets object code.
     *
     * @param objectCode the object code
     */
    public void setObjectCode(String objectCode) {
        this.objectCode = objectCode;
    }

    /**
     * Gets object type.
     *
     * @return the object type
     */
    public String getObjectType() {
        return objectType;
    }

    /**
     * Sets object type.
     *
     * @param objectType the object type
     */
    public void setObjectType(String objectType) {
        this.objectType = objectType;
    }
}
