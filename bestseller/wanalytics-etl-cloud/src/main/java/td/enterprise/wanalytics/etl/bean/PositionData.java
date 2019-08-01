package td.enterprise.wanalytics.etl.bean;


/**
 * 标签通用类
 * @author junmin.li
 *
 */
public class PositionData   {

	private String tdid;
	private String month;
	private String latlng;

	public String getTdid() {
		return tdid;
	}

	public void setTdid(String tdid) {
		this.tdid = tdid;
	}

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public String getLatlng() {
		return latlng;
	}

	public void setLatlng(String latlng) {
		this.latlng = latlng;
	}

}
