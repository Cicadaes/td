package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;

/**
 * <br>
 * <b>功能：</b>人群黑名单 CrowdBlackListEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class CrowdBlackList extends BaseEntity {

    private Integer id;
    private Integer projectId;
    private String deviceMac;
    private Integer source;
    private Integer status;
    private String tenantId;
    private String filterReason;//过滤原因
    //创建人账号
    private String createBy;

    //创建人
    private String creator;

    //修改人账号
    private String updateBy;

    //修改人
    private String updater;

    //创建时间
    private Timestamp createTime;

    //修改时间
    private Timestamp updateTime;
}

