package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>项目属性表 ProjectAttributePage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-06-12 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectAttributePage extends BasePage {

	private Integer id;
	private Integer projectId;
	private String principal;
	private String position;
	private String department;
	private String email;
	private String phone1;
	private String phone2;
	private Integer type;
	private Integer status;

}
