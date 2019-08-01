package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>店铺黑名单 StoreBlackListEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-04 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class StoreBlackList extends BaseEntity {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private String storeName;
    private Integer storeType;
    private Integer source;
    private Integer status;

}

