package com.talkingdata.wifianalytics.etl.support.factory;

import com.talkingdata.wifianalytics.etl.support.util.OffLineBitmapCubeCalculator;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineActiveUserCubeDao;
import com.tenddata.bitmap.Bitmap;

/**
 * Created by loong on 4/28/16.
 */
public class ActiveUserDataFactory implements OffLineDataFactory {
    private static OffLineActiveUserCubeDao dao = new OffLineActiveUserCubeDao();
    @Override
    public Bitmap query(int crowdId, String tenantId, int projectId, String date, int dataType) {
        return OffLineBitmapCubeCalculator.unionData(dao,tenantId,projectId,date,dataType);
    }
}
