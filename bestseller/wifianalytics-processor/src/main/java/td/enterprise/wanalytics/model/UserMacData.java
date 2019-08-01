package td.enterprise.wanalytics.model;

/**
 * Created by Yan on 2017/3/30.
 */
import java.util.ArrayList;
import java.util.List;

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
