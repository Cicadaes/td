package td.enterprise.entity;


import java.io.Serializable;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>系统参数 ParamEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-18 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class Param implements Serializable {

    private Integer id;
    private String paramKey;
    private String paramValue;
    private String description;
    private String systemCode;
    private String createBy;
    private String creator;
    private String updateBy;
    private Date createTime;
    private Date updateTime;
    private Boolean isPassword;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getParamKey() {
        return this.paramKey;
    }

    public void setParamKey(String paramKey) {
        this.paramKey = paramKey;
    }

    public String getParamValue() {
        return this.paramValue;
    }

    public void setParamValue(String paramValue) {
        this.paramValue = paramValue;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSystemCode() {
        return this.systemCode;
    }

    public void setSystemCode(String systemCode) {
        this.systemCode = systemCode;
    }

    public String getCreateBy() {
        return this.createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public String getCreator() {
        return this.creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public Date getCreateTime() {
        return this.createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return this.updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Boolean getIsPassword() {
        return this.isPassword;
    }

    public void setIsPassword(Boolean isPassword) {
        this.isPassword = isPassword;
    }
}

