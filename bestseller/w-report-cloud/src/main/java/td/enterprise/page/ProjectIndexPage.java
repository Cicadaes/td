package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>项目指标 ProjectIndexPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-29 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectIndexPage extends BasePage {

    private Integer id;
    private Integer projectId;
    private String projectName;
    private Integer projectType;
    private String projectNum;
    private Integer status;
    private Integer todayFlow;
    private Integer sevenDaysFlow;
    private Integer thirtyDaysFlow;
    private Integer sevenChain;
    private Integer thirtyChain;

    private Integer sensorNum;
    private Double healthRate;
    private Double noLogDuration;
    private Double thirtyNoLogDuration;
    private Integer ssidCount;
    private Integer roomCount;

    private List<String> projectIds;
    //1全部 2收藏
    private int userRelationType;
    //登录账号
    private String umid;
}
