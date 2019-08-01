package com.talkingdata.wifianalytics.offline.compute.job.task.util;

import java.util.List;


import com.talkingdata.wifianalytics.offline.compute.bean.BitmapDayCube;
import com.talkingdata.wifianalytics.offline.compute.bean.BitmapHourCube;
import com.talkingdata.wifianalytics.offline.compute.bean.BitmapSensorCube;
import com.talkingdata.wifianalytics.offline.compute.job.task.key.CubeKey;
import com.talkingdata.wifianalytics.offline.compute.job.task.key.HighLevelKey;
import com.talkingdata.wifianalytics.offline.compute.job.task.standard.StandardResult;
import com.tenddata.bitmap.util.BitmapUtil;

/**
 * Created by loong on 4/27/16.
 */
public class CommonResultUtil {
    public static StandardResult breakUpDayCube(List<BitmapDayCube> resultList) {
        StandardResult standardResult = new StandardResult();
        for (BitmapDayCube bitmapDayCube : resultList) {
            CubeKey key = new CubeKey(bitmapDayCube.getDate(), bitmapDayCube.getTenant_id(), bitmapDayCube.getProject_id());
            HighLevelKey highLevelKey = new HighLevelKey(bitmapDayCube.getTenant_id(), bitmapDayCube.getProject_id());
            standardResult.getCubes().put(key, BitmapUtil.byteArrayToBitmapRequest(bitmapDayCube.getBitmap()));
            standardResult.getHighLevelPrimaryKey().add(highLevelKey);
        }
        return standardResult;
    }

    public static StandardResult breakUpHourCube(List<BitmapHourCube> resultList) {
        StandardResult standardResult = new StandardResult();
        for (BitmapHourCube bitmapHourCube : resultList) {
            CubeKey key = new CubeKey(bitmapHourCube.getDate(), bitmapHourCube.getHour(),
                    bitmapHourCube.getTenant_id(), bitmapHourCube.getProject_id());
            HighLevelKey highLevelKey = new HighLevelKey(bitmapHourCube.getTenant_id(),
                    bitmapHourCube.getProject_id(), bitmapHourCube.getHour());
            standardResult.getCubes().put(key, BitmapUtil.byteArrayToBitmapRequest(bitmapHourCube.getBitmap()));
            standardResult.getHighLevelPrimaryKey().add(highLevelKey);
        }
        return standardResult;
    }

    public static StandardResult breakUpSensorCube(List<BitmapSensorCube> resultList) {
        StandardResult standardResult = new StandardResult();
        for (BitmapSensorCube bitmapSensorCube : resultList) {
            CubeKey key = new CubeKey(bitmapSensorCube.getDate(), bitmapSensorCube.getTenant_id(),
                    bitmapSensorCube.getProject_id(), bitmapSensorCube.getPlace_id(),0, bitmapSensorCube.getSensor_id());
            HighLevelKey highLevelKey = new HighLevelKey(bitmapSensorCube.getTenant_id(), bitmapSensorCube.getProject_id(),
                    bitmapSensorCube.getPlace_id(), 0,bitmapSensorCube.getSensor_id());
            standardResult.getCubes().put(key, BitmapUtil.byteArrayToBitmapRequest(bitmapSensorCube.getBitmap()));
            standardResult.getHighLevelPrimaryKey().add(highLevelKey);
        }
        return standardResult;
    }
    

}
