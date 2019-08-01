package com.talkingdata.datacloud.enums.report;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>ss.qin<br>
 * <b>日期：</b> 2017/1/6 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public enum DataSourceTypeEnum {
    HTTP(0),
    JDBC(1);

    private int type;

    private DataSourceTypeEnum(int type) {
        this.type = type;
    }

    public int getValue() {
        return type;
    }
}
