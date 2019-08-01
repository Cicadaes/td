package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import java.util.List;
import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * The type Campaign target cube.
 * @author xiaoming.kang
 * @create 2017 -05-03-下午8:16
 * @since JDK 1.8
 */
public class CampaignTargetCube {

    private Integer total;

    private List<CampaignTargetCubeItem> rows;

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
    public List<CampaignTargetCubeItem> getRows() {
        return rows;
    }

    /**
     * Sets rows.
     *
     * @param rows the rows
     */
    public void setRows(List<CampaignTargetCubeItem> rows) {
        this.rows = rows;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("total", total)
                .append("rows", rows)
                .toString();
    }
}