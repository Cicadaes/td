package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>变更历史表 ChangeLogPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-06-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ChangeLogPage extends BasePage {

	private Integer id;
	private String tableName;
	private String moduleId;
	private String beforeValue;
	private String afterValue;
	private Integer status;
	private String createBy;
	private String creator;
	private Date createTime;
	private String updateBy;
	private String updater;
	private Date updateTime;

}
