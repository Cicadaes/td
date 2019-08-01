package com.talkingdata.marketing.core.entity.thirdmodel.usercloud;

import java.util.List;

/**
 * The type Crowd resp.
 * @author xiaoming.kang
 */
public class CrowdResp {
    private int total;
    private List<CrowdInfoResp> rows;

    /**
     * Instantiates a new Crowd resp.
     */
    public CrowdResp() {
    }

    /**
     * Instantiates a new Crowd resp.
     *
     * @param total the total
     * @param rows  the rows
     */
    public CrowdResp(int total, List<CrowdInfoResp> rows) {
        this.total = total;
        this.rows = rows;
    }

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
    public List<CrowdInfoResp> getRows() {
        return rows;
    }

    /**
     * Sets rows.
     *
     * @param rows the rows
     */
    public void setRows(List<CrowdInfoResp> rows) {
        this.rows = rows;
    }
}
