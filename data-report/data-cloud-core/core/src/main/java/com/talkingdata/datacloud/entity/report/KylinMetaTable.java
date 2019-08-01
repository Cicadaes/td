package com.talkingdata.datacloud.entity.report;

import java.util.List;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>ss.qin<br>
 * <b>日期：</b> 2017/2/16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class KylinMetaTable {
    private String tableName;
    private List<KylinMetaColumn> kylinMetaColumns;

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public List<KylinMetaColumn> getKylinMetaColumns() {
        return kylinMetaColumns;
    }

    public void setKylinMetaColumns(List<KylinMetaColumn> kylinMetaColumns) {
        this.kylinMetaColumns = kylinMetaColumns;
    }
}
