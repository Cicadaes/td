package com.talkingdata.wifianalytics.offline.compute.bean;


/**
 * 到访人数每小时离线统计
 * @author junmin
 *
 */
public class OffLineActiveUserHourCounter {

	private String tenant_id;
	private int project_id;
    private String date;
    private int hour;
    private int count;
    
	public String getTenant_id() {
		return tenant_id;
	}
	public void setTenant_id(String tenant_id) {
		this.tenant_id = tenant_id;
	}
	public int getProject_id() {
		return project_id;
	}
	public void setProject_id(int project_id) {
		this.project_id = project_id;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	
	public int getHour() {
		return hour;
	}
	public void setHour(int hour) {
		this.hour = hour;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
}
