package com.talkingdata.marketing.core.entity.admin;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_EMAIL_SEND_JOB_INPUT EmailSendJobInputEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-05-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class EmailSendJobInput extends BaseEntity {

    private Integer id;
    private String emailServerCode;
    private String emailTemplateCode;
    private String to;
    private String title;
    private String content;
    private String cc;
    private String bcc;
    private Integer retry;
    private Integer maxRetry;
    private String attachmentPath;
    private String attachmentDisplayName;
    private Integer status;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>emailServerCode -> email_server_code</li>
     * <li>emailTemplateCode -> email_template_code</li>
     * <li>to -> to</li>
     * <li>title -> title</li>
     * <li>content -> content</li>
     * <li>cc -> cc</li>
     * <li>bcc -> bcc</li>
     * <li>retry -> retry</li>
     * <li>maxRetry -> maxRetry</li>
     * <li>attachmentPath -> attachment_path</li>
     * <li>attachmentDisplayName -> attachment_display_name</li>
     * <li>status -> status</li>
     * <li>createTime -> create_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) {
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "emailServerCode": return "email_server_code";
            case "emailTemplateCode": return "email_template_code";
            case "to": return "to";
            case "title": return "title";
            case "content": return "content";
            case "cc": return "cc";
            case "bcc": return "bcc";
            case "retry": return "retry";
            case "maxRetry": return "maxRetry";
            case "attachmentPath": return "attachment_path";
            case "attachmentDisplayName": return "attachment_display_name";
            case "status": return "status";
            case "createTime": return "create_time";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>email_server_code -> emailServerCode</li>
     * <li>email_template_code -> emailTemplateCode</li>
     * <li>to -> to</li>
     * <li>title -> title</li>
     * <li>content -> content</li>
     * <li>cc -> cc</li>
     * <li>bcc -> bcc</li>
     * <li>retry -> retry</li>
     * <li>maxRetry -> maxRetry</li>
     * <li>attachment_path -> attachmentPath</li>
     * <li>attachment_display_name -> attachmentDisplayName</li>
     * <li>status -> status</li>
     * <li>create_time -> createTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) {
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "email_server_code": return "emailServerCode";
            case "email_template_code": return "emailTemplateCode";
            case "to": return "to";
            case "title": return "title";
            case "content": return "content";
            case "cc": return "cc";
            case "bcc": return "bcc";
            case "retry": return "retry";
            case "maxRetry": return "maxRetry";
            case "attachment_path": return "attachmentPath";
            case "attachment_display_name": return "attachmentDisplayName";
            case "status": return "status";
            case "create_time": return "createTime";
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

    /** 邮件服务器的code **/
    public String getEmailServerCode() {
        return this.emailServerCode;
    }

    /** 邮件服务器的code **/
    public void setEmailServerCode(String emailServerCode) {
        this.emailServerCode = emailServerCode;
    }

    /** 邮件模板code **/
    public String getEmailTemplateCode() {
        return this.emailTemplateCode;
    }

    /** 邮件模板code **/
    public void setEmailTemplateCode(String emailTemplateCode) {
        this.emailTemplateCode = emailTemplateCode;
    }

    /** 收件人 **/
    public String getTo() {
        return this.to;
    }

    /** 收件人 **/
    public void setTo(String to) {
        this.to = to;
    }

    /** 主题 **/
    public String getTitle() {
        return this.title;
    }

    /** 主题 **/
    public void setTitle(String title) {
        this.title = title;
    }

    /** 内容 **/
    public String getContent() {
        return this.content;
    }

    /** 内容 **/
    public void setContent(String content) {
        this.content = content;
    }

    /** 抄送 **/
    public String getCc() {
        return this.cc;
    }

    /** 抄送 **/
    public void setCc(String cc) {
        this.cc = cc;
    }

    /** 秘密抄送 **/
    public String getBcc() {
        return this.bcc;
    }

    /** 秘密抄送 **/
    public void setBcc(String bcc) {
        this.bcc = bcc;
    }

    /** 尝试次数 **/
    public Integer getRetry() {
        return this.retry;
    }

    /** 尝试次数 **/
    public void setRetry(Integer retry) {
        this.retry = retry;
    }

    /** 最大尝试次数 **/
    public Integer getMaxRetry() {
        return this.maxRetry;
    }

    /** 最大尝试次数 **/
    public void setMaxRetry(Integer maxRetry) {
        this.maxRetry = maxRetry;
    }

    /** 附件地址 **/
    public String getAttachmentPath() {
        return this.attachmentPath;
    }

    /** 附件地址 **/
    public void setAttachmentPath(String attachmentPath) {
        this.attachmentPath = attachmentPath;
    }

    /** 附件展示的名称 **/
    public String getAttachmentDisplayName() {
        return this.attachmentDisplayName;
    }

    /** 附件展示的名称 **/
    public void setAttachmentDisplayName(String attachmentDisplayName) {
        this.attachmentDisplayName = attachmentDisplayName;
    }

    /** 状态 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 状态 **/
    public void setStatus(Integer status) {
        this.status = status;
    }

    /** 创建时间 **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /** 创建时间 **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

}
