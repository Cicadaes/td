package com.talkingdata.marketing.streaming.model;

/**
 * @author tingwen.liu
 * @create 2018-03-14
 * Copyright(C) 2018, Beijing TendCloud Science & Technology Co., Ltd.
 */
public class ExecutorResultDataConstant {

    /**
     *  保存类型 hdfs
     */
    public static final String SAVE_TYPE_HDFS = "hdfs";
    /**
     *  保存类型 es
     */
    public static final String SAVE_TYPE_ES = "es";
    /**
     * 输出数据类型 eventpackage
     */
    public static final String DATA_TYPE_EVENTPACKAGE = "eventpackage";
    /**
     * 输出数据类型 messagedata
     */
    public static final String DATA_TYPE_MESSAGEDATA = "messagedata";
    /**
     * 输出数据类型 equity
     */
    public static final String DATA_TYPE_EQUITY = "equity";
    /**
     * 输出数据类型 生成人群
     */
    public static final String DATA_TYPE_GENERATE_CROWD = "generatecrowd";
    /**
     * 输出数据类型 异常的ep数据
     */
    public static final String DATA_TYPE_EXCEPTION_EP = "exceptionep";
    /**
     * eventpackage存储在es中的index名
     */
    public static final String EP_ES_INDEX = "mkt-eventpackage";
    /**
     * eventpackage存储在es中的type名
     */
    public static final String EP_ES_TYPE = "eventpackage";
    /**
     * 短信或push存储在es中的index名
     */
    public static final String MESSAGE_ES_INDEX = "mkt-messagedata";
    /**
     * 短信或push存储在es中的type名
     */
    public static final String MESSAGE_ES_TYPE = "messagedata";
    /**
     * 权益发放存储在es中的index名
     */
    public static final String EQUITY_ES_INDEX = "mkt-equitydistributionrecord";
    /**
     * 权益发放存储在es中的type名
     */
    public static final String EQUITY_ES_TYPE = "equitydistributionrecord";
    /**
     * 生成人群的hdfs主目录
     */
    public static final String GENERATE_CROWD_HDFS_DIR = "/mkt-generate-crowd-data/";
    /**
     * 生成人群的hdfs分区目录(此partition字段为生成DataSet中对象字段即GenerateCrowdScala对象中的字段)
     */
    public static final String[] GENERATE_CROWD_HDFS_PARTITION = new String[]{"campaignId", "pipelineId"};
    /**
     * 异常的ep数据的hdfs主目录
     */
    public static final String EXCEPTION_EP_HDFS_DIR = "/mkt-exception-ep-data/";


}
