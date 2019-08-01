package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>排行榜表 CityPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-24 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CityPage extends BasePage {

	private Integer id;
	private String code;
	private String city;
	private Integer level;
	private String pcode;
	private String province;
	private Date updateTime;

}
