package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>竞品数据源 CompeteSourcePage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-07-25 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CompeteSourcePage extends BasePage {

	private Integer id;
	private String tenantId;
	private Integer projectId;
	private String dataSource;
	private String remark;
	private Integer status;
	private String attachmentId;
	private String attachmentSource;
	private String creator;
	private String createBy;
	private Date createTime;
	private String updater;
	private String updateBy;
	private Date updateTime;

}
