package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>项目月度跨店老客 OfflineCrossOldUserMonthEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class OfflineCrossOldUserMonth {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private String month;
    private Integer crossUsers;
    private Date updateTime;

}

