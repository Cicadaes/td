package td.enterprise.page;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 
 * <br>
 * <b>功能：</b>探针检测配置 SensorCheckLogPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class SensorCheckLogPage extends BasePage {

	private Integer id;
	private String mac;
	private String apMac;
	private String time;
	private String signal;

}
