package com.talkingdata.analytics.wifi.collector.databean.offline;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by loong on 4/22/16.
 */
public class UserMacData {
    private List<String> userMacRssi;

    public UserMacData() {
        this.userMacRssi = new ArrayList();
    }

    public UserMacData(List<String> userMacRssi) {
        this.userMacRssi = userMacRssi;
    }

    public List<String> getUserMacRssi() {
        return this.userMacRssi;
    }

    public void setUserMacRssi(List<String> userMacRssi) {
        this.userMacRssi = userMacRssi;
    }

    public String toString() {
        StringBuffer sb = new StringBuffer("UserMacData{");
        sb.append("userMacRssi=").append(this.userMacRssi);
        sb.append('}');
        return sb.toString();

    }
}
