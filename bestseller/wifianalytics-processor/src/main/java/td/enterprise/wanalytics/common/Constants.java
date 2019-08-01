package td.enterprise.wanalytics.common;


public class Constants {

    public static String TYPE_SENSOR = "sensor";

    public static final int DOMAIN_ID = 1;

    public static final String TB_KEY_SEPERATER = "#S";

    public static final String ETL_PROCESS_RECORD_FLAG_OUTPUT = "output" ;
    public static final String ETL_PROCESS_RECORD_FLAG_DISCARD = "discard" ;
    public static final String ETL_PROCESS_RECORD_FLAG_FAIL = "fail" ;
    public static final String ES_LINE_FLAG_KEY= "line_flag" ;
    public static final int ES_LINE_FLAG_SUCCESS = 1 ;
    public static final int ES_LINE_FLAG_DISCARD = 2 ;
    public static final int ES_LINE_FLAG_FAIL = 3 ;
    public static final String ES_DISCARD_CODE_KEY= "discard_code" ;
    //1:mac地址非法，2：ID mapping 匹配失败4：接收日期不合理tsreceive 5： 黑名单 6: 探针没找到     7 信号强度不在范围内,8 探针mac地址  9 参观时间过小 10 mac 非移动设备 11 mac 长度不满足17位 12 伪MAC过滤
    public static final String ES_DISCARD_CODE_VALUE_MAC_FILTER = "1" ;
    public static final String ES_DISCARD_CODE_VALUE_SENSOR_FILL_NOT_FOUND = "2" ;
    public static final String ES_DISCARD_CODE_VALUE_VALID_TIME = "4" ;
    public static final String ES_DISCARD_CODE_VALUE_DEVICE_BLACK_LIST = "5" ;
    public static final String ES_DISCARD_CODE_VALUE_SENSOR_NOT_FOUND = "6" ;
    public static final String ES_DISCARD_CODE_RSSI_FILTER = "7" ;
    public static final String ES_DISCARD_CODE_SENSOR_MAC_FILTER = "8" ;
    public static final String ES_DISCARD_CODE_VISIT_MINUTES_FILTER = "9" ;
    public static final String ES_DISCARD_CODE_MOBILE_MAC_FILTER = "10" ;
    public static final String ES_DISCARD_CODE_MAC_LENGTH_FILTER = "11" ;
    public static final String ES_DISCARD_CODE_MAC_FAKE_FILTER = "12" ;


    public static final String ES_FAIL_CODE_KEY= "failcode" ;
    public static final String ES_FAIL_CODE_VAlUE_MAC = "0001";
    public static final String ES_FAIL_CODE_VAlUE_SENSOR_FILL_NOT_FOUND = "0002";
    public static final String ES_FAIL_CODE_VALUE_VALID_TIME = "0004";
    public static final String ES_FAIL_CODE_DEVICE_BLACK_LIST = "0005";
    public static final String ES_FAIL_CODE_SENSOR_PROP_FILL = "0006";
    public static final String ES_FAIL_CODE_MOBILE_MAC = "0007";

    public static final int ENTER_ROOM_VALID = 1;
    public static final int ENTER_ROOM_NOT_VALID = -1;
    public enum LineFlag {
        SUCCESS(1), DISCARD(2), FAIL(3);
        private int nCode;
        private LineFlag(int nCode) {
            this.nCode = nCode;
        }
        @Override
        public String toString() {
            return String.valueOf(this.nCode);
        }
    }
    public static final String ETL_PROCESS_LINE_KEY_SENSOR_MAC = "sensor_mac" ;
    public static final String ETL_PROCESS_LINE_KEY_FIELD_VALUES = "fieldValues" ;
    public static final String ETL_PROCESS_LINE_KEY_RECORD_LIST = "recordList" ;
    public static final String ES_TYPE_LEGAL = "legal" ;
    public static final String ES_TYPE_INLEGAL = "inlegal" ;
    public static final String SENSOR_DATA_SEND_TIME = "send_time" ;
    public static final String SENSOR_DATA_RECIEVE_TIME = "recieve_time" ;
    public static final String SENSOR_DATA_SENSOR_MAC = "sensor_mac" ;
    public static final String SENSOR_DATA_DIVECE_MAC = "device_mac" ;
    public static final String SENSOR_DATA_WIFI_STRONGTH = "wifi_strongth" ;
    public static final String SENSOR_DATA_ETL_TIMESTAMP = "etl_timestamp" ;
    public static final String sendTimeFormatKey= "send_time_format";
    public static final String READER_LINE_KEY_SOURCE_TOPIC = "srcTopic" ;
    public static final String READER_LINE_KEY_SOURCE_DATA = "srcData" ;
    public static final String READER_LINE_KEY_HEAD = "head" ;
    public static final String READER_LINE_KEY_BODY = "body" ;
    public static final String WRITER_TARGET_TOPIC = "targetTopic";
    public static final String WRITER_PART_KEY = "parKey";
    public static final String WRITER_DEFAULT_TOPIC = "default_topic";
    public static final String WRITER_SEND_MESSAGE = "sendMessage";
    public static final String WRITER_SEND_MESSAGE_LIST = "sendMessageList";
    public static final String MONITOR_KAFKA_WRITER = "KafkaWriter";
    public static final String MONITOR_KAFKA_READER = "KafkaReader";
    public static final int VALID= 1;// 项目，探针状态是否有效

    public static final String MAC_COMPANY_CACHE = "MAC_COMPANY_CACHE";

    public static final String KAFKA_ALLLOG_TOPIC = "ALL_LOG";//所有日志topic

    /**
     * 缓存常量
     */
    public static final String PROJECT_GROUP_COMPUTE_CACHE = "ProjectGroupComputeCache";

    public static int PROJECT_FRONT_USER_DB_INDEX = 1; //需要计算的店前客流 默认redis 位置

    public static int ALL_MAC_DB_INDEX = 1; //全部MAC 默认redis 位置

    public static int  BLACK_LIST_MAC_DB_INDEX = 2 ; //黑名单 默认redis 位置

    public static int  MONITOR_SENSOR_DB_INDEX = 0 ; //监控探针默认DB 位置

    public  static String MONITOR_SENSOR_KEYS = "SCAN_SENSOR_"; //监控探针前缀

    public static String MONITOR_SENSOR_PREFIX = "SENSOR_"; //探针监控日志前缀

    public static String SUBMIT_SENSOR_LOG_TIME  = "submit.sensor.log.time"; //提交间隔

    public static String SENSOR_LOG_TTL = "sensor.log.ttl";  //在redis 生成时间 默认秒

    /**
     * 上传数据类型
     * @author yangtao
     */
    public static final class JsonDataDevType {

        public static String SENSOR = "001";
        public static String AP = "002";
    }
}