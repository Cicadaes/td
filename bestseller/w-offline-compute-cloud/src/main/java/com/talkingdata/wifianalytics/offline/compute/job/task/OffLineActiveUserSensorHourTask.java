package com.talkingdata.wifianalytics.offline.compute.job.task;

import java.util.ArrayList;
import java.util.List;

import com.talkingdata.wifianalytics.offline.compute.util.CollectionUtils;
import com.tenddata.bitmap.util.BitmapUtil;

import com.talkingdata.wifianalytics.offline.compute.bean.BitmapSensorHourCube;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineActiveUserSensorHourCounter;
import com.talkingdata.wifianalytics.offline.compute.config.Config;
import com.talkingdata.wifianalytics.offline.compute.dao.ActiveUserSensorHourCubeDao;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineActiveUserSensorHourCounterDao;
import com.talkingdata.wifianalytics.offline.compute.util.TimeUtil;
import org.apache.log4j.Logger;
/**
 * junmin.li 探针每小时数据
 */
public class OffLineActiveUserSensorHourTask extends OffLineTask {

    private static Logger logger = Logger.getLogger(OffLineActiveUserSensorHourTask.class);

    private static ActiveUserSensorHourCubeDao sensorHourDao = new ActiveUserSensorHourCubeDao();
    
    private static OffLineActiveUserSensorHourCounterDao sensorCounterDao = new OffLineActiveUserSensorHourCounterDao();

    public OffLineActiveUserSensorHourTask(String tenant_id, int project_id, int place_id,
                                    int sensor_id, String date, int dataInterval) {
        super(tenant_id, project_id, place_id, 0, sensor_id, date, dataInterval);
    }

    @Override
    public void run() {
        logger.info(TaskName.OFFLINE_ACTIVE_USER_SENSOR_HOUR_TASK.getName() + " begin.");
        String end = TimeUtil.dateAdd(this.date, 0, Config.DATE_FORMAT);
        logger.info(" 1 begin.");
        String start = TimeUtil.dateAdd(this.date, this.dataInterval * -1, Config.DATE_FORMAT);
        logger.info(" 2 begin.");
        List<BitmapSensorHourCube> resultList = sensorHourDao.query(
                this.tenant_id, this.project_id, this.place_id, this.sensor_id, start, end);
        logger.info(" 3 begin.");
        logger.debug(TaskName.OFFLINE_ACTIVE_USER_SENSOR_HOUR_TASK.getName() + " query data : " + resultList);
        if (!CollectionUtils.isEmpty(resultList)) {
        	
        	List<OffLineActiveUserSensorHourCounter> offLineActiveUserSensorHourCounters = new ArrayList<OffLineActiveUserSensorHourCounter>();
        	for (BitmapSensorHourCube cube: resultList) {
				if (end.equals(cube.getDate())) {
					OffLineActiveUserSensorHourCounter counter = new OffLineActiveUserSensorHourCounter();
	                counter.setDate(cube.getDate());
	                counter.setCount(BitmapUtil.byteArrayToBitmapRequest(cube.getBitmap()).cardinary());
	                counter.setPlace_id(cube.getPlace_id());
	                counter.setProject_id(cube.getProject_id());
	                counter.setSensor_id(cube.getSensor_id());
	                counter.setHour(cube.getHour());
	                counter.setTenant_id(cube.getTenant_id());
	                offLineActiveUserSensorHourCounters.add(counter);
				}
			}
        	if (offLineActiveUserSensorHourCounters != null && offLineActiveUserSensorHourCounters.size() != 0) {
        		sensorCounterDao.insert(offLineActiveUserSensorHourCounters);
			}
        } else {
            logger.info(TaskName.OFFLINE_ACTIVE_USER_SENSOR_HOUR_TASK.getName() + " data is null.");
        }
        logger.info(TaskName.OFFLINE_ACTIVE_USER_SENSOR_HOUR_TASK.getName() + " end.");
    }


}
