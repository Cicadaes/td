"use strict";
/**
 * Created by wangshouyun on 2017/3/8.
 */
var EventType = (function () {
    function EventType() {
    }
    return EventType;
}());
EventType.ALIGN = {
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
EventType.RESIZE = "resize";
EventType.BEFORESHOW = "before_show";
EventType.AFTERSHOW = "after_show";
EventType.BEFOREDESTROY = "before_destory";
EventType.AFTERDESTROY = "after_destory";
EventType.DATACHANGE = "data_change";
EventType.COMRIGHTMENU = "com_rightmenu";
EventType.COMSELEECT = "com_select";
EventType.COMONCHANGE = "com_onchange";
EventType.SEND_MESSAGE = "send_message";
EventType.CHANGE_HEIGHT = "change_height";
EventType.COMONRENDER = "com_onrender";
EventType.DRAGSELEECT = "drag_select";
EventType.OVERALLFILTERCHANGE = "overall_filterchange";
EventType.FILTERCHANGE = "filter_change";
EventType.MERGEFILTERCHANGE = "merge_filterchange";
EventType.COMONFILTERCHANGE = "com_onfilterchange";
EventType.MESSAGE_CHANGE = "message_change";
//===============
//builder 注册，common-charts 触发，选中组件
EventType.SELECTCHART = "select_chart";
//builder 注册，common-charts 触发，右键删除组件
EventType.COMDELETE = "com_delete";
//builder 触发 无执行代码
EventType.STAGECHANGE = "stage_change";
//builder 触发 样式变更
EventType.STYLECHANGE = "style_change";
exports.EventType = EventType;
//# sourceMappingURL=type.event.js.map