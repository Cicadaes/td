package com.talkingdata.wifianalytics.offline.compute.bean;


import com.tenddata.bitmap.util.BitmapUtil;

import java.sql.Timestamp;

/**
 * Created by loong on 4/27/16.
 */
public class BitmapHourCube {

    private String tenant_id;
    private int project_id;
    private String date;
    private int hour;
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

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

    @Override
    public String toString() {
        return "BitmapHourCube{" +
                "tenant_id='" + tenant_id + '\'' +
                ", project_id=" + project_id +
                ", date='" + date + '\'' +
                ", hour=" + hour +
                ", bitmap=" + BitmapUtil.byteArrayToBitmapRequest(bitmap).cardinary() +
                ", update_time=" + update_time +
                '}';
    }
}
