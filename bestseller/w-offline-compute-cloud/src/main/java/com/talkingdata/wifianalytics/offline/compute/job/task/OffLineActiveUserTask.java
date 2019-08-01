package com.talkingdata.wifianalytics.offline.compute.job.task;

import com.talkingdata.wifianalytics.offline.compute.config.Config;
import com.talkingdata.wifianalytics.offline.compute.bean.BitmapDayCube;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineActiveUserDayCounter;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineBitmapDayCube;
import com.talkingdata.wifianalytics.offline.compute.dao.ActiveUserDayCubeDao;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineActiveUserCounterDao;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineActiveUserCubeDao;
import com.talkingdata.wifianalytics.offline.compute.util.CollectionUtils;
import com.talkingdata.wifianalytics.offline.compute.util.TimeUtil;

import com.tenddata.bitmap.util.BitmapUtil;
import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by loong on 4/26/16.
 */
public class OffLineActiveUserTask extends OffLineTask {
    private static Logger logger = Logger.getLogger(OffLineActiveUserTask.class);

    private static ActiveUserDayCubeDao activeUserDayCubeDao = new ActiveUserDayCubeDao();

    private static OffLineActiveUserCubeDao offLineActiveUserCubeDao = new OffLineActiveUserCubeDao();
    
    private static OffLineActiveUserCounterDao offLineActiveUserCounterDao = new OffLineActiveUserCounterDao();

    OffLineActiveUserTask(String tenant_id, int project_id, String date, int dataInterval) {
        super(tenant_id, project_id, date, dataInterval);
    }

    @Override
    public void run() {
        logger.info(TaskName.OFFLINE_ACTIVE_USER_TASK.getName() + " begin.");
        try{
            String end = TimeUtil.dateAdd(this.date, 0, Config.DATE_FORMAT);
            String start = TimeUtil.dateAdd(this.date, this.dataInterval * -1, Config.DATE_FORMAT);
            List<BitmapDayCube> resultList = activeUserDayCubeDao.query(this.tenant_id, this.project_id, start, end);
            logger.debug(TaskName.OFFLINE_ACTIVE_USER_TASK.getName() + " query data : " + resultList);
            if (!CollectionUtils.isEmpty(resultList)) {
                List<OffLineBitmapDayCube> mergeResult = mergeDailyBitmap(resultList);
                logger.debug(TaskName.OFFLINE_ACTIVE_USER_TASK.getName() + " merge data : " + mergeResult);
                if (offLineActiveUserCubeDao.insert(mergeResult)) {
                    logger.info(TaskName.OFFLINE_ACTIVE_USER_TASK.getName() + " success.");

                    List<OffLineActiveUserDayCounter> offLineActiveUserDayCounters = new ArrayList<OffLineActiveUserDayCounter>();
                    for (BitmapDayCube cube: resultList) {
                        if (end.equals(cube.getDate())) {
                            OffLineActiveUserDayCounter counter = new OffLineActiveUserDayCounter();
                            counter.setDate(cube.getDate());
                            counter.setCount(BitmapUtil.byteArrayToBitmapRequest(cube.getBitmap()).cardinary());
                            counter.setProject_id(cube.getProject_id());
                            counter.setTenant_id(cube.getTenant_id());
                            offLineActiveUserDayCounters.add(counter);
                        }
                    }
                    if (offLineActiveUserDayCounters != null && offLineActiveUserDayCounters.size() != 0) {
                        offLineActiveUserCounterDao.insert(offLineActiveUserDayCounters);
                    }
                    logger.info(TaskName.OFFLINE_ACTIVE_USER_TASK.getName() + " success.");

                } else {
                    logger.info(TaskName.OFFLINE_ACTIVE_USER_TASK.getName() + " failed.");
                }
            } else {
                logger.info(TaskName.OFFLINE_ACTIVE_USER_TASK.getName() + "data is null!");
            }
        }catch (Exception e){
            e.printStackTrace();
            logger.error("计算到访失败",e);
        }
        logger.info(TaskName.OFFLINE_ACTIVE_USER_TASK.getName() + " end.");
    }
}
