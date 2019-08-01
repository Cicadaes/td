package com.talkingdata.datacloud.visual.enums;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>ss.qin<br>
 * <b>日期：</b> 2017/3/17 <br>
 * <b>版权所有：<b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public enum ReportPublishStatusEnum {
    UNPUBLISH(0),
    PUBLISHED(1);

    private int value;
    private ReportPublishStatusEnum(int type) {
        this.value = type;
    }
    public int getValue() {
        return this.value;
    }
}
