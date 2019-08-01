package td.enterprise.wanalytics.etl.bean;

import java.io.Serializable;
import java.util.List;

/**
 * Created by loong on 4/22/16.
 */
public class WifiTa implements Serializable {
    private String rssi;
    private String mac;
    private String mactype;
    private List<TaEvent> taevent;
    private int dist;
    private long duringstart;
    private long duringend;
    private int packetnumup;
    private int packetnumdown;
    private int volumeup;
    private int volumedown;
    private int authidtype;
    private String authid;
    private String tatype;
    private String tabrand;
    private String tasystem;
    private String applicationlist;
    private String urllist;
    private String dns;

    public WifiTa() {
    }

    public String getRssi() {
        return rssi;
    }

    public void setRssi(String rssi) {
        this.rssi = rssi;
    }

    public String getMac() {
        return mac;
    }

    public void setMac(String mac) {
        this.mac = mac;
    }

    public List<TaEvent> getTaevent() {
        return taevent;
    }

    public void setTaevent(List<TaEvent> taevent) {
        this.taevent = taevent;
    }

    public int getDist() {
        return dist;
    }

    public void setDist(int dist) {
        this.dist = dist;
    }

    public long getDuringstart() {
        return duringstart;
    }

    public void setDuringstart(long duringstart) {
        this.duringstart = duringstart;
    }

    public long getDuringend() {
        return duringend;
    }

    public void setDuringend(long duringend) {
        this.duringend = duringend;
    }

    public int getPacketnumup() {
        return packetnumup;
    }

    public void setPacketnumup(int packetnumup) {
        this.packetnumup = packetnumup;
    }

    public int getPacketnumdown() {
        return packetnumdown;
    }

    public void setPacketnumdown(int packetnumdown) {
        this.packetnumdown = packetnumdown;
    }

    public int getVolumeup() {
        return volumeup;
    }

    public void setVolumeup(int volumeup) {
        this.volumeup = volumeup;
    }

    public int getVolumedown() {
        return volumedown;
    }

    public void setVolumedown(int volumedown) {
        this.volumedown = volumedown;
    }

    public int getAuthidtype() {
        return authidtype;
    }

    public void setAuthidtype(int authidtype) {
        this.authidtype = authidtype;
    }

    public String getAuthid() {
        return authid;
    }

    public void setAuthid(String authid) {
        this.authid = authid;
    }

    public String getTatype() {
        return tatype;
    }

    public void setTatype(String tatype) {
        this.tatype = tatype;
    }

    public String getTabrand() {
        return tabrand;
    }

    public void setTabrand(String tabrand) {
        this.tabrand = tabrand;
    }

    public String getTasystem() {
        return tasystem;
    }

    public void setTasystem(String tasystem) {
        this.tasystem = tasystem;
    }

    public String getApplicationlist() {
        return applicationlist;
    }

    public void setApplicationlist(String applicationlist) {
        this.applicationlist = applicationlist;
    }

    public String getUrllist() {
        return urllist;
    }

    public void setUrllist(String urllist) {
        this.urllist = urllist;
    }

    public String getDns() {
        return dns;
    }

    public void setDns(String dns) {
        this.dns = dns;
    }

    public String getMactype() {
        return mactype;
    }

    public void setMactype(String mactype) {
        this.mactype = mactype;
    }

    @Override
    public String toString() {
        return "WifiTa{" +
                "rssi='" + rssi + '\'' +
                ", mac='" + mac + '\'' +
                ", mactype='" + mactype + '\'' +
                ", taevent=" + taevent +
                ", dist=" + dist +
                ", duringstart=" + duringstart +
                ", duringend=" + duringend +
                ", packetnumup=" + packetnumup +
                ", packetnumdown=" + packetnumdown +
                ", volumeup=" + volumeup +
                ", volumedown=" + volumedown +
                ", authidtype=" + authidtype +
                ", authid='" + authid + '\'' +
                ", tatype='" + tatype + '\'' +
                ", tabrand='" + tabrand + '\'' +
                ", tasystem='" + tasystem + '\'' +
                ", applicationlist='" + applicationlist + '\'' +
                ", urllist='" + urllist + '\'' +
                ", dns='" + dns + '\'' +
                '}';
    }
}
