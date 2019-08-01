/**
 * Created by wangshouyun on 2017/3/8.
 */
export class EventType {

    public static ALIGN = {
        "action": "action",

        "left": "left",
        "right": "right",
        "top": "top",
        "bottom": "bottom",
        "vertical_center": "vertical_center",
        "horiz_center": "horiz_center",
        "vertical_gap": "vertical_gap",
        "horiz_gap": "horiz_gap"
    };

    public static RESIZE = "resize";
    public static BEFORESHOW = "before_show";
    public static AFTERSHOW = "after_show";
    public static BEFOREDESTROY = "before_destory";
    public static AFTERDESTROY = "after_destory";

    public static DATACHANGE = "data_change";

    public static COMRIGHTMENU = "com_rightmenu";
    public static COMSELEECT = "com_select";

    public static COMONCHANGE = "com_onchange";
    public static SEND_MESSAGE = "send_message";
    public static CHANGE_HEIGHT = "change_height";

    public static COMONRENDER = "com_onrender";
    public static DRAGSELEECT = "drag_select";

    public static OVERALLFILTERCHANGE = "overall_filterchange";
    public static FILTERCHANGE = "filter_change";

    public static MERGEFILTERCHANGE = "merge_filterchange";
    public static COMONFILTERCHANGE = "com_onfilterchange";

    public static MESSAGE_CHANGE = "message_change";

    //===============

    //builder 注册，common-charts 触发，选中组件
    public static SELECTCHART = "select_chart";

    //builder 注册，common-charts 触发，右键删除组件
    public static COMDELETE = "com_delete";

    //builder 触发 无执行代码
    public static STAGECHANGE = "stage_change";

    //builder 触发 样式变更
    public static STYLECHANGE = "style_change";
}