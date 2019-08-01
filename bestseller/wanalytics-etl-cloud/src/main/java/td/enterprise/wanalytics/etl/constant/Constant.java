package td.enterprise.wanalytics.etl.constant;

/**
 * Created by tendcloud on 2016/1/19.
 */
public class Constant {
    //key value

    public static String BETCH_INTERFACE_FE_BETCH_FILE_KEY = "file";
    public static String BETCH_INTERFACE_FE_BETCH_ETOKEN_KEY = "token";
    public static String BETCH_INTERFACE_FE_BETCH_ETOKEN_VALUE = "69p9TVxLqP6fA";
    public static String BETCH_INTERFACE_FE_BETCH_APPKEY_KEY = "appkey";
    public static String BETCH_INTERFACE_FE_BETCH_APPKEY_VALUE = "569610b28bda20a5270f88f5";
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
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_ETOKEN_VALUE = "EE87A20B0DE17063";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_DATATYPE_KEY = "dataType";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_PERSONTIME_KEY = "personTime";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_QUERYTYPE_KEY = "queryType";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_CALLBACKURL_KEY = "callbackUrl";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_QUERYSTARTTIME_KEY = "queryStartTime";
    public static String BETCH_INTERFACE_WIFIPIX_BETCH_QUERYENDTIME_KEY = "queryEndTime";

    public static String BETCH_INTERFACE_WIFIPIX_BETCH_TASKID_KEY = "taskId";

    public static String BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR = "\t";
    public static String BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK = "\n";


    public static final String PARAM_KEY_INPUT_FILE_PATH = "inputFilePath";
    public static final String PARAM_KEY_OUTPUT_FILE_PATH = "outputFilePath";
    public static final String PARAM_KEY_START_DATE = "START_DATE";
    public static final String PARAM_KEY_END_DATE = "END_DATE";
    public static final String PARAM_KEY_RUN_DATE = "RUN_DATE";
    public static final String PARAM_KEY_CUSTOM_CROWD = "CROWD";  //人群信息 
    public static final String PARAM_KEY_SUM = "SUM";


    public static final long CFG_STATUS_QUERY_PERIOD = 1000 * 60 * 3; //三分钟一次
    public static final int CFG_STATUS_QUERY_MAX_NUMBER = 60 * 100;

    //hive 表
    public static final String DAY_TYPE_WORK_DAY = "1"; //工作日
    public static final String DAY_TYPE_WEEKDAY = "2";//周末 
    
    public static final String SEPARATER = ",";
    public static final String SEMICOLON = ";";
    
    //任务临时文件名 
    public static final String  TASKS_APPS = "apps";

    //标签指标体系
    public static final String TAG_INDEX = "TD_TAG_INDEX";
    public static final String TAG_DIMENSION = "TD_TAG_DIMENSION";


    public static final String QUERY_ENGINE_URL = "query.engine.url";

    public static final String MAC_PREDICT_URL = "mac.predict.url";

    //黑名单放在redis中默认是2
    public  static final int DB_INDEX_BLACK_CROWD = 2;
    //活跃客流放在redis中默认是5
    public  static final int DB_INDEX_ACTIVE_USER_CROWD = 5;

}
