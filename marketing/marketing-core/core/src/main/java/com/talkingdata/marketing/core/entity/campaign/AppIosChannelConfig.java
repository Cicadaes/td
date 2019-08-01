package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_APP_IOS_CHANNEL_CONFIG AppIosChannelConfigEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-15 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class AppIosChannelConfig extends BaseEntity {

    private Integer id;
    private Integer appConfigId;
    private String prodFileName;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date prodExpiryDate;
    private Object prodPem;
    private String devFileName;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date devExpiryDate;
    private Object devPem;
    private Integer tenantId;
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
     * <li>appConfigId -> app_config_id</li>
     * <li>prodFileName -> prod_file_name</li>
     * <li>prodExpiryDate -> prod_expiry_date</li>
     * <li>prodPem -> prod_pem</li>
     * <li>devFileName -> dev_file_name</li>
     * <li>devExpiryDate -> dev_expiry_date</li>
     * <li>devPem -> dev_pem</li>
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
            case "appConfigId": return "app_config_id";
            case "prodFileName": return "prod_file_name";
            case "prodExpiryDate": return "prod_expiry_date";
            case "prodPem": return "prod_pem";
            case "devFileName": return "dev_file_name";
            case "devExpiryDate": return "dev_expiry_date";
            case "devPem": return "dev_pem";
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
     * <li>app_config_id -> appConfigId</li>
     * <li>prod_file_name -> prodFileName</li>
     * <li>prod_expiry_date -> prodExpiryDate</li>
     * <li>prod_pem -> prodPem</li>
     * <li>dev_file_name -> devFileName</li>
     * <li>dev_expiry_date -> devExpiryDate</li>
     * <li>dev_pem -> devPem</li>
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
            case "app_config_id": return "appConfigId";
            case "prod_file_name": return "prodFileName";
            case "prod_expiry_date": return "prodExpiryDate";
            case "prod_pem": return "prodPem";
            case "dev_file_name": return "devFileName";
            case "dev_expiry_date": return "devExpiryDate";
            case "dev_pem": return "devPem";
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

    /** TD_MKT_APP_CONF的id **/
    public Integer getAppConfigId() {
        return this.appConfigId;
    }

    /** TD_MKT_APP_CONF的id **/
    public void setAppConfigId(Integer appConfigId) {
        this.appConfigId = appConfigId;
    }

    /** iOS生产证书文件名 **/
    public String getProdFileName() {
        return this.prodFileName;
    }

    /** iOS生产证书文件名 **/
    public void setProdFileName(String prodFileName) {
        this.prodFileName = prodFileName;
    }

    /** iOS生产证书失效日期 **/
    public Date getProdExpiryDate() {
        return this.prodExpiryDate;
    }

    /** iOS生产证书失效日期 **/
    public void setProdExpiryDate(Date prodExpiryDate) {
        this.prodExpiryDate = prodExpiryDate;
    }

    /** 生产证书文件 **/
    public Object getProdPem() {
        return this.prodPem;
    }

    /** 生产证书文件 **/
    public void setProdPem(Object prodPem) {
        this.prodPem = prodPem;
    }

    /** iOS开发证书文件名 **/
    public String getDevFileName() {
        return this.devFileName;
    }

    /** iOS开发证书文件名 **/
    public void setDevFileName(String devFileName) {
        this.devFileName = devFileName;
    }

    /** iOS开发证书失效日期 **/
    public Date getDevExpiryDate() {
        return this.devExpiryDate;
    }

    /** iOS开发证书失效日期 **/
    public void setDevExpiryDate(Date devExpiryDate) {
        this.devExpiryDate = devExpiryDate;
    }

    /** 开发证书文件 **/
    public Object getDevPem() {
        return this.devPem;
    }

    /** 开发证书文件 **/
    public void setDevPem(Object devPem) {
        this.devPem = devPem;
    }

    /** 租户ID **/
    public Integer getTenantId() {
        return this.tenantId;
    }

    /** 租户ID **/
    public void setTenantId(Integer tenantId) {
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
