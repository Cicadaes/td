package td.enterprise.common.constant;

public class DictConstants {

    public static final String MAGNIFYING_RATE = "MagnifyingRate";
    /**
     * 项目类型 字典名
     */
    public static final String PROJECT_TYPE = "ProjectType";

    /**
     * 商户通用字典项
     */
    public static final String MERCHANT_DICTITEM_COMMON = "COMMON";

    /**
     * 统计分析平台事件
     */
    public static final String ANALYTIC_EVENT = "ANALYTIC_EVENT";

    /**
     * 标签状态：1：未生效
     */
    public static final int TAG_STATUS_NOT_EFFECT = 1;

    /**
     * 标签状态：2，已生效
     */
    public static final int TAG_STATUS_EFFECT = 2;

    /**
     * 标签状态：-1,已删除
     */
    public static final int TAG_STATUS_DEL = -1;

    /**
     * 标签来源：1，自定义标签
     */
    public static final int TAG_SOURCE_CUSTOM = 1;

    /**
     * 标签来源：2，第三方标签
     */
    public static final int TAG_SOURCE_THIRDPARTY = 2;

    /**
     * 标签类型：1简单标签
     */
    public static final int TAG_TYPE_BASIC = 1;

    /**
     * 标签类型：2复合标签(有T的标签)
     */
    public static final int TAG_TYPE_COMPLEX = 2;

    /**
     * 属性分类维度： 0非维度分类
     */
    public static final int ATTRIBUTE_CATEGORY_IS_NOT_DIMENSION = 0;

    /**
     * 属性分类维度: 1是维度分类
     */
    public static final int ATTRIBUTE_CATEGORY_IS_DIMENSION = 1;

    /**
     * 属性字段类型：1 String
     */
    public static final int ATTRIBUTE_COLUMN_TYPE_STRING = 1;

    /**
     * 属性字段类型：2 Number
     */
    public static final int ATTRIBUTE_COLUMN_TYPE_NUMBER = 2;

    /**
     * 属性字段类型：3 Dictionary
     */
    public static final int ATTRIBUTE_COLUMN_TYPE_DICTIONARY = 3;

    /**
     * 报表视图类型：1 bar 横向柱状图
     */
    public static final int REPORT_VIEW_TYPE_BAR = 1;

    /**
     * 报表视图类型 2 column 纵向柱状图
     */
    public static final int REPORT_VIEW_TYPE_COLUMN = 2;

    /**
     * 报表视图类型：3 pie 饼图
     */
    public static final int REPORT_VIEW_TYPE_PIE = 3;

    /**
     * 报表视图类型：4 china_map 中国地图
     */
    public static final int REPORT_VIEW_TYPE_CHINA_MAP = 4;

    /**
     * 报表视图类型：5 line 折线图
     */
    public static final int REPORT_VIEW_TYPE_LINE = 5;

    /**
     * 人群状态： 1 未生效
     */
    public static final int CROWD_STATUS_INVALID = 1;

    /**
     * 人群状态： 2 已生效
     */
    public static final int CROWD_STATUS_VALID = 2;

    /**
     * 人群状态： -1 已删除
     */
    public static final int CROWD_STATUS_FAILURE = -1;

    /**
     * 外部标签： 1 企业内部标签
     */
    public static final int EXTERN_TAG_SOURCE_ENTERPRISE_INNER = 1;

    /**
     * 外部标签： 2 第三方标签
     */
    public static final int EXTERN_TAG_SOURCE_THIRD_PARTY = 1;

    /**
     * 规则业务类型： 1 事实表导入
     */
    public static final int RULE_BUSINESS_TYPE_FACTTABLE_IMPORT = 1;

    /**
     * 表类别： 1 属性表
     */
    public static final int TABLE_CATEGORY_ATTRIBUTE = 1;

    /**
     * 表类别： 2 行为表
     */
    public static final int TABLE_CATEGORY_BEHAVIOR = 2;

    /**
     * 人群模型（训练）状态：未计算
     */
    public static final int CROWDMODEL_STATUS_PENDING = 0;
    /**
     * 人群模型（训练）状态：已计算
     */
    public static final int CROWDMODEL_STATUS_SUCCEEDED = 1;
    /**
     * 人群模型（训练）状态：上线
     */
    public static final int CROWDMODEL_STATUS_ONLINE = 2;
    /**
     * 人群模型（训练）状态：重新计算
     */
    public static final int CROWDMODEL_STATUS_RECALC = 3;
    /**
     * 人群模型计算记录状态：未开始
     */
    public static final int CROWDMODEL_CALC_RECORD_STATUS_PENDING = 0;
    /**
     * 人群模型计算记录状态：计算中
     */
    public static final int CROWDMODEL_CALC_RECORD_STATUS_RUNNING = 1;
    /**
     * 人群模型计算记录状态：计算完成
     */
    public static final int CROWDMODEL_CALC_RECORD_STATUS_SUCCEEDED = 2;
    /**
     * 人群模型计算记录状态：异常
     */
    public static final int CROWDMODEL_CALC_RECORD_STATUS_EXCEPTON = -1;
    /**
     * 人群模型计算记录状态：超时
     */
    public static final int CROWDMODEL_CALC_RECORD_STATUS_TIMEOUTS = -2;
    /**
     * 人群模型算法类型：人群模型指定算法
     */
    public static final int CROWDMODEL_ALGORITHM_TYPE_DESIGNATE = 1;
    /**
     * 人群模型算法类型：默认人群模型算法
     */
    public static final int CROWDMODEL_ALGORITHM_TYPE_DEFAULT = 2;
    /**
     * 算法类型：1，模型算法
     */
    public static final String ALGORITHM_TYPE_MODEL = "1";
    /**
     * 算法类型：2，预测算法
     */
    public static final String ALGORITHM_TYPE_FORECAST = "2";
    /**
     * 用户列表
     */
    public static final String USER_PROFILE_COLUMNS = "USER_PROFILE_COLUMNS";
    /**
     * 潜客状态：获客
     */
    public static final int POTENTIALCROWD_STATUS_SEEDCROWDUPLOAD_PENDING = 1;
    /**
     * 潜客状态：上传客群
     */
    public static final int POTENTIALCROWD_STATUS_SEEDCROWDUPLOAD_SUCCESSED = 2;
    /**
     * 潜客状态：下载潜客
     */
    public static final int POTENTIALCROWD_STATUS_DOWNLOADCROWD = 3;
    /**
     * 潜客状态：投放
     */
    public static final int POTENTIALCROWD_STATUS_UPLOADDSP_PENDING = 4;
    /**
     * 潜客状态：上传受众
     */
    public static final int POTENTIALCROWD_STATUS_UPLOADDSP_SUCCESSED = 5;
    /**
     * 潜客状态：下载效果
     */
    public static final int POTENTIALCROWD_STATUS_DOWNLOADDSP = 6;
    /**
     * 潜客状态：异常
     */
    public static final int POTENTIALCROWD_STATUS_EXCEPTION = -1;
    /**
     * 计算步骤状态：0 开始
     */
    public static final int TASK_CALC_STEP_STATUS_START = 0;
    /**
     * 计算步骤状态：1 结束
     */
    public static final int TASK_CALC_STEP_STATUS_FINISH = 1;
    /**
     * 计算步骤装填：-1 异常
     */
    public static final int TASK_CALC_STEP_STATUS_EXCEPTION = -1;

    public static final String TASK_TYPE_MARKETING_DATA_CALC_RECORD = "MarketingDataCalcRecord";

    public static final String TASK_TYPE_EXTERN_TAG_CALC_RECORD = "ExternTagCalcRecord";

    public static final String TASK_TYPE_ALL_TAG_CALC_RECORD = "AllTagCalcRecord";

    public static final String TASK_TYPE_ALL_TAG_PRE_CALC_RECORD = "AllTagPreCalcRecord";

    public static final String TASK_TYPE_ALL_CONVERSION_PAGE_CALC_RECORD = "ConversionPageCalcRecord";

    public static final String TASK_TYPE_ALL_CONVERSION_EVENT_CALC_RECORD = "ConversionEventCalcRecord";

    public static final String TASK_TYPE_CROWD_MODEL_CALC_RECORD = "CrowdModelCalcRecord";

    public static final String TASK_TYPE_LOOKALIKE_CROWD_CALC_RECORD = "LookalikeCrowdCalcRecord";

    public static final String TASK_TYPE_CROWD_MODEL_AND_LOOKALIKE_CROWD_CALC_RECORD = "CrowdModelAndLookalikeCrowdCalcRecord";

    public static final String TASK_TYPE_POTENTIAL_CROWD_CALC_RECORD = "PotentialCrowdCalcRecord";

    public static final String TASK_TYPE_DSP_LAUNCH_CALC_RECORD = "DspLaunchCalcRecord";

    public static final String TASK_TYPE_IMPORT_ETL_DATAFILE = "ImportEtlDatafile";

    public static final String TASK_TYPE_ANALYTICS_PROFILE_DATA_UPDATE_CALC_RECORD = "AnalyticsProfileCalcRecord";

//	public static final String TASK_TYPE_ID_TO_ID_CALC_RECORD = "IdToIdCalcRecord";

    public static final String TASK_TYPE_SYNC_DIC_DATA_CALC_RECORD = "SyncDicDataCalcRecord";

    public static final String TASK_TYPE_ID_CONVERT_ID_CALC_RECORD = "IdConvertIdCalcRecord";

    public static final String TASK_TYPE_EXTERN_TAG_IMPORT = "ExternTagImport";

    public static final String TASK_TYPE_SYSTEM_TAG_CALC_RECORD_SQL = "SystemTagCalcRecord";

    public static final String TASK_TYPE_SYSTEM_TAG_CALC_RECORD_SCRIPT = "SystemTagScriptCalcRecord";

    /**
     * 人群画像计算预处理
     */
    public static final String TASK_TYPE_ID_CROWD_PORTRAIT_PRE_CALC_RECORD = "CrowdPortraitPreCalcRecord";

    /**
     * 人群画像维度计算
     */
    public static final String TASK_TYPE_ID_CROWD_PORTRAIT_DIMENSION_CALC_RECORD = "CrowdPortraitDimensionCalcRecord";

    /**
     * 营销效果漏斗元素
     */
    public static final String MARKETING_FUNNEL_ELEMENT = "MARKETING_FUNNEL_ELEMENT";

    /**
     * 营销效果指数统计
     */
    public static final String MARKETING_EFFECT_COUNT = "MARKETING_EFFECT_COUNT";

    /**
     * 营销效果指数统计 转化指数关键字
     */
    public static final String MARKETING_EFFECT_COUNT_TRANSLATE = "translate";

    /**
     * 营销效果指数统计触达指数关键字
     */
    public static final String MARKETING_EFFECT_COUNT_TOUCH = "touch";

    /**
     * 营销效果指数统计点击指数关键字
     */
    public static final String MARKETING_EFFECT_COUNT_CLICK = "click";

    /**
     * 营销效果指数统计 推送指数关键字
     */
    public static final String MARKETING_EFFECT_COUNT_SUM = "sum";

    /**
     * 属性类别表类型：1.hive
     */
    public static final Integer ATTRIBUTE_CATEGORY_TABLE_TYPE_HIVE = 1;
    /**
     * 属性类别表类型：2.mysql
     */
    public static final Integer ATTRIBUTE_CATEGORY_TABLE_TYPE_MYSQL = 2;
    /**
     * 属性类别表类型：3.hbase
     */
    public static final Integer ATTRIBUTE_CATEGORY_TABLE_TYPE_HBASE = 3;

    /**
     * 营销效果投放 0
     */
    public static final Integer MARKETING_EFFECT_PUSH_TYPE = 0;

    /**
     * 营销效果点击 1
     */
    public static final Integer MARKETING_EFFECT_CLICK_TYPE = 1;

    /**
     * 营销效果触达 2
     */
    public static final Integer MARKETING_EFFECT_TOUCH_TYPE = 2;

    /**
     * 营销效果转化 3
     */
    public static final Integer MARKETING_EFFECT_TRANSLATE_TYPE = 3;
    /**
     * 营销活动状态：1，未投放
     */
    public static final Integer DSP_LAUNCH_STATUS_NO_LAUNCH = 1;
    /**
     * 营销活动状态：2，已投放
     */
    public static final Integer DSP_LAUNCH_STATUS_LAUNCH = 2;
    /**
     * 营销活动状态：3，营销数据返回
     */
    public static final Integer DSP_LAUNCH_STATUS_LAUNCH_DATAS = 3;

    public enum TouchPointTypeEnum {
        accountid(99), apptdid(1), h5tdid(2), webtdid(3);

        private int value = 0;

        TouchPointTypeEnum(int value) {
            this.value = value;
        }

        public static TouchPointTypeEnum valueOf(int value) {
            switch (value) {
                case 1:
                    return apptdid;
                case 2:
                    return h5tdid;
                case 3:
                    return webtdid;
                default:
                    return accountid;
            }
        }

        public int value() {
            return this.value;
        }
    }

}
