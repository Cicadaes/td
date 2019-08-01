package com.talkingdata.wifianalytics.offline.compute.job.task;

import java.util.ArrayList;
import java.util.List;

import com.talkingdata.wifianalytics.offline.compute.util.CollectionUtils;
import com.tenddata.bitmap.util.BitmapUtil;

import com.talkingdata.wifianalytics.offline.compute.bean.BitmapDayCube;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineUserDayCounter;
import com.talkingdata.wifianalytics.offline.compute.config.Config;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineStayOldUserDayCounterDao;
import com.talkingdata.wifianalytics.offline.compute.dao.StayOldUserDayCubeDao;
import com.talkingdata.wifianalytics.offline.compute.util.TimeUtil;
import com.tenddata.bitmap.Bitmap;
import org.apache.log4j.Logger;
/**
 * 停留老客
 * @author junmin.li
 */
public class OffLineStayOldUserTask extends OffLineTask {
    private static Logger logger = Logger.getLogger(OffLineStayOldUserTask.class);

    private static StayOldUserDayCubeDao stayOldUserDayCubeDao = new StayOldUserDayCubeDao();
    
    public static OffLineStayOldUserDayCounterDao offLineStayOldUserDayCounterDao = new OffLineStayOldUserDayCounterDao();
    
    OffLineStayOldUserTask(String tenant_id, int project_id, String date, int dataInterval) {
        super(tenant_id, project_id, date, dataInterval);
    }

    @Override
    public void run() {
        logger.info(TaskName.OFFLINE_STAY_OLD_USER_DAY_TASK.getName() + " begin.");
        String end = TimeUtil.dateAdd(this.date, 0, Config.DATE_FORMAT);
        String start = TimeUtil.dateAdd(this.date, this.dataInterval * -1, Config.DATE_FORMAT);
        List<BitmapDayCube> resultList = stayOldUserDayCubeDao.query(this.tenant_id, this.project_id, start, end);
        logger.debug(TaskName.OFFLINE_STAY_OLD_USER_DAY_TASK.getName() + " query data : " + resultList);
        if (!CollectionUtils.isEmpty(resultList)) {
                List<OffLineUserDayCounter> offLineUserDayCounters = new ArrayList<OffLineUserDayCounter>();
                for (BitmapDayCube cube: resultList) {
					if (end.equals(cube.getDate())) {
						OffLineUserDayCounter counter = new OffLineUserDayCounter();
		                counter.setDate(cube.getDate());
		                Bitmap bitmap = BitmapUtil.byteArrayToBitmapRequest(cube.getBitmap());
		                counter.setCount(bitmap.cardinary());
		                counter.setProject_id(cube.getProject_id());
		                counter.setTenant_id(cube.getTenant_id());
		                offLineUserDayCounters.add(counter);
					}
				}
            	if (offLineUserDayCounters != null && offLineUserDayCounters.size() != 0) {
            		offLineStayOldUserDayCounterDao.insert(offLineUserDayCounters);
				}
            	logger.info(TaskName.OFFLINE_STAY_OLD_USER_DAY_TASK.getName() + " success.");
            } else {
                logger.info(TaskName.OFFLINE_STAY_OLD_USER_DAY_TASK.getName() + " failed.");
            }
        logger.info(TaskName.OFFLINE_STAY_OLD_USER_DAY_TASK.getName() + " end.");
    }
}
