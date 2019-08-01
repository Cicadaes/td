package td.enterprise.wanalytics.etl.bean;

import java.io.Serializable;
import java.util.List;

/**
 * Created by loong on 4/22/16.
 */
public class WifiData implements Serializable {
    private String apmac;
    private int num;
    private long tssend;
    private List<WifiTa> wifitalist;

    public String getApmac() {
        return apmac;
    }

    public void setApmac(String apmac) {
        this.apmac = apmac;
    }

    public int getNum() {
        return num;
    }

    public void setNum(int num) {
        this.num = num;
    }

    public long getTssend() {
        return tssend;
    }

    public void setTssend(long tssend) {
        this.tssend = tssend;
    }

    public List<WifiTa> getWifitalist() {
        return wifitalist;
    }

    public void setWifitalist(List<WifiTa> wifitalist) {
        this.wifitalist = wifitalist;
    }

    @Override
    public String toString() {
        return "WifiData{" +
                "apmac='" + apmac + '\'' +
                ", num=" + num +
                ", tssend=" + tssend +
                ", wifitalist=" + wifitalist +
                '}';
    }
}
