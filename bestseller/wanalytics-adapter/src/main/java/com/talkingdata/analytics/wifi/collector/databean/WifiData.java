package com.talkingdata.analytics.wifi.collector.databean;

import java.io.Serializable;
import java.util.List;

import lombok.Builder;
import lombok.Data;

/**
 * Created by loong on 4/22/16.
 */
@Data
@Builder
public class WifiData implements Serializable {

    private static final long serialVersionUID = 4743133441029584923L;

    private String            apmac;
    private int               num;
    private long              tssend;
    private List<WifiTa>      wifitalist;

    @Override
    public boolean equals(Object obj) {
        StringBuilder sb = new StringBuilder();
        sb.append(this.apmac);
        sb.append(this.tssend);

        WifiData line2Obj = (WifiData) obj;
        StringBuilder sb2Obj = new StringBuilder();
        sb2Obj.append(line2Obj.apmac);
        sb2Obj.append(line2Obj.tssend);

        return sb.toString().equals(sb2Obj.toString());
    }

    @Override
    public int hashCode() {
        StringBuilder sb = new StringBuilder();
        sb.append(this.apmac);
        sb.append(this.tssend);
        return sb.toString().hashCode();
    }

}
