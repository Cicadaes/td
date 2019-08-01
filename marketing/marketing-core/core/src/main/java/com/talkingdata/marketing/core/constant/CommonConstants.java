package com.talkingdata.marketing.core.constant;

/**
 * 公用常量定义
 *    此类定义一些与业务无关的公用常量，如文件中使用特殊符号、数学中使用的符号等等
 *
 * @author sheng.hong
 * @date 2018-02-08
 * Copyright(C) 2018, Beijing TendCloud Science & Technology Co., Ltd.
 */
public class CommonConstants {

    /**
     * 系统默认用户名
     */
    public final static String SYSTEM_USER = "marketing";

    /**
     * 合计常量,主要用于通过key来取值,例如访问用于运营平台获取人群总人数时
     */
    public final static String TOTAL = "total";

    /**
     * 营销闭环邮件服务配置
     */
    public final static String MAIL_SERVER_CODE = "MarketingMailServer";
    /**
     * 人群计算邮件发送模板
     */
    public final static String MAIL_CROWD_TEMPLATE = "MarketingCrowdTemplate";
    /**
     * 人群下载邮件模板
     */
    public final static String MAIL_CROWD_DOWNLOAD_TEMPLATE = "MarketingCrowdDownloadTemplate";

    /**
     * 与用户管家交互的接口参数
     */
    public final static String REF_SOURCE_LABEL = "1";

    /**
     * 与用户管家交互的接口参数
     */
    public final static String REF_SOURCE_CROWD_BUILD = "2";

    /**
     * 与用户管家交互的接口参数
     */
    public final static String REF_SOURCE_MARKING = "3";

    /**
     * 简单的状态常量
     */
    public static class SampleStatusConstants {
        /**
         * 正常
         */
        public final static int NORMAL = 0;

        /**
         * 删除
         */
        public final static int DELETE = -1;
    }

    /**
     * 文件中使用的符号常量
     *
     * @author sheng.hong
     * @create 2018-02-08
     */
    public static class FileSymbolConstants {

        /**
         * 换行符
         */
        public final static String NEW_LINE = "\n";
    }

}
