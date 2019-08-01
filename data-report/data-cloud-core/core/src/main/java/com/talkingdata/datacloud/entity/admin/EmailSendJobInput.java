package com.talkingdata.datacloud.entity.admin;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>邮件发送记录' EmailSendJobInputEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-09-18 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class EmailSendJobInput extends BaseEntity {
	
	private Integer id;
	private String emailServerCode;
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
	private Date createTime;

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getEmailServerCode() {
		return this.emailServerCode;
	}

	public void setEmailServerCode(String emailServerCode) {
		this.emailServerCode = emailServerCode;
	}

	public String getTo() {
		return this.to;
	}

	public void setTo(String to) {
		this.to = to;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getCc() {
		return this.cc;
	}

	public void setCc(String cc) {
		this.cc = cc;
	}

	public String getBcc() {
		return this.bcc;
	}

	public void setBcc(String bcc) {
		this.bcc = bcc;
	}

	public Integer getRetry() {
		return this.retry;
	}

	public void setRetry(Integer retry) {
		this.retry = retry;
	}

	public Integer getMaxRetry() {
		return this.maxRetry;
	}

	public void setMaxRetry(Integer maxRetry) {
		this.maxRetry = maxRetry;
	}

	public String getAttachmentPath() {
		return this.attachmentPath;
	}

	public void setAttachmentPath(String attachmentPath) {
		this.attachmentPath = attachmentPath;
	}

	public String getAttachmentDisplayName() {
		return this.attachmentDisplayName;
	}

	public void setAttachmentDisplayName(String attachmentDisplayName) {
		this.attachmentDisplayName = attachmentDisplayName;
	}

	public Integer getStatus() {
		return this.status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
}

