package com.talkingdata.wifianalytics.etl.support.factory;

import com.talkingdata.wifianalytics.etl.support.util.OffLineBitmapCubeCalculator;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineNewUserCubeDao;
import com.tenddata.bitmap.Bitmap;

/**
 * Created by loong on 4/28/16.
 */
public class NewUserDataFactory implements OffLineDataFactory {
    private static OffLineNewUserCubeDao dao = new OffLineNewUserCubeDao();
    @Override
    public Bitmap query(int crowdId, String tenantId, int projectId, String date, int dataType) {
        return OffLineBitmapCubeCalculator.unionData(dao,tenantId,projectId,date,dataType);
    }
}
