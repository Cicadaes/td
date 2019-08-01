package com.talkingdata.wifianalytics.offline.compute.job.task;

import com.talkingdata.wifianalytics.offline.compute.config.Config;
import com.talkingdata.wifianalytics.offline.compute.bean.*;
import com.talkingdata.wifianalytics.offline.compute.job.task.key.CubeKey;
import com.talkingdata.wifianalytics.offline.compute.job.task.key.HighLevelKey;
import com.talkingdata.wifianalytics.offline.compute.job.task.standard.StandardResult;
import com.talkingdata.wifianalytics.offline.compute.job.task.util.CommonResultUtil;
import com.talkingdata.wifianalytics.offline.compute.util.TimeUtil;
import com.tenddata.bitmap.Bitmap;
import com.tenddata.bitmap.util.BitmapUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by loong on 4/26/16.
 */
public abstract class OffLineTask implements Task {

    protected String date;
    protected String tenant_id;
    protected int project_id;
    protected int place_id;
    protected int room_id;
    protected int sensor_id;
    protected int dataInterval;

    public OffLineTask(String tenant_id, int project_id, String date, int dataInterval) {
        this.tenant_id = tenant_id;
        this.project_id = project_id;
        this.dataInterval = dataInterval;
        this.date = date;
    }

    public OffLineTask(String tenant_id, int project_id, int place_id, int room_id, int sensor_id, String date, int dataInterval) {
        this.tenant_id = tenant_id;
        this.project_id = project_id;
        this.place_id = place_id;
        this.room_id = room_id;
        this.sensor_id = sensor_id;
        this.dataInterval = dataInterval;
        this.date = date;
    }


    List<OffLineBitmapDayCube> mergeDailyBitmap(List<BitmapDayCube> resultList) {
        StandardResult standardResult = CommonResultUtil.breakUpDayCube(resultList);
        List<OffLineBitmapDayCube> offLineBitmapDayCubes = new ArrayList<OffLineBitmapDayCube>();
        for (int i = 0; i < this.dataInterval; i++) {
            for (HighLevelKey highLevelKey : standardResult.getHighLevelPrimaryKey()) {
                Bitmap bitmap = mergeBitmap(TaskType.DAILY, i + 1, highLevelKey, standardResult.getCubes());
                if (bitmap != null) {
                    OffLineBitmapDayCube offLineBitmapDayCube = new OffLineBitmapDayCube();
                    offLineBitmapDayCube.setDate(this.date);
                    offLineBitmapDayCube.setData_type(i + 1);
                    offLineBitmapDayCube.setBitmap(BitmapUtil.bitmapRequestToByteArray(bitmap));
                    offLineBitmapDayCube.setProject_id(highLevelKey.getProject_id());
                    offLineBitmapDayCube.setTenant_id(highLevelKey.getTenant_id());
                    offLineBitmapDayCubes.add(offLineBitmapDayCube);
                }
            }
        }
        return offLineBitmapDayCubes;
    }

    List<OffLineBitmapHourCube> mergeHourBitmap(List<BitmapHourCube> resultList) {
        StandardResult standardResult = CommonResultUtil.breakUpHourCube(resultList);
        List<OffLineBitmapHourCube> offLineBitmapDayCubes = new ArrayList<OffLineBitmapHourCube>();
        for (int i = 0; i < this.dataInterval; i++) {
            for (HighLevelKey highLevelKey : standardResult.getHighLevelPrimaryKey()) {
                Bitmap bitmap = mergeBitmap(TaskType.HOUR, i + 1, highLevelKey, standardResult.getCubes());
                if (bitmap != null) {
                    OffLineBitmapHourCube offLineBitmapHourCube = new OffLineBitmapHourCube();
                    offLineBitmapHourCube.setDate(this.date);
                    offLineBitmapHourCube.setData_type(i + 1);
                    offLineBitmapHourCube.setBitmap(BitmapUtil.bitmapRequestToByteArray(bitmap));
                    offLineBitmapHourCube.setProject_id(highLevelKey.getProject_id());
                    offLineBitmapHourCube.setTenant_id(highLevelKey.getTenant_id());
                    offLineBitmapHourCube.setHour(highLevelKey.getHour());
                    offLineBitmapDayCubes.add(offLineBitmapHourCube);
                }
            }
        }
        return offLineBitmapDayCubes;
    }

    List<OffLineBitmapSensorCube> mergeSensorBitmap(List<BitmapSensorCube> resultList) {
        StandardResult standardResult = CommonResultUtil.breakUpSensorCube(resultList);
        List<OffLineBitmapSensorCube> offLineBitmapDayCubes = new ArrayList<OffLineBitmapSensorCube>();
        for (int i = 0; i < this.dataInterval; i++) {
            for (HighLevelKey highLevelKey : standardResult.getHighLevelPrimaryKey()) {
                Bitmap bitmap = mergeBitmap(TaskType.SENSOR, i + 1, highLevelKey, standardResult.getCubes());
                if (bitmap != null) {
                    OffLineBitmapSensorCube offLineBitmapSensorCube = new OffLineBitmapSensorCube();
                    offLineBitmapSensorCube.setDate(this.date);
                    offLineBitmapSensorCube.setData_type(i + 1);
                    offLineBitmapSensorCube.setBitmap(BitmapUtil.bitmapRequestToByteArray(bitmap));
                    offLineBitmapSensorCube.setProject_id(highLevelKey.getProject_id());
                    offLineBitmapSensorCube.setTenant_id(highLevelKey.getTenant_id());
                    offLineBitmapSensorCube.setPlace_id(highLevelKey.getPlace_id());
                    offLineBitmapSensorCube.setSensor_id(highLevelKey.getSensor_id());
                    offLineBitmapDayCubes.add(offLineBitmapSensorCube);
                }
            }
        }
        return offLineBitmapDayCubes;
    }

    private Bitmap mergeBitmap(TaskType taskType, int dateInterval, HighLevelKey highLevelKey, Map<CubeKey, Bitmap> cubes) {
        Bitmap result = null;
        CubeKey key = null;
        for (int i = 0; i < dateInterval; i++) {
            switch (taskType) {
                case DAILY:
                    key = new CubeKey(TimeUtil.dateAdd(this.date, (i + 1) * -1, Config.DATE_FORMAT), highLevelKey.getTenant_id(),
                            highLevelKey.getProject_id());
                    break;
                case HOUR:
                    key = new CubeKey(TimeUtil.dateAdd(this.date, (i + 1) * -1, Config.DATE_FORMAT), highLevelKey.getHour(),
                            highLevelKey.getTenant_id(), highLevelKey.getProject_id());
                    break;
                case SENSOR:
                    key = new CubeKey(TimeUtil.dateAdd(this.date, (i + 1) * -1, Config.DATE_FORMAT), highLevelKey.getTenant_id(),
                            highLevelKey.getProject_id(), highLevelKey.getPlace_id(), 0,highLevelKey.getSensor_id());
                    break;
                case DAILY_ROOM:
                    key = new CubeKey(TimeUtil.dateAdd(this.date, (i + 1) * -1, Config.DATE_FORMAT), highLevelKey.getTenant_id(),
                            highLevelKey.getProject_id(),highLevelKey.getPlace_id(),highLevelKey.getRoom_id(),0);
                    break;
            }
            if (result == null) {
                result = cubes.get(key);
            } else
                result = result.or(cubes.get(key));
        }
        return result;
    }
}
