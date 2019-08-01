package td.enterprise.wanalytics.etl.bean;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class AppTypes {

	private Integer id;
	private String parentId;
	private String type;
	private String typeEn;
	private String tagRef;
	private String seq;
	private Date createTime;
	private String updater;
	private String updateBy;
	private Date updateTime;

}

