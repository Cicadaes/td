package td.enterprise.common.constant;

public class ReportConstants {

    public static class Dictionary {
        public static final String DICT_SYSTEM_CODE = "wreport";
        public static final String DICT_KEY_ROOM_BRAND = "RoomBrand";
        public static final String DICT_KEY_LANGUAGE = "LanguageSign";
    }

    public static class CustomCrowd {

        //public static final int STATUS_NO_AVALIABLE = 0;   //状态： 0，未生效 1、已生效 -1，已删除',
        public static final int STATUS_AVALIABLE = 1;
        public static final int STATUS_DELETE = -1;

        public static final int CALC_STATUS_NO_COUNT = 0;    //相似人群计算状态：0、未计算 1、计算中 2、计算完成 -1、计算异常 -2 超时 -3、待计算 -4、重新计算',
        public static final int CALC_STATUS_COUNT_ING = 1;
        public static final int CALC_STATUS_COUNT_SUCESS = 2;
        public static final int CALC_STATUS_COUNT_EXECPTION = -1;
        public static final int CALC_STATUS_TIME_OUT = -2;
        public static final int CALC_STATUS_TO_COUNT = -3;
        public static final int CALC_STATUS_AGAIN_COUNT = -4;

        public static final int CROWD_TYPE_KMEANS = 0;//"聚类";
        public static final int CROWD_TYPE_LOOKALIKE = 1;// "lookalike";
        public static final int CROWD_TYPE_BEHAVIOR = 2;//"行为";
        public static final int CROWD_TYPE_IMPORT = 3;//"导入";
        public static final int CROWD_TYPE_COMPETENT = 4;//"竞品";
    }

    public static class AuditLog {
        // public static final String SYSTEM_CODE = "wreport";
        public static final String OPERATION_TYPE_CREATE = "create";
        public static final String OPERATION_TYPE_UPDATE = "update";
        public static final String OPERATION_TYPE_DELETE = "delete";
        public static final String OPERATION_TYPE_QUERY = "query";
        public static final boolean OPERATION_RESULT_SUCESS = true;
        public static final boolean OPERATION_RESULT_FAIL = false;

    }

    /**
     * 黑名单 记录来源类型
     *
     * @author zhengguang.ji
     */
    public static class CrowdBlackListType {
        public static final int ADD_BY_HAND = 1;//手工
        public static final int ADD_BY_BATCH_IMPORT = 2;//批量导入
    }
    
    /**
     * 店员名单 记录来源类型
     *
     * @author yinglei.li
     */
    public static class CrowdSalesListType {
        public static final int ADD_BY_HAND = 1;//手工
        public static final int ADD_BY_BATCH_IMPORT = 2;//批量导入
    }

    /**
     * 导出类型
     *
     * @author zhengguang.ji
     */
    public static class ExportType {
        public static final String EXPORT_TYPE_ROOM_TOP10_FLOW = "RoomTopFlow";
        public static final String EXPORT_TYPE_PASSENGER_TREND_30 = "PassengerTrend30";
        public static final String EXPORT_TYPE_ROOM_TOP10_EFFECT = "RoomTopEffect";
        public static final String EXPORT_TYPE_PASSENGER_DISTRIBUTION = "PassengerDistribution";  //客流分布说
        public static final String EXPORT_TYPE_PASSENGER_TREND_ACTIVE_TIME = "PassenTrend_ActiveTime";  //客流趋势-客流到访时段
        public static final String EXPORT_TYPE_PASSENGER_TREND_CHART = "PassenTrend_TrendChart";
        public static final String ExpORT_TYPE_PASSENGER_TREND_DETAIL_ACTIVE = "PassengerTrendDetail_Active"; //客流明细
        public static final String ExpORT_TYPE_PASSENGER_TREND_DETAIL_ENTER = "PassengerTrendDetail_Enter"; //进店人数明细
        public static final String ExpORT_TYPE_PASSENGER_TREND_DETAIL_STAY = "PassengerTrendDetail_Stay"; //停留人数明细
        public static final String EXPORT_TYPE_PASSENGER_TREND_DETAIL_ENTER_RATE = "PassengerTrendDetail_EnterRate"; //进店率明细
        public static final String EXPORT_TYPE_PASSENGER_TREND_DETAIL_STAY_RATE = "PassengerTrendDetail_StayRate"; //进店率明细


        public static final String EXPORT_TYPE_ROOM_DIST_DETAIL_ACTIVE = "PassenTrend_RoomActiveDetail";
        public static final String EXPORT_TYPE_PASSENGER_PEOPLE = "PassengerPeople";  //人口属性

        public static final String EXPORT_TYPE_DEEP_VISIT_TOP = "DeepVisitTop";  //深度访问客群指标等数据
        public static final String EXPORT_TYPE_DEEP_VISIT_TREND = "DeepVisitTrend";  //深度访问-详情数据

        public static final String EXPORT_TYPE_PROJECT_DETAIL_SENSORS = "ProjectDetailSensors";  //项目详情-探针报表
        public static final String EXPORT_TYPE_PROJECT_PRINCIPAL = "ProjectPrincipal";//店铺负责人
        public static final String EXPORT_TYPE_PROJECT_GENERAL = "ProjectGeneral";//设备概况
        public static final String EXPORT_TYPE_SENSOR_DETAIL = "SensorDetail";//探针详情
        public static final String EXPORT_TYPE_SENSOR_LIST = "SensorList";//探针列表
        public static final String EXPORT_TYPE_COMPETE_PROJECTS = "CompeteProjects";//竞品列表
        public static final String EXPORT_TYPE_COMPETE_SOURCES = "CompeteSources";//竞品数据源列表
    }

    /**
     * 到访用户进入房间类型
     *
     * @author zhengguang.ji
     */
    public static class ActiveUserTrackType {
        public static int TRACK_TYPE_ALL = 0;   //来过本店的用户还会逛
        public static int TRACK_TYPE_DIRECT_ACCESS = 1;  //直接进入
        public static int TRACK_TYPE_ACCESS = 2;    //从其他店进入
        public static int TRACK_TYPE_LEAVE = 3;    //去其他店
        public static int TRACK_TYPE_DIRECT_LEAVE = 4;    //直接离开

    }

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

    /**
     * 项目Map参数 key
     */
    public static class ProjectParamMapKey {
        public static String RSSI_MAP = "rssi";
        public static String ACTIVE_USER_VISIT_MINUTES_MAP = "activeUserVisitMinutes";
        public static String PROJECT_STAY_USER_MINUTES_MAP = "projectStayUserMinutes";
        public static String PROJECT_STAY_TIMEOUT_MINUTES_MAP = "projectTimeoutMinutes";
        public static String PROJECT_THRESHOLDTIME_UNIT_MAP = "projectThresholdtimeUnit";
        public static String PROJECT_STAYTIMEDISTRIBUTION_UNIT_MAP = "projectStaytimedistributionUnit";
    }

    /**
     * 项目参数描述 desc
     */
    public static class ProjectParamDesc {
        public static String RSSI_DESC = "项目信号强度过滤";
        public static String ACTIVE_USER_VISIT_MINUTES_DESC = "有效客流阀值";
        public static String PROJECT_STAY_USER_MINUTES_DESC = "有效停留阀值";
        public static String PROJECT_STAY_TIMEOUT_MINUTES_DESC = "停留超时间隔";
        public static String PROJECT_THRESHOLDTIME_UNIT_DESC = "时间单位";
        public static String PROJECT_STAYTIMEDISTRIBUTION_UNIT_DESC = "停留时间分布单位";
        public static String FILTER_MAC_CONFIG_DESC = "若干天内来过若干次数黑名单过滤";
        public static String PROJECT_MAX_DURATION_DESC = "项目最长停留时间";
        public static String PROJECT_THEME_DESC = "项目主题";
    }

    /**
     * 参数 key
     */
    public static class DefaultParamKey {
        public static String DEFAULT_ACTIVE_USER_VISIT_MINUTES = "active.user.visit.minutes";
        public static String DEFAULT_PROJECT_STAY_USER_MINUTES = "project.stay.user.minutes";
        public static String DEFAULT_PROJECT_STAY_TIMEOUT_MINUTES = "project.stay.timeout.minutes";
        public static String DEFAULT_PROJECT_THRESHOLDTIME_UNIT = "project.thresholdtime.unit";
        public static String DEFAULT_PROJECT_STAYTIMEDISTRIBUTION_UNIT = "project.staytimedistribution.unit";
        public static String DEFAULT_FILTER_MAC_CONFIG = "filter.mac.config";
        public static String DEFAULT_PROJECT_MAX_DURATION = "project.max.duration";
        public static String DEFAULT_PROJECT_THEME = "project.theme";
        public static String DEFAULT_PROJECT_PERMISSION_LEVEL = "project.permission.level";
    }

    /**
     * 项目图片类型
     * type=1 ,项目 logo
     * type=2 ,项目场地图片
     * type=3, 房间logo
     *
     * @author zhengguang.ji
     */
    public static class ProjectDiagramType {
        public static int LOGO = 1;
        public static int PROJECT_PLACE = 2;
        public static int ROOM_LOGO = 3;

    }

    /**
     * 安装类型
     *
     */
    public static class InstallInfoType {
        public static int SENSOR = 1;
        public static int PROJECT = 2;

    }

    /**
     * 附件记录状态
     * '状态，1：未计算，2：计算中，3：计算完成，-1：计算异常',
     *
     * @author zhengguang.ji
     */
    public static class ProjectAttachmentStatus {
        /**
         * 未计算，导入后初始状态
         */
        public static int NO_CALC = 1;
        public static int CALC_ING = 2;
        public static int CALC_DONE = 3;
        public static int CALC_ERROR = -1;
    }

    /**
     * 人群标签类型：1、业务标签 2、系统标签 3、第三方标签 4、Analytics人群 5、系统创建 6、用户导入',
     *
     * @author zhengguang.ji
     */
    public static class CrowdTagType {

    }

    /**
     * 标签类型
     * TC标签人群，PC预测人群 AU、活跃(到访) NU、新客 OU、老客 CU、用户上传',
     *
     * @author zhengguang.ji
     */
    public static class CrowdType {
        public static String CROWD_TYPE_TC = "TC";
        public static String CROWD_TYPE_PC = "PC";
        public static String CROWD_TYPE_AU = "AU";
        public static String CROWD_TYPE_NU = "NU";
        public static String CROWD_TYPE_OU = "OU";
        /**
         * 用户上传
         */
        public static String CROWD_TYPE_CU = "CU";

    }

    /**
     * '1，安装 -1 拆除 ',
     *
     * @author zhengguang.ji
     */
    public static class InstallInfoStatus {
        public static int AVALIABLE = 1;   //安装
        //public static int NO_AVALIABLE = 0;	 // 未安装
        public static int DELETE = -1; ////拆除
    }
//    public static class ProjectType{
//        /**
//         * 2:商业项目
//         */
//        public static int BUINESS_PROJECT=2;  //商业项目
//        /**
//         * 1:案场
//         */
//        public static int FIELD_PROJECT=1;	//案场
//
//        public static int MARKETINGCENTER=7;//营销中心
//
//        public static int CITY=8;//城市
//
//        public static int STORE=9;//店铺
//
//        public static int GROUP=10;//集团
//
//        public static int OTHER=11;//其他
//    }

    /**
     * 顺序
     */
    public static class ProjectOrder {
        public static int OTHER = 99;

        public static int GROUP = 1;
        //        public static int MARKETINGCENTER = 2;
//        public static int CITY = 3;
        public static int STORE = 99;
    }

    /**
     * 客群,状态
     *
     * @author zhengguang.ji
     */
    public static class ProjectCrowdStatus {
        public static int DEL = -1;
        public static int AVALIABLE = 1;   //有效
        public static int NO_AVALIABLE = 0;    //未生效
    }

    public static class DateUtilType {
        public static String WifiPixTagCount = "WifiPixTagCount";  //客群画像，常去商业中心，常去品牌店、餐厅品牌
        public static String AppTag = "AppTag";  //客群画像，媒体触点中app列表
        public static String TenantUseAppRoutine = "AppUseTime";  //客群画像，媒体触点中app使用时间
        public static String TenantJobHousingCount = "TenantJobHousingCount"; //职往
    }

    /**
     * 场地,状态
     *
     * @author zhengguang.ji
     */
    public static class ProjectPlaceStatus {
        public static int AVALIABLE = 1;   //有效
        public static int NO_AVALIABLE = -1;    //无效
    }

    /**
     * app白名单,记录状态
     *
     * @author zhengguang.ji
     */
    public static class AppWhiteListStatus {
        public static int AVALIABLE = 1;   //有效
        public static int NO_AVALIABLE = -1;    //无效
    }

    /**
     * app白名单 数据来源
     *
     * @author zhengguang.ji
     */
    public static class AppWhiteListSource {
        public static int BY_HAND = 1;   //手工
        public static int BY_IMPORT = 2;    //批量导入
    }

    /**
     * Sensor status，探针状态
     *
     * @author zhengguang.ji
     */
    public static class SensorStatus {
        public static int AVALIABLE = 1;   //有效
        public static int NO_AVALIABLE = -1;    //无效
    }

    /**
     * Sensor status，探针状态
     *
     * @author ran.li
     */
    public static class ProjectUserRelationType {
        public static int FAVORITE = 1;   //收藏
        public static int TOP = 2;    //置顶
        public static int INDEX = 3;    //默认项目主页
    }

    /**
     * Project 表中Status 字段的字典值
     *
     * @author zhengguang.ji
     */
    public static class ProjectStatus {
        public static int AVALIABLE = 1;   //普通项目有效
        public static int NO_AVALIABLE = -1;    //无效或竞品项目
        public static int NO_COMPETE = -2;    //无效竞品项目

    }

//    public static class ProjectTypes{
//        public static HashMap<Integer ,String > typeMap = new HashMap<Integer,String>();
//
//        public ProjectTypes(){
//            typeMap.put(0,"案场");
//            typeMap.put(1, "商业地产");
//
//        }
//
//    }

    /**
     * App类型
     * 应用类型 0、未知 1、房产
     *
     * @author zhengguang.ji
     */
    public static class AppType {
        public static int ESTATE = 1;
        public static int OTHER = 0;
    }

    /**
     * 标点符号、分隔号
     */
    public static class Punctuation {
        public static final char UNDERLINE = '_';
        public static final String THE_UNDERLINE = "_";
        public static final String SLASH = "/";
        public static final String COMMA = ",";
        public static final String COLON = ":";
        public static final String SPACE = " ";
        public static final String SEMICOLON = ";";
    }

    /**
     * DefaultStatus，默认通用状态
     */
    public static class DefaultStatus {
        public static int DEFAULT = 0;   //默认
        public static int AVALIABLE = 1;   //有效
        public static int NO_AVALIABLE = -1;    //无效
    }
}
