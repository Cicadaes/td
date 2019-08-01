package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>竞品项目属性 CompeteAttributePage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-01 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CompeteAttributePage extends BasePage {

	private Integer id;
	private String tenantId;
	private Integer competeId;
	private String dataSources;
	private Integer status;
	private String startDate;
	private String endDate;
	private String creator;
	private String createBy;
	private Date createTime;
	private String updater;
	private String updateBy;
	private Date updateTime;

}