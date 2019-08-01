package com.talkingdata.wifianalytics.offline.compute.job.task;

import java.util.ArrayList;
import java.util.List;

import com.talkingdata.wifianalytics.offline.compute.util.CollectionUtils;
import com.tenddata.bitmap.util.BitmapUtil;

import com.talkingdata.wifianalytics.offline.compute.bean.BitmapHourCube;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineActiveUserHourCounter;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineBitmapHourCube;
import com.talkingdata.wifianalytics.offline.compute.config.Config;
import com.talkingdata.wifianalytics.offline.compute.dao.ActiveUserHourCubeDao;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineActiveUserHourCounterDao;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineActiveUserHourCubeDao;
import com.talkingdata.wifianalytics.offline.compute.util.TimeUtil;
import org.apache.log4j.Logger;
/**
 * Created by loong on 4/27/16.
 */
public class OffLineActiveUserHourTask extends OffLineTask {
    private static Logger logger = Logger.getLogger(OffLineActiveUserHourTask.class);

    private static ActiveUserHourCubeDao activeUserHourCubeDao = new ActiveUserHourCubeDao();
//    private static OffLineActiveUserHourCubeDao offLineDao = new OffLineActiveUserHourCubeDao();
    private static OffLineActiveUserHourCounterDao counterDao = new OffLineActiveUserHourCounterDao();
    

    public OffLineActiveUserHourTask(String tenant_id, int project_id, String date, int dataInterval) {
        super(tenant_id, project_id, date, dataInterval);
    }

    @Override
    public void run() {
        logger.info(TaskName.OFFLINE_ACTIVE_USER_HOUR_TASK.getName() + " begin.");
        String end = TimeUtil.dateAdd(this.date, 0, Config.DATE_FORMAT);
        String start = TimeUtil.dateAdd(this.date, this.dataInterval * -1, Config.DATE_FORMAT);
        List<BitmapHourCube> resultList = activeUserHourCubeDao.query(this.tenant_id, this.project_id, start, end);
        logger.debug(TaskName.OFFLINE_ACTIVE_USER_HOUR_TASK.getName() + " query data : " + resultList);
        if (!CollectionUtils.isEmpty(resultList)) {
            List<OffLineBitmapHourCube> mergeResult = mergeHourBitmap(resultList);
            logger.debug(TaskName.OFFLINE_ACTIVE_USER_HOUR_TASK.getName() + " merge data : " + mergeResult);
            	List<OffLineActiveUserHourCounter> offLineActiveUserHourCounters = new ArrayList<OffLineActiveUserHourCounter>();
            	for (BitmapHourCube cube: resultList) {
					if (end.equals(cube.getDate())) {
						OffLineActiveUserHourCounter counter = new OffLineActiveUserHourCounter();
		                counter.setDate(cube.getDate());
		                counter.setCount(BitmapUtil.byteArrayToBitmapRequest(cube.getBitmap()).cardinary());
		                counter.setProject_id(cube.getProject_id());
		                counter.setTenant_id(cube.getTenant_id());
		                counter.setHour(cube.getHour());
		                offLineActiveUserHourCounters.add(counter);
					}
				}
            	
            	if (offLineActiveUserHourCounters != null && offLineActiveUserHourCounters.size() != 0) {
            		counterDao.insert(offLineActiveUserHourCounters);
				}
                logger.info(TaskName.OFFLINE_ACTIVE_USER_HOUR_TASK.getName() + " success.");
        } else {
            logger.info(TaskName.OFFLINE_ACTIVE_USER_HOUR_TASK.getName() + " data is null.");
        }
        logger.info(TaskName.OFFLINE_ACTIVE_USER_HOUR_TASK.getName() + " end.");
    }


}
