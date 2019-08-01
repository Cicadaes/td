package com.talkingdata.wifianalytics.offline.compute.bean;

/**
 * Created by loong on 4/26/16.
 */
public class OffLineBitmapSensorCube extends BitmapSensorCube {

    private int data_type;

    public int getData_type() {
        return data_type;
    }

    public void setData_type(int data_type) {
        this.data_type = data_type;
    }

    @Override
    public String toString() {
        return "OffLineBitmapSensorCube{" +
                "data_type=" + data_type +
                "} " + super.toString();
    }
}
