package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：坪效指标返回结果</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectDensityVM implements Comparable<ProjectDensityVM> {
    private Integer projectId;
    private String projectName;
    private Double value;

    @Override
    public int compareTo(ProjectDensityVM o) {
        if (null == this.getValue() || o.getValue() == null) {
            return 0;
        }
        return o.getValue().compareTo(this.getValue());
    }


}
