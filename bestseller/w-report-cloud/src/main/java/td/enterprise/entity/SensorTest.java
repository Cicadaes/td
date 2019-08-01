package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>探针信号强度测试表 SensorTestEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-07-19 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class SensorTest extends BaseEntity {
	
	private Integer id;
	private String tenantId;
	private Integer projectId;
	private Integer sensorId;
	private String dataJson;
	private Integer status;

}

