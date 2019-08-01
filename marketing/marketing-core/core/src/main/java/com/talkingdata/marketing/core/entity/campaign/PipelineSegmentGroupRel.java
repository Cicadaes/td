package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_PIPELINE_SEGMENT_GROUP_REL PipelineSegmentGroupRelEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-07 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class PipelineSegmentGroupRel extends BaseEntity {

    private Integer id;
    private Integer pipelineId;
    private String pipelineNodeId;
    private Integer groupId;
    private String attr1;
    private String attr2;
    private String tenantId;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String creator;
    private String createBy;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>pipelineId -> pipeline_id</li>
     * <li>pipelineNodeId -> pipeline_node_id</li>
     * <li>groupId -> group_id</li>
     * <li>attr1 -> attr1</li>
     * <li>attr2 -> attr2</li>
     * <li>tenantId -> tenant_id</li>
     * <li>createTime -> create_time</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null){
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "pipelineId": return "pipeline_id";
            case "pipelineNodeId": return "pipeline_node_id";
            case "groupId": return "group_id";
            case "attr1": return "attr1";
            case "attr2": return "attr2";
            case "tenantId": return "tenant_id";
            case "createTime": return "create_time";
            case "creator": return "creator";
            case "createBy": return "create_by";
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
     * <li>pipeline_id -> pipelineId</li>
     * <li>pipeline_node_id -> pipelineNodeId</li>
     * <li>group_id -> groupId</li>
     * <li>attr1 -> attr1</li>
     * <li>attr2 -> attr2</li>
     * <li>tenant_id -> tenantId</li>
     * <li>create_time -> createTime</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null){
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "pipeline_id": return "pipelineId";
            case "pipeline_node_id": return "pipelineNodeId";
            case "group_id": return "groupId";
            case "attr1": return "attr1";
            case "attr2": return "attr2";
            case "tenant_id": return "tenantId";
            case "create_time": return "createTime";
            case "creator": return "creator";
            case "create_by": return "createBy";
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

    /** 活动流程ID **/
    public Integer getPipelineId() {
        return this.pipelineId;
    }

    /** 活动流程ID **/
    public void setPipelineId(Integer pipelineId) {
        this.pipelineId = pipelineId;
    }

    /** 活动流程节点ID **/
    public String getPipelineNodeId() {
        return this.pipelineNodeId;
    }

    /** 活动流程节点ID **/
    public void setPipelineNodeId(String pipelineNodeId) {
        this.pipelineNodeId = pipelineNodeId;
    }

    /** 投放组ID **/
    public Integer getGroupId() {
        return this.groupId;
    }

    /** 投放组ID **/
    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    /** 附属属性1 **/
    public String getAttr1() {
        return this.attr1;
    }

    /** 附属属性1 **/
    public void setAttr1(String attr1) {
        this.attr1 = attr1;
    }

    /** 附属属性2 **/
    public String getAttr2() {
        return this.attr2;
    }

    /** 附属属性2 **/
    public void setAttr2(String attr2) {
        this.attr2 = attr2;
    }

    /** 租户id **/
    public String getTenantId() {
        return this.tenantId;
    }

    /** 租户id **/
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    /** 创建时间 **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /** 创建时间 **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
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
