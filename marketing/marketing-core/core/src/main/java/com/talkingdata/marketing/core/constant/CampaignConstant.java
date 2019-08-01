package com.talkingdata.marketing.core.constant;

import java.util.HashMap;
import java.util.Map;

/**
 * 活动常量类
 *
 * @author xiaoming.kang
 */
public class CampaignConstant {
    /**
     * 活动名称最大长度
     */
    public final static int CAMPAIGN_NAME_MAX_LENGTH = 52;
    /**
     * 活动描述最大长度
     */
    public final static int CAMPAIGN_DESCRIPTION_MAX_LENGTH = 160;
    /**
     * The constant CAMPAIGN_STATUS_MAP.
     */
    public final static Map<Integer, String> CAMPAIGN_STATUS_MAP = new HashMap<Integer, String>() {{
        put(CampaignStatusConstant.CAMPAIGN_WAITING, "等待开始");
        put(CampaignStatusConstant.CAMPAIGN_RUNNING, "进行中");
        put(CampaignStatusConstant.CAMPAIGN_FINISH, "已结束");
        put(CampaignStatusConstant.CAMPAIGN_DELETE, "已删除");
    }};

    /**
     * The type Campaign status constant.
     */
    public static class CampaignStatusConstant {
        /**
         * 等待开始
         */
        public static Integer CAMPAIGN_WAITING = 1;
        /**
         * 正在运行
         */
        public static Integer CAMPAIGN_RUNNING = 2;
        /**
         * 已完成
         */
        public static Integer CAMPAIGN_FINISH = 3;
        /**
         * //已删除
         */
        public static Integer CAMPAIGN_DELETE = -1;
    }
}
