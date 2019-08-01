package com.talkingdata.marketing.core.entity.thirdmodel.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * The type Funnel event param.
 * @author xiaoming.kang
 * @create 2017 -05-04-上午11:20
 * @since JDK 1.8
 */
@Component
public class FunnelEventParam {

    @Value("${funnel_event_phy_table_code}")
    private String phyTableCode;

    @Value("${funnel_event_phy_table_column}")
    private String phyTableColumn;

    /**
     * Gets phy table code.
     *
     * @return the phy table code
     */
    public String getPhyTableCode() {
        return phyTableCode;
    }

    /**
     * Sets phy table code.
     *
     * @param phyTableCode the phy table code
     */
    public void setPhyTableCode(String phyTableCode) {
        this.phyTableCode = phyTableCode;
    }

    /**
     * Gets phy table column.
     *
     * @return the phy table column
     */
    public String getPhyTableColumn() {
        return phyTableColumn;
    }

    /**
     * Sets phy table column.
     *
     * @param phyTableColumn the phy table column
     */
    public void setPhyTableColumn(String phyTableColumn) {
        this.phyTableColumn = phyTableColumn;
    }

    @Override
    public String toString() {
        return "FunnelEventParam{" +
                "phyTableCode='" + phyTableCode + '\'' +
                ", phyTableColumn='" + phyTableColumn + '\'' +
                '}';
    }
}
