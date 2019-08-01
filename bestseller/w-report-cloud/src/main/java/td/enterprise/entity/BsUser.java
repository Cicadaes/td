package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>用户表 BsUserEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2018-01-03 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class BsUser extends BaseEntity {
	
	private Integer id;
	private String userId;
	private String name;
	private String kySign;
	private String groupSign;
	private String logicalCityCode;
	private String department;
	private String position;
	private String logicalCity;
	private String brandFullName;
	private String brandShortName;
	private Date syncDate;
	private String email;
	private String tenantSign;
	private String shopCode;
	private String userSign;

}

