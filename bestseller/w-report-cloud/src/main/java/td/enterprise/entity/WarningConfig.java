package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>预警通知接收设置表 WarningConfigEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-07-07 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class WarningConfig extends BaseEntity {
	
	private Integer id;
	private String tenantId;
	private Integer sendTenantAdmin;
	private Integer sendPrincipal;
	private Integer sendMail;
	private Integer sendSms;
	private String healthRate;
	private String sensorsNolog;
	private String sensorNolog;
	private Integer type;
	private Integer status;

}

