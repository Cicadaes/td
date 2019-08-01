package com.talkingdata.wifianalytics.offline.compute.job.task;

import java.util.ArrayList;
import java.util.List;

import com.talkingdata.wifianalytics.offline.compute.util.CollectionUtils;
import com.tenddata.bitmap.util.BitmapUtil;

import com.talkingdata.wifianalytics.offline.compute.bean.BitmapDayCube;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineOldUserDayCounter;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineBitmapDayCube;
import com.talkingdata.wifianalytics.offline.compute.config.Config;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineOldUserDayCounterDao;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineOldUserCubeDao;
import com.talkingdata.wifianalytics.offline.compute.dao.OldUserDayCubeDao;
import com.talkingdata.wifianalytics.offline.compute.util.TimeUtil;
import org.apache.log4j.Logger;
/**
 * Created by loong on 4/27/16.
 */
public class OffLineOldUserTask extends OffLineTask {
    private static Logger logger = Logger.getLogger(OffLineOldUserTask.class);

    private static OldUserDayCubeDao oldUserDayCubeDao = new OldUserDayCubeDao();
    private static OffLineOldUserCubeDao offLineOldUserCubeDao = new OffLineOldUserCubeDao();
    
    private static OffLineOldUserDayCounterDao offLineOldUserDayCounterDao = new OffLineOldUserDayCounterDao();

    public OffLineOldUserTask(String tenant_id, int project_id, String date, int dataInterval) {
        super(tenant_id, project_id, date, dataInterval);
    }

    @Override
    public void run() {
        logger.info(TaskName.OFFLINE_OLD_USER_TASK.getName() + " begin.");
        String end = TimeUtil.dateAdd(this.date, 0, Config.DATE_FORMAT);
        String start = TimeUtil.dateAdd(this.date, this.dataInterval * -1, Config.DATE_FORMAT);
        List<BitmapDayCube> resultList = oldUserDayCubeDao.query(this.tenant_id, this.project_id, start, end);
        logger.debug(TaskName.OFFLINE_OLD_USER_TASK.getName() + " query data : " + resultList);
        if (!CollectionUtils.isEmpty(resultList)) {
            List<OffLineBitmapDayCube> mergeResult = mergeDailyBitmap(resultList);
            logger.debug(TaskName.OFFLINE_OLD_USER_TASK.getName() + " merge data : " + mergeResult);
            if (offLineOldUserCubeDao.insert(mergeResult)) {
            	List<OffLineOldUserDayCounter> offLineOldUserDayCounters = new ArrayList<OffLineOldUserDayCounter>();
            	for (BitmapDayCube cube: resultList) {
					if (end.equals(cube.getDate())) {
						OffLineOldUserDayCounter counter = new OffLineOldUserDayCounter();
		                counter.setDate(cube.getDate());
		                counter.setCount(BitmapUtil.byteArrayToBitmapRequest(cube.getBitmap()).cardinary());
		                counter.setProject_id(cube.getProject_id());
		                counter.setTenant_id(cube.getTenant_id());
		                offLineOldUserDayCounters.add(counter);
					}
				}
            	
            	if (offLineOldUserDayCounters != null && offLineOldUserDayCounters.size() != 0) {
            		offLineOldUserDayCounterDao.insert(offLineOldUserDayCounters);
				}
                logger.info(TaskName.OFFLINE_OLD_USER_TASK.getName() + " success.");
            } else {
                logger.info(TaskName.OFFLINE_OLD_USER_TASK.getName() + " failed.");
            }
        } else {
            logger.info(TaskName.OFFLINE_OLD_USER_TASK.getName() + " data is null.");
        }
        logger.info(TaskName.OFFLINE_OLD_USER_TASK.getName() + " end.");
    }
}
