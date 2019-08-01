package com.talkingdata.marketing.core.exception;

/**
 * 异常code定义
 *
 * @SEE 文件messages_zh.properties查看具体中文解释
 * @author xiaoming.kang
 */
public enum ExceptionMessage {
    /**
     * Right top exception message.
     */
//显示在右上角
    RIGHT_TOP (4000),
    /**
     * Middle part exception message.
     */
//显示中间部分
    MIDDLE_PART(4300),

    /**
     * Campaign name dup exception message.
     */
// campaign
    CAMPAIGN_NAME_DUP(5001),
    /**
     * Campaign cannot del exception message.
     */
    CAMPAIGN_CANNOT_DEL(5002),
    /**
     * Campaign description too long exception message.
     */
    CAMPAIGN_DESCRIPTION_TOO_LONG(5003),
    /**
     * Campaign name too long exception message.
     */
    CAMPAIGN_NAME_TOO_LONG(5004),
    /**
     * Campaign no time frame exception message.
     */
    CAMPAIGN_NO_TIME_FRAME(5005),
    /**
     * Campaign time frame error exception message.
     */
    CAMPAIGN_TIME_FRAME_ERROR(5006),

    /**
     * Unit attach not exist exception message.
     */
//unit
    UNIT_ATTACH_NOT_EXIST(5500),
    /**
     * Unit crowd type not exist exception message.
     */
    UNIT_CROWD_TYPE_NOT_EXIST(5501),
    /**
     * Unit crowd name not exist exception message.
     */
    UNIT_CROWD_NAME_NOT_EXIST(5502),
    /**
     * Unit campaign id not exist exception message.
     */
    UNIT_CAMPAIGN_ID_NOT_EXIST(5503),
    /**
     * Unit campaign crowd name dup exception message.
     */
    UNIT_CAMPAIGN_CROWD_NAME_DUP(5504),
    /**
     * Unit create crowd fail exception message.
     */
    UNIT_CREATE_CROWD_FAIL(5505),
    /**
     * Unit crowd null exception message.
     */
    UNIT_CROWD_NULL(5506),
    /**
     * Unit crowd not finish exception message.
     */
    UNIT_CROWD_NOT_FINISH(5507),
    /**
     * Unit crowd estimated null exception message.
     */
    UNIT_CROWD_ESTIMATED_NULL(5508),
    /**
     * Unit crowd time null exception message.
     */
    UNIT_CROWD_TIME_NULL(5509),
    /**
     * Unit not exist exception message.
     */
    UNIT_NOT_EXIST(5510),
    /**
     * Unit campaign not exist exception message.
     */
    UNIT_CAMPAIGN_NOT_EXIST(5511),
    /**
     * Unit time not exist exception message.
     */
    UNIT_TIME_NOT_EXIST(5512),
    /**
     * Unit campaign finish exception message.
     */
    UNIT_CAMPAIGN_FINISH(5513),
    /**
     * Unit crowd calc exception message.
     */
    UNIT_CROWD_CALC(5514),
    /**
     * Unit segment ready exception message.
     */
    UNIT_SEGMENT_READY(5515),
    /**
     * Unit crowd not exist exception message.
     */
    UNIT_CROWD_NOT_EXIST(5516),
    /**
     * Unit crowd newest exception message.
     */
    UNIT_CROWD_NEWEST(5517),
    /**
     * Unit scene cannot recount exception message.
     */
    UNIT_SCENE_CANNOT_RECOUNT(5518),
    /**
     * Unit crowd recount fail exception message.
     */
    UNIT_CROWD_RECOUNT_FAIL(5519),
    /**
     * Unit param page not exist exception message.
     */
    UNIT_PARAM_PAGE_NOT_EXIST(5520),
    /**
     * Unit param page invalid exception message.
     */
    UNIT_PARAM_PAGE_INVALID(5521),
    /**
     * Unit file crowd cannot recount exception message.
     */
    UNIT_FILE_CROWD_CANNOT_RECOUNT(5522),
    /**
     * Unit crowd status not finish exception message.
     */
    UNIT_CROWD_STATUS_NOT_FINISH(5523),
    /**
     * Unit crowd calc status not exist exception message.
     */
    UNIT_CROWD_CALC_STATUS_NOT_EXIST(5524),
    /**
     * Unit crowd calc not start exception message.
     */
    UNIT_CROWD_CALC_NOT_START(5525),
    /**
     * Unit crowd delete exception message.
     */
    UNIT_CROWD_DELETE(5526),
    /**
     * Unit crowd copy fail exception message.
     */
    UNIT_CROWD_COPY_FAIL(5527),
    /**
     * Unit attach invalid exception message.
     */
    UNIT_ATTACH_INVALID(5528),
    /**
     * Unit crowd name dup exception message.
     */
    UNIT_CROWD_NAME_DUP(5529),

    /**
     * Crowd not exist exception message.
     */
//crowd
    CROWD_NOT_EXIST(6000),
    /**
     * Crowd attach not exist exception message.
     */
    CROWD_ATTACH_NOT_EXIST(6001),
    /**
     * Crowd file record invalid exception message.
     */
    CROWD_FILE_RECORD_INVALID(6002),
    /**
     * Crowd calc exception message.
     */
    CROWD_CALC(6003),
    /**
     * Crowd calc id not exist exception message.
     */
    CROWD_CALC_ID_NOT_EXIST(6004),
    /**
     * Crowd calc status null exception message.
     */
    CROWD_CALC_STATUS_NULL(6005),
    /**
     * Crowd calc status not finish exception message.
     */
    CROWD_CALC_STATUS_NOT_FINISH(6006),
    /**
     * Crowd download notice fail exception message.
     */
    CROWD_DOWNLOAD_NOTICE_FAIL(6007),
    /**
     * Crowd tenant not exist exception message.
     */
    CROWD_TENANT_NOT_EXIST(6008),
    /**
     * Crowd status not exist exception message.
     */
    CROWD_STATUS_NOT_EXIST(6009),
    /**
     * Crowd cannot download exception message.
     */
    CROWD_CANNOT_DOWNLOAD(6010),
    /**
     * Crowd recount fail exception message.
     */
    CROWD_RECOUNT_FAIL(6011),
    /**
     * Crowd not child exception message.
     */
    CROWD_NOT_CHILD(6012),

    /**
     * Segment channel not exist exception message.
     */
//segment
    SEGMENT_CHANNEL_NOT_EXIST(6500),
    /**
     * Segment campaign id not exist exception message.
     */
    SEGMENT_CAMPAIGN_ID_NOT_EXIST(6501),
    /**
     * Segment unit id not exist exception message.
     */
    SEGMENT_UNIT_ID_NOT_EXIST(6502),
    /**
     * Segment crowd id not exist exception message.
     */
    SEGMENT_CROWD_ID_NOT_EXIST(6503),
    /**
     * Segment name not exist exception message.
     */
    SEGMENT_NAME_NOT_EXIST(6504),
    /**
     * Segment status not exist exception message.
     */
    SEGMENT_STATUS_NOT_EXIST(6505),
    /**
     * Segment status not draft or waiting exception message.
     */
    SEGMENT_STATUS_NOT_DRAFT_OR_WAITING(6506),
    /**
     * Segment sent type parse fail exception message.
     */
    SEGMENT_SENT_TYPE_PARSE_FAIL(6507),
    /**
     * Segment send type invalid exception message.
     */
    SEGMENT_SEND_TYPE_INVALID(6508),
    /**
     * Segment send time not exist exception message.
     */
    SEGMENT_SEND_TIME_NOT_EXIST(6509),
    /**
     * Segment cycle param invalid exception message.
     */
    SEGMENT_CYCLE_PARAM_INVALID(6510),
    /**
     * Segment cycle day exception message.
     */
    SEGMENT_CYCLE_DAY(6511),
    /**
     * Segment cycle week exception message.
     */
    SEGMENT_CYCLE_WEEK(6512),
    /**
     * Segment cycle month exception message.
     */
    SEGMENT_CYCLE_MONTH(6513),
    /**
     * Segment cycle hour exception message.
     */
    SEGMENT_CYCLE_HOUR(6514),
    /**
     * Segment cycle minute exception message.
     */
    SEGMENT_CYCLE_MINUTE(6515),
    /**
     * Segment message not exist exception message.
     */
    SEGMENT_MESSAGE_NOT_EXIST(6516),
    /**
     * Segment message invalid exception message.
     */
    SEGMENT_MESSAGE_INVALID(6517),
    /**
     * Segment message empty exception message.
     */
    SEGMENT_MESSAGE_EMPTY(6518),
    /**
     * Segment ratio invalid exception message.
     */
    SEGMENT_RATIO_INVALID(6519),
    /**
     * Segment push app not exist exception message.
     */
    SEGMENT_PUSH_APP_NOT_EXIST(6520),
    /**
     * Segment push os invalid exception message.
     */
    SEGMENT_PUSH_OS_INVALID(6521),
    /**
     * Segment push action invalid exception message.
     */
    SEGMENT_PUSH_ACTION_INVALID(6522),
    /**
     * Segment push title not exist exception message.
     */
    SEGMENT_PUSH_TITLE_NOT_EXIST(6523),
    /**
     * Segment push content not exist exception message.
     */
    SEGMENT_PUSH_CONTENT_NOT_EXIST(6524),
    /**
     * Segment channel code not exist exception message.
     */
    SEGMENT_CHANNEL_CODE_NOT_EXIST(6525),
    /**
     * Segment channel type not exist exception message.
     */
    SEGMENT_CHANNEL_TYPE_NOT_EXIST(6526),
    /**
     * Segment not exist exception message.
     */
    SEGMENT_NOT_EXIST(6527),
    /**
     * Segment id not exist exception message.
     */
    SEGMENT_ID_NOT_EXIST(6528),
    /**
     * Segment name dup exception message.
     */
    SEGMENT_NAME_DUP(6529),
    /**
     * Segment not loop exception message.
     */
    SEGMENT_NOT_LOOP(6530),
    /**
     * Segment not pause exception message.
     */
    SEGMENT_NOT_PAUSE(6531),
    /**
     * Segment status invalid exception message.
     */
    SEGMENT_STATUS_INVALID(6532),
    /**
     * Segment cannot delete exception message.
     */
    SEGMENT_CANNOT_DELETE(6533),
    /**
     * Segment crowd not exist exception message.
     */
    SEGMENT_CROWD_NOT_EXIST(6534),
    /**
     * Segment crowd version not exist exception message.
     */
    SEGMENT_CROWD_VERSION_NOT_EXIST(6535),
    /**
     * Segment crowd count empty exception message.
     */
    SEGMENT_CROWD_COUNT_EMPTY(6536),
    /**
     * Segment campaingn not start exception message.
     */
    SEGMENT_CAMPAINGN_NOT_START(6537),
    /**
     * 投放为循环投放时,子投放类型不能为空
     */
    SEGMENT_SUB_TRIGGER_EMPTY(6538),
    /**
     * 投放为循环投放时,表达式不能为空
     */
    SEGMENT_CRON_EXPRESSION_EMPTY(6539),

    /**
     * User not exist exception message.
     */
//登录信息
    USER_NOT_EXIST(7000),
    /**
     * User tenant not exist exception message.
     */
    USER_TENANT_NOT_EXIST(7001),
    /**
     * User email not exist exception message.
     */
    USER_EMAIL_NOT_EXIST(7002),
    /**
     * User name not exist exception message.
     */
    USER_NAME_NOT_EXIST(7003),

    /**
     * The User cloud api error.
     */
//user cloud api
    USER_CLOUD_API_ERROR(7500),
    /**
     * User cloud get cube def error exception message.
     */
    USER_CLOUD_GET_CUBE_DEF_ERROR(7501),
    /**
     * User cloud get cube result error exception message.
     */
    USER_CLOUD_GET_CUBE_RESULT_ERROR(7502),
    /**
     * User cloud cube not exist exception message.
     */
    USER_CLOUD_CUBE_NOT_EXIST(7503),
    /**
     * User cloud get crowd list error exception message.
     */
    USER_CLOUD_GET_CROWD_LIST_ERROR(7504),
    /**
     * User cloud get crowd error exception message.
     */
    USER_CLOUD_GET_CROWD_ERROR(7505),

    /**
     * The File not csv.
     */
//file check
    FILE_NOT_CSV(8000),
    /**
     * File empty exception message.
     */
    FILE_EMPTY(8001),
    /**
     * File not utf 8 exception message.
     */
    FILE_NOT_UTF8(8002),
    /**
     * File not exist exception message.
     */
    FILE_NOT_EXIST(8003),
    /**
     * Files not inconsistent exception message.
     */
    FILES_NOT_INCONSISTENT(8004),

    /**
     * Funnel config campaign not exist exception message.
     */
//CampaignFunnelConfig
    FUNNEL_CONFIG_CAMPAIGN_NOT_EXIST(8500),
    /**
     * Funnel start page invalid exception message.
     */
    FUNNEL_START_PAGE_INVALID(8501),
    /**
     * Funnel events length exception message.
     */
    FUNNEL_EVENTS_LENGTH(8502),

    /**
     * The Funnel definition config id not exist.
     */
//funnel definition
    FUNNEL_DEFINITION_CONFIG_ID_NOT_EXIST(9000),
    /**
     * Funnel definition name dup exception message.
     */
    FUNNEL_DEFINITION_NAME_DUP(9001),
    /**
     * Funnel definition not exist exception message.
     */
    FUNNEL_DEFINITION_NOT_EXIST(9002),

    /**
     * The Target config dup.
     */
//campaign target configs
    TARGET_CONFIG_DUP(9500),

    /**
     * The Target definition.
     */
//campaign target definition
    TARGET_DEFINITION(10000),
    /**
     * Target definition name dup exception message.
     * 指标重名
     */
    TARGET_DEFINITION_NAME_DUP(10001),

    /**
     * Um user not login exception message.
     */
    UM_USER_NOT_LOGIN(10500),
    /**
     * Um get app fail exception message.
     */
    UM_GET_APP_FAIL(10501),

    /**
     * Equity attach invalid exception message.
     */
    EQUITY_ATTACH_INVALID(11000),
    /**
     * Equity parameter missing exception message.
     */
    EQUITY_PARAMETER_MISSING(11001),
    /**
     * Equity config name dup exception message.
     */
    EQUITY_CONFIG_NAME_DUP(11002),
    /**
     * Equity config wrong total exception message.
     */
    EQUITY_CONFIG_WRONG_TOTAL(11003),
    /**
     * Equity config cannot delete exception message.
     */
    EQUITY_CONFIG_CANNOT_DELETE(11004),

    /**
     * Pipeline definition repeat id exception message.
     * 组件ID重复
     */
//Pipeline
    PIPELINE_DEFINITION_REPEAT_ID(11500),
    /**
     * Pipeline definition submit exception message.
     * 提交失败
     */
    PIPELINE_DEFINITION_SUBMIT(11501),
    /**
     * Pipeline definition missing node in edge exception message.
     * 边不能缺少起点或终点
     */
    PIPELINE_DEFINITION_MISSING_NODE_IN_EDGE(11502),
    /**
     * Pipeline definition missing node obj exception message.
     * 缺少组件对象
     */
    PIPELINE_DEFINITION_MISSING_NODE_OBJ(11503),
    /**
     * Pipeline definition missing examine field exception message.
     * 缺少审批的id
     */
    PIPELINE_DEFINITION_MISSING_EXAMINE_FIELD(11504),
    /**
     * Pipeline definition equity overflow exception message.
     * 权益数量越界
     */
    PIPELINE_DEFINITION_EQUITY_OVERFLOW(11505),
    /**
     * Pipeline definition equity invalid exception message.
     * 权益设置数量必须大于已发放数量
     */
    PIPELINE_DEFINITION_EQUITY_INVALID(11506),
    /**
     * Pipeline definition cannot delete exception message.
     * //只有'草稿'、‘校验通过’和'审批未通过'的营销流程可以删除
     */
    PIPELINE_DEFINITION_CANNOT_DELETE(11507),
    /**
     * Pipeline definition cannot handle exception message.
     * //流程没有申请上线不能进行审批操作
     */
    PIPELINE_DEFINITION_CANNOT_HANDLE(11508),
    /**
     * Pipeline definition cannot offline exception message.
     * //流程没有上线不允许下线
     */
    PIPELINE_DEFINITION_CANNOT_OFFLINE(11509),
    /**
     * Pipeline definition cannot commit exception message.
     * //流程没有测试通过不允许申请上线
     */
    PIPELINE_DEFINITION_CANNOT_COMMIT(11510),
    /**
     * Pipeline definition cannot update exception message.
     * //只有草稿、已下线、审批未通过的营销流程可以修改
     */
    PIPELINE_DEFINITION_CANNOT_UPDATE(11511),
    /**
     * Pipeline definition cannot check exception message.
     * //只有草稿状态的营销流程可以测试
     */
    PIPELINE_DEFINITION_CANNOT_CHECK(11512),
    /**
     * Pipeline definition name repeat exception message.
     * //流程名称重复
     */
    PIPELINE_DEFINITION_NAME_REPEAT(11513),
    /**
     * Pipeline definition time frame error exception message.
     * // 流程时间范围不对
     */
    PIPELINE_DEFINITION_TIME_FRAME_ERROR(11514),
    /**
     * Pipeline definition is not exist exception message.
     * // 当前流程不存在
     */
    PIPELINE_DEFINITION_IS_NOT_EXIST(11515),
    /**
     * Pipeline definition exist free node exception message.
     * // 流程中存在未连线算子
     */
    PIPELINE_DEFINITION_EXIST_FREE_NODE(11516),
    /**
     * Pipeline definition exist not end node exception message.
     * // 分支未结束
     */
    PIPELINE_DEFINITION_EXIST_NOT_END_NODE(11517),
    /**
     * Pipeline definition must start entrance node exception message.
     * // 流程应以入口算子开始
     */
    PIPELINE_DEFINITION_MUST_START_ENTRANCE_NODE(11518),
    /**
     * Pipeline definition cannot debug exception message.
     * // 流程没有校验通过不允许测试
     */
    PIPELINE_DEFINITION_CANNOT_DEBUG(11519),
    /**
     * Pipeline definition cannot stop debug exception message.
     * // 流程未在测试中不允许停止测试
     */
    PIPELINE_DEFINITION_CANNOT_STOP_DEBUG(11520),
    /**
     * Pipeline definition cannot submit debug exception message.
     * // 流程在测试中不允许提交
     */
    PIPELINE_DEFINITION_CANNOT_SUBMIT_DEBUG(11521),
    /**
     * Pipeline definition time frame error pipeline start before today exception message.
     * 流程开始时间不能早于当天
     */
    PIPELINE_DEFINITION_TIME_FRAME_ERROR_PIPELINE_START_BEFORE_TODAY(11522),
    /**
     * Pipeline definition time frame error pipeline end before today exception message.
     * 流程结束时间不能早于当天
     */
    PIPELINE_DEFINITION_TIME_FRAME_ERROR_PIPELINE_END_BEFORE_TODAY(11523),
    /**
     * Pipeline definition time frame error pipeline start before campaign exception message.
     * 流程开始时间不能早于营销活动开始时间。
     */
    PIPELINE_DEFINITION_TIME_FRAME_ERROR_PIPELINE_START_BEFORE_CAMPAIGN(11524),
    /**
     * Pipeline definition time frame error campaign end after campaign exception message.
     * 流程结束时间不能晚于营销活动结束时间。
     */
    PIPELINE_DEFINITION_TIME_FRAME_ERROR_CAMPAIGN_END_AFTER_CAMPAIGN(11525),

    /**
     * Ehcache refresh fail exception message.
     * 刷新失败
     */
//cache
    EHCACHE_REFRESH_FAIL(12001),

    /**
     * Behavior definition name dup exception message.
     * 事件重名
     */
//BehaviorDefinition
    BEHAVIOR_DEFINITION_NAME_DUP(12500),

    /**
     * Appconfig appid or pid dup exception message.
     * appid或者productid重名
     */
//appConfig
    APPCONFIG_APPID_OR_PID_DUP(13000),

    /**
     * Equity config not exist exception message.
     * 权益设置不存在
     */
//EquityConfig
    EQUITY_CONFIG_NOT_EXIST(13500),
    /**
     * Equity config cannot handle exception message.
     * 只有未开始的活动可以对权益进行操作
     */
    EQUITY_CONFIG_CANNOT_HANDLE(13501),

    /**
     * Attachment not exist exception message.
     * 附件不存在
     */
//Attachment
    ATTACHMENT_NOT_EXIST(14000);


    ExceptionMessage(Integer code) {
        this.code = code;
    }

    /**
     * The Code.
     */
    Integer code;

    /**
     * Gets code.
     *
     * @return the code
     */
    public Integer getCode() {
        return this.code;
    }
}
