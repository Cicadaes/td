package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
public class CrowdBlackListVM {

    private Integer id;
    private Integer projectId;
    private String deviceMac;
    private Integer source;
    private Integer status;
    private String tenantId;
    private String filterReason;//过滤原因
    private Long createTimestamp;
    private Long updateTimestamp;

}

