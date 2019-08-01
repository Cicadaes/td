package td.enterprise.wanalytics.etl.constant;


import java.io.File;

/**
 * Created by tendcloud on 2016/1/19.
 */
public class WifipixTaskConstant {

    //key value

    public static String BETCH_INTERFACE_FE_BETCH_FILE_KEY = "file";
    public static String BETCH_INTERFACE_FE_BETCH_ETOKEN_KEY = "token";
//    public static String BETCH_INTERFACE_FE_BETCH_ETOKEN_VALUE = "69p9TVxLqP6fA";
    public static String BETCH_INTERFACE_FE_BETCH_APPKEY_KEY = "appkey";
//    public static String BETCH_INTERFACE_FE_BETCH_APPKEY_VALUE = "569610b28bda20a5270f88f5";
    public static String BETCH_INTERFACE_FE_BETCH_TYPE_KEY = "type";
    public static String BETCH_INTERFACE_FE_BETCH_INPUTIDTYPE_KEY = "inputIdType";
    public static String BETCH_INTERFACE_FE_BETCH_OUTPUTIDTYPE_KEY = "outputIdType";
    public static String BETCH_INTERFACE_FE_BETCH_TASKID_KEY = "taskid";
    public static String BETCH_INTERFACE_FE_BETCH_ISENCRYPT_KEY = "isEncrypt";
    public static String BETCH_INTERFACE_FE_BETCH_CALLBACKURL_KEY = "callBackUrl";


    public static String BETCH_INTERFACE_FE_BETCH_TASK_SUBMIT_URL = "https://api.talkingdata.com/dmp/batch/common/idupload/v2";

    public static String BETCH_INTERFACE_FE_BETCH_TASK_STATUS_URL = "https://api.talkingdata.com/dmp/batch/common/getTaskStatus/v2";
    public static String BETCH_INTERFACE_FE_BETCH_TASK_DOWNLOAD_URL = "https://api.talkingdata.com/dmp/batch/common/download/v2";

    public static final String INDEX_START = "sensor_log_";

    public static String BETCH_INTERFACE_FE_BETCH_APPS_POPULAR_TOPN_TASK_SUBMIT_URL = "http://172.16.1.252:8080/common/activeAppTopN";
    public static String BETCH_INTERFACE_FE_BETCH_APPS_POPULAR_TOPN_CITY_KEY = "city";
    public static String BETCH_INTERFACE_FE_BETCH_APPS_POPULAR_TOPN_TOPN_KEY = "topN";


    public static String BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_TASK_SUBMIT_URL = "https://api.talkingdata.com/dmp/batch/common/activeApp";
    public static String BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_TASKID_KEY = "taskid";
    public static String BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_STARTDATE_KEY = "startDate";
    public static String BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_ENDDATE_KEY = "endDate";
    public static String BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_USER_KEY = "user";
    public static String BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_USER_VALUE = "fe";
    public static String BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_INPUTPATH_KEY = "inputPath";
    public static String BETCH_INTERFACE_FE_BETCH_ACTIVEAPP_INPUTPATH_VALUE = "/camus/temp/appList/test_data/";

    public static String BETCH_INTERFACE_WIFIPIX_BETCH_TASK_SUBMIT_URL = "http://chrdw.wifipix.com:8080/wifipix_services/service/Bizs";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_TASK_STATUS_URL = "http://chrdw.wifipix.com:8080/wifipix_services/task/status";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_TASK_DOWNLOAD_URL = "http://chrdw.wifipix.com:8080/wifipix_services/download";

    public static String BETCH_INTERFACE_WIFIPIX_BETCH_FILE_KEY = "file";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_ETOKEN_KEY = "token";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_DATATYPE_KEY = "dataType";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_PERSONTIME_KEY = "personTime";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_QUERYTYPE_KEY = "queryType";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_CALLBACKURL_KEY = "callbackUrl";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_QUERYSTARTTIME_KEY = "queryStartTime";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_QUERYENDTIME_KEY = "queryEndTime";

    public static String BETCH_INTERFACE_WIFIPIX_BETCH_TASKID_KEY = "taskId";

    public static String BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR = "\t";
    public static String BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK = "\n";
    public static String BETCH_COUNT_OUTPUT_FORMAT_COMMA = ",";

    public static String TAB = "\t";
    public static String LINE = "\n";
    public static String COMMA = ",";

    //标签输出格式
    public static String LABEL = "label";
    public static String PRICE = "price";
    public static String STANDARDBRAND = "standardBrand";

    public static final String PARAM_KEY_INPUT_FILE_PATH = "inputFilePath";
    public static final String PARAM_KEY_OUTPUT_FILE_PATH = "outputFilePath";
    public static final String PARAM_KEY_START_DATE = "START_DATE";
    public static final String PARAM_KEY_END_DATE = "END_DATE";
    public static final String PARAM_KEY_RUN_DATE = "RUN_DATE";
    public static final String CYCLE_STATISTICS = "CYCLE_STATISTICS";
    public static final String PARAM_KEY_CUSTOM_CROWD = "CROWD";
    public static final String PARAM_KEY_CUSTOM_TENANT = "TENANT";
    public static final String PARAM_KEY_SUM = "SUM";

    //根目录地址定义{wanalytics_home}+/datafile/tmp/
    public static final String CFG_DATA_FILE_PATH_ROOT ="/home/hadoop/wanalytics/datafile/tmp/";
//    public static final String CFG_DATA_FILE_PATH_ROOT ="C:/_cloud/project/wifianalytics/datafile/tmp/";
    public static final int CFG_POOL_THREADS_NUMBER = 8;
    public static final long CFG_STATUS_QUERY_PERIOD = 1000 * 60;
    public static final int CFG_STATUS_QUERY_MAX_NUMBER = 60 * 100;

    public static final String LOG_POLLING = "polling";


    public static final String TD_DMP_BATCH_TASK_SUBMIT = "TD_DMP_BATCH_TASK_SUBMIT" ;//TD DMP任务提交(IDMapping,兴趣,地理位置)
    public static final String TD_DMP_BATCH_TASK_STATUS	= "TD_DMP_BATCH_TASK_STATUS" ;//TD DMP查询任务状态接口
    public static final String TD_DMP_BATCH_TASK_DOWNLOAD	= "TD_DMP_BATCH_TASK_DOWNLOAD" ;//TD DMP获取任务执行结果接口
    public static final String TD_DMP_BATCH_ACTIVEAPP_TASK_SUBMIT = "TD_DMP_BATCH_ACTIVEAPP_TASK_SUBMIT" ;//活跃App接口
    public static final String TD_DMPAPPS_POPULAR_TOPN_TASK_SUBMIT	= "TD_DMPAPPS_POPULAR_TOPN_TASK_SUBMIT";//城市活跃App接口
    public static final String WIFIPIX_BETCH_TASK_SUBMIT	= "WIFIPIX_BETCH_TASK_SUBMIT" ;//WIFIPix任务提交接口
    public static final String WIFIPIX_BETCH_TASK_STATUS	= "WIFIPIX_BETCH_TASK_STATUS" ;//WIFIPix任务执行状态获取接口
    public static final String WIFIPIX_BETCH_TASK_DOWNLOAD	= "WIFIPIX_BETCH_TASK_DOWNLOAD" ;//WIFIPix任务执行结果获取接口
    public static final String TD_DMP_BATCH_APP_INFO	= "TD_DMP_BATCH_APP_INFO" ;//查询APP名称接口

    //Lookalike 接口
    public static final String LOOKALIKE_BETCH_TASK_SUBMIT	= "LOOKALIKE_BETCH_TASK_SUBMIT" ;
    public static final String LOOKALIKE_BETCH_TASK_STATUS	= "LOOKALIKE_BETCH_TASK_STATUS" ;
    public static final String LOOKALIKE_BETCH_TASK_DOWNLOAD	= "LOOKALIKE_BETCH_TASK_DOWNLOAD" ;

    //dmk 接口
    public static final String TD_DMK_APP_TYPES_INFO	= "TD_DMK_APP_TYPES_INFO" ;//基础信息-分类相关-获取分类信息列表 I040116
    public static final String TD_DMK_APP_TYPES_QUERY	= "TD_DMK_APP_TYPES_QUERY" ;//获取一组App的所属分类
    public static final String TD_DMK_APP_APPNAME_FIND	= "TD_DMK_APP_APPNAME_FIND" ;//appname查分类
    public static final String TD_DMK_APP_APPHASH_TO_APPID	= "TD_DMK_APP_APPHASH_TO_APPID" ;//根据AppHash查询AppID

    public static final String DMK_BATCH_PAGESIZE  = "dmk.batch.pagesize";

    public static final String TD_DMK_GET_ACCESS_TOKEN  = "TD_DMK_GET_ACCESS_TOKEN"; //DMK获取accessToken接口
    public static final String TD_DMK_IDMAPPING = "TD_DMK_IDMAPPING";  //IDMappping接口   I010102
    public static final String TD_DMK_TAGDEMOGRAPHIC = "TD_DMK_TAGDEMOGRAPHIC"; //I010202-人口属性标签查询服务
    public static final String TD_DMK_TAG_APP = "TD_DMK_TAG_APP"; //I010203-应用兴趣标签查询服务
    public static final String TD_DMK_TAG_DEVICE = "TD_DMK_TAG_DEVICE"; //I010209-移动终端设备属性标签查询服务
    public static final String TD_DMK_POSITION_DEVICE = "TD_DMK_POSITION_DEVICE"; //I010305-月聚集位置查询服务
    public static final String TD_DMK_USER_LOC_RESIDENCE_INFO = "TD_DMK_USER_LOC_RESIDENCE_INFO"; //sdmk夜间活跃区域查询服务
    public static final String TD_DMK_GET_USER_LOC_RESIDENCE_INFO_ACCESS_TOKEN = "TD_DMK_GET_USER_LOC_RESIDENCE_INFO_ACCESS_TOKEN"; // 获取验证信息

    //Xmeans 接口
    public static final String X_MEANS_TASK_SUBMIT	= "X_MEANS_TASK_SUBMIT" ;
    public static final String X_MEANS_TASK_STATUS	= "X_MEANS_TASK_STATUS" ;
    public static final String X_MEANS_TASK_DOWNLOAD	= "X_MEANS_TASK_DOWNLOAD" ;

    // id type
    public static final String TD_DMK_ID_TYPE_IMEI = "imei";
    public static final String TD_DMK_ID_TYPE_IDFA = "idfa";
    public static final String TD_DMK_ID_TYPE_TDID = "tdid";
    public static final String TD_DMK_ID_TYPE_ANDROIDID = "androidid";
    public static final String TD_DMK_ID_TYPE_MAC = "mac";






    //1、发起调用 2、任务执行完成 3、文件下载完成 -1、发起调用失败-2、任务执行异常 -3、文件下载异常
    public static final int TASK_STATUS_LAUNCH = 1;
    public static final int TASK_STATUS_FINISH = 2;
    public static final int TASK_STATUS_DOWNLOAD = 3;
    public static final int TASK_STATUS_LAUNCH_FAILURE = -1;
    public static final int TASK_STATUS_RUN_FAILURE = -2;
    public static final int TASK_STATUS_DOWNLOAD_FAILURE = -3;

    //log记录的type类型：1,IDMapping 2,标签 3,地理位置 4,app活跃 5城市app活跃 6,wifipix
    public static final String TASK_TYPE_ID_MAPPING = "1";
    public static final String TASK_TYPE_TAG = "2";
    public static final String TASK_TYPE_POSITION = "3";
    public static final String TASK_TYPE_APP_ACTIVE = "4";
    public static final String TASK_TYPE_CITY_APP_ACTIVE = "5";
    public static final String TASK_TYPE_WIFIPIX = "6";
    public static final String TASK_TYPE_LOOKALIKE = "7";

    public static final String TASK_TYPE_APP_TYPES_INFO = "8";
    public static final String TASK_TYPE_APP_TYPES_QUERY = "9";
    public static final String TASK_TYPE_APP_TYPES_APPHASH_TO_APPID = "10";

    public static final String TASK_TYPE_XMEANS = "11";

    public static final int  SHELL_STATUS_DEFAULT = 0;//默认返回
    public static final int  SHELL_STATUS_CONTINUE = 2;//可以继续执行
    public static final int  SHELL_STATUS_EXCEPTION = 1;//需要退出

    public static final String MATCH_TYPE = "match.type";//匹配tdid时，ALL则全部获取，NEW表示只匹配新的mac
    public static final String MATCH_TYPE_ALL="ALL";
    public static final String MATCH_TYPE_NEW="NEW";

    public static final String TDID_GET_WAY = "tdidGetWay";
    public static final String TDID_GET_FE ="fe";
    public static final String TDID_GET_DMK="dmk";
    public static final String TDID_GET_DMP="dmp";
    public static final String TDID_GET_FTP="ftp";
    public static final String TDID_UPLOADPATH="tdidUploadpath";
    public static final String TDID_DOWNLOADPATH="tdidDownloadpath";
    public static final String TDID_FTP_IP="tdidFtpIp";
    public static final String TDID_FTP_USERNAME="tdidFtpUsername";
    public static final String TDID_FTP_PASSWORD="tdidFtpPassword";
    public static final String TDID_FTP_PORT="tdidFtpPort";

    public static final String Tags_GET_WAY = "tagsGetWay";
    public static final String Tags_GET_FE ="fe";
    public static final String Tags_GET_DMK="dmk";
    public static final String Tags_GET_DMP="dmp";
    public static final String Tags_GET_FTP="ftp";
    public static final String Tags_UPLOADPATH="tdidUploadpath";
    public static final String Tags_DOWNLOADPATH="tdidDownloadpath";

    public static final String POSITION_GET_WAY = "positionGetWay";
    public static final String POSITION_GET_FE ="fe";
    public static final String POSITION_GET_DMK="dmk";


    //lookalike 数据
    public static final String TASK_NAME = "task_name";
    public static final String CITY="city";
    public static final String PLATFORM="platform";
    public static final String POSDATA = "posdata";
    public static final String NEGDATA="negdata";
    public static final String ID_TYPE	="id_type";
    public static final String ID_OUT_TYPE	="id_out_type";
    public static final String TOP	="top";
    public static final String CALLBACK_URL	="callback_url";
    public static final String OUTPUT_TYPE	="output_type";
    public static final String IS_OUTPUT_ALL  ="is_output_all";

    //Xmeans
    public static final String FEATURE  ="feature";
    public static final String MAX_CLASS  ="max_class";

    public static String TASK_ID = "task_id";



    //标签类型
    public enum TagType {
    	DEMOGRAPHIC ("demographic"), //人口属性

    	TAGAPP ("tagapp"); //兴趣偏好

    	private String text;

    	TagType(String text) {
    	        this.text = text;
    	}

	    public String getText() {
	        return this.text;
	    }
    }


    //发送线程个数
    public  static final String SEND_THREAD_SIZE = "send.thread.size";
    public  static final String FQUEUE_PATH = "fqueue.path";
    public  static final String FQUEUE_SIZE = "fqueue.size";
    public  static final String WRITE_THREAD_SIZE = "write.thread.size";
    public  static final String SCHEDULE_SEND_THREAD_SIZE = "schedule.send.thread.size";

    /**
     * 项目参数 key
     */
    public static class ProjectParamKey {
        public static String RSSI = "RSSI";
        public static String ACTIVE_USER_VISIT_MINUTES = "ACTIVE.USER.VISIT.MINUTES";
        public static String PROJECT_STAY_USER_MINUTES = "PROJECT.STAY.USER.MINUTES";
        public static String PROJECT_STAY_TIMEOUT_MINUTES = "PROJECT.STAY.TIMEOUT.MINUTES";
        public static String PROJECT_THRESHOLDTIME_UNIT = "PROJECT.THRESHOLDTIME.UNIT";
        public static String PROJECT_STAYTIMEDISTRIBUTION_UNIT = "PROJECT.STAYTIMEDISTRIBUTION.UNIT";
        public static String FILTER_MAC_CONFIG = "FILTER.MAC.CONFIG";
        public static String PROJECT_MAX_DURATION = "PROJECT.MAX.DURATION";
        public static String PROJECT_THEME = "PROJECT.THEME";
    }

}
