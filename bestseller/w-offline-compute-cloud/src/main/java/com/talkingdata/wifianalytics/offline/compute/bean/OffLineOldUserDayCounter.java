package com.talkingdata.wifianalytics.offline.compute.bean;

import java.sql.Timestamp;

/**
 * 到访老客
 * @author junmin.li
 *
 */
public class OffLineOldUserDayCounter {

	private String tenant_id;
	private int project_id;
    private String date;
    private int count;
    private Timestamp update_time;
    
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
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	public Timestamp getUpdate_time() {
		return update_time;
	}
	public void setUpdate_time(Timestamp update_time) {
		this.update_time = update_time;
	}

    
}
