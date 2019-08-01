package com.talkingdata.wifianalytics.etl.support.util;

import com.talkingdata.wifianalytics.offline.compute.config.Config;
import com.talkingdata.wifianalytics.offline.compute.bean.OffLineBitmapDayCube;
import com.talkingdata.wifianalytics.offline.compute.dao.OffLineDayCubeDao;
import com.talkingdata.wifianalytics.offline.compute.util.TimeUtil;
import com.tenddata.bitmap.Bitmap;
import com.tenddata.bitmap.util.BitmapUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by loong on 4/28/16.
 */
public class OffLineBitmapCubeCalculator {
    public static Bitmap unionData(OffLineDayCubeDao dao, String tenantId, int projectId, String date, int dataType) {
        List<OffLineBitmapDayCube> bitmaps = new ArrayList<OffLineBitmapDayCube>();
        if (dataType <= Config.MAX_DATE_INTERVAL) {
            bitmaps.add(dao.query(tenantId, projectId, date, dataType));
        } else {
            int intervalMultiple = dataType / Config.MAX_DATE_INTERVAL;
            int intervalLess = dataType % Config.MAX_DATE_INTERVAL;
            //按最大的离线时间间隔循环获取数据
            for (int i = 0; i < intervalMultiple; i++) {
                bitmaps.add(dao.query(tenantId, projectId, date, Config.MAX_DATE_INTERVAL));
                date = TimeUtil.dateAdd(date, -1 * Config.MAX_DATE_INTERVAL, Config.DATE_FORMAT);
            }
            //获取剩余数据
            bitmaps.add(dao.query(tenantId, projectId, date, intervalLess));
        }
        Bitmap result = null;
        if (bitmaps == null || bitmaps.get(0) == null) return result;
        for (OffLineBitmapDayCube bitmapDayCube : bitmaps) {
            if (result == null) {
                result = BitmapUtil.byteArrayToBitmapRequest(bitmapDayCube.getBitmap());
            } else {
            	if (bitmapDayCube == null) continue;
                result = result.or(BitmapUtil.byteArrayToBitmapRequest(bitmapDayCube.getBitmap()));
            }
        }
        return result;
    }

}
