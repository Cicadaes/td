package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>UM用户表 UmUserEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-12-12 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class UmUser extends BaseEntity {
	
	private Integer rid;
	private String umid;
	private String userName;
	private String userPassword;
	private String userDesc;
	private String gender;
	private Date birthday;
	private String email;
	private String telphone;
	private String mobile;
	private String title;
	private Integer departmentId;
	private String departmentName;
	private Integer status;
	private Date createTime;
	private Date updateTime;
	private String opUmid;
	private Integer tenantId;
	private String proxyUmid;

}

