package com.talkingdata.wifianalytics.etl.support.factory;

import com.talkingdata.wifianalytics.etl.support.util.OffLineBitmapCubeCalculator;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineOldUserCubeDao;
import com.tenddata.bitmap.Bitmap;

/**
 * Created by loong on 4/28/16.
 */
public class OldUserDataFactory implements OffLineDataFactory {
    private static OffLineOldUserCubeDao dao = new OffLineOldUserCubeDao();

    @Override
    public Bitmap query(int crowdId, String tenantId, int projectId, String date, int dataType) {
        return OffLineBitmapCubeCalculator.unionData(dao, tenantId, projectId, date, dataType);
    }
}
