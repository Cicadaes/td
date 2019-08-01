package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.tag;

import java.util.List;

/**
 * Created by zmy on 9/6/2017.
 * @author xiaoming.kang
 */
public class TagResp {
    private int total;
    private List<TagInfo> rows;

    /**
     * Gets total.
     *
     * @return the total
     */
    public int getTotal() {
        return total;
    }

    /**
     * Sets total.
     *
     * @param total the total
     */
    public void setTotal(int total) {
        this.total = total;
    }

    /**
     * Gets rows.
     *
     * @return the rows
     */
    public List<TagInfo> getRows() {
        return rows;
    }

    /**
     * Sets rows.
     *
     * @param rows the rows
     */
    public void setRows(List<TagInfo> rows) {
        this.rows = rows;
    }
}
