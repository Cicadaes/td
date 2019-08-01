package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>安装归属表 InstallInfoPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-05-11 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class InstallInfoPage extends BasePage {

	private Integer id;
	private String tenantId;
	private Integer projectId;
	private Integer projectPlaceId;
	private Integer relatedId;
	private Integer relatedType;
	private String relatedAttribute;
	private String longitude;
	private String latitude;
	private String description;
	private Integer status;
	private String customizedInfo;

	private String startDate;
	private String endDate;
}
