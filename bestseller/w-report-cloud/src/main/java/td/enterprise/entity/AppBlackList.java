package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>App黑名单 AppBlackListEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-06-20 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class AppBlackList extends BaseEntity {

    private Integer id;
    private String appHash;
    private String appName;
    private String appVersion;
    private String platform;
    private Integer source;
    private Integer status;
    private String tenantId;

}

