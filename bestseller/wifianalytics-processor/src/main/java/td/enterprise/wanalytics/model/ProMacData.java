package td.enterprise.wanalytics.model;

/**
 * Created by Yan on 2017/3/30.
 */

public class ProMacData {
    private byte version;
    private byte flag;
    private short len;
    private short time;
    private String apMac;
    private int uxStamp;
    private int userMacNum;
    public ProMacData() {
    }
    public ProMacData(byte version, byte flag, short len, short time, String apMac, int uxStamp, int userMacNum) {
        this.version = version;
        this.flag = flag;
        this.len = len;
        this.time = time;
        this.apMac = apMac;
        this.uxStamp = uxStamp;
        this.userMacNum = userMacNum;
    }
    public byte getVersion() {
        return this.version;
    }
    public void setVersion(byte version) {
        this.version = version;
    }
    public byte getFlag() {
        return this.flag;
    }
    public void setFlag(byte flag) {
        this.flag = flag;
    }
    public short getLen() {
        return this.len;
    }
    public void setLen(short len) {
        this.len = len;
    }
    public short getTime() {
        return this.time;
    }
    public void setTime(short time) {
        this.time = time;
    }
    public String getApMac() {
        return this.apMac;
    }
    public void setApMac(String apMac) {
        this.apMac = apMac;
    }
    public int getUxStamp() {
        return this.uxStamp;
    }
    public void setUxStamp(int uxStamp) {
        this.uxStamp = uxStamp;
    }
    public int getUserMacNum() {
        return this.userMacNum;
    }
    public void setUserMacNum(int userMacNum) {
        this.userMacNum = userMacNum;
    }
    public String toString() {
        StringBuffer sb = new StringBuffer("Wifi{");
        sb.append("version=").append(this.version);
        sb.append(", flag=").append(this.flag);
        sb.append(", len=").append(this.len);
        sb.append(", time=").append(this.time);
        sb.append(", apMac=\'").append(this.apMac).append('\'');
        sb.append(", uxStamp=").append(this.uxStamp);
        sb.append(", userMacNum=").append(this.userMacNum);
        sb.append('}');
        return sb.toString();
    }
}
