package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_EQUITY_CONFIG EquityConfigEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-28 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 * @author code generator
 */
public class EquityConfig extends BaseEntity {

    private Integer id;
    private Integer campaignId;
    private String code;
    private String name;
    private Integer total;
    private String attachmentName;
    private Integer attachmentId;
    private String tenantId;
    private String creator;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updaterBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    private String createBy;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaignId -> campaign_id</li>
     * <li>code -> code</li>
     * <li>name -> name</li>
     * <li>total -> total</li>
     * <li>attachmentName -> attachment_name</li>
     * <li>attachmentId -> attachment_id</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updaterBy -> updater_by</li>
     * <li>updateTime -> update_time</li>
     * <li>createBy -> create_by</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) {
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "campaignId": return "campaign_id";
            case "code": return "code";
            case "name": return "name";
            case "total": return "total";
            case "attachmentName": return "attachment_name";
            case "attachmentId": return "attachment_id";
            case "tenantId": return "tenant_id";
            case "creator": return "creator";
            case "createTime": return "create_time";
            case "updater": return "updater";
            case "updaterBy": return "updater_by";
            case "updateTime": return "update_time";
            case "createBy": return "create_by";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaign_id -> campaignId</li>
     * <li>code -> code</li>
     * <li>name -> name</li>
     * <li>total -> total</li>
     * <li>attachment_name -> attachmentName</li>
     * <li>attachment_id -> attachmentId</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>updater_by -> updaterBy</li>
     * <li>update_time -> updateTime</li>
     * <li>create_by -> createBy</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) {
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "campaign_id": return "campaignId";
            case "code": return "code";
            case "name": return "name";
            case "total": return "total";
            case "attachment_name": return "attachmentName";
            case "attachment_id": return "attachmentId";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "updater_by": return "updaterBy";
            case "update_time": return "updateTime";
            case "create_by": return "createBy";
            default: return null;
        }
    }
    
    /**  **/
    public Integer getId() {
        return this.id;
    }

    /**  **/
    public void setId(Integer id) {
        this.id = id;
    }

    /** 活动id **/
    public Integer getCampaignId() {
        return this.campaignId;
    }

    /** 活动id **/
    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    /**  **/
    public String getCode() {
        return this.code;
    }

    /**  **/
    public void setCode(String code) {
        this.code = code;
    }

    /** 权益名称 **/
    public String getName() {
        return this.name;
    }

    /** 权益名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /** 总量 **/
    public Integer getTotal() {
        return this.total;
    }

    /** 总量 **/
    public void setTotal(Integer total) {
        this.total = total;
    }

    /** 附件名称 **/
    public String getAttachmentName() {
        return this.attachmentName;
    }

    /** 附件名称 **/
    public void setAttachmentName(String attachmentName) {
        this.attachmentName = attachmentName;
    }

    /** 附件id **/
    public Integer getAttachmentId() {
        return this.attachmentId;
    }

    /** 附件id **/
    public void setAttachmentId(Integer attachmentId) {
        this.attachmentId = attachmentId;
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
    public String getUpdaterBy() {
        return this.updaterBy;
    }

    /** 更新人账号 **/
    public void setUpdaterBy(String updaterBy) {
        this.updaterBy = updaterBy;
    }

    /** 最后更新时间 **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /** 最后更新时间 **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    /** 创建人账号 **/
    public String getCreateBy() {
        return this.createBy;
    }

    /** 创建人账号 **/
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

}
