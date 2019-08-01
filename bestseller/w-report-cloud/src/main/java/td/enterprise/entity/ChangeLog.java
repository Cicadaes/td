package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>变更历史表 ChangeLogEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-06-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ChangeLog extends BaseEntity {
	
	private Integer id;
	private String tableName;
	private String moduleId;
	private String beforeValue;
	private String afterValue;
	private Integer status;

}

