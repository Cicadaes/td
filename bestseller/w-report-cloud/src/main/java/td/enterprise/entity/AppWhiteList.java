package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>App白名单 AppWhiteListEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-29 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class AppWhiteList extends BaseEntity {

    private Integer id;
    private String appHash;
    private String appName;
    private String appVersion;
    private String platform;
    private Integer source;
    private Integer status;
    private String tenantId;

    @Override
    public boolean equals(Object obj) {
        if (null == obj)
            return false;
        if (this.getClass() != obj.getClass())
            return false;
        //根据app hash 和 platform 进行判断是相等
        String value1 = this.appHash + this.platform;
        AppWhiteList dest = (AppWhiteList) obj;
        String value2 = dest.getAppHash() + dest.getPlatform();
        return value1.equals(value2);
    }

    @Override
    public int hashCode() {
        String hash = this.appHash + this.platform;
        return hash.hashCode();
    }

}

