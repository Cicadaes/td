package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>房间分类表 RoomCategoryEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-07-19 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class RoomCategory extends BaseEntity {

    private Integer id;
    private String code;
    private String name;
    private String tenantId;

}

