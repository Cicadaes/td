package td.enterprise.entity;


import java.sql.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class UmDepartment {

	 private int rid;
	 private String opUmid;
	 private String deptCode;
	 private String deptName;
	 private String deptDesc;
	 private int tenantId;
	 private int parentRid;
	 private Date createTime;
	 private Date updateTime;
	 
}
