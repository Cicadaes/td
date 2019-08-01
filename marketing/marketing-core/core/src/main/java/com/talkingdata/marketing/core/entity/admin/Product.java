package com.talkingdata.marketing.core.entity.admin;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_PRODUCT ProductEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-05-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Deprecated
public class Product extends BaseEntity {

    private Integer productid;
    private String sequencenumber;
    private Integer developerid;
    private String tenantcode;
    private Integer platform;
    private Integer productype;
    private String productname;
    private String productmemo;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date registertime;
    private Integer isdeleted;
    private Integer iscompensate;
    private Integer category;
    private String domain;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date lastModifyTime;
    private Integer isupgrade;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>productid -> productid</li>
     * <li>sequencenumber -> sequencenumber</li>
     * <li>developerid -> developerid</li>
     * <li>tenantcode -> tenantcode</li>
     * <li>platform -> platform</li>
     * <li>productype -> productype</li>
     * <li>productname -> productname</li>
     * <li>productmemo -> productmemo</li>
     * <li>registertime -> registertime</li>
     * <li>isdeleted -> isdeleted</li>
     * <li>iscompensate -> iscompensate</li>
     * <li>category -> category</li>
     * <li>domain -> domain</li>
     * <li>lastModifyTime -> last_modify_time</li>
     * <li>isupgrade -> isupgrade</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) {
            return null;
        }
        switch (fieldName) {
            case "productid": return "productid";
            case "sequencenumber": return "sequencenumber";
            case "developerid": return "developerid";
            case "tenantcode": return "tenantcode";
            case "platform": return "platform";
            case "productype": return "productype";
            case "productname": return "productname";
            case "productmemo": return "productmemo";
            case "registertime": return "registertime";
            case "isdeleted": return "isdeleted";
            case "iscompensate": return "iscompensate";
            case "category": return "category";
            case "domain": return "domain";
            case "lastModifyTime": return "last_modify_time";
            case "isupgrade": return "isupgrade";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>productid -> productid</li>
     * <li>sequencenumber -> sequencenumber</li>
     * <li>developerid -> developerid</li>
     * <li>tenantcode -> tenantcode</li>
     * <li>platform -> platform</li>
     * <li>productype -> productype</li>
     * <li>productname -> productname</li>
     * <li>productmemo -> productmemo</li>
     * <li>registertime -> registertime</li>
     * <li>isdeleted -> isdeleted</li>
     * <li>iscompensate -> iscompensate</li>
     * <li>category -> category</li>
     * <li>domain -> domain</li>
     * <li>last_modify_time -> lastModifyTime</li>
     * <li>isupgrade -> isupgrade</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) {
            return null;
        }
        switch (columnName) {
            case "productid": return "productid";
            case "sequencenumber": return "sequencenumber";
            case "developerid": return "developerid";
            case "tenantcode": return "tenantcode";
            case "platform": return "platform";
            case "productype": return "productype";
            case "productname": return "productname";
            case "productmemo": return "productmemo";
            case "registertime": return "registertime";
            case "isdeleted": return "isdeleted";
            case "iscompensate": return "iscompensate";
            case "category": return "category";
            case "domain": return "domain";
            case "last_modify_time": return "lastModifyTime";
            case "isupgrade": return "isupgrade";
            default: return null;
        }
    }
    
    /**  **/
    public Integer getProductid() {
        return this.productid;
    }

    /**  **/
    public void setProductid(Integer productid) {
        this.productid = productid;
    }

    /**  **/
    public String getSequencenumber() {
        return this.sequencenumber;
    }

    /**  **/
    public void setSequencenumber(String sequencenumber) {
        this.sequencenumber = sequencenumber;
    }

    /**  **/
    public Integer getDeveloperid() {
        return this.developerid;
    }

    /**  **/
    public void setDeveloperid(Integer developerid) {
        this.developerid = developerid;
    }

    /**  **/
    public String getTenantcode() {
        return this.tenantcode;
    }

    /**  **/
    public void setTenantcode(String tenantcode) {
        this.tenantcode = tenantcode;
    }

    /**  **/
    public Integer getPlatform() {
        return this.platform;
    }

    /**  **/
    public void setPlatform(Integer platform) {
        this.platform = platform;
    }

    /**  **/
    public Integer getProductype() {
        return this.productype;
    }

    /**  **/
    public void setProductype(Integer productype) {
        this.productype = productype;
    }

    /**  **/
    public String getProductname() {
        return this.productname;
    }

    /**  **/
    public void setProductname(String productname) {
        this.productname = productname;
    }

    /**  **/
    public String getProductmemo() {
        return this.productmemo;
    }

    /**  **/
    public void setProductmemo(String productmemo) {
        this.productmemo = productmemo;
    }

    /**  **/
    public Date getRegistertime() {
        return this.registertime;
    }

    /**  **/
    public void setRegistertime(Date registertime) {
        this.registertime = registertime;
    }

    /**  **/
    public Integer getIsdeleted() {
        return this.isdeleted;
    }

    /**  **/
    public void setIsdeleted(Integer isdeleted) {
        this.isdeleted = isdeleted;
    }

    /**  **/
    public Integer getIscompensate() {
        return this.iscompensate;
    }

    /**  **/
    public void setIscompensate(Integer iscompensate) {
        this.iscompensate = iscompensate;
    }

    /**  **/
    public Integer getCategory() {
        return this.category;
    }

    /**  **/
    public void setCategory(Integer category) {
        this.category = category;
    }

    /**  **/
    public String getDomain() {
        return this.domain;
    }

    /**  **/
    public void setDomain(String domain) {
        this.domain = domain;
    }

    /**  **/
    public Date getLastModifyTime() {
        return this.lastModifyTime;
    }

    /**  **/
    public void setLastModifyTime(Date lastModifyTime) {
        this.lastModifyTime = lastModifyTime;
    }

    /**  **/
    public Integer getIsupgrade() {
        return this.isupgrade;
    }

    /**  **/
    public void setIsupgrade(Integer isupgrade) {
        this.isupgrade = isupgrade;
    }

}
