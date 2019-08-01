package com.talkingdata.marketing.core.constant;

/**
 * @author xiaoming.kang on 2018/01/11.
 * 请求Config接口的系统参数名称常量
 */
public class ParamConstants {

    /**
     * The constant SYSTEM_CODE.营销闭环系统编码.查询config时使用
     */
    public final static String SYSTEM_CODE = "marketing";

    /**
     * 用户管家服务HOST和PORT
     */
    public final static String DMP_HOST =  "marketing.userCloud.host";
    /**
     * The constant DMP_PORT.
     */
    public final static String DMP_PORT = "marketing.userCloud.port";
    /**
     * 查询引擎服务HOST和PORT
     */
    public final static String QUERYENGINE_HOST = "marketing.queryEngine.host";
    /**
     * The constant QUERYENGINE_PORT.
     */
    public final static String QUERYENGINE_PORT = "marketing.queryEngine.port";

    /**
     * HDFS相关配置
     */
    public final static String MARKETING_HDFS_USER = "marketing.hdfs.user";
    /**
     * The constant MARKETING_HDFS_PATH.
     */
    public final static String MARKETING_HDFS_PATH = "marketing.hdfs.addr";
    /**
     * The constant MARKETING_HDFS_REPORT_PATH.HDFS报告地址
     */
    public final static String MARKETING_HDFS_REPORT_PATH = "marketing.hdfs.report.addr";

    /**
     * The constant TASK_MAXRETRY.人群计算最大重试次数
     */
    public final static String TASK_MAXRETRY = "marketing.task.maxretry";

    /**
     * The constant SCHEDULE_THREAD_POOL_SIZE.任务调度线程池大小
     */
    public final static String SCHEDULE_THREAD_POOL_SIZE = "marketing.schedule.threadPool.size";


    /**
     * The constant MARKETING_ATTACHMENT_PATH.真正发送的文件在本地存储的位置
     * //TODO config  //目前config貌似没有这个参数.
     */
    public final static String MARKETING_ATTACHMENT_PATH = "marketing.attachment.path";

    /**
     * The constant MARKETING_RECORD_STAT_DAYS.recordStatDays天内创建的calc record
     */
    public final static String MARKETING_RECORD_STAT_DAYS = "marketing.record.stat.days";

    /**
     * 文件修改时间多少分钟前
     */
    public final static String MARKETING_RECORD_STAT_DELAY_MINUTES = "marketing.record.stat.delay.minutes";

    /**
     * 用户管家人群自定义参数
     */
    public final static String MARKETING_DMP_CROWD_ATTRIBUTES = "marketing.dmp.crowd.attributes";

    /**
     * 人群账号类型优先级配置
     */
    public final static String MARKETING_CROWD_ACCOUNT_TYPE = "marketing.crowd.accountType";

    /**
     * 任务计算的最大时长
     */
    public final static String MARKETING_TASK_CALC_MAX_DURATION = "marketing.task.calc.duration";


    //已经弃用的参数.可以考虑删除.

    //计算检查超时时间?
    //public final static String CALC_CHECK_TIMEOUT_SECOND = "marketing.calc.check.timeout.second";
    //上传一方人群文件在本地存储的位置
    //public final static String MARKETING_ID_FILE_LOCAL_PATH = "marketing.idFile.local_path";
    //投放计算最大重试次数
    //public final static String MARKETING_SEGMENT_CALC_MAX_RETRY = "marketing.segment.calc.max_retry";
    //dataDownload最大重试字数
    //public final static String MARKETING_DOWNLOAD_MAX_RETRY = "marketing.download.max_retry";

    //public final static String MARKETING_CROWD_ACCOUNT_TYPE = "marketing.crowd.accountType";
    //public final static String MARKETING_CROWD_VARIABLE = "marketing.crowd.variable";

}
