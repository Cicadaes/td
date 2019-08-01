package com.talkingdata.wifianalytics.etl.support.factory;

import com.tenddata.bitmap.Bitmap;

/**
 * Created by loong on 4/28/16.
 */
public interface OffLineDataFactory {

    Bitmap query(int crowdId, String tenantId, int projectId, String date, int dataType);
}
