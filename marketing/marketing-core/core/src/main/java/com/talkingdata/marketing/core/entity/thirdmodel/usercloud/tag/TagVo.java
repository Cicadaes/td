package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.tag;

import java.io.Serializable;

/**
 * Created by zmy on 9/6/2017.
 * @author xiaoming.kang
 */
public class TagVo implements Serializable {
    private static final long serialVersionUID = -6384627656766216325L;

    /**
     * 自定义标签和属性标签的唯一标示
     */
    private String id;
    private String behaviorId;
    private String rowkey;
    private String type;
    private String name;
    private String code;

    /**
     * Gets id.
     *
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * Sets id.
     *
     * @param id the id
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Gets behavior id.
     *
     * @return the behavior id
     */
    public String getBehaviorId() {
        return behaviorId;
    }

    /**
     * Sets behavior id.
     *
     * @param behaviorId the behavior id
     */
    public void setBehaviorId(String behaviorId) {
        this.behaviorId = behaviorId;
    }

    /**
     * Gets rowkey.
     *
     * @return the rowkey
     */
    public String getRowkey() {
        return rowkey;
    }

    /**
     * Sets rowkey.
     *
     * @param rowkey the rowkey
     */
    public void setRowkey(String rowkey) {
        this.rowkey = rowkey;
    }

    /**
     * Gets type.
     *
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * Sets type.
     *
     * @param type the type
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * Gets name.
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets name.
     *
     * @param name the name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets code.
     *
     * @return the code
     */
    public String getCode() {
        return code;
    }

    /**
     * Sets code.
     *
     * @param code the code
     */
    public void setCode(String code) {
        this.code = code;
    }
}
