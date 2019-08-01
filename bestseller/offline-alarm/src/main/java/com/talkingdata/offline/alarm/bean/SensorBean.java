package com.talkingdata.offline.alarm.bean;

public class SensorBean {
	
	private String projectId;
	
	private String projectName;
	
	private String projectPlacName;
	
	private String sensorId;
	
	private String sensorMac;
	
	private String roomNmae;
	
	private int newUserNum=0;
	
	private int oldUserNum=0;
	
	private int AllUserNum;
	
	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName==null?"":projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	
	public String getProjectPlacName() {
		return projectPlacName==null?"":projectPlacName;
	}

	public void setProjectPlacName(String projectPlacName) {
		this.projectPlacName = projectPlacName;
	}

	public String getSensorId() {
		return sensorId;
	}

	public void setSensorId(String sensorId) {
		this.sensorId = sensorId;
	}

	public String getSensorMac() {
		return sensorMac;
	}

	public void setSensorMac(String sensorMac) {
		this.sensorMac = sensorMac;
	}

	public String getRoomNmae() {
		return roomNmae==null?"":roomNmae;
	}

	public void setRoomNmae(String roomNmae) {
		this.roomNmae = roomNmae;
	}

	public int getNewUserNum() {
		return newUserNum;
	}

	public void setNewUserNum(int newUserNum) {
		this.newUserNum = newUserNum;
	}

	public int getOldUserNum() {
		return oldUserNum;
	}

	public void setOldUserNum(int oldUserNum) {
		this.oldUserNum = oldUserNum;
	}

	public int getAllUserNum() {
		return newUserNum+oldUserNum;
	}

	public void setAllUserNum(int allUserNum) {
		AllUserNum = allUserNum;
	}

	
}
