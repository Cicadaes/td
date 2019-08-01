package td.enterprise.wanalytics.model;

/**
 * Created by Yan on 2017/3/30.
 */
import java.util.List;

public class JsonData {
    private String version;
    private String datatype;
    private int ts;
    private List<String> data;
    public JsonData() {
    }
    public String getVersion() {
        return this.version;
    }
    public void setVersion(String version) {
        this.version = version;
    }
    public String getDatatype() {
        return this.datatype;
    }
    public void setDatatype(String datatype) {
        this.datatype = datatype;
    }
    public int getTs() {
        return this.ts;
    }
    public void setTs(int ts) {
        this.ts = ts;
    }
    public List<String> getData() {
        return this.data;
    }
    public void setData(List<String> data) {
        this.data = data;
    }
}
