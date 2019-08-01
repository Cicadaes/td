package com.talkingdata.wifianalytics.offline.compute.job.task;

import java.util.ArrayList;
import java.util.List;

import com.talkingdata.wifianalytics.offline.compute.dao.OffLineStayUserDayCounterDao;
import com.talkingdata.wifianalytics.offline.compute.util.CollectionUtils;
import com.tenddata.bitmap.util.BitmapUtil;

import com.talkingdata.wifianalytics.offline.compute.bean.BitmapDayCube;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineStayUserDayCounter;
import com.talkingdata.wifianalytics.offline.compute.config.Config;
import com.talkingdata.wifianalytics.offline.compute.dao.StayUserDayCubeDao;
import com.talkingdata.wifianalytics.offline.compute.util.TimeUtil;
import org.apache.log4j.Logger;
/**
 * 
 */
public class OffLineStayUserTask extends OffLineTask {
    private static Logger logger = Logger.getLogger(OffLineStayUserTask.class);

    private static StayUserDayCubeDao stayUserDayCubeDao = new StayUserDayCubeDao();

    private static OffLineStayUserDayCounterDao offLineStayUserDayCounterDao = new OffLineStayUserDayCounterDao();

    OffLineStayUserTask(String tenant_id, int project_id, String date, int dataInterval) {
        super(tenant_id, project_id, date, dataInterval);
    }
    OffLineStayUserTask(String tenant_id, int project_id, int place_id, int room_id, String date, int dataInterval) {
    	super(tenant_id, project_id, place_id, room_id, 0, date, dataInterval);
    }

    @Override
    public void run() {
        String end = TimeUtil.dateAdd(this.date, 0, Config.DATE_FORMAT);
        String start = TimeUtil.dateAdd(this.date, this.dataInterval * -1, Config.DATE_FORMAT);
        logger.info(TaskName.OFFLINE_STAY_USER_DAY_TASK.getName() + " begin.");
        List<BitmapDayCube> resultList = stayUserDayCubeDao.query(this.tenant_id, this.project_id, start, end);
        logger.debug(TaskName.OFFLINE_STAY_USER_DAY_TASK.getName() + " query data : " + resultList);

        //只需要计算昨天的即可。
        if (!CollectionUtils.isEmpty(resultList)) {
            //TODO WG 需要添加delete方法，否则当有删除条目时，无法保证删除。
            List<OffLineStayUserDayCounter> offLineUserDayCounters = new ArrayList<OffLineStayUserDayCounter>();
            for (BitmapDayCube cube : resultList){
                OffLineStayUserDayCounter counter = new OffLineStayUserDayCounter();
                counter.setDate(cube.getDate());
                counter.setCount(BitmapUtil.byteArrayToBitmapRequest(cube.getBitmap()).cardinary());
                counter.setProject_id(cube.getProject_id());
                counter.setTenant_id(cube.getTenant_id());

                offLineUserDayCounters.add(counter);
            }
            if (offLineUserDayCounters != null && offLineUserDayCounters.size() != 0) {
                offLineStayUserDayCounterDao.insert(offLineUserDayCounters);
            }
            logger.info(TaskName.OFFLINE_STAY_USER_DAY_TASK.getName() + " success.");
        } else {
            logger.info(TaskName.OFFLINE_STAY_USER_DAY_TASK.getName() + "data is null!");
        }
        logger.info(TaskName.OFFLINE_STAY_USER_DAY_TASK.getName() + " end.");
    }


}
