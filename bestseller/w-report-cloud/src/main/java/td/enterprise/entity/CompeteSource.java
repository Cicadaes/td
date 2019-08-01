package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>竞品数据源 CompeteSourceEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-07-25 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CompeteSource extends BaseEntity {
	
	private Integer id;
	private String tenantId;
	private Integer projectId;
	private String dataSource; //1黑名单，3WIFI来来，4MAC数据上传
	private String remark;
	private Integer status;
	private String attachmentId;
	private String attachmentSource;

}

