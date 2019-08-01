package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_APP_ANDROID_CHANNEL_CONFIG AppAndroidChannelConfigEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-15 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class AppAndroidChannelConfig extends BaseEntity {

    private Integer id;
    private Integer appConfigId;
    private String name;
    private String code;
    private String thirdAppId;
    private String key;
    private String secret;
    private String attr1;
    private String attr2;
    private String attr3;
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
     * <li>appConfigId -> app_config_id</li>
     * <li>name -> name</li>
     * <li>code -> code</li>
     * <li>thirdAppId -> third_app_id</li>
     * <li>key -> key</li>
     * <li>secret -> secret</li>
     * <li>attr1 -> attr1</li>
     * <li>attr2 -> attr2</li>
     * <li>attr3 -> attr3</li>
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
            case "name": return "name";
            case "code": return "code";
            case "thirdAppId": return "third_app_id";
            case "key": return "key";
            case "secret": return "secret";
            case "attr1": return "attr1";
            case "attr2": return "attr2";
            case "attr3": return "attr3";
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
     * <li>name -> name</li>
     * <li>code -> code</li>
     * <li>third_app_id -> thirdAppId</li>
     * <li>key -> key</li>
     * <li>secret -> secret</li>
     * <li>attr1 -> attr1</li>
     * <li>attr2 -> attr2</li>
     * <li>attr3 -> attr3</li>
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
            case "name": return "name";
            case "code": return "code";
            case "third_app_id": return "thirdAppId";
            case "key": return "key";
            case "secret": return "secret";
            case "attr1": return "attr1";
            case "attr2": return "attr2";
            case "attr3": return "attr3";
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

    /** 通道名称 **/
    public String getName() {
        return this.name;
    }

    /** 通道名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /** 通道code **/
    public String getCode() {
        return this.code;
    }

    /** 通道code **/
    public void setCode(String code) {
        this.code = code;
    }

    /** 第三方通道的app **/
    public String getThirdAppId() {
        return this.thirdAppId;
    }

    /** 第三方通道的app **/
    public void setThirdAppId(String thirdAppId) {
        this.thirdAppId = thirdAppId;
    }

    /** 第三方通道的key **/
    public String getKey() {
        return this.key;
    }

    /** 第三方通道的key **/
    public void setKey(String key) {
        this.key = key;
    }

    /** 第三方通道的secret **/
    public String getSecret() {
        return this.secret;
    }

    /** 第三方通道的secret **/
    public void setSecret(String secret) {
        this.secret = secret;
    }

    /** 扩展参数 **/
    public String getAttr1() {
        return this.attr1;
    }

    /** 扩展参数 **/
    public void setAttr1(String attr1) {
        this.attr1 = attr1;
    }

    /** 扩展参数 **/
    public String getAttr2() {
        return this.attr2;
    }

    /** 扩展参数 **/
    public void setAttr2(String attr2) {
        this.attr2 = attr2;
    }

    /** 扩展参数 **/
    public String getAttr3() {
        return this.attr3;
    }

    /** 扩展参数 **/
    public void setAttr3(String attr3) {
        this.attr3 = attr3;
    }

    /** 租户id **/
    public String getTenantId() {
        return this.tenantId;
    }

    /** 租户id **/
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
