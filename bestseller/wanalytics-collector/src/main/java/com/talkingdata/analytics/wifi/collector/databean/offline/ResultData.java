package com.talkingdata.analytics.wifi.collector.databean.offline;

/**
 * Created by loong on 4/22/16.
 */
public class ResultData {
    private String apInfo;
    private UserMacData userMacData;

    public ResultData(String apInfo, UserMacData userMacData) {
        this.apInfo = apInfo;
        this.userMacData = userMacData;
    }

    public String getApInfo() {
        return this.apInfo;
    }

    public void setApInfo(String apInfo) {
        this.apInfo = apInfo;
    }

    public UserMacData getUserMacData() {
        return this.userMacData;
    }

    public void setUserMacData(UserMacData userMacData) {
        this.userMacData = userMacData;
    }

    public String toString() {
        StringBuffer sb = new StringBuffer("ResultData{");
        sb.append("apInfo=\'").append(this.apInfo).append('\'');
        sb.append(", userMacData=").append(this.userMacData);
        sb.append('}');
        return sb.toString();
    }
}
