package td.enterprise.wanalytics.etl.bean;

import java.io.Serializable;

/**
 * wifi数据格式实体类,字段含义详见文档说明
 * Created by loong on 4/15/16.
 */
public class WiFiDataEntity implements Serializable {
    private String version;
    private String devtype;
    private String keytype;
    private long tsreceive;
    private WifiData wifidata;


    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getDevtype() {
        return devtype;
    }

    public void setDevtype(String devtype) {
        this.devtype = devtype;
    }

    public String getKeytype() {
        return keytype;
    }

    public void setKeytype(String keytype) {
        this.keytype = keytype;
    }

    public WifiData getWifidata() {
        return wifidata;
    }

    public void setWifidata(WifiData wifidata) {
        this.wifidata = wifidata;
    }

    public long getTsreceive() {
        return tsreceive;
    }

    public void setTsreceive(long tsreceive) {
        this.tsreceive = tsreceive;
    }

    @Override
    public String toString() {
        return "WiFiDataEntity{" +
                "version='" + version + '\'' +
                ", devtype='" + devtype + '\'' +
                ", keytype='" + keytype + '\'' +
                ", tsreceive=" + tsreceive +
                ", wifidata=" + wifidata +
                '}';
    }
}
