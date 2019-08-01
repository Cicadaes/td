package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>App清单数据 AppInfoEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-09 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class AppInfo extends BaseEntity {

    private Integer id;
    private String appHash;
    private String appName;
    private String appVersion;
    private String platform;
    private String appIcon;
    private Integer source;
    private Integer status;

    private String type_id;
    private String type_name;

    public String getType_id() {
        return type_id;
    }

    public void setType_id(String type_id) {
        this.type_id = type_id;
    }

    public String getType_name() {
        return type_name;
    }

    public void setType_name(String type_name) {
        this.type_name = type_name;
    }

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAppHash() {
        return this.appHash;
    }

    public void setAppHash(String appHash) {
        this.appHash = appHash;
    }

    public String getAppName() {
        return this.appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getAppVersion() {
        return this.appVersion;
    }

    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }

    public String getPlatform() {
        return this.platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getAppIcon() {
        return this.appIcon;
    }

    public void setAppIcon(String appIcon) {
        this.appIcon = appIcon;
    }

    public Integer getSource() {
        return this.source;
    }

    public void setSource(Integer source) {
        this.source = source;
    }

    public Integer getStatus() {
        return this.status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

}

