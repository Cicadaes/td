package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>绫致店铺设备关系 BsDevApEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-11-23 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class BsDevAp extends BaseEntity {
	
	private Integer id;
	private String apSn;
	private String apIp;
	private String apName;
	private String apModel;
	private String apVersion;
	private Integer apStatus;
	private Integer apOnlineTime;
	private String apMac;
	private String acSn;
	private Date createTime;
	private Date updateTime;
	private String runDate;

}

