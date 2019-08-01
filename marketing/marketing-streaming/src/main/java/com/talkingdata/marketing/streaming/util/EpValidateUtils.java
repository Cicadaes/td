package com.talkingdata.marketing.streaming.util;

import com.tendcloud.tenddata.entity.EventPackage;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Created by tend on 2017/12/6.
 */
public class EpValidateUtils {

    private static final Logger logger = LoggerFactory.getLogger(EpValidateUtils.class);

    /**
     * 校验mDeviceId
     *
     * @param eventPackage EventPackage
     * @return 通过返回true，否则false
     */
    public static boolean validateMDeviceId(EventPackage eventPackage) {
        if (StringUtils.isEmpty(eventPackage.mDeviceId)) {
            logger.error("mDeviceId: {}, eventPackage mDeviceId is null", eventPackage.mDeviceId);
            return false;
        }
        return true;
    }

    /**
     * 校验获取Pipeline相关信息的参数
     *
     * @param eventPackage EventPackage
     * @return 通过返回true，否则false
     */
    public static boolean validatePipelineInfo(EventPackage eventPackage) {
        if (eventPackage.additiveProfile.campaignId == null) {
            logger.error("mDeviceId: {}, eventPackage campaignId is null", eventPackage.mDeviceId);
            return false;
        }
        if (eventPackage.additiveProfile.pipelineDefinitionId == null) {
            logger.error("mDeviceId: {}, eventPackage pipelineDefinitionId is null", eventPackage.mDeviceId);
            return false;
        }
        return true;
    }

    /**
     * 校验rectime
     *
     * @param eventPackage EventPackage
     * @return 通过返回true，否则false
     */
    public static boolean validateRectime(EventPackage eventPackage) {
        if (eventPackage.rectime == null) {
            logger.error("mDeviceId: {}, eventPackage rectime is null", eventPackage.mDeviceId);
            return false;
        }
        return true;
    }


}
