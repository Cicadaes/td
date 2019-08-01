package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.util.Date;
import java.lang.String;
import java.lang.Boolean;

/**
 * <br>
 * <b>功能：</b>人群热力图 ProjectHeatMapEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-11 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectHeatMap extends BaseEntity {
	
	private Integer id;
	private Integer projectId;
	private Date timestamp;
	private String date;
	private String hour;
	private String mac;
	private String coordinates;
	private Boolean inRoom;
	private double x; // 横坐标
	private double y; // 纵坐标
}

