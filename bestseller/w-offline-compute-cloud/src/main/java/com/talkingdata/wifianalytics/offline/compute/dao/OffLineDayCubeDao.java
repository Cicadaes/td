package com.talkingdata.wifianalytics.offline.compute.dao;

import com.talkingdata.wifianalytics.offline.compute.bean.OffLineBitmapDayCube;

import java.util.List;

/**
 * Created by loong on 4/28/16.
 */
public interface OffLineDayCubeDao {
    boolean insert(final List<OffLineBitmapDayCube> offLineBitmapDayCubes);

    OffLineBitmapDayCube query(String tenant_id, int project_id, String date, int data_type);
}
