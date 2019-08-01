package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>绫致店铺设备关系 BsDeviceRltEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-11-23 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class BsDeviceRlt extends BaseEntity {
	
	private Integer id;
	private String devSn;
	private String devModel;
	private String shopId;
	private String devType;
	private String aliasname;
	private Date createTime;
	private Date updateTime;
	private String runDate;

}

