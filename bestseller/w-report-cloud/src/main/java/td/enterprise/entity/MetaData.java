package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>元数据信息表 MetaDataEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-09 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class MetaData extends BaseEntity {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer roomId;
    private String dataType;
    private String dataValue;

}

