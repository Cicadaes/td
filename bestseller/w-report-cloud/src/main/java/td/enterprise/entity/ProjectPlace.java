package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>项目区域 ProjectPlaceEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class ProjectPlace extends BaseEntity {

    private Integer id;
    private String placeName;
    private Integer orderNumber;
    private Integer projectId;
    private Integer diagramId;
    private String diagramName;
    private String description;
    private String tenantId;
    private int status;
    private String picUrl;

}

