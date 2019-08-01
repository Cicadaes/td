package com.talkingdata.marketing.core.entity.thirdmodel.config;

import java.util.List;

/**
 * The type Config page.
 * @author xiaoming.kang
 *
 * @param <T> the type parameter
 */
public class ConfigPage<T> {
    private Integer total;
    private List<T> rows;

    /**
     * Gets total.
     *
     * @return the total
     */
    public Integer getTotal() {
        return total;
    }

    /**
     * Sets total.
     *
     * @param total the total
     */
    public void setTotal(Integer total) {
        this.total = total;
    }

    /**
     * Gets rows.
     *
     * @return the rows
     */
    public List<T> getRows() {
        return rows;
    }

    /**
     * Sets rows.
     *
     * @param rows the rows
     */
    public void setRows(List<T> rows) {
        this.rows = rows;
    }
}
