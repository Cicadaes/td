package com.talkingdata.offline.alarm.bean;

public class ProjectBean {
	
	private String projectId;
	
	private String projectName;
	
	private String openTime;
	
	private String closeTime;
	
	private int passengerFlow;
	
	private double areas;//项目所有房间的总面积

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getOpenTime() {
		return openTime;
	}

	public void setOpenTime(String openTime) {
		this.openTime = openTime;
	}

	public String getCloseTime() {
		return closeTime;
	}

	public void setCloseTime(String closeTime) {
		this.closeTime = closeTime;
	}

	public int getPassengerFlow() {
		return passengerFlow;
	}

	public void setPassengerFlow(int passengerFlow) {
		this.passengerFlow = passengerFlow;
	}

	public double getAreas() {
		return areas;
	}

	public void setAreas(double areas) {
		this.areas = areas;
	}
	
	
}
