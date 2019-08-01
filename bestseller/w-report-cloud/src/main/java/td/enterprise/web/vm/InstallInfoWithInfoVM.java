package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.entity.BaseEntity;

import java.util.Map;

/**
 * <br>
 * <b>功能：</b>探针信息 SensorInstallInfoEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-03 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class InstallInfoWithInfoVM extends BaseEntity {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer projectPlaceId;
    private Integer relatedId;
    private Integer relatedType;
    private String relatedAttribute;
    private String longitude;
    private String latitude;
    private String description;
    private Integer status;

    private Map basis;
    private Map link;

    private String startDate;
    private String endDate;
    private String startBeforeDate;
    private String endBeforeDate;

    private String name;
    private String code;

}

