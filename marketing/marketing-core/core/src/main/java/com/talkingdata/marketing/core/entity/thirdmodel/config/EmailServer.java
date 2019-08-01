package com.talkingdata.marketing.core.entity.thirdmodel.config;

import java.util.Date;

/**
 * The type Email server.
 * @author xiaoming.kang
 */
public class EmailServer {
    private Integer id;
    private String code;
    private String name;
    private String mailHost;
    private Integer smtpPort;
    private Boolean useSsl;
    private String user;
    private String password;
    private String systemCode;
    private String createBy;
    private String creator;
    private String updateBy;
    private Date createTime;
    private Date updateTime;

    /**
     * Gets id.
     *
     * @return the id
     */
    public Integer getId() {
        return id;
    }

    /**
     * Sets id.
     *
     * @param id the id
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * Gets code.
     *
     * @return the code
     */
    public String getCode() {
        return code;
    }

    /**
     * Sets code.
     *
     * @param code the code
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * Gets name.
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets name.
     *
     * @param name the name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets mail host.
     *
     * @return the mail host
     */
    public String getMailHost() {
        return mailHost;
    }

    /**
     * Sets mail host.
     *
     * @param mailHost the mail host
     */
    public void setMailHost(String mailHost) {
        this.mailHost = mailHost;
    }

    /**
     * Gets smtp port.
     *
     * @return the smtp port
     */
    public Integer getSmtpPort() {
        return smtpPort;
    }

    /**
     * Sets smtp port.
     *
     * @param smtpPort the smtp port
     */
    public void setSmtpPort(Integer smtpPort) {
        this.smtpPort = smtpPort;
    }

    /**
     * Gets use ssl.
     *
     * @return the use ssl
     */
    public Boolean getUseSsl() {
        return useSsl;
    }

    /**
     * Sets use ssl.
     *
     * @param useSsl the use ssl
     */
    public void setUseSsl(Boolean useSsl) {
        this.useSsl = useSsl;
    }

    /**
     * Gets user.
     *
     * @return the user
     */
    public String getUser() {
        return user;
    }

    /**
     * Sets user.
     *
     * @param user the user
     */
    public void setUser(String user) {
        this.user = user;
    }

    /**
     * Gets password.
     *
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets password.
     *
     * @param password the password
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Gets system code.
     *
     * @return the system code
     */
    public String getSystemCode() {
        return systemCode;
    }

    /**
     * Sets system code.
     *
     * @param systemCode the system code
     */
    public void setSystemCode(String systemCode) {
        this.systemCode = systemCode;
    }

    /**
     * Gets create by.
     *
     * @return the create by
     */
    public String getCreateBy() {
        return createBy;
    }

    /**
     * Sets create by.
     *
     * @param createBy the create by
     */
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    /**
     * Gets creator.
     *
     * @return the creator
     */
    public String getCreator() {
        return creator;
    }

    /**
     * Sets creator.
     *
     * @param creator the creator
     */
    public void setCreator(String creator) {
        this.creator = creator;
    }

    /**
     * Gets update by.
     *
     * @return the update by
     */
    public String getUpdateBy() {
        return updateBy;
    }

    /**
     * Sets update by.
     *
     * @param updateBy the update by
     */
    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    /**
     * Gets create time.
     *
     * @return the create time
     */
    public Date getCreateTime() {
        return createTime;
    }

    /**
     * Sets create time.
     *
     * @param createTime the create time
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * Gets update time.
     *
     * @return the update time
     */
    public Date getUpdateTime() {
        return updateTime;
    }

    /**
     * Sets update time.
     *
     * @param updateTime the update time
     */
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}
