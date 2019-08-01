package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.entity.ProjectIndex;

/**
 * <br>
 * <b>功能：</b>项目指标 ProjectIndexEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-29 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectIndexVM extends ProjectIndex{

    private String longitude;
    private String latitude;

    private String absSevenChain;//绝对值
    private String absThirtyChain;//绝对值

    private Integer favorite;

}

