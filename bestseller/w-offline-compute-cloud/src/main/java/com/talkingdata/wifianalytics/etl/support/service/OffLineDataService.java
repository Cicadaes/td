package com.talkingdata.wifianalytics.etl.support.service;

import com.talkingdata.wifianalytics.etl.support.config.CrowdType;
import com.tenddata.bitmap.Bitmap;

/**
 * Created by loong on 4/28/16.
 */
public class OffLineDataService implements DataService {
    @Override
    public Bitmap query(CrowdType crowdType, int crowdId, String tenantId,
                        int projectId, String date, int dataType) {
        return crowdType.getFactory().query(crowdId, tenantId, projectId, date, dataType);
    }
}
