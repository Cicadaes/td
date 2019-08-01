package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>Azkaban任务配置表 AzkabanJobConfigPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-19 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class AzkabanJobConfigPage extends BasePage {

    private Integer id;
    private String projectName;
    private String projectDesc;
    private String jobFilePath;
    private String flowName;
    private String scheduleTime;
    private String scheduleDate;
    private String isRecurring;
    private String recurringPeriod;
    private Integer status;

}