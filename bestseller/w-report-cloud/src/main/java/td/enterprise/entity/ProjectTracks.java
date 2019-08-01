package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>路径分析表 RelevancyAnalysissEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-07-24 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectTracks {

    private String projectId;
    private String projectName;
    private double times;
    private String percent;
    private boolean flag;
}
