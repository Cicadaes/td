package td.enterprise.wanalytics.etl.bean;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Setter
@Getter
@ToString
public class DmkTag {

	private Integer id;
	private String mac;
	private String tdid;
	private String weight;
	private String name;
	private String label;
	private String tagType;
	private Date syncDate;
	private String dmkCode;
	private String dmkMsg;
	private String dmkSeq;
	private Date createTime;

}

