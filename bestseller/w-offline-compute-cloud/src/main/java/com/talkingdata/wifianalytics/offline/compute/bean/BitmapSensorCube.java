package com.talkingdata.wifianalytics.offline.compute.bean;

import com.tenddata.bitmap.util.BitmapUtil;

import java.sql.Timestamp;

/**
 * Created by loong on 4/27/16.
 */
public class BitmapSensorCube {
    private String tenant_id;
    private int project_id;
    private int place_id;
    private int sensor_id;
    private String date;
    private byte[] bitmap;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public byte[] getBitmap() {
        return bitmap;
    }

    public void setBitmap(byte[] bitmap) {
        this.bitmap = bitmap;
    }

    public Timestamp getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(Timestamp update_time) {
        this.update_time = update_time;
    }

    @Override
    public String toString() {
        return "BitmapSensorCube{" +
                "tenant_id='" + tenant_id + '\'' +
                ", project_id=" + project_id +
                ", place_id=" + place_id +
                ", sensor_id=" + sensor_id +
                ", date='" + date + '\'' +
                ", bitmap=" + BitmapUtil.byteArrayToBitmapRequest(bitmap).cardinary() +
                ", update_time=" + update_time +
                '}';
    }
}
