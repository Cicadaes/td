package com.talkingdata.wifianalytics.etl.support.service;

import com.talkingdata.wifianalytics.etl.support.config.CrowdType;
import com.tenddata.bitmap.Bitmap;

/**
 * Created by loong on 4/28/16.
 */
public interface DataService {

    /**
     * 根据人群类型,及其它参数获取bitmap
     *
     * @param crowdType AU,OU,CU,NU
     * @param crowdId   客群ID, 如果crowdType为CU,则此id必须传参
     * @param tenantId  租户ID
     * @param projectId 项目ID
     * @param date      查询日期
     * @param dataType  例如 : 30,60,90,180, 即date参数往前推多少天的bitmap合集
     * @return bitmap
     */
    Bitmap query(CrowdType crowdType, int crowdId, String tenantId, int projectId, String date, int dataType);
}
