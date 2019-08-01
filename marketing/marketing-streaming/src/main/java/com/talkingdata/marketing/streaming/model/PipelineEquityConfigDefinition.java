package com.talkingdata.marketing.streaming.model;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_PIPELINE_EQUITY_CONFIG_DEFINITION PipelineEquityConfigDefinitionEntity<br>
 * @author sheng.hong
 * <b>日期：</b> 2017-08-21 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class PipelineEquityConfigDefinition extends BaseEntity {

    private Integer id;
    private Integer pipelineDefinitionId;
    private Integer equityConfigId;
    private String name;
    private String code;
    private Integer count;
    private Float precent;
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
     * <li>pipelineDefinitionId -> pipeline_definition_id</li>
     * <li>equityConfigId -> equity_config_id</li>
     * <li>name -> name</li>
     * <li>code -> code</li>
     * <li>count -> count</li>
     * <li>precent -> precent</li>
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
            case "pipelineDefinitionId": return "pipeline_definition_id";
            case "equityConfigId": return "equity_config_id";
            case "name": return "name";
            case "code": return "code";
            case "count": return "count";
            case "precent": return "precent";
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
     * <li>pipeline_definition_id -> pipelineDefinitionId</li>
     * <li>equity_config_id -> equityConfigId</li>
     * <li>name -> name</li>
     * <li>code -> code</li>
     * <li>count -> count</li>
     * <li>precent -> precent</li>
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
            case "pipeline_definition_id": return "pipelineDefinitionId";
            case "equity_config_id": return "equityConfigId";
            case "name": return "name";
            case "code": return "code";
            case "count": return "count";
            case "precent": return "precent";
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

    /** pipelineDefID **/
    public Integer getPipelineDefinitionId() {
        return this.pipelineDefinitionId;
    }

    /** pipelineDefID **/
    public void setPipelineDefinitionId(Integer pipelineDefinitionId) {
        this.pipelineDefinitionId = pipelineDefinitionId;
    }

    /** equitConID **/
    public Integer getEquityConfigId() {
        return this.equityConfigId;
    }

    /** equitConID **/
    public void setEquityConfigId(Integer equityConfigId) {
        this.equityConfigId = equityConfigId;
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

    /** 数据 **/
    public Integer getCount() {
        return this.count;
    }

    /** 数据 **/
    public void setCount(Integer count) {
        this.count = count;
    }

    /**  **/
    public Float getPrecent() {
        return this.precent;
    }

    /**  **/
    public void setPrecent(Float precent) {
        this.precent = precent;
    }

    /** 租户 **/
    public String getTenantId() {
        return this.tenantId;
    }

    /** 租户 **/
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

    /** 更新时间 **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /** 更新时间 **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

}
