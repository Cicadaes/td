package com.tendcloud.enterprise.analytics.collector.web.bean;

import org.codehaus.jackson.annotate.JsonIgnore;

/**
 * @author sheng.hong
 */
public class Webparameter {

	private String deviceId = "";
	private String sequencenumber="";
	private String partnerId = "";
	private String pixel = "";
	private Session session = new Session();
	public String userAgent = "";
	private String ip = "";
	private String rectime = "";
	private String domain = "";
	@JsonIgnore
	private String v="";

	public String getV() {
		return v;
	}

	public void setV(String v) {
		this.v = v;
	}

	public void setDeviceId(String deviceId) {
		this.deviceId = deviceId;
	}

	public String getDeviceId() {
		return deviceId;
	}

	public void setPartnerId(String partnerId) {
		this.partnerId = partnerId;
	}

	public String getPartnerId() {
		return partnerId;
	}

	public void setPixel(String pixel) {
		this.pixel = pixel;
	}

	public String getPixel() {
		return pixel;
	}

	public void setSession(Session session) {
		this.session = session;
	}

	public Session getSession() {
		return session;
	}

	public void setSequencenumber(String sequencenumber) {
		this.sequencenumber = sequencenumber;
	}

	public String getSequencenumber() {
		return sequencenumber;
	}

	public void setUserAgent(String userAgent) {
		this.userAgent = userAgent;
	}

	public String getUserAgent() {
		return userAgent;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getIp() {
		return ip;
	}

	public void setRectime(String rectime) {
		this.rectime = rectime;
	}

	public String getRectime() {
		return rectime;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public String getDomain() {
		return domain;
	}

}
