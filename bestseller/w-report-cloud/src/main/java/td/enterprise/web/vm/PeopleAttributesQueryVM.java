package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：人口属性查询对象</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class PeopleAttributesQueryVM {
    private String startDate;
    private String endDate;
    private Integer projectId;
    private Integer sexscalelimit;//性别2
    private Integer agedistributelimit;//年龄分布6
    private Integer crowdId;
    private Integer compareCrowdId;//对比人群id

    private String execId; //azkaban 任务执行Id

}
