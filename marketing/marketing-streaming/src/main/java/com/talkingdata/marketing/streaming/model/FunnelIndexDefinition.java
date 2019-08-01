package com.talkingdata.marketing.streaming.model;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_FUNNEL_INDEX_DEFINITION FunnelIndexDefinitionEntity<br>
 * @author sheng.hong
 * <b>日期：</b> 2017-05-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class FunnelIndexDefinition extends BaseEntity {

    private Integer id;
    private String name;
    private String eventId;
    private Integer indexId;
    private String indexCode;
    private Integer type;
    private String description;
    private String tenantId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>name -> name</li>
     * <li>eventId -> event_id</li>
     * <li>indexId -> index_id</li>
     * <li>indexCode -> index_code</li>
     * <li>type -> type</li>
     * <li>description -> description</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) {
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "name": return "name";
            case "eventId": return "event_id";
            case "indexId": return "index_id";
            case "indexCode": return "index_code";
            case "type": return "type";
            case "description": return "description";
            case "tenantId": return "tenant_id";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
            case "updater": return "updater";
            case "updateBy": return "update_by";
            case "updateTime": return "update_time";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>name -> name</li>
     * <li>event_id -> eventId</li>
     * <li>index_id -> indexId</li>
     * <li>index_code -> indexCode</li>
     * <li>type -> type</li>
     * <li>description -> description</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) {
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "name": return "name";
            case "event_id": return "eventId";
            case "index_id": return "indexId";
            case "index_code": return "indexCode";
            case "type": return "type";
            case "description": return "description";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "update_by": return "updateBy";
            case "update_time": return "updateTime";
            default: return null;
        }
    }
    
    /** 主键 **/
    public Integer getId() {
        return this.id;
    }

    /** 主键 **/
    public void setId(Integer id) {
        this.id = id;
    }

    /** 事件名称 **/
    public String getName() {
        return this.name;
    }

    /** 事件名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /** 事件ID **/
    public String getEventId() {
        return this.eventId;
    }

    /** 事件ID **/
    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    /** 用户管家传递id值 **/
    public Integer getIndexId() {
        return this.indexId;
    }

    /** 用户管家传递id值 **/
    public void setIndexId(Integer indexId) {
        this.indexId = indexId;
    }

    /** 用户管家传递code值 **/
    public String getIndexCode() {
        return this.indexCode;
    }

    /** 用户管家传递code值 **/
    public void setIndexCode(String indexCode) {
        this.indexCode = indexCode;
    }

    /** 类型 1、Analytics  2、企业第一方数据 **/
    public Integer getType() {
        return this.type;
    }

    /** 类型 1、Analytics  2、企业第一方数据 **/
    public void setType(Integer type) {
        this.type = type;
    }

    /** 描述 **/
    public String getDescription() {
        return this.description;
    }

    /** 描述 **/
    public void setDescription(String description) {
        this.description = description;
    }

    /** 租户ID **/
    public String getTenantId() {
        return this.tenantId;
    }

    /** 租户ID **/
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    /** 创建人 **/
    public String getCreator() {
        return this.creator;
    }

    /** 创建人 **/
    public void setCreator(String creator) {
        this.creator = creator;
    }

    /** 创建人账户 **/
    public String getCreateBy() {
        return this.createBy;
    }

    /** 创建人账户 **/
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    /** 创建时间 **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /** 创建时间 **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /** 更新人 **/
    public String getUpdater() {
        return this.updater;
    }

    /** 更新人 **/
    public void setUpdater(String updater) {
        this.updater = updater;
    }

    /** 更新人账户 **/
    public String getUpdateBy() {
        return this.updateBy;
    }

    /** 更新人账户 **/
    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    /** 最后更新时间 **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /** 最后更新时间 **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

}
