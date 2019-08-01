package com.talkingdata.marketing.streaming.model;

import java.util.Date;

/**
 * @author sheng.hong
 * <b>功能：</b>TD_MKT_BEHAVIOR_DEFINITION BehaviorDefinitionEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-06 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class BehaviorDefinition extends BaseEntity {

    private Integer id;
    private String name;
    private String code;
    private Integer status;
    private String rowkey;
    private String behaviorId;
    private String type;
    private String description;
    private String scope;
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
     * <li>code -> code</li>
     * <li>status -> status</li>
     * <li>rowkey -> rowkey</li>
     * <li>behaviorId -> behavior_id</li>
     * <li>type -> type</li>
     * <li>description -> description</li>
     * <li>scope -> scope</li>
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
            case "code": return "code";
            case "status": return "status";
            case "rowkey": return "rowkey";
            case "behaviorId": return "behavior_id";
            case "type": return "type";
            case "description": return "description";
            case "scope": return "scope";
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
     * <li>code -> code</li>
     * <li>status -> status</li>
     * <li>rowkey -> rowkey</li>
     * <li>behavior_id -> behaviorId</li>
     * <li>type -> type</li>
     * <li>description -> description</li>
     * <li>scope -> scope</li>
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
            case "code": return "code";
            case "status": return "status";
            case "rowkey": return "rowkey";
            case "behavior_id": return "behaviorId";
            case "type": return "type";
            case "description": return "description";
            case "scope": return "scope";
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

    /** 名称 **/
    public String getName() {
        return this.name;
    }

    /** 名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /**  **/
    public String getCode() {
        return this.code;
    }

    /**  **/
    public void setCode(String code) {
        this.code = code;
    }

    /** 状态 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 状态 **/
    public void setStatus(Integer status) {
        this.status = status;
    }

    /** rowekey **/
    public String getRowkey() {
        return this.rowkey;
    }

    /** rowekey **/
    public void setRowkey(String rowkey) {
        this.rowkey = rowkey;
    }

    /** 对应用户管家的TD_TAG的id **/
    public String getBehaviorId() {
        return this.behaviorId;
    }

    /** 对应用户管家的TD_TAG的id **/
    public void setBehaviorId(String behaviorId) {
        this.behaviorId = behaviorId;
    }

    /** 类型,TB简单标签 TC，复合标签  TH,人群标签   SX属性标签 **/
    public String getType() {
        return this.type;
    }

    /** 类型,TB简单标签 TC，复合标签  TH,人群标签 **/
    public void setType(String type) {
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

    /** "计时器、触发器-事件、禁止规则"是否勾选,勾选：1，没勾选0. **/
    public String getScope() {
        return this.scope;
    }

    /** "计时器、触发器-事件、禁止规则"是否勾选,勾选：1，没勾选0. **/
    public void setScope(String scope) {
        this.scope = scope;
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

    /** 创建人账号 **/
    public String getCreateBy() {
        return this.createBy;
    }

    /** 创建人账号 **/
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

    /** 更新人账号 **/
    public String getUpdateBy() {
        return this.updateBy;
    }

    /** 更新人账号 **/
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
