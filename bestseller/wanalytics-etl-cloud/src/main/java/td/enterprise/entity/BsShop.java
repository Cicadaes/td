package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>绫致店铺 BsShopEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-11-23 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class BsShop extends BaseEntity {
	
	private Integer id;
	private String shopId;
	private String shopCode;
	private String shopName;
	private String province;
	private String city;
	private String area;
	private String address;
	private String phone;
	private String scenarioName;
	private String brand;
	private String shopStatus;
	private Date createTime;
	private Date updateTime;
	private String runDate;
	private String shopSize;

}

