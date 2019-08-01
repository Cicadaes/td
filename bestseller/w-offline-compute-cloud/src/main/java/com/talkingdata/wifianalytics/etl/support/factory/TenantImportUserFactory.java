package com.talkingdata.wifianalytics.etl.support.factory;

import com.talkingdata.wifianalytics.offline.compute.bean.TenantImportUserCube;
import com.talkingdata.wifianalytics.offline.compute.dao.TenantImportUserCubeDao;
import com.tenddata.bitmap.Bitmap;
import com.tenddata.bitmap.util.BitmapUtil;

/**
 * Created by loong on 4/28/16.
 */
public class TenantImportUserFactory implements OffLineDataFactory {
    private static TenantImportUserCubeDao dao = new TenantImportUserCubeDao();

    @Override
    public Bitmap query(int crowdId, String tenantId, int projectId, String date, int dataType) {
        TenantImportUserCube result = dao.query(tenantId, projectId, crowdId);
        if (result != null) {
            return BitmapUtil.byteArrayToBitmapRequest(result.getBitmap());
        }
        return null;
    }
}
