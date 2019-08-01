package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>租户 TenantEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-30 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class Tenant extends BaseEntity {

    private Integer id;
    private String umTenantId;
    private String tenantId;
    private String tenantName;
    private Integer type;
    private String company;
    private String contacter;
    private String contact;
    private String description;
    private String fullName;
    private Date loginTime;

}

