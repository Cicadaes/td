package td.enterprise.wanalytics.etl.bean;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class DmkDevice {

	private Integer id;
	private String mac;
	private String tdid;
	private String originModel;
	private String standardModel;
	private String standardBrand;
	private String deviceType;
	private String screen;
	private String price;
	private String functionType;
	private String hardwareType;
	private Date syncDate;
	private String dmkCode;
	private String dmkMsg;
	private String dmkSeq;
	private Date createTime;
	private String timeTomarket;
}

