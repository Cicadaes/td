package com.talkingdata.wifianalytics.offline.compute.job.task.key;

/**
 * Created by loong on 4/26/16.
 */
public class CubeKey {

    private String date;
    private int hour;
    private String tenant_id;
    private int project_id;
    private int place_id;
    private int sensor_id;
    private int room_id;

    public CubeKey(String date, String tenant_id, int project_id) {
        this.date = date;
        this.tenant_id = tenant_id;
        this.project_id = project_id;
    }

    public CubeKey(String date, int hour, String tenant_id, int project_id) {
        this.date = date;
        this.hour = hour;
        this.tenant_id = tenant_id;
        this.project_id = project_id;
    }

    public CubeKey(String date, String tenant_id, int project_id, int place_id, int room_id, int sensor_id) {
        this.date = date;
        this.tenant_id = tenant_id;
        this.project_id = project_id;
        this.place_id = place_id;
        this.room_id = room_id;
        this.sensor_id = sensor_id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

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

    public int getPlace_id() {
        return place_id;
    }

    public void setPlace_id(int place_id) {
        this.place_id = place_id;
    }

    public int getSensor_id() {
        return sensor_id;
    }

    public void setSensor_id(int sensor_id) {
        this.sensor_id = sensor_id;
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CubeKey cubeKey = (CubeKey) o;

        if (hour != cubeKey.hour) return false;
        if (project_id != cubeKey.project_id) return false;
        if (place_id != cubeKey.place_id) return false;
        if (room_id != cubeKey.room_id) return false;
        if (sensor_id != cubeKey.sensor_id) return false;
        if (!date.equals(cubeKey.date)) return false;
        return tenant_id != null ? tenant_id.equals(cubeKey.tenant_id) : cubeKey.tenant_id == null;

    }

    @Override
    public int hashCode() {
        int result = date.hashCode();
        result = 31 * result + hour;
        result = 31 * result + (tenant_id != null ? tenant_id.hashCode() : 0);
        result = 31 * result + project_id;
        result = 31 * result + place_id;
        result = 31 * result + sensor_id;
        result = 31 * result + room_id;
        return result;
    }

	/**
	 * @return the room_id
	 */
	public int getRoom_id() {
		return room_id;
	}

	/**
	 * @param room_id the room_id to set
	 */
	public void setRoom_id(int room_id) {
		this.room_id = room_id;
	}
    
    
}
