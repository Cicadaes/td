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
    public static CONFIG = {
        "change": "change"
    };
    public static RESIZE = "resize";

    public static BEFORESHOW = "before_show";
    public static AFTERSHOW = "after_show";
    public static BEFOREDESTROY = "before_destory";
    public static AFTERDESTROY = "after_destory";

    public static DATACHANGE = "data_change";
    public static STYLECHANGE = "style_change";
    public static STAGECHANGE = "stage_change";

    public static CREATERCHART = "create_chart";
    public static SELECTCHART = "select_chart";

    public static EDITMODEL = "edit_model";

    public static COMRIGHTMENU = "com_rightmenu";
    public static COMSELEECT = "com_select";
    public static COMDELETE = "com_delete";
    public static COMONCHANGE = "com_onchange";
    public static DRAGSELEECT = "drag_select";
    public static PREVIEWSELEECT = "preview_select";

    public static DOSETTINGCHANGE = "dosetting_change";

    public static GETALLCHILDREN = "get_allchange";

}