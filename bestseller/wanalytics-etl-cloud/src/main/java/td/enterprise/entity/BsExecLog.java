package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>绫致店铺接口执行日志表 BsExecLogEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-16 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class BsExecLog extends BaseEntity {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer id;
	private String url;
	private String name;
	private String code;
	private String term;
	private Integer isRerun;
	private Integer execResult;
	private Date createTime;
	private Date updateTime;

}

