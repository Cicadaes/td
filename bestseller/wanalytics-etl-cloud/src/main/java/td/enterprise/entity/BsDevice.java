package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>绫致店铺设备关系 BsDeviceEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-11-23 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class BsDevice extends BaseEntity {
	
	private Integer id;
	private String devSn;
	private String devName;
	private String devHardVersion;
	private String devSoftVersion;
	private String devMode;
	private String devType;
	private Integer devOnlineTime;
	private String devLocationProvince;
	private String devLocationCity;
	private String devLocationCountry;
	private String devAddress;
	private String devMac;
	private Integer memoryTotalSize;
	private Integer diskTotalSize;
	private String devStatus;
	private Date createTime;
	private Date updateTime;
	private String runDate;

}

