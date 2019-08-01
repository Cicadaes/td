package com.talkingdata.marketing.core.entity.dto;

import com.talkingdata.enterprise.base.entity.BaseEntity;

/**
 * <b>功能：</b>TD_MKT_APP_CONF AppConfEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-05-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class AppConfDto {

    private Integer id;
    private String appId;
    private String appName;
    private String hwApp;
    private String hwSecret;
    private String xmApp;
    private String xmSecret;
    private String getuiApp;
    private String getuiKey;
    private String getuiSecret;
    private String jpushKey;
    private String jpushSecret;
    private String prodFilename;
    private String prodExpiryDate;
    private Object prodPem;
    private String devFilename;
    private String devExpiryDate;
    private Object devPem;
    
    /** 主键 **/
    public Integer getId() {
        return this.id;
    }

    /** 主键 **/
    public void setId(Integer id) {
        this.id = id;
    }

    /** appId **/
    public String getAppId() {
        return this.appId;
    }

    /** appId **/
    public void setAppId(String appId) {
        this.appId = appId;
    }

    /** app名称 **/
    public String getAppName() {
        return this.appName;
    }

    /** app名称 **/
    public void setAppName(String appName) {
        this.appName = appName;
    }

    /** 华为AppID **/
    public String getHwApp() {
        return this.hwApp;
    }

    /** 华为AppID **/
    public void setHwApp(String hwApp) {
        this.hwApp = hwApp;
    }

    /** 华为APPSecret **/
    public String getHwSecret() {
        return this.hwSecret;
    }

    /** 华为APPSecret **/
    public void setHwSecret(String hwSecret) {
        this.hwSecret = hwSecret;
    }

    /** 小米APPID **/
    public String getXmApp() {
        return this.xmApp;
    }

    /** 小米APPID **/
    public void setXmApp(String xmApp) {
        this.xmApp = xmApp;
    }

    /** 小米APPSecret **/
    public String getXmSecret() {
        return this.xmSecret;
    }

    /** 小米APPSecret **/
    public void setXmSecret(String xmSecret) {
        this.xmSecret = xmSecret;
    }

    /** 个推APPID **/
    public String getGetuiApp() {
        return this.getuiApp;
    }

    /** 个推APPID **/
    public void setGetuiApp(String getuiApp) {
        this.getuiApp = getuiApp;
    }

    /** 个推APPKey **/
    public String getGetuiKey() {
        return this.getuiKey;
    }

    /** 个推APPKey **/
    public void setGetuiKey(String getuiKey) {
        this.getuiKey = getuiKey;
    }

    /** 个推APPSecret **/
    public String getGetuiSecret() {
        return this.getuiSecret;
    }

    /** 个推APPSecret **/
    public void setGetuiSecret(String getuiSecret) {
        this.getuiSecret = getuiSecret;
    }

    /** 极光APPKey **/
    public String getJpushKey() {
        return this.jpushKey;
    }

    /** 极光APPKey **/
    public void setJpushKey(String jpushKey) {
        this.jpushKey = jpushKey;
    }

    /** 极光APPSecret **/
    public String getJpushSecret() {
        return this.jpushSecret;
    }

    /** 极光APPSecret **/
    public void setJpushSecret(String jpushSecret) {
        this.jpushSecret = jpushSecret;
    }

    /** iOS生产证书文件名 **/
    public String getProdFilename() {
        return this.prodFilename;
    }

    /** iOS生产证书文件名 **/
    public void setProdFilename(String prodFilename) {
        this.prodFilename = prodFilename;
    }

    /** iOS生产证书失效日期 **/
    public String getProdExpiryDate() {
        return this.prodExpiryDate;
    }

    /** iOS生产证书失效日期 **/
    public void setProdExpiryDate(String prodExpiryDate) {
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
    public String getDevFilename() {
        return this.devFilename;
    }

    /** iOS开发证书文件名 **/
    public void setDevFilename(String devFilename) {
        this.devFilename = devFilename;
    }

    /** iOS开发证书失效日期 **/
    public String getDevExpiryDate() {
        return this.devExpiryDate;
    }

    /** iOS开发证书失效日期 **/
    public void setDevExpiryDate(String devExpiryDate) {
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

}
