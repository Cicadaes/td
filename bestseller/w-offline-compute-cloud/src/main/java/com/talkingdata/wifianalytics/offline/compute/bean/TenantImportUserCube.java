package com.talkingdata.wifianalytics.offline.compute.bean;

import java.sql.Timestamp;
import java.util.Arrays;

/**
 * Created by loong on 4/28/16.
 */
public class TenantImportUserCube {
    private String tenant_id;
    private int project_id;
    private String date;
    private int crowd_id;
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

    public int getCrowd_id() {
        return crowd_id;
    }

    public void setCrowd_id(int crowd_id) {
        this.crowd_id = crowd_id;
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
        return "TenantImportUserCube{" +
                "tenant_id='" + tenant_id + '\'' +
                ", project_id=" + project_id +
                ", date='" + date + '\'' +
                ", crowd_id=" + crowd_id +
                ", bitmap=" + Arrays.toString(bitmap) +
                ", update_time=" + update_time +
                '}';
    }
}
