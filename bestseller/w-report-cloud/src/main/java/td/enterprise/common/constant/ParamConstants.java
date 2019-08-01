package td.enterprise.common.constant;

/**
 * Created by Administrator on 2017/3/14.
 */
public class ParamConstants {

    public static final String QUERY_ENGINE_URL = "query.engine.url";
    public static final String SHARE_ATTACHMENT_PATH = "share.attachment.path";
    public static final String BATCHMANAGER_SERVER_URL = "batchmanager.server.url";
    public static final String BATCHMANAGER_SERVER_USERNAME = "batchmanager.server.username";
    public static final String BATCHMANAGER_SERVER_PASSWD = "batchmanager.server.passwd";
    
    /**客流阈值*/
    /**入店客流*/
    public static final String ACTIVE_USER_VISIT_MINUTES = "active.user.visit.minutes";
    /**跳出客流*/
    public static final String JUMP_USER_VISIT_MINUTES = "jump.user.visit.minutes"; // 跳出客流
    /**停留客流*/
    public static final String PROJECT_STAY_USER_MINUTES = "project.stay.user.minutes"; // 停留客流
    /**高活跃客流区间开始*/
    public static final String HIGH_ACTIVE_BEGIN_USER_DAYS = "high.active.begin.user.days";
    /**高活跃客流区间结束*/
    public static final String HIGH_ACTIVE_END_USER_DAYS = "high.active.end.user.days";
    /**中活跃客流区间开始*/
    public static final String MEDIUM_ACTIVE_BEGIN_USER_DAYS = "medium.active.begin.user.days";
    /**中活跃客流区间结束*/
    public static final String MEDIUM_ACTIVE_END_USER_DAYS = "medium.active.end.user.days";
    /**低活跃客流区间开始*/
    public static final String LOW_ACTIVE_BEGIN_USER_DAYS = "low.active.begin.user.days";
    /**低活跃客流区间结束*/
    public static final String LOW_ACTIVE_END_USER_DAYS = "low.active.end.user.days";
    /**沉睡客流*/
    public static final String SLEEP_USER_DAYS = "sleep.user.days";
    
    /**强度阈值*/
    /**店前客流强度*/
    public static final String DEFAULT_BEFORE_RSSI = "default.before.rssi";
    /**入店客流强度*/
    public static final String DEFAULT_RSSI = "default.rssi";
    public static final String DEFAULT_LARGE_RSSI = "default.large.rssi";
    public static final String DEFAULT_MIDDLE_RSSI = "default.middle.rssi";
    public static final String DEFAULT_SMALL_RSSI = "default.small.rssi";

    /**次数阈值*/
    public static final String PROJECT_STAY_TIMEOUT_MINUTES = "project.stay.timeout.minutes";
    
    /**店员阈值*/
    /**店员连续天数*/
    public static final String SALES_CONSECUTIVE_DAYS = "sales.consecutive.days";
    /**店员入店天数*/
    public static final String SALES_COME_DAYS = "sales.come.days";
    /**店员入店停留时间累积*/
    public static final String SALES_MAX_DURATION_HOURS = "sales.max.duration.hours";
    
    /**黑名单阈值*/
    /**和名单连续天数*/
    public static final String BLACK_CONSECUTIVE_DAYS = "black.consecutive.days";
    /**黑名单入店天数*/
    public static final String BLACK_COME_DAYS = "black.come.days";
    /**黑名单入店停留时间累积*/
    public static final String BLACK_MAX_DURATION = "project.max.duration";
    
    /**营业时间阈值*/
    /**营业开始时间*/
    public static final String OPENING_TIME = "project.opening.time";
    /**营业结束时间*/
    public static final String CLOSING_TIME = "project.closing.time";
    
}
