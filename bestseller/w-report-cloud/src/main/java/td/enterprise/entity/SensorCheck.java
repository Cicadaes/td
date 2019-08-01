package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 
 * <br>
 * <b>功能：</b>探针检测配置 SensorCheckEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */

@Getter
@Setter
@ToString
public class SensorCheck extends BaseEntity {

	//唯一标识
	private Integer id;
	//手机MAC
	private String mac;
	//探针MAC
	private String apMac;
}

