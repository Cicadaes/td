package td.enterprise.entity;


import java.sql.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Setter
@Getter
@ToString
public class UmDeptUser {
	private int deptRid;
	private int rid;
	private int userRid;
	private String userType;
	private Date createTime;
	private Date updateTime;
	private String opUmid;

}
