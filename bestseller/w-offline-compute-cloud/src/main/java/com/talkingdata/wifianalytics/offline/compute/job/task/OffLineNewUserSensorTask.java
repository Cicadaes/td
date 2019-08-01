package com.talkingdata.wifianalytics.offline.compute.job.task;

import java.util.ArrayList;
import java.util.List;

import com.talkingdata.wifianalytics.offline.compute.util.CollectionUtils;
import com.tenddata.bitmap.util.BitmapUtil;

import com.talkingdata.wifianalytics.offline.compute.bean.BitmapSensorCube;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineBitmapSensorCube;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineNewUserSensorDayCounter;
import com.talkingdata.wifianalytics.offline.compute.config.Config;
import com.talkingdata.wifianalytics.offline.compute.dao.NewUserSensorDayCubeDao;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineNewUserSensorDayCounterDao;
import com.talkingdata.wifianalytics.offline.compute.util.TimeUtil;
import org.apache.log4j.Logger;

/**
 * Created by loong on 4/27/16.
 */
public class OffLineNewUserSensorTask extends OffLineTask {

    private static Logger logger = Logger.getLogger(OffLineNewUserSensorTask.class);

    private static NewUserSensorDayCubeDao newUserSensorDayCubeDao = new NewUserSensorDayCubeDao();

    private static OffLineNewUserSensorDayCounterDao newSensorDayCounterDao = new OffLineNewUserSensorDayCounterDao();

    public OffLineNewUserSensorTask(String tenant_id, int project_id, int place_id,
                                    int sensor_id, String date, int dataInterval) {
        super(tenant_id, project_id, place_id, 0, sensor_id, date, dataInterval);
    }

    @Override
    public void run() {
        logger.info(TaskName.OFFLINE_NEW_USER_SENSOR_TASK.getName() + " begin.");
        String end = TimeUtil.dateAdd(this.date, 0, Config.DATE_FORMAT);
        String start = TimeUtil.dateAdd(this.date, this.dataInterval * -1, Config.DATE_FORMAT);
        List<BitmapSensorCube> resultList = newUserSensorDayCubeDao.query(
                this.tenant_id, this.project_id, this.place_id, this.sensor_id, start, end);
        logger.debug(TaskName.OFFLINE_NEW_USER_SENSOR_TASK.getName() + " query data : " + resultList);
        if (!CollectionUtils.isEmpty(resultList)) {
            List<OffLineBitmapSensorCube> mergeResult = mergeSensorBitmap(resultList);
            logger.debug(TaskName.OFFLINE_NEW_USER_SENSOR_TASK.getName() + " merge data : " + mergeResult);

            List<OffLineNewUserSensorDayCounter> offLineNewUserSensorDayCounters = new ArrayList<OffLineNewUserSensorDayCounter>();
            for (BitmapSensorCube cube: resultList) {
                if (end.equals(cube.getDate())) {
                    OffLineNewUserSensorDayCounter counter = new OffLineNewUserSensorDayCounter();
                    counter.setDate(cube.getDate());
                    counter.setCount(BitmapUtil.byteArrayToBitmapRequest(cube.getBitmap()).cardinary());
                    counter.setProject_id(cube.getProject_id());
                    counter.setTenant_id(cube.getTenant_id());
                    counter.setPlace_id(cube.getPlace_id());
                    counter.setSensor_id(cube.getSensor_id());
                   offLineNewUserSensorDayCounters.add(counter);
                }
            }
            if (offLineNewUserSensorDayCounters != null && offLineNewUserSensorDayCounters.size() != 0) {
                newSensorDayCounterDao.insert(offLineNewUserSensorDayCounters);
            }
            logger.info(TaskName.OFFLINE_NEW_USER_SENSOR_TASK.getName() + " success.");
            } else {
                logger.info(TaskName.OFFLINE_NEW_USER_SENSOR_TASK.getName() + " failed.");
            }
        logger.info(TaskName.OFFLINE_NEW_USER_SENSOR_TASK.getName() + " end.");
    }


}
