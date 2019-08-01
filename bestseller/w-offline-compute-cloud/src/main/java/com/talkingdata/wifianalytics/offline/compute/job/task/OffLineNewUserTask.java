package com.talkingdata.wifianalytics.offline.compute.job.task;

import java.util.ArrayList;
import java.util.List;

import com.talkingdata.wifianalytics.offline.compute.util.CollectionUtils;
import com.tenddata.bitmap.util.BitmapUtil;

import com.talkingdata.wifianalytics.offline.compute.bean.BitmapDayCube;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineNewUserDayCounter;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineBitmapDayCube;
import com.talkingdata.wifianalytics.offline.compute.config.Config;
import com.talkingdata.wifianalytics.offline.compute.dao.NewUserDayCubeDao;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineNewUserDayCounterDao;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineNewUserCubeDao;
import com.talkingdata.wifianalytics.offline.compute.util.TimeUtil;
import org.apache.log4j.Logger;
/**
 * Created by loong on 4/26/16.
 */
public class OffLineNewUserTask extends OffLineTask {
    private static Logger logger = Logger.getLogger(OffLineNewUserTask.class);

    private static NewUserDayCubeDao newUserDayCubeDao = new NewUserDayCubeDao();

    private static OffLineNewUserCubeDao offLineNewUserCubeDao = new OffLineNewUserCubeDao();
    
    private static OffLineNewUserDayCounterDao offLineNewUserDayCounterDao = new OffLineNewUserDayCounterDao();

    OffLineNewUserTask(String tenant_id, int project_id, String date, int dataInterval) {
        super(tenant_id, project_id, date, dataInterval);
    }

    @Override
    public void run() {
        logger.info(TaskName.OFFLINE_NEW_USER_TASK.getName() + " begin.");
        String end = TimeUtil.dateAdd(this.date, 0, Config.DATE_FORMAT);
        String start = TimeUtil.dateAdd(this.date, this.dataInterval * -1, Config.DATE_FORMAT);
        List<BitmapDayCube> resultList = newUserDayCubeDao.query(this.tenant_id, this.project_id, start, end);
        logger.debug(TaskName.OFFLINE_NEW_USER_TASK.getName() + " query data : " + resultList);
        if (!CollectionUtils.isEmpty(resultList)) {
            List<OffLineBitmapDayCube> mergeResult = mergeDailyBitmap(resultList);
            logger.debug(TaskName.OFFLINE_NEW_USER_TASK.getName() + " merge data : " + mergeResult);
            if (offLineNewUserCubeDao.insert(mergeResult)) {
            	
            	List<OffLineNewUserDayCounter> offLineNewUserDayCounters = new ArrayList<OffLineNewUserDayCounter>();
            	for (BitmapDayCube cube: resultList) {
					if (end.equals(cube.getDate())) {
						OffLineNewUserDayCounter counter = new OffLineNewUserDayCounter();
		                counter.setDate(cube.getDate());
		                counter.setCount(BitmapUtil.byteArrayToBitmapRequest(cube.getBitmap()).cardinary());
		                counter.setProject_id(cube.getProject_id());
		                counter.setTenant_id(cube.getTenant_id());
		                offLineNewUserDayCounters.add(counter);
					}
				}
            	if (offLineNewUserDayCounters != null && offLineNewUserDayCounters.size() != 0) {
            		offLineNewUserDayCounterDao.insert(offLineNewUserDayCounters);
				}
                logger.info(TaskName.OFFLINE_NEW_USER_TASK.getName() + " success.");
            } else {
                logger.info(TaskName.OFFLINE_NEW_USER_TASK.getName() + " failed.");
            }
        } else {
            logger.info(TaskName.OFFLINE_NEW_USER_TASK.getName() + "data is null!");
        }
        logger.info(TaskName.OFFLINE_NEW_USER_TASK.getName() + " end.");
    }


}
