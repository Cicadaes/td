package com.talkingdata.marketing.core.page.admin;

import com.talkingdata.enterprise.base.page.BasePage;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_PRODUCT ProductPage<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-05-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class ProductPage extends BasePage {

    private String productid;
    private String productidOperator = "=";
    private String sequencenumber;
    private String sequencenumberOperator = "=";
    private String developerid;
    private String developeridOperator = "=";
    private String tenantcode;
    private String tenantcodeOperator = "=";
    private String platform;
    private String platformOperator = "=";
    private String productype;
    private String productypeOperator = "=";
    private String productname;
    private String productnameOperator = "=";
    private String productmemo;
    private String productmemoOperator = "=";
    private String registertime;
    private String registertime1;
    private String registertime2;
    private String registertimeOperator = "=";
    private String isdeleted;
    private String isdeletedOperator = "=";
    private String iscompensate;
    private String iscompensateOperator = "=";
    private String category;
    private String categoryOperator = "=";
    private String domain;
    private String domainOperator = "=";
    private String lastModifyTime;
    private String lastModifyTime1;
    private String lastModifyTime2;
    private String lastModifyTimeOperator = "=";
    private String isupgrade;
    private String isupgradeOperator = "=";

    public String getProductid() {
        return this.productid;
    }

    public void setProductid(String productid) {
        this.productid = productid;
    }

    public String getProductidOperator() {
        return this.productidOperator;
    }

    public void setProductidOperator(String productidOperator) {
        this.productidOperator = productidOperator;
    }

    public String getSequencenumber() {
        return this.sequencenumber;
    }

    public void setSequencenumber(String sequencenumber) {
        this.sequencenumber = sequencenumber;
    }

    public String getSequencenumberOperator() {
        return this.sequencenumberOperator;
    }

    public void setSequencenumberOperator(String sequencenumberOperator) {
        this.sequencenumberOperator = sequencenumberOperator;
    }

    public String getDeveloperid() {
        return this.developerid;
    }

    public void setDeveloperid(String developerid) {
        this.developerid = developerid;
    }

    public String getDeveloperidOperator() {
        return this.developeridOperator;
    }

    public void setDeveloperidOperator(String developeridOperator) {
        this.developeridOperator = developeridOperator;
    }

    public String getTenantcode() {
        return this.tenantcode;
    }

    public void setTenantcode(String tenantcode) {
        this.tenantcode = tenantcode;
    }

    public String getTenantcodeOperator() {
        return this.tenantcodeOperator;
    }

    public void setTenantcodeOperator(String tenantcodeOperator) {
        this.tenantcodeOperator = tenantcodeOperator;
    }

    public String getPlatform() {
        return this.platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getPlatformOperator() {
        return this.platformOperator;
    }

    public void setPlatformOperator(String platformOperator) {
        this.platformOperator = platformOperator;
    }

    public String getProductype() {
        return this.productype;
    }

    public void setProductype(String productype) {
        this.productype = productype;
    }

    public String getProductypeOperator() {
        return this.productypeOperator;
    }

    public void setProductypeOperator(String productypeOperator) {
        this.productypeOperator = productypeOperator;
    }

    public String getProductname() {
        return this.productname;
    }

    public void setProductname(String productname) {
        this.productname = productname;
    }

    public String getProductnameOperator() {
        return this.productnameOperator;
    }

    public void setProductnameOperator(String productnameOperator) {
        this.productnameOperator = productnameOperator;
    }

    public String getProductmemo() {
        return this.productmemo;
    }

    public void setProductmemo(String productmemo) {
        this.productmemo = productmemo;
    }

    public String getProductmemoOperator() {
        return this.productmemoOperator;
    }

    public void setProductmemoOperator(String productmemoOperator) {
        this.productmemoOperator = productmemoOperator;
    }

    public String getRegistertime() {
        return this.registertime;
    }

    public void setRegistertime(String registertime) {
        this.registertime = registertime;
    }

    public String getRegistertime1() {
        return this.registertime1;
    }

    public void setRegistertime1(String registertime1) {
        this.registertime1 = registertime1;
    }

    public String getRegistertime2() {
        return this.registertime2;
    }

    public void setRegistertime2(String registertime2) {
        this.registertime2 = registertime2;
    }

    public String getRegistertimeOperator() {
        return this.registertimeOperator;
    }

    public void setRegistertimeOperator(String registertimeOperator) {
        this.registertimeOperator = registertimeOperator;
    }

    public String getIsdeleted() {
        return this.isdeleted;
    }

    public void setIsdeleted(String isdeleted) {
        this.isdeleted = isdeleted;
    }

    public String getIsdeletedOperator() {
        return this.isdeletedOperator;
    }

    public void setIsdeletedOperator(String isdeletedOperator) {
        this.isdeletedOperator = isdeletedOperator;
    }

    public String getIscompensate() {
        return this.iscompensate;
    }

    public void setIscompensate(String iscompensate) {
        this.iscompensate = iscompensate;
    }

    public String getIscompensateOperator() {
        return this.iscompensateOperator;
    }

    public void setIscompensateOperator(String iscompensateOperator) {
        this.iscompensateOperator = iscompensateOperator;
    }

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryOperator() {
        return this.categoryOperator;
    }

    public void setCategoryOperator(String categoryOperator) {
        this.categoryOperator = categoryOperator;
    }

    public String getDomain() {
        return this.domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getDomainOperator() {
        return this.domainOperator;
    }

    public void setDomainOperator(String domainOperator) {
        this.domainOperator = domainOperator;
    }

    public String getLastModifyTime() {
        return this.lastModifyTime;
    }

    public void setLastModifyTime(String lastModifyTime) {
        this.lastModifyTime = lastModifyTime;
    }

    public String getLastModifyTime1() {
        return this.lastModifyTime1;
    }

    public void setLastModifyTime1(String lastModifyTime1) {
        this.lastModifyTime1 = lastModifyTime1;
    }

    public String getLastModifyTime2() {
        return this.lastModifyTime2;
    }

    public void setLastModifyTime2(String lastModifyTime2) {
        this.lastModifyTime2 = lastModifyTime2;
    }

    public String getLastModifyTimeOperator() {
        return this.lastModifyTimeOperator;
    }

    public void setLastModifyTimeOperator(String lastModifyTimeOperator) {
        this.lastModifyTimeOperator = lastModifyTimeOperator;
    }

    public String getIsupgrade() {
        return this.isupgrade;
    }

    public void setIsupgrade(String isupgrade) {
        this.isupgrade = isupgrade;
    }

    public String getIsupgradeOperator() {
        return this.isupgradeOperator;
    }

    public void setIsupgradeOperator(String isupgradeOperator) {
        this.isupgradeOperator = isupgradeOperator;
    }

}
