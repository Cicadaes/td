package td.enterprise.common.constant;

/**
 * Created by Yan on 2017/3/7.
 *
 * @description: 通用常量
 * @author: cmh 2015年8月5日
 * @version: 1.0
 * @modify: <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology
 * Co., Ltd.<br>
 */
public class CommonConstants {

    public static class ServiceInterfaceCallLogStatus {

        /**
         * 初始状态,接口调用前状态
         */
        public static int INIT_STATUS = 0;

        /**
         * 服务调用成功
         */
        public static int INVOKE_SERVICE_SUCCESS = 1;

        /**
         * 服务调用异常
         */
        public static int INVOKE_SERVICE_EXCEPTION = -1;

        /**
         * 任务执行成功
         */
        public static int TASK_EXECUTE_SUCCESS = 2;

        /**
         * 任务执行异常
         */
        public static int TASK_EXECUTE_EXCEPTION = -2;

        /**
         * 文件下载成功
         */
        public static int INVOKE_DOWNLOAD_SUCCESS = 3;

        /**
         * 文件下载异常
         */
        public static int INVOKE_DOWNLOAD_EXCEPTION = -3;

    }

    public static class BaseCalcRecordStatusConstants {
        /**
         * 任务计算状态：0，未计算
         */
        public static final int CALC_STATUS_PENDING = 0;

        /**
         * 任务计算状态：1，计算中
         */
        public static final int CALC_STATUS_RUNNING = 1;

        /**
         * 任务计算状态：2,计算完成
         */
        public static final int CALC_STATUS_FINISHED = 2;

        /**
         * 任务计算状态：-1,计算异常
         */
        public static final int CALC_STATUS_EXCEPTION = -1;

        /**
         * 任务计算状态：-2，计算超时
         */
        public static final int CALC_STATUS_TIMEOUT = -2;

        /**
         * 任务计算状态：-3，待计算
         */
        public static final int CALC_STATUS_TORELAUNCH = -3;

        /**
         * 任务计算状态：-4，重新计算
         */
        public static final int CALC_STATUS_RELAUNCH = -4;
    }

    public static class TaskCalcStatusConstants {
        /**
         * 任务计算状态：0，未计算
         */
        public static final int TASK_CALC_STATUS_PENDING = 0;

        /**
         * 任务计算状态：1，计算中
         */
        public static final int TASK_CALC_STATUS_RUNNING = 1;

        /**
         * 任务计算状态：2,计算完成
         */
        public static final int TASK_CALC_STATUS_FINISHED = 2;

        /**
         * 任务计算状态：-1,计算异常
         */
        public static final int TASK_CALC_STATUS_EXCEPTION = -1;

        /**
         * 任务计算状态：-2，计算超时
         */
        public static final int TASK_CALC_STATUS_TIMEOUT = -2;

        /**
         * 任务计算状态：-3，待计算
         */
        public static final int TASK_CALC_STATUS_TORELAUNCH = -3;

        /**
         * 任务计算状态：-4，重新计算
         */
        public static final int TASK_CALC_STATUS_RELAUNCH = -4;
    }

    public static class AttachmentConstants {

        /**
         * 附件常量：1、用户导出
         */
        public static final int ATTACHMENT_TYPE_USER_EXPORT = 1;

        /**
         * 附件常量：2、用户导入
         */
        public static final int ATTACHMENT_TYPE_USER_IMPORT = 2;

        /**
         * 附件常量：3、人群导出
         */
        public static final int ATTACHMENT_TYPE_CROWD_EXPORT = 3;

        /**
         * 附件常量：4、人群导入
         */
        public static final int ATTACHMENT_TYPE_CROWD_IMPORT = 4;

        /**
         * 附件常量：5、etl单表导入
         */
        public static final int ATTACHMENT_TYPE_ETL_IMPORT = 5;

        /**
         * 附件常量：6、第三方标签导入
         */
        public static final int ATTACHMENT_TYPE_EXTERN_TAG_IMPORT = 6;
    }

    public static final String CONFIG_KEY_HIVE_DBS_NAME = "hive.dbs.name";

    /**
     * ETL 单表数据模板
     */
    public static final String ETL_TEMPLATE_FILE_PATH = "hive.table.simulated.data.template.file.path";


    /**
     * 日期
     */
    public final static String DATE_STRING = "yyyy-MM-dd";
}

