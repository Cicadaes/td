package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>批量设置 ProjectBatchConfigPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-19 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */

@Setter
@Getter
@ToString
public class ProjectBatchConfigPage extends BasePage {

    private Integer id;
    private String projectId;
    private String projectName;
    private String projectNum;
    private String city;
    private String customLabel;
    private String blackList;
    private String thresholdValue;
    private String theme;
    private Integer status;
    private String createBy;
    private String creator;
    private Date createTime;
    private String updateBy;
    private String updater;
    private Date updateTime;

    private List<String> projectIds;

}
