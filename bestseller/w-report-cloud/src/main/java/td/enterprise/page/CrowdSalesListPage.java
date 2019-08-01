package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>店员名单表 CrowdSalesListPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CrowdSalesListPage extends BasePage {

	private Integer id;
	private Integer projectId;
	private String deviceMac;
	private Integer source;
	private Integer status;
	private String createBy;
	private String creator;
	private Date createTime;
	private String updateBy;
	private String updater;
	private Date updateTime;
	private String filterReason;

}
