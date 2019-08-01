package td.enterprise.wanalytics.processor.bean;

/**
 * 移动mac和公司名称
 * @author junmin.li
 *
 */
public class MacCompany {
    
    private String mac;
    private String company;
    private int is_moblile ;//1表示是移动mac地址，非1表示否
    
    public String getMac() {
        return mac;
    }
    public void setMac(String mac) {
        this.mac = mac;
    }
    public String getCompany() {
        return company;
    }
    public void setCompany(String company) {
        this.company = company;
    }
    public int getIs_moblile() {
        return is_moblile;
    }
    public void setIs_moblile(int is_moblile) {
        this.is_moblile = is_moblile;
    }

}
