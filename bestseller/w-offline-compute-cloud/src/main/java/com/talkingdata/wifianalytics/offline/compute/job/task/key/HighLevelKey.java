package com.talkingdata.wifianalytics.offline.compute.job.task.key;

/**
 * Created by loong on 4/27/16.
 */
public class HighLevelKey {

    private String tenant_id;
    private int project_id;
    private int place_id;
    private int room_id;
    private int sensor_id;
    private int hour;


    public HighLevelKey(String tenant_id, int project_id) {
        this.tenant_id = tenant_id;
        this.project_id = project_id;
    }

    public HighLevelKey(String tenant_id, int project_id, int hour) {
        this.tenant_id = tenant_id;
        this.project_id = project_id;
        this.hour = hour;
    }

    public HighLevelKey(String tenant_id, int project_id, int place_id,int room_id, int sensor_id) {
        this.tenant_id = tenant_id;
        this.project_id = project_id;
        this.place_id = place_id;
        this.room_id = room_id;
        this.sensor_id = sensor_id;
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
    
    

    public int getRoom_id() {
		return room_id;
	}

	public void setRoom_id(int room_id) {
		this.room_id = room_id;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        HighLevelKey that = (HighLevelKey) o;

        if (project_id != that.project_id) return false;
        if (place_id != that.place_id) return false;
        if (sensor_id != that.sensor_id) return false;
        if (hour != that.hour) return false;
        return tenant_id != null ? tenant_id.equals(that.tenant_id) : that.tenant_id == null;

    }

    @Override
    public int hashCode() {
        int result = tenant_id != null ? tenant_id.hashCode() : 0;
        result = 31 * result + project_id;
        result = 31 * result + place_id;
        result = 31 * result + sensor_id;
        result = 31 * result + hour;
        return result;
    }
}
