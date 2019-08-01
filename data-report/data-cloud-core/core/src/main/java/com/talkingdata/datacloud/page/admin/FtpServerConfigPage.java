package com.talkingdata.datacloud.page.admin;

import org.apache.commons.lang.StringUtils;
import com.talkingdata.datacloud.base.page.BasePage;
import com.talkingdata.datacloud.util.DateUtil;

import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>Ftp服务器配置信息 FtpServerConfigPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class FtpServerConfigPage extends BasePage {

	private Integer id;
	private String serverName;
	private String protocol;
	private String user;
	private String password;
	private String rootPath;
	private String charset;
	private String host;
	private Integer port;
	private String code;
	private String systemCode;
	private String createBy;
	private String creator;
	private String updateBy;
	private Date createTime;
	private Date updateTime;
	
	private String createTimeStart;
	private String createTimeEnd;

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getServerName() {
		return this.serverName;
	}

	public void setServerName(String serverName) {
		this.serverName = serverName;
	}

	public String getProtocol() {
		return this.protocol;
	}

	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}

	public String getUser() {
		return this.user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRootPath() {
		return this.rootPath;
	}

	public void setRootPath(String rootPath) {
		this.rootPath = rootPath;
	}

	public String getCharset() {
		return this.charset;
	}

	public void setCharset(String charset) {
		this.charset = charset;
	}

	public String getHost() {
		return this.host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public Integer getPort() {
		return this.port;
	}

	public void setPort(Integer port) {
		this.port = port;
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
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

	public String getSystemCode() {
		return systemCode;
	}

	public void setSystemCode(String systemCode) {
		this.systemCode = systemCode;
	}
	
	public String getCreateTimeStart() {
		return createTimeStart;
	}

	public void setCreateTimeStart(String createTimeStart) {
		if (StringUtils.isNotEmpty(createTimeStart)) {
			this.createTimeStart = DateUtil.formatDate2NN(new Date(Long.valueOf(createTimeStart))) + " 00:00:00";
		} else {
			this.createTimeStart = createTimeStart;
		}
	}

	public String getCreateTimeEnd() {
		return createTimeEnd;
	}

	public void setCreateTimeEnd(String createTimeEnd) {
		if (StringUtils.isNotEmpty(createTimeEnd)) {
			this.createTimeEnd = DateUtil.formatDate2NN(new Date(Long.valueOf(createTimeEnd))) + " 23:59:59";
		} else {
			this.createTimeEnd = createTimeEnd;
		}
	}
}
